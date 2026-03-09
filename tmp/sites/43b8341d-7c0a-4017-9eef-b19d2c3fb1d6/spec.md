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
- **Gradients:**
  - Hero: `bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950`
  - Accent: `bg-gradient-to-r from-blue-500 to-amber-500`
  - Cards: `bg-gradient-to-br from-white/5 to-white/10`
- **Text on dark:** `text-white`, `text-slate-300`, `text-slate-400`.
- **Text on light:** `text-slate-900`, `text-slate-600`.

### 2.4 Spacing Philosophy
- **Sections:** Minimum `py-24 md:py-32 lg:py-40` vertical padding.
- **Between elements:** `gap-8`, `gap-12`, `gap-16` — generous, breathable.
- **Container:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`.
- **Cards internal padding:** `p-8 md:p-10`.
- No cramped layouts. White space is a feature, not a bug.

### 2.5 Glassmorphism & Surfaces
- Glass cards: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl`.
- On light sections: `bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-3xl shadow-xl`.
- Hover states on cards: `hover:bg-white/10 hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-500`.

### 2.6 Micro-Interactions & Animations (framer-motion)
- **ALL major sections** must animate on scroll using `framer-motion`'s `useInView` or `whileInView`.
- **Fade-up reveal:** Elements start at `opacity: 0, y: 40` and animate to `opacity: 1, y: 0` with `duration: 0.7, ease: "easeOut"`.
- **Stagger children:** In grid/list sections, each child staggers by `0.1s` delay.
- **Hero text:** Staggered word/line reveal with `clipPath` or simple fade-up cascade.
- **CTA buttons:** `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.97 }}`.
- **Floating elements:** Subtle `animate={{ y: [0, -10, 0] }}` with `repeat: Infinity` on decorative blobs/icons.
- **Counter animation:** Numbers in stats section count up from 0 on scroll.
- **Navbar:** Blur background appears on scroll (`bg-slate-950/80 backdrop-blur-xl`).

### 2.7 Iconography
- Use **`lucide-react`** exclusively for all icons.
- Icons should be `size={24}` default, `size={32}` or `size={40}` for feature cards.
- Icon containers: Circular or rounded-2xl background with gradient or glass effect.
- Suggested icon mapping:
  - טיפולים תקופתיים → `Wrench`
  - בדיקות לפני טסט → `ClipboardCheck`
  - אבחון תקלות ממוחשב → `MonitorCog` or `ScanLine`
  - תיקוני בלמים → `CircleDot` or `Disc3`
  - תיקוני חשמל רכב → `Zap`
  - תיקון מיזוג אוויר → `Snowflake` or `Wind`
  - החלפת מצבר → `BatteryCharging`
  - כיוון פרונט → `Crosshair` or `AlignCenter`
  - החלפת שמנים ופילטרים → `Droplets` or `Filter`

### 2.8 Buttons
- **Primary CTA:** `bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300`.
- **Secondary CTA:** `bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300`.
- **Ghost/Link:** `text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline transition-all`.

### 2.9 Decorative Elements
- **Mesh gradient blobs:** Absolutely positioned, blurred (`blur-3xl`), large (`w-96 h-96`), low opacity (`opacity-20`), using blue/amber/purple gradients. Placed behind hero and CTA sections.
- **Grid pattern overlay:** Optional subtle dot-grid or line-grid SVG pattern at `opacity-5` on dark sections.
- **Dividers:** Use gradient lines (`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`) between sections instead of hard borders.

---

## 3. Page Sections — Detailed Specification

### 3.1 Navigation Bar (Sticky)

**Behavior:**
- Fixed top, full width, `z-50`.
- Initially transparent. On scroll (>50px), transitions to `bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg`.
- Smooth transition: `transition-all duration-500`.

**Content (RTL):**
- **Right side:** Logo — text-based: "מוסך רוזן פרו" in `font-black text-xl` with the word "פרו" highlighted in `text-amber-400`.
- **Center:** Nav links (smooth scroll anchors): `אודות` | `שירותים` | `למה אנחנו` | `המלצות` | `צור קשר`.
  - Style: `text-slate-300 hover:text-white font-medium transition-colors`.
  - Active link: `text-amber-400`.
- **Left side:** CTA button: `קבע תור עכשיו` — Primary CTA style, smaller (`px-6 py-2.5 text-sm rounded-xl`).
- **Mobile:** Hamburger menu icon (`Menu` from lucide-react). Opens a full-screen overlay with glass background, centered nav links, staggered animation.

---

### 3.2 Hero Section

**Layout:** Full viewport height (`min-h-screen`), flex centered.
**Background:**
- `bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950`.
- Two decorative mesh blobs: one amber (`bg-amber-500/20 blur-3xl`) top-right, one blue (`bg-blue-600/15 blur-3xl`) bottom-left. Both absolutely positioned, animated with subtle floating motion.
- Optional: Subtle grid-dot SVG overlay at `opacity-[0.03]`.

**Content (centered, max-w-4xl):**
- **Eyebrow label:** `<span>` with `text-amber-400 text-sm font-semibold tracking-widest` — text: `"🔧 מוסך מקצועי | שקיפות • מהירות • אמינות"`
- **Main Heading (H1):**
  