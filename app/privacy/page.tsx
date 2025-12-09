"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 3, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 soft-shadow prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="text-primary w-6 h-6" />
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Account information (name, email address, password)</li>
              <li>Profile information (educational institution, course preferences)</li>
              <li>Content you upload (documents, notes, course materials)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Usage data (features used, audio generated, settings preferences)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="text-primary w-6 h-6" />
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your documents and generate audio summaries</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-primary w-6 h-6" />
              3. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We take the security of your data seriously. We use industry-standard encryption to protect your
              information both in transit and at rest. Your uploaded documents are processed securely and are only
              accessible by you. We implement appropriate technical and organizational measures to maintain the security
              of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="text-primary w-6 h-6" />
              4. Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information
              only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="text-primary w-6 h-6" />
              5. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="text-primary w-6 h-6" />
              6. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide you services. If
              you wish to delete your account, please contact us, and we will delete your information within 30 days,
              except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="text-primary w-6 h-6" />
              7. Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from
              children under 13. If you become aware that a child has provided us with personal information, please
              contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-primary w-6 h-6" />
              8. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@capso.ai" className="text-primary hover:text-secondary">
                privacy@capso.ai
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
