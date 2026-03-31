import { AsyncLocalStorage } from "async_hooks";
import type { SSEEvent, StepId } from "./events";

type EmitFn = (event: SSEEvent) => void;

export const eventStorage = new AsyncLocalStorage<EmitFn>();

function emit(event: SSEEvent) {
    const fn = eventStorage.getStore();
    if (fn) fn(event);
    // Server-side debug log (plain text summary, never reaches client)
    const step = "step" in event ? ` | ${event.step}` : "";
    console.log(`[SSE] ${event.type}${step}`);
}

export const emitter = {
    stepStart: (step: StepId, iteration?: number) =>
        emit({ type: "step_start", step, iteration }),

    stepDone: (step: StepId, iteration?: number) =>
        emit({ type: "step_done", step, iteration }),

    stepFailed: (step: StepId, message: string, iteration?: number) =>
        emit({ type: "step_failed", step, message, iteration }),

    fileActivity: (step: StepId, filePath: string, action: "created" | "modified" | "read") =>
        emit({ type: "file_activity", step, filePath, action }),

    toolInvoked: (step: StepId, toolName: string) =>
        emit({ type: "tool_invoked", step, toolName }),

    info: (step: StepId, message: string) =>
        emit({ type: "info", step, message }),

    iterationStart: (iteration: number, maxIterations: number) =>
        emit({ type: "iteration_start", iteration, maxIterations }),

    score: (score: number, passed: boolean) =>
        emit({ type: "score", step: "qa_visual", score, passed }),

    done: (projectId: string) =>
        emit({ type: "done", projectId }),

    error: (message: string, fatal: boolean) =>
        emit({ type: "error", message, fatal }),

    connected: () =>
        emit({ type: "connected" }),
};
