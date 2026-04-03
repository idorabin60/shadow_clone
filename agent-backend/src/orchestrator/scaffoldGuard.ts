/**
 * Scaffold Guard — protects template files from LLM modification.
 *
 * The scaffold (tailwind.config.js, index.html, vite.config.ts, tsconfig files)
 * is shared across ALL sandboxes via symlinks. Letting the LLM overwrite these
 * would corrupt the template for every future generation.
 *
 * Exception: if QA error logs explicitly mention a config file, allow the write.
 */

export const PROTECTED_FILES = [
    "tailwind.config.js",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.node.json",
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
        lower.includes("vite") ||
        lower.includes("tsconfig") ||
        lower.includes("index.html")
    );
};
