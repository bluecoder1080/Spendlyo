"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Wallet, LogOut, User as UserIcon, Menu, X, LayoutDashboard, History as HistoryIcon, MessageSquare, Sparkles, UserCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (_event === 'SIGNED_OUT') {
         setUser(null)
         router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "History", icon: HistoryIcon },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
  ]

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
              "hover:bg-accent/50",
              "md:px-4",
              isActive 
                ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {isActive && (
              <div className="hidden md:block ml-auto w-1 h-1 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container relative flex h-16 items-center px-4 md:px-6 justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Wallet className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <Sparkles className="h-3 w-3 text-primary/60 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SpendlyoAI
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">Smart Finance</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-1">
          <NavLinks />
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 md:gap-4">
             {loading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
             ) : user ? (
               <div className="flex items-center gap-3 pl-0 md:pl-4 md:border-l md:border-border/40">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-3 outline-none group">
                        <div className="hidden sm:flex flex-col items-end mr-1 group-hover:opacity-80 transition-opacity">
                          <span className="text-sm font-semibold leading-none">
                            {user.user_metadata.full_name?.split(' ')[0] || 'Hello!'}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Free Plan
                          </span>
                        </div>
                        
                        {user.user_metadata.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Avatar" 
                            className="h-9 w-9 rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-all cursor-pointer shadow-sm"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-all">
                             <span className="text-xs font-bold text-primary">
                               {user.user_metadata.full_name?.[0] || 'U'}
                             </span>
                          </div>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile" className="flex items-center w-full">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
               </div>
             ) : (
               <Button asChild variant="default" size="sm" className="shadow-sm rounded-full px-4">
                 <Link href="/login">Login</Link>
               </Button>
             )}
            
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full hover:bg-accent h-9 w-9"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2">
          <nav className="container flex flex-col space-y-1 p-4">
            <NavLinks />
          </nav>
        </div>
      )}
    </header>
  )
}
