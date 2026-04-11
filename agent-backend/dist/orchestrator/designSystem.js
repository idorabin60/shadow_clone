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
exports.getDesignStyleFamily = getDesignStyleFamily;
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
function generateDesignTokenBlock(ds) {
    const family = getDesignStyleFamily(ds);
    const familyTokens = getStyleFamilyTokens(ds, family);
    return `═══ DESIGN TOKENS (use these exact classes — do NOT invent alternatives) ═══
Style family: ${family}
Section padding: py-24 px-6 md:px-12 max-w-7xl mx-auto
Card: ${familyTokens.card}
Card hover: ${familyTokens.cardHover}
Section shell: ${familyTokens.sectionShell}
Section bg: ${familyTokens.sectionBg}
Background accent: ${familyTokens.backgroundAccent}
Primary gradient: ${familyTokens.primaryGradient}
Eyebrow: ${familyTokens.eyebrow}
Heading: ${familyTokens.heading}
Hero heading: ${familyTokens.heroHeading}
Subheading: ${familyTokens.subheading}
Body text: ${familyTokens.body}
Button primary: ${familyTokens.primaryButton}
Button secondary: ${familyTokens.secondaryButton}
Divider / frame: ${familyTokens.frame}
Heading font: '${ds.typography.headingFont}' | Body font: '${ds.typography.bodyFont}'
Entrance animation: ${familyTokens.entranceAnimation}
Stagger children: ${familyTokens.stagger}
Viewport trigger: viewport={{ once: true, margin: "-100px" }}
Card hover motion: ${familyTokens.cardHoverMotion}
Key effects: ${ds.style.cssTechnicalKeywords}
Implementation cues: ${ds.style.aiPromptKeywords || ds.style.implementationChecklist}
AVOID: ${ds.style.antiPatterns.join(', ')}
═══ END DESIGN TOKENS ═══`;
}
function includesAny(value, terms) {
    return terms.some(term => value.includes(term));
}
function getDesignStyleFamily(ds) {
    const haystack = [
        ds.style.name,
        ds.style.keywords.join(' '),
        ds.style.effects.join(' '),
        ds.category,
    ].join(' ').toLowerCase();
    if (includesAny(haystack, ['glass', 'liquid glass', 'glassmorphism', 'frosted']))
        return 'glass';
    if (includesAny(haystack, ['luxury', 'premium', 'elegant', 'gold']))
        return 'luxury';
    if (includesAny(haystack, ['editorial', 'magazine', 'storytelling']))
        return 'editorial';
    if (includesAny(haystack, ['bold', 'brutal', 'block', 'vibrant']))
        return 'bold';
    if (includesAny(haystack, ['soft', 'wellness', 'calm', 'neumorphism', 'pastel']))
        return 'soft';
    return 'minimal';
}
function getStyleFamilyTokens(ds, family) {
    const shared = {
        primaryButton: `bg-[${ds.colors.accent}] hover:bg-[${ds.colors.accent}]/90 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300`,
        secondaryButton: `border text-[${ds.colors.text}] border-[${ds.colors.text}]/20 hover:border-[${ds.colors.accent}]/40 hover:text-[${ds.colors.accent}] px-8 py-4 rounded-xl transition-all duration-300`,
        entranceAnimation: `initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}`,
        stagger: `transition={{ delay: index * 0.12 }}`,
        cardHoverMotion: `whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}`,
    };
    switch (family) {
        case 'glass':
            return {
                ...shared,
                card: `rounded-3xl bg-white/8 border border-white/14 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.28)] p-8`,
                cardHover: `hover:bg-white/12 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition-all duration-500`,
                sectionShell: `relative overflow-hidden`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute w-96 h-96 rounded-full blur-[128px] opacity-20 bg-[${ds.colors.primary}]`,
                primaryGradient: `from-[${ds.colors.primary}]/25 via-white/5 to-[${ds.colors.accent}]/15`,
                eyebrow: `inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1 text-xs uppercase tracking-[0.3em] text-[${ds.colors.text}]/70`,
                heading: `text-4xl md:text-5xl font-bold text-[${ds.colors.text}] tracking-tight`,
                heroHeading: `text-6xl md:text-8xl font-black text-[${ds.colors.text}] tracking-tight`,
                subheading: `text-xl md:text-2xl text-[${ds.colors.text}]/72 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/70 leading-relaxed`,
                frame: `border border-white/10`,
            };
        case 'luxury':
            return {
                ...shared,
                card: `rounded-[28px] border border-[${ds.colors.accent}]/25 bg-black/30 p-8 shadow-[0_22px_80px_rgba(0,0,0,0.34)]`,
                cardHover: `hover:-translate-y-1 hover:border-[${ds.colors.accent}]/45 hover:shadow-[0_30px_90px_rgba(0,0,0,0.42)] transition-all duration-500`,
                sectionShell: `relative overflow-hidden`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[${ds.colors.accent}] to-transparent opacity-70`,
                primaryGradient: `from-[${ds.colors.accent}]/20 via-transparent to-[${ds.colors.primary}]/12`,
                eyebrow: `inline-flex items-center rounded-full border border-[${ds.colors.accent}]/30 px-4 py-1 text-xs uppercase tracking-[0.35em] text-[${ds.colors.accent}]`,
                heading: `text-4xl md:text-5xl font-semibold text-[${ds.colors.text}] tracking-[-0.03em]`,
                heroHeading: `text-6xl md:text-8xl font-semibold text-[${ds.colors.text}] tracking-[-0.05em]`,
                subheading: `text-xl md:text-2xl text-[${ds.colors.text}]/78 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/74 leading-8`,
                frame: `border border-[${ds.colors.accent}]/20`,
            };
        case 'editorial':
            return {
                ...shared,
                card: `rounded-[24px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]`,
                cardHover: `hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(15,23,42,0.12)] transition-all duration-500`,
                sectionShell: `relative overflow-hidden`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute inset-y-0 left-0 w-px bg-[${ds.colors.accent}]/30`,
                primaryGradient: `from-[${ds.colors.primary}]/10 via-transparent to-[${ds.colors.accent}]/8`,
                eyebrow: `inline-flex items-center border-b border-[${ds.colors.accent}]/40 pb-2 text-xs uppercase tracking-[0.4em] text-[${ds.colors.text}]/70`,
                heading: `text-4xl md:text-5xl font-semibold text-[${ds.colors.text}] tracking-[-0.04em]`,
                heroHeading: `text-6xl md:text-8xl font-semibold text-[${ds.colors.text}] leading-[0.95] tracking-[-0.06em]`,
                subheading: `max-w-3xl text-xl md:text-2xl text-[${ds.colors.text}]/75 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/72 leading-8`,
                frame: `border border-black/10`,
            };
        case 'bold':
            return {
                ...shared,
                card: `rounded-[26px] border-2 border-[${ds.colors.text}] bg-[${ds.colors.primary}]/10 p-8 shadow-[10px_10px_0_rgba(15,23,42,0.85)]`,
                cardHover: `hover:-translate-y-2 hover:translate-x-1 hover:shadow-[16px_16px_0_rgba(15,23,42,0.9)] transition-all duration-300`,
                sectionShell: `relative overflow-hidden`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute -top-16 right-0 h-40 w-40 rounded-full bg-[${ds.colors.accent}]/25 blur-3xl`,
                primaryGradient: `from-[${ds.colors.primary}]/30 via-[${ds.colors.accent}]/10 to-transparent`,
                eyebrow: `inline-flex items-center rounded-full border-2 border-[${ds.colors.text}] bg-[${ds.colors.accent}] px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-white`,
                heading: `text-4xl md:text-5xl font-black uppercase text-[${ds.colors.text}] tracking-[-0.03em]`,
                heroHeading: `text-6xl md:text-8xl font-black uppercase text-[${ds.colors.text}] leading-[0.92] tracking-[-0.05em]`,
                subheading: `text-xl md:text-2xl font-medium text-[${ds.colors.text}]/80 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/75 leading-relaxed`,
                frame: `border-2 border-[${ds.colors.text}]`,
            };
        case 'soft':
            return {
                ...shared,
                card: `rounded-[30px] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(148,163,184,0.18)]`,
                cardHover: `hover:-translate-y-1 hover:shadow-[0_26px_72px_rgba(148,163,184,0.22)] transition-all duration-500`,
                sectionShell: `relative overflow-hidden`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute -left-12 top-12 h-48 w-48 rounded-full bg-[${ds.colors.primary}]/12 blur-3xl`,
                primaryGradient: `from-[${ds.colors.primary}]/14 via-white/30 to-[${ds.colors.accent}]/12`,
                eyebrow: `inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.28em] text-[${ds.colors.text}]/65 shadow-sm`,
                heading: `text-4xl md:text-5xl font-semibold text-[${ds.colors.text}] tracking-[-0.03em]`,
                heroHeading: `text-6xl md:text-8xl font-semibold text-[${ds.colors.text}] tracking-[-0.05em]`,
                subheading: `text-xl md:text-2xl text-[${ds.colors.text}]/74 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/70 leading-8`,
                frame: `border border-white/70`,
            };
        case 'minimal':
        default:
            return {
                ...shared,
                card: `rounded-[24px] border border-black/8 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]`,
                cardHover: `hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)] transition-all duration-300`,
                sectionShell: `relative`,
                sectionBg: `bg-gradient-to-b ${ds.colors.background}`,
                backgroundAccent: `absolute inset-x-0 top-0 h-px bg-[${ds.colors.primary}]/20`,
                primaryGradient: `from-[${ds.colors.primary}]/12 via-transparent to-[${ds.colors.accent}]/8`,
                eyebrow: `inline-flex items-center rounded-full border border-black/10 px-4 py-1 text-xs uppercase tracking-[0.32em] text-[${ds.colors.text}]/60`,
                heading: `text-4xl md:text-5xl font-semibold text-[${ds.colors.text}] tracking-[-0.04em]`,
                heroHeading: `text-6xl md:text-8xl font-semibold text-[${ds.colors.text}] tracking-[-0.06em]`,
                subheading: `text-xl md:text-2xl text-[${ds.colors.text}]/72 leading-relaxed`,
                body: `text-lg text-[${ds.colors.text}]/70 leading-relaxed`,
                frame: `border border-black/8`,
            };
    }
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
