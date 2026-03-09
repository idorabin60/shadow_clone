# spec.md — מוסך רוזן פרו | Premium Hebrew Landing Page

---

## 1. Project Overview

**Business:** מוסך רוזן פרו
**Type:** מוסך (Auto Repair Shop)
**Tone:** Professional, trustworthy, modern
**Language:** Hebrew (RTL)
**Goal:** A single-page, premium landing page that communicates transparency, speed, and professionalism. The design must be Awwwards/Dribbble-level — no generic templates, no flat boring layouts. Every pixel must feel intentional, premium, and alive.

---

## 2. Global Design System & Rules

### 2.1 Direction & Language
- The entire `<html>` tag must have `dir="rtl"` and `lang="he"`.
- All text alignment defaults to `text-right`.
- All flex/grid layouts must respect RTL flow naturally.

### 2.2 Typography
- **Primary Font:** `Heebo` (Google Fonts) — weights 400, 500, 700, 900.
- **Headings:** `font-black` (900) or `font-bold` (700), large sizes (`text-4xl` to `text-7xl`), tight `leading-tight` or `tracking-tight`.
- **Body:** `font-normal` (400) or `font-medium` (500), `text-lg` or `text-xl`, `leading-relaxed` for readability.
- **Accent text / labels:** `text-sm font-semibold uppercase tracking-widest` with a muted color or gradient text.

### 2.3 Color Palette
- **Primary:** Deep Charcoal `#0F172A` (slate-900) — trust, professionalism.
- **Secondary:** Electric Blue `#3B82F6` (blue-500) — energy, reliability.
- **Accent:** Amber/Orange `#F59E0B` (amber-500) — warmth, attention, CTA highlights.
- **Surface Light:** `#F8FAFC` (slate-50).
- **Surface Glass:** `rgba(255, 255, 255, 0.05)` to `rgba(255, 255, 255, 0.12)` with `backdrop-blur-xl`.
- **Gradient Hero:** `bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950`.
- **Gradient Accent:** `bg-gradient-to-r from-blue-500 to-amber-500` for decorative lines, badges, and text gradients.
- **Text on dark:** `text-white`, `text-slate-300`, `text-slate-400`.
- **Text on light:** `text-slate-900`, `text-slate-600`.

