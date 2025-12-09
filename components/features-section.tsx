"use client"

import { Zap, Mic, Ear, Folder, Code } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Smart Summary",
      description: "AI transforms your course into a clear and digestible summary.",
    },
    {
      icon: Mic,
      title: "Advanced Audio Learning",
      description: "Natural voices, adjustable speed, ambient sounds to boost concentration.",
    },
    {
      icon: Ear,
      title: "Maximum Productivity",
      description: "Listen to your courses anywhere: commute, gym, relaxing, quick revision.",
    },
    {
      icon: Folder,
      title: "Content Organization",
      description: "Store your audio files in personalized course folders.",
    },
    {
      icon: Code,
      title: "API Available",
      description: "POST /capso/generate-audio for complete integration.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-white">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Optimized for Faster Learning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All the features you need to master your learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group bg-white rounded-xl p-6 border border-border hover-lift soft-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
