"use strict";
/**
 * Parallel Component Writer — Tiered Architecture
 *
 * Writes all components from spec.md using a two-tier model strategy:
 *
 *   Tier 1 (Opus — sequential): Hero, Features, Services, Testimonials, Pricing,
 *   Gallery, About, Team — visually complex, high-impact sections.
 *
 *   Tier 2 (Sonnet — parallel): Navbar, Footer, CTA, Contact, FAQ —
 *   structural components with well-established patterns.
 *
 * Each component receives a pre-distilled inspiration brief (~400 tokens)
 * instead of raw 21st.dev code (~3500 chars), plus a shared Design Token Block
 * for cross-component visual consistency.
 *
 * Execution order:
 *   1. Write globals.css (deterministic)
 *   2. Write Tier 2 components in parallel (Sonnet, max 3 concurrent)
 *   3. Write Tier 1 components sequentially (Opus, one at a time)
 *   4. Generate page.tsx (deterministic)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAllComponentsParallel = writeAllComponentsParallel;
const anthropic_1 = require("@langchain/anthropic");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const xmlParser_1 = require("./xmlParser");
const contextManager_1 = require("./contextManager");
const logger_1 = require("../lib/logger");
const emitter_1 = require("./emitter");
const designSystem_1 = require("./designSystem");
const specParser_1 = require("./specParser");
// ─── Models ─────────────────────────────────────────────────────────────────
const sonnetModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new openai_1.ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
const opusModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new openai_1.ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
const fallbackModel = new openai_1.ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
const MAX_CONCURRENT_SONNET = 3;
async function writeSingleComponent(comp, sharedContext, designTokenBlock, brief, tier) {
    const startMs = Date.now();
    const model = tier === 1 ? opusModel : sonnetModel;
    const modelName = tier === 1 ? 'opus' : 'sonnet';
    const briefSection = brief
        ? `\n21ST.DEV DESIGN BRIEF (adapt these patterns for this component):
${brief}
`
        : '';
    const prompt = `You are an elite frontend developer creating ONE React component for a PREMIUM Hebrew Next.js landing page.
This is NOT a wireframe or prototype — it must look like a production site from a top design agency.
Output EXACTLY one <file path="${comp.filename}"> block. No explanation, no other text.

SHARED DESIGN SYSTEM (use these colors, fonts, and rules exactly):
${sharedContext}

${designTokenBlock}
${briefSection}
YOUR COMPONENT: ${comp.componentName} (${comp.filename})
SECTION DETAILS FROM SPEC:
${comp.sectionDescription}

IMPLEMENTATION RULES:
1. Export a single default function component named ${comp.componentName}.
2. Use the exact hex colors from the Color Palette above. Do NOT invent colors.
3. Use the Design Tokens above for ALL styling — cards, buttons, headings, animations. Do NOT deviate.
4. ANIMATIONS ARE MANDATORY: import { motion } from 'framer-motion'. Use the exact animation tokens above.
   - Every section: viewport-triggered entrance with stagger on children
   - Cards: whileHover with y:-5 and scale:1.02
5. Import icons from 'lucide-react' as needed. Use them decoratively, not just functionally.
6. All text must be in Hebrew. Use text-right and RTL-compatible layouts (flex-row-reverse where needed).
7. IMAGES: Use next/image's Image component. Import: import Image from "next/image".
   - Use real Unsplash photo URLs: https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=800&q=80
   - For PEOPLE (team, testimonials): vary the photo ID for each person
   - Set width and height props. Hero: width={1920} height={1080}, cards: width={800} height={600}.
8. Use Tailwind only — no inline styles except for backgroundImage on hero sections.
9. You MAY import from "@/components/ui/button", "@/components/ui/badge", "@/components/ui/card", "@/components/ui/separator", "@/components/ui/avatar", and "@/lib/utils" (cn utility).
10. Add "use client" at the top (needed for framer-motion and interactivity).
11. TypeScript: use React.FC or function syntax, no \`any\` types.
12. MINIMUM 80 lines of JSX. Premium site — add visual richness: decorative gradients, blur orbs, borders, shadows, hover effects.
13. If the design brief mentions specific techniques (e.g., staggered grid, glassmorphism cards), implement them faithfully.`;
    let response;
    let usedModel = modelName;
    try {
        response = await model.invoke([
            new messages_1.SystemMessage(prompt),
            new messages_1.HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    }
    catch (e) {
        usedModel = 'gpt-4o-fallback';
        (0, logger_1.log)('DEV', 'parallel_component_fallback', { component: comp.componentName, tier, error: e.message });
        response = await fallbackModel.invoke([
            new messages_1.SystemMessage(prompt),
            new messages_1.HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    }
    (0, logger_1.log)('DEV', 'parallel_component_model', { component: comp.componentName, model: usedModel, tier });
    const content = (0, contextManager_1.getContentString)(response);
    const parsed = (0, xmlParser_1.parseXmlFiles)(content, null);
    if (parsed.files.length > 0) {
        const file = parsed.files[0];
        (0, logger_1.log)('DEV', 'parallel_component_done', {
            component: comp.componentName,
            tier,
            chars: file.content.length,
            elapsedMs: Date.now() - startMs,
        });
        return { path: file.path, content: file.content };
    }
    (0, logger_1.log)('DEV', 'parallel_component_no_xml', { component: comp.componentName, tier });
    return {
        path: comp.filename,
        content: content.replace(/```tsx?\n?/g, '').replace(/```$/g, '').trim(),
    };
}
// ─── globals.css generation (deterministic) ─────────────────────────────────
function generateGlobalsCss(ds) {
    const cssImport = ds?.typography.cssImport
        || "@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');";
    const bodyFont = ds?.typography.bodyFont || 'Heebo';
    const headingFont = ds?.typography.headingFont || 'Heebo';
    const fontFamilyParts = [bodyFont];
    if (headingFont !== bodyFont)
        fontFamilyParts.unshift(headingFont);
    if (!fontFamilyParts.includes('Heebo'))
        fontFamilyParts.push('Heebo');
    const fontFamily = fontFamilyParts.map(f => `'${f}'`).join(', ') + ', sans-serif';
    return `${cssImport}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        font-family: ${fontFamily};
        direction: rtl;
    }
    body {
        @apply antialiased;
    }
}`;
}
// ─── page.tsx generation (deterministic) ────────────────────────────────────
function generatePageTsx(components, sharedContext) {
    const bgMatch = sharedContext.match(/Background:\s*(.+)/);
    const bgGradient = bgMatch ? bgMatch[1].trim() : 'from-slate-900 to-slate-950';
    (0, logger_1.log)('DEV', 'page_tsx_generated', { components: components.length });
    const imports = components
        .map(c => `import ${c.componentName} from '@/components/sections/${c.componentName}';`)
        .join('\n');
    const renders = components
        .map(c => `      <${c.componentName} />`)
        .join('\n');
    return `${imports}

// Force dynamic rendering — avoids static generation errors with React 19 + framer-motion
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b ${bgGradient}">
${renders}
    </main>
  );
}
`;
}
// ─── Chunked parallel execution ─────────────────────────────────────────────
async function runInChunks(tasks, chunkSize) {
    const results = [];
    for (let i = 0; i < tasks.length; i += chunkSize) {
        const chunk = tasks.slice(i, i + chunkSize);
        const chunkResults = await Promise.allSettled(chunk.map(fn => fn()));
        results.push(...chunkResults);
        if (i + chunkSize < tasks.length) {
            (0, logger_1.log)('DEV', 'parallel_chunk_done', {
                completed: results.length,
                remaining: tasks.length - results.length,
            });
        }
    }
    return results;
}
/**
 * Write all components from spec.md using tiered model architecture.
 *
 * Tier 2 (Sonnet) components run in parallel first, then
 * Tier 1 (Opus) components run sequentially for maximum quality.
 */
