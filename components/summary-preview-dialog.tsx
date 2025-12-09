"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit2, Check, X } from "lucide-react"

interface SummaryPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: string
  onConfirm: (editedSummary: string) => void
  isGenerating?: boolean
}

export function SummaryPreviewDialog({
  open,
  onOpenChange,
  summary,
  onConfirm,
  isGenerating = false,
}: SummaryPreviewDialogProps) {
  const [editedSummary, setEditedSummary] = useState(summary)
  const [isEditing, setIsEditing] = useState(false)

  // Update edited summary when summary prop changes
  useEffect(() => {
    setEditedSummary(summary)
    setIsEditing(false)
  }, [summary])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedSummary(summary)
    setIsEditing(false)
  }

  const handleConfirm = () => {
    onConfirm(editedSummary)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Review & Edit Summary
          </DialogTitle>
          <DialogDescription>
            Review the generated summary and make any edits before generating audio. You can modify the text to your preference.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col">
          {isEditing ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Editing mode - Make your changes below</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isGenerating}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirm}
                    disabled={isGenerating}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </div>
              <Textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="flex-1 min-h-[400px] font-mono text-sm"
                placeholder="Edit your summary here..."
                disabled={isGenerating}
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {editedSummary.length} characters
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Preview - Click Edit to modify</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isGenerating}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
              <ScrollArea className="flex-1 border rounded-md p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {editedSummary}
                </div>
              </ScrollArea>
              <div className="mt-2 text-xs text-muted-foreground">
                {editedSummary.length} characters
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isGenerating || !editedSummary.trim()}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isGenerating ? "Generating Audio..." : "Generate Audio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

