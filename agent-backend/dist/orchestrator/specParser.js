"use strict";
/**
 * Spec Parser — shared utilities for parsing spec.md
 *
 * Extracted from parallelWriter.ts so both the inspiration distiller
 * and the parallel writer can share the same parsing logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSharedContext = extractSharedContext;
exports.parseSpecComponents = parseSpecComponents;
exports.getComponentTier = getComponentTier;
exports.getSearchQuery = getSearchQuery;
const logger_1 = require("../lib/logger");
// ─── Spec parsing ───────────────────────────────────────────────────────────
/**
 * Extract the shared design system from spec.md:
 * Color Palette + Typography + Image Strategy + Design System Rules
 */
function extractSharedContext(specContent) {
    const sections = ['Color Palette', 'Typography', 'Image Strategy', 'Design System Rules'];
    const parts = [];
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
function parseSpecComponents(specContent) {
    // Parse Component List
    const compListMatch = specContent.match(/## Component List\n([\s\S]*?)(?:\n##|$)/);
    if (!compListMatch) {
        (0, logger_1.log)('DEV', 'parallel_no_component_list', {
            specChars: specContent.length,
            specSections: (specContent.match(/^## /gm) ?? []).length,
            preview: specContent.slice(0, 300),
        });
        return [];
    }
    const rawFilenames = compListMatch[1]
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.endsWith('.tsx') && line.length > 0);
    // Normalize paths: section components go into src/components/sections/
    const filenames = rawFilenames.map(line => {
        const name = line.replace(/^src\//, '');
        // Skip App.tsx / page.tsx — generated separately
        if (name === 'App.tsx' || name === 'page.tsx')
            return null;
        // Already has a path prefix (e.g. components/GlassCard.tsx)
        if (name.includes('/'))
            return `src/${name}`;
        // Section components → src/components/sections/
        return `src/components/sections/${name}`;
    }).filter((f) => f !== null);
    // Parse Sections
    const sectionsMatch = specContent.match(/## Sections[\s\S]*?\n((?:\d+\.[\s\S]*?)(?=\n## |$))/);
    const sectionLines = [];
    if (sectionsMatch) {
        const raw = sectionsMatch[1];
        const items = raw.split(/(?=\d+\.\s)/);
        for (const item of items) {
            const trimmed = item.trim();
            if (trimmed.length > 0)
                sectionLines.push(trimmed);
        }
    }
    const components = [];
    for (const filename of filenames) {
        const componentName = filename.split('/').pop().replace('.tsx', '');
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
    (0, logger_1.log)('DEV', 'parallel_components_parsed', {
        total: components.length,
        names: components.map(c => c.componentName),
    });
    return components;
}
// ─── Tier classification ────────────────────────────────────────────────────
/** High visual impact components — written by Opus */
const TIER_1_PATTERNS = [
    'hero', 'features', 'services', 'testimonials',
    'pricing', 'gallery', 'about', 'team',
];
/**
 * Returns 1 (Opus — high visual impact) or 2 (Sonnet — structural/simple).
 * Unknown components default to Tier 1 to err on the side of quality.
 */
function getComponentTier(componentName) {
    const lower = componentName.toLowerCase();
    // Tier 2: structural components with well-established patterns
    if (lower === 'navbar' || lower === 'footer' || lower === 'faq' || lower === 'contact' || lower === 'cta') {
        return 2;
    }
    // Tier 1 if matches any high-impact pattern, otherwise default to Tier 1
    return 1;
}
// ─── Search query mapping ───────────────────────────────────────────────────
const COMPONENT_SEARCH_MAP = {
    'navbar': 'navbar dark premium landing page',
    'hero': 'hero section landing page with CTA',
    'footer': 'footer dark with links',
    'services': 'services grid cards pricing',
    'pricing': 'pricing table cards',
    'testimonials': 'testimonials carousel cards',
    'team': 'team members grid cards',
    'about': 'about section with image',
    'contact': 'contact form section',
    'features': 'features grid icons',
    'gallery': 'image gallery grid masonry',
    'faq': 'FAQ accordion section',
    'cta': 'call to action section button',
};
/** Get a search query for 21st.dev based on a component name. */
function getSearchQuery(componentName) {
    const compLower = componentName.toLowerCase();
    return COMPONENT_SEARCH_MAP[compLower]
        ?? Object.entries(COMPONENT_SEARCH_MAP).find(([key]) => compLower.includes(key))?.[1]
        ?? `${componentName} section landing page`;
}
