"use client"

import { Trash2, Download, Plus, ArrowLeft, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AudioPlayerDialog } from "@/components/audio-player-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import type { AudioFile } from "@/lib/storage"
import { getAudioFiles, moveAudioToFolder } from "@/lib/storage"

interface FolderViewProps {
  folderId: string
  folderName: string
  audioFiles: AudioFile[]
  onDelete: (id: string) => void
  onBack: () => void
  onAudioAdded: () => void
}

export function FolderView({ folderId, folderName, audioFiles, onDelete, onBack, onAudioAdded }: FolderViewProps) {
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAudioIds, setSelectedAudioIds] = useState<string[]>([])
  const allAudioFiles = getAudioFiles(null) // Get all audio files without folder
  
  const selectedAudio = selectedAudioId ? audioFiles.find(a => a.id === selectedAudioId) : null

  const handleAddAudioToFolder = () => {
    selectedAudioIds.forEach((audioId) => {
      moveAudioToFolder(audioId, folderId)
    })
    setSelectedAudioIds([])
    setIsDialogOpen(false)
    onAudioAdded()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background/50">
      {/* Header - Finder Style */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">{folderName}</h2>
              <p className="text-xs text-muted-foreground">
                {audioFiles.length} {audioFiles.length === 1 ? "file" : "files"}
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Add Audio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Audio from History</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {allAudioFiles.map((audio) => (
                    <div
                      key={audio.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedAudioIds.includes(audio.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAudioIds([...selectedAudioIds, audio.id])
                          } else {
                            setSelectedAudioIds(selectedAudioIds.filter((id) => id !== audio.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{audio.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{audio.duration}</span>
                          <span>{audio.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAudioToFolder}
                  disabled={selectedAudioIds.length === 0}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  Add {selectedAudioIds.length > 0 && `(${selectedAudioIds.length})`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* File Grid - Finder Style */}
      <div className="flex-1 overflow-auto p-6">
        {audioFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Music2 className="w-10 h-10 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-sm">This folder is empty</p>
            <p className="text-muted-foreground text-xs mt-1">Add audio files to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {audioFiles.map((audio) => (
              <Card
                key={audio.id}
                className={cn(
                  "group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]",
                  selectedAudioId === audio.id && "ring-2 ring-primary"
                )}
              >
                <div className="p-4">
                  {/* Audio Icon/Thumbnail */}
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                    <Music2 className="w-12 h-12 text-primary" />
                  </div>

                  {/* File Info */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-medium text-sm text-foreground truncate" title={audio.name}>
                      {audio.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{audio.duration}</span>
                      <span>•</span>
                      <span>{audio.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {audio.createdAt instanceof Date ? audio.createdAt.toLocaleDateString() : String(audio.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedAudioId(selectedAudioId === audio.id ? null : audio.id)}
                      disabled={!audio.url}
                    >
                      {selectedAudioId === audio.id ? "Playing" : "Play"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2"
                      onClick={() => {
                        if (audio.url) {
                          const link = document.createElement("a")
                          link.href = audio.url
                          link.download = `${audio.name}.mp3`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      }}
                      disabled={!audio.url}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="px-2" onClick={() => onDelete(audio.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Audio Player Modal Popup with Bright Background */}
      {selectedAudio && selectedAudio.url && (
        <AudioPlayerDialog
          open={!!selectedAudio}
          onOpenChange={(open) => !open && setSelectedAudioId(null)}
          audioUrl={selectedAudio.url}
          audioName={selectedAudio.name}
        />
      )}
    </div>
  )
}




