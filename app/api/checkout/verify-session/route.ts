export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. Check Authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key is not configured" }, { status: 500 })
    }

    // Initialize Stripe client inside handler to avoid build-time errors
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    })

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 3. Get Stripe customer ID
    const customerId = (user as any).stripeCustomerId

    if (!customerId) {
      return NextResponse.json({ error: "No Stripe customer ID found" }, { status: 400 })
    }

    // 4. Check if user has active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10, // Get all subscriptions to check status
    })

    // 5. Check for active or trialing subscriptions
    // Note: A subscription can be "active" even if cancel_at_period_end is true
    // In that case, user keeps Pro access until current_period_end
    const now = Math.floor(Date.now() / 1000)
    const activeSubscription = subscriptions.data.find((sub) => {
      if (sub.status === "active" || sub.status === "trialing") {
        // Check if period has ended
        if (sub.current_period_end < now) {
          return false // Period ended, subscription is no longer valid
        }
        return true // Active subscription (even if scheduled for cancellation)
      }
      return false
    })

    // 6. If user has active subscription, upgrade to pro
    if (activeSubscription) {
      // Update user subscription tier to "pro"
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionTier: "pro" },
      })

      if (activeSubscription.cancel_at_period_end) {
        const periodEndDate = new Date(activeSubscription.current_period_end * 1000).toISOString()
        console.log(`✅ User ${user.email} has active subscription until ${periodEndDate} (scheduled for cancellation), keeping Pro access`)
      } else {
        console.log(`✅ User ${user.email} upgraded to Pro subscription (verified via Stripe API)`)
      }

      return NextResponse.json({
        success: true,
        tier: "pro",
        message: "Subscription verified and upgraded to Pro",
      })
    }

    // 7. Check recent checkout sessions (fallback for immediate payment verification)
    const checkoutSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 5,
    })

    // Find completed sessions from last 5 minutes
    const recentCompletedSession = checkoutSessions.data.find((session) => {
      if (session.status === "complete" && session.payment_status === "paid") {
        const sessionTime = new Date(session.created * 1000)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        return sessionTime > fiveMinutesAgo
      }
      return false
    })

    if (recentCompletedSession) {
      // Update user subscription tier to "pro"
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionTier: "pro" },
      })

      console.log(`✅ User ${user.email} upgraded to Pro subscription (verified via recent checkout session)`)

      return NextResponse.json({
        success: true,
        tier: "pro",
        message: "Subscription verified and upgraded to Pro",
      })
    }

    // 8. If no active subscription found, downgrade to starter if currently pro
    const currentTier = ((user as any)?.subscriptionTier as "starter" | "pro") || "starter"
    if (currentTier === "pro") {
      // Downgrade user to starter
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionTier: "starter" },
      })

      console.log(`📉 User ${user.email} has no active subscription, downgraded to Starter`)

      return NextResponse.json({
        success: false,
        tier: "starter",
        message: "No active subscription found, downgraded to Starter",
      })
    }

    // 9. Return current tier (already starter)
    return NextResponse.json({
      success: false,
      tier: currentTier,
      message: "No active subscription found",
    })
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify session" },
      { status: 500 }
    )
  }
}

