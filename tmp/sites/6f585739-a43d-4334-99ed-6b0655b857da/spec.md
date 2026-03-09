# spec.md — "אטלס עיצובים" Premium Dark Landing Page

---

## 1. Project Overview

**Business Name:** אטלס עיצובים
**Business Type:** סטודיו לעיצוב פנים
**Target Audience:** בעלי דירות יוקרה ומשרדי הייטק המחפשים עיצוב פנים ברמה הגבוהה ביותר.
**Tone:** Professional, luxurious, refined, authoritative.
**Language:** Hebrew (RTL layout — `dir="rtl"`)

**Design Philosophy:**
This is NOT a generic landing page. This is a digital showroom for a luxury interior design studio. Every pixel must communicate sophistication, precision, and premium quality. Think: Awwwards-winning dark portfolio sites meets high-end architecture firm branding. The page must feel like walking into a beautifully designed penthouse — dark, warm, and breathtaking.

---

## 2. Brand & Color System

### 2.1 Color Palette (Dark Mode — Mandatory)

| Token                  | Value                  | Usage                                      |
|------------------------|------------------------|--------------------------------------------|
| `--bg-primary`         | `#0A0A0A`              | Main page background                       |
| `--bg-secondary`       | `#111111`              | Card backgrounds, section alternates       |
| `--bg-tertiary`        | `#1A1A1A`              | Elevated surfaces, bento cards             |
| `--bg-glass`           | `rgba(255,255,255,0.03)` | Glassmorphism panels                     |
| `--border-subtle`      | `rgba(255,255,255,0.06)` | Card borders, dividers                   |
| `--border-gold`        | `rgba(191,155,81,0.3)` | Gold accent borders on hover               |
| `--text-primary`       | `#F5F0E8`              | Headings, primary text (warm white)        |
| `--text-secondary`     | `#8A8578`              | Body text, descriptions (warm gray)        |
| `--text-muted`         | `#5A5650`              | Captions, labels                           |
| `--accent-gold`        | `#BF9B51`              | Primary CTA, accent highlights             |
| `--accent-gold-light`  | `#D4AF61`              | Hover states, gradients                    |
| `--accent-bronze`      | `#8B6914`              | Secondary accent, gradient endpoints       |
| `--accent-gold-glow`   | `rgba(191,155,81,0.15)` | Glow effects behind CTAs                  |

### 2.2 Gradient Definitions

- **Hero Gradient Overlay:** `bg-gradient-to-b from-black/80 via-black/50 to-[#0A0A0A]` — overlaid on hero background.
- **Gold Shimmer Gradient:** `bg-gradient-to-r from-[#8B6914] via-[#BF9B51] to-[#D4AF61]` — used for CTA buttons, accent lines, and decorative elements.
- **Radial Ambient Glow:** A large, soft radial gradient (`radial-gradient(ellipse at 50% 0%, rgba(191,155,81,0.06) 0%, transparent 70%)`) placed behind the Hero section to create a warm ambient light effect from the top.
- **Section Mesh Background:** Subtle mesh gradient using `radial-gradient(at 20% 80%, rgba(191,155,81,0.03) 0%, transparent 50%), radial-gradient(at 80% 20%, rgba(139,105,20,0.02) 0%, transparent 50%)` layered on `#0A0A0A`.

### 2.3 Typography

- **Font Family:** `"Heebo", sans-serif` — loaded from Google Fonts with weights: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).
- **Hero Headline:** `text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight` — massive, commanding.
- **Section Headings:** `text-3xl md:text-5xl font-bold leading-tight`
- **Sub-headings:** `text-xl md:text-2xl font-medium`
- **Body Text:** `text-base md:text-lg font-light leading-relaxed` — light weight for elegance.
- **Captions/Labels:** `text-sm font-medium uppercase tracking-[0.2em]` — in gold accent color.

---

## 3. Global Layout & Structural Rules

### 3.1 RTL Layout
- The root `<html>` element MUST have `dir="rtl"` and `lang="he"`.
- All text alignment defaults to right.
- All flexbox and grid layouts must respect RTL flow naturally.

### 3.2 Spacing Philosophy
- **Between major sections:** `py-28 md:py-36 lg:py-44` — extremely generous vertical breathing room.
- **Container max-width:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`
- **Between section heading and content:** `mb-16 md:mb-20`
- **Card internal padding:** `p-8 md:p-10`
- **Grid gaps:** `gap-6 md:gap-8`

### 3.3 Glassmorphism Card Standard
Every card/panel element MUST use:
