"use strict";
/**
 * Inspiration Distiller
 *
 * Runs once after PM generates spec.md, before any components are written.
 *
 * 1. Searches 21st.dev for ALL components in parallel (lightweight HTTP calls)
 * 2. Uses cheap Sonnet to distill each raw reference (~3500 chars) into a
 *    compact design brief (~400 tokens) — layout, animations, visual techniques
 * 3. Collects all npm dependencies from references
 * 4. Installs deps in the sandbox
 * 5. Saves briefs to inspiration_briefs.json in the sandbox
 *
 * The distilled briefs replace raw code dumps in component prompts,
 * saving ~7000 tokens and enabling Opus to handle more components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.distillInspiration = distillInspiration;
const anthropic_1 = require("@langchain/anthropic");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const logger_1 = require("../lib/logger");
const emitter_1 = require("./emitter");
const magicClient_1 = require("./magicClient");
const tools_1 = require("../tools");
const specParser_1 = require("./specParser");
// ─── Models ─────────────────────────────────────────────────────────────────
// Sonnet for distillation — cheap, fast, sufficient for summarization
const distillModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 2,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new openai_1.ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
// ─── Distillation prompt ────────────────────────────────────────────────────
const DISTILL_PROMPT = `You are extracting a compact design brief from a reference component's source code.
Output ONLY the structured brief below (max 400 tokens). No explanation, no code, no markdown fences.

LAYOUT: [e.g., "2-column grid on desktop, stacked on mobile, 6rem section padding, max-w-7xl container"]
VISUAL_TECHNIQUES: [e.g., "backdrop-blur-xl bg-white/5 cards, gradient orbs as background decoration, border-white/10, box-shadow"]
ANIMATIONS: [e.g., "staggered fade-up on cards (delay: index * 0.15), scale(1.02) on hover with 500ms transition, whileInView viewport-triggered"]
COLOR_APPLICATION: [e.g., "primary as gradient accent on headings, accent as button bg, white/5 card backgrounds, gradient-to-b for section bg"]
KEY_PATTERNS: [e.g., "Cards use grid gap-8, each card has icon + heading + description, decorative gradient circle behind grid, glassmorphism card borders"]
COMPONENT_STRUCTURE: [e.g., "Header with badge + title + subtitle, then 3-column card grid, each card with icon/image + text block + CTA link"]`;
// ─── Core functions ─────────────────────────────────────────────────────────
/**
 * Distill a single 21st.dev reference into a compact brief using Sonnet.
 */
async function distillSingleReference(code, componentName) {
    try {
        const response = await distillModel.invoke([
            new messages_1.SystemMessage(DISTILL_PROMPT),
            new messages_1.HumanMessage(`Component: ${componentName}\n\nReference code:\n${code.slice(0, 4000)}`),
        ]);
        const content = typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);
        return content.trim();
    }
    catch (e) {
        (0, logger_1.log)('DISTILL', 'single_error', { component: componentName, error: e.message });
        return `LAYOUT: standard section layout\nVISUAL_TECHNIQUES: use design system defaults\nANIMATIONS: framer-motion fade-up on scroll\nCOLOR_APPLICATION: follow spec color palette\nKEY_PATTERNS: clean responsive layout`;
    }
}
// ─── Main entry point ───────────────────────────────────────────────────────
// Pre-installed packages that should never be re-installed
const SCAFFOLD_PACKAGES = new Set([
    'react', 'react-dom', 'framer-motion', 'lucide-react',
    'clsx', 'tailwind-merge', 'class-variance-authority',
    '@radix-ui/react-slot', 'next',
]);
/**
 * Pre-fetch 21st.dev references for all components, distill into compact briefs,
 * collect npm deps, install them, and save briefs to the sandbox.
 *
 * @returns Map of componentName -> InspirationBrief
 */
async function distillInspiration(components, sandboxPath, designSystem) {
    const startMs = Date.now();
    (0, logger_1.log)('DISTILL', 'start', { components: components.length });
    emitter_1.emitter.info("developer", `Searching 21st.dev for ${components.length} component references...`);
    // ── Step 1: Search 21st.dev for all components in parallel ──────────
    const searchTasks = components.map(comp => {
        const query = (0, specParser_1.getSearchQuery)(comp.componentName, designSystem);
        return (0, magicClient_1.searchComponents)(query);
    });
    const searchResults = await Promise.allSettled(searchTasks);
    (0, logger_1.log)('DISTILL', 'searches_done', {
        total: searchResults.length,
        succeeded: searchResults.filter(r => r.status === 'fulfilled').length,
        elapsedMs: Date.now() - startMs,
    });
    // ── Step 2: Collect all npm dependencies ────────────────────────────
    const allDeps = new Set();
    for (const result of searchResults) {
        if (result.status === 'fulfilled') {
            for (const r of result.value.results) {
                for (const dep of r.dependencies) {
                    if (!SCAFFOLD_PACKAGES.has(dep))
                        allDeps.add(dep);
                }
            }
        }
    }
    // ── Step 3: Install deps in sandbox ─────────────────────────────────
    if (allDeps.size > 0) {
        const depsArray = [...allDeps];
        (0, logger_1.log)('DISTILL', 'installing_deps', { deps: depsArray });
        emitter_1.emitter.info("developer", `Installing ${depsArray.length} packages from 21st.dev: ${depsArray.join(', ')}`);
        try {
            await tools_1.tools.npmInstall(sandboxPath, depsArray);
            (0, logger_1.log)('DISTILL', 'deps_installed', { count: depsArray.length });
        }
        catch (e) {
            (0, logger_1.log)('DISTILL', 'deps_install_error', { error: e.message });
        }
    }
    // ── Step 4: Distill each reference into a compact brief ─────────────
    emitter_1.emitter.info("developer", "Distilling design briefs from references...");
    const briefMap = {};
    // Run distillation in parallel (these are cheap Sonnet calls)
    const distillTasks = components.map(async (comp, idx) => {
        const searchResult = searchResults[idx];
        const bestResult = searchResult.status === 'fulfilled' && searchResult.value.results.length > 0
            ? searchResult.value.results[0]
            : null;
        if (!bestResult || bestResult.code.length < 50) {
            // No reference found — use a generic brief
            briefMap[comp.componentName] = {
                brief: `LAYOUT: standard responsive section\nVISUAL_TECHNIQUES: use design system defaults\nANIMATIONS: framer-motion whileInView fade-up\nCOLOR_APPLICATION: follow spec color palette exactly\nKEY_PATTERNS: clean layout with proper spacing`,
                dependencies: [],
                rawCodePreview: '',
            };
            return;
        }
        const brief = await distillSingleReference(bestResult.code, comp.componentName);
        briefMap[comp.componentName] = {
            brief,
            dependencies: bestResult.dependencies.filter(d => !SCAFFOLD_PACKAGES.has(d)),
            rawCodePreview: bestResult.code.slice(0, 500),
        };
    });
    await Promise.allSettled(distillTasks);
    // ── Step 5: Save briefs to sandbox ──────────────────────────────────
    try {
        await tools_1.tools.writeFile(sandboxPath, 'inspiration_briefs.json', JSON.stringify(briefMap, null, 2));
        (0, logger_1.log)('DISTILL', 'briefs_saved', { count: Object.keys(briefMap).length });
    }
    catch (e) {
        (0, logger_1.log)('DISTILL', 'briefs_save_error', { error: e.message });
    }
    (0, logger_1.log)('DISTILL', 'done', {
        components: components.length,
        briefsGenerated: Object.keys(briefMap).length,
        depsInstalled: allDeps.size,
        elapsedMs: Date.now() - startMs,
    });
    emitter_1.emitter.info("developer", `Design briefs ready for ${Object.keys(briefMap).length} components`);
    return briefMap;
}
