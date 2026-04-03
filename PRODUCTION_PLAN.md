# Production Implementation Plan — Shadow Clone Agent Backend

> **Status:** In Progress  
> **Last Updated:** 2026-04-03  
> **Scope:** `agent-backend/src/orchestrator/graph.ts` and supporting modules

---

## Problem Summary

### Output Quality Problems (affects every generated site)

| Problem | Location | Impact |
|---|---|---|
| Hardcoded Unsplash example URLs in dev prompt | `graph.ts:289` | Every site reuses the same 2 stock photos (circuit board, laptop) |
| Manifest always 4 components regardless of business | `graph.ts:200-208` | Restaurant and SaaS get the same Hero/Navbar/Footer skeleton |
| No brand color specification | PM prompt | Every site gets a random blue-purple gradient |
| No Hebrew font specification | PM + dev prompts | Browser falls back to ugly system fonts |
| PM is a prompt relay, not a real designer | `productManagerNode` | Spec is vague; developer has no concrete section/color/image guidance |

### Architecture Problems

| Problem | Location | Impact |
|---|---|---|
| No parallel component writing | `developerNode` inner loop | All components written sequentially → slow (~3-5 min/site) |
| Character-based context masking | `maskMessages()` | Inaccurate token budgeting → context overflows or premature truncation |
| QA errors re-injected into full history | `qaNode` return | Message history bloats every iteration |
| No error classification | `qaNode` → `developerNode` | TypeScript, build, and visual errors all get same generic "fix it" prompt |
| Ambiguous inner loop exit | `developerNode` while loop | Can't distinguish "done" vs "timeout" vs "error" |
| dev_memory.json update reads last 5 msgs only | Post-loop in `developerNode` | Loses context on long sessions |
| 810-line monolithic file | `graph.ts` | Hard to reason about, test, or modify safely |
| `businessInput: any`, `status: string` | `state.ts` | No validation at system boundary |

---

## Architecture After Refactor

```
User Prompt
    │
    ▼
[PM Node]  ──────────────────── writes spec.md + manifest
    │
    ▼
[Component Planner Node] ─────── decomposes spec into component list
    │
    ▼
[Parallel Writer Nodes] ─────── Promise.all(components.map(writeComponent))
    │                            Each component: isolated context, single LLM call
    ▼
[Assembler Node] ────────────── merges files, runs tsc --noEmit
    │
    ▼
[QA Node]
    │  ├── TypeScript pass → Vite build → Visual QA
    │  └── fail: classify error → targeted re-prompt → back to targeted fixer
    ▼
  DONE (save to Supabase)
```

---

## Tasks

Tasks are ordered by dependency. Each task is independently testable — verify with `cd agent-backend && npx tsc --noEmit` after each.

---

### Phase 0 — Output Quality (prompt engineering, highest ROI)

These are prompt-only changes. No architecture change, no TypeScript risk. Do these first — the parallel writer in Phase 4 inherits the better spec format.

---

#### Task 0.1 — PM Structured Output Schema
**Status:** `[x] Done`

**What:** Replace the PM's freeform spec.md with a strict structured schema the LLM must fill. Forces the PM to do real design thinking (business type, color palette, sections list, font choice) rather than relaying generic vibe rules.

**Schema the PM must output:**
```
## Business Analysis
- Type: [SaaS / Restaurant / Service / E-commerce / Professional / ...]
- Tone: [Professional / Playful / Luxurious / Trustworthy / ...]
- Primary CTA: [exact button text in Hebrew]

## Color Palette
- Primary: #hex (main brand color)
- Secondary: #hex (supporting color)
- Accent: #hex (CTA buttons, highlights)
- Background: #hex or gradient string
- Text: #hex

## Typography
- Font: Heebo (Hebrew-optimized Google Font), weights 300/400/700/900
- Hero headline: text-6xl md:text-8xl font-black leading-tight
- Section headline: text-4xl font-bold
- Body: text-lg font-light leading-relaxed

## Image Strategy
- Hero background: [Unsplash search terms relevant to the business]
- Feature/About section: [Unsplash search terms]
- Style: object-cover rounded-2xl shadow-2xl

## Sections (ordered, business-specific)
1. Navbar — [logo + nav links in Hebrew]
2. Hero — [headline, subline, CTA — all in Hebrew]
3-N. [business-specific sections with content brief]
N+1. Footer — [links, copyright in Hebrew]

## Component List
[exact filenames, e.g. src/Hero.tsx, src/Features.tsx ...]

## Design Rules
[glassmorphism, framer-motion, RTL, spacing rules]
```

