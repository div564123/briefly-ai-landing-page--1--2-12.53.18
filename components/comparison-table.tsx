"use client"

import { Check, X } from "lucide-react"

export default function ComparisonTable() {
  const features = [
    "Monthly Uploads",
    "Voice Options",
    "Language Selection",
    "Background Music",
    "Voice Speed Control",
    "Audio Organization (Folders)",
    "MP3 Export",
    "Priority Support",
  ]

  const plans = {
    starter: ["5/month", true, true, true, false, false, true, false],
    proAction: ["Unlimited", true, true, true, true, true, true, false],
    pro: ["Unlimited", true, true, true, true, true, true, true],
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Plan Comparison</h2>
          <p className="text-muted-foreground">Choose the plan that fits your needs.</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-white soft-shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Features</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Starter</th>
                <th className="px-6 py-4 text-center font-semibold gradient-purple text-white rounded-t-lg">
                  Pro Action
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium text-foreground">{feature}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    {typeof plans.starter[idx] === "string" ? (
                      <span className="text-muted-foreground">{plans.starter[idx]}</span>
                    ) : plans.starter[idx] ? (
                      <Check size={20} className="text-green-500 mx-auto" />
                    ) : (
                      <X size={20} className="text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center bg-primary/5">
                    {typeof plans.proAction[idx] === "string" ? (
                      <span className="text-foreground font-medium">{plans.proAction[idx]}</span>
                    ) : plans.proAction[idx] ? (
                      <Check size={20} className="text-primary mx-auto" />
                    ) : (
                      <X size={20} className="text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {typeof plans.pro[idx] === "string" ? (
                      <span className="text-muted-foreground">{plans.pro[idx]}</span>
                    ) : plans.pro[idx] ? (
                      <Check size={20} className="text-green-500 mx-auto" />
                    ) : (
                      <X size={20} className="text-red-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
