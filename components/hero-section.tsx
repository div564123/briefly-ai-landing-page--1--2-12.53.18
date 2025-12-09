"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative overflow-hidden">
      {/* Clean minimal background with decorative grid pattern */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(109, 91, 255) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(109, 91, 255) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="text-center space-y-6">
        <p className="text-primary text-sm font-medium">
          Trusted by 2,400+ students to improve learning efficiency and ace their exams.
        </p>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            <span className="text-foreground">Transform your study time: </span>
            <span className="text-foreground">Convert your courses to audio </span>
            <span className="text-primary">in 2 minutes.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mx-auto max-w-3xl">
            Go from lengthy reading to focused listening in minutes.
            <br />
            Our AI transforms your notes and saves you hours while boosting retention.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link href="/signup">
            <Button className="gradient-purple text-white text-base py-6 px-8 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
