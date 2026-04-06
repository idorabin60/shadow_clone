# UI Intelligence Integration Plan

> **Status:** Complete  
> **Last Updated:** 2026-04-04  
> **Scope:** Replace hardcoded design rules with data-driven design intelligence  
> **Dependencies:** Completed production refactor (PRODUCTION_PLAN.md)

---

## Problem

Every generated site looks the same because design decisions are hardcoded in prompts:
- Glassmorphism cards (`bg-white/10 backdrop-blur-md`) — every site
- Same fade-up animation (`opacity: 0, y: 40`) — every section, every site
- Same spacing (`py-24 md:py-32`) — every site
- Same image style (`rounded-2xl shadow-2xl`) — every site
- Heebo font — every site, regardless of brand personality
- Same dark gradient theme — every site

The AI controls content and colors. It does NOT control design style.

---

## Solution: Two Tools

### 1. ui-ux-pro-max (Design Knowledge Base)

**What it is:** A structured dataset (~45KB SKILL.md + CSV databases + Python search engine) that maps business types to recommended design systems.

**Key data files:**
| CSV | Records | Contains |
|---|---|---|
| `styles.csv` | 67 styles | Minimalism, Neumorphism, Glassmorphism, Brutalism, etc. with colors, effects, best-for/not-for, CSS keywords |
| `colors.csv` | 161 palettes | Color schemes organized by industry/product type |
| `typography.csv` | 57 pairings | Google Font pairs with mood descriptors and best-for usage |
| `products.csv` | 161 types | Product category → recommended style, colors, patterns |
| `ui-reasoning.csv` | 161 rules | Decision rules: "SaaS → Glassmorphism + Flat, trust blue, professional typography" |
| `landing.csv` | — | Landing page structures and CTA strategies per business type |
| `google-fonts.csv` | — | Full Google Fonts database |

**Search engine:** `search.py` (BM25 + regex) and `design_system.py` (generates full design system by querying multiple CSVs).

**How we use it:** PM node runs the design system generator before writing spec.md. Instead of hardcoded glassmorphism rules, the PM gets a data-driven recommendation: "for a luxury restaurant → editorial dark style, Cormorant Garamond + Inter fonts, warm gold accent, large hero imagery, no glassmorphism."

**Repo:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill  
**Install:** `npx uipro-cli init --ai claude`

---

### 2. @21st-dev/magic (Component Library API)

**What it is:** An MCP server that provides access to 21st.dev's production-quality component library.

**4 tools exposed:**

| Tool | Type | Usable Server-Side? | Purpose |
|---|---|---|---|
| `21st_magic_component_inspiration` | Pure HTTP API | **Yes** | Search for component references by query (e.g. "hero section dark editorial") |
| `21st_magic_component_refiner` | Pure HTTP API | **Yes** | Refine/improve an existing component given feedback |
| `21st_magic_component_builder` | Opens browser | **No** — requires user interaction | Generate new component via 21st.dev web UI |
| `logo_search` | Pure HTTP API | **Yes** | Search for brand logos in JSX/TSX/SVG format |

**Key insight:** We do NOT need the MCP server process. The two tools we need (`inspiration` and `refiner`) are direct HTTP POST calls to `https://magic.21st.dev/api/`. We can call them directly from Node.js.

**API endpoints:**
- `POST https://magic.21st.dev/api/fetch-ui` — search for component inspiration
- `POST https://magic.21st.dev/api/refine-ui` — refine an existing component
- Auth: `x-api-key` header with API key from https://21st.dev/magic

**How we use it:** Before writing each component, the parallel writer searches 21st.dev for reference components matching that section type + design style. The AI adapts the reference with business-specific colors, Hebrew text, and images.

---

## Architecture After Integration

