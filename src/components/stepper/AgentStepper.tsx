"use client";
import { Circle, CheckCircle2, XCircle, Loader2, FileCode } from "lucide-react";
import { LiveTimer } from "./LiveTimer";
import type { StepState } from "@/types/events";

function formatDuration(ms: number): string {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    if (mins > 0) return `${mins}:${String(remainSecs).padStart(2, "0")}`;
    return `${secs}s`;
}

function StepIcon({ status }: { status: StepState["status"] }) {
    switch (status) {
        case "done":
            return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        case "active":
            return <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />;
        case "failed":
            return <XCircle className="w-4 h-4 text-red-400" />;
        default:
            return <Circle className="w-4 h-4 text-zinc-700" />;
    }
}

export function AgentStepper({ steps }: { steps: StepState[] }) {
    return (
        <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-[#0F0F0F]">
            {steps.map((step, i) => (
                <div
                    key={step.id}
                    className={`flex items-start gap-3 px-4 py-3 ${
                        i < steps.length - 1 ? "border-b border-white/[0.04]" : ""
                    }`}
                >
                    <div className="mt-0.5 shrink-0">
                        <StepIcon status={step.status} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span
                                className={`text-[13px] font-medium ${
                                    step.status === "active"
                                        ? "text-zinc-200"
                                        : step.status === "done"
                                        ? "text-zinc-400"
                                        : step.status === "failed"
                                        ? "text-red-400"
                                        : "text-zinc-600"
                                }`}
                            >
                                {step.label}
                            </span>
                            <div className="shrink-0">
                                {step.status === "active" && step.startedAt && (
                                    <LiveTimer startedAt={step.startedAt} />
                                )}
                                {(step.status === "done" || step.status === "failed") && step.duration != null && (
                                    <span className="text-[11px] text-zinc-600 font-mono tabular-nums">
                                        {formatDuration(step.duration)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {step.iteration != null && step.iteration > 1 && (
                            <span className="text-[10px] text-violet-400/70 mt-0.5 block">
                                ניסיון {step.iteration}
                            </span>
                        )}

                        {step.score && (
                            <span
                                className={`text-[11px] mt-0.5 block ${
                                    step.score.passed ? "text-emerald-400/70" : "text-amber-400/70"
                                }`}
                            >
                                ציון: {step.score.value}/10
                            </span>
                        )}

                        {step.status === "failed" && step.message && (
                            <span className="text-[11px] text-red-400/70 mt-0.5 block">
                                {step.message}
                            </span>
                        )}

                        {step.files.length > 0 && (step.status === "active" || step.status === "done") && (
                            <div className="mt-1.5 space-y-0.5">
                                {step.files.slice(-8).map((f) => (
                                    <div
                                        key={f}
                                        className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5"
                                    >
                                        <FileCode className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
