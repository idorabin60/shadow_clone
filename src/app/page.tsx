"use client"
import { Sparkles } from "lucide-react";
import { UserButton } from "@/components/auth/UserButton";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] flex flex-col overflow-x-hidden lab-bg">
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent pointer-events-auto">
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

        <UserButton />
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full overflow-x-hidden pt-16">
        <AnimatedAIChat />
      </div>
    </div>
  );
}