```
User Prompt: "עסק לעיצוב פנים" (interior design business)
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  Design System Generator (NEW)                               │
│  python3 design_system.py "interior design luxury"           │
│  → style: Editorial Dark                                     │
│  → fonts: Cormorant Garamond + Heebo (Hebrew fallback)       │
│  → palette: warm neutrals + gold accent                      │
│  → effects: subtle parallax, no glassmorphism                │
│  → layout: large imagery, generous whitespace                │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│  PM Node (enhanced with design system data)                  │
│  Writes spec.md using the design system recommendation       │
│  → Dynamic style, NOT hardcoded glassmorphism                │
│  → Business-specific font pairing, NOT always Heebo          │
│  → Data-driven color palette, NOT random                     │
│  → Recommended section structure from landing.csv            │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│  Parallel Writer (enhanced with 21st.dev references)         │
│                                                              │
│  For each component:                                         │
│  1. Search 21st.dev: "hero editorial dark large image"       │
│  2. Get reference component code                             │
│  3. Write adapted version: Hebrew text, business colors,     │
│     business images, following the design system style        │
│                                                              │
│  index.css: DYNAMIC (font from design system, not Heebo)     │
│  App.tsx: same as now (imports + renders)                     │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│  QA Node (enhanced with refiner)                             │
│  If visual QA fails:                                         │
│  → Call 21st.dev refine-ui API on failing components         │
│  → Get improved version based on QA feedback                 │
│  → Pass to developer fix loop as reference                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Tasks

### Phase 1 — Design System Generator (ui-ux-pro-max data)

Goal: Replace hardcoded design rules with a data-driven design system that varies per business.

---

#### Task 1.1 — Install ui-ux-pro-max Data Files
**Status:** `[x] Done`

**What:** Install the ui-ux-pro-max CSV databases and Python search engine into the agent-backend.

**Steps:**
1. Run `npx uipro-cli init --ai claude` in the project root to get the skill files
2. Copy the CSV data files and Python scripts (`search.py`, `design_system.py`, `core.py`) into `agent-backend/src/design-data/`
3. Verify the Python scripts run: `python3 design_system.py "restaurant luxury"` should return a structured recommendation
4. Add `design-data/` to the repo (these are static data, not generated)

**Files:**
- Create: `agent-backend/src/design-data/` (CSVs + Python scripts)

**Test:** `python3 agent-backend/src/design-data/design_system.py "SaaS startup"` returns a valid JSON design system.

---

#### Task 1.2 — Design System Service
**Status:** `[x] Done`

**What:** Create a TypeScript service that calls the Python design system generator and returns a typed result.

**Files:**
- Create: `agent-backend/src/orchestrator/designSystem.ts`

**Exports:**
```typescript
export interface DesignSystemRecommendation {
    style: {
        name: string;           // e.g. "Editorial Dark", "Minimalist Clean"
        keywords: string[];     // CSS/design keywords
        effects: string[];      // e.g. ["parallax", "glassmorphism", "grain-texture"]
        antiPatterns: string[]; // e.g. ["avoid neon colors", "no heavy shadows"]
    };
    colors: {
        primary: string;        // hex
        secondary: string;
        accent: string;
        background: string;     // hex or Tailwind gradient string
        textPrimary: string;
        textSecondary: string;
    };
    typography: {
        headingFont: string;    // Google Font name
        bodyFont: string;       // Google Font name (Hebrew-compatible)
        googleImportUrl: string; // full @import URL
        heroSize: string;       // Tailwind classes
        sectionSize: string;
        bodySize: string;
    };
    layout: {
        spacing: string;        // e.g. "generous" or "compact"
        cardStyle: string;      // e.g. "glassmorphism" or "solid-shadow" or "flat"
        imageStyle: string;     // e.g. "rounded-2xl shadow-2xl" or "sharp-corners"
        animationStyle: string; // e.g. "fade-up" or "slide-in" or "parallax"
    };
    sectionRecommendations: string[]; // e.g. ["Hero", "Portfolio Gallery", "Services", "Testimonials", "Contact"]
}

export async function generateDesignSystem(
    businessType: string,
    businessDescription: string,
    tone?: string
): Promise<DesignSystemRecommendation>;
```

**Implementation:** Spawns `python3 design_system.py` with the business query, parses the JSON output, maps it to the `DesignSystemRecommendation` interface. Falls back to a sensible default (current hardcoded values) if Python fails.

**Test:** `npx tsc --noEmit` passes. Unit test: call with "law firm professional" and verify all fields are populated.

---

#### Task 1.3 — Integrate Design System into PM Node
**Status:** `[x] Done`

**What:** The PM node calls `generateDesignSystem()` before writing spec.md. The design system recommendation is injected into the PM prompt, replacing the hardcoded Color Palette / Typography / Design System Rules sections.

**Current PM prompt (hardcoded):**
```
## Color Palette
- Primary: #hex (main brand color — choose based on business type and tone)
...
## Typography
- Font Family: Heebo (Hebrew-optimized Google Font)
...
## Design System Rules
- Cards: glassmorphism (bg-white/10 backdrop-blur-md border border-white/20 ...)
- Animations: framer-motion on every section (fade-up...)
```

**New PM prompt (data-driven):**
```
DESIGN SYSTEM RECOMMENDATION (from analysis of ${businessType}):
${JSON.stringify(designSystem, null, 2)}

