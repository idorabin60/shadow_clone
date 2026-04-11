# How the Agent Designs a Landing Page — Full Pipeline & Improvement Plan

## THE FULL DESIGN PIPELINE (Step by Step)

### Step 1: Design Query Extraction
**Where:** `graph.ts` → `productManagerNode` (lines 100-117)
**Model:** GPT-4o (cheapest, trivial task)

User submits Hebrew business input → GPT-4o extracts 2-5 English keywords:
```
"מסעדת שף יוקרתית בתל אביב" → "luxury chef restaurant fine dining"
```

**Problem:** This is a lossy 1-hop translation. The LLM strips nuance — "boutique artisan bakery with vintage vibes" and "industrial-scale bread factory" might both become "bakery food production".

---

### Step 2: Design System Generation (Python CSV Search)
**Where:** `designSystem.ts` → `generateDesignSystem()` → Python `design_system.py`
**Latency:** ~1-3s (no LLM, pure search)

The Python script searches across 5 CSV databases using TF-IDF-like keyword matching:

1. **products.csv** (161 entries) → Identifies business category (e.g., "Restaurant/Food Service")
2. **ui-reasoning.csv** → Applies reasoning rules: which style fits this category, anti-patterns, effects
3. **styles.csv** (67 entries) → Selects best UI style (e.g., "Luxury & Premium", "Minimalism")
4. **colors.csv** (161 palettes) → Picks color scheme by mood/industry
5. **typography.csv** (57 pairings) → Selects heading + body font pairing
6. **landing.csv** → Picks section layout pattern (e.g., "Hero > Features > Testimonials > CTA")

**Output:** `DesignSystemRecommendation` with: style name, keywords, effects, anti-patterns, colors (5 hex values), typography (heading + body fonts), layout (sections, CTA placement).

**Key weakness:** The search is keyword-based, not semantic. "luxury restaurant" and "fine dining" hit different CSV rows and can produce inconsistent results (e.g., a "Brutalism" style for a luxury brand if keywords accidentally match).

---

### Step 3: PM Writes spec.md
**Where:** `graph.ts` → `productManagerNode` (lines 124-253)
**Model:** Claude Sonnet 4.6

The PM receives a massive system prompt (~2000 tokens) that includes:
- The design system recommendation (colors, fonts, style, sections)
- A rigid template to fill (Business Analysis, Color Palette, Typography, Image Strategy, Sections, Component List, Design System Rules)
- Business input from the user

The PM outputs a `spec.md` with all design decisions locked in. The spec is the **single source of truth** for everything downstream.

**Artifacts written to sandbox:**
- `spec.md` — the design bible
- `design_system.json` — machine-readable tokens
- `project_manifest.json` — component list + naming rules
- `dev_memory.json` — initial memory seed

---

### Step 4: Inspiration Distillation (21st.dev)
**Where:** `inspirationDistiller.ts` → `distillInspiration()`
**Model:** Claude Sonnet 4.6 (for compression)
**API:** 21st.dev REST API (for search)

For EACH component in the spec:

1. **Search 21st.dev** — sends a style-aware query (e.g., "hero section landing page with CTA luxury premium elegant") 
2. **Get best result** — picks the first component match, gets its full source code (~3500 chars)
3. **Distill with Sonnet** — compresses raw code into a structured ~400-token brief:
   ```
   LAYOUT: 2-column grid on desktop, stacked on mobile, 6rem section padding
   VISUAL_TECHNIQUES: backdrop-blur-xl, gradient orbs, border-white/10
   ANIMATIONS: staggered fade-up (delay: index * 0.15), scale(1.02) on hover
   COLOR_APPLICATION: primary as gradient accent, accent as button bg
   KEY_PATTERNS: Cards use grid gap-8, each with icon + heading + description
   COMPONENT_STRUCTURE: Header with badge + title, then 3-col card grid
   ```

4. **Collect npm deps** — extracts packages the reference needs, installs them
5. **Save** — writes `inspiration_briefs.json` to sandbox

