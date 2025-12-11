export const runtime = "nodejs"

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("⚠️ NEXTAUTH_SECRET is not set. Authentication may not work correctly.")
}

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("⚠️ NEXTAUTH_SECRET is not set. Authentication may not work correctly.")
}

if (!process.env.DATABASE_URL) {
  console.error("⚠️ DATABASE_URL is not set. Database operations will fail.")
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production",
  debug: false, // Disable debug mode to prevent /api/auth/_log errors
  logger: {
    error(code: string, metadata: any) {
      // Only log errors, not debug info
      if (code !== "FETCH_ERROR") {
        console.error("NextAuth error:", code, metadata)
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Get user ID from database
        if (user.email) {
          try {
            // Check if DATABASE_URL is configured before querying
            if (!process.env.DATABASE_URL) {
              console.error("DATABASE_URL not configured, skipping user lookup")
              return token
            }
            
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
            })
            if (dbUser) {
              token.id = String(dbUser.id)
            }
          } catch (error) {
            console.error("Error fetching user in jwt callback:", error)
            // Continue without user ID if database query fails
          }
        } else {
          token.id = user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          (session.user as any).id = token.id
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        // Return session even if there's an error
        return session
      }
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            return null
          }

          // Check if user has a password
          if (!user.password) {
            return null // User must have a password to sign in
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            return null
          }

          return {
            id: String(user.id),
            name: user.name ?? undefined,
            email: user.email,
          }
        } catch (error) {
          console.error("Error in authorize callback:", error)
          return null
        }
      },
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
