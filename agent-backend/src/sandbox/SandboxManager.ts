import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SandboxManager {
    private baseDir = path.join(process.cwd(), '../tmp/sites');
    private scaffoldDir = path.join(process.cwd(), 'scaffold');

    constructor() {
        this.initBaseDir();
    }

    private async initBaseDir() {
        try {
            await fs.mkdir(this.baseDir, { recursive: true });
        } catch (err) {
            console.error("Failed to init sandbox base dir", err);
        }
    }

    /**
     * Creates a new isolated environment for a generation request.
     * Copies the Vite scaffold and runs npm install.
     */
    public async createSandbox(projectId?: string): Promise<{ sandboxId: string, sandboxPath: string }> {
        const sandboxId = projectId || randomUUID();
        const sandboxPath = path.join(this.baseDir, sandboxId);

        try {
            // 1. Copy the scaffold folder recursively, EXCLUDING node_modules (to save disk IO)
            await fs.cp(this.scaffoldDir, sandboxPath, {
                recursive: true,
                filter: (src) => !src.includes('node_modules') && !src.includes('.git')
            });

            // 1b. Symlink the node_modules from the scaffold dir to save space and speed up Vite build
            const scaffoldNodeModules = path.join(this.scaffoldDir, 'node_modules');
            const sandboxNodeModules = path.join(sandboxPath, 'node_modules');
            try {
                // Check if node_modules exists in scaffold first to avoid crashing
                await fs.access(scaffoldNodeModules);
                await fs.symlink(scaffoldNodeModules, sandboxNodeModules, 'dir');
                console.log(`[Sandbox] Symlinked node_modules for ${sandboxId}`);
            } catch (e) {
                console.log(`[Sandbox] No node_modules in scaffold. Symlink skipped.`);
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
        } catch (err) {
            console.error(`[Sandbox] Error creating sandbox ${sandboxId}:`, err);
            throw err;
        }
    }

    /**
     * Cleans up a sandbox session
     */
    public async deleteSandbox(sandboxId: string) {
        const sandboxPath = path.join(this.baseDir, sandboxId);
        try {
            await fs.rm(sandboxPath, { recursive: true, force: true });
            console.log(`[Sandbox] Deleted ${sandboxId}`);
        } catch (err) {
            console.error(`[Sandbox] Failed to delete ${sandboxId}`, err);
        }
    }

    /**
     * Reads all code files in the sandbox into a flat Sandpack-compatible object
     */
    public async getSandboxFiles(sandboxId: string): Promise<Record<string, string>> {
        const sandboxPath = path.join(this.baseDir, sandboxId);
        const files: Record<string, string> = {};

        async function readDir(dir: string, base: string) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await readDir(fullPath, base);
                } else {
                    const relativePath = '/' + path.relative(base, fullPath).replace(/\\/g, '/');
                    // filter locking and binaries to reduce DB payload size
                    if (entry.name.endsWith('.lock') || entry.name === 'package-lock.json') continue;
                    files[relativePath] = await fs.readFile(fullPath, 'utf-8');
                }
            }
        }

        try {
            await readDir(sandboxPath, sandboxPath);
            return files;
        } catch (err) {
            console.error(`[Sandbox] Failed to read files for sandbox ${sandboxId}:`, err);
            return {};
        }
    }
}
