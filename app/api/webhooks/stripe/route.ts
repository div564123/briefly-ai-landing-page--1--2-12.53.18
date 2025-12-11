export const runtime = "nodejs"

import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(req: Request) {
  try {
    // Initialize Stripe client inside handler to avoid build-time errors
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key is not configured" }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    })

    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Get customer ID from session
        const customerId = session.customer as string

        if (!customerId) {
          console.error("No customer ID in checkout session")
          break
        }

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.error("User not found for customer ID:", customerId)
          break
        }

        // Update user subscription tier to "pro"
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionTier: "pro" },
        })

        console.log(`✅ User ${user.email} upgraded to Pro subscription`)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          // Subscription is deleted - downgrade immediately
          // This event is sent when the subscription period has ended after cancellation
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier: "starter" },
          })

          console.log(`📉 User ${user.email} subscription deleted (period ended), downgraded to Starter`)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          // Check subscription status
          // Important: If subscription is canceled but cancel_at_period_end is true,
          // the subscription is still active until the period ends
          const isCanceledButActive = 
            subscription.cancel_at_period_end === true && 
            subscription.status === "active"
          
          // Check if subscription period has ended
          const now = Math.floor(Date.now() / 1000)
          const periodEnded = subscription.current_period_end < now

          // If subscription is truly canceled and period has ended, downgrade
          if (
            (subscription.status === "canceled" && periodEnded) ||
            subscription.status === "past_due" ||
            subscription.status === "unpaid" ||
            subscription.status === "incomplete" ||
            subscription.status === "incomplete_expired"
          ) {
            // Downgrade user to starter
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionTier: "starter" },
            })

            console.log(`📉 User ${user.email} subscription ended (${subscription.status}), downgraded to Starter`)
          } else if (subscription.status === "active" || subscription.status === "trialing") {
            // Subscription is active (even if scheduled for cancellation)
            // User keeps Pro access until period ends
            if ((user as any).subscriptionTier !== "pro") {
              await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionTier: "pro" },
              })

              if (isCanceledButActive) {
                console.log(`✅ User ${user.email} subscription active until ${new Date(subscription.current_period_end * 1000).toISOString()}, keeping Pro access`)
              } else {
                console.log(`✅ User ${user.email} subscription active, upgraded to Pro`)
              }
            } else if (isCanceledButActive) {
              console.log(`ℹ️  User ${user.email} subscription will cancel at period end (${new Date(subscription.current_period_end * 1000).toISOString()}), but still has Pro access`)
            }
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    )
  }
}

