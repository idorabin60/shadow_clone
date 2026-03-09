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
- **Sections:** Minimum `py-24` padding, prefer `py-32` for hero and major sections. Use `py-28` for mid-weight sections.
- **Container:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`.
- **Between elements:** `gap-8`, `gap-12`, `gap-16` — never less than `gap-6`.
- **Cards internal padding:** `p-8` minimum, prefer `p-10`.
- **Between sections:** Add decorative spacer dividers or gradient lines.

### 2.5 Visual Effects (Mandatory)
- **Glassmorphism:** Cards on dark backgrounds must use `bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl`.
- **Glassmorphism on light:** `bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-3xl shadow-xl`.
- **Shadows:** Use `shadow-2xl` on cards, `shadow-lg` on buttons. Add `hover:shadow-amber-500/20` or `hover:shadow-blue-500/25` for glow effects.
- **Rounded corners:** `rounded-2xl` minimum for cards, `rounded-3xl` preferred. Buttons: `rounded-xl` or `rounded-full`.
- **Gradient orbs:** Place 2-3 large blurred gradient circles (`w-96 h-96 bg-blue-500/20 blur-3xl rounded-full absolute`) as ambient background decoration in hero and CTA sections.
- **Noise texture overlay (optional):** A subtle SVG noise texture at 3-5% opacity over dark sections for depth.

### 2.6 Micro-Interactions & Animations (framer-motion)
- **ALL major sections** must animate in on scroll using `framer-motion`'s `useInView` or `whileInView`.
- **Default reveal:** Fade up — `initial={{ opacity: 0, y: 40 }}` → `whileInView={{ opacity: 1, y: 0 }}` with `transition={{ duration: 0.7, ease: "easeOut" }}`.
- **Stagger children:** Service cards, feature boxes, and testimonials must stagger with `transition={{ delay: index * 0.1 }}`.
- **Hover effects on cards:** `whileHover={{ y: -8, scale: 1.02 }}` with `transition={{ type: "spring", stiffness: 300 }}`.
- **Button hover:** Scale up slightly `whileHover={{ scale: 1.05 }}` and add glow shadow.
- **Counter/number animations:** Use `framer-motion`'s `useSpring` or `animate` for counting up stats.
- **Floating elements:** Subtle `animate={{ y: [0, -10, 0] }}` with `repeat: Infinity` on decorative icons or orbs.
- **Viewport:** `viewport={{ once: true, amount: 0.3 }}` to trigger animations once when 30% visible.

### 2.7 Iconography
- **Library:** `lucide-react` exclusively. No other icon library.
- **Icon style:** `strokeWidth={1.5}` for elegance. Size `w-6 h-6` for inline, `w-10 h-10` or `w-12 h-12` for feature cards.
- **Icon containers:** Wrap icons in a `w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-amber-500/10 flex items-center justify-center` container.

---

## 3. Section-by-Section Specification

---

### 3.1 — Sticky Navigation Bar

**Layout:** Fixed top, full-width, `z-50`.
**Style:**
- Initially transparent: `bg-transparent`.
- On scroll (after 50px): Transition to `bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg`.
- Height: `h-20`.
- Inner container: `max-w-7xl mx-auto flex items-center justify-between px-6`.

**Content (RTL order):**
- **Right side:** Logo — business name "מוסך רוזן פרו" as text logo. "רוזן" in `text-white font-black`, "פרו" with `bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent`. Small wrench icon from lucide-react next to it.
- **Center:** Nav links (hidden on mobile): `אודות` | `שירותים` | `למה אנחנו` | `המלצות` | `צור קשר`. Style: `text-slate-300 hover:text-white transition-colors font-medium`.
- **Left side:** CTA button: `קבעו תור עכשיו`. Style: `bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-amber-500/30`.

**Mobile:** Hamburger menu icon (lucide `Menu`). Opens a full-screen overlay `bg-slate-950/95 backdrop-blur-2xl` with centered nav links, large text, staggered animation.

---

### 3.2 — Hero Section

**Background:** `bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950` with:
- A large blurred orb: `absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/15 blur-3xl rounded-full`.
- A second orb: `absolute bottom-10 right-20 w-[400px] h-[400px] bg-amber-500/10 blur-3xl rounded-full`.
- Subtle grid pattern overlay at 3% opacity (CSS background-image with thin lines).

**Spacing:** `pt-40 pb-32` (extra top padding for navbar clearance).

**Layout:** Two columns on desktop (`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`).

**Right Column (Text — appears first in RTL):**
1. **Badge/Label:** A small pill: `inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium mb-6`. Text: `🔧 מוסך מקצועי עם שקיפות מלאה`. Icon: lucide `Shield`.
2. **Main Headline:** `text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight`. Text:
   