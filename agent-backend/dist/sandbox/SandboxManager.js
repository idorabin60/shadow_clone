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
    async createSandbox(projectId) {
        const sandboxId = projectId || (0, crypto_1.randomUUID)();
        const sandboxPath = path_1.default.join(this.baseDir, sandboxId);
        try {
            // 1. Copy the scaffold folder recursively, EXCLUDING node_modules (to save disk IO)
            await promises_1.default.cp(this.scaffoldDir, sandboxPath, {
                recursive: true,
                filter: (src) => !src.includes('node_modules') && !src.includes('.git')
            });
            // 1b. Copy node_modules from the scaffold dir so each sandbox can install additional packages
            const scaffoldNodeModules = path_1.default.join(this.scaffoldDir, 'node_modules');
            const sandboxNodeModules = path_1.default.join(sandboxPath, 'node_modules');
            try {
                await promises_1.default.access(scaffoldNodeModules);
                await promises_1.default.cp(scaffoldNodeModules, sandboxNodeModules, { recursive: true });
                // Also copy package.json and package-lock.json so npm install works correctly
                await promises_1.default.copyFile(path_1.default.join(this.scaffoldDir, 'package.json'), path_1.default.join(sandboxPath, 'package.json')).catch(() => { });
                const lockSrc = path_1.default.join(this.scaffoldDir, 'package-lock.json');
                const lockDst = path_1.default.join(sandboxPath, 'package-lock.json');
                await promises_1.default.copyFile(lockSrc, lockDst).catch(() => { });
                console.log(`[Sandbox] Copied node_modules for ${sandboxId}`);
            }
            catch (e) {
                console.log(`[Sandbox] No node_modules in scaffold. Copy skipped.`);
            }
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
    /**
     * Recreates a sandbox from existing project files (for edit sessions).
     * Copies scaffold for config + node_modules, then writes all project files on top.
     */
    async createFromFiles(projectId, files) {
        // Create a fresh sandbox with scaffold
        const { sandboxId, sandboxPath } = await this.createSandbox(projectId);
        // Write all project files into the sandbox
        for (const [filePath, content] of Object.entries(files)) {
            // filePath comes from DB as "/src/App.tsx" — strip leading slash
            const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
            const fullPath = path_1.default.join(sandboxPath, relativePath);
            await promises_1.default.mkdir(path_1.default.dirname(fullPath), { recursive: true });
            await promises_1.default.writeFile(fullPath, content, 'utf-8');
        }
        console.log(`[Sandbox] Recreated from files for ${projectId} (${Object.keys(files).length} files)`);
        return { sandboxId, sandboxPath };
    }
    /**
     * Reads all code files in the sandbox into a flat Sandpack-compatible object
     */
    async getSandboxFiles(sandboxId) {
        const sandboxPath = path_1.default.join(this.baseDir, sandboxId);
        const files = {};
        async function readDir(dir, base) {
            const entries = await promises_1.default.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist')
                    continue;
                const fullPath = path_1.default.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await readDir(fullPath, base);
                }
                else {
                    const relativePath = '/' + path_1.default.relative(base, fullPath).replace(/\\/g, '/');
                    // filter locking and binaries to reduce DB payload size
                    if (entry.name.endsWith('.lock') || entry.name === 'package-lock.json')
                        continue;
                    files[relativePath] = await promises_1.default.readFile(fullPath, 'utf-8');
                }
            }
        }
        try {
            await readDir(sandboxPath, sandboxPath);
            return files;
        }
        catch (err) {
            console.error(`[Sandbox] Failed to read files for sandbox ${sandboxId}:`, err);
            return {};
        }
    }
}
exports.SandboxManager = SandboxManager;
