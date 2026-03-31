# Context Management Improvements — Implementation Plan

**Goal:** Implement two research-backed context management improvements to `graph.ts`:
1. **Observation Masking** — replace hard message truncation with selective tool-output compression
2. **Living Anchor Memory** — replace static `project_manifest.json` with a per-iteration structured session state (`dev_memory.json`)

---

## Background: Current vs. Target

| Dimension | Current | Target |
|---|---|---|
| Truncation | Drop oldest messages entirely past 80 | Keep AI reasoning, mask old tool outputs |
| Session memory | Static `project_manifest.json` (written once by PM, never updated) | `dev_memory.json` updated by Developer each iteration |
| Context passed into Developer | Full `state.messages` with raw tool payloads | Masked messages + pinned anchor |

**`project_manifest.json` is kept** — it serves a different, static role (naming rules, scaffold constraints). `dev_memory.json` is additive, not a replacement:
- `project_manifest.json` = static scaffold rules written once by PM, never modified
- `dev_memory.json` = dynamic session state, updated after each Developer iteration

---

## Change 1: Observation Masking

### What
Replace `trimMessages` with `maskMessages`. Instead of dropping old messages, replace the *content* of old `ToolMessage` and large `HumanMessage` observations with a one-line stub. `AIMessage` reasoning is always kept verbatim.

### Why
JetBrains research (SWE-bench validated): masking old observations while preserving the reasoning trace outperforms summarization and is cheaper than keeping everything. Achieves 10:1 compression on tool outputs without losing the thought chain.

### Implementation

**Add `DevMemory` interface and helpers at the top of `graph.ts`** (before node functions):

```ts
interface DevMemory {
    intent: string;
    components_completed: string[];
    design_decisions: string[];
    known_issues: string[];
    next_steps: string[];
}

const getContentString = (m: BaseMessage): string => {
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) {
        return (m.content as Array<{type: string; text?: string}>)
            .filter(b => b.type === "text")
            .map(b => b.text ?? "")
            .join("\n");
    }
    return "";
};
```

> `getContentString` is needed because Claude returns `content` as `[{type: "text", text: "..."}]`, not a plain string. Without this, the large-observation check silently skips all Claude `AIMessage` and `HumanMessage` objects.

**Replace `trimMessages` entirely with `maskMessages`:**

```ts
const OBSERVATION_STUB = (name: string) =>
    `[Tool output from '${name}' — omitted to save context. Re-invoke the tool if you need this output again.]`;

const maskMessages = (msgs: BaseMessage[], max: number): BaseMessage[] => {
    if (msgs.length <= max) return msgs;

    // Always keep the first message pinned (initial human prompt / seed)
    const first = msgs[0];

    // Find the anchor message by metadata tag (NOT content search — avoids false positives
    // when the LLM echoes "DEV_MEMORY" in its own reasoning messages)
    const pinnedAnchor = msgs.find(m => m.additional_kwargs?.__anchor === true);

    // Recent window: always kept verbatim. Fixed at 30 messages.
    // This covers ~5-7 tool call/response cycles without aggressive trimming.
    const RECENT_WINDOW = 30;
    const oldMsgs = msgs.slice(1, msgs.length - RECENT_WINDOW);
    const recentMsgs = msgs.slice(msgs.length - RECENT_WINDOW);

    // Mask old observations — keep AI reasoning, compress tool outputs and large QA blobs
    const maskedOld = oldMsgs.map(m => {
        const type = m._getType?.();

        // ToolMessage → always mask (10:1 compression)
        if (type === "tool") {
            const tm = m as any;
            return new ToolMessage({
                content: OBSERVATION_STUB(tm.name ?? "tool"),
                name: tm.name,
                tool_call_id: tm.tool_call_id
            });
        }

        // HumanMessage with large content → mask QA feedback blobs
        // (QA errors are already re-injected into the system prompt as errorContext)
        if (type === "human" && getContentString(m).length > 500) {
            return new HumanMessage(
                `[Previous QA/tool feedback — omitted. Current errors are in the system prompt.]`
            );
        }

        // AIMessage → always keep verbatim (preserves reasoning chain)
        return m;
    });

    // Drop any leading ToolMessage from maskedOld that would be orphaned.
    // Anthropic rejects a ToolMessage without a preceding AIMessage with tool_calls.
    while (maskedOld.length > 0 && maskedOld[0]._getType?.() === "tool") {
        maskedOld.shift();
    }

    // Reassemble: pinned first + anchor (if not already in recent window) + masked old + recent verbatim
    const result: BaseMessage[] = [first];
    if (pinnedAnchor && !recentMsgs.includes(pinnedAnchor)) {
        result.push(pinnedAnchor);
    }
    result.push(...maskedOld, ...recentMsgs);
    return result;
};
```

**In the Developer loop** (line ~373), replace:
```ts
currentMessages = trimMessages(currentMessages, 80);
```
with:
```ts
currentMessages = maskMessages(currentMessages, 80);
```

**Delete** the old `trimMessages` function.

---

## Change 2: Living Anchor Memory (`dev_memory.json`)

### What
A structured JSON file written to the sandbox at the end of each Developer node iteration. It captures key session state that must survive context masking. The PM node seeds it; the Developer node reads and updates it each iteration.

### Why
Lovable uses a "Knowledge File" as external long-term memory. Base44 uses structured per-file anchors. A small (~500 token) JSON that pins intent, completed work, and next steps is far more signal-dense than hoping the right messages survive the sliding window.

### File shape: `dev_memory.json`

```json
{
  "intent": "Hebrew landing page for a plumbing business — modern premium design",
  "components_completed": ["App.tsx", "Navbar.tsx", "Hero.tsx", "Footer.tsx"],
  "design_decisions": [
    "Glassmorphism cards with backdrop-blur-md",
    "Framer-motion stagger on all sections",
    "Dark gradient background (slate-900 to purple-900)"
  ],
  "known_issues": [],
  "next_steps": ["Add Services section", "Fix mobile navbar collapse"]
}
```

