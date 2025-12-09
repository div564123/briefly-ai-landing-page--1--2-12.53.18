export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        audioGenerations: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prepare export data (exclude sensitive information)
    const exportData = {
      account: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        createdAt: user.createdAt,
        preferences: {
          emailNotifications: user.emailNotifications,
          generationAlerts: user.generationAlerts,
        },
      },
      audioGenerations: user.audioGenerations.map((gen) => ({
        id: gen.id,
        fileName: gen.fileName,
        audioUrl: gen.audioUrl,
        summary: gen.summary,
        createdAt: gen.createdAt,
        month: gen.month,
        year: gen.year,
      })),
      exportDate: new Date().toISOString(),
      totalGenerations: user.audioGenerations.length,
    }

    // Return as JSON file download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="briefly-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}

