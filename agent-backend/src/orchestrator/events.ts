export type StepId =
    | "pm"
    | "developer"
    | "qa_ts"
    | "qa_build"
    | "qa_visual"
    | "saving"
    | "edit_dev"
    | "edit_qa_ts"
    | "edit_qa_build";

export type StepStatus = "pending" | "active" | "done" | "failed" | "skipped";

export type SSEEvent =
    | { type: "step_start"; step: StepId; iteration?: number }
    | { type: "step_done"; step: StepId; iteration?: number }
    | { type: "step_failed"; step: StepId; message: string; iteration?: number }
    | { type: "file_activity"; step: StepId; filePath: string; action: "created" | "modified" | "read" }
    | { type: "tool_invoked"; step: StepId; toolName: string }
    | { type: "info"; step: StepId; message: string }
    | { type: "iteration_start"; iteration: number; maxIterations: number }
    | { type: "score"; step: "qa_visual"; score: number; passed: boolean }
    | { type: "done"; projectId: string }
    | { type: "error"; message: string; fatal: boolean }
    | { type: "connected" };
