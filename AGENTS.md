# Repository Guidelines

## Project Structure & Module Organization
The frontend is a Next.js App Router project under `src/`. Put routes in `src/app`, shared UI in `src/components`, server actions in `src/actions`, hooks in `src/hooks`, and Supabase helpers in `src/utils/supabase`. Static assets live in `public/`.

The separate backend lives in `agent-backend/`. Its runtime code is under `agent-backend/src`, with orchestration logic in `src/orchestrator`, tooling in `src/tools`, sandbox code in `src/sandbox`, and data helpers in `src/db`. `agent-backend/scaffold/` contains the generated app scaffold.

## Build, Test, and Development Commands
- `npm run dev`: start the Next.js frontend on `http://127.0.0.1:3000`.
- `npm run build`: produce a production frontend build.
- `npm run start`: serve the built frontend.
- `npm run lint .`: run ESLint for the frontend repository.
- `cd agent-backend && npm run dev`: run the backend with `nodemon` and `ts-node`.
- `cd agent-backend && npm run build`: compile backend TypeScript to `dist/`.
- `cd agent-backend && npm run start`: run the compiled backend.
- `npx playwright test`: run E2E tests when `tests/e2e` is populated.

## Coding Style & Naming Conventions
Use TypeScript throughout. Formatting is 2-space indentation, double quotes, semicolons, trailing commas, and a 100-character line width, matching `.prettierrc` and `biome.json`. Prefer `@/` imports in frontend code.

Name React components in `PascalCase`, hooks with a `use` prefix, route folders in lowercase, and utility modules with descriptive lowercase names such as `utils.ts` or `server.ts`.

## Testing Guidelines
Playwright is configured in `playwright.config.ts` with `testDir` set to `tests/e2e` and a local web server on port `3000`. Add browser tests as `*.spec.ts` files under that directory.

There is no committed frontend unit-test harness yet, so validate changes with targeted manual checks and `npm run lint .`. For backend changes, at minimum run `cd agent-backend && npm run build` before opening a PR.

## Commit & Pull Request Guidelines
Recent commits use short, task-focused summaries such as `refactoring to prod lvl graph` and `geminai 3.1 checkpoint`. Keep messages concise and scope each commit to one coherent change.

PRs should include a clear summary, linked issue or planning doc when relevant, notes on any env or schema changes, and screenshots or short recordings for UI updates. Call out the commands you ran to verify the change.

## Security & Configuration Tips
`.env*` files are ignored; keep Supabase, OpenAI, and Anthropic credentials local only. Do not commit temporary workspace data from `tmp/` or agent artifacts from `.agents/`.
