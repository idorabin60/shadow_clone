"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = exports.formatVisualErrors = exports.runVisualReview = exports.takeScreenshots = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
var screenshot_1 = require("./screenshot");
Object.defineProperty(exports, "takeScreenshots", { enumerable: true, get: function () { return screenshot_1.takeScreenshots; } });
var visualReview_1 = require("./visualReview");
Object.defineProperty(exports, "runVisualReview", { enumerable: true, get: function () { return visualReview_1.runVisualReview; } });
Object.defineProperty(exports, "formatVisualErrors", { enumerable: true, get: function () { return visualReview_1.formatVisualErrors; } });
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Next.js 15 requires Node 18+. The system default may be older (e.g. Node 16 via nvm default).
// Prepend Node 22 to PATH so all sandbox commands use the right version.
const NODE22_BIN = '/Users/idorabin/.nvm/versions/node/v22.20.0/bin';
const SANDBOX_ENV = { ...process.env, PATH: `${NODE22_BIN}:${process.env.PATH}` };
exports.tools = {
    /**
     * Safe wrapper to read files only within the sandbox directory
     */
    async readFile(sandboxPath, relativeFilePath) {
        const fullPath = path_1.default.join(sandboxPath, relativeFilePath);
        // Security check: ensure the resolved path stays within the sandbox directory
        if (!fullPath.startsWith(sandboxPath)) {
            throw new Error(`Access Denied: Path ${relativeFilePath} is outside the sandbox.`);
        }
        try {
            const content = await promises_1.default.readFile(fullPath, 'utf-8');
            return content;
        }
        catch (err) {
            return `Error reading file: ${err.message}`;
        }
    },
    /**
     * Safe wrapper to write files only within the sandbox directory.
     * Auto-creates parent directories if they don't exist.
     */
    async writeFile(sandboxPath, relativeFilePath, content) {
        const fullPath = path_1.default.join(sandboxPath, relativeFilePath);
        // Security check
        if (!fullPath.startsWith(sandboxPath)) {
            throw new Error(`Access Denied: Path ${relativeFilePath} is outside the sandbox.`);
        }
        try {
            await promises_1.default.mkdir(path_1.default.dirname(fullPath), { recursive: true });
            await promises_1.default.writeFile(fullPath, content, 'utf-8');
            return `Success: Wrote to ${relativeFilePath}`;
        }
        catch (err) {
            return `Error writing file: ${err.message}`;
        }
    },
    /**
     * Explores the sandbox directory tree.
     * Ignores node_modules to save tokens.
     */
    async listFiles(sandboxPath, relativeDirPath = ".") {
        const fullPath = path_1.default.join(sandboxPath, relativeDirPath);
        if (!fullPath.startsWith(sandboxPath)) {
            return "Access Denied: Path is outside the sandbox.";
        }
        try {
            const { stdout } = await execAsync(`find . -type f -not -path "*/node_modules/*"`, { cwd: fullPath });
            return `Files in ${relativeDirPath}:\n${stdout}`;
        }
        catch (err) {
            return `Error listing files: ${err.message}`;
        }
    },
    /**
   * Patches an existing file using an exact string match.
   * Returns helpful, structured diagnostics when exact matching fails due to LLM whitespace hallucinations.
   */
    async editFile(sandboxPath, relativeFilePath, find, replace) {
        const fullPath = path_1.default.join(sandboxPath, relativeFilePath);
        if (!fullPath.startsWith(sandboxPath)) {
            return JSON.stringify({ ok: false, error: "Access Denied: Path is outside the sandbox.", replacedCount: 0, nearestMatches: [] });
        }
        try {
            const content = await promises_1.default.readFile(fullPath, 'utf-8');
            if (!content.includes(find)) {
                // Generate helpful diagnostics to guide the LLM
                const findLines = find.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                const firstLine = findLines.length > 0 ? findLines[0] : find.trim();
                const fileLines = content.split('\n');
                const nearestMatches = fileLines
                    .map((line, i) => ({ lineNumber: i + 1, text: line.trim() }))
                    .filter(l => firstLine.length > 3 && l.text.includes(firstLine))
                    .slice(0, 5);
                return JSON.stringify({
                    ok: false,
                    replacedCount: 0,
                    error: "Could not find exact string to replace. Whitespace or indentation differs. Review 'nearestMatches' or use 'read_file'.",
                    nearestMatches
                }, null, 2);
            }
            const newContent = content.replace(find, replace);
            const replacedCount = content.split(find).length - 1;
            await promises_1.default.writeFile(fullPath, newContent, 'utf-8');
            return JSON.stringify({ ok: true, replacedCount, nearestMatches: [] }, null, 2);
        }
        catch (err) {
            return JSON.stringify({ ok: false, replacedCount: 0, error: err.message, nearestMatches: [] });
        }
    },
    /**
     * Executes a batch of file operations sequentially.
     * Stops execution and returns an error if any operation fails.
     */
    async applyPatchset(sandboxPath, operations) {
        const results = [];
        for (let i = 0; i < operations.length; i++) {
            const op = operations[i];
            try {
                if (op.type === "write") {
                    const res = await this.writeFile(sandboxPath, op.path, op.content);
                    if (res.startsWith("Error"))
                        throw new Error(res);
                    results.push(`[Op ${i + 1}/${operations.length}] Wrote ${op.path}`);
                }
                else if (op.type === "edit") {
                    const resStr = await this.editFile(sandboxPath, op.path, op.find, op.replace);
                    const res = JSON.parse(resStr);
                    if (!res.ok)
                        throw new Error(res.error || "Edit failed");
                    results.push(`[Op ${i + 1}/${operations.length}] Edited ${op.path} (${res.replacedCount} replacements)`);
                }
                else if (op.type === "delete") {
                    const fullPath = path_1.default.join(sandboxPath, op.path);
                    if (!fullPath.startsWith(sandboxPath)) {
                        throw new Error(`Access Denied: Path ${op.path} is outside the sandbox.`);
                    }
                    await promises_1.default.unlink(fullPath);
                    results.push(`[Op ${i + 1}/${operations.length}] Deleted ${op.path}`);
                }
            }
            catch (err) {
                // Return immediately on failure to prevent partial broken state cascading
                return JSON.stringify({
                    success: false,
                    completedCount: i,
                    totalOperations: operations.length,
                    error: `Operation ${i + 1} (${op.type} on ${op.path}) failed: ${err.message}`,
                    results
                }, null, 2);
            }
        }
        return JSON.stringify({
            success: true,
            completedCount: operations.length,
            totalOperations: operations.length,
            results
        }, null, 2);
    },
    /**
   * Safe execution for installing NPM packages in the sandbox.
   * Prevents arbitrary shell injection.
   */
    async npmInstall(sandboxPath, packages) {
        console.log(`[Shell Tool] Installing NPM packages: ${packages.join(" ")}`);
        // Safety check: ensure packages array only contains alphanumeric, dashes, and @ for scopes
        const safePackages = packages.filter(pkg => /^[a-zA-Z0-9-@/.]+$/.test(pkg));
        if (safePackages.length === 0) {
            return "No valid packages provided to install.";
        }
        try {
            // Execute npm install inside the isolated sandbox directory
            const { stdout, stderr } = await execAsync(`npm install ${safePackages.join(" ")}`, { cwd: sandboxPath, env: SANDBOX_ENV });
            return `Successfully installed ${safePackages.join(", ")}.\nOutput:\n${stdout}`;
        }
        catch (err) {
            return `Failed to install packages: ${err.message}\n${err.stdout ? 'Output:\n' + err.stdout : ''}`;
        }
    },
    /**
     * Safe execution for running standard NPM scripts.
     */
    async npmRun(sandboxPath, script) {
        console.log(`[Shell Tool] Running NPM script: ${script}`);
        const allowedScripts = ["build", "test", "lint", "typecheck", "preview"];
        if (!allowedScripts.includes(script)) {
            return `Security Error: Script '${script}' is not in the allowlist. Allowed scripts are: ${allowedScripts.join(", ")}`;
        }
        try {
            const { stdout, stderr } = await execAsync(`npm run ${script}`, { cwd: sandboxPath, env: SANDBOX_ENV });
            return `Command executed successfully.\nOutput:\n${stdout}`;
        }
        catch (err) {
            return `Command failed: ${err.message}\n${err.stdout ? 'stdout:\n' + err.stdout : ''}${err.stderr ? '\nstderr:\n' + err.stderr : ''}`;
        }
    },
    /**
     * Executes the TypeScript compiler to catch syntax and matching errors.
     */
    async runTypeScript(sandboxPath) {
        try {
            // Run tsc --noEmit to only typecheck
            const { stdout, stderr } = await execAsync('npx tsc --noEmit', { cwd: sandboxPath, env: SANDBOX_ENV });
            return "Success: TypeScript compilation passed with 0 errors.";
        }
        catch (err) {
            // tsc throws an error if compilation fails
            return `TypeScript Errors Found:\n${err.stdout || err.message}`;
        }
    }
};
