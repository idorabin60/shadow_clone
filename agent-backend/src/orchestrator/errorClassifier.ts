/**
 * Error Classifier
 *
 * Parses raw error strings from the QA pipeline into structured objects
 * so the developer can receive targeted, file-specific fix prompts instead
 * of a full error dump that forces it to guess which files to touch.
 *
 * Handles three error types:
 *   - typescript: from `tsc --noEmit` (extracts file paths from TS error lines)
 *   - build:      from `next build` (extracts file paths from Webpack/Next.js output)
 *   - visual:     from vision LLM review (score + critical issues)
 */

import { log } from '../lib/logger';

export type ErrorType = 'typescript' | 'build' | 'visual';

export interface ClassifiedError {
    type: ErrorType;
    /** Relative file paths identified in the error output, e.g. ['src/Hero.tsx'] */
    affectedFiles: string[];
    /** One-line human-readable summary for logging */
    summary: string;
    /** Full original error text */
    rawMessage: string;
}

// TypeScript compiler output formats:
//   src/Hero.tsx(12,3): error TS2345: ...
//   src/App.tsx(1,1): error TS2304: ...
const TS_WITH_LOCATION = /([a-zA-Z0-9_\-./]+\.tsx?)\(\d+,\d+\):\s+error\s+TS/g;
//   src/App.tsx: error TS6133: ...  (no location)
const TS_WITHOUT_LOCATION = /([a-zA-Z0-9_\-./]+\.tsx?):\s+error\s+TS/g;

function extractTsFiles(errorText: string): string[] {
    const files = new Set<string>();
    let m: RegExpExecArray | null;

    const r1 = new RegExp(TS_WITH_LOCATION.source, 'g');
    while ((m = r1.exec(errorText)) !== null) {
        // Only src/ files — skip node_modules type errors
        if (m[1].startsWith('src/') || m[1].startsWith('./src/')) {
            files.add(m[1].replace(/^\.\//, ''));
        }
    }

    const r2 = new RegExp(TS_WITHOUT_LOCATION.source, 'g');
    while ((m = r2.exec(errorText)) !== null) {
        if (m[1].startsWith('src/') || m[1].startsWith('./src/')) {
            files.add(m[1].replace(/^\.\//, ''));
        }
    }

    return [...files];
}

// Next.js build errors reference source files in various ways
function extractBuildFiles(errorText: string): string[] {
    const files = new Set<string>();

    // Matches: src/App.tsx, ./src/Hero.tsx, /absolute/path/src/Foo.tsx
    const pattern = /(?:^|[\s"'(])(?:\.\/|\/[^\s]*\/)?(?=(src\/[a-zA-Z0-9_\-./]+\.tsx?))\1/gm;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(errorText)) !== null) {
        files.add(m[1]);
    }

    // Simpler fallback: bare src/ references
    const simple = /\b(src\/[a-zA-Z0-9_\-./]+\.tsx?)\b/g;
    while ((m = simple.exec(errorText)) !== null) {
        files.add(m[1]);
    }

    return [...files];
}

/**
 * Classify a raw error string from the QA pipeline.
 * Returns a structured error with type, affected files, and summary.
 */
export function classifyError(errorLogs: string): ClassifiedError {
    // TypeScript errors contain "error TS" codes
    if (errorLogs.includes('error TS') || errorLogs.startsWith('TypeScript TypeCheck failed')) {
        const files = extractTsFiles(errorLogs);
        const errorCount = (errorLogs.match(/error TS\d+/g) ?? []).length;
        const result: ClassifiedError = {
            type: 'typescript',
            affectedFiles: files,
            summary: `TypeScript: ${errorCount} error${errorCount !== 1 ? 's' : ''} across ${files.length} file${files.length !== 1 ? 's' : ''}`,
            rawMessage: errorLogs,
        };
        log('XML', 'classified', { type: result.type, files: result.affectedFiles, summary: result.summary });
        return result;
    }

    // Next.js build failures
    if (errorLogs.startsWith('Next.js Build failed') || errorLogs.includes('next build') || errorLogs.includes('Build Error')) {
        const files = extractBuildFiles(errorLogs);
        const result: ClassifiedError = {
            type: 'build',
            affectedFiles: files,
            summary: `Next.js build failed${files.length > 0 ? ` — ${files.join(', ')}` : ''}`,
            rawMessage: errorLogs,
        };
        log('XML', 'classified', { type: result.type, files: result.affectedFiles, summary: result.summary });
        return result;
    }

    // Visual QA failures
    const scoreMatch = errorLogs.match(/score:\s*(\d+)\/10/i);
    const result: ClassifiedError = {
        type: 'visual',
        affectedFiles: [], // visual errors are not file-specific
        summary: `Visual QA failed${scoreMatch ? ` (score: ${scoreMatch[1]}/10)` : ''}`,
        rawMessage: errorLogs,
    };
    log('XML', 'classified', { type: result.type, summary: result.summary });
    return result;
}

/**
 * Build a targeted fix prompt for the developer LLM.
 * For TypeScript/build errors: includes the broken files' current content.
 * For visual errors: includes the QA report only.
 */
export function buildTargetedFixPrompt(
    classified: ClassifiedError,
    fileContents: { path: string; content: string }[]
): string {
    const filesSection = fileContents.length > 0
        ? fileContents
            .map(f => `**${f.path}** (current content):\n\`\`\`tsx\n${f.content}\n\`\`\``)
            .join('\n\n')
        : '';

    if (classified.type === 'typescript') {
        const filesIntro = fileContents.length > 0
            ? `Fix ONLY these ${fileContents.length} file${fileContents.length !== 1 ? 's' : ''}:\n\n${filesSection}\n\n`
            : '';
        return `TypeScript check failed (${classified.summary}).\n\n${filesIntro}Errors:\n\`\`\`\n${classified.rawMessage}\n\`\`\`\n\nOutput <file> blocks for only the files listed above. Do not rewrite unrelated components.`;
    }

    if (classified.type === 'build') {
        const filesIntro = fileContents.length > 0
            ? `Affected files:\n\n${filesSection}\n\n`
            : '';
        return `Next.js build failed (${classified.summary}).\n\n${filesIntro}Build output:\n\`\`\`\n${classified.rawMessage}\n\`\`\`\n\nFix the Next.js build errors with <file> blocks.`;
    }

    // visual — no file contents, just the QA report
    return `Visual QA review: ${classified.summary}\n\nFull feedback:\n${classified.rawMessage}\n\nFix the critical issues by outputting corrected <file> blocks. Prioritise critical issues over warnings.`;
}
