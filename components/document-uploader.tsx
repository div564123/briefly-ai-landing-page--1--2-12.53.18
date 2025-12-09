"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-12 transition-all
          ${isDragging ? "border-primary bg-primary/5 scale-105" : "border-border bg-card"}
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
        />

        {!selectedFile ? (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-1">Drop your document here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX, TXT</p>
              </div>
              <Button className="gradient-purple text-white mt-2">Select Document</Button>
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-6 text-center">
          <Button className="gradient-purple text-white px-8 py-3">Generate Audio Summary</Button>
        </div>
      )}
    </section>
  )
}
