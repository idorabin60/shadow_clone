"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer, FileSystemTree } from "@webcontainer/api";

let webcontainerInstance: WebContainer | null = null;
let isBooting = false;

// Convert flat {"src/App.tsx": "code"} to nested FileSystemTree
function buildFSTree(flatFiles: Record<string, string>): FileSystemTree {
    const tree: FileSystemTree = {};
    for (const [path, contents] of Object.entries(flatFiles)) {
        const parts = path.split('/').filter(Boolean);
        let currentLevel = tree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1;
            if (isFile) {
                currentLevel[part] = { file: { contents } };
            } else {
                if (!currentLevel[part]) {
                    currentLevel[part] = { directory: {} };
                }
                currentLevel = (currentLevel[part] as any).directory;
            }
        }
    }
    return tree;
}

export function useWebContainer() {
    const [isBooted, setIsBooted] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [devServerUrl, setDevServerUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    const boot = useCallback(async () => {
        if (webcontainerInstance) {
            setIsBooted(true);
            return webcontainerInstance;
        }
        if (isBooting) return null;

        isBooting = true;
        try {
            webcontainerInstance = await WebContainer.boot();
            setIsBooted(true);
            isBooting = false;
            return webcontainerInstance;
        } catch (error) {
            console.error("Failed to boot WebContainer", error);
            isBooting = false;
            throw error;
        }
    }, []);

    const mountAndRun = useCallback(async (files: Record<string, string>) => {
        const instance = webcontainerInstance || await boot();
        if (!instance) return;

        // Cancel previous operations if running
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setDevServerUrl(null);
        setLogs(prev => [...prev, "> Mounting file system..."]);

        // 1. Mount Files
        const fsTree = buildFSTree(files);
        await instance.mount(fsTree);

        // 2. Install Dependencies
        setInstalling(true);
        setLogs(prev => [...prev, "> npm install"]);

        const installProcess = await instance.spawn('npm', ['install']);
        installProcess.output.pipeTo(new WritableStream({
            write(data) {
                setLogs(prev => [...prev.slice(-40), data.trim()].filter(Boolean));
            }
        }));

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
            setLogs(prev => [...prev, "> ❌ Installation failed"]);
            setInstalling(false);
            return;
        }

        setLogs(prev => [...prev, "> Installation complete. Starting dev server..."]);
        setInstalling(false);

        // 3. Run Dev Server
        const startProcess = await instance.spawn('npm', ['run', 'dev']);
        startProcess.output.pipeTo(new WritableStream({
            write(data) {
                setLogs(prev => [...prev.slice(-40), data.trim()].filter(Boolean));
            }
        }));

        // 4. Capture Server Ready URL
        instance.on('server-ready', (port, url) => {
            setLogs(prev => [...prev, `> Server is ready on ${url}`]);
            setDevServerUrl(url);
        });

    }, [boot]);

    /**
     * Lightweight file update for edits — just writes changed files to the WebContainer.
     * Vite HMR picks up the changes automatically, no reinstall or server restart needed.
     */
    const updateFiles = useCallback(async (files: Record<string, string>) => {
        const instance = webcontainerInstance;
        if (!instance) {
            console.warn("WebContainer not booted, falling back to full mountAndRun");
            return mountAndRun(files);
        }

        setLogs(prev => [...prev, "> Updating files..."]);

        // Write each file individually to trigger Vite HMR
        for (const [filePath, contents] of Object.entries(files)) {
            const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
            const parts = cleanPath.split('/');

            // Ensure parent directories exist
            if (parts.length > 1) {
                const dirPath = parts.slice(0, -1).join('/');
                try {
                    await instance.fs.mkdir(dirPath, { recursive: true });
                } catch {
                    // Directory may already exist
                }
            }

            await instance.fs.writeFile(cleanPath, contents);
        }

        setLogs(prev => [...prev, `> ${Object.keys(files).length} files updated. HMR reloading...`]);
    }, [mountAndRun]);

    return {
        boot,
        isBooted,
        installing,
        mountAndRun,
        updateFiles,
        devServerUrl,
        webLogs: logs
    };
}
