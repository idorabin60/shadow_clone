# Production Readiness Checklist

Things to fix before deploying Shadow Clone to production.
Generated from architecture review on 2026-04-11.

---

## Critical (Will Break in Prod)

### 1. Hardcoded Node.js Path
**File:** `agent-backend/src/tools/index.ts`
The sandbox tools prepend `/Users/idorabin/.nvm/versions/node/v22.20.0/bin` to PATH.
This is a local dev machine path — will fail on any other machine/container.

**Fix:** Use `which node` or `process.execPath` at startup to resolve the Node binary path dynamically. Or set it via env var (`NODE_BIN_DIR`).

### 2. Hardcoded /tmp/sites Sandbox Path
**File:** `agent-backend/src/sandbox/SandboxManager.ts`
Sandboxes are created under `/tmp/sites/{uuid}`. In containerized environments:
- `/tmp` may not be writable or may have limited space
- Multiple replicas would collide on the same `/tmp`

**Fix:** Use an env var (`SANDBOX_ROOT_DIR`) defaulting to `/tmp/sites`. In k8s/Docker, mount a dedicated volume.

### 3. Symlinked node_modules in Sandbox
**File:** `agent-backend/src/sandbox/SandboxManager.ts`
The sandbox symlinks `node_modules` from a local path. This assumes the scaffold's dependencies are pre-installed on the host machine.

**Fix:** Either:
- Bake `node_modules` into the Docker image during build
- Use a shared read-only volume mount
- Run `npm ci` in each sandbox (slow but reliable)

---

## High Priority (Will Cause Issues at Scale)

### 4. LangGraph Checkpointing
**Files:** `agent-backend/src/orchestrator/graph.ts`
No persistence/checkpointing. If the server crashes mid-generation (OOM, timeout, deploy), all progress is lost. A full generation costs $3-10 in API calls.

**Fix:** Add LangGraph `SqliteSaver` or `PostgresSaver`:
```ts
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
const checkpointer = SqliteSaver.fromConnString("./checkpoints.db");
export const orchestratorApp = workflow.compile({ checkpointer });
```
Then on crash recovery, resume from the last checkpoint instead of restarting.

### 5. No Request Queue / Concurrency Control
**File:** `agent-backend/src/index.ts`
Each `POST /api/orchestrate` spawns a full pipeline (multiple Opus calls, Playwright browser). With concurrent users, the server will OOM or hit API rate limits.

**Fix:** Add a job queue (BullMQ + Redis, or pg-boss with Supabase). Limit concurrency to 2-3 simultaneous generations based on available memory.

### 6. Playwright in Production
**File:** `agent-backend/src/tools/screenshot.ts`
Playwright launches a full Chromium browser per QA run. In production:
- Needs Chromium installed (not bundled by default in slim Docker images)
- Each browser instance uses ~200-500MB RAM
- Headless Chromium can leak if cleanup fails

**Fix:**
- Use `playwright install chromium` in Dockerfile
- Add explicit browser process cleanup with `finally` blocks
- Consider a dedicated screenshot microservice to isolate memory usage
- Set `--disable-dev-shm-usage` and `--no-sandbox` flags for Docker

### 7. Visual QA Score Noise
**File:** `agent-backend/src/tools/visualReview.ts`
GPT-4o vision scoring is non-deterministic. Same screenshots can score 6 or 8. A score of 6 triggers a $2+ re-generation loop.

**Fix options:**
- Add structured sub-scores (layout: X, typography: X, etc.) and pass/fail on individual criteria instead of a single number
- Cache scores for identical screenshots (content-hash based)
- Use majority vote (3 calls, take median) for borderline scores (5-7)
- Lower the pass threshold from 7 to 6 for the first iteration

---

## Medium Priority (Quality of Life)

### 8. Cost Tracking Persistence
Cost is now tracked across nodes (just added), but only logged to stdout. For billing/analytics you need it persisted.

**Fix:** After pipeline completes, write `costTracker.total()` to the Supabase `projects` table (add a `generation_cost_usd` column).

### 9. editGraph Code Duplication
**File:** `agent-backend/src/orchestrator/editGraph.ts`
The edit graph re-implements XML parsing and guard logic inline instead of using `xmlParser.ts`. Bug fixes to the main parser won't apply to edits.

**Fix:** Refactor `editGraph.ts` to use `parseXmlFiles()` from `xmlParser.ts`.

### 10. Platform-Dependent Commands
**File:** `agent-backend/src/tools/index.ts`
`find . -type f` for listing files — works on macOS/Linux, may behave differently on other platforms.

**Fix:** Use Node.js `fs.readdir` with `recursive: true` (Node 18.17+) instead of shelling out.

### 11. Secret Management
**Files:** `.env.local`, `agent-backend/.env`
API keys (Anthropic, OpenAI, Supabase service key) are in `.env` files. Fine for dev, not for prod.

**Fix:** Use a secrets manager (AWS Secrets Manager, GCP Secret Manager, Vault) or inject via CI/CD env vars. Never bake into Docker images.

### 12. Error Reporting
Currently errors are logged to stdout only. In prod you need structured error tracking.

**Fix:** Add Sentry or similar:
```ts
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```
Wrap graph node functions with Sentry breadcrumbs.

---

## Nice to Have

### 13. Health Check Endpoint
Add `GET /health` that checks:
- Supabase connectivity
- Anthropic API key validity (dry-run)
- `/tmp` writability
- Chromium availability

### 14. Graceful Shutdown
Handle `SIGTERM` — finish in-progress generations before exiting, or checkpoint and exit.

### 15. Rate Limiting
Add rate limiting on `POST /api/orchestrate` per user to prevent abuse.

### 16. Monitoring Dashboard
Ship structured logs (JSON format) to a log aggregator. Build a dashboard showing:
- Generations per hour
- Average cost per generation
- QA pass rate by iteration
- Model fallback frequency
