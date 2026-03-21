"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { loginWithGoogle } from "@/actions/auth"

interface AuthFormProps {
    type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isLogin = type === "login"

    const title = isLogin ? "ברוך שובך" : "יצירת חשבון חדש"
    const subtitle = isLogin ? "הזן את פרטיך כדי להתחבר לחשבון" : "הצטרף אלינו כדי להתחיל לבנות נחיתה חכמה"
    const submitText = isLogin ? "התחברות" : "הרשמה"
    const oppositeText = isLogin ? "אין לך חשבון? הרשם עכשיו" : "כבר יש לך חשבון? התחבר"
    const oppositeLink = isLogin ? "/signup" : "/login"

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                ease: [0.16, 1, 0.3, 1] as const // Custom refined easing
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        await loginWithGoogle()
        // It will redirect so we don't necessarily need to set isLoading to false
    }

    return (
        <motion.div
            className="w-full max-w-md mx-auto p-8 sm:p-10 rounded-2xl glass-panel dark-glow relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Decorative gradient orb inside the card */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div variants={itemVariants} className="text-center mb-10 relative z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground font-heebo">{title}</h1>
                <p className="text-muted-foreground text-sm font-assistant">{subtitle}</p>
            </motion.div>

            <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            placeholder="דוא״ל"
                            className="w-full bg-input/40 border border-border/50 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-assistant placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            placeholder="סיסמה"
                            className="w-full bg-input/40 border border-border/50 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-assistant placeholder:text-muted-foreground/60"
                        />
                    </div>
                </motion.div>

                {isLogin && (
                    <motion.div variants={itemVariants} className="flex justify-start">
                        <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-assistant">
                            שכחת סיסמה?
                        </a>
                    </motion.div>
                )}

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 group"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : submitText}
                </motion.button>

                <motion.div variants={itemVariants} className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-border/60"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground font-assistant px-2">
                        או המשך באמצעות
                    </span>
                    <div className="flex-grow border-t border-border/60"></div>
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-secondary/50 border border-border/60 hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </motion.button>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center relative z-10">
                <Link
                    href={oppositeLink}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors group font-assistant decoration-primary/30 hover:underline underline-offset-4"
                >
                    {oppositeText}
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </motion.div>
    )
}
