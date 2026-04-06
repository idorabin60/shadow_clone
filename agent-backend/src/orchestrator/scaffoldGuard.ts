/**
 * Scaffold Guard — protects template files from LLM modification.
 *
 * The scaffold (tailwind.config.js, next.config.ts, tsconfig files, layout.tsx)
 * provides the base configuration. Letting the LLM overwrite these
 * would break the project structure.
 *
 * Exception: if QA error logs explicitly mention a config file, allow the write.
 */

export const PROTECTED_FILES = [
    "tailwind.config.js",
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.js",
    "src/app/layout.tsx",
    "src/app/not-found.tsx",
    "src/app/error.tsx",
    "src/pages/_error.tsx",
] as const;

/** Returns true if the file path ends with a protected scaffold filename. */
export const isProtected = (filePath: string): boolean =>
    PROTECTED_FILES.some(pf => filePath.endsWith(pf));

/**
 * Returns true only when QA error logs explicitly reference a config file,
 * meaning the scaffold itself caused the failure and must be patched.
 */
export const shouldAllowProtectedWrite = (errorLogs: string | null): boolean => {
    if (!errorLogs) return false;
    const lower = errorLogs.toLowerCase();
    return (
        lower.includes("tailwind") ||
        lower.includes("next.config") ||
        lower.includes("tsconfig") ||
        lower.includes("layout.tsx")
    );
};
