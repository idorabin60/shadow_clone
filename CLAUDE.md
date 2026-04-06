# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shadow Clone is a Hebrew landing page generator powered by a multi-agent AI system. Users describe their business in a chat interface, and an AI agent pipeline (PM -> Developer -> QA) generates a premium React/Vite landing page. The generated site is previewed live in the browser via WebContainers.

## Architecture

Two independent systems communicate over HTTP:

### Frontend — Next.js (port 3000)
- `src/app/page.tsx` — Home page with animated chat input
- `src/app/workspace/page.tsx` — Main workspace: sends prompt to agent-backend, subscribes to SSE for real-time logs, renders the generated site in an iframe via WebContainers
- `src/hooks/useWebContainer.ts` — Boots a WebContainer, mounts generated files from Supabase, runs `npm install` + `npm run dev` in-browser
- `src/utils/supabase/` — Supabase auth (client, server, middleware)
- Auth pages at `src/app/(auth)/login/` and `src/app/(auth)/signup/`
- Uses Tailwind CSS v4, framer-motion, lucide-react, three.js

### Agent Backend — Express + LangGraph (port 4000)
Located entirely in `agent-backend/`. Has its own `package.json`, `tsconfig.json`, and `node_modules`.

- `src/index.ts` — Express server with two endpoints:
  - `POST /api/orchestrate` — Creates a sandbox, kicks off LangGraph, returns sandboxId
  - `GET /api/orchestrate/stream/:uuid` — SSE endpoint streaming console logs to frontend
- `src/orchestrator/graph.ts` — **Core logic.** LangGraph state machine with 3 nodes:
  1. **Product Manager** (Claude Sonnet) — Writes `spec.md` with design requirements
  2. **Developer** (Claude Opus, fallback GPT-4o) — ReAct tool loop that writes React code via XML `<file>` blocks, verified with `tsc --noEmit`
  3. **QA** (GPT-4o) — Runs TypeScript check, Vite build, then visual QA (Playwright screenshots + GPT-4o vision review)
- `src/orchestrator/state.ts` — LangGraph state interface
- `src/tools/index.ts` — Sandbox file tools (read, write, edit, list, applyPatchset, npmInstall, npmRun, runTypeScript)
- `src/tools/screenshot.ts` — Starts Vite preview server, captures screenshots with Playwright at desktop/mobile/full-page viewports
- `src/tools/visualReview.ts` — GPT-4o vision review scoring (1-10), DOM checks (RTL, Hebrew, images, sections)
- `src/sandbox/SandboxManager.ts` — Creates isolated `/tmp/sites/{uuid}` directories from `scaffold/` template, symlinks node_modules
- `src/db/supabase.ts` — Supabase client using service role key
- `scaffold/` — Vite + React + Tailwind template injected into each sandbox

### Data Flow
```
User prompt (workspace) → POST /api/orchestrate → SandboxManager creates sandbox
  → LangGraph: PM writes spec → Developer writes React code → QA tests + visual review
  → Loop back to Developer if QA fails (max 6 iterations)
  → Files saved to Supabase `projects.files` column
  → SSE notifies frontend with DONE_FILES_SAVED
  → Frontend fetches files from Supabase → mounts in WebContainer → iframe preview
```

### Database (Supabase)
- `projects` table: `id`, `user_id`, `name`, `files` (JSONB — flat `{"/src/App.tsx": "code"}` map), `created_at`
- Auth via Supabase Auth with Google OAuth callback at `/api/auth/callback/google`

## Commands

### Frontend (root directory)
```bash
npm run dev          # Start Next.js dev server on port 3000
npm run build        # Production build
npm run lint         # ESLint
```

### Agent Backend
```bash
cd agent-backend
npm run dev          # nodemon + ts-node (watches src/, port 4000)
npm run build        # tsc → dist/
npm start            # node dist/index.js
```

Both servers must run simultaneously for the app to work.

### Environment Variables
- Root `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `agent-backend/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`

## Key Patterns

- **All generated content is Hebrew, RTL.** The agent prompts enforce `dir="rtl"`, Hebrew-only copy, and premium design standards.
- **Developer node uses XML `<file>` extraction**, not just LangChain tool calls. The LLM outputs `<file path="src/App.tsx">...</file>` blocks that get parsed and written to the sandbox.
- **Scaffold lock**: Protected files (`tailwind.config.js`, `index.html`, `vite.config.ts`, `tsconfig.json`) cannot be modified by the Developer unless QA errors explicitly reference them.
- **Component naming guard**: The navigation component must be `Navbar.tsx`, never `Navigation.tsx` (enforced in both XML parser and tool guards).
- **WebContainers require COOP/COEP headers** — configured in `next.config.ts` (`Cross-Origin-Embedder-Policy: require-corp`, `Cross-Origin-Opener-Policy: same-origin`).
- **Message trimming**: Developer node trims message history to 80 messages, pinning system prompt and manifest to prevent context overflow.
- **LLM fallbacks**: Claude models fall back to GPT-4o via LangChain's `.withFallbacks()` on rate limit (429/529) errors.

## Verification (MUST run after changes)

- After editing frontend `.ts`/`.tsx` files: `npx tsc --noEmit`
- After editing `agent-backend/` `.ts` files: `cd agent-backend && npx tsc --noEmit`
- After changing `graph.ts`: also run `cd agent-backend && npm run build` to catch runtime issues
- Run the relevant type check BEFORE saying you are done with a task

## Two-Package Monorepo Rules

- Frontend (root `package.json`): Next.js, `@webcontainer/api`, `framer-motion`, `three`, `@supabase/ssr`, React, Tailwind
- Backend (`agent-backend/package.json`): `@langchain/*`, `playwright`, `express`, `openai`, `zod`
- NEVER install a dependency in the wrong package.json. If unsure, check both before adding.
- Both servers must run simultaneously for the app to work (`npm run dev` in root AND `cd agent-backend && npm run dev`).

## Critical Invariants

- `agent-backend/src/orchestrator/graph.ts` (~630 lines) is the most complex and important file. Read it fully before editing. Prefer surgical edits over rewrites. Never rewrite it wholesale.
- The XML `<file>` extraction regex (`fileRegex`) and scaffold lock logic are load-bearing — do not refactor casually.
- Message trimming (`trimMessages`) prevents context overflow in the LLM agent loop. Changes to message flow must account for token limits.
- SSE streaming connects frontend to backend — `console.log` patterns in `graph.ts` affect what the user sees in real time.
- The sandbox uses a real filesystem under `/tmp/sites/{uuid}`. The symlinked `node_modules` is fragile — don't change `SandboxManager` without testing end-to-end.
- `scaffold/` files are the template injected into every sandbox. Changes here affect ALL generated sites.

## Do NOT

- Refactor the LangGraph state machine shape without understanding all conditional edges and the `routeAfterQA` function.
- Change model names or parameters without explicit request — these are tuned for cost/quality tradeoffs.
- Mix up `console.log` patterns in graph nodes — the frontend parses these for SSE streaming.

## Working with graph.ts

Before making changes to `graph.ts`, always:
1. Read the full file first
2. Identify which node (PM / Developer / QA) you are modifying
3. Understand the message flow: messages accumulate across nodes and loop iterations
4. Check if your change affects the `trimMessages` window or the `routeAfterQA` conditional
5. Verify with `cd agent-backend && npm run build` after changes
