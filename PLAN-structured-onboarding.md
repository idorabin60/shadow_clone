# Structured Onboarding Flow — Implementation Plan

## Overview

Replace the single free-text prompt with a structured 3-step flow:

```
Home (initial prompt = project name)
  → Onboarding form (structured business details + photo uploads)
    → Workspace (generates with rich structured input)
```

---

## Current Flow vs. Target Flow

**Current:**
```
AnimatedAIChat → /workspace?prompt=<text>
workspace.tsx builds a fake BusinessInput { businessName: "העסק שלי", description: text }
→ POST /api/orchestrate with that flat object
```

**Target:**
```
AnimatedAIChat → /onboarding?name=<text>
OnboardingPage fills real form + uploads photos
→ creates project row in DB + uploads photos to Supabase Storage
→ /workspace?id=<projectId>
workspace.tsx reads full business_data from DB
→ POST /api/orchestrate with structured rich BusinessInput + photoUrls
```

---

## Tasks

---

### Task 1 — Supabase Schema + Storage Setup
**Files:** Supabase dashboard (manual SQL) + `src/utils/supabase/`

Add two new columns to the `projects` table:
```sql
ALTER TABLE projects
  ADD COLUMN business_data JSONB,
  ADD COLUMN photos TEXT[] DEFAULT '{}';
```

`business_data` shape:
```json
{
  "businessName": "פיצרייה נאפולי",
  "businessType": "מסעדה",
  "description": "פיצה אותנטית בתנור עצים...",
  "services": ["פיצה", "פסטה", "קינוחים"],
  "tone": "friendly",
  "targetAudience": "משפחות וצעירים",
  "ctaGoal": "הזמנת שולחן",
  "colorStyle": "warm",
  "sectionsWanted": ["hero", "services", "about", "testimonials", "cta", "footer"]
}
```

Create Supabase Storage bucket:
- Bucket name: `project-photos`
- Public: true
- Path convention: `{projectId}/{filename}`

No new frontend utility files needed — use the existing `createClient()` from `src/utils/supabase/client.ts`.

---

### Task 2 — Home Page: Submit Navigates to Onboarding
**File:** `src/components/ui/animated-ai-chat.tsx`

Change `handleSendMessage` from:
```ts
router.push(`/workspace?prompt=${encodeURIComponent(value.trim())}`);
```
to:
```ts
router.push(`/onboarding?name=${encodeURIComponent(value.trim())}`);
```

That's the only change to this file. The `AnimatedAIChat` component stays identical otherwise.

---

### Task 3 — Onboarding Form Page (new)
**File:** `src/app/onboarding/page.tsx`

#### UI Design
- Same dark theme as home: `bg-[#0A0A0A]`, zinc palette, same nav bar
- Same framer-motion fade-in as home
- RTL (`dir="rtl"`)
- Two-column layout on desktop: form on right, live summary card on left
- Project name shown at top as a badge (read-only, from `?name=` param)

#### Form Fields
| Field | Type | Hebrew label |
|---|---|---|
| `businessName` | text input | שם העסק |
| `businessType` | select (מסעדה, קליניקה, סטודיו, חנות, שירותים, אחר) | סוג עסק |
| `description` | textarea (pre-filled from `name` param) | תיאור העסק |
| `services` | tag input (type + Enter to add) | שירותים / מוצרים |
| `tone` | radio cards (professional / friendly / luxury / casual) | סגנון |
| `targetAudience` | text input | קהל יעד |
| `ctaGoal` | select (התקשר, הזמן שולחן, קנה עכשיו, צור קשר, הרשמה) | מטרת הכפתור הראשי |
| `colorStyle` | color palette picker (dark / light / warm / minimal / bold) | סגנון צבעים |
| `sectionsWanted` | checkbox grid | סקשנים לדף |
| `photos` | file upload (multi, images only, max 5) | תמונות מהעסק |

#### Submit behavior
1. Validate required fields (businessName, description)
2. Create project row in Supabase:
   ```ts
   const { data } = await supabase
     .from('projects')
     .insert({ name: projectName, user_id: user.id, business_data: formData })
     .select('id').single();
   ```
3. Upload each photo to Supabase Storage:
   ```ts
   await supabase.storage
     .from('project-photos')
     .upload(`${projectId}/${file.name}`, file);
   ```
