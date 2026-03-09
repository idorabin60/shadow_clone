# spec.md — מוסך רוזן פרו | Premium Landing Page Technical Specification

---

## 1. Project Overview

**Business:** מוסך רוזן פרו
**Type:** מוסך (Auto Repair Shop)
**Tone:** Professional, trustworthy, modern
**Language:** Hebrew (RTL)
**Goal:** A single-page, Awwwards-quality landing page that communicates transparency, speed, and professionalism. The page must convert visitors into customers through clear CTAs, trust signals, and a frictionless contact flow.

---

## 2. Global Design System & Rules

### 2.1 Direction & Language
- The entire `<html>` tag MUST have `dir="rtl"` and `lang="he"`.
- All text alignment defaults to `text-right`.
- All flex/grid layouts must respect RTL flow naturally.

### 2.2 Typography
- **Primary Font:** `Heebo` (Google Fonts) — weights: 400, 500, 700, 800, 900.
- **Headings:** `font-extrabold` or `font-black`, tracking tight (`tracking-tight`).
- **Body:** `font-normal` (400) or `font-medium` (500), `leading-relaxed` or `leading-loose`.
- **Hero headline:** Minimum `text-5xl md:text-6xl lg:text-7xl`.
- **Section headings:** `text-3xl md:text-4xl lg:text-5xl`.
- **Sub-headings:** `text-xl md:text-2xl`.
- **Body text:** `text-base md:text-lg`, color `text-slate-300` or `text-slate-400` on dark backgrounds.

### 2.3 Color Palette
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#F97316` (Orange 500) | CTAs, accents, highlights, icon accents |
| `--primary-light` | `#FB923C` (Orange 400) | Hover states, gradients |
| `--primary-dark` | `#EA580C` (Orange 600) | Active states |
| `--bg-dark` | `#0A0A0F` | Page background base |
| `--bg-card` | `rgba(255,255,255,0.05)` | Glassmorphic card backgrounds |
| `--bg-card-hover` | `rgba(255,255,255,0.08)` | Card hover state |
| `--text-primary` | `#F8FAFC` (Slate 50) | Headings, primary text |
| `--text-secondary` | `#94A3B8` (Slate 400) | Body text, descriptions |
| `--text-muted` | `#64748B` (Slate 500) | Captions, labels |
| `--border` | `rgba(255,255,255,0.10)` | Card borders, dividers |
| `--accent-blue` | `#3B82F6` | Secondary accent for variety |

### 2.4 Spacing Philosophy
- **Between sections:** `py-24 md:py-32 lg:py-40` — generous, breathable.
- **Inside sections:** `gap-12 md:gap-16 lg:gap-20` between major elements.
- **Card padding:** `p-6 md:p-8 lg:p-10`.
- **Container:** `max-w-7xl mx-auto px-6 md:px-8 lg:px-12`.
- **NEVER** use cramped spacing. White space is a design feature.

### 2.5 Glassmorphism & Card Styling
Every card/panel MUST use:
