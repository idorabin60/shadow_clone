# Hebrew Business Landing Page Builder — Implementation Plan (V3: Autonomous Multi-Agent Pipeline)

> An AI-powered SaaS that employs a full "virtual software agency" behind the scenes. When a user requests a landing page, a multi-agent system plans, writes code, tests, and refines a production-ready Next.js/React codebase iteratively over several minutes.

---

## 🛑 The Pivot: Why a Multi-Agent System?

Previous iterations (V1 JSON templates, V2 Single-shot HTML) were limited by the context window and output capabilities of a single LLM call. True high-quality software requires planning, iteration, and verification.

In **V3 (Path C)**, clicking "Generate" triggers a long-running background process. A team of AI agents collaboratively builds a real, bespoke codebase for the landing page. It operates exactly like a human development team: planning the structure, writing the files, running the compiler/linter, fixing errors, and finalizing the build. 

The user trades waiting time (e.g., 2-5 minutes) for vastly superior, bug-free, highly customized output.

---

## A) MVP Definition (V3)

### Must-Have (v3.0)
| # | Feature | Acceptance Criteria |
|---|---------|-------------------|
| 1 | **Onboarding Wizard** | Captures Business Name, Details, USP, and Target Audience. |
| 2 | **Server-Sent Events (SSE) UI** | A loading screen that streams live terminal/agent logs to the user so they can watch the "AI Team" working step-by-step. |
| 3 | **Agent Orchestrator** | A backend node engine that manages standard software steps: Plan → Code → Test → Loop → Deploy. |
| 4 | **Virtual Filesystem Sandbox** | Each generation request spins up an isolated `tmp/sites/[uuid]` directory structure containing a Next.js/React scaffold. |
| 5 | **Iterative Code Generation** | The "Coder Agent" physically writes `.tsx` and `.css` files into the sandbox using tool calls. |
| 6 | **Automated Testing Loop** | The "QA Agent" runs `tsc` and an HTML linter on the sandbox. If errors exist, it feeds them back to the Coder Agent to fix. |
| 7 | **Live Vite Proxy (Lovable Style)** | Once generated, the backend spawns a Vite Dev Server. The frontend `iframe` connects to this live server for instant Hot Module Replacement (HMR). |
| 8 | **Chat-to-Edit Interface** | A persistent chat panel next to the preview. User types natural language ("change buttons to red"), the AI edits the sandbox React files, and the iframe live-reloads instantly. |

---

## B) System Architecture (Multi-Agent Pipeline)

### High-Level Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                          │
│                                                                  │
│  ┌──────────┐   POST /api/orchestrate    ┌────────────────────┐  │
│  │ Wizard   │ ─────────────────────────> │ Live Terminal UI   │  │
│  │ & Chat UI│ <───────────────────────── │ (Streaming Events) │  │
│  └──────────┘         SSE Stream         └────────────────────┘  │
│        ▲                                           ▲             │
│        │ POST /api/chat (Edit requests)            │             │
│        └───────────────────────────────────────────┤             │
│                                         Live iframe Proxy        │
└────────────────────────────────────────────────────┼─────────────┘
                                                     │
┌─────────────────────────────────▼──────────────────▼─────────────┐
│                   Backend Orchestrator (Express / LangGraph)     │
│                                                                  │
│  ┌─────────────┐   ┌────────────┐   ┌──────────┐                 │
│  │ 1. Product  │ → │ 2. Coder   │ ⇄ │ 3. QA    │                 │
│  │    Manager  │   │    Agent   │   │    Agent │                 │
│  └─────────────┘   └─────┬──────┘   └─────┬────┘                 │
└──────────────────────────┼────────────────┼──────────────────────┘
                           ▼                ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Isolated Project Sandbox                       │
│                   (/tmp/generations/[uuid]/)                     │
│                                                                  │
│  - package.json (Vite + React)                                   │
│  - /src (AI writes component .tsx here)                          │
│                                                                  │
│  [ Background Process: `npm run dev` (Vite HMR Server) ]         │
└──────────────────────────────────────────────────────────────────┘
```

---

## C) The Multi-Agent Workflow

When the user submits the form, the Backend Orchestrator initiates the following state machine:

### 1. The Product Manager Agent (Planner)
- **Role:** Analyzes the business inputs.
- **Action:** Writes a comprehensive `spec.md` to the sandbox. This includes the psychological angle, SEO strategy, section breakdown, color palette (Tailwind classes), and typography choices.

### 2. The Developer Agent (Coder)
- **Role:** Translates `spec.md` into functional code.
- **Tools:** `list_dir`, `read_file`, `write_file`.
- **Action:** Iteratively creates React components (`Hero.tsx`, `About.tsx`, `Footer.tsx`) utilizing Tailwind CSS classes and writes the master `Page.tsx` that stitches them together.

### 3. The QA & Testing Agent (Reviewer)
- **Role:** Ensures the code compiles and looks syntactically correct.
- **Tools:** `run_compiler` (e.g., executing `tsc --noEmit` on the sandbox).
- **Action:** If the compiler or linter throws an error context (e.g., "Property 'className' does not exist on type..."), the QA Agent sends the exact error log back to the Developer Agent. 
- **Loop:** The Developer and QA agents loop until the code passes (max 3 retries).

### 4. The Deployment Agent (Bundler)
- **Role:** Finalizes the output.
- **Action:** Takes the successfully compiled React tree, renders it via `ReactDOMServer` to static HTML (or handles the build step), and stores the final HTML bundle in the main SQLite database linked to the User's Project ID.

---

## D) Phased Execution Plan

### Phase 4.1: Sandbox Infrastructure (2 days)
- Set up the backend folder structure to safely handle `/tmp/sites/` generation.
- Create a base Next.js/React template that gets copied into the `tmp` folder when a new job starts.

### Phase 4.2: Tool Implementation (2 days)
- Build the Node.js API functions that emulate the agent tools: `readSandboxFile()`, `writeSandboxFile()`, `runTsc()`.

### Phase 4.3: Agent Orchestration Loop (3 days)
- Implement a state machine (can be manual async loops or a lightweight LangGraph-style setup).
- Wire up OpenAI's tool-calling API (`gpt-4o` or `claude-3-5-sonnet`) to act as the different personas.

### Phase 4.4: Frontend SSE Integration (1 day)
- Create a Server-Sent Events (SSE) route: `/api/orchestrate/stream`.
- Build a beautiful terminal-like UI on the frontend that logs "🤖 *Product Manager is writing spec.md...*", "👨‍💻 *Developer is writing Hero.tsx...*" to keep the user engaged during the 2-5 minute wait.

### Phase 4.5: Preview & Export (1 day)
- Render the finalized, QA-approved sandbox page in the user's browser.

---

> [!CAUTION]
> Backend Complexity
> Building an autonomous coding loop requires strict validation to prevent infinite loops (where AI keeps failing to fix a TS error) and high token consumption. We must enforce strict iteration caps (e.g., Max 5 steps per site).
