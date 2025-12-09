"use client"

import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Options */}
          <div className="bg-white rounded-2xl p-6 soft-shadow hover-lift text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-3">We'll respond within 24 hours</p>
            <a href="mailto:support@capso.ai" className="text-primary hover:text-secondary transition">
              support@capso.ai
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 soft-shadow hover-lift text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-3">Mon-Fri from 8am to 6pm</p>
            <a href="tel:+1234567890" className="text-primary hover:text-secondary transition">
              +1 (234) 567-890
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 soft-shadow hover-lift text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-sm text-muted-foreground mb-3">Come say hello</p>
            <p className="text-primary">San Francisco, CA</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 md:p-12 soft-shadow max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <Button className="w-full md:w-auto gradient-purple text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
