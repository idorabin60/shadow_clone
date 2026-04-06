"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevTools = createDevTools;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const tools_2 = require("../tools");
const emitter_1 = require("./emitter");
const logger_1 = require("../lib/logger");
const magicClient_1 = require("./magicClient");
function createDevTools(sandboxPath, fileCache) {
    let specReadCount = 0;
    const readFileTool = (0, tools_1.tool)(async ({ relativeFilePath }) => {
        emitter_1.emitter.fileActivity("developer", relativeFilePath, "read");
        // Spec is injected into the system prompt — re-reading it wastes tokens
        if (relativeFilePath === "spec.md") {
            specReadCount++;
            if (specReadCount > 1) {
                (0, logger_1.log)('TOOLS', 'spec_reread_blocked', { count: specReadCount });
                return "Error: spec.md is already in your system prompt. Do not re-read it — proceed to write code.";
            }
        }
        if (fileCache.has(relativeFilePath)) {
            (0, logger_1.log)('TOOLS', 'cache_hit', { path: relativeFilePath });
            return fileCache.get(relativeFilePath);
        }
        const content = await tools_2.tools.readFile(sandboxPath, relativeFilePath);
        if (!content.startsWith("Error")) {
            fileCache.set(relativeFilePath, content);
        }
        (0, logger_1.log)('TOOLS', 'file_read', { path: relativeFilePath, chars: content.length });
        return content;
    }, {
        name: "read_file",
        description: "Reads the content of a file. Use this to inspect existing code before patching with <file> blocks.",
        schema: zod_1.z.object({
            relativeFilePath: zod_1.z.string().describe("Relative path within the sandbox, e.g. 'src/App.tsx'"),
        }),
    });
    const listFilesTool = (0, tools_1.tool)(async ({ relativeDirPath }) => {
        emitter_1.emitter.toolInvoked("developer", "list_files");
        (0, logger_1.log)('TOOLS', 'list_files', { dir: relativeDirPath ?? '.' });
        return await tools_2.tools.listFiles(sandboxPath, relativeDirPath);
    }, {
        name: "list_files",
        description: "Lists all files in a directory to explore the sandbox structure.",
        schema: zod_1.z.object({
            relativeDirPath: zod_1.z.string().optional().describe("Directory to list, defaults to '.'"),
        }),
    });
    const npmInstallTool = (0, tools_1.tool)(async ({ packages }) => {
        emitter_1.emitter.toolInvoked("developer", "npm_install");
        (0, logger_1.log)('TOOLS', 'npm_install', { packages });
        const res = await tools_2.tools.npmInstall(sandboxPath, packages);
        (0, logger_1.log)('TOOLS', 'npm_install_done', { packages, success: !res.includes("Error") });
        return res;
    }, {
        name: "npm_install",
        description: "Installs NPM packages in the sandbox. Only use if a required package is missing.",
        schema: zod_1.z.object({
            packages: zod_1.z.array(zod_1.z.string()).describe("Package names to install, e.g. ['framer-motion']"),
        }),
    });
    const searchComponentsTool = (0, tools_1.tool)(async ({ query }) => {
        emitter_1.emitter.toolInvoked("developer", "search_components");
        (0, logger_1.log)('TOOLS', 'search_components', { query });
        const result = await (0, magicClient_1.searchComponents)(query);
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
        (0, logger_1.log)('TOOLS', 'search_components_done', { query, results: result.results.length });
        return `Found ${result.results.length} component(s) for "${query}":\n\n${formatted}`;
    }, {
        name: "search_components",
        description: "Search 21st.dev component library for UI inspiration. Returns real component code you can adapt. Use descriptive queries like 'hero section dark glassmorphism', 'pricing table modern cards', 'testimonials carousel premium'.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("Search query describing the component you want, e.g. 'navbar dark premium animated'"),
        }),
    });
    const refineComponentTool = (0, tools_1.tool)(async ({ code, feedback, context }) => {
        emitter_1.emitter.toolInvoked("developer", "refine_component");
        (0, logger_1.log)('TOOLS', 'refine_component', { feedbackChars: feedback.length, codeChars: code.length });
        const refined = await (0, magicClient_1.refineComponent)(code, feedback, context ?? '');
        if (!refined) {
            return "Refinement failed or unavailable. Apply the improvements manually.";
        }
        (0, logger_1.log)('TOOLS', 'refine_component_done', { refinedChars: refined.length });
        return `Refined component:\n\`\`\`tsx\n${refined}\n\`\`\``;
    }, {
        name: "refine_component",
        description: "Send a component to 21st.dev for AI-powered refinement. Provide the current code and feedback on what to improve (e.g. 'make the hover effects more dramatic', 'add glassmorphism cards').",
        schema: zod_1.z.object({
            code: zod_1.z.string().describe("Current component source code"),
            feedback: zod_1.z.string().describe("What to improve about the component"),
            context: zod_1.z.string().optional().describe("Additional context (design style, colors, etc.)"),
        }),
    });
    const agentTools = [readFileTool, listFilesTool, npmInstallTool, searchComponentsTool, refineComponentTool];
    const toolsByName = Object.fromEntries(agentTools.map(t => [t.name, t]));
    return { agentTools, toolsByName };
}