**Files edited:** `graph.ts` — `productManagerNode` system prompt + manifest generation

**Test:** Run a generation. Open `spec.md` in the sandbox and confirm it has Color Palette, Typography, Image Strategy, and a business-specific Sections list.

---

#### Task 0.2 — Business-Aware Unsplash URLs in Dev Prompt
**Status:** `[x] Done`

**What:** Remove the two hardcoded Unsplash example URLs from the developer prompt. Instead, read the `Image Strategy` section from spec.md (written by PM in Task 0.1) and inject the correct search terms into the dev prompt.

**Current (bad):**
```
Images: Never use empty divs. Use beautiful high-res Unsplash placeholders. 
(e.g., 'https://images.unsplash.com/photo-1518770660439-4636190af475...')
```

**Target:**
```
Images: Never use empty divs. Use Unsplash images relevant to this business.
URL format: https://images.unsplash.com/photo-XXXXXX?auto=format&fit=crop&w=1200&q=80
The spec.md defines the correct search themes for images — use those to select relevant photos.
For hero backgrounds use wide landscape images (w=1600). For cards use square crops (w=800).
Style all images with: rounded-2xl shadow-2xl object-cover
```

**Also add Heebo font import instruction:**
The dev prompt should explicitly instruct: inject `@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap')` into `src/index.css` and set `font-family: 'Heebo', sans-serif` on the body.

**Files edited:** `graph.ts` — `developerNode` `devPrompt` string

**Test:** Run a generation. Inspect generated `src/index.css` for Heebo import. Confirm no hardcoded photo-1518770660 URL in generated files.

---

### Phase 1 — Decompose (no behavior change)

Goal: Split the monolith into testable modules. Zero behavior change — all existing logic moves, nothing is rewritten.

---

#### Task 1.1 — Extract XML Parser
**Status:** `[x] Done`

**What:** Move the `<file>` XML extraction regex + scaffold guards out of the 500-line agent loop into `src/orchestrator/xmlParser.ts`.

**Files:**
- Create: `agent-backend/src/orchestrator/xmlParser.ts`
- Edit: `graph.ts` — import from `xmlParser.ts`

**Exports:**
```typescript
export interface ParsedFile { path: string; content: string; }
export function extractXmlFiles(rawContent: string): ParsedFile[];
export function stripXmlFromContent(rawContent: string, parsed: ParsedFile[]): string;
```

**Test:** `npx tsc --noEmit` passes. Run a generation — same output as before.

---

#### Task 1.2 — Extract Scaffold Guard
**Status:** `[x] Done`

**What:** Move `isProtected()`, `shouldAllowProtectedWrite()`, and `PROTECTED_FILES` constant into `src/orchestrator/scaffoldGuard.ts`.

**Files:**
- Create: `agent-backend/src/orchestrator/scaffoldGuard.ts`
- Edit: `graph.ts` — import from `scaffoldGuard.ts`

**Test:** `npx tsc --noEmit` passes.

---

#### Task 1.3 — Extract Dev Tool Definitions
**Status:** `[x] Done`

**What:** Move `applyPatchsetTool`, `writeFileTool`, `editFileTool`, `readFileTool`, `listFilesTool`, `npmInstallTool` definitions out of `developerNode` into a factory function in `src/orchestrator/devTools.ts`.

**Files:**
- Create: `agent-backend/src/orchestrator/devTools.ts`
- Edit: `graph.ts` — call `createDevTools(sandboxPath, errorLogs, fileCache)` instead of inlining

**Signature:**
```typescript
export function createDevTools(
  sandboxPath: string,
  errorLogs: string | null,
  fileCache: Map<string, string>
): { tools: Tool[]; toolsByName: Record<string, Tool> }
```

**Test:** `npx tsc --noEmit` passes.

---

#### Task 1.4 — Type-Harden OrchestrationState
**Status:** `[x] Done`

