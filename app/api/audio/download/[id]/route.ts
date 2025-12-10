export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract audio ID from URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const audioId = params?.id || pathParts[pathParts.length - 1]

    console.log("Download request - URL:", req.url)
    console.log("Download request - params:", params)
    console.log("Download request - audioId:", audioId)

    if (!audioId || audioId === '[id]' || audioId === 'download') {
      console.error("❌ Audio ID is missing or invalid")
      return NextResponse.json({ error: "Audio ID is required" }, { status: 400 })
    }

    // Get audio generation from database
    const { prisma } = await import("@/lib/prisma")
    
    try {
      // Find audio generation by ID (stored in audioUrl)
      const audioGeneration = await (prisma as any).audioGeneration.findFirst({
        where: {
          audioUrl: {
            contains: audioId
          }
        },
        include: {
          user: true
        }
      })

      if (!audioGeneration) {
        console.error("❌ Audio generation not found for ID:", audioId)
        return NextResponse.json({ 
          error: "Audio file not found"
        }, { status: 404 })
      }

      // Verify user owns this audio file
      const userEmail = session.user.email
      if (audioGeneration.user.email !== userEmail) {
        console.error("❌ User does not own this audio file")
        return NextResponse.json({ 
          error: "Unauthorized"
        }, { status: 403 })
      }

      // On Netlify, files aren't stored on disk
      // The audio should be retrieved from the original generation
      // For now, return an error suggesting to regenerate
      // TODO: Implement cloud storage or database storage for audio files
      console.log("⚠️  Audio file requested but not stored (Netlify limitation)")
      return NextResponse.json({ 
        error: "Audio file not available for download. Please regenerate the audio.",
        message: "On Netlify, audio files are returned directly in the generation response. Use the audioData field from the generation API."
      }, { status: 404 })
    } catch (error) {
      console.error("❌ Error retrieving audio:", error)
      return NextResponse.json({ 
        error: "Error retrieving audio file",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in audio download API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}



