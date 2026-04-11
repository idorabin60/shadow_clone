"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVisualReview = runVisualReview;
exports.formatVisualErrors = formatVisualErrors;
const openai_1 = __importDefault(require("openai"));
// Lazy-initialized to avoid crashing at import time when OPENAI_API_KEY is not set
let _openai = null;
function getOpenAI() {
    if (!_openai) {
        _openai = new openai_1.default();
    }
    return _openai;
}
/**
 * Validates DOM checks and returns instant failures without needing an LLM call.
 */
function validateDomChecks(domChecks) {
    const failures = [];
    if (domChecks.isBlankPage) {
        failures.push("CRITICAL: Page is blank or nearly empty (less than 50 characters of text content).");
    }
    if (domChecks.hasRtlDir) {
        failures.push("CRITICAL: The page or a major container is using dir='rtl'. This landing page must render in standard LTR mode. Please fix this in layout.tsx.");
    }
    if (domChecks.brokenImages > 0) {
        failures.push(`WARNING: ${domChecks.brokenImages} of ${domChecks.imageCount} images failed to load (naturalWidth === 0).`);
    }
    if (domChecks.imageCount === 0) {
        failures.push("WARNING: No <img> elements found. A premium landing page should include images.");
    }
    if (domChecks.sectionCount < 2) {
        failures.push("WARNING: Less than 2 sections detected. A landing page typically has multiple distinct sections (Hero, About, Features, etc.).");
    }
    return failures;
}
/**
 * Sends screenshots to GPT-4o vision for qualitative UI review against the spec.
 */
async function callVisionLLM(screenshots, specContent, designSystem) {
    const styleContext = designSystem
        ? `Selected design system:
- Category: ${designSystem.category}
- Style: ${designSystem.style.name}
- Keywords: ${designSystem.style.keywords.join(", ")}
- Effects: ${designSystem.style.effects.join(", ")}
- Anti-patterns: ${designSystem.style.antiPatterns.join(", ")}
- Typography: ${designSystem.typography.headingFont} / ${designSystem.typography.bodyFont}
- Layout pattern: ${designSystem.layout.pattern}
`
        : "Selected design system: not available. Infer from spec only.";
    const systemPrompt = `You are a senior UI/UX QA reviewer for a premium landing page builder.
Your job is to review screenshots of a generated landing page and evaluate its visual quality against the design spec.

You must evaluate these specific criteria:
1. LAYOUT: Is the layout modern? Are sections well-structured with generous spacing?
2. VISUAL QUALITY: Does the page execute the chosen style consistently, instead of defaulting to generic glassmorphism? Is it Awwwards/Dribbble quality?
3. TYPOGRAPHY: Are headlines large and bold? Is the text readable and well-sized?
4. RESPONSIVENESS: Does the mobile viewport look intentional (not just squished desktop)?
5. CONTENT COMPLETENESS: Are all spec sections present (Hero, About, Features, Testimonials, CTA, Footer)?
6. IMAGES: Are images visible and well-styled (rounded corners, shadows)?
7. LTR READING FLOW: Does the page clearly read left-to-right, with primary copy blocks starting on the left on desktop? Flag layouts that feel mirrored or unintentionally RTL-like.
8. STYLE CONSISTENCY: Do sections feel like one system, or are there mixed visual languages?
9. ANTI-PATTERNS: Does the page violate any explicit anti-patterns from the design system?
10. OVERALL VIBE: Would this page impress a client paying $10,000 for a premium landing page?

Respond ONLY with valid JSON in this exact format:
{
  "score": <1-10>,
  "criticalIssues": ["issue1", "issue2"],
  "warnings": ["warning1"],
  "suggestions": ["suggestion1"]
}

Rules for scoring:
- 1-3: Broken, blank, or fundamentally unusable
- 4-5: Functional but looks amateur/basic
- 6-7: Decent but missing premium polish
- 8-9: Premium quality, minor issues only
- 10: Perfect Awwwards-level execution

criticalIssues = things that MUST be fixed (broken layout, missing sections, blank areas)
warnings = things that SHOULD be fixed (poor spacing, weak typography, missing animations, mild style drift)
suggestions = nice-to-have improvements (color tweaks, animation polish)`;
    const userContent = [
        {
            type: "text",
            text: `Review these screenshots of a generated landing page against this spec and design system.\n\n---DESIGN SYSTEM START---\n${styleContext}\n---DESIGN SYSTEM END---\n\n---SPEC START---\n${specContent.substring(0, 3000)}\n---SPEC END---\n\nBe explicit if the UI drifts into a different style family than requested.\nBe explicit if the page feels mirrored, right-anchored, or unintentionally RTL-like even when it is technically LTR.\nFor desktop split sections, primary copy should normally start on the left unless the spec clearly says otherwise.\n\nScreenshot 1: Desktop viewport (1440x900)\nScreenshot 2: Mobile viewport (375x812)\nScreenshot 3: Full-page desktop scroll`,
        },
        {
            type: "image_url",
            image_url: {
                url: `data:image/png;base64,${screenshots.desktop.toString("base64")}`,
                detail: "high",
            },
        },
        {
            type: "image_url",
            image_url: {
                url: `data:image/png;base64,${screenshots.mobile.toString("base64")}`,
                detail: "low",
            },
        },
        {
            type: "image_url",
            image_url: {
                url: `data:image/png;base64,${screenshots.desktopFullPage.toString("base64")}`,
                detail: "high",
            },
        },
    ];
    const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1024,
        temperature: 0,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
        ],
    });
    const raw = response.choices[0]?.message?.content || "";
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.log(`   └─ ⚠️ Vision LLM returned non-JSON: ${raw.substring(0, 200)}`);
        return {
            score: 5,
            criticalIssues: ["Vision QA could not parse LLM response. Manual review recommended."],
            warnings: [],
            suggestions: [],
        };
    }
    try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
            score: typeof parsed.score === "number" ? parsed.score : 5,
            criticalIssues: Array.isArray(parsed.criticalIssues) ? parsed.criticalIssues : [],
            warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        };
    }
    catch {
        console.log(`   └─ ⚠️ Vision LLM JSON parse error: ${raw.substring(0, 200)}`);
        return {
            score: 5,
            criticalIssues: ["Vision QA JSON parse failed. Manual review recommended."],
            warnings: [],
            suggestions: [],
        };
    }
}
/**
 * Main visual QA function. Runs DOM checks first, then vision LLM review.
 * Returns a structured result with pass/fail and detailed feedback.
 */
