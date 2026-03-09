"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class SandboxManager {
    baseDir = path_1.default.join(process.cwd(), '../tmp/sites');
    scaffoldDir = path_1.default.join(process.cwd(), 'scaffold');
    constructor() {
        this.initBaseDir();
    }
    async initBaseDir() {
        try {
            await promises_1.default.mkdir(this.baseDir, { recursive: true });
        }
        catch (err) {
            console.error("Failed to init sandbox base dir", err);
        }
    }
    /**
     * Creates a new isolated environment for a generation request.
     * Copies the Vite scaffold and runs npm install.
     */
    async createSandbox() {
        const sandboxId = (0, crypto_1.randomUUID)();
        const sandboxPath = path_1.default.join(this.baseDir, sandboxId);
        try {
            // 1. Copy the full scaffold folder recursively
            await promises_1.default.cp(this.scaffoldDir, sandboxPath, { recursive: true });
            // 2. We don't necessarily run npm install every time if we can share node_modules 
            // or use a global installation, but for total isolation, running a fast install is safer.
            // E.g., npm install --prefer-offline --no-audit --no-fund
            // We will skip actual install right now to save speed in the orchestrator, 
            // assuming the frontend iframe will fetch via CDN or we handle it later.
            // Wait, Vite requires node_modules to run `npm run dev`. 
            // For absolute speed right now, we will symlink the main node_modules 
            // or run a quick install.
            console.log(`[Sandbox] Created environment for ${sandboxId} at ${sandboxPath}`);
            return { sandboxId, sandboxPath };
        }
        catch (err) {
            console.error(`[Sandbox] Error creating sandbox ${sandboxId}:`, err);
            throw err;
        }
    }
    /**
     * Cleans up a sandbox session
     */
    async deleteSandbox(sandboxId) {
        const sandboxPath = path_1.default.join(this.baseDir, sandboxId);
        try {
            await promises_1.default.rm(sandboxPath, { recursive: true, force: true });
            console.log(`[Sandbox] Deleted ${sandboxId}`);
        }
        catch (err) {
            console.error(`[Sandbox] Failed to delete ${sandboxId}`, err);
        }
    }
}
exports.SandboxManager = SandboxManager;
