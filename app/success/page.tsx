"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Sparkles, Zap, Crown, ArrowRight, Infinity } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(true)

  useEffect(() => {
    // Refresh session to get updated subscription tier
    if (status === "authenticated" && session?.user?.email) {
      // Try to verify and update subscription status
      const verifySubscription = async () => {
        try {
          // First, verify the Stripe session and upgrade if needed
          const verifyResponse = await fetch("/api/checkout/verify-session", {
            method: "POST",
          })
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()
            if (verifyData.tier === "pro") {
              console.log("✅ Subscription verified and upgraded to Pro")
              // Wait a moment for database to update, then check usage
              setTimeout(async () => {
                const usageResponse = await fetch("/api/audio/usage")
                if (usageResponse.ok) {
                  const usageData = await usageResponse.json()
                  if (usageData.tier === "pro") {
                    setIsUpgrading(false)
                    return
                  }
                }
                setIsUpgrading(false)
              }, 1000)
              return
            }
          }
          
          // Fallback: Check current usage to see if tier was updated
          const response = await fetch("/api/audio/usage")
          if (response.ok) {
            const data = await response.json()
            // If tier is pro, we're good
            if (data.tier === "pro") {
              setIsUpgrading(false)
              return
            }
          }
          
          // Give Stripe webhook a moment to process (3 seconds)
          setTimeout(() => {
            setIsUpgrading(false)
          }, 3000)
        } catch (error) {
          console.error("Error verifying subscription:", error)
          setIsUpgrading(false)
        }
      }

      verifySubscription()
    }
  }, [status, session])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Processing your purchase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Thank You for Your Purchase!
            </CardTitle>
            <CardDescription className="text-lg">
              Your Pro Action subscription is now active
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pro Features Unlocked */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Pro Features Unlocked</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">Unlimited monthly uploads</span>
                  <Infinity className="w-4 h-4 text-primary ml-auto" />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">Voice speed control (0.5x - 2.0x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">Unlimited audio organization (folders)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">Background music (already available)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-foreground">All voice options and languages</span>
                </div>
              </div>
            </div>

            {/* Usage Display */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Monthly Generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Infinity className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-primary">Unlimited</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => router.push("/settings")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                View Settings
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-center text-muted-foreground pt-4">
              Your subscription will automatically renew monthly. You can manage your billing in Settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

