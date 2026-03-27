"use client"
import { useEffect, useState } from "react"
import { getSessionData, executeSignOut } from "@/actions/auth"
import Link from "next/link"

export function UserButton() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        getSessionData().then((u) => {
            setUser(u)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="w-8 h-8 animate-pulse bg-zinc-800 rounded-full" />

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md rounded-full transition-all border border-white/5">
                    התחבר
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-zinc-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    הרשמה
                </Link>
            </div>
        )
    }

    const name = user.user_metadata?.full_name || user.email || "User"
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture

    return (
        <div className="flex items-center gap-4 bg-zinc-900/50 pr-4 pl-2 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            <button
                onClick={() => executeSignOut()}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
                התנתקות
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{name}</span>
                {avatarUrl && !imageError ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-7 h-7 rounded-full border border-white/10"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold border border-white/10">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    )
}
