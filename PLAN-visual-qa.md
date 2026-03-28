# Implementation Plan: Visual QA Node with Screenshot-Based UI Review

## Problem

The current QA node only runs **static checks** (`tsc --noEmit` + `npm run build`). This catches type errors and bundler issues but is completely blind to:

- Broken layouts / overlapping elements
- Wrong RTL rendering
- Missing animations / icons not loading
- Poor spacing, unreadable text, bad contrast
- Components not matching the spec's "Awwwards/Dribbble quality" bar
- Unsplash images failing to load
- Empty sections / blank pages

## Approach: Screenshot + Vision LLM (No Playwright Needed on Server)

### Why NOT Playwright in the QA node?

The sandbox runs as a **local filesystem Vite project** on the agent-backend server. We *could* use Playwright here, but there's a simpler, more reliable approach:

1. **Start the Vite preview server** in the sandbox (already supported via `tools.npmRun`)
2. **Use Playwright only to screenshot** (headless Chromium — lightweight)
3. **Send the screenshot to a Vision LLM** (Claude or GPT-4o-vision) to assess UI quality against the spec

This is superior to traditional visual regression because there's **no baseline image** to compare against — we need an LLM to judge quality from the spec.

### Why not just Playwright assertions?

Playwright's built-in assertions (`toBeVisible`, `toHaveCSS`) can catch some issues, but they can't judge aesthetic quality, design coherence, or "vibe". The spec demands Awwwards-quality design — only a vision model can assess that.

## Architecture

```
Current Pipeline:
  PM → Developer → QA (tsc + build) → route

Enhanced Pipeline:
  PM → Developer → QA (tsc + build + visual) → route
                         │
                         ├── 1. tsc --noEmit (existing)
                         ├── 2. npm run build (existing)
                         ├── 3. npm run preview (NEW — start server)
                         ├── 4. Playwright screenshot (NEW — headless)
                         └── 5. Vision LLM review (NEW — Claude/GPT-4o)
```

## Implementation Steps

### Step 1: Install Playwright in agent-backend

Add `playwright` (not `@playwright/test`) as a dependency in `agent-backend/package.json`. We only need the browser automation library, not the test runner.

```bash
cd agent-backend && npm install playwright
npx playwright install chromium
```

### Step 2: Create `agent-backend/src/tools/screenshot.ts`

New tool module that:

1. Starts `npm run preview` (or `npm run dev`) in the sandbox as a child process
2. Waits for the server to be ready (parse stdout for the URL)
3. Launches headless Chromium via Playwright
4. Takes screenshots at 3 viewports:
   - **Desktop**: 1440x900
   - **Tablet**: 768x1024
   - **Mobile**: 375x812
5. Takes a **full-page** screenshot (scrolled) for each viewport
6. Kills the preview server process
7. Returns screenshot buffers (PNG)

```typescript
// Skeleton
export async function takeScreenshots(sandboxPath: string): Promise<{
  desktop: Buffer;
  tablet: Buffer;
  mobile: Buffer;
}> { ... }
```

### Step 3: Create `agent-backend/src/tools/visualReview.ts`

New tool module that:

1. Accepts screenshot buffers + the original `spec.md` content
2. Sends them to a vision-capable LLM (Claude claude-sonnet-4-6 preferred for cost/speed balance)
3. Uses a structured prompt asking the LLM to evaluate:
   - **Layout correctness**: RTL direction, section order, no overlaps
   - **Visual quality**: Glassmorphism, shadows, gradients present
   - **Typography**: Hebrew text rendering, font sizes, hierarchy
   - **Responsiveness**: Each viewport looks intentional
   - **Animations**: framer-motion attributes present in DOM (can check via Playwright `evaluate()`)
   - **Images**: Unsplash images loaded (check naturalWidth > 0)
   - **Overall "vibe" score**: 1-10 against spec requirements
4. Returns structured JSON:

```typescript
interface VisualQAResult {
  passed: boolean;           // true if score >= 7 and no critical issues
  score: number;             // 1-10
  criticalIssues: string[];  // Must fix (blank page, broken layout, no RTL)
  warnings: string[];        // Should fix (poor spacing, missing shadows)
  suggestions: string[];     // Nice to have
}
```

### Step 4: Add Playwright-based DOM checks in screenshot step

Before sending to the vision LLM, run quick automated checks via Playwright's page API:

