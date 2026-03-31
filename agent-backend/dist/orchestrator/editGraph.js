"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editApp = void 0;
const langgraph_1 = require("@langchain/langgraph");
const openai_1 = require("@langchain/openai");
const anthropic_1 = require("@langchain/anthropic");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const tools_2 = require("../tools");
const emitter_1 = require("./emitter");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openaiModel = new openai_1.ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0
});
const claudeDevModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : openaiModel;
const devModel = claudeDevModel;
/**
 * Node 1: Edit Developer
 * Reads the user's change request + existing code, applies surgical edits.
 */
async function editDeveloperNode(state) {
    emitter_1.emitter.stepStart("edit_dev", state.iterationCount);
    // Build a file manifest so the LLM knows what exists
    const fileList = await tools_2.tools.listFiles(state.sandboxPath);
    const errorContext = state.errorLogs
        ? `\n\nCRITICAL: Your previous edit caused errors that must be fixed:\n${state.errorLogs}\n`
        : "";
    const editPrompt = `You are an elite Senior React/Vite Developer editing an existing premium Hebrew landing page.
The user wants a specific change. You must apply ONLY the minimal edits needed — do NOT rewrite the entire codebase.

CRITICAL WORKFLOW:
1. READ: Use 'read_file' to inspect the files relevant to the user's request. Read 1-3 key files max, then move to step 2.
2. PATCH: You MUST output <file path="...">full updated content</file> XML blocks for each file you modify. This is MANDATORY — analysis alone is not enough.
3. Only output files that actually change. Do NOT re-output unchanged files.

IMPORTANT: After reading files, you MUST produce <file> XML blocks with the fix. Do NOT just describe the problem — actually fix it by outputting the corrected file contents. Every response after reading should contain at least one <file> block.

RULES:
- The site is Hebrew, RTL (dir="rtl"). Maintain this in any new content.
- All pre-installed libraries (framer-motion, lucide-react, clsx, tailwind-merge) are available — do NOT npm install them.
- The navigation component is always "Navbar.tsx" — never "Navigation.tsx".
- You CAN modify tailwind.config.js if the fix requires adding custom colors, fonts, or theme extensions. However, do NOT change vite.config.ts, tsconfig.json, or index.html unless QA errors require it.
- If components use custom Tailwind classes (e.g. text-cream-200, bg-espresso-900) that are not defined in tailwind.config.js, you MUST either: (a) add them to tailwind.config.js, or (b) replace them with standard Tailwind classes.
- Maintain the existing premium design quality (glassmorphism, animations, shadows, gradients).
- If the user asks for a new section, integrate it naturally into the existing page flow in App.tsx.

CURRENT FILE MANIFEST:
${fileList}
${errorContext}

USER'S EDIT REQUEST:
"${state.userRequest}"`;
    // Scaffold lock — relaxed for edits: tailwind.config.js is allowed (users often need theme changes)
    const protectedFiles = ["index.html", "vite.config.ts", "tsconfig.json", "tsconfig.node.json"];
    const isProtected = (filePath) => protectedFiles.some(pf => filePath.endsWith(pf));
    const shouldAllowProtectedWrite = () => {
        if (!state.errorLogs)
            return false;
        const low = state.errorLogs.toLowerCase();
        return low.includes("vite") || low.includes("tsconfig") || low.includes("index.html");
    };
    // Define tools scoped to this sandbox
    const readFileTool = (0, tools_1.tool)(async ({ relativeFilePath }) => {
        emitter_1.emitter.fileActivity("edit_dev", relativeFilePath, "read");
        return await tools_2.tools.readFile(state.sandboxPath, relativeFilePath);
    }, {
        name: "read_file",
        description: "Reads the content of a file. Use this to inspect code before editing.",
        schema: zod_1.z.object({ relativeFilePath: zod_1.z.string() }),
    });
    const listFilesTool = (0, tools_1.tool)(async ({ relativeDirPath }) => {
        emitter_1.emitter.toolInvoked("edit_dev", "list_files");
        return await tools_2.tools.listFiles(state.sandboxPath, relativeDirPath);
    }, {
        name: "list_files",
        description: "Lists all files in a directory.",
        schema: zod_1.z.object({ relativeDirPath: zod_1.z.string().optional().describe("Optional path, defaults to '.'") }),
    });
    const agentTools = [readFileTool, listFilesTool];
    const toolsByName = Object.fromEntries(agentTools.map((t) => [t.name, t]));
    const claudeWithTools = devModel.bindTools(agentTools);
    const gptWithTools = openaiModel.bindTools(agentTools);
    const modelWithTools = claudeWithTools.withFallbacks({ fallbacks: [gptWithTools] });
    let currentMessages = [...state.messages];
    if (currentMessages.length === 0) {
        currentMessages.push(new messages_1.HumanMessage(`Apply the following edit to the existing codebase: "${state.userRequest}"`));
    }
    // Trim messages to prevent context overflow
    const trimMessages = (msgs, max = 40) => {
        if (msgs.length <= max)
            return msgs;
        const first = msgs[0];
        let trimmed = msgs.slice(-(max - 1));
        while (trimmed.length > 0 && trimmed[0]?._getType?.() === "tool") {
            trimmed.shift();
        }
        return [first, ...trimmed];
    };
    let maxSteps = 30;
    let steps = 0;
    let patchAttempts = 0;
    while (steps < maxSteps) {
        steps++;
        emitter_1.emitter.info("edit_dev", `Loop step ${steps}`);
        currentMessages = trimMessages(currentMessages, 40);
        const payload = [new messages_1.SystemMessage(editPrompt), ...currentMessages];
        const response = await modelWithTools.invoke(payload);
        let didPatch = false;
        let xmlErrorMessages = [];
        // XML artifact extraction (same engine as main graph)
        if (response.content && typeof response.content === "string" && response.content.trim().length > 0) {
            let cleanedContent = response.content;
            const fileRegex = /<file[^>]*path=["']([^"']+)["'][^>]*>\n*([\s\S]*?)\n*<\/file>/gi;
            let match;
            while ((match = fileRegex.exec(response.content)) !== null) {
                const filePath = match[1];
                const fileContent = match[2];
                emitter_1.emitter.fileActivity("edit_dev", filePath, "created");
                if (filePath.endsWith("Navigation.tsx")) {
                    console.log("Skipped: Navigation must be Navbar.tsx");
                    xmlErrorMessages.push(new messages_1.HumanMessage(`XML Error: Navigation component MUST be named 'Navbar.tsx'.`));
                    didPatch = true;
                    continue;
                }
                if (isProtected(filePath) && !shouldAllowProtectedWrite()) {
                    console.log(`Skipped: Scaffold lock on ${filePath}`);
                    xmlErrorMessages.push(new messages_1.HumanMessage(`XML Error: Modification to '${filePath}' is blocked.`));
                    didPatch = true;
                    continue;
                }
                await tools_2.tools.writeFile(state.sandboxPath, filePath, fileContent);
                didPatch = true;
                cleanedContent = cleanedContent.replace(match[0], `<file path="${filePath}">[Written to disk]</file>`);
            }
            response.content = cleanedContent;
        }
        currentMessages.push(response);
        currentMessages.push(...xmlErrorMessages);
        // Handle tool calls
        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const tCall of response.tool_calls) {
                emitter_1.emitter.toolInvoked("edit_dev", tCall.name);
                const selectedTool = toolsByName[tCall.name];
                let toolResult = "";
                if (selectedTool) {
                    try {
                        toolResult = await selectedTool.invoke(tCall.args);
                    }
                    catch (e) {
                        toolResult = `Error: ${e.message}`;
                    }
                }
                else {
                    toolResult = `Error: Unknown tool ${tCall.name}`;
                }
                currentMessages.push(new messages_1.ToolMessage({
                    content: toolResult,
                    name: tCall.name,
                    tool_call_id: tCall.id
                }));
            }
        }
        // If no tools and no patches — LLM may have just analyzed without patching
        if (!didPatch && (!response.tool_calls || response.tool_calls.length === 0)) {
            if (patchAttempts === 0 && steps < maxSteps) {
                // The LLM described the problem but didn't output patches — nudge it
                emitter_1.emitter.info("edit_dev", "No patches produced, nudging LLM...");
                currentMessages.push(new messages_1.HumanMessage("You analyzed the problem but did not output any <file> blocks. You MUST output the corrected files as <file path=\"...\">content</file> XML blocks now. Do NOT just describe the fix — actually produce the updated file contents."));
                continue;
            }
            emitter_1.emitter.stepDone("edit_dev", state.iterationCount);
            break;
        }
        // Run TS verification after patches
        if (didPatch) {
            patchAttempts++;
            emitter_1.emitter.info("edit_dev", `Running TypeScript verification (attempt ${patchAttempts}/2)`);
            const tsResult = await tools_2.tools.runTypeScript(state.sandboxPath);
            if (!tsResult.includes("Success:")) {
                emitter_1.emitter.info("edit_dev", "TypeScript verification failed, fixing...");
                currentMessages.push(new messages_1.HumanMessage(`TypeScript check failed after your edit:\n${tsResult}\n\nPlease fix with corrected <file> blocks.`));
                if (patchAttempts >= 2) {
                    emitter_1.emitter.info("edit_dev", "Max patch attempts reached");
                    break;
                }
            }
            else {
                emitter_1.emitter.info("edit_dev", "TypeScript verification passed");
                emitter_1.emitter.stepDone("edit_dev", state.iterationCount);
                break;
            }
        }
    }
    return {
        status: "qa",
        iterationCount: state.iterationCount + 1,
        messages: currentMessages
    };
}
/**
 * Node 2: Edit QA
 * Runs TypeScript + Vite build. Skips visual QA for faster iteration.
 */
