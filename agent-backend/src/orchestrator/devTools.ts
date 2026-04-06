/**
 * Developer Node Tool Definitions
 *
 * Factory that creates the LangChain tools available to the developer agent.
 * Tools are scoped to a specific sandbox and share a file cache to avoid
 * redundant disk reads within the same agent loop.
 *
 * Only 3 tools are exposed to the LLM:
 *   - read_file: inspect existing files before patching
 *   - list_files: explore the sandbox structure
 *   - npm_install: install packages (rarely needed — most are pre-installed)
 *
 * File writes happen via XML <file> blocks in the LLM response, not via tools.
 * See xmlParser.ts for the extraction logic.
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tools } from "../tools";
import { emitter } from "./emitter";
import { log } from "../lib/logger";
import { searchComponents, refineComponent } from "./magicClient";

export function createDevTools(
    sandboxPath: string,
    fileCache: Map<string, string>
) {
    let specReadCount = 0;

    const readFileTool = tool(
        async ({ relativeFilePath }) => {
            emitter.fileActivity("developer", relativeFilePath, "read");

            // Spec is injected into the system prompt — re-reading it wastes tokens
            if (relativeFilePath === "spec.md") {
                specReadCount++;
                if (specReadCount > 1) {
                    log('TOOLS', 'spec_reread_blocked', { count: specReadCount });
                    return "Error: spec.md is already in your system prompt. Do not re-read it — proceed to write code.";
                }
            }

            if (fileCache.has(relativeFilePath)) {
                log('TOOLS', 'cache_hit', { path: relativeFilePath });
                return fileCache.get(relativeFilePath)!;
            }

            const content = await tools.readFile(sandboxPath, relativeFilePath);
            if (!content.startsWith("Error")) {
                fileCache.set(relativeFilePath, content);
            }
            log('TOOLS', 'file_read', { path: relativeFilePath, chars: content.length });
            return content;
        },
        {
            name: "read_file",
            description: "Reads the content of a file. Use this to inspect existing code before patching with <file> blocks.",
            schema: z.object({
                relativeFilePath: z.string().describe("Relative path within the sandbox, e.g. 'src/App.tsx'"),
            }),
        }
    );

    const listFilesTool = tool(
        async ({ relativeDirPath }) => {
            emitter.toolInvoked("developer", "list_files");
            log('TOOLS', 'list_files', { dir: relativeDirPath ?? '.' });
            return await tools.listFiles(sandboxPath, relativeDirPath);
        },
        {
            name: "list_files",
            description: "Lists all files in a directory to explore the sandbox structure.",
            schema: z.object({
                relativeDirPath: z.string().optional().describe("Directory to list, defaults to '.'"),
            }),
        }
    );

    const npmInstallTool = tool(
        async ({ packages }) => {
            emitter.toolInvoked("developer", "npm_install");
            log('TOOLS', 'npm_install', { packages });
            const res = await tools.npmInstall(sandboxPath, packages);
            log('TOOLS', 'npm_install_done', { packages, success: !res.includes("Error") });
            return res;
        },
        {
            name: "npm_install",
            description: "Installs NPM packages in the sandbox. Only use if a required package is missing.",
            schema: z.object({
                packages: z.array(z.string()).describe("Package names to install, e.g. ['framer-motion']"),
            }),
        }
    );

    const searchComponentsTool = tool(
        async ({ query }) => {
            emitter.toolInvoked("developer", "search_components");
            log('TOOLS', 'search_components', { query });
            const result = await searchComponents(query);
            if (result.results.length === 0) {
                return `No components found for "${query}". Try a different search query.`;
            }
            // Return structured results the LLM can act on (sandbox is Next.js — no stripping needed)
            const formatted = result.results.map((r, i) => {
                const depsNote = r.dependencies.length > 0
                    ? `\nDependencies: ${r.dependencies.join(', ')}`
                    : '';
                return `--- Result ${i + 1}: ${r.name} ---${depsNote}\n\`\`\`tsx\n${r.code.slice(0, 4000)}\n\`\`\``;
            }).join('\n\n');
            log('TOOLS', 'search_components_done', { query, results: result.results.length });
            return `Found ${result.results.length} component(s) for "${query}":\n\n${formatted}`;
        },
        {
            name: "search_components",
            description: "Search 21st.dev component library for UI inspiration. Returns real component code you can adapt. Use descriptive queries like 'hero section dark glassmorphism', 'pricing table modern cards', 'testimonials carousel premium'.",
            schema: z.object({
                query: z.string().describe("Search query describing the component you want, e.g. 'navbar dark premium animated'"),
            }),
        }
    );

    const refineComponentTool = tool(
        async ({ code, feedback, context }) => {
            emitter.toolInvoked("developer", "refine_component");
            log('TOOLS', 'refine_component', { feedbackChars: feedback.length, codeChars: code.length });
            const refined = await refineComponent(code, feedback, context ?? '');
            if (!refined) {
                return "Refinement failed or unavailable. Apply the improvements manually.";
            }
            log('TOOLS', 'refine_component_done', { refinedChars: refined.length });
            return `Refined component:\n\`\`\`tsx\n${refined}\n\`\`\``;
        },
        {
            name: "refine_component",
            description: "Send a component to 21st.dev for AI-powered refinement. Provide the current code and feedback on what to improve (e.g. 'make the hover effects more dramatic', 'add glassmorphism cards').",
            schema: z.object({
                code: z.string().describe("Current component source code"),
                feedback: z.string().describe("What to improve about the component"),
                context: z.string().optional().describe("Additional context (design style, colors, etc.)"),
            }),
        }
    );

    const agentTools = [readFileTool, listFilesTool, npmInstallTool, searchComponentsTool, refineComponentTool];
    const toolsByName = Object.fromEntries(agentTools.map(t => [t.name, t]));

    return { agentTools, toolsByName };
}
