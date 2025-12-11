export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Get user subscription tier from database
async function getUserSubscriptionTier(userId: number): Promise<"starter" | "pro"> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  return ((user as any)?.subscriptionTier as "starter" | "pro") || "starter"
}

// Get monthly upload count for current month
async function getUserMonthlyUploads(userId: number): Promise<number> {
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  const count = await (prisma as any).audioGeneration.count({
    where: {
      userId,
      month: currentMonth,
      year: currentYear,
    },
  })

  return count
}

// Usage limits based on subscription tier
const USAGE_LIMITS = {
  starter: 4, // 4 uploads per month
  pro: Infinity, // Unlimited uploads
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = parseInt(session.user.id as string, 10)
    const subscriptionTier = await getUserSubscriptionTier(userId)
    const monthlyUploads = await getUserMonthlyUploads(userId)
    const uploadLimit = USAGE_LIMITS[subscriptionTier]

    return NextResponse.json({
      current: monthlyUploads,
      limit: uploadLimit,
      tier: subscriptionTier,
      remaining: uploadLimit === Infinity ? Infinity : Math.max(0, uploadLimit - monthlyUploads),
    })
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    )
  }
}

