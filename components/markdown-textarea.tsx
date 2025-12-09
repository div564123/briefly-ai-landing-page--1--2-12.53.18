"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Eye, Edit2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarkdownTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function MarkdownTextarea({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  style,
}: MarkdownTextareaProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Convert markdown bold (**text**) to HTML
  const renderMarkdown = (text: string) => {
    // Replace **text** with <strong>text</strong>
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/\n/g, '<br />')
    
    return { __html: html }
  }

  return (
    <div className="space-y-2">
      {value && !disabled && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-7"
          >
            {isEditing ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </>
            )}
          </Button>
        </div>
      )}

      {isEditing || !value ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={placeholder}
          disabled={disabled}
          style={style}
        />
      ) : (
        <ScrollArea
          className="w-full min-h-[400px] rounded-md border bg-background px-3 py-2 text-sm"
          style={style}
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={renderMarkdown(value)}
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          />
        </ScrollArea>
      )}
    </div>
  )
}