Use this recommendation as your design foundation. You may adjust colors
to match the specific brand, but follow the recommended style, typography,
layout patterns, and animation approach. Do NOT default to glassmorphism
unless the recommendation specifically suggests it.

Your spec.md MUST include:
## Color Palette — use the recommended palette as a starting point
## Typography — use the recommended font pairing (ensure Hebrew support)
## Design System Rules — follow the recommended style, card treatment, animation approach
```

**Files:**
- Edit: `graph.ts` — `productManagerNode` (call design system, inject into prompt)

**Test:** Run a generation for "law firm" and "kids coding school" — confirm they get different styles in spec.md, not both glassmorphism.

---

#### Task 1.4 — Dynamic index.css Generation
**Status:** `[x] Done`

**What:** Replace the hardcoded `generateIndexCss()` in `parallelWriter.ts` (always Heebo) with a dynamic version that uses the font from the design system.

**Current (hardcoded):**
```css
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');
html { font-family: 'Heebo', sans-serif; direction: rtl; }
```

**New (dynamic):**
```typescript
function generateIndexCss(designSystem: DesignSystemRecommendation): string {
    return `${designSystem.typography.googleImportUrl}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        font-family: '${designSystem.typography.bodyFont}', '${designSystem.typography.headingFont}', sans-serif;
        direction: rtl;
    }
    body {
        @apply antialiased;
    }
}`;
}
```

**Constraint:** The body font MUST support Hebrew. The design system generator should ensure at least one Hebrew-compatible font is included (Heebo, Assistant, Rubik, Secular One, etc.). If the recommended fonts don't support Hebrew, Heebo is added as a fallback.

**Files:**
- Edit: `parallelWriter.ts` — `generateIndexCss()` accepts design system
- Edit: `designSystem.ts` — ensure Hebrew font fallback logic

**Test:** Generate for "tech startup" — confirm index.css has different fonts than Heebo (if recommendation differs). Confirm Hebrew still renders correctly.

---

### Phase 2 — Component Inspiration (21st.dev API)

Goal: Each component gets a real production-quality reference before being written.

---

#### Task 2.1 — 21st.dev API Client
**Status:** `[x] Done`

**What:** Create a lightweight HTTP client for the 21st.dev magic API. No MCP server process needed — these are direct REST calls.

**Files:**
- Create: `agent-backend/src/orchestrator/magicClient.ts`

**Exports:**
```typescript
export interface ComponentInspiration {
    query: string;
    results: {
        name: string;
        description: string;
        code: string;       // actual component code
        preview?: string;   // preview URL if available
    }[];
}

/** Search 21st.dev for component inspiration */
export async function searchComponents(query: string): Promise<ComponentInspiration>;

/** Refine an existing component based on feedback */
export async function refineComponent(
    currentCode: string,
    feedback: string,
    context: string
): Promise<string>;
```

**Implementation:**
- `searchComponents`: POST to `https://magic.21st.dev/api/fetch-ui` with `{ message, searchQuery }`, auth via `x-api-key` header
- `refineComponent`: POST to `https://magic.21st.dev/api/refine-ui` with `{ userMessage, fileContent, context }`
- API key from `process.env.TWENTYFIRST_API_KEY`
- Timeout: 15 seconds per call
- Graceful fallback: if API fails, return empty results (pipeline continues without reference)

**Environment:**
- Add `TWENTYFIRST_API_KEY` to `agent-backend/.env`

**Test:** `npx tsc --noEmit` passes. Manual test: call `searchComponents("hero section dark theme")` and log the response.

---

#### Task 2.2 — Integrate Inspiration into Parallel Writer
**Status:** `[x] Done`

**What:** Before writing each component, the parallel writer searches 21st.dev for a reference component matching the section type + design style.

**Current flow in `writeSingleComponent()`:**
```
1. Build prompt with section description + shared design context
2. Call Sonnet to write the component
```

**New flow:**
```
1. Search 21st.dev: searchComponents("${comp.componentName} ${designStyle}")
2. If results found, include the top result's code as a reference in the prompt
3. Build prompt with section description + shared design context + reference component
4. Call Sonnet to write the component, adapting the reference
```

