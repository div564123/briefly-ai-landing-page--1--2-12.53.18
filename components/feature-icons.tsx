"use client"

import { FileText, Headphones, Settings, FolderOpen, Sparkles, Zap } from "lucide-react"

export default function FeatureIcons() {
  const features = [
    {
      icon: FileText,
      label: "Upload Documents",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Sparkles,
      label: "AI Processing",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Headphones,
      label: "Audio Learning",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Settings,
      label: "Customize Settings",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      icon: Zap,
      label: "Instant Results",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: FolderOpen,
      label: "Organize Content",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
          >
            {/* Animated gradient background on hover */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Icon container with gradient */}
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-[2px]`}>
              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
            </div>

            {/* Label */}
            <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
