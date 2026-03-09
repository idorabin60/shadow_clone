---
description: Frontend Architecture & Design Rules
---

# Frontend Architecture Rules

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** lucide-react

## Design Aesthetic (The "Vibe")
- **Reference:** Manus.im (Clean, minimalist, deeply structured)
- **Theme:** Dark Mode (Absolute dark backgrounds, high-contrast text, subtle glowing borders or minimal glassmorphism)
- **Language/Direction:** Hebrew (Right-To-Left `dir="rtl"`)
- **Typography:** Premium Hebrew fonts (e.g., Heebo, Assistant, or equivalent modern Sans-Serif), using `text-right` across all major text blocks.
- **Micro-interactions:** Smooth `<motion.div>` hovers, elegant page transitions, and subtle reveal animations on scroll.

## Code Conventions
- Keep components small and modular in the `src/components` directory.
- Use `clsx` and `tailwind-merge` for conditional class names (e.g., a `cn()` utility).
- Avoid standard `.css` files where possible; rely exclusively on Tailwind utility classes and arbitrary variants.
- Ensure all pages have proper SEO meta tags (in Hebrew if applicable).