**Updated prompt addition:**
```
REFERENCE COMPONENT (from 21st.dev — adapt this design, do not copy verbatim):
\`\`\`tsx
${referenceCode}
\`\`\`
Adapt this reference for the current business:
- Replace all text with Hebrew content from the spec
- Use the exact colors from the Color Palette
- Use images relevant to this business from Image Strategy
- Keep the layout structure and design patterns from the reference
- Ensure RTL compatibility (dir="rtl", text-right, flex-row-reverse)
```

**Rate limiting:** With MAX_CONCURRENT=3 parallel component writes, we'll have at most 3 concurrent API calls to 21st.dev. Add a small delay (500ms) between chunks if needed.

**Fallback:** If `searchComponents()` returns empty or fails, the component is written without a reference (same as current behavior). The pipeline never breaks due to 21st.dev being unavailable.

**Files:**
- Edit: `parallelWriter.ts` — `writeSingleComponent()` calls `searchComponents()` first
- Pass design style from spec into the parallel writer

**Test:** Run a generation. Confirm each component log shows "inspiration_found: true/false". Compare visual quality of generated components with and without references.

---

#### Task 2.3 — Integrate Inspiration into Dev Fix Loop
**Status:** `[x] Done`

**What:** When the developer fix loop (Phase B) needs to rewrite a component, it can search for inspiration for that specific component type. This is lower priority than 2.2 (fix loops deal with errors, not design) but helps when visual QA fails.

**Where:** In `graph.ts`, when `classifyError()` returns a `visual` type error, search 21st.dev for better references for the failing components.

**Files:**
- Edit: `graph.ts` — `developerNode` Phase B, visual error handling

**Test:** Trigger a visual QA failure. Confirm the fix prompt includes a reference component from 21st.dev.

---

### Phase 3 — Component Refinement (21st.dev Refine API)

Goal: Use 21st.dev's refine API to improve components after visual QA feedback.

---

#### Task 3.1 — Refiner Integration in QA → Developer Flow
**Status:** `[x] Done`

**What:** When visual QA fails with specific component feedback (e.g. "Hero section lacks visual impact"), call `refineComponent()` with the current code + QA feedback before sending to the developer fix loop. The refined version becomes part of the targeted fix prompt.

**Flow:**
```
QA fails (visual, score 5/10):
  "Hero section: lacks visual impact, too much whitespace"
  "Footer: copyright text not visible"
    │
    ▼
For each affected component:
  1. Read current component code from sandbox
  2. Call refineComponent(currentCode, qaFeedback, designContext)
  3. Get improved version from 21st.dev
    │
    ▼
Developer fix prompt now includes:
  "Here is a refined version of Hero.tsx from the design system. 
   Adapt it with the correct Hebrew content and colors: [refined code]"
```

**Files:**
- Edit: `graph.ts` — between QA failure and developer re-entry
- Alternatively: edit `errorClassifier.ts` — `buildTargetedFixPrompt()` accepts optional refined code

**Constraint:** Only for `visual` error type. TypeScript and build errors don't benefit from design refinement.

**Fallback:** If refine API fails or times out (10s), skip refinement and use the existing targeted fix prompt.

**Test:** Trigger a visual QA failure. Confirm the developer receives a refined reference. Compare fix quality with and without refinement.

---

### Phase 4 — Remove All Hardcoded Design

Goal: Final cleanup — the pipeline is fully data-driven with no hardcoded design opinions.

---

#### Task 4.1 — Remove Hardcoded Design Rules from Dev Prompt
**Status:** `[x] Done`

**What:** The developer prompt in `graph.ts:290-333` still contains hardcoded design rules. Replace them with dynamic rules from the design system.

**Remove these hardcoded lines:**
```
- "Glassmorphism cards: bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-6"
- "wrap every section in <motion.div> with viewport-triggered fade-up (initial={{ opacity: 0, y: 40 }}...)"
- "rounded-2xl shadow-2xl object-cover" (images)
- The fixed spacing rules
```

**Replace with:**
```
DESIGN SYSTEM (from spec.md — follow these rules exactly):
- Style: ${designSystem.style.name}
- Card treatment: ${designSystem.layout.cardStyle}
- Animation approach: ${designSystem.layout.animationStyle}
- Image style: ${designSystem.layout.imageStyle}
- Spacing: ${designSystem.layout.spacing}
- Effects: ${designSystem.style.effects.join(', ')}
- Anti-patterns to AVOID: ${designSystem.style.antiPatterns.join(', ')}
```

**Files:**
- Edit: `graph.ts` — `developerNode` prompt construction

**Test:** Generate two sites for different business types. Confirm they use visibly different design systems (not both glassmorphism).

---