**What this does well:** Borrows *structural ideas* (layout, rhythm, interaction patterns) from real production components without copying their visual style.

**What this does poorly:** Only searches the top-1 result. If 21st.dev returns a mediocre match, the brief is mediocre. No quality filtering.

---

### Step 5: Parallel Component Generation
**Where:** `parallelWriter.ts` → `writeAllComponentsParallel()`
**Models:** Claude Opus 4.6 (Tier 1) + Claude Sonnet 4.6 (Tier 2)

Execution order:
1. **globals.css** — deterministic (no LLM), sets up fonts + Tailwind
2. **Tier 2 (Sonnet, parallel, max 3 concurrent):** Navbar, Footer, CTA, Contact, FAQ
3. **Tier 1 (Opus, sequential):** Hero, Features, Services, Testimonials, Pricing, Gallery, About, Team
4. **page.tsx** — deterministic, assembles imports

Each component gets a prompt with:
- **Shared context** — Color Palette, Typography, Image Strategy, Design System Rules from spec.md
- **Design Token Block** — ~270 tokens of exact Tailwind classes per style family (card treatment, button styles, heading sizes, animation tokens)
- **Inspiration brief** — ~400 tokens of structural reference from 21st.dev
- **LTR layout directive** — per-component layout rules (hero: text-left + visual-right, etc.)
- **Implementation rules** — 16 rules covering animations, images, Tailwind-only, TypeScript, etc.

**The prompt ends with:** "Output EXACTLY one `<file>` block. No explanation."

---

### Step 6: TypeScript Verification
**Where:** `graph.ts` → `developerNode` Phase A/B
**Tool:** `npx tsc --noEmit`

After parallel generation, runs TypeScript check. If it fails:
- `classifyError()` extracts which files have errors
- `buildTargetedFixPrompt()` reads only those files and sends them back to the LLM
- Dev loop runs up to 2 patch attempts

---

### Step 7: QA — 3 Phases
**Where:** `graph.ts` → `qaNode`

**Phase 1: tsc** (30s) — same TypeScript check
**Phase 2: next build** (120s) — full Next.js production build
**Phase 3: Visual QA** (180s):

1. Start `npx next start` on random port
2. Playwright takes 3 screenshots (desktop 1440x900, mobile 375x812, full-page scroll)
3. DOM checks (instant): blank page?, RTL?, broken images?, section count
4. GPT-4o vision reviews screenshots against spec + design system
5. Scores 1-10, pass threshold = 7

If QA fails → loops back to developer (max 6 iterations).

---

## DESIGN TOKEN FLOW (How Visual Consistency Is Enforced)

```
Python CSV databases
    ↓ (keyword search)
DesignSystemRecommendation
    ↓ (embedded in PM prompt)
spec.md (Color Palette, Typography, Design Rules)
    ↓ (extractSharedContext)
Shared Design Context (~500 tokens per component)
    +
    ↓ (generateDesignTokenBlock)
Design Token Block (~270 tokens of exact Tailwind classes)
    +
    ↓ (distillInspiration)
Inspiration Briefs (~400 tokens per component)
    ↓ (all three fed to each component prompt)
Component Code
```

The Design Token Block maps the abstract design system to concrete Tailwind classes per style family:
- **Glass:** `rounded-3xl bg-white/8 border border-white/14 backdrop-blur-2xl`
- **Luxury:** `rounded-[28px] border border-accent/25 bg-black/30`
- **Editorial:** `rounded-[24px] border border-black/10 bg-white/90`
- **Bold:** `rounded-[26px] border-2 border-text bg-primary/10 shadow-[10px_10px_0]`
- **Soft:** `rounded-[30px] border border-white/60 bg-white/75`
- **Minimal:** `rounded-[24px] border border-black/8 bg-white`

---

## WHAT'S CURRENTLY WEAK & HOW TO IMPROVE

### 1. HERO SECTION IS THE BIGGEST QUALITY BOTTLENECK

