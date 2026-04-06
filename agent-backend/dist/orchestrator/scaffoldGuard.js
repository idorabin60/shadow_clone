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
exports.shouldAllowProtectedWrite = exports.isProtected = exports.PROTECTED_FILES = void 0;
exports.PROTECTED_FILES = [
    "tailwind.config.js",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "src/app/layout.tsx",
];
/** Returns true if the file path ends with a protected scaffold filename. */
const isProtected = (filePath) => exports.PROTECTED_FILES.some(pf => filePath.endsWith(pf));
exports.isProtected = isProtected;
/**
 * Returns true only when QA error logs explicitly reference a config file,
 * meaning the scaffold itself caused the failure and must be patched.
 */
const shouldAllowProtectedWrite = (errorLogs) => {
    if (!errorLogs)
        return false;
    const lower = errorLogs.toLowerCase();
    return (lower.includes("tailwind") ||
        lower.includes("next.config") ||
        lower.includes("tsconfig") ||
        lower.includes("layout.tsx"));
};
exports.shouldAllowProtectedWrite = shouldAllowProtectedWrite;
