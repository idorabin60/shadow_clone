import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { spawn, ChildProcess } from "child_process";
import { SandboxManager } from "./sandbox/SandboxManager";
import { orchestratorApp } from "./orchestrator/graph";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sandboxManager = new SandboxManager();

// Store active streams by uuid to push logs easily
const clients: { [key: string]: express.Response } = {};

// Store active Vite Servers by uuid
const activeServers: { [uuid: string]: { port: number, process: ChildProcess } } = {};
let availablePort = 5174; // Vite defaults to 5173, start from 5174 for dynamic alloc

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

    if (!businessInput || !businessInput.businessName) {
        return res.status(400).json({ error: "Missing businessInput" });
    }

    try {
        // 1. Create a Sandbox
        const { sandboxId, sandboxPath } = await sandboxManager.createSandbox();

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

                sendLog(sandboxId, "✅ Generation Complete! Starting Live Server...");

                // Phase 5: Live Dev Server Orchestration
                const port = availablePort++;
                const viteProcess = spawn("npm", ["run", "dev", "--", "--port", port.toString(), "--strictPort", "--host", "--base", `/serve/${sandboxId}/`], {
                    cwd: sandboxPath,
                    shell: true
                });

                activeServers[sandboxId] = { port, process: viteProcess };

                viteProcess.stdout?.on('data', (data) => {
                    const raw = data.toString();
                    // Optional: sendLog(sandboxId, `[Vite] ${raw.trim()}`);
                    if (raw.includes("ready in") || raw.includes("Local:")) {
                        sendLog(sandboxId, `🌐 Live Server Ready!`);
                        sendLog(sandboxId, `✅ DONE_URL:http://localhost:${PORT}/serve/${sandboxId}/`);
                    }
                });

                viteProcess.stderr?.on('data', (data) => {
                    console.error(`[Vite ${sandboxId}] Error:`, data.toString());
                });

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

/**
 * 3. Proxy Route for Live Vite Server
 */
app.use("/serve/:uuid", (req, res, next) => {
    const { uuid } = req.params;
    const serverInfo = activeServers[uuid];

    if (!serverInfo) {
        return res.status(404).send("Live server not found or still booting.");
    }

    // Proxy the request directly to the local Vite instance
    proxy(`http://localhost:${serverInfo.port}`, {
        // Forward the full original URL so it matches Vite's dynamic base path
        proxyReqPathResolver: (req) => req.originalUrl
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`🚀 Agent Orchestrator Backend running on http://localhost:${PORT}`);
});