**Problem:** The hero makes or breaks the page. Even with Opus, heroes often look generic because:
- The Unsplash image URL is invented (fake photo-XXXX ID) → shows broken image or generic stock
- No actual dashboard/product mockup — just text + button on gradient
- Copy is LLM-generated boilerplate ("Transform Your Business Today")

**Improvement — Hero Visual Richness:**
- Pre-build 5-8 hero layout templates (split-screen, centered, asymmetric, with stats bar, etc.) as reference code, not just briefs. Let the LLM pick one and customize it.
- Use a curated Unsplash collection with verified working photo IDs per business category (restaurant → specific food photography IDs, SaaS → specific dashboard IDs).
- Add a "dashboard mockup" generator — a simple SVG/HTML component that looks like a product screenshot, parameterized by the design system colors. Much better than a stock photo for SaaS/tech businesses.

### 2. COMPONENTS DON'T TALK TO EACH OTHER

**Problem:** Each component is generated independently. The Hero doesn't know what the Features section looks like. This causes:
- Inconsistent spacing between sections
- Hero uses one animation style, Features uses another
- Color intensity varies wildly (hero is dark and moody, next section is bright white)

**Improvement — Cross-Component Coherence:**
- After Tier 2 is done, generate a "Page Rhythm Document" — a 200-token summary of section transitions: "Hero (dark bg) → Features (slight lighten) → Testimonials (accent bg) → CTA (back to dark)". Feed this to every Tier 1 component.
- Or simpler: add a `sectionIndex` and `totalSections` to each component prompt, plus "previous section bg color" and "next section bg color" to enforce smooth visual flow.

### 3. THE DESIGN TOKEN BLOCK IS TOO RIGID

**Problem:** 6 style families (glass, luxury, editorial, bold, soft, minimal) are hardcoded with exact Tailwind classes. A "luxury restaurant" and "luxury SaaS" get identical card treatments. Real design agencies adapt tokens per business.

**Improvement — Contextual Token Tuning:**
- Instead of pure keyword matching to one of 6 families, let the PM node generate a short "token override" block based on the specific business. Example: for a luxury restaurant, the cards might use warm tones and organic shapes, while luxury SaaS uses cold tones and sharp edges.
- Add a "warmth" axis (warm/neutral/cool) and "geometry" axis (organic/geometric) to the style family tokens, each with 2-3 variants.

### 4. INSPIRATION DISTILLATION IS SHALLOW

**Problem:** Takes only the top-1 21st.dev result. If that result is for a different industry or style, the brief is misleading. A "hero section landing page luxury" search might return a fintech hero, and the restaurant page ends up with fintech layout patterns.

**Improvement — Multi-Reference Fusion:**
- Search for top-3 results per component, not top-1.
- Score each result against the design system (does it use similar colors? similar layout patterns?) and pick the best match.
- Or distill all 3 into a single fused brief: "COMMON PATTERNS: X. BEST LAYOUT from ref 1. BEST ANIMATIONS from ref 3."

### 5. VISUAL QA IS NOISY AND EXPENSIVE

**Problem:** GPT-4o vision scores vary by ±2 points on the same screenshot. A score of 6 triggers a full $2-5 re-generation loop. The rubric is a single holistic 1-10 number, which is inherently subjective.

**Improvement — Structured Sub-Scoring:**
Replace the single score with 5 sub-scores:
```json
{
  "layout_structure": 8,    // Are sections present and well-structured?
  "visual_polish": 7,       // Shadows, gradients, spacing quality
  "typography": 8,          // Font sizes, hierarchy, readability
  "content_completeness": 9, // All spec sections present?
  "style_consistency": 6     // Does it match the design system?
}
```
Pass criteria: each sub-score >= 6 AND average >= 7. This is more stable than a single holistic number and gives the developer targeted feedback ("improve style_consistency" vs "score too low").

### 6. NO IMAGE CURATION

**Problem:** The prompt says "use Unsplash URLs matching the business theme" but the LLM invents URLs with random photo IDs. Most don't resolve to real images, or they resolve to completely unrelated photos.

