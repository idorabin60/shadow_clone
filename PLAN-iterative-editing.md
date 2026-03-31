# Implementation Plan: Iterative Editing (Lovable/Bolt-style)

## Goal
After the initial site generation, users can send follow-up messages in the chat to request changes. The system applies targeted edits to the existing code and updates the live preview.

---

## Architecture Decision: Lightweight Edit Graph (not a full re-run)

**Why not re-run the full PM → Dev → QA pipeline?**
- PM node is unnecessary — the spec already exists, user is giving a targeted change request
- Full pipeline takes 2-5 minutes; edits should feel fast (30-60s)
- Re-generating from scratch risks losing good code the user already approved

**The approach: A separate `editGraph` LangGraph state machine with 2 nodes:**

```
User edit request → Developer (edit mode) → QA (build-only, skip visual on small edits)
                         ↑                      |
                         └──── if failed ────────┘
```

This is a **separate compiled graph** (`editApp`) alongside the existing `orchestratorApp`. Same sandbox tools, different system prompts optimized for surgical edits.

---

## Implementation Steps

### Step 1: Backend — Create the Edit Graph

**File: `agent-backend/src/orchestrator/editGraph.ts`**

1. Define a new `EditState` interface (or extend `OrchestrationState`):
   ```ts
   interface EditState {
     sandboxPath: string;          // recreated sandbox with existing files
     projectId: string;            // Supabase project ID
     userRequest: string;          // the edit instruction
     existingFiles: Record<string, string>; // current files from DB
     conversationHistory: BaseMessage[];    // multi-turn memory
     status: string;
     errorLogs: string | null;
     iterationCount: number;
   }
   ```

2. **Edit Developer Node** — similar to the current `developerNode` but with a different system prompt:
   - Receives the full current codebase as context (file manifest + key files)
   - Prompt emphasizes **surgical edits** — only change what the user asked for
   - Uses the same XML `<file>` extraction engine and tools
   - Reads existing files from sandbox before patching
   - System prompt template:
     ```
     You are editing an existing Hebrew landing page. The user wants a specific change.
     DO NOT rewrite the entire codebase. Only modify the files that need to change.
     First read the relevant files, then output <file> blocks with the updated content.

     Current file manifest: [list of files]
     User request: "{userRequest}"
     ```

3. **Edit QA Node** — lighter version of current QA:
   - Always run TypeScript check + Vite build
   - Skip visual QA for small edits (< 3 files changed) to keep it fast
   - Run visual QA only if the edit touches layout/styling significantly

4. Compile as `editApp` and export alongside `orchestratorApp`

### Step 2: Backend — New API Endpoint for Edits

**File: `agent-backend/src/index.ts`**

Add a new endpoint:
```
POST /api/edit
Body: { projectId, userRequest, conversationHistory? }
```

Flow:
1. Fetch current `files` JSON from Supabase `projects` table
2. Recreate a sandbox from those files (new `SandboxManager.createFromFiles()` method)
3. Run `editApp.invoke(...)` with the edit state
4. Save updated files back to Supabase
5. Send `DONE_FILES_SAVED` via SSE so frontend reloads

Also add SSE stream endpoint (can reuse existing `/api/orchestrate/stream/:uuid`).

### Step 3: Backend — SandboxManager Enhancement

**File: `agent-backend/src/sandbox/SandboxManager.ts`**

Add method:
```ts
public async createFromFiles(
  projectId: string,
  files: Record<string, string>
): Promise<{ sandboxId: string, sandboxPath: string }>
```

- Copies scaffold (for node_modules, config files)
- Writes all existing project files into the sandbox
- Returns sandbox ready for the edit developer to modify

### Step 4: Frontend — Wire Up the Chat for Edits

**File: `src/app/workspace/page.tsx`**

Update `handleSendMessage()`:
1. Instead of the current placeholder response, call `POST /api/edit` with:
   - `projectId` = current `sandboxId`
   - `userRequest` = chat input text
   - `conversationHistory` = previous chat messages (for multi-turn context)
2. Subscribe to SSE stream (same pattern as initial generation)
3. On `DONE_FILES_SAVED`, re-fetch files from Supabase and remount in WebContainer
4. Show thinking/progress UI (reuse existing loading card)

### Step 5: Conversation History Persistence

**Option A (simpler, recommended for MVP):** Store conversation history in React state. Lost on page refresh but sufficient for a session.

**Option B (later):** Add a `messages` JSONB column to the `projects` table in Supabase. Load on project switch, append after each edit.

For now, go with **Option A** and upgrade later.

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Separate graph vs reuse | Separate `editGraph` | Different prompts, lighter QA, cleaner separation |
| Full rewrite vs surgical edit | Surgical edit prompt | Speed + preserves user-approved code |
| New sandbox per edit | Yes, from DB files | Sandboxes are deleted after save; need fresh one per edit |
| Visual QA on edits | Conditional | Skip for small changes, run for layout/style changes |
| Conversation memory | In-memory (React state) | Simple MVP, upgrade to DB later |
| Same SSE mechanism | Yes, reuse | No need to build a second streaming system |

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `agent-backend/src/orchestrator/editGraph.ts` | **CREATE** | New LangGraph for edit requests |
| `agent-backend/src/orchestrator/state.ts` | **EDIT** | Add `EditState` interface |
| `agent-backend/src/index.ts` | **EDIT** | Add `POST /api/edit` endpoint |
| `agent-backend/src/sandbox/SandboxManager.ts` | **EDIT** | Add `createFromFiles()` method |
| `src/app/workspace/page.tsx` | **EDIT** | Wire `handleSendMessage` to edit API |

---

## Estimated Complexity
- Backend (Steps 1-3): ~300 lines of new code, mostly adapting existing patterns
- Frontend (Step 4): ~50 lines of changes to workspace page
- The edit developer node can reuse 80% of the existing developer node's tool setup
