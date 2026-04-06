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

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { parseXmlFiles } from './xmlParser';
import { getContentString } from './contextManager';
import { log } from '../lib/logger';
import { emitter } from './emitter';
import { DesignSystemRecommendation, generateDesignTokenBlock } from './designSystem';
import { ComponentSpec, extractSharedContext, parseSpecComponents, getComponentTier } from './specParser';
import { InspirationBriefMap } from './inspirationDistiller';

// ─── Models ─────────────────────────────────────────────────────────────────

const sonnetModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

const opusModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

const fallbackModel = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

const MAX_CONCURRENT_SONNET = 3;

// ─── Component writing ──────────────────────────────────────────────────────

interface ComponentWriteResult {
    path: string;
    content: string;
}

async function writeSingleComponent(
    comp: ComponentSpec,
    sharedContext: string,
    designTokenBlock: string,
    brief: string | null,
    tier: 1 | 2,
): Promise<ComponentWriteResult> {
    const startMs = Date.now();
    const model = tier === 1 ? opusModel : sonnetModel;
    const modelName = tier === 1 ? 'opus' : 'sonnet';

    const briefSection = brief
        ? `\n21ST.DEV DESIGN BRIEF (adapt these patterns for this component):
${brief}
`
        : '';

    const prompt = `You are an elite frontend developer creating ONE React component for a PREMIUM Next.js landing page.
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
6. All text should be in English. Maintain standard modern left-to-right (LTR) reading flow.
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
            new SystemMessage(prompt),
            new HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    } catch (e: any) {
        usedModel = 'gpt-4o-fallback';
        log('DEV', 'parallel_component_fallback', { component: comp.componentName, tier, error: e.message });
        response = await fallbackModel.invoke([
            new SystemMessage(prompt),
            new HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    }
    log('DEV', 'parallel_component_model', { component: comp.componentName, model: usedModel, tier });

    const content = getContentString(response);
    const parsed = parseXmlFiles(content, null);

    if (parsed.files.length > 0) {
        const file = parsed.files[0];
        log('DEV', 'parallel_component_done', {
            component: comp.componentName,
            tier,
            chars: file.content.length,
            elapsedMs: Date.now() - startMs,
        });
        return { path: file.path, content: file.content };
    }

    log('DEV', 'parallel_component_no_xml', { component: comp.componentName, tier });
    return {
        path: comp.filename,
        content: content.replace(/```tsx?\n?/g, '').replace(/```$/g, '').trim(),
    };
}

// ─── globals.css generation (deterministic) ─────────────────────────────────

function generateGlobalsCss(ds: DesignSystemRecommendation | null): string {
    const cssImport = ds?.typography.cssImport
        || "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');";
    const bodyFont = ds?.typography.bodyFont || 'Inter';
    const headingFont = ds?.typography.headingFont || 'Inter';

    const fontFamilyParts = [bodyFont];
    if (headingFont !== bodyFont) fontFamilyParts.unshift(headingFont);
    if (!fontFamilyParts.includes('Inter')) fontFamilyParts.push('Inter');
    const fontFamily = fontFamilyParts.map(f => `'${f}'`).join(', ') + ', sans-serif';

    return `${cssImport}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        font-family: ${fontFamily};
    }
    body {
        @apply antialiased;
    }
}`;
}

// ─── page.tsx generation (deterministic) ────────────────────────────────────

function generatePageTsx(
    components: ComponentSpec[],
    sharedContext: string,
): string {
    const bgMatch = sharedContext.match(/Background:\s*(.+)/);
    const bgGradient = bgMatch ? bgMatch[1].trim() : 'from-slate-900 to-slate-950';

    log('DEV', 'page_tsx_generated', { components: components.length });

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
    <main className="min-h-screen bg-gradient-to-b ${bgGradient}">
${renders}
    </main>
  );
}
`;
}

// ─── Chunked parallel execution ─────────────────────────────────────────────

async function runInChunks<T>(
    tasks: (() => Promise<T>)[],
    chunkSize: number
): Promise<PromiseSettledResult<T>[]> {
    const results: PromiseSettledResult<T>[] = [];
    for (let i = 0; i < tasks.length; i += chunkSize) {
        const chunk = tasks.slice(i, i + chunkSize);
        const chunkResults = await Promise.allSettled(chunk.map(fn => fn()));
        results.push(...chunkResults);
        if (i + chunkSize < tasks.length) {
            log('DEV', 'parallel_chunk_done', {
                completed: results.length,
                remaining: tasks.length - results.length,
            });
        }
    }
    return results;
}

