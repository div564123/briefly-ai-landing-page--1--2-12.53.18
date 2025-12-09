"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AlertCircle, X, FileText, RefreshCw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  error: string
  fileName?: string
}

export function ErrorModal({ open, onOpenChange, error, fileName }: ErrorModalProps) {
  // Detect error type and provide helpful guidance
  const getErrorInfo = () => {
    const errorLower = error.toLowerCase()
    
    // PDF empty or image-only errors
    if (errorLower.includes("empty") || errorLower.includes("only images") || errorLower.includes("selectable text")) {
      return {
        title: "PDF Cannot Be Read",
        icon: <FileText className="w-12 h-12 text-orange-500" />,
        message: "This PDF appears to be empty or contains only images without selectable text.",
        solutions: [
          "Make sure your PDF contains actual text (not just scanned images)",
          "If your PDF is scanned, use OCR (Optical Character Recognition) software to convert images to text",
          "Try converting the PDF to a Word document (.docx) and upload that instead",
          "Check if the PDF is password-protected or corrupted",
        ],
        actionLabel: "Upload Different File",
      }
    }
    
    // PDF parsing errors
    if (errorLower.includes("parse") || errorLower.includes("parsing") || errorLower.includes("failed to parse")) {
      return {
        title: "PDF Format Error",
        icon: <AlertCircle className="w-12 h-12 text-red-500" />,
        message: "We couldn't read this PDF file. It may be corrupted or in an unsupported format.",
        solutions: [
          "Try opening the PDF in a PDF reader to make sure it's not corrupted",
          "Save the PDF again or export it as a new PDF file",
          "Convert the PDF to a Word document (.docx) and upload that instead",
          "Check if the PDF is password-protected and remove the password",
        ],
        actionLabel: "Try Again",
      }
    }
    
    // File type errors
    if (errorLower.includes("unsupported") || errorLower.includes("file type")) {
      return {
        title: "Unsupported File Type",
        icon: <FileText className="w-12 h-12 text-blue-500" />,
        message: "This file type is not supported.",
        solutions: [
          "We support PDF (.pdf), Word documents (.docx, .doc)",
          "Convert your file to one of these formats",
          "Make sure the file extension matches the file type",
        ],
        actionLabel: "Upload Different File",
      }
    }
    
    // File size errors
    if (errorLower.includes("size") || errorLower.includes("too large") || errorLower.includes("exceeds")) {
      return {
        title: "File Too Large",
        icon: <AlertCircle className="w-12 h-12 text-red-500" />,
        message: "This file exceeds the maximum size limit.",
        solutions: [
          "Maximum file size is 50 MB",
          "Try splitting the document into smaller parts",
          "Compress the PDF or reduce image quality",
          "Remove unnecessary pages or images",
        ],
        actionLabel: "Upload Smaller File",
      }
    }
    
    // Default error
    return {
      title: "Error Processing File",
      icon: <AlertCircle className="w-12 h-12 text-red-500" />,
      message: error,
      solutions: [
        "Check if the file is not corrupted",
        "Try uploading the file again",
        "Convert to a different format (PDF or DOCX)",
        "Contact support if the problem persists",
      ],
      actionLabel: "Try Again",
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Bright Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        
        {/* Dialog Content */}
        <DialogPrimitive.Content
          className={cn(
            "fixed top-[50%] left-[50%] z-50 w-full max-w-lg",
            "translate-x-[-50%] translate-y-[-50%]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg border-0 shadow-2xl p-6 space-y-6 relative overflow-hidden">
            {/* Bright Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-background -z-10" />
            
            <div className="relative space-y-6">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/30 to-red-500/10 flex items-center justify-center border-2 border-red-500/50">
                    {errorInfo.icon}
                  </div>
                </div>
              </div>

              {/* Title and Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {errorInfo.title}
                </h2>
                {fileName && (
                  <p className="text-sm text-muted-foreground">
                    File: <span className="font-medium">{fileName}</span>
                  </p>
                )}
                <p className="text-muted-foreground">
                  {errorInfo.message}
                </p>
              </div>

              {/* Solutions */}
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">What you can do:</h3>
                <ul className="space-y-2">
                  {errorInfo.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    // Trigger file input click or reload
                    window.location.reload()
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {errorInfo.actionLabel}
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

