"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, HelpCircle, MessageCircle, Book, Zap } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      category: "Getting Started",
      icon: Zap,
      questions: [
        {
          q: "What types of documents can I upload?",
          a: "You can upload PDFs, text files, Word documents, photos of handwritten notes, and even images of whiteboards. Our AI will analyze the content and generate an audio summary.",
        },
        {
          q: "How does Capso AI work?",
          a: "Simply upload your course material, select your preferred voice and speed settings, and our AI will generate a clear audio summary. You can then listen, download, or organize it in custom folders.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes! Our Starter plan is completely free and gives you 4 uploads per month with basic features. No credit card required.",
        },
      ],
    },
    {
      category: "Features & Customization",
      icon: Book,
      questions: [
        {
          q: "Can I change voices?",
          a: "We offer multiple natural-sounding voices in different languages and accents. Pro users get access to premium voice options.",
        },
        {
          q: "Can I adjust the playback speed?",
          a: "Yes, Pro Action and Pro plan users can adjust playback speed from 0.5x to 2x to match their learning pace. Starter plan users have fixed playback speed.",
        },
        {
          q: "Can I add background music or sounds?",
          a: "Yes! All users can add ambient background music like calm piano, ambient sounds, soft jazz, nature sounds, or lo-fi beats to enhance focus while listening.",
        },
        {
          q: "Can I edit the audio summary?",
          a: "Yes! You can modify the generated summary text before converting it to audio. You have complete control over the final content.",
        },
      ],
    },
    {
      category: "Plans & Billing",
      icon: MessageCircle,
      questions: [
        {
          q: "Is there an upload limit?",
          a: "It depends on your plan. The Starter plan allows 4 uploads per month, while Pro Action and Pro plans offer unlimited uploads.",
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and other popular payment methods through our secure payment processor.",
        },
      ],
    },
    {
      category: "Usage & Organization",
      icon: Book,
      questions: [
        {
          q: "Can I listen offline?",
          a: "Yes! Once generated, audio files can be downloaded and listened to offline on any device, anytime.",
        },
        {
          q: "How do folders work?",
          a: "You can create custom folders to organize your audio content by course, subject, or semester. It's like having a personal library of audio learning materials.",
        },
        {
          q: "Can I share my audio files?",
          a: "Yes, you can download and share your generated audio files with classmates or study groups.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Capso AI. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="bg-white rounded-2xl p-8 soft-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, idx) => {
                  const globalIdx = catIdx * 100 + idx
                  return (
                    <div key={idx} className="border border-border rounded-xl overflow-hidden hover-lift transition">
                      <button
                        onClick={() => setOpenIdx(openIdx === globalIdx ? -1 : globalIdx)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition text-left"
                      >
                        <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                        <ChevronDown
                          size={20}
                          className={`text-primary flex-shrink-0 transition-transform ${
                            openIdx === globalIdx ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openIdx === globalIdx && (
                        <div className="px-6 py-4 bg-muted/30 border-t border-border">
                          <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help you get the most out of Capso AI.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
