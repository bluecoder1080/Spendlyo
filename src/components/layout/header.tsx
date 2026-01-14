"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Wallet } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center pl-4 pr-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Kharcha
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/transactions"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Transactions
            </Link>
            <Link
              href="/chat"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/chat"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Chat
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other controls could go here */}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="mr-2"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
