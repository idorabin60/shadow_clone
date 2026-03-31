"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// ‼️ Fix for ts-node loading LangChain core modules which expect Web Streams to be globally available
if (typeof global.ReadableStream === 'undefined') {
    global.ReadableStream = require('node:stream/web').ReadableStream;
}
const SandboxManager_1 = require("./sandbox/SandboxManager");
const graph_1 = require("./orchestrator/graph");
const editGraph_1 = require("./orchestrator/editGraph");
const supabase_1 = require("./db/supabase");
const emitter_1 = require("./orchestrator/emitter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const sandboxManager = new SandboxManager_1.SandboxManager();
// Store active SSE streams by uuid
const clients = {};
/**
 * Send a structured SSE event to the connected client
 */
function sendEvent(uuid, event) {
    const client = clients[uuid];
    if (client) {
        client.write(`data: ${JSON.stringify(event)}\n\n`);
    }
}
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "Agent Backend is running correctly!" });
});
/**
 * 1. Orchestration SSE Endpoint
 * Triggers the graph and streams structured events back to the frontend.
 */
app.post("/api/orchestrate", async (req, res) => {
    const businessInput = req.body;
    const { projectId } = req.body;
    if (!businessInput || !businessInput.businessName) {
        return res.status(400).json({ error: "Missing businessInput" });
    }
    try {
        // 1. Create a Sandbox
        const { sandboxId, sandboxPath } = await sandboxManager.createSandbox(projectId);
        // 2. Return the UUID to the client immediately so they can subscribe to SSE
        res.json({ sandboxId, message: "Orchestration started" });
        // 3. Kick off LangGraph async
        (async () => {
            try {
                emitter_1.eventStorage.run((event) => sendEvent(sandboxId, event), async () => {
                    console.log(`[Job ${sandboxId}] Starting orchestrator...`);
                    const finalState = await graph_1.orchestratorApp.invoke({
                        businessInput,
                        sandboxPath,
                        status: "planning",
                        messages: [],
                        errorLogs: null,
                        iterationCount: 0
                    });
                    emitter_1.emitter.stepStart("saving");
                    // Phase 5: Extract Sandbox Files & Save to DB
                    try {
                        const generatedFiles = await sandboxManager.getSandboxFiles(sandboxId);
                        const { error } = await supabase_1.supabase
                            .from('projects')
                            .update({ files: generatedFiles })
                            .eq('id', sandboxId);
                        if (error) {
                            throw new Error(`DB Update Failed: ${error.message}`);
                        }
                        emitter_1.emitter.stepDone("saving");
                        emitter_1.emitter.done(sandboxId);
                        // Clean up sandbox to save disk space now that it's in the DB
                        await sandboxManager.deleteSandbox(sandboxId);
                    }
                    catch (dbErr) {
                        console.error(`[DB Error ${sandboxId}]`, dbErr);
                        emitter_1.emitter.stepFailed("saving", dbErr.message);
                        emitter_1.emitter.error(`Failed to save files: ${dbErr.message}`, true);
                    }
                }); // End eventStorage scope
            }
            catch (err) {
                console.error(`[Fatal Orchestrator Error] ${err.name}: ${err.message}`, err);
                sendEvent(sandboxId, { type: "error", message: err.message, fatal: true });
            }
        })();
    }
    catch (error) {
        console.error("Orchestration init failed", error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * 2. Edit Endpoint
 * Applies targeted edits to an existing project using the lightweight edit graph.
 */
app.post("/api/edit", async (req, res) => {
    const { projectId, userRequest } = req.body;
    if (!projectId || !userRequest) {
        return res.status(400).json({ error: "Missing projectId or userRequest" });
    }
    try {
        // 1. Fetch existing files from Supabase
        const { data: project, error: dbError } = await supabase_1.supabase
            .from('projects')
            .select('files')
            .eq('id', projectId)
            .single();
        if (dbError || !project?.files) {
            return res.status(404).json({ error: "Project not found or has no files" });
        }
        // 2. Recreate sandbox from existing files
        const { sandboxId, sandboxPath } = await sandboxManager.createFromFiles(projectId, project.files);
        // 3. Return sandboxId so frontend can subscribe to SSE
        res.json({ sandboxId, message: "Edit started" });
        // 4. Run edit graph async
        (async () => {
            try {
                emitter_1.eventStorage.run((event) => sendEvent(sandboxId, event), async () => {
                    console.log(`[Edit ${sandboxId}] Starting edit: "${userRequest.substring(0, 80)}..."`);
                    await editGraph_1.editApp.invoke({
                        sandboxPath,
                        projectId,
                        userRequest,
                        messages: [],
                        status: "coding",
                        errorLogs: null,
                        iterationCount: 0
                    });
                    emitter_1.emitter.stepStart("saving");
                    // Save updated files back to DB
                    try {
                        const updatedFiles = await sandboxManager.getSandboxFiles(sandboxId);
                        console.log(`[Edit ${sandboxId}] Read ${Object.keys(updatedFiles).length} files. Updating DB for project ${projectId}...`);
                        const { error } = await supabase_1.supabase
                            .from('projects')
                            .update({ files: updatedFiles })
                            .eq('id', projectId);
                        if (error)
                            throw new Error(`DB Update Failed: ${error.message}`);
                        emitter_1.emitter.stepDone("saving");
                        emitter_1.emitter.done(projectId);
                        await sandboxManager.deleteSandbox(sandboxId);
                    }
                    catch (dbErr) {
                        console.error(`[DB Error ${sandboxId}]`, dbErr);
                        emitter_1.emitter.stepFailed("saving", dbErr.message);
                        emitter_1.emitter.error(`Failed to save files: ${dbErr.message}`, true);
                    }
                });
            }
            catch (err) {
                console.error(`[Fatal Edit Error] ${err.name}: ${err.message}`, err);
                sendEvent(sandboxId, { type: "error", message: err.message, fatal: true });
            }
        })();
    }
    catch (error) {
        console.error("Edit init failed", error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * 3. Logging Stream Endpoint (SSE)
 */
app.get("/api/orchestrate/stream/:uuid", (req, res) => {
    const { uuid } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    clients[uuid] = res;
    // Send initial connected event
    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
    req.on('close', () => {
        delete clients[uuid];
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Agent Orchestrator Backend running on http://localhost:${PORT}`);
});
