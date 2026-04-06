import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tools } from "../tools";
import { EditState } from "./state";
import { emitter } from "./emitter";
import dotenv from 'dotenv';
dotenv.config();

const openaiModel = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0
});

const claudeDevModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
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
async function editDeveloperNode(state: EditState): Promise<Partial<EditState>> {
    emitter.stepStart("edit_dev", state.iterationCount);

    // Build a file manifest so the LLM knows what exists
    const fileList = await tools.listFiles(state.sandboxPath);

    const errorContext = state.errorLogs
        ? `\n\nCRITICAL: Your previous edit caused errors that must be fixed:\n${state.errorLogs}\n`
        : "";

    const editPrompt = `You are an elite Senior Next.js App Router Developer editing an existing premium landing page.
The user wants a specific change. You must apply ONLY the minimal edits needed — do NOT rewrite the entire codebase.

CRITICAL WORKFLOW:
1. READ: Use 'read_file' to inspect the files relevant to the user's request. Read 1-3 key files max, then move to step 2.
2. PATCH: You MUST output <file path="...">full updated content</file> XML blocks for each file you modify. This is MANDATORY — analysis alone is not enough.
3. Only output files that actually change. Do NOT re-output unchanged files.

IMPORTANT: After reading files, you MUST produce <file> XML blocks with the fix. Do NOT just describe the problem — actually fix it by outputting the corrected file contents. Every response after reading should contain at least one <file> block.

RULES:
- The site follows a modern UX aesthetic. Maintain this in any new content.
- All pre-installed libraries (framer-motion, lucide-react, clsx, tailwind-merge) are available — do NOT npm install them.
- The navigation component is always "Navbar.tsx" — never "Navigation.tsx".
- You CAN modify tailwind.config.js if the fix requires adding custom colors, fonts, or theme extensions. However, do NOT change next.config.mjs or tsconfig.json unless QA errors require it.
- If components use custom Tailwind classes (e.g. text-cream-200, bg-espresso-900) that are not defined in tailwind.config.js, you MUST either: (a) add them to tailwind.config.js, or (b) replace them with standard Tailwind classes.
- Maintain the existing premium design quality (glassmorphism, animations, shadows, gradients).
- If the user asks for a new section, integrate it naturally into the existing page flow in src/app/page.tsx.
- This is a Next.js App Router project. Use Image from "next/image", Link from "next/link". Components with interactivity need "use client".
- NEVER use <a> tags inside <Link>. Use modern Next.js <Link href="...">Text</Link> syntax.

CURRENT FILE MANIFEST:
${fileList}
${errorContext}

USER'S EDIT REQUEST:
"${state.userRequest}"`;

    // Scaffold lock — relaxed for edits: tailwind.config.js is allowed (users often need theme changes)
    const protectedFiles = ["next.config.mjs", "tsconfig.json", "postcss.config.js"];
    const isProtected = (filePath: string) => protectedFiles.some(pf => filePath.endsWith(pf));
    const shouldAllowProtectedWrite = () => {
        if (!state.errorLogs) return false;
        const low = state.errorLogs.toLowerCase();
        return low.includes("next.config") || low.includes("tsconfig");
    };

    // Define tools scoped to this sandbox
    const readFileTool = tool(
        async ({ relativeFilePath }) => {
            emitter.fileActivity("edit_dev", relativeFilePath, "read");
            return await tools.readFile(state.sandboxPath, relativeFilePath);
        },
        {
            name: "read_file",
            description: "Reads the content of a file. Use this to inspect code before editing.",
            schema: z.object({ relativeFilePath: z.string() }),
        }
    );

    const listFilesTool = tool(
        async ({ relativeDirPath }) => {
            emitter.toolInvoked("edit_dev", "list_files");
            return await tools.listFiles(state.sandboxPath, relativeDirPath);
        },
        {
            name: "list_files",
            description: "Lists all files in a directory.",
            schema: z.object({ relativeDirPath: z.string().optional().describe("Optional path, defaults to '.'") }),
        }
    );

    const agentTools = [readFileTool, listFilesTool];
    const toolsByName = Object.fromEntries(agentTools.map((t) => [t.name, t]));

    const claudeWithTools = devModel.bindTools(agentTools);
    const gptWithTools = openaiModel.bindTools(agentTools);
    const modelWithTools = claudeWithTools.withFallbacks({ fallbacks: [gptWithTools] });

    let currentMessages = [...state.messages];
    if (currentMessages.length === 0) {
        currentMessages.push(new HumanMessage(`Apply the following edit to the existing codebase: "${state.userRequest}"`));
    }

    // Trim messages to prevent context overflow
    const trimMessages = (msgs: any[], max = 40) => {
        if (msgs.length <= max) return msgs;
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
        emitter.info("edit_dev", `Loop step ${steps}`);

        currentMessages = trimMessages(currentMessages, 40);

        const payload = [new SystemMessage(editPrompt), ...currentMessages];
        const response = await modelWithTools.invoke(payload);

        let didPatch = false;
        let xmlErrorMessages: HumanMessage[] = [];

        // XML artifact extraction (same engine as main graph)
        if (response.content && typeof response.content === "string" && response.content.trim().length > 0) {
            let cleanedContent = response.content;
            const fileRegex = /<file[^>]*path=["']([^"']+)["'][^>]*>\n*([\s\S]*?)\n*<\/file>/gi;
            let match;

            while ((match = fileRegex.exec(response.content)) !== null) {
                const filePath = match[1];
                const fileContent = match[2];
                emitter.fileActivity("edit_dev", filePath, "created");

                if (filePath.endsWith("Navigation.tsx")) {
                    console.log("Skipped: Navigation must be Navbar.tsx");
                    xmlErrorMessages.push(new HumanMessage(`XML Error: Navigation component MUST be named 'Navbar.tsx'.`));
                    didPatch = true;
                    continue;
                }

                if (isProtected(filePath) && !shouldAllowProtectedWrite()) {
                    console.log(`Skipped: Scaffold lock on ${filePath}`);
                    xmlErrorMessages.push(new HumanMessage(`XML Error: Modification to '${filePath}' is blocked.`));
                    didPatch = true;
                    continue;
                }

                await tools.writeFile(state.sandboxPath, filePath, fileContent);
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
                emitter.toolInvoked("edit_dev", tCall.name);
                const selectedTool = toolsByName[tCall.name];
                let toolResult = "";

                if (selectedTool) {
                    try {
                        toolResult = await (selectedTool as any).invoke(tCall.args);
                    } catch (e: any) {
                        toolResult = `Error: ${e.message}`;
                    }
                } else {
                    toolResult = `Error: Unknown tool ${tCall.name}`;
                }

                currentMessages.push(new ToolMessage({
                    content: toolResult,
                    name: tCall.name,
                    tool_call_id: tCall.id!
                }));
            }
        }

        // If no tools and no patches — LLM may have just analyzed without patching
        if (!didPatch && (!response.tool_calls || response.tool_calls.length === 0)) {
            if (patchAttempts === 0 && steps < maxSteps) {
                // The LLM described the problem but didn't output patches — nudge it
                emitter.info("edit_dev", "No patches produced, nudging LLM...");
                currentMessages.push(new HumanMessage(
                    "You analyzed the problem but did not output any <file> blocks. You MUST output the corrected files as <file path=\"...\">content</file> XML blocks now. Do NOT just describe the fix — actually produce the updated file contents."
                ));
                continue;
            }
            emitter.stepDone("edit_dev", state.iterationCount);
            break;
        }

        // Run TS verification after patches
        if (didPatch) {
            patchAttempts++;
            emitter.info("edit_dev", `Running TypeScript verification (attempt ${patchAttempts}/2)`);
            const tsResult = await tools.runTypeScript(state.sandboxPath);
            if (!tsResult.includes("Success:")) {
                emitter.info("edit_dev", "TypeScript verification failed, fixing...");
                currentMessages.push(new HumanMessage(`TypeScript check failed after your edit:\n${tsResult}\n\nPlease fix with corrected <file> blocks.`));
                if (patchAttempts >= 2) {
                    emitter.info("edit_dev", "Max patch attempts reached");
                    break;
                }
            } else {
                emitter.info("edit_dev", "TypeScript verification passed");
                emitter.stepDone("edit_dev", state.iterationCount);
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
 * Runs TypeScript + Next.js build. Skips visual QA for faster iteration.
 */
async function editQaNode(state: EditState): Promise<Partial<EditState>> {
    // Phase 1: TypeScript
    emitter.stepStart("edit_qa_ts", state.iterationCount);
    const tsResult = await tools.runTypeScript(state.sandboxPath);

    if (!tsResult.includes("Success:")) {
        emitter.stepFailed("edit_qa_ts", "TypeScript errors found", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `TypeScript check failed:\n${tsResult}`,
            messages: [...state.messages, new HumanMessage(`[Edit QA] TypeScript errors found:\n${tsResult}\n\nFix these errors with corrected <file> blocks.`)]
        };
    }

    // Phase 2: Next.js Build
    emitter.stepDone("edit_qa_ts", state.iterationCount);
    emitter.stepStart("edit_qa_build", state.iterationCount);
    const buildResult = await tools.npmRun(state.sandboxPath, "build");

    if (!buildResult.includes("Command executed successfully")) {
        emitter.stepFailed("edit_qa_build", "Build failed", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `Next.js Build failed:\n${buildResult}`,
            messages: [...state.messages, new HumanMessage(`[Edit QA] Build failed:\n${buildResult}\n\nFix these errors with corrected <file> blocks.`)]
        };
    }

    emitter.stepDone("edit_qa_build", state.iterationCount);
    return { status: "success", errorLogs: null, messages: state.messages };
}

/**
 * Routing after Edit QA
 */
function routeAfterEditQA(state: EditState) {
    if (state.status === "success") return "end";
    if (state.iterationCount >= 3) {
        emitter.info("edit_qa_build", "Max iterations reached, forcing completion");
        return "end";
    }
    emitter.iterationStart(state.iterationCount + 1, 3);
    return "editDeveloper";
}

// Build the Edit Graph
const editWorkflow = new StateGraph<EditState>({
    channels: {
        sandboxPath: null as any,
        projectId: null as any,
        userRequest: null as any,
        messages: null as any,
        status: null as any,
        errorLogs: null as any,
        iterationCount: null as any,
    }
})
    .addNode("editDeveloper", editDeveloperNode)
    .addNode("editQa", editQaNode)
    .addEdge("editDeveloper", "editQa")
    .addConditionalEdges("editQa", routeAfterEditQA, {
        editDeveloper: "editDeveloper",
        end: END
    });

editWorkflow.setEntryPoint("editDeveloper");

export const editApp = editWorkflow.compile();
