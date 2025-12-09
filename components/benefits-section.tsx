"use client"

import { Check, Clock, Brain, FolderOpen } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      points: [
        "Study while doing other things: exercise, commute, breaks",
        "No need to reread your notes for hours",
        "Active learning even on the move",
      ],
    },
    {
      icon: Brain,
      title: "Improve Memory",
      points: [
        "Audio reinforces information retention",
        "Repeated listening to anchor concepts",
        "Choose your speed to optimize comprehension",
      ],
    },
    {
      icon: FolderOpen,
      title: "Stay Organized",
      points: [
        "All your audio courses in custom folders",
        "Find what you're looking for instantly",
        "Automatic sync across devices",
      ],
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Students Choose Briefly
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A study method adapted to your lifestyle</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition">
                <benefit.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">{benefit.title}</h3>
              <ul className="space-y-4">
                {benefit.points.map((point, pointIdx) => (
                  <li key={pointIdx} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check size={14} className="text-primary" />
                      </div>
                    </div>
                    <span className="text-muted-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
