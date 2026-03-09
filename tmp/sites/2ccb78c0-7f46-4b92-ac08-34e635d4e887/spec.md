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
- **Headings:** `font-black` (900) or `font-bold` (700), large scale (`text-4xl` to `text-7xl`), tight `leading-tight` or `tracking-tight`.
- **Body:** `font-normal` (400) or `font-medium` (500), `text-lg` or `text-xl`, `leading-relaxed`, muted color (`text-gray-300` or `text-slate-400` on dark backgrounds).
- **Accent text / labels:** Uppercase-style Hebrew labels with `text-sm font-bold tracking-widest` and a vibrant accent color.

### 2.3 Color Palette
- **Primary:** Deep Electric Blue `#0066FF` → used for CTAs, highlights, accent borders.
- **Primary Light:** `#3388FF`
- **Primary Dark:** `#0044CC`
- **Secondary Accent:** Warm Amber/Orange `#FF8C00` → used sparingly for urgency badges, secondary highlights.
- **Dark Background Base:** Rich near-black `#0A0E1A` (not pure black).
- **Dark Surface:** `#111827` (Tailwind `gray-900`).
- **Card Surface:** `rgba(255, 255, 255, 0.05)` with `backdrop-blur-xl` (glassmorphism).
- **Text Primary (on dark):** `#F1F5F9` (Tailwind `slate-100`).
- **Text Secondary (on dark):** `#94A3B8` (Tailwind `slate-400`).
- **Gradient Hero:** `bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#1E1B4B]` — a deep blue-indigo mesh feel.
- **Gradient Accent:** `bg-gradient-to-r from-[#0066FF] to-[#00C2FF]` — for buttons and highlight bars.

### 2.4 Spacing Philosophy
- **Sections:** Minimum `py-24` padding, prefer `py-32` for major sections. Use `py-40` for hero.
- **Container:** `max-w-7xl mx-auto px-6 lg:px-8`.
- **Between elements:** `gap-8`, `gap-12`, `gap-16` — generous breathing room. Never `gap-2` or `gap-4` between major blocks.
- **Cards internal padding:** `p-8` minimum, prefer `p-10`.

### 2.5 Glassmorphism & Surfaces
- All cards/surfaces: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl` or `rounded-3xl`.
- Elevated cards: Add `shadow-2xl shadow-blue-500/5` for a subtle colored glow.
- On hover: `hover:bg-white/10 hover:border-white/20 hover:shadow-blue-500/10` transition.

### 2.6 Micro-Interactions & Animations (framer-motion)
- **MANDATORY:** Use `framer-motion` for ALL section reveals.
- **Scroll-triggered fade-up:** Every section's heading, subtext, and content block must animate in with `y: 40 → 0`, `opacity: 0 → 1`, `duration: 0.6`, `ease: "easeOut"`.
- **Stagger children:** Card grids must use `staggerChildren: 0.1` so cards cascade in one by one.
- **Hero text:** Staggered word/line reveal with `y: 60 → 0` and slight `blur` clearing.
- **Buttons:** `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.97 }}`.
- **Floating elements:** Subtle `animate={{ y: [0, -10, 0] }}` infinite loop on decorative icons/badges in hero.
- **Counter animation:** Numbers in stats section should count up from 0 using framer-motion's `useMotionValue` + `useTransform` or a counting library.
- Use `useInView` from framer-motion to trigger animations only when elements scroll into viewport.

### 2.7 Iconography
- **MANDATORY:** Use `lucide-react` for ALL icons. No other icon library.
- Icons should be `size={24}` default, `size={32}` or `size={40}` for feature cards.
- Icon containers: Wrap in a `w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center` box with the icon in white.

### 2.8 Buttons
- **Primary CTA:** `bg-gradient-to-r from-[#0066FF] to-[#00C2FF] text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300`. Add framer-motion hover scale.
- **Secondary CTA:** `bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300`.
- **Phone CTA:** Same as primary but with a `Phone` icon from lucide-react on the left side (RTL: left = end).

### 2.9 Decorative Elements
- Subtle gradient orbs: Absolutely positioned `div` elements with `w-96 h-96 bg-blue-500/20 rounded-full blur-3xl` scattered behind sections for ambient glow.
- Thin accent lines: `h-1 w-20 bg-gradient-to-r from-[#0066FF] to-[#00C2FF] rounded-full` used as section dividers under headings.
- Dot grid or subtle noise texture overlay at `opacity-5` on the hero background.

---

## 3. Page Sections — Detailed Specification

---

### 3.1 NAVIGATION BAR (Sticky)

**Layout:** Fixed/sticky top, full-width, `bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/5`, `z-50`.
**Container:** `max-w-7xl mx-auto px-6 flex items-center justify-between h-20`.

**Content (RTL order):**
- **Right side:** Logo/Brand — "מוסך רוזן פרו" in `text-2xl font-black text-white` with a small `Wrench` icon (lucide) in accent gradient color next to it.
- **Center:** Nav links (desktop only) — `text-sm font-medium text-slate-400 hover:text-white transition` — links: שירותים | למה אנחנו | המלצות | צור קשר
- **Left side:** CTA button — "קבעו תור" — small primary gradient button `px-6 py-2.5 rounded-full text-sm font-bold`.

**Mobile:** Hamburger menu (`Menu` icon from lucide). Opens a full-screen overlay `bg-[#0A0E1A]/95 backdrop-blur-2xl` with centered nav links stacked vertically, animated in with stagger.

---

### 3.2 HERO SECTION

**Background:** Full viewport height `min-h-screen`. Background: `bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#1E1B4B]`. Add two decorative gradient orbs — one blue (`bg-blue-600/15 blur-3xl`) top-right, one indigo (`bg-indigo-600/10 blur-3xl`) bottom-left. Optional: subtle animated particle dots or a faint grid pattern overlay at 3-5% opacity.

**Layout:** Flex column, centered vertically and horizontally. `text-center`.

**Content (staggered animation, each line fades up):**

1. **Badge/Label:** A small pill badge at top — `inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-full px-5 py-2 text-sm font-medium text-blue-300`. Text: "🔧 מוסך מקצועי עם שקיפות מלאה". Floating animation (subtle y bounce).

2. **Main Headline (H1):**
   