#### Task 4.2 — Remove Hardcoded Design Rules from Parallel Writer
**Status:** `[x] Done`

**What:** The parallel writer prompt in `parallelWriter.ts:141-160` has the same hardcoded rules. Replace them with design system values.

**Remove:**
```
- "Wrap the outermost element in <motion.div> with: initial={{ opacity: 0, y: 40 }}..."
- "Style: rounded-2xl shadow-2xl object-cover" (images)
- Hardcoded Tailwind classes for spacing
```

**Replace with design system values passed into `writeSingleComponent()`.

**Files:**
- Edit: `parallelWriter.ts` — `writeSingleComponent()` prompt + function signature
- Edit: `parallelWriter.ts` — `writeAllComponentsParallel()` accepts design system

**Test:** `npx tsc --noEmit` passes. Generate a site — confirm component animations/cards/images follow the design system, not hardcoded values.

---

#### Task 4.3 — Hebrew Font Guarantee
**Status:** `[x] Done`

**What:** The design system may recommend fonts that don't support Hebrew. Add a validation layer that ensures at least one Hebrew-compatible font is always included.

**Hebrew-compatible Google Fonts:**
`Heebo`, `Assistant`, `Rubik`, `Secular One`, `Noto Sans Hebrew`, `Frank Ruhl Libre`, `Suez One`, `Amatic SC`, `Varela Round`, `Open Sans` (partial)

**Logic in `designSystem.ts`:**
```typescript
const HEBREW_FONTS = ['Heebo', 'Assistant', 'Rubik', 'Secular One', ...];

// If recommended bodyFont is not Hebrew-compatible, swap it
if (!HEBREW_FONTS.includes(recommendation.typography.bodyFont)) {
    recommendation.typography.bodyFont = 'Heebo'; // safe default
}
// Always include a Hebrew font in the import URL
```

**Files:**
- Edit: `designSystem.ts` — font validation

**Test:** Run design system generator for an English-centric business type. Confirm the output still includes a Hebrew-compatible body font.

---

## Execution Order

```
Phase 1: 1.1 → 1.2 → 1.3 → 1.4   (design intelligence — no external API dependency)
Phase 2: 2.1 → 2.2 → 2.3          (component inspiration — requires 21st.dev API key)
Phase 3: 3.1                        (component refinement — requires 21st.dev API key)
Phase 4: 4.1 → 4.2 → 4.3          (cleanup hardcoded design — depends on Phase 1)
```

**Dependencies:**
- Phase 2 and 3 require `TWENTYFIRST_API_KEY` in env
- Phase 4 depends on Phase 1 (needs design system to replace hardcoded values)
- Phase 2 and 3 are independent of each other
- Phase 1 can be done without any API key (all local data)

---

## Environment Variables (new)

Add to `agent-backend/.env`:
```
TWENTYFIRST_API_KEY=your-key-from-21st.dev/magic
```

---

## Fallback Strategy

Every external dependency has a graceful fallback:

| Dependency | Failure Mode | Fallback |
|---|---|---|
| Python design system generator | Process crash / timeout | Use current hardcoded defaults (glassmorphism, Heebo, etc.) |
| 21st.dev inspiration API | Rate limit / timeout / down | Write component without reference (current behavior) |
| 21st.dev refine API | Rate limit / timeout / down | Skip refinement, use standard fix prompt |
| Hebrew font validation | Recommended font not Hebrew | Swap to Heebo as body font |

The pipeline NEVER fails because an external service is unavailable. It degrades to current behavior.

---

## Expected Outcomes

| Metric | Before | After |
|---|---|---|
| Design variety | All sites look the same (glassmorphism dark) | Each business type gets a distinct design style |
| Font variety | Always Heebo | Business-appropriate font pairing (with Hebrew fallback) |
| Color quality | AI picks random colors | Data-driven palette from 161 industry-specific options |
| Component quality | Written from scratch every time | Based on production-quality references from 21st.dev |
| Animation variety | Same fade-up on everything | Style-appropriate animations (parallax, slide-in, etc.) |
| Visual QA fix quality | LLM guesses what "better" means | Gets a refined reference from 21st.dev to work from |

---

## Testing Protocol (per task)

After **every** task:
1. `cd agent-backend && npx tsc --noEmit` — must pass
2. `cd agent-backend && npm run build` — must pass
3. For Phase 1 tasks: generate 2 sites (different business types), confirm different design systems
4. For Phase 2+ tasks: check logs for 21st.dev API calls and fallback behavior
