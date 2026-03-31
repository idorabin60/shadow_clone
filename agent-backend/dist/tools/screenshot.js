"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeScreenshots = takeScreenshots;
const playwright_1 = require("playwright");
const child_process_1 = require("child_process");
const VIEWPORTS = [
    { name: "desktop", width: 1440, height: 900, fullPage: false },
    { name: "mobile", width: 375, height: 812, fullPage: false },
    { name: "desktopFullPage", width: 1440, height: 900, fullPage: true },
];
/**
 * Starts the Vite preview server in the sandbox and waits for it to be ready.
 * Returns the child process and the resolved URL.
 */
function startPreviewServer(sandboxPath) {
    return new Promise((resolve, reject) => {
        const serverProcess = (0, child_process_1.spawn)("npx", ["vite", "preview", "--port", "0", "--host", "127.0.0.1"], {
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
        serverProcess.stdout?.on("data", (data) => {
            const chunk = data.toString();
            stdout += chunk;
            // Vite preview outputs something like: ➜  Local:   http://localhost:4173/
            const urlMatch = stdout.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
                clearTimeout(timeout);
                resolve({ process: serverProcess, url: urlMatch[0] });
            }
        });
        serverProcess.stderr?.on("data", (data) => {
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
async function runDomChecks(page) {
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
    return await page.evaluate(domScript);
}
/**
 * Takes screenshots of the built site at multiple viewports.
 * Starts a Vite preview server, captures with Playwright, then cleans up.
 */
async function takeScreenshots(sandboxPath) {
    console.log("   └─ 📸 Starting Vite preview server for screenshots...");
    let serverProcess = null;
    let browser = null;
    try {
        // Start preview server
        const server = await startPreviewServer(sandboxPath);
        serverProcess = server.process;
        console.log(`   └─ 📸 Preview server ready at ${server.url}`);
        // Launch headless browser
        browser = await playwright_1.chromium.launch({ headless: true });
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
        const screenshots = {};
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
    }
    finally {
        if (browser) {
            await browser.close().catch(() => { });
        }
        if (serverProcess) {
            serverProcess.kill("SIGTERM");
        }
    }
}
