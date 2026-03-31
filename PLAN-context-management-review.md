# Context Management Plan — Review & Recommendations

**Reviewing:** `PLAN-context-management.md`  
**Verdict:** Plan is solid — no pivot needed, but needs a cleanup pass before implementation.

---

## Issues Found

### 1. Fragile Anchor Pinning via String Search

The `maskMessages` function finds the anchor by searching for `"DEV_MEMORY"` in message content. Since you instruct the LLM to update `dev_memory.json`, it will likely echo "DEV_MEMORY" in its AI responses — pinning the wrong message.

**Fix:** Tag the anchor message with metadata instead of content sniffing:
```ts
const anchorMsg = new HumanMessage({
    content: `DEV_MEMORY:\n${JSON.stringify(devMemory, null, 2)}\n\nBegin constructing the application.`,
    additional_kwargs: { __anchor: true }
});

// In maskMessages:
const pinnedAnchor = msgs.find(m => m.additional_kwargs?.__anchor === true);
```

---

### 2. Step C (Writing Updated `dev_memory.json`) Is Underspecified

Two options are listed but neither is fully spec'd. The recommended Option B (dedicated post-loop GPT-4o call) doesn't address how to extract the `<file>` block from the response — the XML extractor only runs inside the loop.

**Fix:** Commit to Option B and add explicit extraction:
```ts
// After the main loop:
const memRaw = memResponse.content as string;
const memMatch = memRaw.match(/<file[^>]*path=["']dev_memory\.json["'][^>]*>\n*([\s\S]*?)\n*<\/file>/i);
if (memMatch) {
    await tools.writeFile(state.sandboxPath, "dev_memory.json", memMatch[1]);
}
```

---

### 3. `project_manifest.json` vs `dev_memory.json` — Contradiction

- The **Background table** says `project_manifest.json` is *replaced* by `dev_memory.json`
- The **"What Does NOT Change"** section says `project_manifest.json` is *kept* as additive

These contradict each other. They also have overlapping schemas (`components_list` vs `components_completed`).

**Fix:** Pick one:
- **Merge:** Fold `naming_rules` and `entry_file_imports` into `dev_memory.json` and drop the manifest
- **Separate:** Keep both, but clearly define their distinct roles (manifest = static scaffold rules, memory = dynamic session state)

---

### 4. Anthropic Content Array Format Not Handled

Claude returns `content` as an array (`[{type: "text", text: "..."}]`), not a plain string. The `maskMessages` function checks `typeof m.content === "string"` — this will silently skip Claude's messages.

**Fix:** Normalize content before checking:
```ts
const getContentString = (m: BaseMessage): string => {
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) {
        return m.content
            .filter(b => b.type === "text")
            .map(b => b.text)
            .join("\n");
    }
    return "";
};
```

---

### 5. `RECENT_WINDOW = 20` May Be Too Aggressive

In a tool-heavy loop, 20 messages can be just 3-4 tool call/response pairs + AI messages. This leaves very little recent context.

**Fix:** Make it configurable or proportional:
```ts
const RECENT_WINDOW = Math.max(20, Math.floor(msgs.length * 0.3));
```

---

### 6. Missing `DevMemory` Type Definition

Step B uses `let devMemory: DevMemory = {...}` but the interface is never defined or mentioned in "Files to Change."

**Fix:** Add to `graph.ts` (or `state.ts`):
```ts
interface DevMemory {
    intent: string;
    components_completed: string[];
    design_decisions: string[];
    known_issues: string[];
    next_steps: string[];
}
```

---

### 7. `trimMessages` Default Max Mismatch

The function signature says `max = 30` but the call site uses `80`. The plan text also references `80`. Not a bug, but worth aligning the default to match actual usage or removing the default entirely to force explicit values.

---

### 8. Scaffold Lock for `dev_memory.json` — Non-Issue

The risk table flags a conflict with scaffold lock, but `dev_memory.json` isn't in the `protectedFiles` array and isn't under `src/`. No mitigation is needed — remove this row to avoid confusion.

---

### 9. `spec.md` Re-Read Guard Already Exists

The plan mentions adding an "explicit instruction never to re-read" `spec.md`, but this is already implemented at line 262-266 of `graph.ts` (`specReadCount > 1` guard). No new work needed here.

---

## Summary Checklist

| # | Issue | Severity | Action |
|---|---|---|---|
| 1 | Fragile anchor pinning | 🔴 High | Use metadata tag instead of content search |
| 2 | Step C underspecified | 🔴 High | Commit to Option B, add extraction logic |
| 3 | Manifest vs memory contradiction | 🟡 Medium | Decide: merge or separate, update plan |
| 4 | Anthropic content array | 🟡 Medium | Add content normalization helper |
| 5 | RECENT_WINDOW tuning | 🟡 Medium | Make configurable or proportional |
| 6 | Missing `DevMemory` type | 🟢 Low | Add interface definition |
| 7 | Default max mismatch | 🟢 Low | Align default or remove it |
| 8 | Scaffold lock non-issue | 🟢 Low | Remove from risk table |
| 9 | spec.md guard exists | 🟢 Low | Remove from plan scope |
