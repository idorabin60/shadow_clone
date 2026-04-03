"use strict";
/**
 * Structured logger for the agent pipeline.
 * Every line is: [ISO_TIMESTAMP] [PHASE] event | key=value key=value
 * This format is scannable by eye and parseable by log aggregators.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostTracker = exports.TimeoutError = exports.log = void 0;
exports.withTimeout = withTimeout;
function formatData(data) {
    return Object.entries(data)
        .map(([k, v]) => {
        if (Array.isArray(v))
            return `${k}=[${v.join(',')}]`;
        if (v === null || v === undefined)
            return `${k}=null`;
        return `${k}=${v}`;
    })
        .join(' ');
}
const log = (phase, event, data) => {
    const ts = new Date().toISOString();
    const dataPart = data && Object.keys(data).length > 0 ? ` | ${formatData(data)}` : '';
    console.log(`[${ts}] [${phase}] ${event}${dataPart}`);
};
exports.log = log;
// ─── Timeout utility ─────────────────────────────────────────────────────────
// Used by graph nodes to ensure LLM calls don't hang indefinitely.
class TimeoutError extends Error {
    phase;
    limitMs;
    constructor(phase, limitMs) {
        super(`[${phase}] Timed out after ${limitMs}ms`);
        this.phase = phase;
        this.limitMs = limitMs;
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
/**
 * Race a promise against a timeout. Rejects with TimeoutError if the limit is exceeded.
 * If timeoutMs is 0 or undefined, runs without timeout.
 */
async function withTimeout(promise, timeoutMs, phase) {
    if (!timeoutMs)
        return promise;
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new TimeoutError(phase, timeoutMs)), timeoutMs);
    });
    try {
        return await Promise.race([promise, timeout]);
    }
    finally {
        clearTimeout(timer);
    }
}
// ─── Cost tracking ───────────────────────────────────────────────────────────
// Accumulates token usage and estimated USD cost across nodes in a single run.
const COST_PER_1M = {
    'claude-sonnet-4-6': { input: 3.0, output: 15.0 },
    'claude-opus-4-6': { input: 15.0, output: 75.0 },
    'gpt-4o': { input: 2.5, output: 10.0 },
};
/** Mutable accumulator — one per pipeline run. */
class CostTracker {
    entries = [];
    /** Record token usage from an LLM response's usage_metadata field. */
    record(phase, model, usageMeta) {
        if (!usageMeta)
            return;
        const inp = usageMeta.input_tokens ?? 0;
        const out = usageMeta.output_tokens ?? 0;
        const rates = COST_PER_1M[model] ?? { input: 5.0, output: 15.0 };
        const cost = (inp * rates.input + out * rates.output) / 1_000_000;
        const usage = { inputTokens: inp, outputTokens: out, estimatedCostUSD: cost };
        this.entries.push({ phase, model, usage });
        (0, exports.log)('COST', 'recorded', {
            phase, model,
            inputTokens: inp,
            outputTokens: out,
            costUSD: Number(cost.toFixed(4)),
        });
    }
    /** Total across all recorded calls. */
    total() {
        return this.entries.reduce((acc, e) => ({
            inputTokens: acc.inputTokens + e.usage.inputTokens,
            outputTokens: acc.outputTokens + e.usage.outputTokens,
            estimatedCostUSD: acc.estimatedCostUSD + e.usage.estimatedCostUSD,
        }), { inputTokens: 0, outputTokens: 0, estimatedCostUSD: 0 });
    }
}
exports.CostTracker = CostTracker;
;
