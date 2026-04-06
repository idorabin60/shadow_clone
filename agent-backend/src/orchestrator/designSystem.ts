/**
 * Design System Service
 *
 * Calls the ui-ux-pro-max Python search engine to generate a data-driven
 * design system recommendation for a specific business type.
 *
 * The Python script searches across CSV databases:
 *   - 67 UI styles (Minimalism, Glassmorphism, Brutalism, etc.)
 *   - 161 color palettes by industry
 *   - 57 font pairings with mood descriptors
 *   - 161 product-type → style/color/pattern mappings
 *   - Landing page structures and CTA strategies
 *
 * Returns a typed DesignSystemRecommendation that replaces all hardcoded
 * design rules in the PM and Developer prompts.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { log } from '../lib/logger';

const execFileAsync = promisify(execFile);

// ─── Hebrew font validation ────────────────────────────────────────────────
// These Google Fonts have full Hebrew character support.
const HEBREW_FONTS = [
    'Heebo', 'Assistant', 'Rubik', 'Secular One', 'Noto Sans Hebrew',
    'Frank Ruhl Libre', 'Suez One', 'Varela Round', 'Alef', 'David Libre',
    'Miriam Libre', 'Bellefair', 'Open Sans',
];

function isHebrewCompatible(fontName: string): boolean {
    return HEBREW_FONTS.some(hf => fontName.toLowerCase() === hf.toLowerCase());
}

// ─── Raw Python output shape ────────────────────────────────────────────────

interface RawDesignSystem {
    project_name: string;
    category: string;
    pattern: {
        name: string;
        sections: string;      // "Hero > Features > CTA"
        cta_placement: string;
        color_strategy: string;
        conversion: string;
    };
    style: {
        name: string;
        type: string;
        effects: string;
        keywords: string;
        best_for: string;
        performance: string;
        accessibility: string;
        ai_prompt_keywords: string;
        css_technical_keywords: string;
        implementation_checklist: string;
        design_system_variables: string;
    };
    colors: {
        primary: string;
        secondary: string;
        cta: string;
        background: string;
        text: string;
        notes: string;
    };
    typography: {
        heading: string;
        body: string;
        mood: string;
        best_for: string;
        google_fonts_url: string;
        css_import: string;
    };
    key_effects: string;
    anti_patterns: string;
}

// ─── Public types ───────────────────────────────────────────────────────────

export interface DesignSystemRecommendation {
    /** Business category detected from the query (e.g. "Restaurant/Food Service") */
    category: string;

    style: {
        name: string;
        keywords: string[];
        effects: string[];
        antiPatterns: string[];
        /** Full AI prompt instructions for implementing this style */
        aiPromptKeywords: string;
        /** CSS properties and techniques to use */
        cssTechnicalKeywords: string;
        /** Checklist of visual elements to verify */
        implementationChecklist: string;
        /** CSS custom properties / design tokens */
        designSystemVariables: string;
    };

    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        notes: string;
    };

    typography: {
        headingFont: string;
        bodyFont: string;
        cssImport: string;
    };

    layout: {
        pattern: string;
        sections: string[];
        ctaPlacement: string;
    };
}

// ─── Default fallback (current hardcoded values) ────────────────────────────

const DEFAULT_RECOMMENDATION: DesignSystemRecommendation = {
    category: 'General',
    style: {
        name: 'Glassmorphism',
        keywords: ['glass', 'blur', 'transparency', 'modern', 'depth'],
        effects: ['backdrop-blur', 'fade-up animation', 'hover glow'],
        antiPatterns: [],
        aiPromptKeywords: 'Create a frosted glass UI with backdrop-filter blur, semi-transparent backgrounds, subtle borders, depth layers, and smooth hover transitions.',
        cssTechnicalKeywords: 'backdrop-filter: blur(12px) saturate(180%), background: rgba(255,255,255,0.1), border: 1px solid rgba(255,255,255,0.2), box-shadow: 0 8px 32px rgba(0,0,0,0.1)',
        implementationChecklist: 'Frosted glass cards, blur backdrop active, semi-transparent backgrounds, subtle white borders, depth layering, smooth transitions',
        designSystemVariables: '--glass-blur: 12px, --glass-bg: rgba(255,255,255,0.1), --glass-border: rgba(255,255,255,0.2), --glass-shadow: 0 8px 32px rgba(0,0,0,0.1)',
    },
    colors: {
        primary: '#6366F1',
        secondary: '#818CF8',
        accent: '#F59E0B',
        background: 'from-slate-900 via-indigo-950 to-slate-900',
        text: '#F8FAFC',
        notes: 'Default indigo + amber accent',
    },
    typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        cssImport: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');",
    },
    layout: {
        pattern: 'Hero + Features + CTA',
        sections: ['Navbar', 'Hero', 'Features', 'Footer'],
        ctaPlacement: 'Above fold',
    },
};

// ─── Transform raw Python output → typed recommendation ─────────────────────

