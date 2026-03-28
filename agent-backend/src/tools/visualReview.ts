import OpenAI from "openai";
import type { DomChecks, ScreenshotResult } from "./screenshot";

export interface VisualQAResult {
    passed: boolean;
    score: number;
    criticalIssues: string[];
    warnings: string[];
    suggestions: string[];
    domCheckFailures: string[];
}

// Lazy-initialized to avoid crashing at import time when OPENAI_API_KEY is not set
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
    if (!_openai) {
        _openai = new OpenAI();
    }
    return _openai;
}

/**
 * Validates DOM checks and returns instant failures without needing an LLM call.
 */
function validateDomChecks(domChecks: DomChecks): string[] {
    const failures: string[] = [];

    if (domChecks.isBlankPage) {
        failures.push("CRITICAL: Page is blank or nearly empty (less than 50 characters of text content).");
    }
    if (!domChecks.hasRtlDir) {
        failures.push("CRITICAL: Missing dir='rtl' on html or body element. Hebrew content requires RTL layout.");
    }
    if (!domChecks.hasHebrew) {
        failures.push("CRITICAL: No Hebrew characters detected on the page. The landing page must contain Hebrew text.");
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
async function callVisionLLM(
    screenshots: ScreenshotResult,
    specContent: string
): Promise<{ score: number; criticalIssues: string[]; warnings: string[]; suggestions: string[] }> {
    const systemPrompt = `You are a senior UI/UX QA reviewer for a premium Hebrew landing page builder.
Your job is to review screenshots of a generated landing page and evaluate its visual quality against the design spec.

You must evaluate these specific criteria:
1. LAYOUT: Is it properly RTL (right-to-left)? Are sections well-structured with generous spacing?
2. VISUAL QUALITY: Does it use glassmorphism, gradients, shadows, and modern aesthetics? Is it Awwwards/Dribbble quality?
3. TYPOGRAPHY: Are headlines large and bold? Is the Hebrew text readable and well-sized?
4. RESPONSIVENESS: Does the mobile viewport look intentional (not just squished desktop)?
5. CONTENT COMPLETENESS: Are all spec sections present (Hero, About, Features, Testimonials, CTA, Footer)?
6. IMAGES: Are images visible and well-styled (rounded corners, shadows)?
7. OVERALL VIBE: Would this page impress a client paying $10,000 for a premium landing page?

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

criticalIssues = things that MUST be fixed (broken layout, missing sections, blank areas, no RTL)
warnings = things that SHOULD be fixed (poor spacing, weak typography, missing animations)
suggestions = nice-to-have improvements (color tweaks, animation polish)`;

    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        {
            type: "text",
            text: `Review these screenshots of a generated Hebrew landing page against this spec:\n\n---SPEC START---\n${specContent.substring(0, 3000)}\n---SPEC END---\n\nScreenshot 1: Desktop viewport (1440x900)\nScreenshot 2: Mobile viewport (375x812)\nScreenshot 3: Full-page desktop scroll`,
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
    } catch {
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
export async function runVisualReview(
    screenshots: ScreenshotResult,
    specContent: string
): Promise<VisualQAResult> {
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
    const visionResult = await callVisionLLM(screenshots, specContent);
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
export function formatVisualErrors(result: VisualQAResult): string {
    const lines: string[] = [];
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