4. Get public URLs + update `photos` column on the project row
5. Navigate to `/workspace?id=${projectId}`

#### Loading state
Show a spinner overlay with "יוצר פרויקט..." while saving/uploading. Disable submit button during.

---

### Task 4 — Workspace: Load by Project ID + Pass Rich Input
**File:** `src/app/workspace/page.tsx`

#### Route change
Accept `?id=<projectId>` instead of `?prompt=<text>`:
```ts
const projectId = searchParams.get("id");
```

Keep backward compat with `?prompt=` for the projects switcher (existing projects load by name).

#### On mount
When `projectId` is present:
1. Fetch project row from Supabase: `business_data`, `photos`, `name`
2. Pass the full object to `generateLandingPage`

#### `generateLandingPage` change
Replace the hardcoded fake `BusinessInput`:
```ts
// BEFORE
const inputData: BusinessInput = {
    businessName: "העסק שלי",
    businessType: "כללי",
    description: text,
    ...
};
```
with:
```ts
// AFTER — use real data from DB
const inputData = {
    ...businessData,         // full form data from business_data column
    photoUrls: photoUrls,    // public URLs from storage
    projectId: projectId,
};
```

#### `BusinessInput` interface update
Extend the existing interface with the new fields:
```ts
interface BusinessInput {
    businessName: string;
    businessType: string;
    description: string;
    services: string[];
    tone: "professional" | "friendly" | "luxury" | "casual";
    targetAudience?: string;
    ctaGoal?: string;
    colorStyle?: string;
    sectionsWanted?: string[];
    photoUrls?: string[];
    uniqueSellingProposition?: string;
}
```

---

### Task 5 — Backend: Use Structured Input in PM Node
**File:** `agent-backend/src/orchestrator/graph.ts` (PM node only)

The PM node currently receives `state.businessInput` and dumps it as:
```ts
${JSON.stringify(state.businessInput, null, 2)}
```

Replace with a formatted prompt section that uses each field explicitly:

```ts
const buildBusinessContext = (input: any): string => `
## עסק: ${input.businessName}
**סוג עסק:** ${input.businessType}
**תיאור:** ${input.description}
**שירותים/מוצרים:** ${(input.services || []).join(", ")}
**קהל יעד:** ${input.targetAudience || "כללי"}
**סגנון:** ${input.tone || "professional"}
**מטרת ה-CTA:** ${input.ctaGoal || "צור קשר"}
**פלטת צבעים:** ${input.colorStyle || "dark"}
**סקשנים מבוקשים:** ${(input.sectionsWanted || []).join(", ")}
${input.photoUrls?.length ? `**תמונות שהועלו על ידי הלקוח (השתמש בהן!):**\n${input.photoUrls.map((u: string) => `- ${u}`).join("\n")}` : ""}
`;
```

If `photoUrls` exist, add explicit instruction to PM:
> "The client has uploaded their own business photos. You MUST instruct the Developer to use these exact image URLs instead of Unsplash placeholders."

And in `devPrompt`, if photos exist, add to system prompt:
> "CLIENT PHOTOS — use these instead of Unsplash: [urls]"

---

## Files Changed Summary

| File | Change |
|---|---|
| Supabase (manual) | Add `business_data` JSONB + `photos TEXT[]` columns; create `project-photos` bucket |
| `src/components/ui/animated-ai-chat.tsx` | Navigate to `/onboarding` instead of `/workspace` |
| `src/app/onboarding/page.tsx` | **New file** — full structured form |
| `src/app/workspace/page.tsx` | Accept `?id=`, load from DB, pass rich input |
| `agent-backend/src/orchestrator/graph.ts` | PM node: structured `buildBusinessContext` prompt |

---

## Task Execution Order

| # | Task | Dependency |
|---|---|---|
| 1 | DB schema + storage bucket | None — do first |
| 2 | Home page navigate to `/onboarding` | None |
| 3 | Onboarding form page | Task 1 must be done |
| 4 | Workspace load by project ID | Task 1, 3 must be done |
| 5 | Backend structured PM prompt | Task 3, 4 must be done |

---

## What Does NOT Change
- `AnimatedAIChat` visual design — zero UI changes, one line of logic
- Workspace UI — zero visual changes, only data loading changes
- Agent graph structure — only PM system prompt changes
- Edit flow (`/api/edit`) — untouched
- SSE streaming — untouched
- `useWebContainer` — untouched