**Improvement — Pre-Curated Image Bank:**
- Build a JSON mapping: `{ "restaurant": ["photo-abc123", "photo-def456"], "saas": [...], "fitness": [...] }` with ~20 verified Unsplash photo IDs per category.
- Include in the component prompt: "Use ONLY these verified Unsplash photo IDs for hero: photo-abc123, photo-def456. For cards: photo-ghi789..."
- This eliminates broken images entirely and guarantees on-brand photography.

### 7. ANIMATIONS ARE REPETITIVE

**Problem:** Every component uses the same `fade-up + stagger` entrance animation because the Design Token Block hardcodes:
```
Entrance: initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
```

Real premium sites use varied entrance animations per section (hero: dramatic scale, features: slide-in from sides, testimonials: fade with rotation, etc.).

**Improvement — Animation Variety per Section:**
Add an `animationVariant` to the Design Token Block per component type:
```
Hero: scale-in from 0.9 with blur dissolve
Features: staggered slide-in from left
Testimonials: fade-up with subtle rotation
Pricing: pop-in with spring physics
CTA: pulse/glow attention animation
```

### 8. MOBILE IS AN AFTERTHOUGHT

**Problem:** Components are designed desktop-first. Mobile is just "stuff stacks vertically." There's no mobile-specific design guidance in the prompts — just "responsive" as a buzzword.

**Improvement — Mobile-Specific Design Tokens:**
Add to the Design Token Block:
```
Mobile hero: full-bleed image, text overlay, compact CTA
Mobile cards: horizontal scroll carousel OR single-column with reduced padding
Mobile navbar: hamburger with slide-out panel
Mobile typography: hero text-4xl (not text-8xl), body text-base
```
And in the QA vision prompt, add explicit mobile criteria: "The mobile viewport should feel intentionally designed, not just squished desktop."

### 9. SPEC.MD IS A BOTTLENECK — ONE LLM CALL DECIDES EVERYTHING

**Problem:** The PM makes ALL design decisions in one shot: colors, fonts, sections, copy, image themes, component list. If any one decision is wrong (e.g., wrong color for the industry), the entire pipeline produces a mediocre page.

**Improvement — Two-Pass PM:**
1. **Pass 1 (fast, Sonnet):** Generate the structural spec: sections, component list, content outline. This is the "architecture."
2. **User checkpoint (optional):** Show the user the proposed sections and let them add/remove before generation starts.
3. **Pass 2 (detailed, Sonnet):** Fill in the visual details: exact colors (validated against the design system), typography scale, image themes, animation choices. This is the "visual design."

This also enables a future UI where users can tweak the spec before generation begins.

### 10. NO WHITESPACE/SPACING SYSTEM

**Problem:** Each component defines its own padding/margin. There's `py-24 px-6` in the token block but no rhythm system. Real design agencies use an 8px grid with consistent spacing scale.

**Improvement — Spacing System in Design Tokens:**
```
Section gap: space-y-0 (sections touch, bg transitions handle separation)
Section padding: py-24 md:py-32 px-6 md:px-16
Inner max-width: max-w-7xl mx-auto
Card grid gap: gap-6 md:gap-8
Content max-width: max-w-3xl (for readable text blocks)
Vertical rhythm: space-y-6 within sections, space-y-4 within cards
```

---

## PRIORITY RANKING (Impact vs Effort)

| # | Improvement | Impact | Effort | Priority |
|---|---|---|---|---|
| 6 | Pre-curated image bank | Very High | Low | **DO FIRST** |
| 1 | Hero layout templates | Very High | Medium | **DO SECOND** |
| 5 | Structured QA sub-scoring | High | Low | **DO THIRD** |
| 2 | Cross-component coherence | High | Medium | 4th |
| 7 | Animation variety | Medium | Low | 5th |
| 10 | Spacing system | Medium | Low | 6th |
| 8 | Mobile-specific tokens | Medium | Medium | 7th |
| 4 | Multi-reference fusion | Medium | Medium | 8th |
| 3 | Contextual token tuning | Medium | High | 9th |
| 9 | Two-pass PM | High | High | 10th |
