"use client"
import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, Monitor, Smartphone, Tablet, ArrowUp, Folder, ChevronLeft, Eye, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useWebContainer } from "@/hooks/useWebContainer";
import { AgentStepper } from "@/components/stepper/AgentStepper";
import type { SSEEvent, StepState } from "@/types/events";
import { CREATE_STEPS, EDIT_STEPS } from "@/types/events";

interface BusinessInput {
    businessName: string;
    businessType: string;
    description: string;
    uniqueSellingProposition?: string;
    services: string[];
    tone?: "professional" | "friendly" | "luxury" | "casual";
}

interface ChatMessage {
    role: "user" | "agent";
    content: string;
    timestamp: Date;
}

function WorkspaceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPrompt = searchParams.get("prompt") || "";

    const [isLoading, setIsLoading] = useState(false);
    const [sandboxId, setSandboxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { mountAndRun, updateFiles, devServerUrl, webLogs } = useWebContainer();

    const [chatInput, setChatInput] = useState("");
    const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const hasStartedInitialGen = useRef(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
    const [steps, setSteps] = useState<StepState[]>([]);

    const supabase = createClient();
    const [projects, setProjects] = useState<any[]>([]);

    const initSteps = useCallback((templates: { id: StepState["id"]; label: string }[]): StepState[] => {
        return templates.map((t) => ({
            id: t.id,
            label: t.label,
            status: "pending" as const,
            files: [],
        }));
    }, []);

    const reduceEvent = useCallback((event: SSEEvent) => {
        setSteps((prev) => {
            const next = prev.map((s) => ({ ...s }));
            switch (event.type) {
                case "step_start": {
                    const s = next.find((x) => x.id === event.step);
                    if (s) {
                        s.status = "active";
                        s.startedAt = Date.now();
                        s.duration = undefined;
                        if (event.iteration != null) s.iteration = event.iteration;
                    }
                    return next;
                }
                case "step_done": {
                    const s = next.find((x) => x.id === event.step);
                    if (s) {
                        s.status = "done";
                        if (s.startedAt) s.duration = Date.now() - s.startedAt;
                    }
                    return next;
                }
                case "step_failed": {
                    const s = next.find((x) => x.id === event.step);
                    if (s) {
                        s.status = "failed";
                        s.message = event.message;
                        if (s.startedAt) s.duration = Date.now() - s.startedAt;
                    }
                    return next;
                }
                case "file_activity": {
                    const s = next.find((x) => x.id === event.step);
                    if (s && !s.files.includes(event.filePath)) {
                        s.files = [...s.files, event.filePath];
                    }
                    return next;
                }
                case "score": {
                    const s = next.find((x) => x.id === "qa_visual");
                    if (s) s.score = { value: event.score, passed: event.passed };
                    return next;
                }
                case "iteration_start": {
                    // Reset QA steps to pending for a new iteration
                    for (const s of next) {
                        if (["qa_ts", "qa_build", "qa_visual", "developer"].includes(s.id)) {
                            s.status = "pending";
                            s.startedAt = undefined;
                            s.duration = undefined;
                            s.message = undefined;
                            s.files = [];
                        }
                    }
                    return next;
                }
                default:
                    return prev;
            }
        });
    }, []);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (data) setProjects(data);
            }
        };
        fetchProjects();
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, steps]);

    useEffect(() => {
        if (initialPrompt && !hasStartedInitialGen.current) {
            hasStartedInitialGen.current = true;

            // Always show the initial prompt as a user message
            setChatMessages([{ role: "user", content: initialPrompt, timestamp: new Date() }]);

            // Check cache — try to reload from Supabase if cached
            const cachedData = localStorage.getItem(`shadow_clone_gen_${initialPrompt}`);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    if (parsed.hasFiles && parsed.sandboxId) {
                        setSandboxId(parsed.sandboxId);
                        // Reload files from DB into WebContainer
                        (async () => {
                            const { data: projData } = await supabase.from('projects').select('files').eq('id', parsed.sandboxId).single();
                            if (projData?.files) {
                                setChatMessages(prev => [...prev, { role: "agent", content: "טוען פרויקט קיים...", timestamp: new Date() }]);
                                await mountAndRun(projData.files);
                                setChatMessages(prev => [...prev, { role: "agent", content: "הדף נטען בהצלחה!", timestamp: new Date() }]);
                            } else {
                                // Cached entry is stale, regenerate
                                localStorage.removeItem(`shadow_clone_gen_${initialPrompt}`);
                                generateLandingPage(initialPrompt);
                            }
                        })();
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse cached data", e);
                }
            }
            generateLandingPage(initialPrompt);
        }
    }, [initialPrompt, hasStartedInitialGen]);

    useEffect(() => {
        if (devServerUrl && initialPrompt && sandboxId) {
            localStorage.setItem(`shadow_clone_gen_${initialPrompt}`, JSON.stringify({
                hasFiles: true,
                sandboxId,
            }));
        }
    }, [devServerUrl, initialPrompt, sandboxId]);

    const subscribeSSE = useCallback((sseUrl: string, onDone: (projectId: string) => void) => {
        const eventSource = new EventSource(sseUrl);

        eventSource.onmessage = (event) => {
            try {
                const data: SSEEvent = JSON.parse(event.data);
                reduceEvent(data);

                if (data.type === "done") {
                    onDone(data.projectId);
                    eventSource.close();
                } else if (data.type === "error" && data.fatal) {
                    eventSource.close();
                    setIsLoading(false);
                    setError("הסוכן נתקל בשגיאה: " + data.message);
                }
            } catch (e) {
                console.error("SSE Parse error:", e);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setIsLoading(false);
            setError("נותק קשר משרת הסוכנים.");
        };

        return eventSource;
    }, [reduceEvent]);

    const generateLandingPage = async (text: string) => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError(null);
        setSteps(initSteps(CREATE_STEPS));

        const inputData: BusinessInput = {
            businessName: "העסק שלי",
            businessType: "כללי",
            description: text,
            uniqueSellingProposition: "שירות מקצועי.",
            services: [],
            tone: "professional"
        };

        let newProjectId: string | undefined;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error: dbError } = await supabase
                    .from('projects')
                    .insert({ name: text, user_id: user.id })
                    .select('id')
                    .single();
                if (data) {
                    newProjectId = data.id;
                    setProjects(prev => [{ ...data, created_at: new Date().toISOString() }, ...prev]);
                }
            }

            const response = await fetch("http://localhost:4000/api/orchestrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...inputData, projectId: newProjectId }),
            });

            if (!response.ok) {
                throw new Error("שגיאה בתקשורת מול השרת.");
            }

            const { sandboxId: newSandboxId } = await response.json();
            setSandboxId(newSandboxId);

            subscribeSSE(
                `http://localhost:4000/api/orchestrate/stream/${newSandboxId}`,
                async (projectId) => {
                    const { data: projData } = await supabase.from('projects').select('files').eq('id', projectId).single();
                    if (projData?.files) {
                        await mountAndRun(projData.files);
                    }
                    setIsLoading(false);
                    setChatMessages(prev => [
                        ...prev,
                        { role: "agent", content: "הדף נוצר בהצלחה! אפשר לראות את התצוגה המקדימה בצד שמאל.", timestamp: new Date() }
                    ]);
                }
            );

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isLoading || !sandboxId) return;
        const userMessage = chatInput;
        setChatInput("");
        setChatMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);

        setIsLoading(true);
        setError(null);
        setSteps(initSteps(EDIT_STEPS));

        try {
            const response = await fetch("http://localhost:4000/api/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId: sandboxId, userRequest: userMessage }),
            });

            if (!response.ok) throw new Error("שגיאה בתקשורת מול השרת.");

            const { sandboxId: editSandboxId } = await response.json();

            subscribeSSE(
                `http://localhost:4000/api/orchestrate/stream/${editSandboxId}`,
                async (projectId) => {
                    const { data: projData } = await supabase.from('projects').select('files').eq('id', projectId).single();
                    if (projData?.files) {
                        await updateFiles(projData.files);
                    }
                    setIsLoading(false);
                    setChatMessages(prev => [
                        ...prev,
                        { role: "agent", content: "השינויים בוצעו בהצלחה! התצוגה עודכנה.", timestamp: new Date() }
                    ]);
                }
            );
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0A0A0A] text-white overflow-hidden" dir="rtl">

            {/* CHAT PANEL */}
            <div className="w-[420px] lg:w-[480px] shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0A0A0A]">

                {/* Header */}
                <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.06]">
                    <button
                        onClick={() => router.push('/')}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                        shadow clone
                    </div>
                    {projects.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <Folder className="w-4 h-4" />
                            </button>
                            {showProjectSwitcher && (
                                <div className="absolute left-0 top-8 w-64 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl z-50 py-2 max-h-[300px] overflow-y-auto">
                                    <div className="px-3 py-1.5 text-[11px] text-zinc-600 font-medium">פרויקטים</div>
                                    {projects.map((proj) => (
                                        <button
                                            key={proj.id}
                                            onClick={async () => {
                                                setShowProjectSwitcher(false);
                                                setSandboxId(proj.id);
                                                setSteps([]);
                                                setChatMessages([{ role: "agent", content: `טוען פרויקט: ${proj.name}`, timestamp: new Date() }]);
                                                const { data: dbData } = await supabase.from('projects').select('files').eq('id', proj.id).single();
                                                if (dbData?.files) {
                                                    await mountAndRun(dbData.files);
                                                    setChatMessages(prev => [...prev, { role: "agent", content: "הפרויקט נטען בהצלחה!", timestamp: new Date() }]);
                                                }
                                            }}
                                            className={`w-full text-right px-3 py-2 text-sm truncate hover:bg-white/[0.04] transition-colors flex items-center gap-2 ${sandboxId === proj.id ? "text-white" : "text-zinc-400"}`}
                                        >
                                            <Folder className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
                                            <span className="truncate">{proj.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-5 space-y-6">

                        {/* Render chat messages */}
                        {chatMessages.map((msg, i) => (
                            <div key={i}>
                                {msg.role === "user" ? (
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold text-white">א</span>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-zinc-500 mb-1">אתה</div>
                                            <div className="text-[13px] text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/[0.06]">
                                            <Sparkles className="w-3 h-3 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] text-zinc-500 mb-1">shadow clone</div>
                                            <div className="text-[13px] text-zinc-300 leading-relaxed">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Active generation — stepper */}
                        {isLoading && steps.length > 0 && (
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/[0.06]">
                                    <Sparkles className="w-3 h-3 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[11px] text-zinc-500 mb-2">shadow clone</div>
                                    <AgentStepper steps={steps} />
                                </div>
                            </div>
                        )}

                        {/* Error display */}
                        {error && (
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-red-500/20">
                                    <span className="text-red-400 text-xs">!</span>
                                </div>
                                <div className="text-[13px] text-red-400/90 leading-relaxed">{error}</div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 shrink-0">
                    <div className="bg-[#141414] border border-white/[0.06] rounded-xl flex items-end p-1.5 focus-within:border-white/[0.12] transition-colors">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="שאל את shadow clone..."
                            rows={1}
                            className="w-full bg-transparent border-none outline-none text-[13px] px-3 py-2 resize-none text-white placeholder-zinc-600 min-h-[36px] max-h-[120px]"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isLoading}
                            className="w-8 h-8 rounded-lg bg-white/[0.06] text-zinc-400 flex items-center justify-center disabled:opacity-30 hover:bg-white/[0.1] hover:text-white transition-all shrink-0"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW PANEL */}
            <div className="flex-1 flex flex-col bg-[#0E0E0E] relative overflow-hidden">

                {/* Preview Toolbar */}
                <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-[12px] text-zinc-200 font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-lg">
                        <button onClick={() => setDeviceMode("desktop")} className={`p-1.5 rounded-md transition-all ${deviceMode === "desktop" ? "bg-white/[0.08] text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}>
                            <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeviceMode("tablet")} className={`p-1.5 rounded-md transition-all ${deviceMode === "tablet" ? "bg-white/[0.08] text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}>
                            <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeviceMode("mobile")} className={`p-1.5 rounded-md transition-all ${deviceMode === "mobile" ? "bg-white/[0.08] text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}>
                            <Smartphone className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="w-20" />
                </div>

                {/* Preview Content */}
                <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative" dir="ltr">
                    {devServerUrl ? (
                        <div
                            className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"
                            style={{
                                width: deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "768px" : "375px",
                                height: deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "1024px" : "812px",
                                maxHeight: "100%"
                            }}
                        >
                            <iframe src={devServerUrl} className="w-full h-full border-none" title="Preview" allow="cross-origin-isolated" />
                        </div>
                    ) : webLogs.length > 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-lg">
                            <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
                            <p className="text-sm text-zinc-500">מתקין חבילות ומקמפל...</p>
                            <div className="w-full bg-[#141414] border border-white/[0.06] rounded-xl p-4 font-mono text-[11px] text-zinc-600 max-h-[200px] overflow-y-auto space-y-1">
                                {webLogs.slice(-15).map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-600 gap-3">
                            {isLoading ? (
                                <>
                                    <div className="relative">
                                        <div className="w-12 h-12 border border-white/[0.06] rounded-full" />
                                        <div className="w-12 h-12 border border-violet-500/40 rounded-full border-t-transparent animate-spin absolute inset-0" />
                                    </div>
                                    <p className="text-sm text-zinc-500">מייצר את האתר שלך...</p>
                                </>
                            ) : (
                                <>
                                    <Monitor className="w-10 h-10 opacity-20" />
                                    <p className="text-sm text-zinc-600">התצוגה המקדימה תופיע כאן</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function WorkspacePage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-[#0A0A0A] flex items-center justify-center"><Loader2 className="w-6 h-6 text-zinc-600 animate-spin" /></div>}>
            <WorkspaceContent />
        </Suspense>
    )
}
