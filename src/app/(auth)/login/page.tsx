import { SignInPage } from "@/components/ui/sign-in-flow-1";

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex relative overflow-hidden bg-background">
            <SignInPage type="login" />
        </main>
    )
}
