/**
 * Structured logger for the agent pipeline.
 * Every line is: [ISO_TIMESTAMP] [PHASE] event | key=value key=value
 * This format is scannable by eye and parseable by log aggregators.
 */

export type LogPhase =
    | 'PM'
    | 'DEV'
    | 'QA_TS'
    | 'QA_BUILD'
    | 'QA_VISUAL'
    | 'MASK'
    | 'MEMORY'
    | 'XML'
    | 'GUARD'
    | 'ROUTE'
    | 'TOOLS';

type LogData = Record<string, string | number | boolean | string[] | null | undefined>;

function formatData(data: LogData): string {
    return Object.entries(data)
        .map(([k, v]) => {
            if (Array.isArray(v)) return `${k}=[${v.join(',')}]`;
            if (v === null || v === undefined) return `${k}=null`;
            return `${k}=${v}`;
        })
        .join(' ');
}

export const log = (phase: LogPhase | string, event: string, data?: LogData): void => {
    const ts = new Date().toISOString();
    const dataPart = data && Object.keys(data).length > 0 ? ` | ${formatData(data)}` : '';
    console.log(`[${ts}] [${phase}] ${event}${dataPart}`);
};

// ─── Timeout utility ─────────────────────────────────────────────────────────
// Used by graph nodes to ensure LLM calls don't hang indefinitely.

export class TimeoutError extends Error {
    constructor(public readonly phase: string, public readonly limitMs: number) {
        super(`[${phase}] Timed out after ${limitMs}ms`);
        this.name = 'TimeoutError';
    }
}

/**
 * Race a promise against a timeout. Rejects with TimeoutError if the limit is exceeded.
 * If timeoutMs is 0 or undefined, runs without timeout.
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number | undefined,
    phase: string
): Promise<T> {
    if (!timeoutMs) return promise;

    let timer: NodeJS.Timeout;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new TimeoutError(phase, timeoutMs)), timeoutMs);
    });

    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timer!);
    }
}

// ─── Cost tracking ───────────────────────────────────────────────────────────
// Accumulates token usage and estimated USD cost across nodes in a single run.

const COST_PER_1M: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-6': { input: 3.0, output: 15.0 },
    'claude-opus-4-6': { input: 15.0, output: 75.0 },
    'gpt-4o': { input: 2.5, output: 10.0 },
};

export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    estimatedCostUSD: number;
}

/** Mutable accumulator — one per pipeline run. */
export class CostTracker {
    private entries: { phase: string; model: string; usage: TokenUsage }[] = [];

    /** Record token usage from an LLM response's usage_metadata field. */
    record(phase: string, model: string, usageMeta: { input_tokens?: number; output_tokens?: number } | undefined) {
        if (!usageMeta) return;
        const inp = usageMeta.input_tokens ?? 0;
        const out = usageMeta.output_tokens ?? 0;
        const rates = COST_PER_1M[model] ?? { input: 5.0, output: 15.0 };
        const cost = (inp * rates.input + out * rates.output) / 1_000_000;
        const usage: TokenUsage = { inputTokens: inp, outputTokens: out, estimatedCostUSD: cost };
        this.entries.push({ phase, model, usage });
        log('COST', 'recorded', {
            phase, model,
            inputTokens: inp,
            outputTokens: out,
            costUSD: Number(cost.toFixed(4)),
        });
    }

    /** Total across all recorded calls. */
    total(): TokenUsage {
        return this.entries.reduce(
            (acc, e) => ({
                inputTokens: acc.inputTokens + e.usage.inputTokens,
                outputTokens: acc.outputTokens + e.usage.outputTokens,
                estimatedCostUSD: acc.estimatedCostUSD + e.usage.estimatedCostUSD,
            }),
            { inputTokens: 0, outputTokens: 0, estimatedCostUSD: 0 },
        );
    }
};