async function editQaNode(state) {
    // Phase 1: TypeScript
    emitter_1.emitter.stepStart("edit_qa_ts", state.iterationCount);
    const tsResult = await tools_2.tools.runTypeScript(state.sandboxPath);
    if (!tsResult.includes("Success:")) {
        emitter_1.emitter.stepFailed("edit_qa_ts", "TypeScript errors found", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `TypeScript check failed:\n${tsResult}`,
            messages: [...state.messages, new messages_1.HumanMessage(`[Edit QA] TypeScript errors found:\n${tsResult}\n\nFix these errors with corrected <file> blocks.`)]
        };
    }
    // Phase 2: Vite Build
    emitter_1.emitter.stepDone("edit_qa_ts", state.iterationCount);
    emitter_1.emitter.stepStart("edit_qa_build", state.iterationCount);
    const buildResult = await tools_2.tools.npmRun(state.sandboxPath, "build");
    if (!buildResult.includes("Command executed successfully")) {
        emitter_1.emitter.stepFailed("edit_qa_build", "Build failed", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `Vite Build failed:\n${buildResult}`,
            messages: [...state.messages, new messages_1.HumanMessage(`[Edit QA] Build failed:\n${buildResult}\n\nFix these errors with corrected <file> blocks.`)]
        };
    }
    emitter_1.emitter.stepDone("edit_qa_build", state.iterationCount);
    return { status: "success", errorLogs: null, messages: state.messages };
}
/**
 * Routing after Edit QA
 */
function routeAfterEditQA(state) {
    if (state.status === "success")
        return "end";
    if (state.iterationCount >= 3) {
        emitter_1.emitter.info("edit_qa_build", "Max iterations reached, forcing completion");
        return "end";
    }
    emitter_1.emitter.iterationStart(state.iterationCount + 1, 3);
    return "editDeveloper";
}
// Build the Edit Graph
const editWorkflow = new langgraph_1.StateGraph({
    channels: {
        sandboxPath: null,
        projectId: null,
        userRequest: null,
        messages: null,
        status: null,
        errorLogs: null,
        iterationCount: null,
    }
})
    .addNode("editDeveloper", editDeveloperNode)
    .addNode("editQa", editQaNode)
    .addEdge("editDeveloper", "editQa")
    .addConditionalEdges("editQa", routeAfterEditQA, {
    editDeveloper: "editDeveloper",
    end: langgraph_1.END
});
editWorkflow.setEntryPoint("editDeveloper");
exports.editApp = editWorkflow.compile();
