# Spec.md for מוסך רונן Landing Page

## Overview
This document outlines the technical specifications for building the landing page for "מוסך רונן", a professional garage service. The page will be built using Tailwind CSS for styling, with a focus on a professional tone to appeal to a young audience. The page will include sections for Hero, About, Services, Call to Action (CTA), and Footer.

## Color Theme
- **Primary Color**: `bg-blue-800` (for a professional and trustworthy appearance)
- **Secondary Color**: `bg-gray-100` (for a clean and modern look)
- **Accent Color**: `text-yellow-500` (to highlight important information)
- **Text Color**: `text-gray-900` (for readability)

## Sections

### Hero
- **Background**: `bg-blue-800`
- **Text**: 
  - Title: "מוסך רונן"
  - Subtitle: "המוסך הכי טוב במדינה מספק שירות 24/7 לכל בעיה"
  - Unique Selling Proposition: "100 מוסכניקים מומחים וצוות שזמין תמיד"
- **Text Color**: `text-white`
- **Layout**: Centered text with a large, bold font for the title and a slightly smaller font for the subtitle and USP.
- **Tailwind Classes**: `flex flex-col items-center justify-center h-screen text-center`

### About
- **Background**: `bg-gray-100`
- **Text**: 
  - Description: "המוסך הכי טוב במדינה מספק שירות 24/7 לכל בעיה"
- **Text Color**: `text-gray-900`
- **Layout**: Two-column layout with an image on one side and text on the other.
- **Tailwind Classes**: `flex flex-row items-center p-8`

### Services
- **Background**: `bg-white`
- **Text**: 
  - Title: "השירותים שלנו"
  - Services List: "מתנקים כל דבר אפשרי ברכב"
- **Text Color**: `text-gray-900`
- **Layout**: List format with icons for each service.
- **Tailwind Classes**: `grid grid-cols-1 md:grid-cols-2 gap-4 p-8`

### Call to Action (CTA)
- **Background**: `bg-blue-800`
- **Text**: 
  - Prompt: "צרו קשר עכשיו לקבלת שירות מקצועי"
  - Button: "התקשרו עכשיו"
- **Text Color**: `text-white`
- **Button Color**: `bg-yellow-500 hover:bg-yellow-600`
- **Layout**: Centered with a prominent button.
- **Tailwind Classes**: `flex flex-col items-center justify-center p-8`

### Footer
- **Background**: `bg-gray-900`
- **Text**: 
  - Business Name: "מוסך רונן"
  - Contact Information: "טלפון: [הכנס מספר טלפון כאן]"
- **Text Color**: `text-gray-100`
- **Layout**: Simple, single-column layout with centered text.
- **Tailwind Classes**: `flex flex-col items-center p-4`

## Additional Notes
- Ensure all text is aligned to the right to accommodate Hebrew reading direction.
- Use professional and clean fonts to maintain the tone.
- Ensure responsiveness across all devices, with particular attention to mobile users.
