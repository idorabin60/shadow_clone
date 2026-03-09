# Spec.md for "מוסך רוזן פרו" Landing Page

## Overview
This document outlines the design and technical specifications for the "מוסך רוזן פרו" landing page. The design must adhere to modern, premium aesthetics with a focus on user experience and engagement. The page will be built using a right-to-left layout to accommodate Hebrew content.

## Design Principles
1. **Generous, Breathable Spacing**: Utilize ample spacing throughout the design to ensure a clean and uncluttered look. Use classes like `py-24`, `py-32`, and `gap-12` to achieve this.

2. **Modern, Premium Aesthetics**: 
   - Implement Glassmorphism with `backdrop-blur` and `bg-white/10` for a sophisticated look.
   - Use subtle drop-shadows (`shadow-2xl`) to add depth.
   - Employ a Bento Box grid layout for showcasing features and services.

3. **Rich, Dynamic Backgrounds**: 
   - Use Tailwind gradients (`bg-gradient-to-br`) or mesh gradients to create visually appealing backgrounds.
   - Avoid plain flat colors to maintain a dynamic and engaging visual experience.

4. **Micro-interactions**: 
   - Integrate 'framer-motion' for scroll-reveal animations. Use effects like fade up and stagger on all major sections to enhance interactivity and engagement.

5. **High-quality Iconography**: 
   - Use 'lucide-react' for all icons to ensure a consistent and high-quality visual language.

6. **Right-to-Left Layout**: 
   - The entire layout must be set to `dir="rtl"` to properly display Hebrew content.

## Content Structure

### Header
- **Business Name**: "מוסך רוזן פרו"
- **Navigation Links**: Home, Services, About Us, Contact
- **Contact Information**: Display phone number prominently.

### Hero Section
- **Background**: Use a dynamic gradient or mesh background.
- **Headline**: "מוסך מקצועי לתיקון ותחזוקת רכבים"
- **Subheadline**: "שקיפות מלאה לפני כל תיקון, מחירים הוגנים בלי הפתעות"
- **Call to Action**: Button with "צור קשר עכשיו"

### Services Section
- **Layout**: Bento Box grid layout with generous spacing.
- **Content**: List of services with icons from 'lucide-react'.
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
- **Content**: Highlight the unique selling points with a focus on transparency, fair pricing, and quick service.

### Target Audience
- **Description**: Briefly describe the target audience, including private drivers, family car owners, students, businesses with company cars, and drivers before a test.

### Footer
- **Contact Information**: Include phone number and any other relevant contact details.
- **Social Media Links**: Icons and links to social media profiles.

## Technical Requirements
- **Frameworks/Libraries**: Use Tailwind CSS for styling, 'framer-motion' for animations, and 'lucide-react' for icons.
- **Accessibility**: Ensure all elements are accessible and the page is navigable via keyboard.
- **Performance**: Optimize images and assets for fast loading times.

## Conclusion
The "מוסך רוזן פרו" landing page must reflect a professional and modern aesthetic, with a focus on user engagement and clear communication of services and unique selling propositions. The design should be visually appealing, interactive, and fully optimized for a seamless user experience.
