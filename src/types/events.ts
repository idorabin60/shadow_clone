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

export interface StepState {
    id: StepId;
    label: string;
    status: StepStatus;
    startedAt?: number;
    duration?: number;
    files: string[];
    iteration?: number;
    message?: string;
    score?: { value: number; passed: boolean };
}

export const CREATE_STEPS: { id: StepId; label: string }[] = [
    { id: "pm", label: "מנתח דרישות ומתכנן עיצוב" },
    { id: "developer", label: "כותב קוד React" },
    { id: "qa_ts", label: "בודק TypeScript" },
    { id: "qa_build", label: "בונה את הפרויקט" },
    { id: "qa_visual", label: "סוקר עיצוב ויזואלי" },
    { id: "saving", label: "שומר קבצים" },
];

export const EDIT_STEPS: { id: StepId; label: string }[] = [
    { id: "edit_dev", label: "עורך קוד" },
    { id: "edit_qa_ts", label: "בודק TypeScript" },
    { id: "edit_qa_build", label: "בונה את הפרויקט" },
    { id: "saving", label: "שומר קבצים" },
];
