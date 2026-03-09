# Design System & UI Shell Setup

I have successfully built the core design system and the main UI layout (the "shell") for the builder. Here is what was implemented:

## 1. Hebrew Typography (Google Fonts)
In `src/app/layout.tsx`, I configured Next.js to load three native Hebrew fonts from Google Fonts:
*   **Heebo** 
*   **Assistant**
*   **Rubik**

These are loaded optimally (no render-blocking) and exposed as CSS Variables (`--font-heebo`, etc.).

## 2. RTL & Global Reset
In `src/app/globals.css`, the root `<html>` tag was updated to `lang="he" dir="rtl"`.
I added CSS rules to ensure text aligns to the right (`text-align: right`) and the entire application respects the RTL direction natively.

## 3. The 5 Theme Presets
I created a CSS Variables system in `globals.css` that defines 5 distinct themes:
1.  **Modern** (מודרני) - Blue primary, clean look. (Default)
2.  **Classic** (קלאסי) - Greyscale, sharp corners, formal.
3.  **Bold** (בולט) - High contrast, large rounded corners, thick fonts.
4.  **Minimal** (מינימליסטי) - Very subtle grays, extremely clean.
5.  **Warm** (חמים) - Earthy tones, friendly approachable styling.

The system works by changing a simple `data-theme="warm"` attribute on the `<html>` tag, which instantly updates all the colors and fonts on the page.

## 4. The UI Shell (`page.tsx`)
I built the main workspace layout which consists of:
*   **Sidebar (Right side due to RTL):** Contains the Theme Switcher. Later, this will house the Business Information Wizard.
*   **Header:** Contains device preview toggles (Desktop, Tablet, Mobile) and the Export button.
*   **Preview Canvas:** A centered area that dynamically resizes based on the selected device. It contains a mock "Visual Test block" so you can click the different themes in the sidebar and see the colors and fonts change in real-time.

## Next Steps
You can run `npm run dev` in your terminal and open `localhost:3000` in your browser to test clicking the themes and changing the device sizes!
The next tasks on our checklist are to set up the strict linting rules (ESLint, Biome, Prettier) and set up Playwright for our automated tests.
