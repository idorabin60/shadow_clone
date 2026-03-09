# Spec.md for מוסך רוזן פרו Landing Page

## Overview
This document outlines the design and development specifications for the premium landing page of "מוסך רוזן פרו", a professional car garage. The design must adhere to modern UI/UX standards, ensuring a high-quality, engaging experience for users. The page will be built with a focus on transparency, quick service, and clear communication, targeting private drivers, family car owners, students, businesses with company cars, and drivers preparing for vehicle tests.

## Design Principles

### Layout
- **Right-to-Left Orientation**: The entire layout must be in RTL to accommodate Hebrew content.
- **Bento Box Grid Layout**: Use a modular grid system to organize features and services, ensuring clarity and ease of navigation.

### Spacing
- **Generous Spacing**: Implement ample spacing throughout the design (e.g., `py-24`, `py-32`, `gap-12`) to create a breathable and comfortable user experience.

### Aesthetics
- **Modern, Premium Look**: Utilize Glassmorphism with `backdrop-blur` and `bg-white/10` for a sleek, modern appearance. Incorporate subtle drop-shadows (`shadow-2xl`) to add depth.
- **Dynamic Backgrounds**: Employ Tailwind gradients (`bg-gradient-to-br`) or mesh gradients to create rich, engaging backgrounds. Avoid flat colors to maintain a dynamic visual appeal.

### Interactions
- **Micro-Interactions**: Integrate 'framer-motion' for scroll-reveal animations, including fade-up and stagger effects, to enhance user engagement and guide attention through the page.

### Iconography
- **High-Quality Icons**: Use 'lucide-react' for all icons to ensure a consistent and professional look.

## Content Structure

### Header
- **Business Name**: "מוסך רוזן פרו"
- **Tagline**: "שקיפות מלאה לפני כל תיקון, מחירים הוגנים בלי הפתעות, שירות מהיר מהיום להיום, אחריות על עבודה וחלקים"

### Introduction
- **Description**: "מוסך מקצועי לתיקון ותחזוקת רכבים עם דגש על שקיפות מלאה, שירות מהיר והסברים פשוטים. מתמחים באבחון תקלות, טיפולים תקופתיים ותיקוני חשמל ומיזוג"

### Services Section
- **Title**: "השירותים שלנו"
- **List of Services**: 
  - טיפולים תקופתיים
  - בדיקות לפני טסט
  - אבחון תקלות ממוחשב
  - תיקוני בלמים
  - תיקוני חשמל רכב
  - תיקון מיזוג אוויר
  - החלפת מצבר
  - כיוון פרונט
  - החלפת שמנים ופילטרים

### Unique Selling Proposition
- **Highlight**: Emphasize transparency, fair pricing, quick service, and warranty on work and parts.

### Target Audience
- **Description**: Tailor content to private drivers, family car owners, students, businesses with company cars, and drivers preparing for vehicle tests.

### Contact Information
- **Phone**: [Insert Phone Number Here]

## Technical Requirements
- **Frameworks**: Use React.js for the frontend with Tailwind CSS for styling.
- **Animations**: Implement 'framer-motion' for all animations.
- **Icons**: Use 'lucide-react' for iconography.
- **Accessibility**: Ensure the design is accessible, with appropriate contrast and text size.

## Conclusion
The landing page for "מוסך רוזן פרו" must reflect the professionalism and transparency of the business while providing a modern, engaging user experience. Adhering to these specifications will ensure a high-quality design that meets the needs of the target audience.
