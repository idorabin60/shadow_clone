"use strict";
/**
 * 21st.dev Magic API Client
 *
 * Direct HTTP calls to 21st.dev's component library API.
 * No MCP server process needed — these are plain REST endpoints.
 *
 * Two endpoints used:
 *   - POST /api/fetch-ui  — search for component inspiration (code references)
 *   - POST /api/refine-ui — refine an existing component given feedback
 *
 * Auth: x-api-key header with TWENTYFIRST_API_KEY from env.
 * Graceful degradation: if API is unavailable, returns empty/null — pipeline continues.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchComponents = searchComponents;
exports.refineComponent = refineComponent;
const logger_1 = require("../lib/logger");
const API_BASE = 'https://magic.21st.dev';
const TIMEOUT_MS = 15_000;
let _keyLogged = false;
function getApiKey() {
    const key = process.env.TWENTYFIRST_API_KEY || null;
    if (!_keyLogged) {
        _keyLogged = true;
        if (key) {
            (0, logger_1.log)('MAGIC', 'api_key_loaded', { keyPrefix: key.slice(0, 6) + '...' });
        }
        else {
            (0, logger_1.log)('MAGIC', 'api_key_missing', { hint: 'Set TWENTYFIRST_API_KEY in .env to enable 21st.dev component inspiration' });
        }
    }
    return key;
}
// ─── Fetch with timeout ────────��──────────────────���─────────────────────────
async function fetchWithTimeout(url, options, timeoutMs = TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    }
    finally {
        clearTimeout(timer);
    }
}
// ─── Search for component inspiration ───────────────────────────────────────
/**
 * Search 21st.dev for component inspiration matching a query.
 * Returns code snippets of matching components.
 *
 * @param query - e.g. "hero section dark editorial" or "pricing table minimal"
 * @returns Inspiration results, or empty if API unavailable
 */
async function searchComponents(query) {
    const apiKey = getApiKey();
    const empty = { query, results: [] };
    if (!apiKey) {
        (0, logger_1.log)('MAGIC', 'skip_no_key', { query });
        return empty;
    }
    const startMs = Date.now();
    (0, logger_1.log)('MAGIC', 'search_start', { query });
    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/fetch-ui`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                message: query,
                searchQuery: query,
            }),
        });
        if (!res.ok) {
            const errorBody = await res.text().catch(() => '');
            (0, logger_1.log)('MAGIC', 'search_error', { query, status: res.status, body: errorBody.slice(0, 300), elapsedMs: Date.now() - startMs });
            return empty;
        }
        const data = await res.json();
        // The API returns component data in various formats.
        // Extract what we can into a normalized shape.
        const results = [];
        if (typeof data === 'string') {
            // Sometimes returns raw text with component code
            results.push({ name: 'reference', code: data, dependencies: [] });
        }
        else if (data?.text && typeof data.text === 'string') {
            // Direct API response: { text: "JSON-stringified array of components" }
            // Parse the inner JSON to extract actual component code.
            try {
                const items = JSON.parse(data.text);
                if (Array.isArray(items)) {
                    for (const item of items) {
                        // Prefer componentCode (full source), fall back to demoCode
                        const code = item?.componentCode || item?.demoCode || '';
                        // Extract registryDependencies — npm packages this component needs
                        const deps = Array.isArray(item?.registryDependencies)
                            ? item.registryDependencies.filter((d) => typeof d === 'string')
                            : [];
                        if (code.length > 50) {
                            results.push({
                                name: item?.componentName || item?.demoName || 'reference',
                                code,
                                dependencies: deps,
                            });
                        }
                    }
                }
            }
            catch {
                // Not JSON — use raw text as fallback
                if (data.text.length > 50) {
                    results.push({ name: 'reference', code: data.text, dependencies: [] });
                }
            }
        }
        else if (data?.content) {
            // MCP-style response: { content: [{ type: "text", text: "..." }] }
            const items = Array.isArray(data.content) ? data.content : [data.content];
            for (const item of items) {
                const text = typeof item === 'string' ? item : item?.text ?? '';
                if (text.length > 50) {
                    results.push({ name: 'reference', code: text, dependencies: [] });
                }
            }
        }
        else if (Array.isArray(data)) {
            for (const item of data) {
                if (item?.code || item?.content) {
                    results.push({
                        name: item.name || item.title || 'reference',
                        code: item.code || item.content,
                        dependencies: Array.isArray(item?.registryDependencies) ? item.registryDependencies : [],
                    });
                }
            }
        }
        (0, logger_1.log)('MAGIC', 'search_done', {
            query,
            results: results.length,
            elapsedMs: Date.now() - startMs,
        });
        return { query, results };
    }
    catch (err) {
        (0, logger_1.log)('MAGIC', 'search_error', {
            query,
            error: err.name === 'AbortError' ? 'timeout' : err.message,
            elapsedMs: Date.now() - startMs,
        });
        return empty;
    }
}
// ─── Refine an existing component ──────────���────────────────────────────────
/**
 * Send a component to 21st.dev for refinement based on feedback.
 *
 * @param currentCode - Current component source code
 * @param feedback - What to improve (e.g. QA visual feedback)
 * @param context - Additional context about the component
 * @returns Refined component code, or null if API unavailable
 */
async function refineComponent(currentCode, feedback, context) {
    const apiKey = getApiKey();
    if (!apiKey) {
        (0, logger_1.log)('MAGIC', 'refine_skip_no_key', {});
        return null;
    }
    const startMs = Date.now();
    (0, logger_1.log)('MAGIC', 'refine_start', { feedbackChars: feedback.length, codeChars: currentCode.length });
    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/refine-ui`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                userMessage: feedback,
                fileContent: currentCode,
                context,
            }),
        });
        if (!res.ok) {
            (0, logger_1.log)('MAGIC', 'refine_error', { status: res.status, elapsedMs: Date.now() - startMs });
            return null;
        }
        const data = await res.json();
        // Extract refined code from response
        let refined = null;
        if (typeof data === 'string') {
            refined = data;
        }
        else if (data?.text && typeof data.text === 'string') {
            refined = data.text;
        }
        else if (data?.content) {
            const items = Array.isArray(data.content) ? data.content : [data.content];
            for (const item of items) {
                const text = typeof item === 'string' ? item : item?.text ?? '';
                if (text.length > 50) {
                    refined = text;
                    break;
                }
            }
        }
        (0, logger_1.log)('MAGIC', 'refine_done', {
            success: !!refined,
            refinedChars: refined?.length ?? 0,
            elapsedMs: Date.now() - startMs,
        });
        return refined;
    }
    catch (err) {
        (0, logger_1.log)('MAGIC', 'refine_error', {
            error: err.name === 'AbortError' ? 'timeout' : err.message,
            elapsedMs: Date.now() - startMs,
        });
        return null;
    }
}
