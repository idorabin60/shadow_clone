/**
 * Context Manager — token-aware message pruning.
 *
 * Replaces the old char-count-based maskMessages (which used message count as
 * a proxy for context size — inaccurate). This module estimates tokens directly
 * and prunes to a hard budget, so we never silently overflow the context window.
 *
 * Token estimation: 1 token ≈ 3.5 chars (conservative).
 * Hebrew tokenizes less efficiently than Latin, so 3.5 is intentional.
 *
 * Pruning priority (highest to lowest):
 *  1. KEEP ALWAYS: msgs[0] (seed), pinned __anchor msg, last RECENT_WINDOW msgs
 *  2. COMPRESS: old ToolMessages → 1-line stubs (QA errors are in system prompt)
 *  3. COMPRESS: old large HumanMessages → 1-line stubs
 *  4. KEEP: old AIMessages verbatim (reasoning chain must not be lost)
 *  5. DROP: orphaned leading ToolMessages (Anthropic rejects these)
 */

import { BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { log } from '../lib/logger';

/**
 * Target token budget for the message history passed to the LLM.
 * Claude Opus context window is 200k tokens.
 * We reserve 60k for messages, leaving ~140k for system prompt + spec.md + response.
 */
export const TOKEN_BUDGET = 60_000;

const CHARS_PER_TOKEN = 3.5;
const RECENT_WINDOW = 20;

const TOOL_STUB = (name: string) =>
    `[Tool output from '${name}' — omitted to save context. Re-invoke if needed.]`;

/** Normalise BaseMessage content to a plain string. */
export function getContentString(m: { content: unknown }): string {
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) {
        return (m.content as Array<{ type: string; text?: string }>)
            .filter(b => b.type === "text")
            .map(b => b.text ?? "")
            .join("\n");
    }
    return "";
}

/** Estimate token count for a list of messages. */
export function estimateTokens(msgs: BaseMessage[]): number {
    const chars = msgs.reduce((s, m) => s + getContentString(m).length, 0);
    return Math.ceil(chars / CHARS_PER_TOKEN);
}

/**
 * Prune message history to fit within the token budget.
 * Returns the original array unchanged if already within budget.
 */
export function pruneToTokenBudget(
    msgs: BaseMessage[],
    budget: number = TOKEN_BUDGET
): BaseMessage[] {
    const beforeTokens = estimateTokens(msgs);
    const beforeCount = msgs.length;

    if (beforeTokens <= budget) {
        log('MASK', 'skipped', { msgs: beforeCount, tokens: beforeTokens, budget });
        return msgs;
    }

    log('MASK', 'pruning_start', { msgs: beforeCount, tokens: beforeTokens, budget });

    const first = msgs[0];
    const pinnedAnchor = msgs.find(
        m => (m.additional_kwargs as any)?.__anchor === true
    );
    log('MASK', 'anchor', { found: !!pinnedAnchor });

    // Verbatim window: always keep the last RECENT_WINDOW messages
    const oldMsgs = msgs.slice(1, msgs.length - RECENT_WINDOW);
    const recentMsgs = msgs.slice(msgs.length - RECENT_WINDOW);
    log('MASK', 'split', { toCompress: oldMsgs.length, verbatim: recentMsgs.length });

    let compressedTools = 0;
    let compressedHuman = 0;
    let keptAi = 0;

    const maskedOld = oldMsgs.map(m => {
        // ToolMessage → always compress (tool outputs can be thousands of chars)
        if (m instanceof ToolMessage) {
            compressedTools++;
            const tm = m as any;
            return new ToolMessage({
                content: TOOL_STUB(tm.name ?? 'tool'),
                name: tm.name,
                tool_call_id: tm.tool_call_id,
            });
        }
        // Large HumanMessage → compress (QA errors re-injected into system prompt each iteration)
        if (m instanceof HumanMessage && getContentString(m).length > 500) {
            compressedHuman++;
            return new HumanMessage(
                '[Previous QA/tool feedback — omitted. Current errors are in the system prompt.]'
            );
        }
        // AIMessage → always keep verbatim (preserves reasoning chain)
        keptAi++;
        return m;
    });

    // Drop orphaned leading ToolMessages — Anthropic rejects conversations starting with tool role
    let droppedLeading = 0;
    while (maskedOld.length > 0 && maskedOld[0] instanceof ToolMessage) {
        maskedOld.shift();
        droppedLeading++;
    }

    const result: BaseMessage[] = [first];
    if (pinnedAnchor && !recentMsgs.includes(pinnedAnchor)) {
        result.push(pinnedAnchor);
    }
    result.push(...maskedOld, ...recentMsgs);

    const afterTokens = estimateTokens(result);

    log('MASK', 'result', {
        msgsIn: beforeCount,
        msgsOut: result.length,
        tokensIn: beforeTokens,
        tokensOut: afterTokens,
        reductionPct: Math.round((1 - afterTokens / beforeTokens) * 100),
        compressedTools,
        compressedHuman,
        keptAi,
        droppedLeading,
    });

    return result;
}
