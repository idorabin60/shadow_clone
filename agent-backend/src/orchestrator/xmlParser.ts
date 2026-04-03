/**
 * XML Artifact Parser
 *
 * The developer LLM outputs file content as raw XML blocks:
 *   <file path="src/Hero.tsx">...code...</file>
 *
 * This module extracts them, applies scaffold/naming guards, and returns:
 * - files: validated files ready to write to disk
 * - guardErrors: human-readable strings for any blocked files (fed back to LLM)
 * - strippedContent: the original response with XML blobs replaced by 1-line stubs
 *   (prevents token bloat when response is added back to message history)
 */

import { log } from '../lib/logger';
import { isProtected, shouldAllowProtectedWrite } from './scaffoldGuard';

export interface ParsedFile {
    path: string;
    content: string;
}

export interface XmlParseResult {
    files: ParsedFile[];
    guardErrors: string[];
    strippedContent: string;
}

// Load-bearing regex — do not change without reading the CLAUDE.md warning.
// Matches: <file path="src/Foo.tsx"> ... </file> with optional whitespace after the tag.
const FILE_REGEX = /<file[^>]*path=["']([^"']+)["'][^>]*>\n*([\s\S]*?)\n*<\/file>/gi;

export function parseXmlFiles(
    rawContent: string,
    errorLogs: string | null
): XmlParseResult {
    const files: ParsedFile[] = [];
    const guardErrors: string[] = [];
    let strippedContent = rawContent;

    // Reset lastIndex — regex is stateful when used with /g flag
    FILE_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = FILE_REGEX.exec(rawContent)) !== null) {
        const filePath = match[1];
        const fileContent = match[2];
        const stub = `<file path="${filePath}">[Written to disk. Use read_file to review.]</file>`;

        // Guard 1: Component Naming — Navigation.tsx is a known hallucination
        if (filePath.endsWith("Navigation.tsx")) {
            log('GUARD', 'naming_blocked', { path: filePath });
            guardErrors.push(
                `Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'.`
            );
            strippedContent = strippedContent.replace(
                match[0],
                `<file path="${filePath}">[BLOCKED: rename to Navbar.tsx]</file>`
            );
            continue;
        }

        // Guard 2: Scaffold Lock
        if (isProtected(filePath) && !shouldAllowProtectedWrite(errorLogs)) {
            log('GUARD', 'scaffold_blocked', { path: filePath });
            guardErrors.push(
                `Modification to protected file '${filePath}' is blocked. Only touch src/ application files.`
            );
            strippedContent = strippedContent.replace(
                match[0],
                `<file path="${filePath}">[BLOCKED: scaffold lock]</file>`
            );
            continue;
        }

        log('XML', 'file_extracted', { path: filePath, chars: fileContent.length });
        files.push({ path: filePath, content: fileContent });

        // Strip the large XML payload so it doesn't re-enter message history
        strippedContent = strippedContent.replace(match[0], stub);
    }

    if (files.length > 0 || guardErrors.length > 0) {
        log('XML', 'parse_complete', {
            extracted: files.length,
            blocked: guardErrors.length,
            paths: files.map(f => f.path),
        });
    }

    return { files, guardErrors, strippedContent };
}
