"use client"

import Link from "next/link"
import { ArrowLeft, Cookie, Settings, Shield } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CookiesPage() {
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
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: December 3, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 soft-shadow prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Cookie className="text-primary w-6 h-6" />
              1. What Are Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website.
              They are widely used to make websites work more efficiently and provide useful information to website
              owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="text-primary w-6 h-6" />
              2. How We Use Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use cookies for several reasons:</p>
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable core functionality such
                  as security, network management, and accessibility. You may disable these by changing your browser
                  settings, but this may affect how the website functions.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting
                  information anonymously. This helps us improve our service.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Functionality Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies enable the website to provide enhanced functionality and personalization, such as
                  remembering your preferences and settings.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are used to track visitors across websites to display relevant and engaging
                  advertisements. We only use these with your explicit consent.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="text-primary w-6 h-6" />
              3. Third-Party Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may also use cookies from trusted third-party services, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Google Analytics - to analyze website usage and improve our service</li>
              <li>Stripe - to process payments securely</li>
              <li>Social media platforms - if you choose to share content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="text-primary w-6 h-6" />
              4. Managing Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Browser settings - Most browsers allow you to refuse or accept cookies</li>
              <li>Cookie preferences - Use our cookie consent banner to customize your preferences</li>
              <li>Delete cookies - You can delete cookies that have already been set</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Please note that blocking some types of cookies may impact your experience on our website and limit the
              services we can provide.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Cookie className="text-primary w-6 h-6" />
              5. Cookie Duration
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies may be either "session" cookies or "persistent" cookies. Session cookies are deleted when you
              close your browser, while persistent cookies remain on your device until they expire or you delete them.
              The duration of persistent cookies varies depending on their purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="text-primary w-6 h-6" />
              6. Updates to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
              policy on this page with an updated "Last updated" date.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@briefly.ai" className="text-primary hover:text-secondary">
                privacy@briefly.ai
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