**What:** Replace `businessInput: any` and `status: string` with proper types.

**Files:**
- Edit: `agent-backend/src/orchestrator/state.ts`

**Changes:**
```typescript
import { z } from 'zod';

export const BusinessInputSchema = z.object({
  businessName: z.string(),
  description: z.string(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  services: z.array(z.string()).optional(),
});
export type BusinessInput = z.infer<typeof BusinessInputSchema>;

export type OrchestrationStatus =
  | 'planning'
  | 'coding'
  | 'qa'
  | 'success'
  | 'failed'
  | 'timeout';

export interface OrchestrationState {
  businessInput: BusinessInput;
  sandboxPath: string;
  status: OrchestrationStatus;
  messages: BaseMessage[];
  errorLogs: string | null;
  iterationCount: number;
}
```

**Test:** `npx tsc --noEmit` passes. Validate input at `/api/orchestrate` call site using `BusinessInputSchema.parse()`.

---

### Phase 2 — Context Management

Goal: Replace heuristic char-based masking with token-aware, semantically correct pruning.

---

#### Task 2.1 — Token-Aware Message Trimming
**Status:** `[x] Done`

**What:** Replace `maskMessages()` char-based heuristics with token counting using `tiktoken` (or `@anthropic-ai/tokenizer`). Budget: 80k tokens for Claude Opus context.

**Files:**
- Create: `agent-backend/src/orchestrator/contextManager.ts`
- Edit: `graph.ts` — replace `maskMessages()` call

**Key change:** Instead of `msgs.length <= max` (message count), gate on `estimateTokens(msgs) <= TOKEN_BUDGET`.

**Exports:**
```typescript
export const TOKEN_BUDGET = 80_000;
export function estimateTokens(msgs: BaseMessage[]): number;
export function pruneToTokenBudget(msgs: BaseMessage[], budget: number): BaseMessage[];
```

**Pruning strategy (preserve priority order):**
1. Always keep: first human message (anchor), pinned anchor (`__anchor: true`)
2. Always keep: last 20 messages verbatim  
3. Compress: old ToolMessages → 1-line stub
4. Compress: old large HumanMessages → 1-line stub
5. Keep: all AIMessages (reasoning chain)
6. If still over budget: drop oldest compressed messages

**Test:** Unit test with a synthetic message array of known token size. `npx tsc --noEmit` passes.

---

#### Task 2.2 — Decouple Error State from Message History
**Status:** `[x] Done`

**What:** QA errors are currently appended as `HumanMessage` to `state.messages`, causing them to re-appear and compound on every iteration. Instead, store them only in `state.errorLogs` and inject them fresh as a system prompt addendum each time the developer node runs — not as a persisted message.

**Current (bad):**
```typescript
// qaNode:
messages: [...state.messages, new HumanMessage(`[QA] Fix:\n${error}`)]

// developerNode: reads errorContext from state.errorLogs AND finds old HumanMessages in history
```

**Target:**
```typescript
// qaNode:
messages: state.messages  // no QA error appended to history
errorLogs: tsResult        // only in errorLogs

// developerNode: injects errorLogs as system prompt addendum — not as HumanMessage
const errorContext = state.errorLogs
  ? `\n\n## CURRENT ERRORS TO FIX:\n${state.errorLogs}`
  : '';
// prepend to system prompt only
```

**Files:**
- Edit: `graph.ts` — `qaNode` returns, `developerNode` system prompt construction

**Test:** Run a generation with an intentional TypeScript error. Confirm message history doesn't grow with error messages between iterations.

---

#### Task 2.3 — Robust Memory Update
**Status:** `[x] Done`

**What:** The current dev_memory.json update at end of developer loop:
1. Only looks at last 5 messages (misses most of what happened)
2. Uses a fragile XML regex to find the response
3. Silently fails if GPT-4o doesn't output the right format

**Fix:** Use structured output (JSON mode) so the response is always valid JSON. Pass a summary of what was written (from fileCache and xmlFiles extracted) as explicit input — not just the last 5 messages.

**Files:**
- Edit: `graph.ts` — `developerNode` post-loop memory update section

**Changes:**
```typescript
// Pass explicit context instead of last 5 messages:
const sessionSummary = {
  filesWritten: Array.from(fileCache.keys()),
  xmlFilesExtracted: extractedFiles.map(f => f.path),
  errorLogsFixed: !!state.errorLogs,
  iterationCount: state.iterationCount,
};

