"use client"

import Link from "next/link"
import { ArrowLeft, Users, Target, Lightbulb, Heart, Globe, Shield } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Capso AI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to transform how students learn by making education accessible through audio.
          </p>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="bg-white rounded-2xl p-8 soft-shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Lightbulb className="text-primary" />
              Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Capso AI was founded by students who struggled with traditional learning methods. We realized that not
              everyone learns best by reading textbooks for hours. Some of us are auditory learners, some need to
              multitask, and some just want to make better use of commute time.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              That's why we built Capso AI - to convert any course material into high-quality audio summaries that you
              can listen to anywhere, anytime. Our AI technology understands your documents and creates clear, engaging
              audio content that helps you learn faster and retain more.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <Target className="text-primary w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower every student with tools that make learning more flexible, efficient, and enjoyable through
                innovative audio technology.
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8">
              <Globe className="text-primary w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where every student can access quality education in the format that works best for them,
                breaking down barriers to learning.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl p-8 soft-shadow">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Heart className="text-primary" />
              Our Values
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Student-First:</strong>
                  <span className="text-muted-foreground">
                    {" "}
                    Every decision we make prioritizes student success and learning outcomes.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Innovation:</strong>
                  <span className="text-muted-foreground">
                    {" "}
                    We continuously push boundaries to create better learning experiences through technology.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Accessibility:</strong>
                  <span className="text-muted-foreground">
                    {" "}
                    Education should be accessible to everyone, regardless of learning style or circumstances.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Quality:</strong>
                  <span className="text-muted-foreground">
                    {" "}
                    We never compromise on the quality of our AI-generated audio or user experience.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Students</h2>
          <p className="text-lg mb-6 opacity-90">Start transforming your learning experience today.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
