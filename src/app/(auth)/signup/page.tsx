import { AuthForm } from "@/components/auth/AuthForm"

export default function SignupPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Abstract Background Elements (mirrored from login for consistency but slightly varied) */}
            <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-5%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Decorative grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

            <div className="w-full relative z-10">
                <AuthForm type="signup" />
            </div>
        </main>
    )
}