// Use structured output instead of XML regex:
const memResponse = await openaiModel
  .withStructuredOutput(DevMemorySchema)  // Zod schema
  .invoke([systemPrompt, ...]);
```

**Test:** Memory file always updates correctly. `npx tsc --noEmit` passes.

---

### Phase 3 — Error Recovery

Goal: Replace "dump all errors, fix everything" with targeted, classified recovery.

---

#### Task 3.1 — Error Classifier
**Status:** `[x] Done`

**What:** Create `src/orchestrator/errorClassifier.ts` that parses raw error strings into structured error objects.

**Files:**
- Create: `agent-backend/src/orchestrator/errorClassifier.ts`

**Exports:**
```typescript
export type ErrorType = 'typescript' | 'build' | 'visual';

export interface ClassifiedError {
  type: ErrorType;
  affectedFiles: string[];   // e.g. ['src/Hero.tsx', 'src/App.tsx']
  rawMessage: string;
  summary: string;           // 1-line human-readable description
}

export function classifyError(errorLogs: string): ClassifiedError;
```

**TypeScript error parsing:** Use regex to extract file paths from `tsc` output:
```
src/Hero.tsx(12,3): error TS2345: ...
```

**Build error parsing:** Extract from Vite output — `vite build` errors include file paths.

**Visual error parsing:** Parse the structured `formatVisualErrors()` output.

**Test:** Unit test with sample TypeScript/build/visual error strings. Confirm `affectedFiles` is correctly extracted.

---

#### Task 3.2 — Targeted Re-Prompting
**Status:** `[x] Done`

**What:** When QA fails, instead of sending the full error dump to the developer, send a targeted prompt that includes only the broken files' current content and the specific error.

**Files:**
- Edit: `graph.ts` — `qaNode` failure return paths

**Current:**
```typescript
messages: [...state.messages, new HumanMessage(`Fix:\n${buildResult}`)]
```

**Target:**
```typescript
const classified = classifyError(buildResult);
const fileContents = await Promise.all(
  classified.affectedFiles.map(f => tools.readFile(state.sandboxPath, f))
);
const targetedPrompt = buildTargetedFixPrompt(classified, fileContents);
// targetedPrompt includes: error summary, only the broken files' code, specific instructions
```

**Helper:**
```typescript
// src/orchestrator/errorClassifier.ts
export function buildTargetedFixPrompt(
  error: ClassifiedError,
  fileContents: { path: string; content: string }[]
): string
```

**Test:** Run a generation where a known TypeScript error exists in one file. Confirm the re-prompt contains only that file's content, not all files.

---

#### Task 3.3 — Inner Loop Exit States
**Status:** `[x] Done`

**What:** The developer inner while loop currently has two exit conditions that are treated identically: "done" (no tools + no patches) and "timeout" (`steps >= maxSteps`). There's also a silent `break` on `patchAttempts >= 2`. Make these explicit and distinct.

**Files:**
- Edit: `graph.ts` — `developerNode` while loop

**Changes:**
```typescript
type LoopExitReason = 'done' | 'timeout' | 'patch_limit' | 'schema_error';
let exitReason: LoopExitReason | null = null;

while (steps < maxSteps) {
  // ...
  if (!didPatch && !hasToolCalls) { exitReason = 'done'; break; }
  if (patchAttempts >= 2 && !tsResult.includes("Success:")) { exitReason = 'patch_limit'; break; }
}
if (steps >= maxSteps) exitReason = 'timeout';

console.log(`[DEV_LOOP] Exit reason: ${exitReason}`);
emitter.info('developer', `Loop exit: ${exitReason}`);

