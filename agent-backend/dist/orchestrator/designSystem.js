"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDesignTokenBlock = generateDesignTokenBlock;
exports.generateDesignSystem = generateDesignSystem;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../lib/logger");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
// ─── Hebrew font validation ────────────────────────────────────────────────
// These Google Fonts have full Hebrew character support.
const HEBREW_FONTS = [
    'Heebo', 'Assistant', 'Rubik', 'Secular One', 'Noto Sans Hebrew',
    'Frank Ruhl Libre', 'Suez One', 'Varela Round', 'Alef', 'David Libre',
    'Miriam Libre', 'Bellefair', 'Open Sans',
];
function isHebrewCompatible(fontName) {
    return HEBREW_FONTS.some(hf => fontName.toLowerCase() === hf.toLowerCase());
}
// ─── Default fallback (current hardcoded values) ────────────────────────────
const DEFAULT_RECOMMENDATION = {
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
        headingFont: 'Heebo',
        bodyFont: 'Heebo',
        cssImport: "@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');",
    },
    layout: {
        pattern: 'Hero + Features + CTA',
        sections: ['Navbar', 'Hero', 'Features', 'Footer'],
        ctaPlacement: 'Above fold',
    },
};
// ─── Transform raw Python output → typed recommendation ─────────────────────
function transformRaw(raw) {
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
    // Hebrew font validation: ensure body font supports Hebrew
    let bodyFont = raw.typography.body || 'Heebo';
    let headingFont = raw.typography.heading || 'Heebo';
    let cssImport = raw.typography.css_import || '';
    if (!isHebrewCompatible(bodyFont)) {
        // Add Heebo as the body font alongside the recommended heading font
        bodyFont = 'Heebo';
        cssImport = cssImport
            ? `${cssImport}\n@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');`
            : "@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');";
        (0, logger_1.log)('DESIGN', 'hebrew_font_fallback', {
            originalBody: raw.typography.body,
            fallback: 'Heebo',
        });
    }
    // If heading font doesn't support Hebrew either, keep it for display
    // but ensure the cssImport includes Heebo regardless
    if (!isHebrewCompatible(headingFont) && !cssImport.includes('Heebo')) {
        cssImport += "\n@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');";
    }
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
function generateDesignTokenBlock(ds) {
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
const SCRIPT_PATH = path_1.default.join(process.cwd(), 'src', 'design-data', 'scripts', 'generate_json.py');
const TIMEOUT_MS = 10_000;
/**
 * Generate a data-driven design system recommendation for a business.
 *
 * @param query - Business description, e.g. "luxury restaurant" or "SaaS startup"
 * @returns Typed design system recommendation. Falls back to defaults on failure.
 */
async function generateDesignSystem(query) {
    const startMs = Date.now();
    (0, logger_1.log)('DESIGN', 'start', { query, scriptPath: SCRIPT_PATH });
    try {
        const { stdout } = await execFileAsync('python3', [SCRIPT_PATH, query], {
            timeout: TIMEOUT_MS,
            maxBuffer: 1024 * 1024,
        });
        const raw = JSON.parse(stdout.trim());
        const recommendation = transformRaw(raw);
        (0, logger_1.log)('DESIGN', 'done', {
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
    }
    catch (err) {
        (0, logger_1.log)('DESIGN', 'error_fallback', {
            query,
            error: err.message,
            elapsedMs: Date.now() - startMs,
        });
        return DEFAULT_RECOMMENDATION;
    }
}
