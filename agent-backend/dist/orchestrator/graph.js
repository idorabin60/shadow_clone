"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestratorApp = void 0;
const langgraph_1 = require("@langchain/langgraph");
const openai_1 = require("@langchain/openai");
const anthropic_1 = require("@langchain/anthropic");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("../tools");
const dotenv_1 = __importDefault(require("dotenv"));
const events_1 = require("events");
dotenv_1.default.config();
(0, events_1.setMaxListeners)(50);
// Mock implementation of Tool calling via literal execution.
// In a full @langchain/core agent setup, we'd bindTools(). 
// For this MVP, we explicitly instruct the LLM to output JSON commands for tools 
// or use the new ChatOpenAI `.bindTools`// We use GPT-4o as a fallback or for logical QA checking
const openaiModel = new openai_1.ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0
});
// We prefer Claude 3.5 Sonnet for the Developer and Architect nodes as it is currently 
// the industry gold standard for autonomous React/Vite coding and complex tool patching.
const claudePmModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 0,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY
    })
    : openaiModel;
const claudeDevModel = process.env.ANTHROPIC_API_KEY
    ? new anthropic_1.ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 0,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    })
    : openaiModel;
// The PM and Developer use Claude (if available), QA uses GPT-4o
const pmModel = claudePmModel;
const devModel = claudeDevModel;
const qaModel = openaiModel;
/**
 * Node 1: Product Manager
 * Reads the business input, writes a comprehensive spec.md to the sandbox.
 */
async function productManagerNode(state) {
    console.log("👔 [Product Manager] Analyzing requirements and writing spec...");
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
    console.log(`[Model] Product Manager using: ${process.env.ANTHROPIC_API_KEY ? "Anthropic claude-sonnet-4-6" : "OpenAI (GPT-4o)"}`);
    const response = await pmModel.invoke([
        new messages_1.SystemMessage(systemPrompt),
        new messages_1.HumanMessage("Please generate the technical spec.md using my exact business details and the strictest Dribbble/Awwwards Vibe rules."),
        ...state.messages
    ]);
    // Extract text inside ```md or just use raw text
    let specContent = response.content;
    const mdMatch = specContent.match(/```(?:markdown|md|)\n([\s\S]*?)```/);
    if (mdMatch) {
        specContent = mdMatch[1];
    }
    // Use the write tool to save it
    await tools_1.tools.writeFile(state.sandboxPath, "spec.md", specContent);
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
    await tools_1.tools.writeFile(state.sandboxPath, "project_manifest.json", JSON.stringify(initialManifest, null, 2));
    return {
        status: "coding",
        messages: state.messages
    };
}
const tools_2 = require("@langchain/core/tools");
const zod_1 = require("zod");
/**
 * Node 2: Developer
 * Reads spec.md, uses a ReAct Tool Loop to iteratively write React code and run commands.
 */
