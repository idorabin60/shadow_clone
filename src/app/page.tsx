"use client"
import { useState, useEffect } from "react";
import { Sparkles, Folder, ExternalLink } from "lucide-react";
import { UserButton } from "@/components/auth/UserButton";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('id, name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (data) setProjects(data);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] flex flex-col overflow-x-hidden lab-bg">
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent pointer-events-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <Sparkles className="w-6 h-6 text-zinc-300" />
          <span>shadow clone</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button onClick={() => setShowProjects(!showProjects)} className="hover:text-white transition-colors flex items-center gap-1.5">
            <Folder className="w-4 h-4" />
            פרויקטים
          </button>
          <a href="#" className="hover:text-white transition-colors">יומן ביצועים</a>
          <a href="#" className="hover:text-white transition-colors">הגדרות מתקדמות</a>
        </div>

        <UserButton />
      </nav>

      {/* Projects Panel */}
      {showProjects && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden" dir="rtl">
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-200">הפרויקטים שלי</span>
            <button onClick={() => setShowProjects(false)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">סגור</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {projects.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-600">אין פרויקטים עדיין</div>
            ) : (
              projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    router.push(`/workspace?prompt=${encodeURIComponent(proj.name)}`);
                    setShowProjects(false);
                  }}
                  className="w-full text-right px-5 py-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-b-0 group"
                >
                  <Folder className="w-4 h-4 text-zinc-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-300 truncate">{proj.name}</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">
                      {new Date(proj.created_at).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 w-full overflow-x-hidden pt-16">
        <AnimatedAIChat />
      </div>
    </div>
  );
}
