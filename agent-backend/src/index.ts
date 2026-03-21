import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ‼️ Fix for ts-node loading LangChain core modules which expect Web Streams to be globally available
if (typeof global.ReadableStream === 'undefined') {
    global.ReadableStream = require('node:stream/web').ReadableStream;
}

import { SandboxManager } from "./sandbox/SandboxManager";
import { orchestratorApp } from "./orchestrator/graph";
import { supabase } from "./db/supabase";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sandboxManager = new SandboxManager();

// Store active streams by uuid to push logs easily
const clients: { [key: string]: express.Response } = {};

/**
 * Helper to emit SSE messages
 */
function sendLog(uuid: string, msg: string) {
    const client = clients[uuid];
    if (client) {
        client.write(`data: ${JSON.stringify({ log: msg })}\n\n`);
    }
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "Agent Backend is running correctly!" });
});

/**
 * 1. Orchestration SSE Endpoint
 * Triggers the graph and streams logs back to the frontend.
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
            const originalLog = console.log;
            try {
                console.log(`[Job ${sandboxId}] Starting orchestrator...`);

                // Let's hook into console.log to broadcast SSE
                // In a real app we would pass a logger callback to the nodes.
                console.log = (...args) => {
                    originalLog(...args);
                    const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
                    if (str.includes(sandboxId) || str.includes('[')) { // naive filter for our logs
                        sendLog(sandboxId, str);
                    }
                };

                const finalState = await orchestratorApp.invoke({
                    businessInput,
                    sandboxPath,
                    status: "planning",
                    messages: [],
                    errorLogs: null,
                    iterationCount: 0
                });

                sendLog(sandboxId, "✅ Generation Complete! Saving files to database...");

                // Phase 5: Extract Sandbox Files & Save to DB
                try {
                    const generatedFiles = await sandboxManager.getSandboxFiles(sandboxId);

                    const { error } = await supabase
                        .from('projects')
                        .update({ files: generatedFiles })
                        .eq('id', sandboxId);

                    if (error) {
                        throw new Error(`DB Update Failed: ${error.message}`);
                    }

                    sendLog(sandboxId, `🌐 Files Saved Successfully!`);
                    sendLog(sandboxId, `✅ DONE_FILES_SAVED:${sandboxId}`);

                    // Clean up sandbox to save disk space now that it's in the DB
                    await sandboxManager.deleteSandbox(sandboxId);
                } catch (dbErr: any) {
                    console.error(`[DB Error ${sandboxId}]`, dbErr);
                    sendLog(sandboxId, `❌ Failed to save files: ${dbErr.message}`);
                }

                // Restore console log
                console.log = originalLog;
            } catch (err: any) {
                console.log = originalLog; // Essential: restore console.log to print to terminal!
                console.error(`[Fatal Orchestrator Error] ${err.name}: ${err.message}`, err);
                sendLog(sandboxId, `❌ Fatal API Error: ${err.message}`);
            }
        })();

    } catch (error: any) {
        console.error("Orchestration init failed", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * 2. Logging Stream Endpoint (SSE)
 */
app.get("/api/orchestrate/stream/:uuid", (req, res) => {
    const { uuid } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients[uuid] = res;

    // Send initial connected payload
    res.write(`data: ${JSON.stringify({ log: "System: Connected to Terminal Stream..." })}\n\n`);

    req.on('close', () => {
        delete clients[uuid];
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Agent Orchestrator Backend running on http://localhost:${PORT}`);
});