async function developerNode(state) {
    console.log(`👨‍💻 [Developer] Starting Coding Session... (Overall QA Iteration ${state.iterationCount})`);
    // we use this spec?
    const spec = await tools_1.tools.readFile(state.sandboxPath, "spec.md");
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

${errorContext}

Your task: Output the XML <file> blocks to construct the frontend application efficiently in 1-2 steps. Finish the turn ONLY when the entire codebase is fully assembled and visually stunning according to the spec.`;
    const prompt = devPrompt;
    let specReadCount = 0;
    const fileCache = new Map(); // Add local file system caching
    // Scaffold lock utilities
    const protectedFiles = ["tailwind.config.js", "index.html", "vite.config.ts", "tsconfig.json", "tsconfig.node.json"];
    const isProtected = (filePath) => protectedFiles.some(pf => filePath.endsWith(pf));
    const shouldAllowProtectedWrite = () => {
        // Only allow scaffold modification if QA error logs explicitly mention configuration or missing HTML
        if (!state.errorLogs)
            return false;
        const lowScoreLogs = state.errorLogs.toLowerCase();
        return lowScoreLogs.includes("tailwind") || lowScoreLogs.includes("vite") || lowScoreLogs.includes("tsconfig") || lowScoreLogs.includes("index.html");
    };
    // Define Langchain Tools natively inside the node scope so they have access to state.sandboxPath
    const applyPatchsetTool = (0, tools_2.tool)(async ({ operations }) => {
        console.log(`   └─ 🛠️ Tool Invoked: apply_patchset [${operations.length} operations]`);
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
        return await tools_1.tools.applyPatchset(state.sandboxPath, operations);
    }, {
        name: "apply_patchset",
        description: "CRITICAL BATCH TOOL: Executes multiple file operations (write, edit, delete) in a single atomic action. YOU MUST PASS THE 'operations' ARRAY. Do not pass empty arguments.",
        schema: zod_1.z.object({
            operations: zod_1.z.array(zod_1.z.object({
                type: zod_1.z.enum(["write", "edit", "delete"]).describe("The type of operation to perform on the file."),
                path: zod_1.z.string().describe("Relative file path, e.g. 'src/App.tsx'"),
                content: zod_1.z.string().optional().describe("Required for 'write'. The FULL content of the new file."),
                find: zod_1.z.string().optional().describe("Required for 'edit'. The exact string block to replace."),
                replace: zod_1.z.string().optional().describe("Required for 'edit'. The new string block.")
            })).min(1).describe("REQUIRED ARRAY. You must supply at least one operation.")
        })
    });
    const writeFileTool = (0, tools_2.tool)(async ({ relativeFilePath, content }) => {
        console.log(`   └─ ⚠️ [DEPRECATED] 🛠️ Tool Invoked: write_file (${relativeFilePath}) - Suggest XML <file>`);
        if (relativeFilePath.endsWith("Navigation.tsx")) {
            return "Error: Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'.";
        }
        if (isProtected(relativeFilePath) && !shouldAllowProtectedWrite()) {
            return `Error: Modification to scaffold file '${relativeFilePath}' is blocked unless strictly required by QA errors.`;
        }
        fileCache.delete(relativeFilePath);
        await tools_1.tools.writeFile(state.sandboxPath, relativeFilePath, content);
        return `Success: Wrote file ${relativeFilePath}`;
    }, {
        name: "write_file",
        description: "Creates or completely overwrites a file.",
        schema: zod_1.z.object({
            relativeFilePath: zod_1.z.string().describe("The relative path within the sandbox, e.g., 'src/App.tsx'"),
            content: zod_1.z.string().describe("The full raw content to write to the file."),
        }),
    });
    const editFileTool = (0, tools_2.tool)(async ({ relativeFilePath, find, replace }) => {
        console.log(`   └─ ⚠️ [DEPRECATED] 🛠️ Tool Invoked: edit_file (${relativeFilePath}) - Suggest XML <file> rewrite`);
        if (isProtected(relativeFilePath) && !shouldAllowProtectedWrite()) {
            return `Error: Modification to scaffold file '${relativeFilePath}' is blocked unless strictly required by QA errors.`;
        }
        fileCache.delete(relativeFilePath);
        return await tools_1.tools.editFile(state.sandboxPath, relativeFilePath, find, replace);
    }, {
        name: "edit_file",
        description: "Patches an existing file by replacing an exact string. PREFERRED over write_file for bug fixes to avoid regressions.",
        schema: zod_1.z.object({
            relativeFilePath: zod_1.z.string(),
            find: zod_1.z.string().describe("The exact text to find (including all original whitespace and indentation)"),
            replace: zod_1.z.string().describe("The new text to replace it with"),
        }),
    });
    const readFileTool = (0, tools_2.tool)(async ({ relativeFilePath }) => {
        console.log(`   └─ 🛠️ Tool Invoked: read_file (${relativeFilePath})`);
        if (relativeFilePath === "spec.md") {
            specReadCount++;
            if (specReadCount > 1) {
                return "Error: spec.md already read. Do not re-read; proceed to write/patch code based on your initial understanding.";
            }
        }
        if (fileCache.has(relativeFilePath)) {
            return fileCache.get(relativeFilePath);
        }
        const content = await tools_1.tools.readFile(state.sandboxPath, relativeFilePath);
        if (!content.startsWith("Error")) {
            fileCache.set(relativeFilePath, content);
        }
        return content;
    }, {
        name: "read_file",
        description: "Reads the content of a file. Use this to inspect code before using edit_file.",
        schema: zod_1.z.object({
            relativeFilePath: zod_1.z.string(),
        }),
    });
    const listFilesTool = (0, tools_2.tool)(async ({ relativeDirPath }) => {
        console.log(`   └─ 🛠️ Tool Invoked: list_files (${relativeDirPath || '.'})`);
        return await tools_1.tools.listFiles(state.sandboxPath, relativeDirPath);
    }, {
        name: "list_files",
        description: "Lists all files in a directory to explore the sandbox.",
        schema: zod_1.z.object({
            relativeDirPath: zod_1.z.string().optional().describe("Optional path to list, defaults to '.'"),
        }),
    });
    const npmInstallTool = (0, tools_2.tool)(async ({ packages }) => {
        console.log(`   └─ 🛠️ Tool Invoked: npm_install (${packages.join(', ')})`);
        const res = await tools_1.tools.npmInstall(state.sandboxPath, packages);
        return res;
    }, {
        name: "npm_install",
        description: "Installs NPM packages securely in the sandbox environment.",
        schema: zod_1.z.object({
            packages: zod_1.z.array(zod_1.z.string()).describe("A list of npm package names to install, e.g., ['framer-motion', 'clsx']"),
        })
    });
    const agentTools = [readFileTool, listFilesTool, npmInstallTool];
    const toolsByName = Object.fromEntries(agentTools.map((t) => [t.name, t]));
    // Bind the tools to the Developer Model (Claude preferred)
    const modelWithTools = devModel.bindTools(agentTools);
    // Inherit the pure message history without duplicating the Developer prompt
    let currentMessages = [...state.messages];
    // Anthropic strictly requires at least one User-role message in the payload array.
    if (currentMessages.length === 0) {
        currentMessages.push(new messages_1.HumanMessage("Begin constructing the application strictly adhering to the UX architect's design specifications."));
    }
    let maxSteps = 100;
    let steps = 0;
    console.log(`[Model] Developer using: Anthropic (Claude 4.6 Opus) / GPT-4o proxy context`);
    const trimMessages = (msgs, max = 30) => {
        if (msgs.length <= max)
            return msgs;
        // Keep the first message (prompt constraint)
        const first = msgs[0];
        // Find if there is a 'project_manifest.json' or 'DEV_MEMORY' payload to pin
        const pinnedState = msgs.find(m => m.content && typeof m.content === "string" && (m.content.includes("DEV_MEMORY") || m.content.includes("project_manifest.json")));
        let trimmed = msgs.slice(-(max - 1));
        while (trimmed.length > 0 && trimmed[0]?._getType?.() === "tool") {
            trimmed.shift();
        }
        const res = [first];
        if (pinnedState && !trimmed.includes(pinnedState)) {
            res.push(pinnedState);
        }
        res.push(...trimmed);
        return res;
    };
    let forceFallback = false;
    const invokeWithBackoff = async (model, msgs) => {
        const payload = [new messages_1.SystemMessage(prompt), ...msgs];
        try {
            // If fallback was triggered in a previous loop step, reroute entirely
            if (forceFallback) {
                return await openaiModel.invoke(payload);
            }
            return await model.invoke(payload);
        }
        catch (e) {
            const is429 = e?.status === 429 || e?.message?.includes("429") || e?.message?.includes("rate_limit");
            let retryAfter = Number(e?.headers?.get?.("retry-after")) || 4;
            if (is429) {
                console.log(`   └─ ⚠️ Rate Limit hit. Backing off for ${retryAfter} seconds...`);
                await new Promise(r => setTimeout(r, retryAfter * 1000));
                try {
                    return await model.invoke(payload);
                }
                catch (retryError) {
                    const isSecond429 = retryError?.status === 429 || retryError?.message?.includes("429");
                    if (isSecond429) {
                        console.log(`   └─ 🚨 Second Rate Limit hit. Falling back to OpenAI (gpt-4o) to guarantee progress...`);
                        forceFallback = true;
                        return await openaiModel.invoke(payload);
                    }
                    throw retryError;
                }
            }
            throw e;
        }
    };
    let patchAttempts = 0;
    // The Internal Agent Loop
    while (steps < maxSteps) {
        steps++;
        console.log(`   └─ Developer Loop Step ${steps}...`);
        currentMessages = trimMessages(currentMessages, 80);
        console.log(`   └─ ⌛ Model is thinking/generating code (this may take 30-60s for full patches)...`);
        const response = await invokeWithBackoff(modelWithTools, currentMessages);
        currentMessages.push(response);
        let didPatch = false;
        let xmlErrorMessages = [];
        if (response.content && typeof response.content === "string" && response.content.trim().length > 0) {
            console.log(`   └─ 🧠 LLM Thoughts: ${response.content.substring(0, 300).replace(/\n/g, " ")}...`);
            // XML Artifact Extraction Engine
            const fileRegex = /<file path="([^"]+)">\n*([\s\S]*?)\n*<\/file>/g;
            let match;
            while ((match = fileRegex.exec(response.content)) !== null) {
                const filePath = match[1];
                const fileContent = match[2];
                console.log(`   └─ 📝 XML Parser Extracted: ${filePath}`);
                // Guard 1: Component Naming
                if (filePath.endsWith("Navigation.tsx")) {
                    console.log(`   └─ ⚠️ Skipped XML: Navigation must be Navbar.tsx`);
                    xmlErrorMessages.push(new messages_1.HumanMessage(`XML Error: Navigation component MUST be named 'Navbar.tsx'. Do not create 'Navigation.tsx'.`));
                    didPatch = true;
                    continue;
                }
                // Guard 2: Scaffold Lock
                if (isProtected(filePath) && !shouldAllowProtectedWrite()) {
                    console.log(`   └─ ⚠️ Skipped XML: Scaffold lock on ${filePath}`);
                    xmlErrorMessages.push(new messages_1.HumanMessage(`XML Error: Modification to protected file '${filePath}' is blocked. Only touch src/ application files.`));
                    didPatch = true;
                    continue;
                }
                fileCache.delete(filePath);
                await tools_1.tools.writeFile(state.sandboxPath, filePath, fileContent);
                didPatch = true;
            }
        }
        currentMessages.push(...xmlErrorMessages);
        // Output of the tools executed in this step
        const toolMessages = [];
        let schemaErrorOccurred = false;
        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const tCall of response.tool_calls) {
                const argPreview = JSON.stringify(tCall.args || {}).substring(0, 150);
                console.log(`   └─ 🤖 LLM requested tool: ${tCall.name} | args: ${argPreview}${argPreview.length >= 150 ? '...' : ''}`);
                const selectedTool = toolsByName[tCall.name];
                let toolResult = "";
                if (selectedTool) {
                    try {
                        toolResult = await selectedTool.invoke(tCall.args);
                    }
                    catch (e) {
                        schemaErrorOccurred = true;
                        console.log(`   └─ ❌ Zod/Langchain Validation Error on ${tCall.name}: ${e.message}`);
                        toolResult = `Error executing tool: ${e.message}`;
                    }
                }
                else {
                    console.log(`   └─ ❌ Unknown tool requested: ${tCall.name}`);
                    toolResult = `Error: Unknown tool ${tCall.name}`;
                }
                toolMessages.push(new messages_1.ToolMessage({
                    content: toolResult,
                    name: tCall.name,
                    tool_call_id: tCall.id
                }));
            }
            currentMessages.push(...toolMessages);
        }
        // Break if NO tools called AND NO XML patches extracted
        if (!didPatch && (!response.tool_calls || response.tool_calls.length === 0)) {
            console.log("   └─ Developer finished coding.");
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
            console.log(`   └─ 🔎 Running Early TypeScript Verification (Attempt ${patchAttempts}/2)...`);
            const tsResult = await tools_1.tools.runTypeScript(state.sandboxPath);
            if (!tsResult.includes("Success:")) {
                console.log(`   └─ ❌ Early TS Verification Failed.`);
                currentMessages.push(new messages_1.HumanMessage(`Early TypeScript TypeCheck failed after your XML patch:\n${tsResult}\n\nPlease output <file> blocks to fix these errors.`));
                if (patchAttempts >= 2) {
                    console.log(`   └─ ⚠️ Max patch attempts reached. Breaking to outer QA loop.`);
                    break;
                }
            }
            else {
                console.log(`   └─ ✅ Early TS Verification Passed. Breaking to outer QA loop.`);
                break;
            }
        }
    }
    if (steps >= maxSteps) {
        console.log("⚠️ [Developer] Max tool steps reached. Forcing stop.");
    }
    return {
        status: "qa",
        iterationCount: state.iterationCount + 1,
        // Save the updated message history to global state
        messages: currentMessages
    };
}
/**
 * Node 3: QA Reviewer
 * Runs the TypeScript compiler and Vite Build to catch all syntax, type, and module errors.
 */
async function qaNode(state) {
    console.log(`[Model] QA Reviewer using: OpenAI (GPT-4o)`);
    console.log("🔎 [QA Engineer] Running TypeScript compiler checks...");
    const tsResult = await tools_1.tools.runTypeScript(state.sandboxPath);
    if (tsResult.includes("Success:")) {
        console.log("🔎 [QA Engineer] TypeScript passed. Running Vite Build to check module resolution and bundler errors...");
        const buildResult = await tools_1.tools.npmRun(state.sandboxPath, "build");
        if (buildResult.includes("Command executed successfully")) {
            console.log("✅ [QA] No errors found! Ready for deployment.");
            return {
                status: "success",
                errorLogs: null,
                messages: state.messages
            };
        }
        else {
            console.log("❌ [QA] Vite Build errors found. Sending back to Developer.");
            return {
                status: "failed",
                errorLogs: `Vite Build failed:\n${buildResult}`,
                messages: [...state.messages, new messages_1.HumanMessage(`[Automated QA Pipeline] Vite Build failed. You must fix the code:\n${buildResult}\n\nPlease analyze the errors. Outline the \"Top 3 probable causes\" and a \"recommended patch plan\" before using edit_file.`)]
            };
        }
    }
    else {
        console.log("❌ [QA] TypeScript errors found. Sending back to Developer.");
        return {
            status: "failed",
            errorLogs: `TypeScript TypeCheck failed:\n${tsResult}`,
            messages: [...state.messages, new messages_1.HumanMessage(`[Automated QA Pipeline] TypeScript Compiler errors found. You must patch the code:\n${tsResult}\n\nPlease analyze the errors. Outline the \"Top 3 probable causes\" and a \"recommended patch plan\" before using edit_file.`)]
        };
    }
}
/**
 * Conditional Routing Logic
 */
function routeAfterQA(state) {
    if (state.status === "success") {
        return "end";
    }
    if (state.iterationCount >= 6) {
        console.log("⚠️ [Orchestrator] Max iterations reached. Forcing completion.");
        return "end";
    }
    return "developer";
}
// Build the Graph
const workflow = new langgraph_1.StateGraph({
    channels: {
        businessInput: null,
        sandboxPath: null,
        status: null,
        messages: null,
        errorLogs: null,
        iterationCount: null
    }
})
    .addNode("productManager", productManagerNode)
    .addNode("developer", developerNode)
    .addNode("qa", qaNode)
    .addEdge("productManager", "developer")
    .addEdge("developer", "qa")
    .addConditionalEdges("qa", routeAfterQA, {
    developer: "developer",
    end: langgraph_1.END
});
workflow.setEntryPoint("productManager");
exports.orchestratorApp = workflow.compile();
