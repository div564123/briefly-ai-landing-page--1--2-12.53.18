export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
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

    // TODO: Verify that the user owns this audio file (check database)
    // For now, we'll allow any authenticated user to download

    // Construct file path
    const audioFileName = `${audioId}.mp3`
    const audioPath = join(process.cwd(), "public", "audio", audioFileName)

    console.log("Looking for audio file at:", audioPath)

    try {
      // Read the audio file
      const audioBuffer = await readFile(audioPath)
      console.log("✅ Audio file found, size:", audioBuffer.length, "bytes")

      // Return the audio file with proper headers
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${audioFileName}"`,
          "Content-Length": audioBuffer.length.toString(),
        },
      })
    } catch (error) {
      console.error("❌ Error reading audio file:", error)
      console.error("   File path:", audioPath)
      console.error("   Error details:", error instanceof Error ? error.message : String(error))
      return NextResponse.json({ 
        error: "Audio file not found",
        details: process.env.NODE_ENV === "development" ? `Path: ${audioPath}` : undefined
      }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in audio download API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}



