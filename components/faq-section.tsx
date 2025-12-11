"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      question: "What types of documents can I upload?",
      answer:
        "You can upload PDFs, text files, photos of handwritten notes, and even images of boards. Our AI will analyze the content and generate an audio summary.",
    },
    {
      question: "Can I edit the audio summary?",
      answer:
        "Yes! You can modify the generated summary text before audio conversion. You have complete control over the final content.",
    },
    {
      question: "Can I change voices?",
      answer: "Of course. We offer multiple natural voices in different languages. You can change voices at any time.",
    },
    {
      question: "Can I listen offline?",
      answer: "Yes, once generated, audio files can be downloaded and listened to offline on any device.",
    },
    {
      question: "Is there an upload limit?",
      answer:
        "It depends on your plan. The Starter plan allows 4 uploads per month, while Pro Action offers unlimited uploads.",
    },
    {
      question: "How do folders work?",
      answer:
        "You can create folders to organize your content by course or subject. It's like having a personal library of audio files.",
    },
  ]

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="text-primary" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about Capso AI.</p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-border rounded-xl overflow-hidden bg-white hover-lift soft-shadow">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition"
              >
                <h3 className="font-semibold text-foreground text-left">{faq.question}</h3>
                <ChevronDown
                  size={20}
                  className={`text-primary flex-shrink-0 transition-transform ${openIdx === idx ? "rotate-180" : ""}`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
