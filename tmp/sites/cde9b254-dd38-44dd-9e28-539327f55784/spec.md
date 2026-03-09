# spec.md — מוסך רונן | Premium Hebrew Landing Page Technical Specification

---

## 1. Project Overview

Build a **single-page, Awwwards/Dribbble-quality Hebrew landing page** for **מוסך רונן** — a professional auto repair garage emphasizing full transparency, fair pricing, and fast same-day service. The page must feel premium, trustworthy, and modern — not like a typical garage website. Think: the design language of a high-end SaaS product, applied to automotive services.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS v3+ |
| Animations | Framer Motion |
| Icons | lucide-react |
| Language | TypeScript |
| Font | Google Fonts — `Heebo` (Hebrew-first, weights: 300, 400, 500, 700, 900) |
| Direction | RTL (`dir="rtl"`) on `<html>` and `<body>` |

---

## 3. Global Design Rules (NON-NEGOTIABLE)

### 3.1 Spacing
- All sections must use **generous vertical padding**: `py-24` minimum, `py-32` preferred for hero and key sections.
- Internal grid gaps: `gap-8` minimum, `gap-12` preferred.
- Container max-width: `max-w-7xl mx-auto px-6 lg:px-12`.

### 3.2 Aesthetics
- **Glassmorphism cards**: `bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl`
- **Dark glassmorphism variant**: `bg-black/20 backdrop-blur-lg border border-white/10`
- **Drop shadows**: Always `shadow-2xl` or `shadow-xl` on cards, never flat.
- **Border radius**: Minimum `rounded-2xl`, prefer `rounded-3xl` on cards and sections.
- **No plain flat white or gray backgrounds** — every section must have a gradient or layered visual texture.

### 3.3 Color Palette
