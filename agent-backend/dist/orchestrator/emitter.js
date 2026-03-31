"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = exports.eventStorage = void 0;
const async_hooks_1 = require("async_hooks");
exports.eventStorage = new async_hooks_1.AsyncLocalStorage();
function emit(event) {
    const fn = exports.eventStorage.getStore();
    if (fn)
        fn(event);
    // Server-side debug log (plain text summary, never reaches client)
    const step = "step" in event ? ` | ${event.step}` : "";
    console.log(`[SSE] ${event.type}${step}`);
}
exports.emitter = {
    stepStart: (step, iteration) => emit({ type: "step_start", step, iteration }),
    stepDone: (step, iteration) => emit({ type: "step_done", step, iteration }),
    stepFailed: (step, message, iteration) => emit({ type: "step_failed", step, message, iteration }),
    fileActivity: (step, filePath, action) => emit({ type: "file_activity", step, filePath, action }),
    toolInvoked: (step, toolName) => emit({ type: "tool_invoked", step, toolName }),
    info: (step, message) => emit({ type: "info", step, message }),
    iterationStart: (iteration, maxIterations) => emit({ type: "iteration_start", iteration, maxIterations }),
    score: (score, passed) => emit({ type: "score", step: "qa_visual", score, passed }),
    done: (projectId) => emit({ type: "done", projectId }),
    error: (message, fatal) => emit({ type: "error", message, fatal }),
    connected: () => emit({ type: "connected" }),
};
