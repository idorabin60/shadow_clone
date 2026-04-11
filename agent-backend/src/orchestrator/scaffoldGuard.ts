/**
 * Scaffold Guard — protects template files from LLM modification.
 *
 * The scaffold (tailwind.config.js, next.config.ts, tsconfig files, layout.tsx)
 * provides the base configuration. Letting the LLM overwrite these
 * would break the project structure.
 *
 * Exception: if QA error logs explicitly mention a config file, allow the write.
 */

/**
 * Fully locked — never writable unless QA error logs reference them.
 * tailwind.config.js is handled separately as a "soft-protected" file.
 */
export const HARD_PROTECTED_FILES = [
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.js",
    "src/app/not-found.tsx",
    "src/app/error.tsx",
    "src/pages/_error.tsx",
] as const;

/**
 * Soft-protected — allowed on the initial generation pass (iteration 0)
 * because the developer often needs to add custom design-system colors/fonts.
 * Locked on subsequent fix iterations unless QA errors reference them.
 */
export const SOFT_PROTECTED_FILES = [
    "tailwind.config.js",
    "src/app/layout.tsx",
] as const;

const ALL_PROTECTED = [...HARD_PROTECTED_FILES, ...SOFT_PROTECTED_FILES];

/** Returns true if the file path ends with any protected scaffold filename. */
export const isProtected = (filePath: string): boolean =>
    ALL_PROTECTED.some(pf => filePath.endsWith(pf));

/** Returns true if the file is only soft-protected (allowed on iteration 0). */
export const isSoftProtected = (filePath: string): boolean =>
    SOFT_PROTECTED_FILES.some(pf => filePath.endsWith(pf));

/**
 * Decides if a write to a protected file should be allowed.
 *
 * @param errorLogs - current QA error logs (if any)
 * @param iterationCount - current dev↔QA iteration (0 = first pass)
 */
export const shouldAllowProtectedWrite = (
    errorLogs: string | null,
    filePath?: string,
    iterationCount?: number,
): boolean => {
    // Soft-protected files are allowed on the initial generation (iteration 0)
    if (filePath && isSoftProtected(filePath) && (iterationCount ?? 0) === 0) {
        return true;
    }

    // Any protected file is unlocked when QA errors reference it
    if (!errorLogs) return false;
    const lower = errorLogs.toLowerCase();
    return (
        lower.includes("tailwind") ||
        lower.includes("next.config") ||
        lower.includes("tsconfig") ||
        lower.includes("layout.tsx")
    );
};
