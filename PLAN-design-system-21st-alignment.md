# Design System + 21st.dev Alignment — Implementation Plan

**Goal:** Make component inspiration and generated code follow the selected design system instead of drifting toward generic glassmorphism or generic landing-page patterns.

---

## Problem Summary

The current architecture is correct, but two implementation details create style drift:

1. `generateDesignTokenBlock()` emits nearly the same glass-heavy tokens for every project, even when the selected style is not glassmorphism.
2. 21st.dev retrieval uses generic per-component queries and ignores the chosen style, category, effects, and anti-patterns.

Result: the PM spec, component inspiration, and final code can pull in different visual directions.

---

## Target State

For any given project:

- the design system selects a clear visual language
- 21st.dev retrieval searches for references in that same visual language
- distilled inspiration briefs preserve component patterns without overriding the system
- the writer receives one consistent source of truth for style, motion, spacing, and allowed effects

---

## Change 1: Make Design Tokens Style-Specific

### What
Replace the single token template in `agent-backend/src/orchestrator/designSystem.ts` with style-family token generators.

### Implementation

- Add a style normalization layer:
  - map raw styles into a small set of token families such as `glass`, `minimal`, `editorial`, `bold`, `soft`, `luxury`.
- Replace the current fixed token block with `buildDesignTokenBlock(ds, family)`.
- Generate tokens that vary by family:
  - card treatment
  - background treatment
  - hover behavior
  - motion presets
  - border/shadow usage
  - heading treatment
- Keep color, typography, and anti-patterns driven by the actual `DesignSystemRecommendation`.
- Add fallback behavior for unknown styles.

### Files

- `agent-backend/src/orchestrator/designSystem.ts`

### Acceptance Criteria

- a `Minimalism` recommendation no longer emits blur/glass defaults
- a `Luxury` recommendation does not reuse the same card/background recipe as `Flat Design`
- anti-patterns are still visible in the final token block

---

## Change 2: Make 21st.dev Retrieval Design-System Aware

### What
Use the selected design system to shape component search queries instead of relying on static component-only mappings.

### Implementation

- Extend the search-query builder in `agent-backend/src/orchestrator/specParser.ts` or move it into a new helper near `inspirationDistiller.ts`.
- Build queries from:
  - component name
  - design style
  - business category
  - key effects
  - tone keywords
- Add anti-pattern filtering rules:
  - do not append terms that conflict with `antiPatterns`
  - prefer retrieval terms from `style.keywords`
- Example:
  - current: `features grid icons`
  - target: `features grid minimal editorial premium clean typography`

### Files

- `agent-backend/src/orchestrator/specParser.ts`
- `agent-backend/src/orchestrator/inspirationDistiller.ts`

### Acceptance Criteria

- search queries differ for the same component across different style recommendations
- inspiration briefs reflect the selected style more often than generic defaults

---

## Change 3: Tighten the Prompt Contract Between Tokens and Briefs

### What
Make the component writer treat the design system as authoritative and 21st.dev as pattern inspiration only.

### Implementation

- Update the prompt in `agent-backend/src/orchestrator/parallelWriter.ts`:
  - explicitly state that tokens and color/typography rules override reference styling
  - instruct the model to borrow structure and composition from the brief, not its palette
  - tell the model to ignore any reference pattern that conflicts with anti-patterns
- Split the brief section into:
  - `STRUCTURAL INSPIRATION`
  - `DO NOT COPY COLORS / STYLE IF IT CONFLICTS`

### Files

- `agent-backend/src/orchestrator/parallelWriter.ts`

### Acceptance Criteria

- generated components keep layout ideas from references without adopting conflicting style treatments
- QA failures caused by mixed visual languages decrease

---

## Change 4: Improve Visual QA Feedback Loop

### What
Feed back style-consistency failures explicitly, not only generic “premium quality” failures.

### Implementation

- Extend visual review instructions in `agent-backend/src/tools/visualReview.ts` to score:
  - consistency with selected style
  - consistency between sections
  - violations of anti-patterns
- Include style name and anti-patterns from `design_system.json` in the QA prompt.
- When visual QA fails, keep loading `inspiration_briefs.json`, but also inject the token family or style rules into the fix prompt.

### Files

- `agent-backend/src/tools/visualReview.ts`
- `agent-backend/src/orchestrator/graph.ts`

### Acceptance Criteria

- QA feedback can distinguish “layout is broken” from “style is inconsistent with the chosen system”

---

## Suggested Order

1. Refactor `designSystem.ts` token generation.
2. Make 21st.dev query building style-aware.
3. Tighten `parallelWriter.ts` prompt precedence.
4. Update QA prompts and failure feedback.
5. Run comparison tests across 3-4 business types with different styles.

---

## Validation Plan

- Generate the same component set for at least:
  - SaaS / Minimalism
  - Luxury brand / Luxury
  - Creative studio / Editorial or Bold
- Inspect:
  - generated `design_system.json`
  - 21st.dev queries
  - `inspiration_briefs.json`
  - final component styling
- Confirm that:
  - different styles produce materially different token blocks
  - retrieval terms reflect the style
  - final UI sections look internally consistent

---

## Risks

- Too many style families may overfit the data and make fallback behavior brittle.
- Over-constraining 21st.dev queries may reduce useful matches.
- Prompt changes without QA updates may hide drift instead of reducing it.

**Recommendation:** start with 5-6 style families, keep a conservative fallback, and log generated queries and token families during rollout.
