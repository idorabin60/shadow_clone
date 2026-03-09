# Multi-Agent Backend Server — Task Tracker

*This tracker outlines the subtasks for building the dedicated Node.js Server (`landing-page-agent-backend`) that will orchestrate the AI Coding Agents.*

## Phase 1: Backend Bootstrap & Setup
*Setting up a robust, scalable Node environment outside of Next.js.*
- [ ] Initialize new project directory `landing-page-agent-backend`
- [ ] Initialize `npm` and install core dependencies (`express`, `cors`, `dotenv`)
- [ ] Set up TypeScript (`typescript`, `ts-node`, `@types/node`, `tsconfig.json`)
- [ ] Install AI SDKs (`openai` or `@anthropic-ai/sdk`)
- [ ] Create basic Express server entrypoint (`src/index.ts`)
- [ ] Configure `nodemon` for local development hot-reloading

## Phase 2: Agent Tools & Sandbox Infrastructure
*Building the physical tools the AI will use to write and verify code.*
- [ ] **Filesystem Isolation:** Build the `SandboxManager` class to create `/tmp/sites/[uuid]` directories.
- [ ] **Tool 1 (`write_file`):** Function to safely write code to the sandbox.
- [ ] **Tool 2 (`read_file`):** Function to let the AI read sandbox files.
- [ ] **Tool 3 (`run_typescript`):** Function to verify the React code the AI just wrote.
- [ ] Set up a lightweight Vite + React scaffold optimized for lightning-fast HMR (Hot Module Replacement), injected into every sandbox.

## Phase 3: The Multi-Agent Orchestration Loop (LangGraph)
*The core logic that passes data between the AI personas.*
- [ ] **Define Graph State:** Create a shared state object for `messages`, `compiledStatus`.
- [ ] **Agent 1 (Product Manager Node):** Logic to write `spec.md`.
- [ ] **Agent 2 (Developer Node):** Prompt and tools to create React components. 
- [ ] **Agent 3 (QA Node):** Runs `run_typescript`.
- [ ] **Conditional Routing:** If QA finds errors, route back to Developer. If pass, route to Success.

## Phase 4: Frontend Integration & Streaming (SSE)
*Connecting the Next.js Frontend to this new Backend.*
- [ ] Build the `POST /api/orchestrate` endpoint in Express.
- [ ] Implement Server-Sent Events (SSE) to stream live terminal logs.
- [ ] **[Frontend Task]:** Build the Terminal UI loading screen to listen to the SSE stream.

## Phase 5: Lovable / Bolt.new Features (The "Interactive App" Upgrade)
*Transforming the static generator into an interactive, live-reloading IDE.*
- [ ] **Live Dev Server Orchestration:** When code generation finishes, spawn `npm run dev` (Vite) inside the sandbox folder as a background process.
- [ ] **Proxy Routing:** Set up `express-http-proxy` on the backend so the frontend iframe can request the live Vite server output (e.g. `backend.com/serve/[uuid]/ -> localhost:5173`).
- [ ] **Chat-to-Edit Endpoint:** Build a new `POST /api/chat` endpoint where the user can type "make the header blue." The LLM reads the current Sandbox files, edits them using `write_file`, and Vite instantly Hot-Reloads the iframe.
- [ ] **[Frontend Task]:** Add a persistent ChatGPT-like side panel next to the live iframe preview.