function transformRaw(raw: RawDesignSystem): DesignSystemRecommendation {
    // Parse sections from "Hero > Features > CTA" format
    const sections = raw.pattern.sections
        .split('>')
        .map(s => s.trim())
        .filter(Boolean);

    // Ensure Navbar and Footer are always present
    if (!sections.some(s => s.toLowerCase() === 'navbar')) {
        sections.unshift('Navbar');
    }
    if (!sections.some(s => s.toLowerCase() === 'footer')) {
        sections.push('Footer');
    }

    // Parse keywords and effects from comma-separated strings
    const keywords = raw.style.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

    const effects = raw.key_effects
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);

    const antiPatterns = raw.anti_patterns
        .split('+')
        .map(a => a.trim())
        .filter(Boolean);

    // Standard text rendering bypasses manual font mapping
    let bodyFont = raw.typography.body || 'Inter';
    let headingFont = raw.typography.heading || 'Inter';
    let cssImport = raw.typography.css_import || '';

    return {
        category: raw.category,
        style: {
            name: raw.style.name,
            keywords,
            effects,
            antiPatterns,
            aiPromptKeywords: raw.style.ai_prompt_keywords || '',
            cssTechnicalKeywords: raw.style.css_technical_keywords || '',
            implementationChecklist: raw.style.implementation_checklist || '',
            designSystemVariables: raw.style.design_system_variables || '',
        },
        colors: {
            primary: raw.colors.primary,
            secondary: raw.colors.secondary,
            accent: raw.colors.cta,
            background: raw.colors.background,
            text: raw.colors.text,
            notes: raw.colors.notes,
        },
        typography: { headingFont, bodyFont, cssImport },
        layout: {
            pattern: raw.pattern.name,
            sections,
            ctaPlacement: raw.pattern.cta_placement || 'Above fold',
        },
    };
}

// ─── Design Token Block ─────────────────────────────────────────────────────

/**
 * Generate a deterministic Tailwind class map from the design system.
 * Every component gets the SAME tokens — ensures visual consistency.
 * Replaces the verbose MANDATORY DESIGN STYLE block (~800 tokens → ~400 tokens).
 */
export function generateDesignTokenBlock(ds: DesignSystemRecommendation): string {
    return `═══ DESIGN TOKENS (use these exact classes — do NOT invent alternatives) ═══
Section padding: py-24 px-6 md:px-12 max-w-7xl mx-auto
Card: rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8
Card hover: hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-500
Heading: text-4xl md:text-5xl font-bold text-[${ds.colors.text}]
Hero heading: text-6xl md:text-8xl font-black
Subheading: text-xl md:text-2xl text-[${ds.colors.text}]/70
Body text: text-lg text-[${ds.colors.text}]/70 leading-relaxed
Button primary: bg-[${ds.colors.accent}] hover:bg-[${ds.colors.accent}]/90 text-white px-8 py-4 rounded-xl font-bold transition-colors
Button secondary: border border-[${ds.colors.accent}]/30 text-[${ds.colors.accent}] hover:bg-[${ds.colors.accent}]/10 px-8 py-4 rounded-xl transition-colors
Background orb: absolute w-96 h-96 rounded-full blur-[128px] opacity-20 bg-[${ds.colors.primary}]
Section bg: bg-gradient-to-b ${ds.colors.background}
Primary gradient: from-[${ds.colors.primary}]/20 via-transparent to-[${ds.colors.accent}]/10
Heading font: '${ds.typography.headingFont}' | Body font: '${ds.typography.bodyFont}'
Entrance animation: initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
Stagger children: transition={{ delay: index * 0.12 }}
Viewport trigger: viewport={{ once: true, margin: "-100px" }}
Card hover motion: whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}
Style: ${ds.style.name}
Key effects: ${ds.style.cssTechnicalKeywords}
AVOID: ${ds.style.antiPatterns.join(', ')}
═══ END DESIGN TOKENS ═══`;
}

// ─── Main entry point ───────────────────────────────────────────────────────

// Anchored to project root (agent-backend/) via process.cwd().
// Works in both ts-node (dev) and compiled (dist/) modes.
const SCRIPT_PATH = path.join(process.cwd(), 'src', 'design-data', 'scripts', 'generate_json.py');
const TIMEOUT_MS = 10_000;

/**
 * Generate a data-driven design system recommendation for a business.
 *
 * @param query - Business description, e.g. "luxury restaurant" or "SaaS startup"
 * @returns Typed design system recommendation. Falls back to defaults on failure.
 */
export async function generateDesignSystem(query: string): Promise<DesignSystemRecommendation> {
    const startMs = Date.now();
    log('DESIGN', 'start', { query, scriptPath: SCRIPT_PATH });

    try {
        const { stdout } = await execFileAsync('python3', [SCRIPT_PATH, query], {
            timeout: TIMEOUT_MS,
            maxBuffer: 1024 * 1024,
        });

        const raw: RawDesignSystem = JSON.parse(stdout.trim());
        const recommendation = transformRaw(raw);

        log('DESIGN', 'done', {
            query,
            category: recommendation.category,
            style: recommendation.style.name,
            headingFont: recommendation.typography.headingFont,
            bodyFont: recommendation.typography.bodyFont,
            primary: recommendation.colors.primary,
            sections: recommendation.layout.sections.length,
            elapsedMs: Date.now() - startMs,
        });

        return recommendation;
    } catch (err: any) {
        log('DESIGN', 'error_fallback', {
            query,
            error: err.message,
            elapsedMs: Date.now() - startMs,
        });
        return DEFAULT_RECOMMENDATION;
    }
}
