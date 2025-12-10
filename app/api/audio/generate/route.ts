export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import OpenAI from "openai"
// LemonFox TTS API - using REST API
import { writeFile, mkdir, readFile, unlink } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { existsSync } from "fs"

// Lazy load CommonJS modules to avoid top-level errors
let mammoth: any = null

function loadMammoth() {
  if (!mammoth) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mammoth = require("mammoth")
  }
  return mammoth
}

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
  starter: 5, // 5 uploads per month
  pro: Infinity, // Unlimited uploads
}

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

// LemonFox API configuration (OpenAI-compatible)
const LEMONFOX_API_URL = process.env.LEMONFOX_API_URL || "https://api.lemonfox.ai/v1/audio/speech"
const LEMONFOX_API_KEY = process.env.LEMONFOX_API_KEY || ""

/**
 * Extract text from uploaded file (PDF, DOCX, or DOC)
 */
async function extractTextFromFile(file: File): Promise<string> {
  try {
    console.log("Extracting text from file:", file.name, "Type:", file.type)
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text based on file type
    if (file.type === "application/pdf") {
      console.log("Processing PDF file...")
      console.log("Buffer length:", buffer.length, "bytes")
      
      // Use pdf2json - simpler library that works well in Node.js without workers
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const PDFParser = require("pdf2json")
      
      return new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1)
        
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error("PDF parsing error:", errData)
          const errorMsg = errData.parserError || "Unknown parsing error"
          reject(new Error(`Failed to parse PDF file. The PDF may be corrupted, password-protected, or in an unsupported format. Error: ${errorMsg}`))
        })
        
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          try {
            // Extract text from all pages
            let fullText = ""
            if (pdfData.Pages && pdfData.Pages.length > 0) {
              for (const page of pdfData.Pages) {
                if (page.Texts && page.Texts.length > 0) {
                  for (const textItem of page.Texts) {
                    if (textItem.R && textItem.R.length > 0) {
                      for (const run of textItem.R) {
                        if (run.T) {
                          // Decode URI-encoded text
                          fullText += decodeURIComponent(run.T) + " "
                        }
                      }
                    }
                  }
                }
              }
            }
            
            const text = fullText.trim()
            console.log("✅ PDF text extracted, length:", text.length, "characters")
            if (text.length === 0) {
              reject(new Error("PDF appears to be empty or contains only images without selectable text. Please use a PDF with actual text content or convert scanned images using OCR."))
            } else {
              resolve(text)
            }
          } catch (error) {
            reject(error)
          }
        })
        
        // Parse the buffer
        pdfParser.parseBuffer(buffer)
      })
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      console.log("Processing DOCX file...")
      const mammothLib = loadMammoth()
      const result = await mammothLib.extractRawText({ buffer })
      const text = result.value.trim()
      console.log("✅ DOCX text extracted, length:", text.length, "characters")
      if (result.messages && result.messages.length > 0) {
        console.warn("DOCX warnings:", result.messages)
      }
      return text
    } else if (file.type === "application/msword" || file.name.endsWith(".doc")) {
      console.log("Processing DOC file...")
      // Try to extract from DOC (older format)
      try {
        const mammothLib = loadMammoth()
        const result = await mammothLib.extractRawText({ buffer })
        const text = result.value.trim()
        console.log("✅ DOC text extracted, length:", text.length, "characters")
        return text
      } catch (error) {
        console.error("Error extracting DOC file:", error)
        throw new Error("DOC file format is not fully supported. Please convert your file to DOCX or PDF format and try again.")
      }
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF (.pdf) or Word document (.docx, .doc) file.`)
    }
  } catch (error) {
    console.error("Error extracting text from file:", error)
    // Preserve the original error message if it's already user-friendly
    const originalError = error instanceof Error ? error.message : "Unknown error"
    if (originalError.includes("empty") || originalError.includes("images") || originalError.includes("parse") || originalError.includes("corrupted")) {
      throw error // Re-throw user-friendly errors as-is
    }
    throw new Error(`Failed to extract text from file: ${originalError}. Please check if the file is not corrupted and try again.`)
  }
}

/**
 * Translate text to target language using OpenAI
 */
async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      en: "English",
      fr: "French",
      es: "Spanish",
    }

    const targetLangName = languageNames[targetLanguage] || "English"

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLangName}. Maintain the same tone and style. Only return the translated text, nothing else.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const translated = completion.choices[0]?.message?.content || text
    
    if (!translated || translated === text) {
      console.warn("Translation may have failed, using original text")
      return text
    }

    console.log(`✅ Text translated to ${targetLangName}`)
    return translated
  } catch (error: any) {
    console.error("Translation error:", error)
    // Return original text if translation fails
    return text
  }
}

/**
 * Adjust playback speed of audio using ffmpeg
 */
async function adjustPlaybackSpeed(audioBuffer: Buffer, speed: number): Promise<Buffer> {
  try {
    // Lazy load ffmpeg
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpeg = require("fluent-ffmpeg")
    
    // Try to set ffmpeg path - use ffmpeg-static if available, otherwise try system ffmpeg
    try {
      // Try ffmpeg-static first (better Next.js compatibility)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegStatic = require("ffmpeg-static")
      if (ffmpegStatic) {
        ffmpeg.setFfmpegPath(ffmpegStatic)
        console.log("✅ Using ffmpeg from ffmpeg-static")
      }
    } catch (staticError: any) {
      // If ffmpeg-static fails, try @ffmpeg-installer/ffmpeg
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
        if (ffmpegInstaller && ffmpegInstaller.path) {
          ffmpeg.setFfmpegPath(ffmpegInstaller.path)
          console.log("✅ Using ffmpeg from @ffmpeg-installer")
        }
      } catch (installerError: any) {
        // If both fail, try to use system ffmpeg
        console.log("⚠️  FFmpeg packages not available, trying system ffmpeg")
        // System ffmpeg should be in PATH, fluent-ffmpeg will find it automatically
        // If system ffmpeg is not available, the error will be caught below
      }
    }

    // Create temp directory if it doesn't exist
    // Use /tmp for Netlify compatibility (read-write access)
    const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")
    await mkdir(tempDir, { recursive: true }).catch(() => {
      // Directory might already exist
    })

    // Create temp file paths
    const inputPath = join(tempDir, `input-${randomUUID()}.mp3`)
    const outputPath = join(tempDir, `speed-${randomUUID()}.mp3`)

    try {
      // Write audio to temp file
      await writeFile(inputPath, audioBuffer)
      console.log(`📝 Audio written to temp file for speed adjustment`)

      // Adjust speed using ffmpeg
      // Using atempo filter (supports 0.5 to 2.0, can chain for wider range)
      const atempoValue = Math.min(Math.max(speed, 0.5), 2.0)
      const filters: string[] = []
      
      if (atempoValue < 0.5 || atempoValue > 2.0) {
        // Chain multiple atempo filters for speeds outside 0.5-2.0 range
        let remainingSpeed = atempoValue
        while (remainingSpeed > 2.0) {
          filters.push("atempo=2.0")
          remainingSpeed /= 2.0
        }
        while (remainingSpeed < 0.5) {
          filters.push("atempo=0.5")
          remainingSpeed /= 0.5
        }
        if (remainingSpeed !== 1.0) {
          filters.push(`atempo=${remainingSpeed.toFixed(2)}`)
        }
      } else {
        filters.push(`atempo=${atempoValue.toFixed(2)}`)
      }

      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(inputPath)
          .audioFilters(filters.join(","))
          .output(outputPath)
          .on("end", () => {
            console.log(`✅ Speed adjustment completed: ${speed}x`)
            resolve()
          })
          .on("error", (err: Error) => {
            console.error("❌ FFmpeg speed adjustment error:", err)
            reject(err)
          })
          .run()
      })

      // Read adjusted audio
      const adjustedAudio = await readFile(outputPath)
      console.log(`✅ Speed-adjusted audio created: ${adjustedAudio.length} bytes`)

      // Cleanup temp files
      await unlink(inputPath).catch(() => {})
      await unlink(outputPath).catch(() => {})

      return adjustedAudio
    } catch (speedError: any) {
      console.error("Error during speed adjustment:", speedError)
      // Cleanup temp files on error
      await unlink(inputPath).catch(() => {})
      await unlink(outputPath).catch(() => {})
      return audioBuffer // Return original if speed adjustment fails
    }
  } catch (error: any) {
    console.error("Error setting up speed adjustment:", error)
    if (error.message?.includes("Cannot find module")) {
      console.log("💡 Make sure ffmpeg packages are installed: npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg")
    }
    return audioBuffer
  }
}

/**
 * Mix background music with speech audio using ffmpeg
 */
async function mixBackgroundMusic(speechAudio: Buffer, musicType: string): Promise<Buffer> {
  try {
    // Lazy load ffmpeg to avoid top-level errors
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpeg = require("fluent-ffmpeg")
    
    // Try to set ffmpeg path - use ffmpeg-static if available, otherwise try system ffmpeg
    try {
      // Try ffmpeg-static first (better Next.js compatibility)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegStatic = require("ffmpeg-static")
      if (ffmpegStatic) {
        ffmpeg.setFfmpegPath(ffmpegStatic)
        console.log("✅ Using ffmpeg from ffmpeg-static")
      }
    } catch (staticError: any) {
      // If ffmpeg-static fails, try @ffmpeg-installer/ffmpeg
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
        if (ffmpegInstaller && ffmpegInstaller.path) {
          ffmpeg.setFfmpegPath(ffmpegInstaller.path)
          console.log("✅ Using ffmpeg from @ffmpeg-installer")
        }
      } catch (installerError: any) {
        // If both fail, try to use system ffmpeg
        console.log("⚠️  FFmpeg packages not available, trying system ffmpeg")
        // System ffmpeg should be in PATH, fluent-ffmpeg will find it automatically
        // If system ffmpeg is not available, the error will be caught below
      }
    }

    // Map music type to file path
    const musicFiles: Record<string, string> = {
      "calm-piano": join(process.cwd(), "public", "background-music", "calm-piano.mp3"),
      "ambient-sounds": join(process.cwd(), "public", "background-music", "ambient-sounds.mp3"),
      "soft-jazz": join(process.cwd(), "public", "background-music", "soft-jazz.mp3"),
      "nature-sounds": join(process.cwd(), "public", "background-music", "nature-sounds.mp3"),
      "lo-fi-beats": join(process.cwd(), "public", "background-music", "lo-fi-beats.mp3"),
    }

    const musicPath = musicFiles[musicType]
    
    if (!musicPath) {
      console.warn(`Background music file not found for: ${musicType}`)
      return speechAudio
    }

    // Check if music file exists
    if (!existsSync(musicPath)) {
      console.warn(`Background music file does not exist: ${musicPath}`)
      console.log("💡 Add background music files to public/background-music/")
      console.log("   See BACKGROUND_MUSIC_LANGUAGE_SETUP.md for free music sources")
      return speechAudio
    }

    // Create temp directory if it doesn't exist
    // Use /tmp for Netlify compatibility (read-write access)
    const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")
    await mkdir(tempDir, { recursive: true }).catch(() => {
      // Directory might already exist
    })

    // Create temp file paths
    const speechPath = join(tempDir, `speech-${randomUUID()}.mp3`)
    const outputPath = join(tempDir, `mixed-${randomUUID()}.mp3`)

    try {
      // Write speech audio to temp file
      await writeFile(speechPath, speechAudio)
      console.log(`📝 Speech audio written to temp file: ${speechPath}`)

      // Mix audio using ffmpeg
      // Speech volume: 0.7 (70%), Music volume: 0.15 (15%) - Reduced for less loud background
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(speechPath)
          .input(musicPath)
          .complexFilter([
            "[0:a]volume=0.7[speech]",
            "[1:a]volume=0.15,aloop=loop=-1:size=2e+09[music]",
            "[speech][music]amix=inputs=2:duration=first:dropout_transition=2[mixed]"
          ])
          .outputOptions(["-map", "[mixed]"])
          .output(outputPath)
          .on("end", () => {
            console.log("✅ Audio mixing completed")
            resolve()
          })
          .on("error", (err: Error) => {
            console.error("❌ FFmpeg error:", err)
            reject(err)
          })
          .on("stderr", (stderrLine: string) => {
            // FFmpeg outputs progress to stderr, we can ignore most of it
            if (stderrLine.includes("error") || stderrLine.includes("Error")) {
              console.error("FFmpeg stderr:", stderrLine)
            }
          })
          .run()
      })

      // Read mixed audio
      const mixedAudio = await readFile(outputPath)
      console.log(`✅ Mixed audio created: ${mixedAudio.length} bytes`)

      // Cleanup temp files
      await unlink(speechPath).catch(() => {})
      await unlink(outputPath).catch(() => {})

      return mixedAudio
    } catch (mixingError: any) {
      console.error("Error during audio mixing:", mixingError)
      // Cleanup temp files on error
      await unlink(speechPath).catch(() => {})
      await unlink(outputPath).catch(() => {})
      return speechAudio // Return original if mixing fails
    }
  } catch (error: any) {
    console.error("Error setting up background music mixing:", error)
    if (error.message?.includes("Cannot find module")) {
      console.log("💡 Make sure ffmpeg packages are installed: npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg")
    }
    return speechAudio
  }
}

/**
 * Step 1: Generate summary using OpenAI (ChatGPT) API
 */
async function generateSummary(text: string, summaryLength: "short" | "medium" | "full"): Promise<string> {
  try {
    const lengthInstructions = {
      short: "Create a brief summary (2-3 sentences) of the following text:",
      medium: "Create a medium-length summary (1-2 paragraphs) of the following text:",
      full: "Create a comprehensive summary of the following text, preserving key details:",
    }

    const prompt = `${lengthInstructions[summaryLength]}\n\n${text}`
    console.log("Sending prompt to OpenAI (length:", prompt.length, "chars)")

    // Use gpt-4o-mini for faster/cheaper responses, or gpt-4o for better quality
    const model = "gpt-4o-mini" // Change to "gpt-4o" for better quality
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates clear and concise summaries of educational content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: summaryLength === "full" ? 1000 : summaryLength === "medium" ? 500 : 200,
    })

    const summary = completion.choices[0]?.message?.content || ""
    
    if (!summary) {
      throw new Error("OpenAI returned an empty response")
    }

    console.log(`Summary generated successfully with ${model} (length:`, summary.length, "chars)")
    return summary
  } catch (error: any) {
    console.error("=== OpenAI API Error ===")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    console.error("Error status:", error?.status)
    if (error?.response) {
      console.error("API Response:", error.response)
    }
    console.error("Full error:", JSON.stringify(error, null, 2))
    console.error("=======================")
    
    // Provide more helpful error message
    if (error?.message?.includes("API key") || error?.code === "invalid_api_key") {
      throw new Error("OpenAI API key is invalid or missing. Please check your OPENAI_API_KEY in .env.local")
    }
    if (error?.message?.includes("quota") || error?.message?.includes("limit") || error?.code === "insufficient_quota") {
      throw new Error("OpenAI API quota exceeded. Please check your API usage limits or add credits to your account.")
    }
    if (error?.message?.includes("rate_limit") || error?.code === "rate_limit_exceeded") {
      throw new Error("OpenAI API rate limit exceeded. Please wait a moment and try again.")
    }
    
    throw new Error(`Failed to generate summary: ${error?.message || "Unknown error"}`)
  }
}

/**
 * Step 2: Generate audio using LemonFox TTS API
 */
async function generateAudio(
  text: string,
  voiceId: string = "heart", // Default voice (LemonFox default)
  speed: number = 1.0
): Promise<Buffer> {
  try {
    // Validate LemonFox API key
    if (!LEMONFOX_API_KEY || LEMONFOX_API_KEY === "your-lemonfox-api-key-here") {
      throw new Error("LemonFox API key is not configured. Please set LEMONFOX_API_KEY in .env.local with your actual API key")
    }

    console.log("Calling LemonFox TTS API with:")
    console.log("  - Voice ID:", voiceId)
    console.log("  - Text length:", text.length, "characters")
    console.log("  - Speed:", speed, "(LemonFox supports speed directly)")

    // LemonFox API call
    // Note: LemonFox supports speed parameter directly, no need for ffmpeg
    const response = await fetch(LEMONFOX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LEMONFOX_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        voice: voiceId,
        response_format: "mp3",
        speed: speed, // LemonFox supports speed directly (0.25 to 4.0)
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`LemonFox API error: ${errorData.error || response.statusText} (Status: ${response.status})`)
    }

    console.log("✅ LemonFox API call successful, converting response to buffer...")

    // Get audio as buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("✅ Audio buffer created:", buffer.length, "bytes")
    return buffer
  } catch (error: any) {
    console.error("❌ Error generating audio with LemonFox:")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error?.message)
    
    // Provide more helpful error messages
    if (error?.message?.includes("API key") || error?.message?.includes("401") || error?.message?.includes("Unauthorized")) {
      throw new Error("LemonFox API key is invalid or missing. Please check your LEMONFOX_API_KEY in .env.local")
    }
    if (error?.message?.includes("quota") || error?.message?.includes("limit") || error?.message?.includes("429")) {
      throw new Error("LemonFox API quota exceeded. Please check your account limits.")
    }
    if (error?.message?.includes("rate")) {
      throw new Error("LemonFox API rate limit exceeded. Please wait a moment and try again.")
    }
    if (error?.message?.includes("voice") || error?.message?.includes("Invalid")) {
      throw new Error(`Invalid voice ID: ${voiceId}. Please check the voice mapping.`)
    }
    
    throw new Error(`Failed to generate audio: ${error?.message || "Unknown error"}`)
  }
}

/**
 * Map voice name from settings panel to LemonFox voice ID
 * Settings panel uses: sarah, emma, olivia, james, liam, noah
 * LemonFox voices - adjust these based on available voices in your LemonFox account
 */
function getVoiceIdFromTone(voiceName: string): string {
  const voiceMap: Record<string, string> = {
    // Settings panel voice names -> LemonFox voices
    // LemonFox has 50+ voices - using common voice names
    sarah: "sarah", // Clear & Professional (LemonFox example voice)
    emma: "emma", // Warm & Friendly
    olivia: "olivia", // Energetic & Young
    james: "james", // Deep & Authoritative
    liam: "liam", // Calm & Soothing
    noah: "noah", // Confident & Clear
    
    // Legacy tone names (for backwards compatibility)
    professional: "sarah",
    warm: "emma",
    energetic: "olivia",
    calm: "liam",
    authoritative: "james",
    clear: "noah",
  }

  // Default to "heart" (LemonFox's default voice)
  return voiceMap[voiceName.toLowerCase()] || "heart"
}

export async function POST(req: Request) {
  try {
    // 1. Check Authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = user.id

    // 2. Check Subscription Tier
    const subscriptionTier = await getUserSubscriptionTier(userId)

    // 3. Check Usage Limits
    const monthlyUploads = await getUserMonthlyUploads(userId)
    const uploadLimit = USAGE_LIMITS[subscriptionTier]

    if (monthlyUploads >= uploadLimit) {
      return NextResponse.json(
        {
          error: "Monthly upload limit reached",
          limit: uploadLimit,
          current: monthlyUploads,
          tier: subscriptionTier,
        },
        { status: 403 }
      )
    }

    // 4. Handle File Upload (multipart form data)
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const speed = formData.get("speed") as string | null
    const tone = formData.get("tone") as string | null
    const summaryLength = (formData.get("summaryLength") as string | null) || "medium"
    const language = (formData.get("language") as string | null) || "en"
    const backgroundMusic = (formData.get("backgroundMusic") as string | null) || "none"
    const customSummary = formData.get("customSummary") as string | null // Optional: user-edited summary

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type (PDF, DOCX, DOC)
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOCX, and DOC files are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 50 MB)
    const maxSize = 50 * 1024 * 1024 // 50 MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 50 MB limit" }, { status: 400 })
    }

    // Validate speed and tone settings
    const speedValue = parseFloat(speed || "1.0")
    const voiceName = tone || "sarah" // Default to sarah if not provided
    const summaryLengthValue = summaryLength as "short" | "medium" | "full"

    // Check if user is trying to use voice speed (Pro feature)
    if (speedValue !== 1.0 && subscriptionTier !== "pro") {
      return NextResponse.json(
        {
          error: "Voice speed control is a Pro feature. Please upgrade to Pro to adjust playback speed.",
          feature: "voice_speed",
          tier: subscriptionTier,
        },
        { status: 403 }
      )
    }

    // Validate API keys
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json({ 
        error: "OPENAI_API_KEY is not configured. Please add your OpenAI API key to .env.local" 
      }, { status: 500 })
    }

    if (!LEMONFOX_API_KEY || LEMONFOX_API_KEY === "your-lemonfox-api-key-here") {
      return NextResponse.json({ 
        error: "LemonFox API key is not configured. Please add LEMONFOX_API_KEY to .env.local with your actual API key from LemonFox" 
      }, { status: 500 })
    }

    // Validate API key formats
    if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
      console.warn("⚠️  OpenAI API key format might be incorrect (should start with 'sk-')")
    }

    console.log("=== AI Audio Generation Request ===")
    console.log("User:", userId)
    console.log("Subscription Tier:", subscriptionTier)
    console.log("Monthly Uploads:", monthlyUploads, "/", uploadLimit)
    console.log("File Name:", file.name)
    console.log("File Size:", (file.size / 1024 / 1024).toFixed(2), "MB")
    console.log("File Type:", file.type)
    console.log("Speed Setting:", speedValue)
    console.log("Voice Name:", voiceName)
    console.log("Summary Length:", summaryLengthValue)

    // 5. AI Generation Pipeline

    let summary: string

    // Check if custom summary was provided (user edited it in preview)
    if (customSummary && customSummary.trim()) {
      console.log("Using custom/edited summary from user")
      summary = customSummary.trim()
      // Note: Translation is already handled in the preview step, so we use the summary as-is
    } else {
      // Step 1: Extract text from file
      console.log("Step 1: Extracting text from file...")
      const extractedText = await extractTextFromFile(file)
      console.log("Text extracted:", extractedText.substring(0, 100) + "...")

      // Step 2: Generate summary using OpenAI (ChatGPT)
      console.log("Step 2: Generating summary with OpenAI...")
      summary = await generateSummary(extractedText, summaryLengthValue)
      console.log("Summary generated:", summary.substring(0, 100) + "...")

      // Step 2.5: Translate summary if language is not English
      if (language !== "en") {
        console.log(`Step 2.5: Translating summary to ${language}...`)
        summary = await translateText(summary, language)
        console.log("Summary translated:", summary.substring(0, 100) + "...")
      }
    }

    // Step 3: Generate audio using LemonFox
    console.log("Step 3: Generating audio with LemonFox...")
    const voiceId = getVoiceIdFromTone(voiceName)
    console.log("Using LemonFox voice ID:", voiceId, "for voice name:", voiceName)
    // LemonFox supports speed parameter directly, no need for ffmpeg adjustment
    let audioBuffer = await generateAudio(summary, voiceId, speedValue)
    console.log("Audio generated:", audioBuffer.length, "bytes")

    // Step 3.5: Mix background music if selected
    if (backgroundMusic && backgroundMusic !== "none") {
      console.log(`Step 3.5: Mixing background music: ${backgroundMusic}...`)
      audioBuffer = await mixBackgroundMusic(audioBuffer, backgroundMusic)
      console.log("Audio with background music:", audioBuffer.length, "bytes")
    }

    // Step 4: Prepare audio for response
    // On Netlify, we can't save to public/audio (read-only filesystem)
    // Instead, we'll return the audio directly or store in database
    console.log("Step 4: Preparing audio response...")
    const audioId = randomUUID()
    const audioFileName = `${audioId}.mp3`
    
    // For Netlify compatibility: return audio as base64 in response
    // The audio will be available immediately, no file storage needed
    const audioBase64 = audioBuffer.toString('base64')
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`
    
    // Generate download URL (will return audio directly)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const downloadUrl = `${baseUrl}/api/audio/download/${audioId}`

    console.log("Audio prepared for response:", audioBuffer.length, "bytes")
    console.log("Download URL:", downloadUrl)

    // 5. Save audio generation to database (tracks monthly usage)
    const now = new Date()
    const currentMonth = now.getMonth() + 1 // 1-12
    const currentYear = now.getFullYear()

    await (prisma as any).audioGeneration.create({
      data: {
        userId: userId,
        fileName: file.name,
        audioUrl: downloadUrl,
        summary: summary.substring(0, 500), // Store first 500 chars of summary
        month: currentMonth,
        year: currentYear,
      },
    })

    // Get updated monthly upload count
    const updatedMonthlyUploads = await getUserMonthlyUploads(userId)

    console.log("Audio generation saved to database")
    console.log("Updated monthly uploads:", updatedMonthlyUploads, "/", uploadLimit)
    console.log("===================================")

    // Return success response with audio data and download URL
    return NextResponse.json({
      success: true,
      audioData: audioDataUrl, // Base64 audio data for immediate use
      audioBuffer: audioBase64, // Also include as buffer for compatibility
      message: "Audio generation completed",
      audio: {
        id: audioId,
        fileName: audioFileName,
        downloadUrl: downloadUrl,
        size: audioBuffer.length,
      },
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      settings: {
        speed: speedValue,
        voice: voiceName,
        summaryLength: summaryLengthValue,
      },
      summary: {
        length: summary.length,
        preview: summary.substring(0, 200) + "...",
      },
      subscription: {
        tier: subscriptionTier,
        monthlyUploads: updatedMonthlyUploads,
        limit: uploadLimit,
      },
    })
  } catch (error: any) {
    console.error("=== ERROR in audio generation API ===")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)
    if (error?.response) {
      console.error("API Response error:", error.response)
    }
    if (error?.status) {
      console.error("HTTP Status:", error.status)
    }
    console.error("Full error object:", JSON.stringify(error, null, 2))
    console.error("=====================================")
    
    const errorMessage = error?.message || "Internal server error"
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

