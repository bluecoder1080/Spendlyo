"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Loader2, Mail, User as UserIcon, Calendar, Shield } from "lucide-react"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        redirect('/login')
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const joinDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 pb-8">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {user.user_metadata.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center md:text-left">
            <CardTitle className="text-2xl">
              {user.user_metadata.full_name || 'User'}
            </CardTitle>
            <CardDescription className="text-base flex items-center justify-center md:justify-start gap-2">
               <Mail className="h-4 w-4" />
               {user.email}
            </CardDescription>
            <div className="pt-2">
              <Badge variant="secondary" className="px-3 py-1">Free Plan</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
           <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                 <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member Since</span>
                 </div>
                 <p className="font-medium">{joinDate}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                 <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Account Type</span>
                 </div>
                 <p className="font-medium capitalize">{user.app_metadata.provider || 'Email'}</p>
              </div>
           </div>

           <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Account Details</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="font-mono text-xs">{user.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email Status</dt>
                  <dd className={user.email_confirmed_at ? "text-green-500" : "text-yellow-500"}>
                    {user.email_confirmed_at ? "Verified" : "Unverified"}
                  </dd>
                </div>
              </dl>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
