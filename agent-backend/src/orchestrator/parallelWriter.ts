/**
 * Parallel Component Writer
 *
 * On the first developer iteration, instead of a single monolithic LLM call that
 * writes all components sequentially, this module:
 *
 *  1. Parses spec.md into per-component specs (section name + description)
 *  2. Extracts shared context (colors, typography, image strategy, design rules)
 *  3. Writes index.css deterministically (Heebo font + Tailwind directives)
 *  4. Fires parallel LLM calls — one per component (excluding App.tsx)
 *  5. Generates App.tsx that imports and renders all sections in order
 *
 * Each component writer gets ONLY its section description + the shared design
 * system, so it has focused context and produces clean, independent output.
 * Cross-component issues (if any) are caught by tsc and handled by the fix loop.
 *
 * Uses Claude Sonnet (not Opus) for individual components — fast, cheap, sufficient.
 * Rate limits are managed with chunked parallelism (max 3 concurrent).
 */

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { parseXmlFiles } from './xmlParser';
import { getContentString } from './contextManager';
import { log } from '../lib/logger';
import { emitter } from './emitter';

// ─── Model for parallel writes ───────────────────────────────────────────────
// Sonnet: faster, cheaper, higher rate limits than Opus. Good enough for single components.
const componentModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

// GPT-4o fallback if Anthropic rate-limits us during parallel burst
const fallbackModel = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });

const MAX_CONCURRENT = 3; // max parallel LLM calls to avoid rate limits

// ─── Spec parsing ────────────────────────────────────────────────────────────

interface ComponentSpec {
    filename: string;          // e.g. 'src/Hero.tsx'
    componentName: string;     // e.g. 'Hero'
    sectionDescription: string; // from spec.md Sections, e.g. "Hero — headline, subline, CTA"
}

/**
 * Extract the shared design system from spec.md:
 * Color Palette + Typography + Image Strategy + Design System Rules
 */
function extractSharedContext(specContent: string): string {
    const sections = ['Color Palette', 'Typography', 'Image Strategy', 'Design System Rules'];
    const parts: string[] = [];

    for (const sectionName of sections) {
        const regex = new RegExp(`## ${sectionName}\\n([\\s\\S]*?)(?=\\n## |$)`);
        const match = specContent.match(regex);
        if (match) {
            parts.push(`## ${sectionName}\n${match[1].trim()}`);
        }
    }

    return parts.join('\n\n');
}

/**
 * Parse spec.md Sections into per-component specs.
 * Matches section names (e.g. "Hero", "Features") to component filenames.
 */
