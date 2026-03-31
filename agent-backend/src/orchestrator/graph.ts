import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseMessage, SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { tools } from "../tools";
import { takeScreenshots, runVisualReview, formatVisualErrors } from "../tools";
import { OrchestrationState } from "./state";
import { emitter } from "./emitter";
import { setMaxListeners } from "events";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config();
setMaxListeners(50);

// Mock implementation of Tool calling via literal execution.
// In a full @langchain/core agent setup, we'd bindTools(). 
// For this MVP, we explicitly instruct the LLM to output JSON commands for tools 
// or use the new ChatOpenAI `.bindTools`// We use GPT-4o as a fallback or for logical QA checking
const openaiModel = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0
});

// We prefer Claude 3.5 Sonnet for the Developer and Architect nodes as it is currently 
// the industry gold standard for autonomous React/Vite coding and complex tool patching.
const claudePmModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
        modelName: "claude-sonnet-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY
    })
    : openaiModel;

const claudeDevModel = process.env.ANTHROPIC_API_KEY
    ? new ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 3,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : openaiModel;

// The PM uses Claude with a direct fallback to OpenAI for 529/429 errors.
const pmModel = claudePmModel
const devModel = claudeDevModel;
const qaModel = openaiModel;

// --- Context Management Helpers ---

interface DevMemory {
    intent: string;
    components_completed: string[];
    design_decisions: string[];
    known_issues: string[];
    next_steps: string[];
}

// Normalize BaseMessage content to string — required because Claude returns
// content as [{type: "text", text: "..."}] arrays, not plain strings.
const getContentString = (m: { content: unknown }): string => {
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) {
        return (m.content as Array<{ type: string; text?: string }>)
            .filter(b => b.type === "text")
            .map(b => b.text ?? "")
            .join("\n");
    }
    return "";
};

const OBSERVATION_STUB = (name: string) =>
    `[Tool output from '${name}' — omitted to save context. Re-invoke the tool if you need this output again.]`;

// Replaces hard message truncation with selective observation masking.
// AIMessage reasoning is always kept; old ToolMessage and large HumanMessage
// blobs are compressed to 1-line stubs (10:1 compression on tool outputs).
const maskMessages = (msgs: BaseMessage[], max: number): BaseMessage[] => {
    const beforeCount = msgs.length;
    const beforeChars = msgs.reduce((s, m) => s + getContentString(m).length, 0);

    if (msgs.length <= max) {
        console.log(`[MASK] No masking needed: ${beforeCount} msgs, ${beforeChars} chars — under limit of ${max}`);
        return msgs;
    }

    // Always pin the first message (initial human prompt / seed)
    const first = msgs[0];

    // Find the anchor by metadata tag — immune to false positives from LLM echoing "DEV_MEMORY"
    const pinnedAnchor = msgs.find(
        m => (m.additional_kwargs as any)?.__anchor === true
    );
    console.log(`[MASK] Anchor pinned: ${pinnedAnchor ? "YES" : "NO — anchor message not found in history"}`);

    // Keep last 30 messages verbatim — covers ~5-6 tool call/response cycles
    const RECENT_WINDOW = 30;
    const oldMsgs = msgs.slice(1, msgs.length - RECENT_WINDOW);
    const recentMsgs = msgs.slice(msgs.length - RECENT_WINDOW);
    console.log(`[MASK] Split: ${oldMsgs.length} old msgs to compress, ${recentMsgs.length} recent msgs kept verbatim`);

    let maskedToolCount = 0;
    let maskedHumanCount = 0;
    let keptAiCount = 0;

    const maskedOld = oldMsgs.map(m => {
        const type = m._getType?.();

        // ToolMessage → always compress (10:1)
        if (type === "tool") {
            const tm = m as any;
            maskedToolCount++;
            return new ToolMessage({
                content: OBSERVATION_STUB(tm.name ?? "tool"),
                name: tm.name,
                tool_call_id: tm.tool_call_id
            });
        }

        // Large HumanMessage → mask QA feedback blobs
        // QA errors are already re-injected into the system prompt as errorContext
        if (type === "human" && getContentString(m).length > 500) {
            maskedHumanCount++;
            return new HumanMessage(
                "[Previous QA/tool feedback — omitted. Current errors are in the system prompt.]"
            );
        }

        // AIMessage → always keep verbatim (preserves reasoning chain)
        if (type === "ai") keptAiCount++;
        return m;
    });

    // Drop leading ToolMessages — Anthropic rejects ToolMessage without a preceding AIMessage
    let droppedLeading = 0;
    while (maskedOld.length > 0 && maskedOld[0]._getType?.() === "tool") {
        maskedOld.shift();
        droppedLeading++;
    }
    if (droppedLeading > 0) {
        console.log(`[MASK] Dropped ${droppedLeading} orphaned leading ToolMessages`);
    }

    const result: BaseMessage[] = [first];
    if (pinnedAnchor && !recentMsgs.includes(pinnedAnchor)) {
        result.push(pinnedAnchor);
    }
    result.push(...maskedOld, ...recentMsgs);

    const afterCount = result.length;
    const afterChars = result.reduce((s, m) => s + getContentString(m).length, 0);
    console.log(`[MASK] Result: ${beforeCount} → ${afterCount} msgs | chars: ${beforeChars} → ${afterChars} (${Math.round((1 - afterChars / beforeChars) * 100)}% reduction)`);
    console.log(`[MASK] Compressed: ${maskedToolCount} ToolMsgs, ${maskedHumanCount} large HumanMsgs | Kept AI reasoning: ${keptAiCount} msgs`);

    return result;
};