```typescript
// Inside the screenshot function, after page loads:
const domChecks = await page.evaluate(() => ({
  hasRtlDir: document.documentElement.dir === 'rtl' || document.body.dir === 'rtl',
  hasHebrew: /[\u0590-\u05FF]/.test(document.body.innerText),
  imageCount: document.querySelectorAll('img').length,
  brokenImages: [...document.querySelectorAll('img')].filter(img => !img.naturalWidth).length,
  hasMotionElements: document.querySelectorAll('[style*="transform"]').length > 0,
  sectionCount: document.querySelectorAll('section, [class*="section"]').length,
  isBlankPage: document.body.innerText.trim().length < 50,
}));
```

These checks are cheap, deterministic, and don't need an LLM. They can trigger an instant fail before spending tokens on vision review.

### Step 5: Modify `qaNode` in `graph.ts`

Update the QA node to run visual QA **after** the existing static checks pass:

```typescript
async function qaNode(state: OrchestrationState) {
  // --- Existing: Static checks ---
  const tsResult = await tools.runTypeScript(state.sandboxPath);
  if (!tsResult.includes("Success:")) {
    return { status: "failed", errorLogs: `TypeScript errors:\n${tsResult}`, ... };
  }

  const buildResult = await tools.npmRun(state.sandboxPath, "build");
  if (!buildResult.includes("Command executed successfully")) {
    return { status: "failed", errorLogs: `Build failed:\n${buildResult}`, ... };
  }

  // --- NEW: Visual QA ---
  console.log("🎨 [QA] Running visual review...");

  const screenshots = await takeScreenshots(state.sandboxPath);
  const domChecks = screenshots.domChecks; // returned alongside buffers

  // Fast-fail on critical DOM issues (no LLM needed)
  if (domChecks.isBlankPage) {
    return { status: "failed", errorLogs: "CRITICAL: Page is blank...", ... };
  }

  const spec = await tools.readFile(state.sandboxPath, "spec.md");
  const visualResult = await runVisualReview(screenshots, spec);

  if (!visualResult.passed) {
    const errorReport = formatVisualErrors(visualResult);
    return {
      status: "failed",
      errorLogs: errorReport,
      messages: [...state.messages, new HumanMessage(
        `[Visual QA] UI issues detected (score: ${visualResult.score}/10):\n${errorReport}\n\nFix the critical issues using <file> blocks.`
      )]
    };
  }

  return { status: "success", errorLogs: null, ... };
}
```

### Step 6: Add `preview` script to scaffold package.json

The scaffold's `package.json` needs a preview script that serves the built output:

```json
{
  "scripts": {
    "preview": "vite preview --port 4173 --host"
  }
}
```

This serves the `dist/` folder (from `npm run build`) on a local port. Since we already run `build` in QA before visual checks, the dist will be ready.

### Step 7: Update `tools/index.ts`

Export the new screenshot and visual review functions from the tools module, and add `"preview"` to the `npmRun` whitelist (it's already there based on the code).

### Step 8: Handle process cleanup

The preview server must be killed after screenshots are taken, even if an error occurs. Use try/finally:

```typescript
let serverProcess: ChildProcess | null = null;
try {
  serverProcess = spawn('npm', ['run', 'preview'], { cwd: sandboxPath });
  // ... wait for ready, take screenshots
} finally {
  serverProcess?.kill('SIGTERM');
}
```

### Step 9: Tune iteration limits

Visual QA adds a new failure mode. Consider:
- Keep max iterations at 6 (current)
- Visual QA failures count toward the same iteration budget
- If iteration >= 5 and only visual issues remain (build passes), force success with warnings logged
- This prevents infinite loops where the LLM vision model keeps finding minor issues

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `agent-backend/package.json` | MODIFY | Add `playwright` dependency |
| `agent-backend/src/tools/screenshot.ts` | CREATE | Playwright screenshot utility |
| `agent-backend/src/tools/visualReview.ts` | CREATE | Vision LLM review utility |
| `agent-backend/src/tools/index.ts` | MODIFY | Export new tools |
| `agent-backend/src/orchestrator/graph.ts` | MODIFY | Integrate visual QA into qaNode |
| `agent-backend/scaffold/package.json` | MODIFY | Ensure `preview` script exists |

## Cost & Performance Considerations

- **Playwright screenshot**: ~3-5 seconds (headless Chromium, 3 viewports)
- **Vision LLM call**: ~5-10 seconds, ~$0.01-0.03 per review (Claude Sonnet with 3 images)
- **Total added time per QA iteration**: ~10-15 seconds
- **Chromium install**: One-time ~150MB download (can be cached in Docker)
- **Only runs if static checks pass** — no wasted vision calls on broken builds

## Future Enhancements (Out of Scope)

- Video capture of scroll animations (framer-motion validation)
- Accessibility audit (axe-core integration)
- Lighthouse performance scoring
- Side-by-side comparison with reference designs
- User-provided reference images for style matching