function parseSpecComponents(specContent: string): ComponentSpec[] {
    // Parse Component List
    const compListMatch = specContent.match(/## Component List\n([\s\S]*?)(?:\n##|$)/);
    if (!compListMatch) {
        log('DEV', 'parallel_no_component_list', {});
        return [];
    }

    const filenames = compListMatch[1]
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.endsWith('.tsx') && line.length > 0)
        .map(line => line.startsWith('src/') ? line : `src/${line}`);

    // Parse Sections
    const sectionsMatch = specContent.match(/## Sections[\s\S]*?\n((?:\d+\.[\s\S]*?)(?=\n## |$))/);
    const sectionLines: string[] = [];
    if (sectionsMatch) {
        // Split by numbered items: "1. Navbar — ...", "2. Hero — ..."
        const raw = sectionsMatch[1];
        const items = raw.split(/(?=\d+\.\s)/);
        for (const item of items) {
            const trimmed = item.trim();
            if (trimmed.length > 0) sectionLines.push(trimmed);
        }
    }

    const components: ComponentSpec[] = [];

    for (const filename of filenames) {
        const componentName = filename.replace('src/', '').replace('.tsx', '');

        // Skip App.tsx — it's generated separately as the root layout
        if (componentName === 'App') continue;

        // Find matching section description by name (case-insensitive)
        const matchedSection = sectionLines.find(line => {
            const nameMatch = line.match(/\d+\.\s*(\w+)/);
            return nameMatch && nameMatch[1].toLowerCase() === componentName.toLowerCase();
        });

        components.push({
            filename,
            componentName,
            sectionDescription: matchedSection
                ?? `${componentName} section — implement according to the design system rules.`,
        });
    }

    log('DEV', 'parallel_components_parsed', {
        total: components.length,
        names: components.map(c => c.componentName),
    });

    return components;
}

// ─── Component writing ───────────────────────────────────────────────────────

async function writeSingleComponent(
    comp: ComponentSpec,
    sharedContext: string,
): Promise<{ path: string; content: string }> {
    const startMs = Date.now();

    const prompt = `You are writing ONE React component for a premium Hebrew landing page.
Output EXACTLY one <file path="${comp.filename}"> block. No explanation, no other text.

SHARED DESIGN SYSTEM (use these colors, fonts, and rules exactly):
${sharedContext}

YOUR COMPONENT: ${comp.componentName} (${comp.filename})
SECTION DETAILS FROM SPEC:
${comp.sectionDescription}

IMPLEMENTATION RULES:
1. Export a single default function component named ${comp.componentName}.
2. Use the exact hex colors from the Color Palette above. Do NOT invent colors.
3. Wrap the outermost element in <motion.div> with: initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}.
4. Import { motion } from 'framer-motion' and icons from 'lucide-react' as needed.
5. All text must be in Hebrew. Use text-right and RTL-compatible layouts (flex-row-reverse).
6. For images: use relevant Unsplash URLs from the Image Strategy. Hero: w=1600, cards: w=800. Style: rounded-2xl shadow-2xl object-cover.
7. Use Tailwind only — no inline styles. Follow the spacing and card rules from Design System Rules.
8. The component must be self-contained. Do NOT import from other src/ components.
9. TypeScript: use React.FC or function syntax, no any types.`;

    let response;
    try {
        response = await componentModel.invoke([
            new SystemMessage(prompt),
            new HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    } catch (e: any) {
        // Fallback to GPT-4o on rate limit or other error
        log('DEV', 'parallel_component_fallback', { component: comp.componentName, error: e.message });
        response = await fallbackModel.invoke([
            new SystemMessage(prompt),
            new HumanMessage(`Write ${comp.filename}. Output ONLY the <file> block.`),
        ]);
    }

    const content = getContentString(response);
    const parsed = parseXmlFiles(content, null);

    if (parsed.files.length > 0) {
        const file = parsed.files[0];
        log('DEV', 'parallel_component_done', {
            component: comp.componentName,
            chars: file.content.length,
            elapsedMs: Date.now() - startMs,
        });
        return { path: file.path, content: file.content };
    }

    // If no <file> block found, try to use the raw content as the component
    // (some models skip the XML wrapper)
    log('DEV', 'parallel_component_no_xml', { component: comp.componentName });
    return {
        path: comp.filename,
        content: content.replace(/```tsx?\n?/g, '').replace(/```$/g, '').trim(),
    };
}

// ─── index.css generation (deterministic — no LLM needed) ────────────────────

function generateIndexCss(): string {
    return `@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        font-family: 'Heebo', sans-serif;
        direction: rtl;
    }
    body {
        @apply antialiased;
    }
}`;
}

// ─── App.tsx generation ──────────────────────────────────────────────────────

async function generateAppTsx(
    components: ComponentSpec[],
    sharedContext: string,
): Promise<string> {
    // Extract background gradient from shared context
    const bgMatch = sharedContext.match(/Background:\s*(.+)/);
    const bgGradient = bgMatch ? bgMatch[1].trim() : 'from-slate-900 to-slate-950';

    const prompt = `You are writing the root App.tsx for a Hebrew landing page.
Output EXACTLY one <file path="src/App.tsx"> block.

COMPONENTS TO IMPORT AND RENDER (in this exact order):
${components.map((c, i) => `${i + 1}. import ${c.componentName} from './${c.componentName}'`).join('\n')}

RULES:
- The root div MUST have dir="rtl" and className="min-h-screen bg-gradient-to-b ${bgGradient}"
- Import and render every component listed above, in order
- Do NOT add any section content — the imported components handle everything
- Keep it simple: just imports + a root div with components rendered inside
- TypeScript: function App() with default export`;

    let response;
    try {
        response = await componentModel.invoke([
            new SystemMessage(prompt),
            new HumanMessage('Write src/App.tsx. Output ONLY the <file> block.'),
        ]);
    } catch {
        response = await fallbackModel.invoke([
            new SystemMessage(prompt),
            new HumanMessage('Write src/App.tsx. Output ONLY the <file> block.'),
        ]);
    }

    const content = getContentString(response);
    const parsed = parseXmlFiles(content, null);

    if (parsed.files.length > 0) {
        return parsed.files[0].content;
    }

    // Deterministic fallback: generate App.tsx from template
    log('DEV', 'app_tsx_fallback_template', {});
    const imports = components
        .map(c => `import ${c.componentName} from './${c.componentName}';`)
        .join('\n');
    const renders = components
        .map(c => `      <${c.componentName} />`)
        .join('\n');

    return `${imports}

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b ${bgGradient}">
${renders}
    </div>
  );
}

export default App;
`;
}

// ─── Chunked parallel execution ──────────────────────────────────────────────

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

// ─── Main orchestrator ───────────────────────────────────────────────────────

export interface ParallelWriteResult {
    files: { path: string; content: string }[];
    failed: string[];
}

/**
 * Write all components from spec.md in parallel.
 * Returns the files to be written to disk + list of any failed components.
 */
export async function writeAllComponentsParallel(
    specContent: string,
): Promise<ParallelWriteResult> {
    const startMs = Date.now();
    const components = parseSpecComponents(specContent);
    const sharedContext = extractSharedContext(specContent);

    if (components.length === 0) {
        log('DEV', 'parallel_skip', { reason: 'no_components_parsed' });
        return { files: [], failed: [] };
    }

    log('DEV', 'parallel_start', {
        components: components.length,
        maxConcurrent: MAX_CONCURRENT,
        sharedContextChars: sharedContext.length,
    });

    const files: { path: string; content: string }[] = [];
    const failed: string[] = [];

    // Step 1: index.css (deterministic)
    files.push({ path: 'src/index.css', content: generateIndexCss() });
    emitter.fileActivity("developer", "src/index.css", "created");
    log('DEV', 'parallel_index_css', {});

    // Step 2: All section components in parallel (chunked)
    const tasks = components.map(comp => () => writeSingleComponent(comp, sharedContext));
    const results = await runInChunks(tasks, MAX_CONCURRENT);

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const comp = components[i];
        if (result.status === 'fulfilled') {
            files.push(result.value);
            emitter.fileActivity("developer", result.value.path, "created");
        } else {
            log('DEV', 'parallel_component_failed', {
                component: comp.componentName,
                error: result.reason?.message ?? 'unknown',
            });
            failed.push(comp.filename);
        }
    }

    // Step 3: App.tsx (needs to know all component names)
    const successfulComponents = components.filter(
        (_, i) => results[i].status === 'fulfilled'
    );
    try {
        const appContent = await generateAppTsx(successfulComponents, sharedContext);
        files.push({ path: 'src/App.tsx', content: appContent });
        emitter.fileActivity("developer", "src/App.tsx", "created");
        log('DEV', 'parallel_app_tsx_done', {});
    } catch (e: any) {
        log('DEV', 'parallel_app_tsx_failed', { error: e.message });
        failed.push('src/App.tsx');
    }

    log('DEV', 'parallel_done', {
        filesWritten: files.length,
        failed: failed.length,
        elapsedMs: Date.now() - startMs,
    });

    return { files, failed };
}
