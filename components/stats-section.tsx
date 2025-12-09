"use client"

import { Users, FileAudio, Clock, Star } from "lucide-react"

export default function StatsSection() {
  const stats = [
    { icon: Users, value: "2,400+", label: "Active Students" },
    { icon: FileAudio, value: "50,000+", label: "Courses Transformed" },
    { icon: Clock, value: "10hrs", label: "Saved Per Week" },
    { icon: Star, value: "4.9/5", label: "Trustpilot Rating" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                  <stat.icon className="text-primary" size={24} />
                </div>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
