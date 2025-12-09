"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Scale } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
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
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 3, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 soft-shadow prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Capso AI, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              2. Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily use Capso AI for personal, non-commercial purposes. This is the
              grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained on Capso AI</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              3. User Accounts
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account with us, you must provide accurate, complete, and current information. Failure
              to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You
              are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              4. Subscription and Billing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Certain parts of the Service are billed on a subscription basis. You will be billed in advance on a
              recurring and periodic basis. Billing cycles are set on a monthly basis. At the end of each billing cycle,
              your subscription will automatically renew unless you cancel it or Capso AI cancels it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              5. Content Ownership
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain all rights to the content you upload to Capso AI. We do not claim ownership of your
              materials. However, you grant us a license to use, store, and process your content to provide our
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              6. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
              including if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Capso AI or its suppliers be liable for any damages arising out of the use or
              inability to use the materials on Capso AI, even if Capso AI or an authorized representative has been
              notified of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              8. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@capso.ai" className="text-primary hover:text-secondary">
                legal@capso.ai
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