async function runVisualReview(screenshots, specContent, designSystem) {
    console.log("   └─ 🎨 Running DOM checks...");
    const domCheckFailures = validateDomChecks(screenshots.domChecks);
    // If the page is blank, skip the expensive vision call
    const hasCriticalDomFailure = domCheckFailures.some((f) => f.startsWith("CRITICAL"));
    if (screenshots.domChecks.isBlankPage) {
        console.log("   └─ ❌ Page is blank — skipping vision LLM review.");
        return {
            passed: false,
            score: 1,
            criticalIssues: domCheckFailures.filter((f) => f.startsWith("CRITICAL")),
            warnings: domCheckFailures.filter((f) => f.startsWith("WARNING")),
            suggestions: [],
            domCheckFailures,
        };
    }
    console.log("   └─ 🎨 Sending screenshots to Vision LLM for review...");
    const visionResult = await callVisionLLM(screenshots, specContent, designSystem);
    console.log(`   └─ 🎨 Vision LLM score: ${visionResult.score}/10`);
    // Merge DOM check failures into the result
    const allCritical = [
        ...domCheckFailures.filter((f) => f.startsWith("CRITICAL")),
        ...visionResult.criticalIssues,
    ];
    const allWarnings = [
        ...domCheckFailures.filter((f) => f.startsWith("WARNING")),
        ...visionResult.warnings,
    ];
    // Pass if score >= 7 AND no critical issues from DOM checks
    const passed = visionResult.score >= 7 && !hasCriticalDomFailure;
    return {
        passed,
        score: visionResult.score,
        criticalIssues: allCritical,
        warnings: allWarnings,
        suggestions: visionResult.suggestions,
        domCheckFailures,
    };
}
/**
 * Formats the visual QA result into a readable error report for the developer LLM.
 */
function formatVisualErrors(result) {
    const lines = [];
    lines.push(`Visual QA Score: ${result.score}/10 (${result.passed ? "PASSED" : "FAILED"})`);
    lines.push("");
    if (result.criticalIssues.length > 0) {
        lines.push("CRITICAL ISSUES (must fix):");
        result.criticalIssues.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
        lines.push("");
    }
    if (result.warnings.length > 0) {
        lines.push("WARNINGS (should fix):");
        result.warnings.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
        lines.push("");
    }
    if (result.suggestions.length > 0) {
        lines.push("SUGGESTIONS (nice to have):");
        result.suggestions.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
    }
    return lines.join("\n");
}
