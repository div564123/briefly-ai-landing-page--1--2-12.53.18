"use client"

import type React from "react"

import { Upload, FileText, X, Sparkles, Zap, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MarkdownTextarea } from "@/components/markdown-textarea"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export function UploadSection({
  selectedFile,
  onFileSelect,
  usage,
  extractedText,
  onTextChange,
  isExtractingText,
}: {
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
  usage?: { current: number; limit: number; tier: string; remaining: number } | null
  extractedText?: string
  onTextChange?: (text: string) => void
  isExtractingText?: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword")
    ) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword")
    ) {
      onFileSelect(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onTextChange) {
      onTextChange("")
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-12 overflow-y-auto">
      {/* Main Upload Zone */}
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-3 text-balance">Upload Your Course</h2>
          <p className="text-base text-muted-foreground">Drop your course materials here to generate an audio summary</p>
        </div>

        {!selectedFile ? (
          <Card
            className={`border-2 border-dashed transition-colors ${
              isDragging ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10" : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-16 flex flex-col items-center justify-center gap-6 text-center min-h-[320px]">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-base text-muted-foreground mb-4">Drag your file here or click to select</p>
                <p className="text-sm text-muted-foreground/70">PDF, DOCX - Max 50 MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                size="lg"
                className="mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={handleButtonClick}
              >
                Select a File
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-2 border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleRemoveFile}>
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
              
              {isExtractingText ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Extracting text from document...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Document Text</label>
                  <MarkdownTextarea
                    value={extractedText || ""}
                    onChange={(value) => onTextChange?.(value)}
                    placeholder="Text will appear here after extraction..."
                    disabled={!extractedText}
                    className="w-full min-h-[400px] font-mono text-sm resize-none"
                    style={{ 
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      height: 'auto',
                      minHeight: '400px'
                    }}
                  />
                  {extractedText && (
                    <p className="text-xs text-muted-foreground">
                      {extractedText.length} characters - You can edit this text before generating audio. Use **text** for bold formatting.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Only show monthly generations bar for Starter plan users */}
      {usage && usage.limit !== Infinity && usage.tier !== "pro" && (
        <Card className="w-full max-w-3xl border border-border/50 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="px-4 py-2 flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>

            <div className="flex-1 flex items-center gap-3">
              <div className="shrink-0">
                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1">
                  Monthly Generations
                  <Zap className="w-2.5 h-2.5 text-primary" />
                </h3>
              </div>

              <div className="flex-1 relative h-1.5 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
                <div
                  className="relative h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 shadow-sm shadow-primary/20"
                  style={{ 
                    width: `${Math.min(100, (usage.current / usage.limit) * 100)}%`
                  }}
                />
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <div className="text-sm font-bold text-foreground">
                  {usage.current}/{usage.limit}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {usage.remaining > 0 
                    ? `${usage.remaining} left` 
                    : "limit reached"}
                </span>
              </div>
            </div>

            <Link
              href="/pricing"
              className="text-[10px] bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary/70 font-medium shrink-0"
            >
              Upgrade to Pro
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}