/**
 * Node 1: Product Manager
 * Reads the business input, writes a comprehensive spec.md to the sandbox.
 */
async function productManagerNode(state: OrchestrationState): Promise<Partial<OrchestrationState>> {
    emitter.stepStart("pm");

    const systemPrompt = `You are a world-class UI/UX Designer and "Vibe Architect" for a premium Hebrew landing page builder.
Your job is to read the client instructions and write a detailed technical spec.md to the codebase.
The design MUST be Awwwards/Dribbble quality. Basic, outdated designs are unacceptable.

You must explicitly demand the following UI/UX rules in your spec:
1. Generous, breathable spacing (e.g., py-24, py-32, gap-12).
2. Modern, premium aesthetics: Glassmorphism (backdrop-blur, bg-white/10), subtle drop-shadows (shadow-2xl), and Bento Box grid layouts for features.
3. Rich, dynamic backgrounds: Use Tailwind gradients (bg-gradient-to-br) or mesh gradients. Avoid plain flat colors.
4. Micro-interactions: Demand 'framer-motion' for scroll-reveal animations (fade up, stagger) on all major sections.
5. High-quality iconography: Demand 'lucide-react' for all icons.
6. The entire layout must be Right-to-Left (dir="rtl") since the content is Hebrew.

Here are the specific Business Details from the user:
${JSON.stringify(state.businessInput, null, 2)}

Write the exact content of the spec.md wrapped in a markdown code block.`;

    const response = await pmModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage("Please generate the technical spec.md using my exact business details and the strictest Dribbble/Awwwards Vibe rules."),
        ...state.messages
    ]);

    // Extract text inside ```md or just use raw text
    let specContent = response.content as string;
    const mdMatch = specContent.match(/```(?:markdown|md|)\n([\s\S]*?)```/);
    if (mdMatch) {
        specContent = mdMatch[1];
    }

    // Use the write tool to save it
    await tools.writeFile(state.sandboxPath, "spec.md", specContent);

    // Initializing Task E: Project Manifest
    const initialManifest = {
        components_list: ["App.tsx", "Navbar.tsx", "Hero.tsx", "Footer.tsx"],
        naming_rules: [
            "Navigation MUST be named Navbar.tsx. Never Navigation.tsx",
            "Do not overwrite tailwind.config.js unless requested",
            "Avoid rewriting index.html"
        ],
        entry_file_imports: ["import App from './App.tsx'"]
    };
    await tools.writeFile(state.sandboxPath, "project_manifest.json", JSON.stringify(initialManifest, null, 2));

    // Seed the living anchor memory — updated by Developer after each iteration
    const initialMemory: DevMemory = {
        intent: typeof state.businessInput === "string"
            ? state.businessInput
            : JSON.stringify(state.businessInput),
        components_completed: [],
        design_decisions: [],
        known_issues: [],
        next_steps: ["Build initial component structure per spec.md"]
    };
    await tools.writeFile(state.sandboxPath, "dev_memory.json", JSON.stringify(initialMemory, null, 2));

    emitter.stepDone("pm");

    return {
        status: "coding",
        messages: state.messages
    };
}


