"use client"

import type React from "react"

import { LayoutDashboard, Settings, Folder, Plus, Trash2, Lock, ArrowLeft, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  getFolders,
  createFolder,
  deleteFolder,
  getAllAudioFiles,
  moveAudioToFolder,
  type Folder as FolderType,
  type AudioFile,
} from "@/lib/storage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AppSidebar({
  activeFolderId,
  onFolderSelect,
  onFolderChange,
  userPlan = "starter",
}: {
  activeFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onFolderChange?: () => void
  userPlan?: "starter" | "pro"
}) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [folders, setFolders] = useState<FolderType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [availableAudios, setAvailableAudios] = useState<AudioFile[]>([])
  const [selectedAudioIds, setSelectedAudioIds] = useState<string[]>([])

  useEffect(() => {
    setFolders(getFolders())
  }, [])

  useEffect(() => {
    if (isDialogOpen) {
      setAvailableAudios(getAllAudioFiles())
      setSelectedAudioIds([])
    }
  }, [isDialogOpen])

  const toggleAudioSelection = (audioId: string) => {
    setSelectedAudioIds((prev) => (prev.includes(audioId) ? prev.filter((id) => id !== audioId) : [...prev, audioId]))
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = createFolder(newFolderName.trim())
      selectedAudioIds.forEach((audioId) => {
        moveAudioToFolder(audioId, newFolder.id)
      })
      setFolders(getFolders())
      setNewFolderName("")
      setSelectedAudioIds([])
      setIsDialogOpen(false)
      onFolderChange?.()
      onFolderSelect(newFolder.id)
    }
  }

  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteFolder(folderId)
    setFolders(getFolders())
    onFolderChange?.()
    if (activeFolderId === folderId) {
      onFolderSelect(null)
    }
  }

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sidebar-foreground">
            Capso{" "}
            <span className="bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          {userPlan === "pro" && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/10 text-sidebar-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-sidebar-primary/30">
              <Crown className="w-3 h-3" />
              <span>Pro</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        <Link
          href="/dashboard"
          onClick={() => {
            setActiveTab("dashboard")
            onFolderSelect(null)
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            activeTab === "dashboard"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50",
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          href="/settings"
          onClick={() => setActiveTab("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            activeTab === "settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50",
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
          {activeTab === "settings" && (
            <ArrowLeft className="w-4 h-4 ml-auto" />
          )}
        </Link>

        <div className="pt-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">My Folders</h3>
            {userPlan === "pro" ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="hover:bg-sidebar-accent/50 rounded p-1 transition-colors">
                    <Plus className="w-4 h-4 text-sidebar-foreground/60" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Enter a name and select audio files to add</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="e.g., Biology 202"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && selectedAudioIds.length === 0 && handleCreateFolder()}
                    />
                    {availableAudios.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select audio files (optional)</label>
                        <ScrollArea className="h-48 border rounded-md p-3">
                          <div className="space-y-2">
                            {availableAudios.map((audio) => (
                              <div
                                key={audio.id}
                                className="flex items-start gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors"
                              >
                                <Checkbox
                                  id={audio.id}
                                  checked={selectedAudioIds.includes(audio.id)}
                                  onCheckedChange={() => toggleAudioSelection(audio.id)}
                                />
                                <label htmlFor={audio.id} className="flex-1 cursor-pointer text-sm">
                                  <div className="font-medium">{audio.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {audio.duration} • {audio.size}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        {selectedAudioIds.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {selectedAudioIds.length} audio file{selectedAudioIds.length > 1 ? "s" : ""} selected
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                      Create Folder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Link href="/pricing" className="group">
                <button className="hover:bg-sidebar-accent/50 rounded p-1 transition-colors relative">
                  <Plus className="w-4 h-4 text-sidebar-foreground/60" />
                  <Lock className="w-2.5 h-2.5 text-sidebar-primary absolute -top-0.5 -right-0.5" />
                </button>
              </Link>
            )}
          </div>

          {folders.length === 0 && userPlan === "starter" && (
            <div className="px-4 py-3 text-xs text-muted-foreground text-center">
              <Lock className="w-4 h-4 mx-auto mb-1 text-sidebar-primary" />
              <div>Folders are a Pro feature</div>
              <Link href="/pricing" className="text-sidebar-primary hover:underline">
                Upgrade to create folders
              </Link>
            </div>
          )}

          <div className="space-y-1">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm group relative",
                  activeFolderId === folder.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <button
                  onClick={() => onFolderSelect(folder.id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">{folder.count}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFolder(folder.id, e)
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all ml-1 shrink-0"
                  aria-label={`Delete folder ${folder.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 rounded-lg p-4">
          <div className="text-xs font-medium text-sidebar-accent-foreground mb-1">Current Plan</div>
          <div className="text-sm font-bold text-sidebar-primary">
            {userPlan === "pro" ? "Pro Plan" : "Starter Plan"}
          </div>
          {userPlan === "starter" && (
            <Link
              href="/pricing"
              className="mt-3 w-full bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 hover:from-sidebar-primary/90 hover:to-sidebar-primary/70 text-sidebar-primary-foreground text-xs font-medium py-2 px-3 rounded-md transition-all block text-center"
            >
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}