### Step A — PM node seeds `dev_memory.json`

At the end of `productManagerNode` (after the existing `project_manifest.json` write):

```ts
const initialMemory: DevMemory = {
    intent: typeof state.businessInput === "string"
        ? state.businessInput
        : JSON.stringify(state.businessInput),
    components_completed: [],
    design_decisions: [],
    known_issues: [],
    next_steps: ["Build initial component structure per spec.md"]
};
await tools.writeFile(state.sandboxPath, "dev_memory.json", JSON.stringify(initialMemory, null, 2));
```

### Step B — Developer node reads anchor at start

At the top of `developerNode`, after the `spec` read:

```ts
let devMemory: DevMemory = {
    intent: "",
    components_completed: [],
    design_decisions: [],
    known_issues: [],
    next_steps: []
};
try {
    const memRaw = await tools.readFile(state.sandboxPath, "dev_memory.json");
    if (!memRaw.startsWith("Error")) {
        devMemory = JSON.parse(memRaw);
    }
} catch { /* use defaults — non-blocking */ }
```

Inject into the system prompt as a dedicated section (appended to `devPrompt`):

```ts
const memoryContext = `

## SESSION MEMORY (Your persistent context across iterations)
\`\`\`json
${JSON.stringify(devMemory, null, 2)}
\`\`\`
Use this to understand what has already been built and what remains. You will update dev_memory.json at the end of your work.`;
```

Add `memoryContext` to `devPrompt` before `errorContext`.

### Step C — Anchor message uses metadata tag (not content search)

When pushing the initial message into `currentMessages`, tag it with `__anchor: true` in `additional_kwargs` so `maskMessages` can locate it reliably:

```ts
if (currentMessages.length === 0) {
    currentMessages.push(new HumanMessage({
        content: "Begin constructing the application strictly adhering to the UX architect's design specifications.",
        additional_kwargs: { __anchor: true }
    }));
}
```

> This replaces the current content-sniffing pattern (`m.content.includes("DEV_MEMORY")`). The `__anchor` metadata tag is immune to false positives when the LLM echoes "DEV_MEMORY" in its reasoning.

### Step D — Post-loop anchor update (dedicated GPT-4o Mini call)

After the Developer main loop exits (before `return`), fire a lightweight call to update `dev_memory.json`. This is deliberately a separate call — it does not touch the main loop's break conditions or message history.

```ts
// Update dev_memory.json after the loop exits
try {
    const memUpdateSystemPrompt = `You are a session state tracker. Based on the recent development session, output ONLY an updated dev_memory.json as a single XML <file> block. No other text.

Current memory:
${JSON.stringify(devMemory, null, 2)}

Rules:
- Add any newly completed components to components_completed
- Add key design decisions to design_decisions
- List remaining work in next_steps
- List any known TypeScript or build errors in known_issues
- Keep intent unchanged`;

    const memResponse = await openaiModel.invoke([
        new SystemMessage(memUpdateSystemPrompt),
        ...currentMessages.slice(-5)  // last 5 msgs for context — cheap
    ]);

    const memRaw = memResponse.content as string;
    const memMatch = memRaw.match(/<file[^>]*path=["']dev_memory\.json["'][^>]*>\n*([\s\S]*?)\n*<\/file>/i);
    if (memMatch) {
        await tools.writeFile(state.sandboxPath, "dev_memory.json", memMatch[1]);
        emitter.info("developer", "Session memory updated");
    }
} catch (e: any) {
    // Non-blocking — failure here must never stop the pipeline
    emitter.info("developer", `Session memory update skipped: ${e.message}`);
}
```

> Uses `openaiModel` (GPT-4o), not the Opus dev model — the anchor update is cheap context work, not code generation.

---

## Files to Change

| File | Change |
|---|---|
| `agent-backend/src/orchestrator/graph.ts` | (1) Add `DevMemory` interface + `getContentString` helper; (2) Replace `trimMessages` → `maskMessages`; (3) PM node seeds `dev_memory.json`; (4) Developer node reads anchor + injects `memoryContext`; (5) Anchor message uses `__anchor` metadata; (6) Post-loop anchor update call |

`state.ts` — **no changes.** The anchor lives on disk in the sandbox, not in LangGraph state.

---

## What Does NOT Change

- XML `<file>` extraction regex and scaffold lock logic
- `routeAfterQA` conditional and loop structure
- QA node logic
- Model selection and fallback chain
- SSE/emitter patterns
- `project_manifest.json` (kept, distinct role from `dev_memory.json`)

---

## Verification Steps

```bash
cd agent-backend && npx tsc --noEmit   # type-check
cd agent-backend && npm run build      # catch runtime issues
```

Manual checks after a full orchestration run:
1. `dev_memory.json` exists in sandbox after PM node with correct `intent`
2. `dev_memory.json` is updated after Developer node completes (components_completed populated)
3. On iteration 2+, the Developer system prompt includes the SESSION MEMORY section
4. In long sessions (3+ iterations), old `ToolMessage` content is replaced with stubs, not dropped

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| `maskMessages` leaves orphaned `ToolMessage` at start of maskedOld | Explicitly strip leading ToolMessages (same guard as old `trimMessages`) |
| LLM fails to update `dev_memory.json` | Dedicated post-loop call wrapped in try/catch — failure is non-blocking |
| Masked HumanMessage drops QA error context | QA errors already injected into `devPrompt` system prompt as `errorContext` — messages are a secondary signal |
| Claude content array causes silent skip in masking logic | `getContentString` normalizes both string and array content formats |
