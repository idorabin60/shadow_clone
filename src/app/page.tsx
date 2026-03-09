"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowUp, LayoutTemplate, BriefcaseBusiness, ShoppingBag, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  { icon: <BriefcaseBusiness className="w-4 h-4" />, text: "אתר לעורך דין מומחה" },
  { icon: <LayoutTemplate className="w-4 h-4" />, text: "דף נחיתה למסעדה" },
  { icon: <ShoppingBag className="w-4 h-4" />, text: "חנות וירטואלית קטנה" },
  { icon: <Sparkles className="w-4 h-4" />, text: "תיק עבודות למעצב" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    // Navigate immediately to the workspace to handle the complex AI generation
    router.push(`/workspace?prompt=${encodeURIComponent(text.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(prompt);
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-zinc-800 bg-[#0A0A0A] bg-gradient-to-b from-[#141414] to-[#0A0A0A] flex flex-col overflow-x-hidden">

      {/* 1. Subtle Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-700/10 blur-[140px] rounded-full pointer-events-none" />

      {/* 2. Premium Grid Texture Masked with Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Content wrapper with z-index to stay above background details */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-transparent">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Sparkles className="w-6 h-6 text-zinc-300" />
            <span>shadow clone</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">ניהול משימות</a>
            <a href="#" className="hover:text-white transition-colors">פרויקטים</a>
            <a href="#" className="hover:text-white transition-colors">יומן ביצועים</a>
            <a href="#" className="hover:text-white transition-colors">הגדרות מתקדמות</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-white bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md rounded-full transition-all border border-white/5">
              התחבר
            </button>
            <button className="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-zinc-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              הרשמה
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 pb-32">
          <div className="w-full max-w-3xl flex flex-col items-center">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-12 text-center" style={{ fontFamily: "var(--font-heading)" }}>
              איזה דף נחיתה תרצה שאבנה עבורך?
            </h1>

            {/* Main Input Box (Slightly enhanced glow behind it) */}
            <div className="w-full relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800/60 to-zinc-700/60 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden glass-panel">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="תאר לי את העסק שלך, מי קהל היעד ואיזה עיצוב היית רוצה..."
                  disabled={isLoading}
                  className="w-full bg-transparent text-white placeholder-zinc-500 p-5 md:p-6 text-lg outline-none resize-none min-h-[120px]"
                  dir="rtl"
                />

                {/* Bottom Action Bar inside Textarea */}
                <div className="flex items-center justify-between p-3 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">לחץ Enter כדי להתחיל</span>
                  </div>
                  <button
                    onClick={() => handleSubmit(prompt)}
                    disabled={!prompt.trim() || isLoading}
                    className="bg-white text-black p-2 rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUp className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
