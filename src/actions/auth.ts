"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function loginWithGoogle() {
    const supabase = await createClient()

    // Use explicit localhost fallback if necessary when AUTH_URL hasn't evaluated correctly
    const siteUrl = process.env.AUTH_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/api/auth/callback/google`
        }
    })

    if (data.url) {
        redirect(data.url)
    }
}

export async function executeSignOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
}

export async function getSessionData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user // Returns purely the user. NextAuth returned `{ user: {...} }`
}
