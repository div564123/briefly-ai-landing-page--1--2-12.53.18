import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get recent audio generations
    const audioGenerations = await (prisma as any).audioGeneration.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        fileName: true,
        audioUrl: true,
        summary: true,
        createdAt: true,
      },
    })

    // Get total count for pagination
    const totalCount = await (prisma as any).audioGeneration.count({
      where: {
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      audioGenerations: audioGenerations.map((audio: any) => ({
        id: audio.id,
        fileName: audio.fileName,
        audioUrl: audio.audioUrl,
        summary: audio.summary,
        createdAt: audio.createdAt,
      })),
      total: totalCount,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error("Error fetching audio history:", error)
    return NextResponse.json(
      { error: "Failed to fetch audio history", details: error.message },
      { status: 500 }
    )
  }
}




