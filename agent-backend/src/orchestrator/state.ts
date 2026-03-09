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
