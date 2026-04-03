import { BaseMessage } from "@langchain/core/messages";
import { z } from "zod";

/**
 * Validated shape of the business input submitted by the user.
 * Uses .passthrough() so unknown fields from the frontend don't fail validation.
 */
export const BusinessInputSchema = z.object({
    businessName: z.string().min(1),
    projectId: z.string().optional(),
    description: z.string().optional(),
    tone: z.string().optional(),
    targetAudience: z.string().optional(),
    services: z.array(z.string()).optional(),
}).passthrough();

export type BusinessInput = z.infer<typeof BusinessInputSchema>;

/** Discrete pipeline stages — no arbitrary strings. */
export type OrchestrationStatus =
    | 'planning'
    | 'coding'
    | 'qa'
    | 'success'
    | 'failed';

export interface OrchestrationState {
    /** Validated business details submitted by the user. */
    businessInput: BusinessInput;

    /** Absolute path to the isolated sandbox directory, e.g. /tmp/sites/{uuid} */
    sandboxPath: string;

    /** Current pipeline stage. */
    status: OrchestrationStatus;

    /** Shared message history passed between nodes. */
    messages: BaseMessage[];

    /** Latest compiler/QA error logs. Null when the last QA pass succeeded. */
    errorLogs: string | null;

    /** Dev↔QA loop iteration counter. Prevents infinite loops (max 6). */
    iterationCount: number;
}

export interface EditState {
    /** The sandbox path for the edit session */
    sandboxPath: string;

    /** Supabase project ID */
    projectId: string;

    /** The user's edit request (e.g., "change the hero background to blue") */
    userRequest: string;

    /** Conversation history for multi-turn edits */
    messages: BaseMessage[];

    /** Current execution status */
    status: string;

    /** The latest compiler/error logs */
    errorLogs: string | null;

    /** Counter to prevent infinite loops */
    iterationCount: number;
}
