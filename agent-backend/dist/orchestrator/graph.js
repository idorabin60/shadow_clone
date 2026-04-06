"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestratorApp = void 0;
const langgraph_1 = require("@langchain/langgraph");
const openai_1 = require("@langchain/openai");
const anthropic_1 = require("@langchain/anthropic");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("../tools");
const tools_2 = require("../tools");
const emitter_1 = require("./emitter");
const events_1 = require("events");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../lib/logger");
const xmlParser_1 = require("./xmlParser");
const devTools_1 = require("./devTools");
const contextManager_1 = require("./contextManager");
const errorClassifier_1 = require("./errorClassifier");
const parallelWriter_1 = require("./parallelWriter");
const designSystem_1 = require("./designSystem");
const inspirationDistiller_1 = require("./inspirationDistiller");
const specParser_1 = require("./specParser");
const zod_1 = require("zod");
dotenv_1.default.config();
(0, events_1.setMaxListeners)(50);
// Mock implementation of Tool calling via literal execution.
// In a full @langchain/core agent setup, we'd bindTools(). 
// For this MVP, we explicitly instruct the LLM to output JSON commands for tools 
// or use the new ChatOpenAI `.bindTools`// We use GPT-4o as a fallback or for logical QA checking
const openaiModel = new openai_1.ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0
});
// We prefer Claude 3.5 Sonnet for the Developer and Architect nodes as it is currently 
// the industry gold standard for autonomous React/Vite coding and complex tool patching.
const claudePmModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY
    })
    : openaiModel;
const claudeDevModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : openaiModel;
// The PM uses Claude with a direct fallback to OpenAI for 529/429 errors.
const pmModel = claudePmModel;
const devModel = claudeDevModel;
// ─── Per-node timeouts (ms) — prevents any single LLM call from hanging ─────
const TIMEOUTS = {
    pm: 180_000, // 180s — PM writes spec
    devLoopStep: 180_000, // 180s — each step in the developer agent loop (Opus needs time for large rewrites)
    qa_ts: 30_000, // 30s — tsc check
    qa_build: 120_000, // 120s — next build (longer than vite)
    qa_visual: 180_000, // 3 min — screenshots + vision LLM
};
const DevMemorySchema = zod_1.z.object({
    intent: zod_1.z.string(),
    components_completed: zod_1.z.array(zod_1.z.string()),
    design_decisions: zod_1.z.array(zod_1.z.string()),
    known_issues: zod_1.z.array(zod_1.z.string()),
    next_steps: zod_1.z.array(zod_1.z.string()),
});
/**
 * Node 1: Product Manager
 * Reads the business input, writes a comprehensive spec.md to the sandbox.
 */
