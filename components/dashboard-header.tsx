"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"
import { AudioHistory } from "@/components/audio-history"

export function DashboardHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Ready to create your next audio summary</p>
        </div>

        <div className="flex items-center gap-2">
          <AudioHistory />
          <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9 bg-transparent">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}




