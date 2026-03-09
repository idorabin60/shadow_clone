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
- **Body:** `font-normal` (400) or `font-medium` (500), `text-lg` or `text-xl`, `leading-relaxed`, muted color (`text-gray-300` on dark, `text-gray-600` on light).
- **Accent text / labels:** Uppercase-style Hebrew labels with `text-sm font-bold tracking-widest` and a vibrant accent color.

### 2.3 Color Palette
- **Primary:** Deep Electric Blue `#0D47A1` → Bright Blue `#2979FF` (gradient pair)
- **Secondary:** Warm Amber/Orange `#FF8F00` → `#FFB300` (CTA accent, highlights)
- **Dark Base:** `#0A0E1A` (near-black with blue undertone)
- **Dark Surface:** `#111827` / `#1E293B` (card backgrounds)
- **Glass:** `bg-white/5`, `bg-white/10`, `bg-white/15` with `backdrop-blur-xl`
- **Text Primary (on dark):** `#F1F5F9`
- **Text Secondary (on dark):** `#94A3B8`
- **Gradients:**
  - Hero BG: `bg-gradient-to-br from-[#0A0E1A] via-[#0D1B3E] to-[#1A1040]`
  - Accent gradient: `bg-gradient-to-r from-[#2979FF] to-[#00B0FF]`
  - Warm CTA gradient: `bg-gradient-to-r from-[#FF8F00] to-[#FFB300]`
  - Mesh gradient overlay using radial CSS gradients (blue + purple + teal blobs) on the hero

### 2.4 Spacing Philosophy
- **Sections:** Minimum `py-24` padding, prefer `py-32` for major sections. Use `py-40` for hero.
- **Between elements:** `gap-8`, `gap-12`, `gap-16` — never less than `gap-6`.
- **Container:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`
- **Cards internal padding:** `p-8` minimum, prefer `p-10`.

### 2.5 Visual Effects (Mandatory)
- **Glassmorphism:** All cards must use `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl` or `rounded-3xl`.
- **Shadows:** `shadow-2xl` on elevated elements. Use `shadow-blue-500/20` for colored glow shadows on primary elements.
- **Hover states:** All interactive elements must have smooth `transition-all duration-300` with scale (`hover:scale-[1.02]`), glow (`hover:shadow-blue-500/30`), or border-light (`hover:border-white/20`) effects.
- **Dividers:** Use subtle gradient lines (`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`) between sections instead of hard borders.

### 2.6 Micro-Interactions (framer-motion)
- **Library:** `framer-motion` is MANDATORY for all animations.
- **Scroll Reveal:** Every section's heading, text block, and card grid must animate in on scroll using `whileInView` with `viewport={{ once: true, amount: 0.2 }}`.
- **Default animation:** `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}` with `transition={{ duration: 0.6, ease: "easeOut" }}`.
- **Stagger children:** Card grids and service items must use stagger with `transition={{ staggerChildren: 0.1 }}` on the parent and individual child animations.
- **Hero:** Text elements fade up sequentially (stagger 0.15s). CTA buttons scale in with a slight spring (`type: "spring", stiffness: 200`).
- **Floating elements:** Decorative blobs/shapes in the hero should have infinite `animate={{ y: [0, -20, 0] }}` with `transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}`.
- **Counter animation:** Stats/numbers should count up from 0 using a number counter animation when in view.
- **Navbar:** `initial={{ y: -100 }}` → `animate={{ y: 0 }}` with smooth spring.

### 2.7 Iconography
- **Library:** `lucide-react` is MANDATORY for all icons.
- Icons must be rendered inside styled containers (glass circles or gradient-bg rounded squares) — never naked/unstyled.
- Icon containers: `w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-white/10`.
- Icon size: `w-6 h-6` or `w-7 h-7`, color: accent blue or amber.

### 2.8 Backgrounds & Decorative Elements
- **Hero:** Multi-layered — base dark gradient + CSS mesh gradient overlay (radial gradients of blue, purple, teal at various positions with low opacity) + optional subtle grid pattern (CSS `background-image` with thin lines at `white/5`).
- **Floating orbs:** 2-3 large blurred circles (`w-96 h-96 rounded-full bg-blue-500/10 blur-3xl absolute`) positioned behind content for depth.
- **Noise texture:** Optional subtle noise overlay at `opacity-[0.03]` for premium texture feel.
- **Section alternation:** Alternate between dark (`#0A0E1A`) and slightly lighter dark (`#111827`) backgrounds to create visual rhythm.

---

## 3. Component Architecture

