"use client"
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ArrowRight, CornerDownLeft, Monitor, Smartphone, Tablet, ArrowUp, Folder } from "lucide-react";
import type { BusinessInput } from "@/lib/ai/prompts";
import { createClient } from "@/utils/supabase/client";
import { useWebContainer } from "@/hooks/useWebContainer";

function WorkspaceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPrompt = searchParams.get("prompt") || "";

    // State for the agent process
    const [isLoading, setIsLoading] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const [sandboxId, setSandboxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // WebContainer Execution
    const { mountAndRun, devServerUrl, webLogs } = useWebContainer();

    // State for the UI
    const [chatInput, setChatInput] = useState("");
    const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const hasStartedInitialGen = useRef(false);

    // Supabase variables
    const supabase = createClient();
    const [projects, setProjects] = useState<any[]>([]);

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

    // Start the initial generation when the page loads with a prompt
    useEffect(() => {
        if (initialPrompt && !hasStartedInitialGen.current) {
            hasStartedInitialGen.current = true;

            const cachedData = localStorage.getItem(`shadow_clone_gen_${initialPrompt}`);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    if (parsed.hasFiles) {
                        setSandboxId(parsed.sandboxId);
                        setTerminalLogs(parsed.terminalLogs || [`> Loaded cached generation for: "${initialPrompt}"`]);
                        // Would need to fetch files here to mount again, skipping cache optimization for WebContainers right now
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse cached data", e);
                }
            }

            generateLandingPage(initialPrompt);
        }
    }, [initialPrompt, hasStartedInitialGen]);

    // Save generation to localStorage once it's complete
    useEffect(() => {
        if (devServerUrl && initialPrompt && sandboxId) {
            localStorage.setItem(`shadow_clone_gen_${initialPrompt}`, JSON.stringify({
                hasFiles: true,
                sandboxId,
                terminalLogs
            }));
        }
    }, [devServerUrl, initialPrompt, sandboxId, terminalLogs]);

    const generateLandingPage = async (text: string) => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError(null);
        setTerminalLogs([`> Starting generation for: "${text}"...`]);

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
                    // Optimistically add to list
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

            const eventSource = new EventSource(`http://localhost:4000/api/orchestrate/stream/${newSandboxId}`);

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setTerminalLogs((prev) => [...prev, data.log]);

                    if (data.log.includes("✅ DONE_FILES_SAVED:")) {
                        const savedId = data.log.split(":")[1].trim();
                        // Fetch the files from Supabase now!
                        // In an async IIFE to avoid making the whole onmessage async
                        (async () => {
                            const { data: projData } = await supabase.from('projects').select('files').eq('id', savedId).single();
                            if (projData?.files) {
                                // WebContainers require no package.json hacking, just run it!
                                await mountAndRun(projData.files);
                            }
                            eventSource.close();
                            setIsLoading(false);
                        })();
                    } else if (data.log.includes("❌ Fatal Error")) {
                        eventSource.close();
                        setIsLoading(false);
                        setError("הסוכן נתקל בשגיאה: " + data.log);
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

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        // Add the user's message to the logs as a visual indication
        setTerminalLogs(prev => [...prev, `[User]: ${chatInput}`]);

        // TODO: Implement actual follow-up backend logic here
        setTerminalLogs(prev => [...prev, `> [Agent]: אני מעבד את הבקשה שלך... (Logic pending)`]);

        setChatInput("");
    };

    return (
        <div className="flex h-screen w-full bg-[#0A0A0A] text-white overflow-hidden text-right" dir="rtl">

            {/* LEFT SIDEBAR: Chat / Logs */}
            <div className="w-[400px] lg:w-[450px] shrink-0 border-l border-white/10 flex flex-col bg-[#0F0F0F] relative z-20 shadow-2xl">

                {/* Sidebar Header */}
                <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#141414]">
                    <button
                        onClick={() => router.push('/')}
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                        <ArrowRight className="w-4 h-4" />
                        חזור לבית
                    </button>
                    <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-zinc-400" />
                        shadow clone
                    </div>
                </div>

                {/* Project Switcher */}
                {projects.length > 0 && (
                    <div className="border-b border-white/5 bg-[#0F0F0F] p-4 flex flex-col gap-2 shrink-0 max-h-[150px] overflow-y-auto">
                        <div className="text-xs text-zinc-500 font-medium mb-1">הפרויקטים שלי</div>
                        {projects.map((proj) => (
                            <button
                                key={proj.id}
                                onClick={async () => {
                                    setSandboxId(proj.id);
                                    setTerminalLogs([`> Switched to project: ${proj.name}`, `> Fetching source files...`]);

                                    const { data: dbData } = await supabase.from('projects').select('files').eq('id', proj.id).single();
                                    if (dbData?.files) {
                                        await mountAndRun(dbData.files);
                                        setTerminalLogs(prev => [...prev, `> Booting WebContainer environment...`]);
                                    } else {
                                        setTerminalLogs(prev => [...prev, `> ❌ No files found for this project.`]);
                                    }
                                }}
                                className={`text-right text-sm truncate px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${sandboxId === proj.id
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                    }`}
                            >
                                <Folder className="w-4 h-4 shrink-0 text-zinc-500" />
                                {proj.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Chat/Log Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {/* Initial User Prompt Bubble */}
                    <div className="flex flex-col gap-1 items-start">
                        <div className="text-xs text-zinc-500 mr-2">אתה</div>
                        <div className="bg-zinc-800/80 rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[90%] border border-white/5 whitespace-pre-wrap">
                            {initialPrompt}
                        </div>
                    </div>

                    {/* Agent Streaming Logs */}
                    <div className="flex flex-col gap-1 items-start mt-4">
                        <div className="text-xs text-zinc-500 mr-2 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            סוכן פיתוח
                            {isLoading && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /></span>}
                        </div>
                        <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl p-3 font-mono text-xs overflow-hidden shadow-inner flex flex-col gap-2">
                            {terminalLogs.length === 0 && <span className="text-zinc-600">ממתין להתחברות...</span>}
                            {terminalLogs.map((log, i) => {
                                const isUserLog = log.startsWith("[User]:");
                                if (isUserLog) return null; // We handle user messages visually differently if needed, but for now just showing agent logs here mostly.

                                return (
                                    <div key={i} className="text-zinc-400 break-words leading-relaxed">
                                        <span className={
                                            log.includes("❌") ? "text-red-400" :
                                                log.includes("✅") ? "text-green-400" :
                                                    log.includes("👨‍💻") ? "text-blue-400" :
                                                        log.includes(">") ? "text-purple-400" :
                                                            "text-zinc-300"
                                        }>
                                            {log}
                                        </span>
                                    </div>
                                );
                            })}
                            {error && (
                                <div className="text-red-400 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    Iterative Prompt History Simulation
                    {terminalLogs.filter(log => log.startsWith("[User]:")).map((log, idx) => (
                        <div key={idx} className="flex flex-col gap-1 items-start mt-4">
                            <div className="text-xs text-zinc-500 mr-2">אתה</div>
                            <div className="bg-zinc-800/80 rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[90%] border border-white/5 whitespace-pre-wrap">
                                {log.replace("[User]: ", "")}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Chat Input Box (Footer) */}
                <div className="p-4 bg-[#141414] border-t border-white/5 shrink-0">
                    <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center p-1 focus-within:border-zinc-500 transition-colors shadow-inner">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="איך להמשיך מכאן?"
                            className="w-full bg-transparent border-none outline-none text-sm p-3 resize-none h-[44px] text-white placeholder-zinc-600"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isLoading}
                            className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center disabled:opacity-50 hover:bg-zinc-700 transition-colors mx-1"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-zinc-600">shadow clone v1.0.0</span>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN AREA: Preview Canvas */}
            <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">

                {/* Subtle background texture for the canvas area */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

                {/* Preview Header / Device Toolbar */}
                <div className="h-14 shrink-0 flex items-center justify-center px-4 border-b border-white/5 bg-[#0F0F0F]/80 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 p-1 rounded-lg">
                        <button onClick={() => setDeviceMode("desktop")} className={`p-1.5 rounded-md transition-colors ${deviceMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`} title="Desktop">
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeviceMode("tablet")} className={`p-1.5 rounded-md transition-colors ${deviceMode === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`} title="Tablet">
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeviceMode("mobile")} className={`p-1.5 rounded-md transition-colors ${deviceMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`} title="Mobile">
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scaled Preview Canvas Wrapper */}
                <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto relative z-10" dir="ltr">
                    {devServerUrl ? (
                        <div
                            className={`bg-white rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-300 ease-in-out`}
                            style={{
                                width: deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "768px" : "375px",
                                height: deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "1024px" : "812px",
                                maxHeight: "100%"
                            }}
                        >
                            <iframe src={devServerUrl} className="w-full h-full border-none" title="WebContainer Preview" allow="cross-origin-isolated" />
                        </div>
                    ) : webLogs.length > 0 ? (
                        <div className="flex flex-col items-center justify-center text-zinc-500 gap-4 w-full h-full p-8">
                            <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-xl p-4 font-mono text-xs overflow-hidden shadow-inner flex flex-col gap-2 min-h-[200px]">
                                <h3 className="text-zinc-400 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
                                    <Monitor className="w-4 h-4" /> WebContainer OS Boot Sequence
                                </h3>
                                {webLogs.map((log, i) => (
                                    <div key={i} className="text-zinc-300 leading-relaxed font-mono">
                                        {log}
                                    </div>
                                ))}
                                <div className="mt-4 flex items-center gap-2 text-blue-400">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span>Installing dependencies and compiling...</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-500 gap-4">
                            {isLoading ? (
                                <>
                                    <div className="relative">
                                        <div className="w-16 h-16 border-2 border-white/10 rounded-full"></div>
                                        <div className="w-16 h-16 border-2 border-blue-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                                    </div>
                                    <p className="text-lg font-medium tracking-wide">מייצר אתר בבינה מלאכותית...</p>
                                </>
                            ) : (
                                <>
                                    <Monitor className="w-12 h-12 opacity-20" />
                                    <p>התצוגה המקדימה תופיע כאן בסיום התהליך.</p>
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
        <Suspense fallback={<div className="h-screen w-full bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
            <WorkspaceContent />
        </Suspense>
    )
}
