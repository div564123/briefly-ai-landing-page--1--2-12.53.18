export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - Fetch notification preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        emailNotifications: true,
        generationAlerts: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      emailNotifications: user.emailNotifications,
      generationAlerts: user.generationAlerts,
    })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

// PUT - Update notification preferences
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emailNotifications, generationAlerts } = await req.json()

    const updateData: { emailNotifications?: boolean; generationAlerts?: boolean } = {}
    if (typeof emailNotifications === "boolean") updateData.emailNotifications = emailNotifications
    if (typeof generationAlerts === "boolean") updateData.generationAlerts = generationAlerts

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        emailNotifications: true,
        generationAlerts: true,
      },
    })

    return NextResponse.json({
      success: true,
      preferences: updatedUser,
    })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}

