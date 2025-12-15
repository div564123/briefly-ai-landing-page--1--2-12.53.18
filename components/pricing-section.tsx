"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Zap, Crown } from "lucide-react"
import Link from "next/link"

export default function PricingSection() {
  // On the landing page, the upgrade button should redirect to login
  // Only the pricing page in the dashboard should handle Stripe checkout

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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-muted/30">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple Pricing for Students
          </h2>
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
                      : "border-border bg-white hover:border-primary/30"
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
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-foreground"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-bold ${plan.highlighted ? "text-white" : "text-foreground"}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={plan.isPro ? "/login" : plan.link}>
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
                                  ? "text-foreground"
                                  : "text-muted-foreground"
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
                                  : "text-muted-foreground"
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
    </section>
  )
}
