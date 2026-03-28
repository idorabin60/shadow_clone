import { chromium, type Browser, type Page } from "playwright";
import { spawn, type ChildProcess } from "child_process";
import path from "path";

export interface DomChecks {
    hasRtlDir: boolean;
    hasHebrew: boolean;
    imageCount: number;
    brokenImages: number;
    hasMotionElements: boolean;
    sectionCount: number;
    isBlankPage: boolean;
    bodyTextLength: number;
}

export interface ScreenshotResult {
    desktop: Buffer;
    mobile: Buffer;
    desktopFullPage: Buffer;
    domChecks: DomChecks;
}

interface Viewport {
    name: string;
    width: number;
    height: number;
    fullPage: boolean;
}

const VIEWPORTS: Viewport[] = [
    { name: "desktop", width: 1440, height: 900, fullPage: false },
    { name: "mobile", width: 375, height: 812, fullPage: false },
    { name: "desktopFullPage", width: 1440, height: 900, fullPage: true },
];

/**
 * Starts the Vite preview server in the sandbox and waits for it to be ready.
 * Returns the child process and the resolved URL.
 */
function startPreviewServer(sandboxPath: string): Promise<{ process: ChildProcess; url: string }> {
    return new Promise((resolve, reject) => {
        const serverProcess = spawn("npx", ["vite", "preview", "--port", "0", "--host", "127.0.0.1"], {
            cwd: sandboxPath,
            stdio: ["ignore", "pipe", "pipe"],
            env: { ...process.env, NODE_ENV: "production" },
        });

        let stdout = "";
        let stderr = "";
        const timeout = setTimeout(() => {
            serverProcess.kill("SIGTERM");
            reject(new Error(`Preview server did not start within 15s.\nstdout: ${stdout}\nstderr: ${stderr}`));
        }, 15000);

        serverProcess.stdout?.on("data", (data: Buffer) => {
            const chunk = data.toString();
            stdout += chunk;
            // Vite preview outputs something like: ➜  Local:   http://localhost:4173/
            const urlMatch = stdout.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
                clearTimeout(timeout);
                resolve({ process: serverProcess, url: urlMatch[0] });
            }
        });

        serverProcess.stderr?.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        serverProcess.on("error", (err) => {
            clearTimeout(timeout);
            reject(new Error(`Failed to start preview server: ${err.message}`));
        });

        serverProcess.on("exit", (code) => {
            clearTimeout(timeout);
            if (code !== null && code !== 0) {
                reject(new Error(`Preview server exited with code ${code}.\nstdout: ${stdout}\nstderr: ${stderr}`));
            }
        });
    });
}

/**
 * Runs DOM-level checks via Playwright's page.evaluate before taking screenshots.
 * The JS string is evaluated in the browser context (not compiled by Node's TS).
 */
async function runDomChecks(page: Page): Promise<DomChecks> {
    const domScript = `() => {
        const bodyText = document.body.innerText || "";
        const imgs = Array.from(document.querySelectorAll("img"));
        return {
            hasRtlDir: document.documentElement.dir === "rtl" || document.body.dir === "rtl",
            hasHebrew: /[\\u0590-\\u05FF]/.test(bodyText),
            imageCount: imgs.length,
            brokenImages: imgs.filter(img => img.complete && img.naturalWidth === 0).length,
            hasMotionElements: document.querySelectorAll("[style*='transform'], [data-framer-appear-id], .framer-motion").length > 0,
            sectionCount: document.querySelectorAll("section, [class*='section'], [class*='Section']").length,
            isBlankPage: bodyText.trim().length < 50,
            bodyTextLength: bodyText.trim().length,
        };
    }`;
    return await page.evaluate(domScript) as DomChecks;
}

/**
 * Takes screenshots of the built site at multiple viewports.
 * Starts a Vite preview server, captures with Playwright, then cleans up.
 */
export async function takeScreenshots(sandboxPath: string): Promise<ScreenshotResult> {
    console.log("   └─ 📸 Starting Vite preview server for screenshots...");

    let serverProcess: ChildProcess | null = null;
    let browser: Browser | null = null;

    try {
        // Start preview server
        const server = await startPreviewServer(sandboxPath);
        serverProcess = server.process;
        console.log(`   └─ 📸 Preview server ready at ${server.url}`);

        // Launch headless browser
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();

        // Navigate and wait for content
        const page = await context.newPage();
        await page.goto(server.url, { waitUntil: "networkidle", timeout: 20000 });

        // Wait a bit for framer-motion animations to settle
        await page.waitForTimeout(2000);

        // Run DOM checks
        const domChecks = await runDomChecks(page);
        console.log(`   └─ 📸 DOM checks: RTL=${domChecks.hasRtlDir}, Hebrew=${domChecks.hasHebrew}, images=${domChecks.imageCount}, broken=${domChecks.brokenImages}, blank=${domChecks.isBlankPage}`);

        // Take screenshots at each viewport
        const screenshots: Record<string, Buffer> = {};

        for (const vp of VIEWPORTS) {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.waitForTimeout(500); // let layout reflow

            const buffer = await page.screenshot({
                fullPage: vp.fullPage,
                type: "png",
            });
            screenshots[vp.name] = buffer;
            console.log(`   └─ 📸 Captured ${vp.name} (${vp.width}x${vp.height}${vp.fullPage ? " full-page" : ""})`);
        }

        await context.close();

        return {
            desktop: screenshots["desktop"],
            mobile: screenshots["mobile"],
            desktopFullPage: screenshots["desktopFullPage"],
            domChecks,
        };
    } finally {
        if (browser) {
            await browser.close().catch(() => {});
        }
        if (serverProcess) {
            serverProcess.kill("SIGTERM");
        }
    }
}
