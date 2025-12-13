"use client"

import { useState, useEffect } from "react"
import { History, Play, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"

interface AudioHistoryItem {
  id: number
  fileName: string
  audioUrl: string
  summary: string | null
  createdAt: string
}

export function AudioHistory() {
  const [history, setHistory] = useState<AudioHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/audio/history?limit=20")
      const data = await response.json()
      if (data.success) {
        setHistory(data.audioGenerations)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchHistory()
    }
  }, [open])

  const handlePlay = (audioUrl: string) => {
    // Open audio in new tab or trigger audio player
    window.open(audioUrl, "_blank")
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Recently"
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Audio History
          </SheetTitle>
          <SheetDescription>
            Your recently generated audio summaries
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No audio history yet</p>
              <p className="text-xs text-muted-foreground mt-2">
                Generate your first audio to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.fileName}</h4>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handlePlay(item.audioUrl)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = item.audioUrl
                          link.download = item.fileName
                          link.click()
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