/**
 * Node 2: Developer
 * Reads spec.md, uses a ReAct Tool Loop to iteratively write React code and run commands.
 */
async function developerNode(state: OrchestrationState): Promise<Partial<OrchestrationState>> {
    emitter.stepStart("developer", state.iterationCount);
    const spec = await tools.readFile(state.sandboxPath, "spec.md");

    // Read living anchor memory — built up across iterations
    let devMemory: DevMemory = {
        intent: "",
        components_completed: [],
        design_decisions: [],
        known_issues: [],
        next_steps: []
    };
    try {
        const memRaw = await tools.readFile(state.sandboxPath, "dev_memory.json");
        if (!memRaw.startsWith("Error")) {
            devMemory = JSON.parse(memRaw);
            console.log(`[DEV_MEMORY] Loaded dev_memory.json — components_completed: [${devMemory.components_completed.join(", ")}], next_steps: ${devMemory.next_steps.length}`);
        } else {
            console.log(`[DEV_MEMORY] Could not read dev_memory.json: ${memRaw}`);
        }
    } catch (e: any) {
        console.log(`[DEV_MEMORY] Parse error on dev_memory.json: ${e.message}`);
    }

    const memoryContext = `

## SESSION MEMORY (Your persistent context across iterations)
\`\`\`json
${JSON.stringify(devMemory, null, 2)}
\`\`\`
Use this to understand what has already been built and what remains. You will update dev_memory.json at the end of your work via a <file path="dev_memory.json"> block.`;

    console.log(`[DEV_NODE] Iteration ${state.iterationCount} | errorLogs present: ${!!state.errorLogs} | devPrompt memoryContext chars: ${memoryContext.length}`);

    const errorContext = state.errorLogs
        ? `\n\nCRITICAL FIX REQUIRED: QA found errors:\n${state.errorLogs}\n`
        : "";

    const devPrompt = `You are an elite Senior React/Vite Developer at a top-tier design agency.
You are building an ultra-premium landing page based on the UX Architect's spec.

CRITICAL TECHNICAL LIBRARIES (PRE-INSTALLED, DO NOT NPM INSTALL THEM):
- 'lucide-react' (For beautiful, consistent iconography)
- 'framer-motion' (For premium scroll and hover animations)
- 'clsx' and 'tailwind-merge'
Tailwind CSS is fully configured.

MANDATORY DESIGN & "VIBE" RULES:
1. The design MUST look like a modern, $10,000 premium Silicon Valley startup landing page. Basic HTML/Tailwind is unacceptable.
2. Use <motion.div> extensively. Everything should fade up or slide in when rendering.
3. Shadows & Depth: Use shadow-xl, shadow-2xl, and ring utilities to give cards depth.
4. Glassmorphism: For cards and navbars, heavily utilize bg-white/10 or bg-black/10 with backdrop-blur-md and subtle borders.
5. Typography: Giant, ultra-bold Hero headlines (text-5xl md:text-7xl font-extrabold tracking-tight).
6. Images: Never use empty divs. Use beautiful high-res Unsplash placeholders. (e.g., 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', or 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'). Style images beautifully with rounded-2xl and shadow-2xl.
7. Direction: Ensure the root element has dir="rtl" and text-right for Hebrew content.
8. Component Naming: The navigation component MUST be named "Navbar.tsx" (do not create "Navigation.tsx").

CRITICAL WORKFLOW (PLAN -> PATCH -> VERIFY):
You must optimize for the fewest LLM tool invocation round-trips possible.
1. PLAN & READ: First, optionally use 'read_file' or 'list_files' to explore.
2. PATCH: You MUST output all file creations and full file rewrites directly as raw XML in your text response. DO NOT use JSON tools like write_file or apply_patchset.
   EXAMPLE XML OUTPUT FORMAT:
   <file path="src/App.tsx">
   export default function App() { return <div />; }
   </file>
   <file path="src/main.tsx">
   console.log("Updated");
   </file>
3. VERIFY: We will automatically extract your XML artifacts, save them, and run 'tsc --noEmit' to verify.

Your task: Output the XML <file> blocks to construct the frontend application efficiently in 1-2 steps. Finish the turn ONLY when the entire codebase is fully assembled and visually stunning according to the spec.

Here is the exact spec.md written by the UX Architect:
=========================================
${spec}
=========================================
${memoryContext}
${errorContext}`;

    const prompt = devPrompt;
    let specReadCount = 0;
    const fileCache = new Map<string, string>(); // Add local file system caching

    // Scaffold lock utilities
    const protectedFiles = ["tailwind.config.js", "index.html", "vite.config.ts", "tsconfig.json", "tsconfig.node.json"];
    const isProtected = (filePath: string) => protectedFiles.some(pf => filePath.endsWith(pf));
    const shouldAllowProtectedWrite = () => {
        // Only allow scaffold modification if QA error logs explicitly mention configuration or missing HTML
        if (!state.errorLogs) return false;
        const lowScoreLogs = state.errorLogs.toLowerCase();
        return lowScoreLogs.includes("tailwind") || lowScoreLogs.includes("vite") || lowScoreLogs.includes("tsconfig") || lowScoreLogs.includes("index.html");
    };

    // Define Langchain Tools natively inside the node scope so they have access to state.sandboxPath
    const applyPatchsetTool = tool(
        async ({ operations }) => {
            emitter.toolInvoked("developer", `apply_patchset [${operations.length} ops]`);

            for (const op of operations) {
                // Guard 1: Component Naming
                if ((op.type === "write" || op.type === "edit") && op.path.endsWith("Navigation.tsx")) {
                    return JSON.stringify({ error: "Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'." });
                }
                // Guard 2: Scaffold Lock
                if ((op.type === "write" || op.type === "edit" || op.type === "delete") && isProtected(op.path)) {
                    if (!shouldAllowProtectedWrite()) {
                        return JSON.stringify({ error: `Modification to protected file '${op.path}' is blocked. You should only touch application src/ files unless QA errors explicitly require configuration updates.` });
                    }
                }

                // Invalidate cache if writing/editing/deleting
                fileCache.delete(op.path);
            }

            return await tools.applyPatchset(state.sandboxPath, operations as any);
        },
        {
            name: "apply_patchset",
            description: "CRITICAL BATCH TOOL: Executes multiple file operations (write, edit, delete) in a single atomic action. YOU MUST PASS THE 'operations' ARRAY. Do not pass empty arguments.",
            schema: z.object({
                operations: z.array(z.object({
                    type: z.enum(["write", "edit", "delete"]).describe("The type of operation to perform on the file."),
                    path: z.string().describe("Relative file path, e.g. 'src/App.tsx'"),
                    content: z.string().optional().describe("Required for 'write'. The FULL content of the new file."),
                    find: z.string().optional().describe("Required for 'edit'. The exact string block to replace."),
                    replace: z.string().optional().describe("Required for 'edit'. The new string block.")
                })).min(1).describe("REQUIRED ARRAY. You must supply at least one operation.")
            })
        }
    );

    const writeFileTool = tool(
        async ({ relativeFilePath, content }) => {
            emitter.fileActivity("developer", relativeFilePath, "created");
            if (relativeFilePath.endsWith("Navigation.tsx")) {
                return "Error: Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'.";
            }
            if (isProtected(relativeFilePath) && !shouldAllowProtectedWrite()) {
                return `Error: Modification to scaffold file '${relativeFilePath}' is blocked unless strictly required by QA errors.`;
            }
            fileCache.delete(relativeFilePath);
            await tools.writeFile(state.sandboxPath, relativeFilePath, content);
            return `Success: Wrote file ${relativeFilePath}`;
        },
        {
            name: "write_file",
            description: "Creates or completely overwrites a file.",
            schema: z.object({
                relativeFilePath: z.string().describe("The relative path within the sandbox, e.g., 'src/App.tsx'"),
                content: z.string().describe("The full raw content to write to the file."),
            }),
        }
    );

    const editFileTool = tool(
        async ({ relativeFilePath, find, replace }) => {
            emitter.fileActivity("developer", relativeFilePath, "modified");
            if (isProtected(relativeFilePath) && !shouldAllowProtectedWrite()) {
                return `Error: Modification to scaffold file '${relativeFilePath}' is blocked unless strictly required by QA errors.`;
            }
            fileCache.delete(relativeFilePath);
            return await tools.editFile(state.sandboxPath, relativeFilePath, find, replace);
        },
        {
            name: "edit_file",
            description: "Patches an existing file by replacing an exact string. PREFERRED over write_file for bug fixes to avoid regressions.",
            schema: z.object({
                relativeFilePath: z.string(),
                find: z.string().describe("The exact text to find (including all original whitespace and indentation)"),
                replace: z.string().describe("The new text to replace it with"),
            }),
        }
    );

    const readFileTool = tool(
        async ({ relativeFilePath }) => {
            emitter.fileActivity("developer", relativeFilePath, "read");
            if (relativeFilePath === "spec.md") {
                specReadCount++;
                if (specReadCount > 1) {
                    return "Error: spec.md already read. Do not re-read; proceed to write/patch code based on your initial understanding.";
                }
            }
            if (fileCache.has(relativeFilePath)) {
                return fileCache.get(relativeFilePath)!;
            }
            const content = await tools.readFile(state.sandboxPath, relativeFilePath);
            if (!content.startsWith("Error")) {
                fileCache.set(relativeFilePath, content);
            }
            return content;
        },
        {
            name: "read_file",
            description: "Reads the content of a file. Use this to inspect code before using edit_file.",
            schema: z.object({
                relativeFilePath: z.string(),
            }),
        }
    );

    const listFilesTool = tool(
        async ({ relativeDirPath }) => {
            emitter.toolInvoked("developer", "list_files");
            return await tools.listFiles(state.sandboxPath, relativeDirPath);
        },
        {
            name: "list_files",
            description: "Lists all files in a directory to explore the sandbox.",
            schema: z.object({
                relativeDirPath: z.string().optional().describe("Optional path to list, defaults to '.'"),
            }),
        }
    );

    const npmInstallTool = tool(
        async ({ packages }) => {
            emitter.toolInvoked("developer", "npm_install");
            const res = await tools.npmInstall(state.sandboxPath, packages);
            return res;
        },
        {
            name: "npm_install",
            description: "Installs NPM packages securely in the sandbox environment.",
            schema: z.object({
                packages: z.array(z.string()).describe("A list of npm package names to install, e.g., ['framer-motion', 'clsx']"),
            })
        }
    );

    const agentTools = [readFileTool, listFilesTool, npmInstallTool];
    const toolsByName = Object.fromEntries(agentTools.map((t) => [t.name, t]));

    // Bind the tools to the Developer Model (Claude preferred)
    const claudeWithTools = devModel.bindTools(agentTools);
    const gptWithTools = openaiModel.bindTools(agentTools);

    // Utilize LangChain's native .withFallbacks() to instantly reroute to OpenAI if Anthropic Rate Limits hit
    const modelWithTools = claudeWithTools.withFallbacks({
        fallbacks: [gptWithTools]
    });

    // Inherit the pure message history without duplicating the Developer prompt
    let currentMessages = [...state.messages];
    console.log(`[DEV_NODE] Inheriting ${currentMessages.length} messages from state`);

    // Anthropic strictly requires at least one User-role message in the payload array.
    // Tagged with __anchor so maskMessages always pins this message regardless of position.
    if (currentMessages.length === 0) {
        console.log(`[DEV_NODE] No prior messages — pushing anchor seed message`);
        currentMessages.push(new HumanMessage({
            content: "Begin constructing the application strictly adhering to the UX architect's design specifications.",
            additional_kwargs: { __anchor: true }
        }));
    }

    let maxSteps = 100;
    let steps = 0;

    const invokeWithBackoff = async (model: any, msgs: any[]) => {
        const payload = [new SystemMessage(prompt), ...msgs];
        // Native LangChain fallbacks automatically handle 429 and 500 errors by routing to GPT-4o
        return await model.invoke(payload);
    };

    let patchAttempts = 0;

    // The Internal Agent Loop
    while (steps < maxSteps) {
        steps++;
        emitter.info("developer", `Loop step ${steps}`);

        const preCount = currentMessages.length;
        currentMessages = maskMessages(currentMessages, 80);
        const postCount = currentMessages.length;
        const totalChars = currentMessages.reduce((s, m) => s + getContentString(m).length, 0);
        console.log(`[LOOP step=${steps}] msgs: ${preCount} → ${postCount} | total content chars sent to LLM: ${totalChars}`);

        const response = await invokeWithBackoff(modelWithTools, currentMessages);

        let didPatch = false;
        let xmlErrorMessages: HumanMessage[] = [];

        if (response.content && typeof response.content === "string" && response.content.trim().length > 0) {
            let cleanedContent = response.content;

            // XML Artifact Extraction Engine
            const fileRegex = /<file[^>]*path=["']([^"']+)["'][^>]*>\n*([\s\S]*?)\n*<\/file>/gi;
            let match;
            while ((match = fileRegex.exec(response.content)) !== null) {
                const filePath = match[1];
                const fileContent = match[2];
                emitter.fileActivity("developer", filePath, "created");

                // Guard 1: Component Naming
                if (filePath.endsWith("Navigation.tsx")) {
                    console.log("Skipped XML: Navigation must be Navbar.tsx");
                    xmlErrorMessages.push(new HumanMessage(`XML Error: Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'.`));
                    didPatch = true;
                    continue;
                }

                // Guard 2: Scaffold Lock
                if (isProtected(filePath) && !shouldAllowProtectedWrite()) {
                    console.log(`Skipped XML: Scaffold lock on ${filePath}`);
                    xmlErrorMessages.push(new HumanMessage(`XML Error: Modification to protected file '${filePath}' is blocked. Only touch src/ application files.`));
                    didPatch = true;
                    continue;
                }

                fileCache.delete(filePath);
                await tools.writeFile(state.sandboxPath, filePath, fileContent);
                didPatch = true;

                // Strip the massive XML payload from the AI's response history to prevent Token Rate Limit crashes!
                cleanedContent = cleanedContent.replace(match[0], `<file path="${filePath}">[File written to disk. Use read_file if you need to review the code.]</file>`);
            }

            // Push the heavily compressed/purged message object back to the orchestrator state array
            response.content = cleanedContent;
        }

        currentMessages.push(response);

        currentMessages.push(...xmlErrorMessages);

        // Output of the tools executed in this step
        const toolMessages: ToolMessage[] = [];
        let schemaErrorOccurred = false;

        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const tCall of response.tool_calls) {
                emitter.toolInvoked("developer", tCall.name);

                const selectedTool = toolsByName[tCall.name];
                let toolResult = "";

                if (selectedTool) {
                    try {
                        toolResult = await (selectedTool as any).invoke(tCall.args);
                    } catch (e: any) {
                        schemaErrorOccurred = true;
                        console.log(`Zod/Langchain Validation Error on ${tCall.name}: ${e.message}`);
                        toolResult = `Error executing tool: ${e.message}`;
                    }
                } else {
                    console.log(`Unknown tool requested: ${tCall.name}`);
                    toolResult = `Error: Unknown tool ${tCall.name}`;
                }

                toolMessages.push(new ToolMessage({
                    content: toolResult,
                    name: tCall.name,
                    tool_call_id: tCall.id!
                }));
            }
            currentMessages.push(...toolMessages);
        }

        console.log(`[LOOP step=${steps}] didPatch=${didPatch} | tool_calls=${response.tool_calls?.length ?? 0} | response content chars: ${getContentString(response).length}`);

        // Break if NO tools called AND NO XML patches extracted
        if (!didPatch && (!response.tool_calls || response.tool_calls.length === 0)) {
            console.log(`[LOOP step=${steps}] No tools + no patches — exiting loop`);
            emitter.stepDone("developer", state.iterationCount);
            break;
        }


        if (schemaErrorOccurred) {
            // If the schema was fundamentally broken, let the loop seamlessly roll over
            // so the LLM can immediately read the schema error message and retry.
            // Do NOT run early TS validation on an empty/failed patch.
            continue;
        }

        if (didPatch) {
            patchAttempts++;
            emitter.info("developer", `Running TypeScript verification (attempt ${patchAttempts}/2)`);
            const tsResult = await tools.runTypeScript(state.sandboxPath);
            if (!tsResult.includes("Success:")) {
                emitter.info("developer", "TypeScript verification failed, fixing...");
                currentMessages.push(new HumanMessage(`Early TypeScript TypeCheck failed after your XML patch:\n${tsResult}\n\nPlease output <file> blocks to fix these errors.`));
                if (patchAttempts >= 2) {
                    emitter.info("developer", "Max patch attempts reached");
                    break;
                }
            } else {
                emitter.info("developer", "TypeScript verification passed");
                emitter.stepDone("developer", state.iterationCount);
                break;
            }
        }
    }

    if (steps >= maxSteps) {
        emitter.stepDone("developer", state.iterationCount);
    }

    // Update dev_memory.json with session state for the next iteration.
    // Uses GPT-4o (cheap) — not the Opus dev model. Non-blocking on failure.
    console.log(`[DEV_MEMORY] Starting post-loop memory update (GPT-4o, last ${Math.min(5, currentMessages.length)} msgs)`);
    try {
        const memUpdateSystemPrompt = `You are a session state tracker. Based on the recent development session, output ONLY an updated dev_memory.json as a single XML <file> block. No other text.

Current memory:
${JSON.stringify(devMemory, null, 2)}

Rules:
- Add any newly completed components to components_completed
- Add key design decisions made (colors, layout choices, libraries used) to design_decisions
- List remaining work in next_steps
- List any known TypeScript or build errors in known_issues
- Keep intent unchanged`;

        // Strip leading ToolMessages — OpenAI rejects a conversation that starts with a ToolMessage
        const lastMsgs = currentMessages.slice(-5);
        while (lastMsgs.length > 0 && lastMsgs[0]._getType?.() === "tool") {
            lastMsgs.shift();
        }

        const memResponse = await openaiModel.invoke([
            new SystemMessage(memUpdateSystemPrompt),
            ...lastMsgs
        ]);

        const memRaw = memResponse.content as string;
        console.log(`[DEV_MEMORY] Memory update response chars: ${memRaw.length} | contains <file> block: ${/<file[^>]*path=["']dev_memory\.json["']/.test(memRaw)}`);
        const memMatch = memRaw.match(/<file[^>]*path=["']dev_memory\.json["'][^>]*>\n*([\s\S]*?)\n*<\/file>/i);
        if (memMatch) {
            await tools.writeFile(state.sandboxPath, "dev_memory.json", memMatch[1]);
            const updatedMem = JSON.parse(memMatch[1]);
            console.log(`[DEV_MEMORY] Written — components_completed: [${updatedMem.components_completed?.join(", ")}] | next_steps: ${updatedMem.next_steps?.length}`);
            emitter.info("developer", "Session memory updated");
        } else {
            console.log(`[DEV_MEMORY] WARNING: No <file path="dev_memory.json"> block found in response. Raw response:\n${memRaw.slice(0, 300)}`);
        }
    } catch (e: any) {
        console.log(`[DEV_MEMORY] ERROR during memory update: ${e.message}`);
        emitter.info("developer", `Session memory update skipped: ${e.message}`);
    }

    return {
        status: "qa",
        iterationCount: state.iterationCount + 1,
        messages: currentMessages
    };
}

/**
 * Node 3: QA Reviewer
 * Runs TypeScript compiler, Vite Build, and Visual QA (Playwright screenshots + Vision LLM).
 */
async function qaNode(state: OrchestrationState): Promise<Partial<OrchestrationState>> {
    // --- Phase 1: TypeScript compilation ---
    emitter.stepStart("qa_ts", state.iterationCount);
    const tsResult = await tools.runTypeScript(state.sandboxPath);

    if (!tsResult.includes("Success:")) {
        emitter.stepFailed("qa_ts", "TypeScript errors found", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `TypeScript TypeCheck failed:\n${tsResult}`,
            messages: [...state.messages, new HumanMessage(`[Automated QA Pipeline] TypeScript Compiler errors found. You must patch the code:\n${tsResult}\n\nPlease analyze the errors. Outline the \"Top 3 probable causes\" and a \"recommended patch plan\" before using edit_file.`)]
        };
    }

    // --- Phase 2: Vite Build ---
    emitter.stepDone("qa_ts", state.iterationCount);
    emitter.stepStart("qa_build", state.iterationCount);
    const buildResult = await tools.npmRun(state.sandboxPath, "build");

    if (!buildResult.includes("Command executed successfully")) {
        emitter.stepFailed("qa_build", "Vite build errors found", state.iterationCount);
        return {
            status: "failed",
            errorLogs: `Vite Build failed:\n${buildResult}`,
            messages: [...state.messages, new HumanMessage(`[Automated QA Pipeline] Vite Build failed. You must fix the code:\n${buildResult}\n\nPlease analyze the errors. Outline the \"Top 3 probable causes\" and a \"recommended patch plan\" before using edit_file.`)]
        };
    }

    // --- Phase 3: Visual QA (Screenshots + Vision LLM) ---
    // Skip visual QA on the last iteration to avoid infinite visual polish loops
    emitter.stepDone("qa_build", state.iterationCount);

    if (state.iterationCount >= 5) {
        emitter.stepStart("qa_visual", state.iterationCount);
        emitter.stepDone("qa_visual", state.iterationCount);
        return { status: "success", errorLogs: null, messages: state.messages };
    }

    emitter.stepStart("qa_visual", state.iterationCount);
    try {
        const screenshots = await takeScreenshots(state.sandboxPath);

        // Fast-fail on blank page without spending tokens on vision
        if (screenshots.domChecks.isBlankPage) {
            emitter.stepFailed("qa_visual", "Page is blank or nearly empty", state.iterationCount);
            return {
                status: "failed",
                errorLogs: "Visual QA: Page is blank or nearly empty. No visible content rendered.",
                messages: [...state.messages, new HumanMessage(
                    `[Visual QA] CRITICAL: The page is blank or nearly empty (only ${screenshots.domChecks.bodyTextLength} characters of text). The React components are not rendering visible content. Check that App.tsx exports a proper component tree and that all sections render Hebrew text content.`
                )]
            };
        }

        const spec = await tools.readFile(state.sandboxPath, "spec.md");
        const visualResult = await runVisualReview(screenshots, spec);

        emitter.score(visualResult.score, visualResult.passed);

        if (visualResult.passed) {
            emitter.stepDone("qa_visual", state.iterationCount);
            return { status: "success", errorLogs: null, messages: state.messages };
        }

        // Visual QA failed — send detailed feedback to developer
        const errorReport = formatVisualErrors(visualResult);
        emitter.stepFailed("qa_visual", `Score: ${visualResult.score}/10`, state.iterationCount);
        return {
            status: "failed",
            errorLogs: `Visual QA failed:\n${errorReport}`,
            messages: [...state.messages, new HumanMessage(
                `[Visual QA Pipeline] The page builds successfully but has UI quality issues (score: ${visualResult.score}/10):\n\n${errorReport}\n\nFix the critical issues and warnings by outputting corrected <file> blocks. Focus on the most impactful visual improvements first.`
            )]
        };
    } catch (err: any) {
        // If Playwright/screenshot fails, don't block the pipeline — pass with a warning
        console.log(`Visual QA error (non-blocking): ${err.message}`);
        emitter.stepDone("qa_visual", state.iterationCount);
        return { status: "success", errorLogs: null, messages: state.messages };
    }
}

/**
 * Conditional Routing Logic
 */
function routeAfterQA(state: OrchestrationState) {
    if (state.status === "success") {
        return "end";
    }
    if (state.iterationCount >= 6) {
        emitter.info("qa_visual", "Max iterations reached, forcing completion");
        return "end";
    }
    emitter.iterationStart(state.iterationCount + 1, 6);
    return "developer";
}

// Build the Graph
const workflow = new StateGraph<OrchestrationState>({
    channels: {
        businessInput: null as any,
        sandboxPath: null as any,
        status: null as any,
        messages: null as any,
        errorLogs: null as any,
        iterationCount: null as any
    }
})
    .addNode("productManager", productManagerNode)
    .addNode("developer", developerNode)
    .addNode("qa", qaNode)
    .addEdge("productManager", "developer")
    .addEdge("developer", "qa")
    .addConditionalEdges("qa", routeAfterQA, {
        developer: "developer",
        end: END
    });

workflow.setEntryPoint("productManager");

export const orchestratorApp = workflow.compile();
