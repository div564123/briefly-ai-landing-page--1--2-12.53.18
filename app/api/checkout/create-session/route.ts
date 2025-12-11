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

    const { priceId } = await req.json()

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 3. Get or create Stripe customer ID
    let customerId = (user as any).stripeCustomerId

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      console.log("Creating Stripe customer for checkout:", user.email)
      
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id.toString(),
        },
      })

      customerId = customer.id

      // Save customer ID to database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })

      console.log("✅ Stripe customer created:", customerId)
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    // 4. Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId, // Use existing or newly created customer
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Capso AI Pro Action",
              description: "Unlimited uploads, voice speed control, background music, and audio organization",
            },
            unit_amount: 899, // €8.99 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
    })

    console.log("✅ Checkout session created:", checkoutSession.id)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

