"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Check, X, Zap, Crown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async (planName: string) => {
    if (planName !== "Pro Action") return

    setLoading(planName)

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: null }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
      setLoading(null)
    }
  }

  const plans = [
    {
      name: "Starter",
      price: "0",
      period: "€ / month",
      description: "Perfect for trying out Capso",
      icon: Zap,
      features: [
        { name: "4 uploads per month", value: "", included: true },
        { name: "Multiple voice options", value: "", included: true },
        { name: "Language selection", value: "English, French, Spanish", included: true },
        { name: "Background Music", value: "Yes", included: true },
        { name: "Voice Speed Control", value: "No", included: false },
        { name: "Audio Organization (Folders)", value: "No", included: false },
      ],
      cta: "Start for Free",
      link: "/signup",
      highlighted: false,
      isPro: false,
    },
    {
      name: "Pro Action",
      price: "8.99",
      period: "€ / month",
      description: "For serious students",
      icon: Crown,
      features: [
        { name: "Monthly Uploads", value: "Unlimited", included: true },
        { name: "Multiple voice options", value: "", included: true },
        { name: "Language selection", value: "English, French, Spanish", included: true },
        { name: "Background Music", value: "Yes", included: true },
        { name: "Voice Speed Control", value: "0.5x - 2.0x", included: true },
        { name: "Audio Organization (Folders)", value: "Unlimited", included: true },
      ],
      cta: "Upgrade to Pro Action",
      link: "/signup",
      highlighted: true,
      isPro: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple Pricing for Students
          </h1>
          <p className="text-lg text-muted-foreground">Start free. Upgrade when you need more power.</p>
        </div>

        {/* Pricing Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, idx) => {
              const Icon = plan.icon
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-8 border-2 transition-all ${
                    plan.highlighted
                      ? "gradient-purple text-white border-secondary soft-shadow scale-105"
                      : "border-border bg-white hover:border-primary/30 text-foreground"
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${plan.highlighted ? "bg-white/20" : "bg-primary/10"}`}>
                      <Icon size={24} className={plan.highlighted ? "text-white" : "text-primary"} />
                    </div>
                    {plan.highlighted && (
                      <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
                    )}
                  </div>

                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${plan.highlighted ? "text-white/80" : "text-gray-600"}`}>
                      {plan.description}
                    </p>
                    <div className="flex flex-col gap-1">
                      {plan.isPro && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg line-through ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}>
                            12,99€
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.highlighted ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                            -31% OFF
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-600"}`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {plan.isPro ? (
                    <Button
                      onClick={() => handleCheckout(plan.name)}
                      disabled={loading === plan.name}
                      className={`w-full py-6 rounded-xl font-semibold mb-8 transition-all ${
                        plan.highlighted
                          ? "bg-white text-primary hover:bg-white/90 hover:scale-105"
                          : "gradient-purple text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {loading === plan.name ? "Loading..." : plan.cta}
                    </Button>
                  ) : (
                    <Link href={plan.link}>
                      <Button
                        className={`w-full py-6 rounded-xl font-semibold mb-8 transition-all ${
                          plan.highlighted
                            ? "bg-white text-primary hover:bg-white/90 hover:scale-105"
                            : "gradient-purple text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  )}

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          {feature.included ? (
                            <Check
                              size={20}
                              className={`flex-shrink-0 ${plan.highlighted ? "text-white" : "text-primary"}`}
                            />
                          ) : (
                            <X
                              size={20}
                              className={`flex-shrink-0 ${plan.highlighted ? "text-white/50" : "text-muted-foreground"}`}
                            />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              plan.highlighted
                                ? "text-white"
                                : feature.included
                                  ? "text-gray-900"
                                  : "text-gray-500"
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                        {feature.value && (
                          <span
                            className={`text-xs font-semibold ${
                              plan.highlighted
                                ? "text-white/90"
                                : feature.included
                                  ? "text-primary"
                                  : "text-gray-500"
                            }`}
                          >
                            {feature.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

