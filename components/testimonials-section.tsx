"use client"

import { Star, Quote } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sophie L.",
      role: "Medical Student",
      content:
        "Briefly has revolutionized my studying. I can now listen to my courses during train rides. I've saved 10 hours per week!",
      rating: 5,
    },
    {
      name: "Thomas B.",
      role: "Law Student",
      content:
        "No more hours rereading my notes. Audio lets me study anywhere, even while exercising. My results have skyrocketed!",
      rating: 5,
    },
    {
      name: "Marie C.",
      role: "Business Student",
      content:
        "The folder organization and audio quality are exceptional. It's become essential for my exam preparation.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-muted/30">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Over 2,400 Students Trust Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how Briefly helps students study more effectively
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-border soft-shadow hover-lift relative">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote size={32} className="text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6 text-pretty">"{testimonial.content}"</p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