// On 'timeout' or 'patch_limit', set errorLogs so QA can make an informed decision
if (exitReason === 'timeout' || exitReason === 'patch_limit') {
  return { status: 'failed', errorLogs: `Developer loop exited: ${exitReason}`, ... };
}
```

**Test:** Trigger each exit condition (artificial maxSteps=3, artificial patchAttempts, clean generation). Confirm correct exitReason logged.

---

### Phase 4 — Parallel Component Generation

Goal: The biggest performance win. Write components in parallel instead of sequentially.

---

#### Task 4.1 — Component Planner Node
**Status:** `[x] Done` (merged into Task 4.2 — spec parsing built into parallelWriter.ts)

**What:** Add a new LangGraph node between PM and Developer. It reads `spec.md` and outputs a JSON component plan — a list of components to build with their responsibilities.

**Files:**
- Edit: `graph.ts` — add `componentPlannerNode`
- Edit: `OrchestrationState` in `state.ts` — add `componentPlan: ComponentPlan | null`

**Types:**
```typescript
export interface ComponentSpec {
  filename: string;       // e.g. 'src/Hero.tsx'
  description: string;   // e.g. 'Full-width hero section with animated headline and CTA button'
  dependencies: string[]; // e.g. ['src/types.ts'] — files that must exist before this one
}

export interface ComponentPlan {
  sharedTypes: string;   // content of src/types.ts to create first
  components: ComponentSpec[];
}
```

**Node behavior:**
1. Read spec.md
2. Call Claude Sonnet with structured output (JSON mode)
3. Output `ComponentPlan` with ~5-8 components
4. Write `component_plan.json` to sandbox

**Graph edge:** `productManager → componentPlanner → developer`

**Test:** Run a generation and inspect `component_plan.json`. `npx tsc --noEmit` passes.

---

#### Task 4.2 — Parallel Writer Sub-Agents
**Status:** `[x] Done`

**What:** Replace the single monolithic developer loop with parallel per-component writers. Each writer gets:
- spec.md (full)
- Its component spec (description, filename)
- `src/types.ts` content (shared types, written first)
- Any dependencies' content

**Files:**
- Edit: `graph.ts` — `developerNode` restructured to use `Promise.all`

**Structure:**
```typescript
async function writeComponent(
  sandboxPath: string,
  componentSpec: ComponentSpec,
  sharedContext: string,  // spec.md + types.ts
  errorLogs: string | null
): Promise<{ filename: string; content: string; tsErrors: string | null }>

// In developerNode:
const plan = JSON.parse(await tools.readFile(sandboxPath, 'component_plan.json'));

// Step 1: Write shared types first (sequential — others depend on it)
const typesContent = await writeSharedTypes(sandboxPath, plan.sharedTypes, spec);

// Step 2: Write all components in parallel
const results = await Promise.all(
  plan.components.map(comp => writeComponent(sandboxPath, comp, sharedContext, state.errorLogs))
);