// ─── Main orchestrator ──────────────────────────────────────────────────────

export interface ParallelWriteResult {
    files: { path: string; content: string }[];
    failed: string[];
}

/**
 * Write all components from spec.md using tiered model architecture.
 *
 * Tier 2 (Sonnet) components run in parallel first, then
 * Tier 1 (Opus) components run sequentially for maximum quality.
 */
export async function writeAllComponentsParallel(
    specContent: string,
    designSystem: DesignSystemRecommendation | null,
    inspirationBriefs: InspirationBriefMap,
): Promise<ParallelWriteResult> {
    const startMs = Date.now();
    const components = parseSpecComponents(specContent);
    const sharedContext = extractSharedContext(specContent);

    if (components.length === 0) {
        log('DEV', 'parallel_skip', { reason: 'no_components_parsed' });
        return { files: [], failed: [] };
    }

    const designTokenBlock = designSystem
        ? generateDesignTokenBlock(designSystem)
        : '';

    log('DEV', 'parallel_start', {
        components: components.length,
        sharedContextChars: sharedContext.length,
        hasBriefs: Object.keys(inspirationBriefs).length > 0,
        hasDesignTokens: !!designTokenBlock,
    });

    const files: { path: string; content: string }[] = [];
    const failed: string[] = [];

    // Step 1: globals.css (deterministic)
    files.push({ path: 'src/globals.css', content: generateGlobalsCss(designSystem) });
    emitter.fileActivity("developer", "src/globals.css", "created");

    // Classify components into tiers
    const tier1: ComponentSpec[] = [];
    const tier2: ComponentSpec[] = [];
    for (const comp of components) {
        const tier = getComponentTier(comp.componentName);
        if (tier === 1) tier1.push(comp);
        else tier2.push(comp);
    }

    log('DEV', 'parallel_tiers', {
        tier1: tier1.map(c => c.componentName),
        tier2: tier2.map(c => c.componentName),
    });

    // Step 2: Write Tier 2 (Sonnet) components in parallel
    if (tier2.length > 0) {
        emitter.info("developer", `Writing ${tier2.length} structural components (Sonnet)...`);
        const tier2Tasks = tier2.map(comp => () => {
            const brief = inspirationBriefs[comp.componentName]?.brief ?? null;
            return writeSingleComponent(comp, sharedContext, designTokenBlock, brief, 2);
        });
        const tier2Results = await runInChunks(tier2Tasks, MAX_CONCURRENT_SONNET);

        for (let i = 0; i < tier2Results.length; i++) {
            const result = tier2Results[i];
            if (result.status === 'fulfilled') {
                files.push(result.value);
                emitter.fileActivity("developer", result.value.path, "created");
            } else {
                log('DEV', 'parallel_component_failed', {
                    component: tier2[i].componentName,
                    tier: 2,
                    error: result.reason?.message ?? 'unknown',
                });
                failed.push(tier2[i].filename);
            }
        }
        log('DEV', 'tier2_done', { written: files.length - 1, failed: failed.length });
    }

    // Step 3: Write Tier 1 (Opus) components sequentially
    if (tier1.length > 0) {
        emitter.info("developer", `Writing ${tier1.length} premium components (Opus)...`);
        for (const comp of tier1) {
            const brief = inspirationBriefs[comp.componentName]?.brief ?? null;
            try {
                const result = await writeSingleComponent(comp, sharedContext, designTokenBlock, brief, 1);
                files.push(result);
                emitter.fileActivity("developer", result.path, "created");
            } catch (e: any) {
                log('DEV', 'parallel_component_failed', {
                    component: comp.componentName,
                    tier: 1,
                    error: e.message,
                });
                failed.push(comp.filename);
            }
        }
        log('DEV', 'tier1_done', { written: files.length - 1 - tier2.length, failed: failed.length });
    }

    // Step 4: page.tsx (deterministic — imports all sections)
    const successfulComponents = components.filter(
        c => !failed.includes(c.filename)
    );
    try {
        const pageContent = generatePageTsx(successfulComponents, sharedContext);
        files.push({ path: 'src/app/page.tsx', content: pageContent });
        emitter.fileActivity("developer", "src/app/page.tsx", "created");
    } catch (e: any) {
        log('DEV', 'parallel_page_tsx_failed', { error: e.message });
        failed.push('src/app/page.tsx');
    }

    log('DEV', 'parallel_done', {
        filesWritten: files.length,
        failed: failed.length,
        tier1Count: tier1.length,
        tier2Count: tier2.length,
        elapsedMs: Date.now() - startMs,
    });

    return { files, failed };
}
