"use strict";
/**
 * Scaffold Guard — protects template files from LLM modification.
 *
 * The scaffold (tailwind.config.js, next.config.ts, tsconfig files, layout.tsx)
 * provides the base configuration. Letting the LLM overwrite these
 * would break the project structure.
 *
 * Exception: if QA error logs explicitly mention a config file, allow the write.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldAllowProtectedWrite = exports.isSoftProtected = exports.isProtected = exports.SOFT_PROTECTED_FILES = exports.HARD_PROTECTED_FILES = void 0;
/**
 * Fully locked — never writable unless QA error logs reference them.
 * tailwind.config.js is handled separately as a "soft-protected" file.
 */
exports.HARD_PROTECTED_FILES = [
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.js",
    "src/app/not-found.tsx",
    "src/app/error.tsx",
    "src/pages/_error.tsx",
];
/**
 * Soft-protected — allowed on the initial generation pass (iteration 0)
 * because the developer often needs to add custom design-system colors/fonts.
 * Locked on subsequent fix iterations unless QA errors reference them.
 */
exports.SOFT_PROTECTED_FILES = [
    "tailwind.config.js",
    "src/app/layout.tsx",
];
const ALL_PROTECTED = [...exports.HARD_PROTECTED_FILES, ...exports.SOFT_PROTECTED_FILES];
/** Returns true if the file path ends with any protected scaffold filename. */
const isProtected = (filePath) => ALL_PROTECTED.some(pf => filePath.endsWith(pf));
exports.isProtected = isProtected;
/** Returns true if the file is only soft-protected (allowed on iteration 0). */
const isSoftProtected = (filePath) => exports.SOFT_PROTECTED_FILES.some(pf => filePath.endsWith(pf));
exports.isSoftProtected = isSoftProtected;
/**
 * Decides if a write to a protected file should be allowed.
 *
 * @param errorLogs - current QA error logs (if any)
 * @param iterationCount - current dev↔QA iteration (0 = first pass)
 */
const shouldAllowProtectedWrite = (errorLogs, filePath, iterationCount) => {
    // Soft-protected files are allowed on the initial generation (iteration 0)
    if (filePath && (0, exports.isSoftProtected)(filePath) && (iterationCount ?? 0) === 0) {
        return true;
    }
    // Any protected file is unlocked when QA errors reference it
    if (!errorLogs)
        return false;
    const lower = errorLogs.toLowerCase();
    return (lower.includes("tailwind") ||
        lower.includes("next.config") ||
        lower.includes("tsconfig") ||
        lower.includes("layout.tsx"));
};
exports.shouldAllowProtectedWrite = shouldAllowProtectedWrite;