// Step 3: Write all files to disk
await Promise.all(results.map(r => tools.writeFile(sandboxPath, r.filename, r.content)));
```

**Important constraints:**
- Each sub-agent gets a FRESH message history (no shared context accumulation)
- Each sub-agent has its own TypeScript check after writing
- `App.tsx` is written LAST (assembles imports from all other components)

**Test:** Time a generation before/after. Confirm all component files exist. `npx tsc --noEmit` passes end-to-end.

---

#### Task 4.3 — Assembly & Conflict Resolution
**Status:** `[x] Done` (App.tsx generation + tsc check + fix loop fallback built into parallelWriter.ts)

**What:** After parallel writes, an assembler step:
1. Generates `src/App.tsx` that imports all components (based on component_plan.json)
2. Runs `tsc --noEmit` to catch cross-component type errors
3. If type errors: runs a single "integration fixer" LLM call with all broken files

**Files:**
- Edit: `graph.ts` — add assembly step at end of `developerNode`

**Assembly prompt is deterministic** (template-based, no LLM needed for App.tsx):
```typescript
function buildAppTsx(components: ComponentSpec[]): string {
  const imports = components
    .filter(c => c.filename !== 'src/App.tsx')
    .map(c => {
      const name = path.basename(c.filename, '.tsx');
      return `import ${name} from './${name}';`;
    })
    .join('\n');
  return `${imports}\n\nexport default function App() {\n  return (\n    <div dir="rtl">\n      ${components.map(c => `<${path.basename(c.filename, '.tsx')} />`).join('\n      ')}\n    </div>\n  );\n}`;
}
```

**Test:** Confirm App.tsx is correctly generated. Confirm tsc passes after assembly.

---

### Phase 5 — Production Hardening

---

#### Task 5.1 — Per-Node Timeouts
**Status:** `[x] Done`

**What:** Each LangGraph node should time out independently rather than hanging indefinitely.

**Files:**
- Edit: `graph.ts` — wrap each node's LLM calls with `Promise.race([call, timeout])`

**Constants:**
```typescript
const TIMEOUTS = {
  pm: 60_000,          // 60s
  componentPlanner: 30_000,
  componentWriter: 90_000,  // per component
  qa_ts: 30_000,
  qa_build: 60_000,
  qa_visual: 120_000,
} as const;
```

**Test:** Set a short timeout, confirm the node fails with `'timeout'` status and a clear error message rather than hanging.

---

#### Task 5.2 — Token & Cost Tracking
**Status:** `[x] Done`

**What:** Track token usage per node and emit it as SSE events so the frontend can show cost estimates.

**Files:**
- Edit: `graph.ts` — capture `response.usage_metadata` from each LLM call
- Edit: `agent-backend/src/orchestrator/emitter.ts` — add `emitter.cost(node, inputTokens, outputTokens)`

**Pricing constants (approximate):**
```typescript
const COST_PER_1K = {
  'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
  'claude-opus-4-6':   { input: 0.015, output: 0.075 },
  'gpt-4o':            { input: 0.005, output: 0.015 },
};
```

**State addition:**
```typescript
// state.ts
totalCostUSD: number;  // accumulated across all nodes
```

**Test:** Run a generation, confirm cost is emitted and logged.

---

#### Task 5.3 — Structured Logging
**Status:** `[x] Done` (completed in Phase 1 as part of logger.ts integration)

**What:** Replace scattered `console.log` with a structured logger that emits JSON lines — parseable by log aggregators (Datadog, Logtail, etc).

**Files:**
- Create: `agent-backend/src/lib/logger.ts`

```typescript
export interface LogEntry {
  ts: string;           // ISO timestamp
  level: 'info' | 'warn' | 'error';
  node: string;         // 'pm' | 'developer' | 'qa' | 'componentPlanner' | ...
  sandboxId: string;
  event: string;        // e.g. 'loop_step', 'file_written', 'tsc_passed'
  data?: Record<string, unknown>;
}

export const logger = {
  info: (node: string, sandboxId: string, event: string, data?: Record<string, unknown>) => { ... },
  warn: (node: string, sandboxId: string, event: string, data?: Record<string, unknown>) => { ... },
  error: (node: string, sandboxId: string, event: string, data?: Record<string, unknown>) => { ... },
};
```

**Test:** Run a generation, confirm all log lines are valid JSON. `npx tsc --noEmit` passes.

---

## Execution Order

```
Phase 1: Task 1.1 → 1.2 → 1.3 → 1.4   (decompose, zero behavior change)
Phase 2: Task 2.1 → 2.2 → 2.3          (context management)
Phase 3: Task 3.1 → 3.2 → 3.3          (error recovery)
Phase 4: Task 4.1 → 4.2 → 4.3          (parallel generation — biggest win)
Phase 5: Task 5.1 → 5.2 → 5.3          (production hardening)
```

Dependencies:
- 4.2 depends on 4.1 (needs ComponentPlan type)
- 4.3 depends on 4.2 (needs parallel results)
- 3.2 depends on 3.1 (needs ClassifiedError type)
- 2.2 should be done before 3.2 (error state decoupling)
- Phase 5 can be done any time after Phase 1

---

## Testing Protocol (per task)

After **every** task:
1. `cd agent-backend && npx tsc --noEmit` — must pass
2. `cd agent-backend && npm run build` — must pass
3. For behavior changes: run one end-to-end generation, inspect SSE log output

---

## Expected Outcomes

| Metric | Before | After (estimate) |
|---|---|---|
| Generation time | ~3-5 min | ~1-2 min (parallel writing) |
| Context overflow risk | High (char-based) | Low (token-aware) |
| Error recovery quality | Generic dump | Targeted per-file |
| Codebase testability | Hard (monolith) | Easy (modular) |
| Token cost per generation | Unknown | Tracked + visible |
| Max steps before timeout | ∞ (100 steps × ∞ sec) | Bounded per node |
