import { NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { PageAssembler } from "@/lib/assembler/PageAssembler";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const { data, businessInfo, theme } = await req.json();

        if (!data || !businessInfo || !theme) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        // Read the CSS files from disk so we can inline them
        const globalsCssPath = path.join(process.cwd(), "src/app/globals.css");
        const templatesCssPath = path.join(process.cwd(), "src/styles/templates.css");

        const globalsCss = await fs.readFile(globalsCssPath, "utf-8");
        const templatesCss = await fs.readFile(templatesCssPath, "utf-8");

        // Render the React components to a static HTML string
        // We pass the props exactly as we do in the frontend
        const componentHtml = renderToStaticMarkup(
            // @ts-ignore - renderToStaticMarkup expects a ReactElement, which PageAssembler returns
            PageAssembler({ data, businessInfo, theme })
        );

        // Construct the final, standalone HTML document
        const fullHtml = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessInfo.businessName} - דף נחיתה</title>
  
  <!-- Fallback Fonts for standalone export -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
  
  <style>
    /* Injected from Next.js CSS */
    :root {
      --font-heebo: 'Heebo', sans-serif;
      --font-assistant: 'Assistant', sans-serif;
    }
    
    ${globalsCss}
    
    /* Template specific CSS */
    ${templatesCss}
    
    /* Reset some Next.js specific shell styles that aren't needed in standalone */
    body {
      overflow: auto !important;
      direction: rtl;
    }
  </style>
</head>
<body>
  ${componentHtml}
  
  <!-- Small script to trigger animations on load -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const elements = document.querySelectorAll(".animate-ready > *");
      elements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.animation = "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        el.style.animationDelay = (index * 0.1) + "s";
      });
    });
  </script>
</body>
</html>`;

        // Return the raw HTML string
        return new NextResponse(fullHtml, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
            },
        });

    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
