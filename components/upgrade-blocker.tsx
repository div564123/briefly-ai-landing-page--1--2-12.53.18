"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Lock, Sparkles, Zap, Infinity as InfinityIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface UpgradeBlockerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  current: number
  limit: number
}

export function UpgradeBlocker({ open, onOpenChange, current, limit }: UpgradeBlockerProps) {
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
          <div className="bg-white dark:bg-gray-900 rounded-lg border-0 shadow-2xl p-8 space-y-6 relative overflow-hidden">
            {/* Bright Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background -z-10" />
            
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

          {/* Lock Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/50">
                <Lock className="w-10 h-10 text-primary animate-bounce" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Monthly Limit Reached
            </DialogTitle>
            <p className="text-muted-foreground">
              You've used all {limit} of your monthly generations
            </p>
          </div>

          {/* Usage Display */}
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">This Month</span>
              <span className="text-sm font-bold text-primary">{current}/{limit}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Pro Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <InfinityIcon className="w-4 h-4 text-primary" />
              </div>
              <span>Unlimited monthly generations</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span>Advanced voice speed control</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span>Background music options</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/pricing" className="block">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-6 text-lg"
              onClick={() => onOpenChange(false)}
            >
              <Lock className="w-5 h-5 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>

          <p className="text-xs text-center text-muted-foreground">
            Your limit will reset at the start of next month
          </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

