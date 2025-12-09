"use client"

import { Upload, Settings, FolderOpen } from "lucide-react"

export default function ProcessSection() {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "Upload Your Course",
      description: "Upload your notes, PDFs, or documents. Capso analyzes them instantly.",
    },
    {
      number: "2",
      icon: Settings,
      title: "Choose Your Settings",
      description: "Select the voice, speed, and background sound that helps you learn better.",
    },
    {
      number: "3",
      icon: FolderOpen,
      title: "Listen and Organize in Your Folders",
      description: "Listen wherever, whenever. Organize your revision by subject.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-white">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            3 Simple Steps to Better Learning
          </h2>
        </div>

        {/* Steps - Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 border border-border hover-lift soft-shadow"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