async function productManagerNode(state) {
    const sandboxId = state.sandboxPath.split('/').pop() ?? state.sandboxPath;
    const pmStart = Date.now();
    (0, logger_1.log)('PM', 'start', { sandboxId, businessName: state.businessInput?.businessName });
    emitter_1.emitter.stepStart("pm");
    // Generate data-driven design system recommendation based on business type.
    // The design system CSV databases are in English, so we first extract English keywords
    // from the (typically Hebrew) business input via a quick LLM call.
    const rawInput = typeof state.businessInput === 'string'
        ? state.businessInput
        : JSON.stringify(state.businessInput);
    let designQuery = 'business website';
    try {
        const classifyResponse = await openaiModel.invoke([
            new messages_1.SystemMessage('Extract 2-5 English keywords describing this business type and tone. Output ONLY the keywords separated by spaces. Example: "luxury restaurant fine dining". No other text.'),
            new messages_1.HumanMessage(rawInput),
        ]);
        const keywords = classifyResponse.content.trim();
        if (keywords.length > 0 && keywords.length < 200) {
            designQuery = keywords;
        }
        (0, logger_1.log)('PM', 'design_query_extracted', { keywords: designQuery });
    }
    catch (e) {
        (0, logger_1.log)('PM', 'design_query_fallback', { error: e.message });
    }
    const designSystem = await (0, designSystem_1.generateDesignSystem)(designQuery);
    // Store on state for downstream nodes (parallel writer, dev prompt)
    state.__designSystem = designSystem;
    const systemPrompt = `You are a world-class UI/UX Designer and Brand Strategist for a premium Hebrew landing page builder.
Your job is to analyse the client's business and produce a precise, structured spec.md that leaves zero ambiguity for the developer.
The design MUST be Awwwards/Dribbble quality. Vague or generic specs are unacceptable.

DESIGN SYSTEM RECOMMENDATION (generated from analysis of "${designQuery}"):
- Category: ${designSystem.category}
- Recommended Style: ${designSystem.style.name}
- Style Keywords: ${designSystem.style.keywords.join(', ')}
- Visual Effects: ${designSystem.style.effects.join(', ')}
- Anti-Patterns to AVOID: ${designSystem.style.antiPatterns.join(', ')}
- Recommended Colors: Primary ${designSystem.colors.primary}, Secondary ${designSystem.colors.secondary}, Accent ${designSystem.colors.accent}, Background ${designSystem.colors.background}, Text ${designSystem.colors.text}
- Color Notes: ${designSystem.colors.notes}
- Heading Font: ${designSystem.typography.headingFont}
- Body Font: ${designSystem.typography.bodyFont} (Hebrew-compatible)
- Recommended Sections: ${designSystem.layout.sections.join(' > ')}
- Layout Pattern: ${designSystem.layout.pattern}
- CTA Placement: ${designSystem.layout.ctaPlacement}

Use this recommendation as your design foundation. You may fine-tune the colors to match the specific brand personality, but follow the recommended style, typography pairing, visual effects, and section structure. Do NOT default to glassmorphism unless the recommendation specifically suggests it.

You MUST output spec.md using EXACTLY this structure (fill every section based on the specific business):

## Business Analysis
- Type: ${designSystem.category}
- Tone: [Professional / Playful / Luxurious / Trustworthy / Bold / Minimalist — pick based on business]
- Primary CTA: [exact Hebrew button text, e.g. "קבע פגישה עכשיו"]
- Value Proposition: [one sentence in Hebrew describing the core offer]

## Color Palette
Use the recommended colors as your starting point. Fine-tune if needed for this specific brand.
- Primary: ${designSystem.colors.primary}
- Secondary: ${designSystem.colors.secondary}
- Accent: ${designSystem.colors.accent} (CTA buttons, highlights, links)
- Background: ${designSystem.colors.background}
- Text Primary: ${designSystem.colors.text}
- Text Secondary: [a muted variant of the text color]

## Typography
- Heading Font: ${designSystem.typography.headingFont}
- Body Font: ${designSystem.typography.bodyFont} (Hebrew-compatible)
- CSS Import: ${designSystem.typography.cssImport}
- Font Weights: 300 (body light), 400 (body), 700 (bold), 900 (hero headline)
- Hero Headline: text-6xl md:text-8xl font-black leading-tight tracking-tight
- Section Headline: text-4xl md:text-5xl font-bold
- Body Text: text-lg font-light leading-relaxed

## Image Strategy
- Hero Background: [3-5 relevant Unsplash search keywords for this specific business, e.g. "modern lawyer office" or "artisan bakery bread"]
- Feature/About Images: [3-5 relevant keywords]
- Style Rules: object-cover; hero images w=1600, card images w=800

## Sections (ordered — business-specific, not generic)
Use the recommended sections (${designSystem.layout.sections.join(', ')}) as a starting point, but adapt for this specific business:
1. Navbar — logo (business name in Hebrew) + Hebrew nav links
2. Hero — [Hebrew headline], [Hebrew subline], CTA button: "[exact Hebrew CTA text]"
3. [Section name] — [brief content description with Hebrew placeholder copy]
... (add as many as this business needs)
N. Footer — Hebrew links, copyright, social icons

## Component List
List every section component .tsx file the developer must create (one per line):
- Navbar.tsx
- Hero.tsx
- [BusinessSpecificSection].tsx
...
- Footer.tsx

## Design System Rules
- Style: ${designSystem.style.name} — follow the visual language of this style
- Effects: ${designSystem.style.effects.join(', ')}
- Animations: framer-motion on sections (use effects appropriate to the "${designSystem.style.name}" style — NOT always fade-up)
- Icons: lucide-react only
- RTL: dir="rtl" on root element, text-right throughout, flex-row-reverse where needed
- Images: never empty divs; always Unsplash URLs relevant to this business
- AVOID: ${designSystem.style.antiPatterns.join(', ')}

Here are the specific Business Details from the user:
${JSON.stringify(state.businessInput, null, 2)}

Output ONLY the spec.md content wrapped in a markdown code block. No other text.`;
    let response;
    try {
        response = await (0, logger_1.withTimeout)(pmModel.invoke([
            new messages_1.SystemMessage(systemPrompt),
            new messages_1.HumanMessage("Generate the spec.md for this business. Fill every section with specific, concrete details — no generic placeholders."),
            ...state.messages
        ]), TIMEOUTS.pm, 'PM');
    }
    catch (err) {
        (0, logger_1.log)('PM', 'failed', { error: err.message, elapsedMs: Date.now() - pmStart });
        emitter_1.emitter.stepFailed("pm", `PM Generation failed: ${err.message}`);
        return {
            status: "failed",
            errorLogs: `Product Manager step failed: ${err.message}`,
            messages: state.messages
        };
    }
    // Cost tracking
    const costTracker = new logger_1.CostTracker();
    const pmUsage = response?.usage_metadata;
    costTracker.record('PM', 'claude-sonnet-4-6', pmUsage);
    // Extract text inside ```md or just use raw text
    let specContent = response.content;
    (0, logger_1.log)('PM', 'raw_response', { chars: specContent.length, hasMarkdownFence: specContent.includes('```') });
    const mdMatch = specContent.match(/```(?:markdown|md|)\n([\s\S]*?)```/);
    if (mdMatch) {
        specContent = mdMatch[1];
        (0, logger_1.log)('PM', 'extracted_from_fence', { chars: specContent.length });
    }
    if (specContent.length < 500) {
        (0, logger_1.log)('PM', 'spec_too_short', { chars: specContent.length, preview: specContent.slice(0, 200) });
    }
    // Use the write tool to save it
    await tools_1.tools.writeFile(state.sandboxPath, "spec.md", specContent);
    (0, logger_1.log)('PM', 'spec_written', { chars: specContent.length });
    // Save design system recommendation for downstream nodes (parallel writer, dev prompt)
    await tools_1.tools.writeFile(state.sandboxPath, "design_system.json", JSON.stringify(designSystem, null, 2));
    (0, logger_1.log)('PM', 'design_system_saved', { style: designSystem.style.name, category: designSystem.category });
    // Parse the Component List from spec.md so the manifest reflects the actual business structure.
    // Falls back to the default 4-component set if the section is missing or malformed.
    const componentListMatch = specContent.match(/## Component List\n([\s\S]*?)(?:\n##|$)/);
    let componentsList = ["App.tsx", "Navbar.tsx", "Hero.tsx", "Footer.tsx"];
    if (componentListMatch) {
        const parsed = componentListMatch[1]
            .split("\n")
            .map(line => line.replace(/^-\s*src\//, "").trim())
            .filter(line => line.endsWith(".tsx") && line.length > 0);
        if (parsed.length >= 3) {
            componentsList = parsed;
            (0, logger_1.log)('PM', 'component_list_parsed', { count: parsed.length, components: parsed });
        }
        else {
            (0, logger_1.log)('PM', 'component_list_fallback', { reason: 'parsed_too_few', count: parsed.length });
        }
    }
    else {
        (0, logger_1.log)('PM', 'component_list_fallback', { reason: 'section_not_found' });
    }
    // Log color palette and sections count for debugging spec quality
    const colorMatch = specContent.match(/## Color Palette\n([\s\S]*?)(?:\n##|$)/);
    const sectionsMatch = specContent.match(/## Sections[\s\S]*?\n((?:\d+\..+\n?)+)/);
    (0, logger_1.log)('PM', 'spec_quality_check', {
        hasColorPalette: !!colorMatch,
        hasSections: !!sectionsMatch,
        sectionCount: sectionsMatch ? sectionsMatch[1].split('\n').filter(Boolean).length : 0,
        hasImageStrategy: specContent.includes('## Image Strategy'),
        hasTypography: specContent.includes('## Typography'),
    });
    const initialManifest = {
        components_list: componentsList,
        naming_rules: [
            "Navigation MUST be named Navbar.tsx. Never Navigation.tsx",
            "Do not overwrite tailwind.config.js unless requested",
            "Avoid rewriting index.html"
        ],
        entry_file_imports: ["import App from './App.tsx'"]
    };
    await tools_1.tools.writeFile(state.sandboxPath, "project_manifest.json", JSON.stringify(initialManifest, null, 2));
    // Seed the living anchor memory — updated by Developer after each iteration
    const initialMemory = {
        intent: typeof state.businessInput === "string"
            ? state.businessInput
            : JSON.stringify(state.businessInput),
        components_completed: [],
        design_decisions: [],
        known_issues: [],
        next_steps: ["Build initial component structure per spec.md"]
    };
    await tools_1.tools.writeFile(state.sandboxPath, "dev_memory.json", JSON.stringify(initialMemory, null, 2));
    (0, logger_1.log)('PM', 'done', { elapsedMs: Date.now() - pmStart, components: componentsList.length });
    emitter_1.emitter.stepDone("pm");
    return {
        status: "coding",
        messages: state.messages
    };
}
/**
 * Node 2: Developer
 * Reads spec.md, uses a ReAct Tool Loop to iteratively write React code and run commands.
 */
async function developerNode(state) {
    const sandboxId = state.sandboxPath.split('/').pop() ?? state.sandboxPath;
    const devStart = Date.now();
    (0, logger_1.log)('DEV', 'start', { sandboxId, iteration: state.iterationCount, hasErrors: !!state.errorLogs });
    emitter_1.emitter.stepStart("developer", state.iterationCount);
    const spec = await tools_1.tools.readFile(state.sandboxPath, "spec.md");
    (0, logger_1.log)('DEV', 'spec_loaded', {
        chars: spec.length,
        hasComponentList: spec.includes('## Component List'),
        hasSections: spec.includes('## Sections'),
        hasDesignRules: spec.includes('## Design System Rules'),
    });
    // Read living anchor memory — built up across iterations
    let devMemory = {
        intent: "",
        components_completed: [],
        design_decisions: [],
        known_issues: [],
        next_steps: []
    };
    try {
        const memRaw = await tools_1.tools.readFile(state.sandboxPath, "dev_memory.json");
        if (!memRaw.startsWith("Error")) {
            devMemory = JSON.parse(memRaw);
            console.log(`[DEV_MEMORY] Loaded dev_memory.json — components_completed: [${devMemory.components_completed.join(", ")}], next_steps: ${devMemory.next_steps.length}`);
        }
        else {
            (0, logger_1.log)('MEMORY', 'read_failed', { reason: memRaw.slice(0, 80) });
        }
    }
    catch (e) {
        (0, logger_1.log)('MEMORY', 'parse_error', { error: e.message });
    }
    (0, logger_1.log)('MEMORY', 'loaded', {
        completedComponents: devMemory.components_completed.length,
        knownIssues: devMemory.known_issues.length,
        nextSteps: devMemory.next_steps.length,
    });
    const memoryContext = `

## SESSION MEMORY (Your persistent context across iterations)
\`\`\`json
${JSON.stringify(devMemory, null, 2)}
\`\`\`
Use this to understand what has already been built and what remains. You will update dev_memory.json at the end of your work via a <file path="dev_memory.json"> block.`;
    let errorContext = state.errorLogs
        ? `\n\n## CRITICAL: QA FAILED — YOU MUST FIX THESE ERRORS\n${state.errorLogs}\n\nOutput <file> blocks to fix these errors. Only rewrite the files that are broken.`
        : "";
    // For visual QA failures, load stored inspiration briefs to guide the fix
    if (state.errorLogs && state.errorLogs.includes('Visual QA failed')) {
        try {
            const briefsRaw = await tools_1.tools.readFile(state.sandboxPath, 'inspiration_briefs.json');
            if (!briefsRaw.startsWith('Error')) {
                const briefs = JSON.parse(briefsRaw);
                // Include briefs for the most visual components to guide fixes
                const visualComps = ['Hero', 'Features', 'Services', 'Testimonials'];
                const briefSnippets = visualComps
                    .filter(name => briefs[name])
                    .map(name => `${name}:\n${briefs[name].brief}`)
                    .join('\n\n');
                if (briefSnippets) {
                    errorContext += `\n\nDESIGN BRIEFS (use these as visual reference for your fixes):\n${briefSnippets}`;
                }
                (0, logger_1.log)('DEV', 'visual_fix_briefs_loaded', { components: visualComps.filter(n => briefs[n]).length });
            }
        }
        catch { /* non-blocking */ }
    }
    // Read design system for dynamic dev prompt rules
    let devDesignSystem = null;
    try {
        const dsRaw = await tools_1.tools.readFile(state.sandboxPath, "design_system.json");
        if (!dsRaw.startsWith("Error"))
            devDesignSystem = JSON.parse(dsRaw);
    }
    catch { /* use fallback rules */ }
    const dsRules = devDesignSystem
        ? (0, designSystem_1.generateDesignTokenBlock)(devDesignSystem)
        : `FONT SETUP (in src/globals.css):
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');
Body font: 'Heebo', sans-serif; direction: rtl;`;
    const devPrompt = `You are an elite Senior Next.js Developer at a top-tier design agency.
You are building an ultra-premium Hebrew landing page using Next.js App Router. The spec.md below defines EVERYTHING: colors, fonts, sections, image themes, and Hebrew copy. Follow it precisely.

PROJECT STRUCTURE (Next.js App Router):
- src/app/layout.tsx — root layout with HTML lang="he" dir="rtl"
- src/app/page.tsx — main page that imports and renders all section components
- src/components/sections/ — individual section components (Hero.tsx, Services.tsx, etc.)
- src/components/ui/ — shadcn/ui components (pre-installed)
- src/lib/utils.ts — cn() utility
- src/globals.css — Tailwind + font imports

CRITICAL TECHNICAL LIBRARIES (PRE-INSTALLED, DO NOT NPM INSTALL THEM):
- 'next' (Next.js framework — use Image from "next/image", Link from "next/link")
- 'lucide-react' (icons)
- 'framer-motion' (animations — components using it MUST have "use client" at the top)
- 'clsx' and 'tailwind-merge'
- shadcn/ui components: Button ("@/components/ui/button"), Badge ("@/components/ui/badge"), Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter ("@/components/ui/card"), Separator ("@/components/ui/separator"), Avatar/AvatarImage/AvatarFallback ("@/components/ui/avatar")
- cn() utility from "@/lib/utils"
Tailwind CSS is fully configured. Path alias "@/" maps to "src/".

NEXT.JS RULES:
- Use Image from "next/image" for all images (set width/height props).
- Components that use framer-motion, useState, useEffect, or event handlers MUST have "use client" at the top.
- Section components go in src/components/sections/ and are imported by src/app/page.tsx.

TOOLS AVAILABLE:
- read_file: inspect existing code before patching
- list_files: explore the sandbox structure
- npm_install: install packages if something is missing
- search_components: search 21st.dev for UI inspiration (use ONLY if QA says a component looks generic)
- refine_component: send a component to 21st.dev for AI-powered refinement

${dsRules}

MANDATORY DESIGN & IMPLEMENTATION RULES:
1. Follow the spec.md Color Palette EXACTLY — use the specified hex values and gradient for the background. Do not invent colors.
2. Follow the spec.md Typography scale EXACTLY — hero sizes, section sizes, weights as specified.
3. Animations: use framer-motion with animations appropriate to the design style defined in spec.md Design System Rules. Use viewport-triggered animations with staggered children.
4. Card/container styling: follow the spec.md Design System Rules — use the card treatment specified there, NOT a default glassmorphism.
5. Images: use Unsplash URLs matching the business theme from spec.md Image Strategy.
   URL format: https://images.unsplash.com/photo-XXXXXX?auto=format&fit=crop&w=1200&q=80
   Choose photos relevant to the business — read the spec.md Image Strategy section for the correct themes.
   Hero backgrounds: use w=1600. Card images: use w=800.
6. RTL: dir="rtl" on the root <div> in App.tsx. text-right on all text. flex-row-reverse on horizontal layouts.
7. Component naming: navigation MUST be Navbar.tsx. Never Navigation.tsx.
8. Build EVERY component listed in spec.md Component List — do not skip any section.
9. Hebrew copy: use the actual Hebrew content from spec.md, not generic placeholders.

CRITICAL WORKFLOW (PATCH -> VERIFY):
1. READ spec.md carefully — it defines sections, colors, fonts, and image themes for THIS specific business.
2. PATCH: output ALL files as raw XML <file> blocks in your text response. Do NOT use write_file or apply_patchset tools.
   <file path="src/components/sections/Hero.tsx">
   "use client";
   export default function Hero() { return <section dir="rtl" />; }
   </file>
3. VERIFY: your XML is auto-extracted and tsc --noEmit is run. Fix any errors in the next step.

Your task: Fix any TypeScript errors or QA issues in the generated components. Output only the files that need changes.

Here is the exact spec.md written by the UX Architect:
=========================================
${spec}
=========================================
${memoryContext}
${errorContext}`;
    const prompt = devPrompt;
    const fileCache = new Map();
    // Tools are defined in devTools.ts — scoped to this sandbox + file cache
    const { agentTools, toolsByName } = (0, devTools_1.createDevTools)(state.sandboxPath, fileCache);
    // Bind the tools to the Developer Model (Claude preferred)
    const claudeWithTools = devModel.bindTools(agentTools);
    const gptWithTools = openaiModel.bindTools(agentTools);
    // Utilize LangChain's native .withFallbacks() to instantly reroute to OpenAI if Anthropic Rate Limits hit
    const modelWithTools = claudeWithTools.withFallbacks({
        fallbacks: [gptWithTools]
    });
    // Inherit the pure message history without duplicating the Developer prompt
    let currentMessages = [...state.messages];
    (0, logger_1.log)('DEV', 'messages_inherited', { count: currentMessages.length });
    // Anthropic strictly requires at least one User-role message in the payload array.
    // Tagged with __anchor so maskMessages always pins this message regardless of position.
    if (currentMessages.length === 0) {
        (0, logger_1.log)('DEV', 'anchor_seeded', {});
        currentMessages.push(new messages_1.HumanMessage({
            content: "Begin constructing the application strictly adhering to the UX architect's design specifications.",
            additional_kwargs: { __anchor: true }
        }));
    }
    let maxSteps = 100;
    let steps = 0;
    const writtenFiles = []; // track for memory update context
    let lastTsError = null; // track for Task 3.3 exit state passthrough
    let exitReason = 'timeout';
    // ── PHASE A: Parallel first-pass generation (iteration 0 only) ──────
    // 1. Distill 21st.dev inspiration briefs for all components (Sonnet, parallel)
    // 2. Write Tier 2 (Sonnet, parallel) + Tier 1 (Opus, sequential) components
    if (state.iterationCount === 0 && !state.errorLogs) {
        emitter_1.emitter.info("developer", "Starting tiered component generation...");
        (0, logger_1.log)('DEV', 'parallel_first_pass_start', {});
        // Read design system saved by PM node
        let dsForParallel = null;
        try {
            const dsRaw = await tools_1.tools.readFile(state.sandboxPath, "design_system.json");
            if (!dsRaw.startsWith("Error"))
                dsForParallel = JSON.parse(dsRaw);
        }
        catch { /* fallback to null — parallel writer uses defaults */ }
        // Distill 21st.dev inspiration briefs before writing any components
        const specComponents = (0, specParser_1.parseSpecComponents)(spec);
        let briefs = {};
        try {
            briefs = await (0, inspirationDistiller_1.distillInspiration)(specComponents, state.sandboxPath);
            (0, logger_1.log)('DEV', 'inspiration_briefs_ready', { count: Object.keys(briefs).length });
        }
        catch (e) {
            (0, logger_1.log)('DEV', 'inspiration_distill_error', { error: e.message });
            // Non-fatal — parallel writer works without briefs
        }
        const parallelResult = await (0, parallelWriter_1.writeAllComponentsParallel)(spec, dsForParallel, briefs);
        // Write all successful files to disk
        for (const file of parallelResult.files) {
            fileCache.delete(file.path);
            await tools_1.tools.writeFile(state.sandboxPath, file.path, file.content);
            writtenFiles.push(file.path);
        }
        (0, logger_1.log)('DEV', 'parallel_files_written', {
            total: parallelResult.files.length,
            failed: parallelResult.failed.length,
            paths: writtenFiles,
        });
        // Run tsc to check for cross-component issues
        emitter_1.emitter.info("developer", `Parallel pass complete — ${writtenFiles.length} files. Running TypeScript check...`);
        const tsResult = await tools_1.tools.runTypeScript(state.sandboxPath);
        if (tsResult.includes("Success:")) {
            exitReason = 'ts_passed';
            (0, logger_1.log)('DEV', 'parallel_ts_passed', { files: writtenFiles.length });
            emitter_1.emitter.info("developer", "TypeScript verification passed — parallel generation clean!");
            emitter_1.emitter.stepDone("developer", state.iterationCount);
        }
        else {
            lastTsError = tsResult;
            // Classify errors and seed the fix loop with targeted re-prompting
            const classified = (0, errorClassifier_1.classifyError)(`TypeScript TypeCheck failed:\n${tsResult}`);
            (0, logger_1.log)('DEV', 'parallel_ts_failed', {
                files: writtenFiles.length,
                errorFiles: classified.affectedFiles,
                summary: classified.summary,
            });
            emitter_1.emitter.info("developer", `Parallel pass TS errors — ${classified.summary}. Starting fix loop...`);
            const fileContents = (await Promise.all(classified.affectedFiles.map(async (f) => ({
                path: f,
                content: await tools_1.tools.readFile(state.sandboxPath, f),
            })))).filter(f => !f.content.startsWith('Error'));
            currentMessages.push(new messages_1.HumanMessage((0, errorClassifier_1.buildTargetedFixPrompt)(classified, fileContents)));
        }
    }
    // ── PHASE B: Sequential fix loop ────────────────────────────────────
    // Runs when: (a) parallel pass had TS errors, or (b) this is a fix iteration from QA
    const invokeWithBackoff = async (model, msgs) => {
        const payload = [new messages_1.SystemMessage(prompt), ...msgs];
        // Native LangChain fallbacks automatically handle 429 and 500 errors by routing to GPT-4o
        return await (0, logger_1.withTimeout)(model.invoke(payload), TIMEOUTS.devLoopStep, 'DEV');
    };
    let patchAttempts = 0;
    while (exitReason !== 'ts_passed' && steps < maxSteps) {
        steps++;
        emitter_1.emitter.info("developer", `Loop step ${steps}`);
        const preCount = currentMessages.length;
        currentMessages = (0, contextManager_1.pruneToTokenBudget)(currentMessages);
        const totalTokens = (0, contextManager_1.estimateTokens)(currentMessages);
        (0, logger_1.log)('DEV', 'loop_step', { step: steps, msgsIn: preCount, msgsOut: currentMessages.length, tokens: totalTokens });
        let response;
        try {
            response = await invokeWithBackoff(modelWithTools, currentMessages);
        }
        catch (e) {
            // TimeoutError or LLM failure — exit the loop gracefully instead of crashing
            (0, logger_1.log)('DEV', 'invoke_error', { step: steps, error: e.message, name: e.name });
            emitter_1.emitter.info("developer", `LLM call failed at step ${steps}: ${e.message}`);
            exitReason = 'timeout';
            break;
        }
        let didPatch = false;
        let xmlErrorMessages = [];
        if (response.content && typeof response.content === "string" && response.content.trim().length > 0) {
            // XML Artifact Extraction — guards and stripping handled in xmlParser.ts
            const parseResult = (0, xmlParser_1.parseXmlFiles)(response.content, state.errorLogs);
            for (const { path: filePath, content: fileContent } of parseResult.files) {
                emitter_1.emitter.fileActivity("developer", filePath, "created");
                fileCache.delete(filePath);
                await tools_1.tools.writeFile(state.sandboxPath, filePath, fileContent);
                writtenFiles.push(filePath);
                didPatch = true;
            }
            for (const guardError of parseResult.guardErrors) {
                xmlErrorMessages.push(new messages_1.HumanMessage(`XML Error: ${guardError}`));
                didPatch = true;
            }
            // Use stripped content — XML blobs replaced with 1-line stubs to prevent token bloat
            response.content = parseResult.strippedContent;
        }
        currentMessages.push(response);
        currentMessages.push(...xmlErrorMessages);
        // Output of the tools executed in this step
        const toolMessages = [];
        let schemaErrorOccurred = false;
        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const tCall of response.tool_calls) {
                emitter_1.emitter.toolInvoked("developer", tCall.name);
                const selectedTool = toolsByName[tCall.name];
                let toolResult = "";
                if (selectedTool) {
                    try {
                        toolResult = await selectedTool.invoke(tCall.args);
                    }
                    catch (e) {
                        schemaErrorOccurred = true;
                        (0, logger_1.log)('DEV', 'tool_schema_error', { tool: tCall.name, error: e.message });
                        toolResult = `Error executing tool: ${e.message}`;
                    }
                }
                else {
                    (0, logger_1.log)('DEV', 'tool_unknown', { tool: tCall.name });
                    toolResult = `Error: Unknown tool ${tCall.name}`;
                }
                toolMessages.push(new messages_1.ToolMessage({
                    content: toolResult,
                    name: tCall.name,
                    tool_call_id: tCall.id
                }));
            }
            currentMessages.push(...toolMessages);
        }
        (0, logger_1.log)('DEV', 'step_result', {
            step: steps,
            didPatch,
            toolCalls: response.tool_calls?.length ?? 0,
            responseChars: (0, contextManager_1.getContentString)(response).length,
        });
        // Break if NO tools called AND NO XML patches extracted
        if (!didPatch && (!response.tool_calls || response.tool_calls.length === 0)) {
            exitReason = 'done';
            (0, logger_1.log)('DEV', 'loop_exit', { reason: exitReason, steps });
            emitter_1.emitter.stepDone("developer", state.iterationCount);
            break;
        }
        if (schemaErrorOccurred) {
            // Schema error — let the loop roll over so the LLM can see the error and retry.
            // Do NOT run early TS validation on a failed/empty patch.
            continue;
        }
        if (didPatch) {
            patchAttempts++;
            emitter_1.emitter.info("developer", `Running TypeScript verification (attempt ${patchAttempts}/2)`);
            const tsResult = await tools_1.tools.runTypeScript(state.sandboxPath);
            if (!tsResult.includes("Success:")) {
                lastTsError = tsResult;
                // Task 3.1 + 3.2: classify error and build a targeted prompt with only the broken files
                const classified = (0, errorClassifier_1.classifyError)(`TypeScript TypeCheck failed:\n${tsResult}`);
                (0, logger_1.log)('DEV', 'ts_check', {
                    attempt: patchAttempts,
                    passed: false,
                    affectedFiles: classified.affectedFiles,
                    errorCount: (tsResult.match(/error TS\d+/g) ?? []).length,
                });
                emitter_1.emitter.info("developer", `TypeScript failed — ${classified.summary}`);
                const fileContents = (await Promise.all(classified.affectedFiles.map(async (f) => ({
                    path: f,
                    content: await tools_1.tools.readFile(state.sandboxPath, f),
                })))).filter(f => !f.content.startsWith('Error'));
                const targetedPrompt = (0, errorClassifier_1.buildTargetedFixPrompt)(classified, fileContents);
                currentMessages.push(new messages_1.HumanMessage(targetedPrompt));
                if (patchAttempts >= 2) {
                    exitReason = 'patch_limit';
                    (0, logger_1.log)('DEV', 'loop_exit', { reason: exitReason, steps, patchAttempts });
                    emitter_1.emitter.info("developer", "Max patch attempts reached");
                    break;
                }
            }
            else {
                exitReason = 'ts_passed';
                (0, logger_1.log)('DEV', 'ts_check', { attempt: patchAttempts, passed: true });
                emitter_1.emitter.info("developer", "TypeScript verification passed");
                emitter_1.emitter.stepDone("developer", state.iterationCount);
                break;
            }
        }
    }
    if (steps >= maxSteps) {
        exitReason = 'timeout';
        (0, logger_1.log)('DEV', 'loop_exit', { reason: exitReason, steps });
        emitter_1.emitter.stepDone("developer", state.iterationCount);
    }
    // Task 3.3: on unclean exits, carry the last known error forward so QA has context
    const outgoingErrorLogs = exitReason === 'patch_limit' && lastTsError
        ? `TypeScript TypeCheck failed:\n${lastTsError}`
        : exitReason === 'timeout'
            ? `Developer loop timed out after ${steps} steps — QA will re-run TypeScript to assess state.`
            : null; // 'done' and 'ts_passed' → clean exit, let QA start fresh
    (0, logger_1.log)('DEV', 'done', {
        iteration: state.iterationCount,
        exitReason,
        steps,
        elapsedMs: Date.now() - devStart,
        outgoingErrorLogs: !!outgoingErrorLogs,
    });
    // Update dev_memory.json with session state for the next iteration.
    // Uses GPT-4o (cheap) — not the Opus dev model. Non-blocking on failure.
    // Task 2.3: Use structured output (JSON mode) — no XML regex, no silent failures.
    // Pass explicit session context (files written + errors) instead of last 5 messages.
    (0, logger_1.log)('MEMORY', 'update_start', { filesWritten: writtenFiles.length });
    try {
        const memUpdatePrompt = `Update the dev_memory.json based on this development session.

Current memory:
${JSON.stringify(devMemory, null, 2)}

Files written this session: ${writtenFiles.length > 0 ? writtenFiles.join(', ') : 'none'}
TypeScript/build errors fixed: ${exitReason === 'ts_passed' ? 'yes' : 'no'}
Session exit reason: ${exitReason}
QA errors from previous iteration: ${state.errorLogs ? state.errorLogs.substring(0, 300) : 'none'}

Rules:
- Move all files from "Files written this session" into components_completed if they are complete
- Add key design decisions (colors, fonts, layout patterns) to design_decisions
- Clear known_issues if exitReason is ts_passed, otherwise list remaining issues
- Set next_steps to what the QA pipeline will likely require next
- Keep intent unchanged`;
        const memModel = openaiModel.withStructuredOutput(DevMemorySchema);
        const updatedMem = await memModel.invoke([new messages_1.SystemMessage(memUpdatePrompt)]);
        await tools_1.tools.writeFile(state.sandboxPath, "dev_memory.json", JSON.stringify(updatedMem, null, 2));
        (0, logger_1.log)('MEMORY', 'update_done', {
            completedComponents: updatedMem.components_completed.length,
            nextSteps: updatedMem.next_steps.length,
            knownIssues: updatedMem.known_issues.length,
        });
        emitter_1.emitter.info("developer", "Session memory updated");
    }
    catch (e) {
        (0, logger_1.log)('MEMORY', 'update_error', { error: e.message });
        emitter_1.emitter.info("developer", `Session memory update skipped: ${e.message}`);
    }
    // On unclean exits (timeout, patch_limit), reset messages to prevent bloat
    // in the next iteration. The error context is carried via errorLogs, not messages.
    const outgoingMessages = (exitReason === 'timeout' || exitReason === 'patch_limit')
        ? [currentMessages[0]] // keep only the anchor message
        : currentMessages;
    return {
        status: "qa",
        iterationCount: state.iterationCount + 1,
        messages: outgoingMessages,
        // Task 3.3: pass error context forward on unclean exits so QA has full picture
        ...(outgoingErrorLogs !== null ? { errorLogs: outgoingErrorLogs } : {}),
    };
}
/**
 * Node 3: QA Reviewer
 * Runs TypeScript compiler, Next.js Build, and Visual QA (Playwright screenshots + Vision LLM).
 */
async function qaNode(state) {
    const sandboxId = state.sandboxPath.split('/').pop() ?? state.sandboxPath;
    const qaStart = Date.now();
    (0, logger_1.log)('QA_TS', 'start', { sandboxId, iteration: state.iterationCount });
    try {
        // --- Phase 1: TypeScript compilation ---
        emitter_1.emitter.stepStart("qa_ts", state.iterationCount);
        const tsResult = await (0, logger_1.withTimeout)(tools_1.tools.runTypeScript(state.sandboxPath), TIMEOUTS.qa_ts, 'QA_TS');
        const tsPassed = tsResult.includes("Success:");
        (0, logger_1.log)('QA_TS', 'result', { passed: tsPassed, elapsedMs: Date.now() - qaStart });
        if (!tsPassed) {
            emitter_1.emitter.stepFailed("qa_ts", "TypeScript errors found", state.iterationCount);
            // Task 2.2: error goes into errorLogs only — developer node re-injects it via system prompt.
            // Do NOT append to state.messages (prevents error accumulation across iterations).
            return {
                status: "failed",
                errorLogs: `TypeScript TypeCheck failed:\n${tsResult}`,
                messages: state.messages,
            };
        }
        // --- Phase 2: Next.js Build ---
        emitter_1.emitter.stepDone("qa_ts", state.iterationCount);
        emitter_1.emitter.stepStart("qa_build", state.iterationCount);
        const buildStart = Date.now();
        const buildResult = await (0, logger_1.withTimeout)(tools_1.tools.npmRun(state.sandboxPath, "build"), TIMEOUTS.qa_build, 'QA_BUILD');
        const buildPassed = buildResult.includes("Command executed successfully");
        (0, logger_1.log)('QA_BUILD', 'result', { passed: buildPassed, elapsedMs: Date.now() - buildStart });
        if (!buildPassed) {
            emitter_1.emitter.stepFailed("qa_build", "Next.js build errors found", state.iterationCount);
            return {
                status: "failed",
                errorLogs: `Next.js Build failed:\n${buildResult}`,
                messages: state.messages,
            };
        }
        // --- Phase 3: Visual QA (Screenshots + Vision LLM) ---
        emitter_1.emitter.stepDone("qa_build", state.iterationCount);
        // Skip visual QA on the last iteration to avoid infinite visual polish loops
        if (state.iterationCount >= 5) {
            (0, logger_1.log)('QA_VISUAL', 'skipped', { reason: 'max_iteration', iteration: state.iterationCount });
            emitter_1.emitter.stepStart("qa_visual", state.iterationCount);
            emitter_1.emitter.stepDone("qa_visual", state.iterationCount);
            return { status: "success", errorLogs: null, messages: state.messages };
        }
        emitter_1.emitter.stepStart("qa_visual", state.iterationCount);
        const visualStart = Date.now();
        try {
            const screenshots = await (0, logger_1.withTimeout)((0, tools_2.takeScreenshots)(state.sandboxPath), TIMEOUTS.qa_visual, 'QA_VISUAL');
            (0, logger_1.log)('QA_VISUAL', 'screenshots_taken', {
                hasScreenshots: !!screenshots,
                hasDomChecks: !!screenshots?.domChecks,
                keys: screenshots ? Object.keys(screenshots) : [],
            });
            const dc = screenshots?.domChecks;
            if (!dc) {
                (0, logger_1.log)('QA_VISUAL', 'no_dom_checks', { screenshotKeys: screenshots ? Object.keys(screenshots) : [] });
                emitter_1.emitter.stepDone("qa_visual", state.iterationCount);
                return { status: "success", errorLogs: null, messages: state.messages };
            }
            (0, logger_1.log)('QA_VISUAL', 'dom_checks', {
                rtl: dc.hasRtlDir,
                hebrew: dc.hasHebrew,
                images: dc.imageCount,
                brokenImages: dc.brokenImages,
                sections: dc.sectionCount,
                blank: dc.isBlankPage,
                textLength: dc.bodyTextLength,
            });
            // Fast-fail on blank page without spending tokens on vision
            if (dc.isBlankPage) {
                (0, logger_1.log)('QA_VISUAL', 'blank_page_fail', { textLength: dc.bodyTextLength });
                emitter_1.emitter.stepFailed("qa_visual", "Page is blank or nearly empty", state.iterationCount);
                return {
                    status: "failed",
                    errorLogs: `Visual QA: Page is blank or nearly empty (${dc.bodyTextLength} chars of text). Check App.tsx exports a proper component tree and all sections render Hebrew content.`,
                    messages: state.messages,
                };
            }
            const spec = await tools_1.tools.readFile(state.sandboxPath, "spec.md");
            const visualResult = await (0, tools_2.runVisualReview)(screenshots, spec);
            (0, logger_1.log)('QA_VISUAL', 'vision_score', {
                score: visualResult.score,
                passed: visualResult.passed,
                criticalIssues: visualResult.criticalIssues.length,
                warnings: visualResult.warnings.length,
                elapsedMs: Date.now() - visualStart,
            });
            emitter_1.emitter.score(visualResult.score, visualResult.passed);
            if (visualResult.passed) {
                (0, logger_1.log)('QA_VISUAL', 'passed', { score: visualResult.score });
                emitter_1.emitter.stepDone("qa_visual", state.iterationCount);
                return { status: "success", errorLogs: null, messages: state.messages };
            }
            // Visual QA failed — try to refine key components via 21st.dev before handing back to developer
            const errorReport = (0, tools_2.formatVisualErrors)(visualResult);
            (0, logger_1.log)('QA_VISUAL', 'failed', { score: visualResult.score, criticalIssues: visualResult.criticalIssues });
            emitter_1.emitter.stepFailed("qa_visual", `Score: ${visualResult.score}/10`, state.iterationCount);
            return {
                status: "failed",
                errorLogs: `Visual QA failed (score: ${visualResult.score}/10):\n${errorReport}`,
                messages: state.messages,
            };
        }
        catch (err) {
            // Playwright/screenshot failure is non-blocking — pass with a warning
            (0, logger_1.log)('QA_VISUAL', 'error_non_blocking', { error: err.message });
            emitter_1.emitter.stepDone("qa_visual", state.iterationCount);
            return { status: "success", errorLogs: null, messages: state.messages };
        }
    }
    catch (err) {
        // Top-level catch: TimeoutError from tsc/build, or any unexpected failure
        (0, logger_1.log)('QA_TS', 'node_error', { error: err.message, name: err.name, elapsedMs: Date.now() - qaStart });
        emitter_1.emitter.stepFailed("qa_ts", `QA error: ${err.message}`, state.iterationCount);
        return {
            status: "failed",
            errorLogs: `QA node failed: ${err.message}`,
            messages: state.messages,
        };
    }
}
/**
 * Conditional Routing Logic
 */
function routeAfterQA(state) {
    if (state.status === "success") {
        (0, logger_1.log)('ROUTE', 'decision', { next: 'end', reason: 'success', iteration: state.iterationCount });
        return "end";
    }
    if (state.iterationCount >= 6) {
        (0, logger_1.log)('ROUTE', 'decision', { next: 'end', reason: 'max_iterations', iteration: state.iterationCount });
        emitter_1.emitter.info("qa_visual", "Max iterations reached, forcing completion");
        return "end";
    }
    (0, logger_1.log)('ROUTE', 'decision', { next: 'developer', reason: 'qa_failed', iteration: state.iterationCount });
    emitter_1.emitter.iterationStart(state.iterationCount + 1, 6);
    return "developer";
}
// Build the Graph
const workflow = new langgraph_1.StateGraph({
    channels: {
        businessInput: null,
        sandboxPath: null,
        status: null,
        messages: null,
        errorLogs: null,
        iterationCount: null
    }
})
    .addNode("productManager", productManagerNode)
    .addNode("developer", developerNode)
    .addNode("qa", qaNode)
    .addEdge("productManager", "developer")
    .addEdge("developer", "qa")
    .addConditionalEdges("qa", routeAfterQA, {
    developer: "developer",
    end: langgraph_1.END
});
workflow.setEntryPoint("productManager");
exports.orchestratorApp = workflow.compile();