### 2.4 Spacing Philosophy
- **Sections:** Minimum `py-24 md:py-32 lg:py-40` vertical padding.
- **Between elements inside sections:** `gap-8`, `gap-12`, `gap-16` — generous, breathable.
- **Container:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`.
- **Cards:** `p-8 md:p-10` internal padding.
- **NEVER** use cramped spacing. White space is a design feature.

### 2.5 Glassmorphism & Surfaces
- **Glass cards:** `bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl`.
- **Light section cards:** `bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100`.
- **Hover states on cards:** `hover:bg-white/10 hover:shadow-3xl hover:border-white/20 transition-all duration-500`.

### 2.6 Micro-Interactions & Animations (framer-motion)
- **MANDATORY:** Use `framer-motion` for ALL section reveals.
- **Scroll-triggered animations:** Use `whileInView` with `viewport={{ once: true, amount: 0.2 }}`.
- **Default reveal:** `initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}`.
- **Stagger children:** Parent uses `staggerChildren: 0.1` or `0.15` in `transition`.
- **Cards:** Stagger fade-up on scroll.
- **Hero elements:** Stagger with delay — badge first, then heading, then paragraph, then CTA buttons.
- **Hover on buttons:** `whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}`.
- **Floating decorative elements:** Subtle `animate={{ y: [0, -10, 0] }}` with `repeat: Infinity` and `duration: 4`.
- **Counter animations:** Numbers in stats section should count up when in view.

### 2.7 Iconography
- **MANDATORY:** Use `lucide-react` for ALL icons.
- Icons should be `size={24}` default, `size={32}` or `size={40}` for feature cards.
- Icon containers: Circular or rounded-2xl background with gradient or glass effect.
- Suggested icon mapping:
  - טיפולים תקופתיים → `Wrench`
  - בדיקות לפני טסט → `ClipboardCheck`
  - אבחון תקלות ממוחשב → `MonitorCog` or `ScanLine`
  - תיקוני בלמים → `CircleDot` or `Disc3`
  - תיקוני חשמל רכב → `Zap`
  - תיקון מיזוג אוויר → `Snowflake` or `Wind`
  - החלפת מצבר → `Battery`
  - כיוון פרונט → `Crosshair` or `AlignCenter`
  - החלפת שמנים ופילטרים → `Droplets` or `Filter`

### 2.8 Backgrounds & Decorative Elements
- **Hero:** Dark mesh gradient with subtle animated gradient orbs (CSS or framer-motion). Use pseudo-elements or absolutely positioned blurred circles (`w-96 h-96 bg-blue-500/20 blur-3xl rounded-full absolute`).
- **Between sections:** Use subtle SVG dividers or gradient fade transitions — no hard color cuts.
- **Light sections:** Soft radial gradient background (`bg-gradient-radial from-blue-50 via-white to-slate-50`) or subtle dot-grid pattern overlay at low opacity.
- **Dark sections:** Noise texture overlay at 3-5% opacity for depth.

---

## 3. Page Sections — Detailed Specification

---

### 3.1 NAVIGATION BAR (Sticky)

**Layout:** Fixed/sticky top, full-width, `z-50`.
**Style:**
- Initially transparent, on scroll: `bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg`.
- Transition: `transition-all duration-300`.
**Content (RTL order):**
- **Right side:** Logo — text-based: "מוסך רוזן פרו" in `font-black text-xl` with the word "פרו" highlighted in `text-amber-500` or gradient text.
- **Center:** Nav links (smooth scroll anchors): `אודות` | `שירותים` | `למה אנחנו` | `המלצות` | `צור קשר`. Style: `text-sm font-medium text-slate-300 hover:text-white transition-colors`.
- **Left side:** CTA button: "קבעו תור" — `bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all`.
- **Mobile:** Hamburger menu icon (`Menu` from lucide-react). Opens a full-screen overlay or slide-in drawer with glass background.

---

### 3.2 HERO SECTION

**Background:** `bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950` with:
- Two floating gradient orbs (absolutely positioned, blurred).
- Subtle grid/dot pattern overlay at 5% opacity.
**Layout:** Full viewport height `min-h-screen`, flex center.
**Content (centered, max-w-4xl):**

1. **Badge/Label** (animated in first):
   - Text: "🔧 המוסך המקצועי שלך"
   - Style: `inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-blue-300`.

2. **Main Heading** (animated in second):
   - Text: "שקיפות מלאה.\nשירות מהיר.\nמחירים הוגנים."
   - Each line on its own line. Style: `text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight`.
   - The word "שקיפות" should have a gradient text effect (`bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent`).

3. **Subheading** (animated in third):
   - Text: "מוסך רוזן פרו — מוסך מקצועי לתיקון ותחזוקת רכבים עם דגש על שקיפות מלאה, שירות מהיר והסברים פשוטים. אבחון תקלות, טיפולים תקופתיים ותיקוני חשמל ומיזוג."
   - Style: `text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl`.

4. **CTA Buttons** (animated in fourth, flex row gap-4):
   - **Primary:** "קבעו תור עכשיו" — `bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 transition-all`. Icon: `CalendarCheck` from lucide.
   - **Secondary:** "גלו את השירותים שלנו" — `bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/20 transition-all`. Icon: `ChevronDown` from lucide.

5. **Trust indicators** (animated in fifth, flex row gap-8, centered):
   - "✓ אחריות מלאה" | "✓ ללא הפתעות" | "✓ מהיום להיום"
   - Style: `text-sm text-slate-500 font-medium`.

**Scroll indicator:** Animated bouncing chevron at bottom center.

---

### 3.3 STATS / TRUST BAR

**Position:** Directly below hero, overlapping slightly with negative margin (`-mt-16 relative z-10`).
**Layout:** Glass card spanning container width, grid of 4 columns on desktop.
**Style:** `bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl`.
**Stats (with count-up animation):**
1. **+15** — "שנות ניסיון" — Icon: `Award`
2. **+10,000** — "רכבים טופלו" — Icon: `Car`
3. **98%** — "שביעות רצון" — Icon: `ThumbsUp`
4. **24 שעות** — "זמן תגובה" — Icon: `Clock`

Each stat: Number in `text-4xl font-black text-white`, label in `text-sm text-slate-400`, icon in `text-blue-400`.

---

### 3.4 ABOUT / USP SECTION

**Background:** Light — `bg-gradient-to-b from-slate-50 to-white`.
**Layout:** Two-column grid on desktop (`grid-cols-2 gap-16 items-center`).
**Left column (visual):**
- A large rounded-3xl image placeholder (abstract car/garage illustration or a styled div with gradient and icon).
- Overlapping floating glass card with a quote: "אצלנו, אתם יודעים בדיוק מה מתוקן ולמה" — styled as a testimonial mini-card with `bg-white shadow-xl rounded-2xl p-6`.

**Right column (content):**
1. **Section label:** "אודות המוסך" — `text-sm font-semibold text-blue-500 tracking-widest uppercase`.
2. **Heading:** "המוסך שמדבר אליכם בגובה העיניים" — `text-4xl md:text-5xl font-black text-slate-900 leading-tight`.
3. **Body text:** "במוסך רוזן פרו אנחנו מאמינים ששקיפות היא הבסיס לאמון. לפני כל תיקון, תקבלו הסבר מפורט ומחיר מדויק — בלי הפתעות, בלי עלויות נסתרות. אנחנו מתמחים באבחון תקלות ממוחשב, טיפולים תקופתיים, תיקוני חשמל ומיזוג, ומספקים שירות מהיר מהיום להיום." — `text-lg text-slate-600 leading-relaxed`.
4. **USP checklist** (4 items, staggered animation):
   - "שקיפות מלאה לפני כל תיקון" — Icon: `Eye`
   - "מחירים הוגנים בלי הפתעות" — Icon: `BadgeCheck`
   - "שירות מהיר מהיום להיום" — Icon: `Zap`
   - "אחריות על עבודה וחלקים" — Icon: `ShieldCheck`
   - Each item: `flex items-center gap-4`, icon in a `w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center` container, text in `font-semibold text-slate-800`.

---

### 3.5 SERVICES SECTION — BENTO GRID

**Background:** Dark — `bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950` with subtle noise texture.
**Section header (centered):**
1. **Label:** "השירותים שלנו" — `text-sm font-semibold text-amber-400 tracking-widest`.
2. **Heading:** "כל מה שהרכב שלכם צריך, במקום אחד" — `text-4xl md:text-5xl font-black text-white text-center`.
3. **Subtitle:** "מגוון שירותי תיקון ותחזוקה מקצועיים עם אחריות מלאה" — `text-lg text-slate-400 text-center`.

**Bento Grid Layout:**
Use a CSS grid with varying spans to create visual hierarchy:
