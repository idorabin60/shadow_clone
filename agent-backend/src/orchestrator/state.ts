import { BaseMessage } from "@langchain/core/messages";

export interface OrchestrationState {
    /**
     * The business details submitted by the user.
     * e.g., Name, description, tone, target audience.
     */
    businessInput: any;

    /**
     * The UUID of the current isolated sandbox.
     */
    sandboxPath: string;

    /**
     * Current execution status: "planning", "coding", "qa", "success", "failed"
     */
    status: string;

    /**
     * Shared message history for the LLMs.
     */
    messages: BaseMessage[];

    /**
     * The latest compiler/error logs from the QA run.
     */
    errorLogs: string | null;

    /**
     * Counter to prevent infinite loops (Dev <-> QA)
     */
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
