# spec.md — "אטלס עיצובים" Landing Page Technical Specification

---

## 1. Project Overview

**Project Name:** אטלס עיצובים — Interior Design Studio Landing Page
**Language:** Hebrew (RTL)
**Tone:** Premium, Professional, Luxurious
**Target Audience:** High-net-worth individuals seeking luxury apartment design & Hi-Tech office design.
**Design Standard:** Awwwards / Dribbble quality — NO generic, flat, or "template-looking" designs allowed.

---

## 2. Global Design System & Rules

### 2.1 Direction & Language
- The entire `<html>` tag MUST have `dir="rtl"` and `lang="he"`.
- All text alignment, flex directions, and layout logic must respect RTL natively.
- Font: Use `"Heebo"` from Google Fonts (weights: 300, 400, 500, 700, 900). Heebo is a premium, modern Hebrew typeface. Import via `@import` or `<link>`.

### 2.2 Color Palette (Dark Luxury Theme)

| Token                  | Value                  | Usage                                      |
|------------------------|------------------------|--------------------------------------------|
| `--bg-primary`         | `#0A0A0A`              | Main page background                       |
| `--bg-secondary`       | `#111111`              | Card/section backgrounds                   |
| `--bg-tertiary`        | `#1A1A1A`              | Elevated surfaces, bento cards             |
| `--text-primary`       | `#F5F5F5`              | Headings, primary text                     |
| `--text-secondary`     | `#A0A0A0`              | Body text, descriptions                    |
| `--text-muted`         | `#666666`              | Subtle labels, footer text                 |
| `--accent-gold`        | `#C9A96E`              | Primary accent — buttons, highlights, icons|
| `--accent-gold-light`  | `#E2C992`              | Hover states, gradient endpoints           |
| `--accent-bronze`      | `#8B6914`              | Secondary accent — subtle borders, lines   |
| `--glass-white`        | `rgba(255,255,255,0.05)` | Glassmorphism card backgrounds           |
| `--glass-border`       | `rgba(255,255,255,0.08)` | Glassmorphism borders                    |

### 2.3 Spacing Philosophy
- **Generous, breathable spacing is NON-NEGOTIABLE.**
- Section vertical padding: minimum `py-24` on mobile, `py-32` or `py-40` on desktop.
- Inner content gaps: `gap-8`, `gap-12`, `gap-16` between elements.
- Card internal padding: `p-8` minimum, `p-10` or `p-12` preferred.
- Between section heading and content: `mb-16` to `mb-20`.
- Max content width: `max-w-7xl mx-auto` with `px-6` or `px-8` horizontal padding.

### 2.4 Typography Scale

| Element            | Classes                                                    |
|--------------------|------------------------------------------------------------|
| Hero Headline      | `text-5xl md:text-7xl lg:text-8xl font-black leading-tight`|
| Hero Subheadline   | `text-xl md:text-2xl font-light text-[--text-secondary]`  |
| Section Headline   | `text-4xl md:text-5xl font-bold`                          |
| Section Subtitle   | `text-lg md:text-xl font-light text-[--text-secondary]`   |
| Card Title         | `text-xl md:text-2xl font-semibold`                       |
| Card Description   | `text-base font-light text-[--text-secondary] leading-relaxed` |
| Button Text        | `text-base font-medium tracking-wide`                     |
| Nav Links          | `text-sm font-medium tracking-wider uppercase`            |

### 2.5 Backgrounds & Visual Depth
- **NO plain flat backgrounds.** Every section must have visual depth.
- Hero: Use a layered approach — a dark mesh/radial gradient background with a subtle gold radial glow (`radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.15) 0%, transparent 60%)`).
- Sections alternate between `--bg-primary` and `--bg-secondary` with subtle gradient overlays.
- Use `bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]` patterns.
- Add a very subtle noise/grain texture overlay (CSS `background-image` with a tiny SVG noise pattern at 2-4% opacity) on the body for tactile richness.
- Decorative elements: Floating blurred gold orbs (`absolute`, `w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full`) placed strategically behind sections.

### 2.6 Glassmorphism Cards
All cards (services, features, etc.) MUST use:
