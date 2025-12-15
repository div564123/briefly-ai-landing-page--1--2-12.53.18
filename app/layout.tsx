import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import { GoogleAnalytics } from "@/components/google-analytics"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Capso AI - Transform Your Courses into Audio | AI-Powered Study Tool",
  description:
    "Capso AI converts your study materials, documents, and courses into clear, customizable audio summaries. Perfect for students who want to learn smarter, not harder. Generate audio from PDFs, documents, and more.",
  keywords: [
    "Capso AI",
    "capso ai",
    "AI audio generator",
    "text to speech",
    "audio summary",
    "study tool",
    "course converter",
    "document to audio",
    "PDF to audio",
    "AI study assistant",
    "audio learning",
    "educational technology",
  ],
  authors: [{ name: "Capso AI" }],
  creator: "Capso AI",
  publisher: "Capso AI",
  generator: "Capso AI",
  applicationName: "Capso AI",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://capsoai.com",
    siteName: "Capso AI",
    title: "Capso AI - Transform Your Courses into Audio",
    description:
      "Convert your study materials into clear, customizable audio summaries. Perfect for students who want to learn smarter, not harder.",
    images: [
      {
        url: "https://capsoai.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Capso AI - AI-Powered Audio Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capso AI - Transform Your Courses into Audio",
    description:
      "Convert your study materials into clear, customizable audio summaries. Perfect for students.",
    images: ["https://capsoai.com/og-image.png"],
    creator: "@capsoai",
  },
  alternates: {
    canonical: "https://capsoai.com",
  },
  metadataBase: new URL("https://capsoai.com"),
  // Google Site Verification - Add your verification code from Google Search Console
  // Format: "content" from <meta name="google-site-verification" content="XXXXX" />
  verification: {
    // google: "your-google-verification-code-here", // Uncomment and add your code after setting up Google Search Console
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/favicon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        url: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/icon-light-32x32.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#6D5BFF",
  userScalable: true,
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Capso AI",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    description:
      "Capso AI converts your study materials, documents, and courses into clear, customizable audio summaries. Perfect for students who want to learn smarter, not harder.",
    url: "https://capsoai.com",
    author: {
      "@type": "Organization",
      name: "Capso AI",
    },
    featureList: [
      "Convert documents to audio",
      "AI-powered text-to-speech",
      "Customizable voice settings",
      "Background music options",
      "Multiple language support",
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