async function writeAllComponentsParallel(specContent, designSystem, inspirationBriefs) {
    const startMs = Date.now();
    const components = (0, specParser_1.parseSpecComponents)(specContent);
    const sharedContext = (0, specParser_1.extractSharedContext)(specContent);
    if (components.length === 0) {
        (0, logger_1.log)('DEV', 'parallel_skip', { reason: 'no_components_parsed' });
        return { files: [], failed: [] };
    }
    const designTokenBlock = designSystem
        ? (0, designSystem_1.generateDesignTokenBlock)(designSystem)
        : '';
    (0, logger_1.log)('DEV', 'parallel_start', {
        components: components.length,
        sharedContextChars: sharedContext.length,
        hasBriefs: Object.keys(inspirationBriefs).length > 0,
        hasDesignTokens: !!designTokenBlock,
    });
    const files = [];
    const failed = [];
    // Step 1: globals.css (deterministic)
    files.push({ path: 'src/globals.css', content: generateGlobalsCss(designSystem) });
    emitter_1.emitter.fileActivity("developer", "src/globals.css", "created");
    // Classify components into tiers
    const tier1 = [];
    const tier2 = [];
    for (const comp of components) {
        const tier = (0, specParser_1.getComponentTier)(comp.componentName);
        if (tier === 1)
            tier1.push(comp);
        else
            tier2.push(comp);
    }
    (0, logger_1.log)('DEV', 'parallel_tiers', {
        tier1: tier1.map(c => c.componentName),
        tier2: tier2.map(c => c.componentName),
    });
    // Step 2: Write Tier 2 (Sonnet) components in parallel
    if (tier2.length > 0) {
        emitter_1.emitter.info("developer", `Writing ${tier2.length} structural components (Sonnet)...`);
        const tier2Tasks = tier2.map(comp => () => {
            const brief = inspirationBriefs[comp.componentName]?.brief ?? null;
            return writeSingleComponent(comp, sharedContext, designTokenBlock, brief, 2);
        });
        const tier2Results = await runInChunks(tier2Tasks, MAX_CONCURRENT_SONNET);
        for (let i = 0; i < tier2Results.length; i++) {
            const result = tier2Results[i];
            if (result.status === 'fulfilled') {
                files.push(result.value);
                emitter_1.emitter.fileActivity("developer", result.value.path, "created");
            }
            else {
                (0, logger_1.log)('DEV', 'parallel_component_failed', {
                    component: tier2[i].componentName,
                    tier: 2,
                    error: result.reason?.message ?? 'unknown',
                });
                failed.push(tier2[i].filename);
            }
        }
        (0, logger_1.log)('DEV', 'tier2_done', { written: files.length - 1, failed: failed.length });
    }
    // Step 3: Write Tier 1 (Opus) components sequentially
    if (tier1.length > 0) {
        emitter_1.emitter.info("developer", `Writing ${tier1.length} premium components (Opus)...`);
        for (const comp of tier1) {
            const brief = inspirationBriefs[comp.componentName]?.brief ?? null;
            try {
                const result = await writeSingleComponent(comp, sharedContext, designTokenBlock, brief, 1);
                files.push(result);
                emitter_1.emitter.fileActivity("developer", result.path, "created");
            }
            catch (e) {
                (0, logger_1.log)('DEV', 'parallel_component_failed', {
                    component: comp.componentName,
                    tier: 1,
                    error: e.message,
                });
                failed.push(comp.filename);
            }
        }
        (0, logger_1.log)('DEV', 'tier1_done', { written: files.length - 1 - tier2.length, failed: failed.length });
    }
    // Step 4: page.tsx (deterministic — imports all sections)
    const successfulComponents = components.filter(c => !failed.includes(c.filename));
    try {
        const pageContent = generatePageTsx(successfulComponents, sharedContext);
        files.push({ path: 'src/app/page.tsx', content: pageContent });
        emitter_1.emitter.fileActivity("developer", "src/app/page.tsx", "created");
    }
    catch (e) {
        (0, logger_1.log)('DEV', 'parallel_page_tsx_failed', { error: e.message });
        failed.push('src/app/page.tsx');
    }
    (0, logger_1.log)('DEV', 'parallel_done', {
        filesWritten: files.length,
        failed: failed.length,
        tier1Count: tier1.length,
        tier2Count: tier2.length,
        elapsedMs: Date.now() - startMs,
    });
    return { files, failed };
}
