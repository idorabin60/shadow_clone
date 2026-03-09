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
- **Hero headline:** `text-5xl md:text-7xl font-black leading-tight` with gradient text (`bg-clip-text text-transparent bg-gradient-to-l`).
- **Section headings:** `text-3xl md:text-5xl font-bold`.
- **Subheadings:** `text-lg md:text-xl font-medium text-gray-400`.
- **Body text:** `text-base md:text-lg font-normal text-gray-300`.
- Letter-spacing should be slightly relaxed for Hebrew readability.

### 2.3 Color Palette
- **Primary:** `#3B82F6` (Electric Blue) — trust, technology, reliability.
- **Primary Light:** `#60A5FA`
- **Primary Dark:** `#1E40AF`
- **Accent:** `#F59E0B` (Amber/Gold) — premium feel, CTAs, highlights.
- **Background Dark:** `#0A0F1C` (Deep Navy-Black).
- **Background Card:** `rgba(255, 255, 255, 0.05)` with `backdrop-blur-xl`.
- **Surface:** `#111827` (Dark Gray).
- **Text Primary:** `#F9FAFB` (Near White).
- **Text Secondary:** `#9CA3AF` (Gray-400).
- **Success Green:** `#10B981` for trust badges/checkmarks.

### 2.4 Spacing Philosophy
- **Between sections:** `py-24 md:py-32 lg:py-40` — generous, breathable.
- **Inner section padding:** `px-6 md:px-12 lg:px-20`.
- **Card internal padding:** `p-8 md:p-10`.
- **Grid gaps:** `gap-6 md:gap-8 lg:gap-10`.
- **Max content width:** `max-w-7xl mx-auto`.
- Whitespace is a design element. Never crowd content.

### 2.5 Glassmorphism & Card Styling
- All cards: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl`.
- On hover: `hover:bg-white/10 hover:border-white/20 hover:shadow-blue-500/10 transition-all duration-500`.
- Some cards get a subtle gradient border using a wrapper div with `bg-gradient-to-br from-blue-500/20 to-amber-500/20 p-[1px] rounded-2xl`.

### 2.6 Backgrounds & Visual Depth
- **Hero:** Mesh gradient background using layered radial gradients — `radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.1), transparent 50%)` on top of `#0A0F1C`.
- **Sections alternate** between pure dark (`bg-[#0A0F1C]`) and slightly lighter (`bg-[#111827]`) with gradient transitions.
- Add floating, blurred orbs (absolute positioned divs with `w-96 h-96 bg-blue-500/10 rounded-full blur-3xl`) for ambient depth. At least 3-4 scattered across the page.
- Never use plain flat single-color backgrounds.

### 2.7 Micro-Interactions & Animations (framer-motion)
- **MANDATORY:** Use `framer-motion` for ALL section animations.
- **Scroll-reveal:** Every section uses `<motion.div>` with `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.2 }}`, `transition={{ duration: 0.7, ease: "easeOut" }}`.
- **Stagger children:** Service cards, feature boxes, and testimonials use `staggerChildren: 0.1` in parent `variants`.
- **Hover effects on cards:** `whileHover={{ y: -8, scale: 1.02 }}` with `transition={{ type: "spring", stiffness: 300 }}`.
- **CTA buttons:** `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.97 }}`.
- **Counter animations:** Numbers in stats section animate counting up using `useInView` + `useMotionValue` + `useTransform`.
- **Navbar:** Slides down on load with `initial={{ y: -100 }}` → `animate={{ y: 0 }}`.

### 2.8 Iconography
- **MANDATORY:** Use `lucide-react` for ALL icons. No other icon library.
- Icons should be `w-6 h-6` default, `w-8 h-8` for feature cards, `w-10 h-10` for hero-level icons.
- Icon containers: Circular or rounded-xl backgrounds with gradient fills (`bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl`).

### 2.9 Buttons
- **Primary CTA:** `bg-gradient-to-l from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 text-lg`.
- **Secondary CTA:** `bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300`.
- All buttons must be `<motion.button>` or wrapped in `<motion.div>` with hover/tap animations.

---

## 3. Page Sections — Detailed Specification

### 3.1 Navigation Bar (Sticky)
- **Position:** `fixed top-0 w-full z-50`.
- **Style:** `bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5`.
- **Content (RTL order):**
  - Right: Logo/Business name "מוסך רוזן פרו" — `text-xl font-bold` with a small wrench icon (`Wrench` from lucide-react) in blue gradient.
  - Center: Nav links — `אודות`, `שירותים`, `למה אנחנו`, `המלצות`, `צור קשר`. Style: `text-sm font-medium text-gray-400 hover:text-white transition-colors`.
  - Left: CTA button — "קבעו תור עכשיו" — Primary amber button, smaller size (`px-6 py-2.5 text-sm rounded-lg`).
- **Mobile:** Hamburger menu (`Menu` icon from lucide-react) that opens a full-screen overlay with `backdrop-blur-2xl bg-black/90` and centered nav links with stagger animation.
- **Animation:** Navbar fades in from top on page load.

---

### 3.2 Hero Section
- **Height:** `min-h-screen` — full viewport.
- **Layout:** Centered content, flex column, `items-center justify-center text-center`.
- **Background:**
  - Base: `bg-[#0A0F1C]`.
  - Mesh gradient overlay (CSS): Multiple radial gradients creating a moody blue/amber atmosphere.
  - Floating blurred orbs: One large blue orb top-right, one amber orb bottom-left (absolute positioned, `blur-3xl`, `opacity-20`).
  - Optional: Subtle CSS grid pattern overlay at `opacity-5` for texture.
- **Content:**
  - **Badge/Tag:** A small pill above the headline — `inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6`. Text: "🔧 מוסך מקצועי ואמין". Use `Shield` or `CheckCircle` icon.
  - **Headline:** 
    