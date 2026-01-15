"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Wallet } from "lucide-react"

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background p-8">
      <div className="flex flex-col items-center space-y-2">
        <Wallet className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome to SpendlyoAI</h1>
        <p className="text-muted-foreground">Sign in to track your expenses</p>
      </div>
      <Button onClick={handleLogin} className="w-full max-w-sm" size="lg">
        Sign in with Google
      </Button>
    </div>
  )
}
