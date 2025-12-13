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
  const tier = ((user as any)?.subscriptionTier as "starter" | "pro") || "starter"
  console.log("🔍 Database tier check - User ID:", userId, "Tier from DB:", tier, "Full user:", user ? { id: user.id, email: user.email, subscriptionTier: (user as any).subscriptionTier } : "User not found")
  return tier
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

// LemonFox API configuration (OpenAI-compatible)
const LEMONFOX_API_URL = process.env.LEMONFOX_API_URL || "https://api.lemonfox.ai/v1/audio/speech"
const LEMONFOX_API_KEY = process.env.LEMONFOX_API_KEY || ""

/**
 * Get OpenAI client instance (initialized inside function to avoid build-time errors)
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured")
  }
  return new OpenAI({ apiKey })
}

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
                          try {
                            // Decode URI-encoded text
                            fullText += decodeURIComponent(run.T) + " "
                          } catch (decodeError) {
                            // If decodeURIComponent fails (malformed URL), try to use the text as-is
                            console.warn("Failed to decode PDF text, using raw text:", decodeError)
                            try {
                              fullText += run.T + " "
                            } catch (fallbackError) {
                              // If even that fails, skip this text item
                              console.warn("Failed to extract text from PDF item, skipping:", fallbackError)
                            }
                          }
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

    const openai = getOpenAIClient()
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
      max_tokens: 1500, // Reduced for faster translation
      stream: false, // Ensure no streaming for faster response
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
        // Use dynamic import to avoid build-time module resolution
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        let ffmpegInstaller: any
        try {
          // Check if module exists before requiring
          require.resolve("@ffmpeg-installer/ffmpeg")
          ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
        } catch (resolveError: any) {
          // Module not found, skip
          throw resolveError
        }
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
    // Detect Netlify environment
    const isNetlifyEnv = !!(
      process.env.NETLIFY || 
      process.env.NETLIFY_DEV || 
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      process.cwd().includes("/var/task") ||
      process.cwd().includes("/opt/build")
    )
    const tempDir = isNetlifyEnv ? "/tmp" : join(process.cwd(), "tmp")
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
  console.log(`🎵 mixBackgroundMusic called with musicType: "${musicType}", speechAudio size: ${speechAudio.length} bytes`)
  try {
    // Lazy load ffmpeg to avoid top-level errors
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpeg = require("fluent-ffmpeg")
    console.log("✅ fluent-ffmpeg loaded successfully")
    
    // Try to set ffmpeg path - use ffmpeg-static if available, otherwise try system ffmpeg
    let ffmpegPathSet = false
    
    // Detect Netlify environment
    const isNetlifyEnv = !!(
      process.env.NETLIFY || 
      process.env.NETLIFY_DEV || 
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      process.cwd().includes("/var/task") ||
      process.cwd().includes("/opt/build")
    )
    
    try {
      // Try ffmpeg-static first (better Next.js compatibility)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegStatic = require("ffmpeg-static")
      if (ffmpegStatic && existsSync(ffmpegStatic)) {
        if (isNetlifyEnv) {
          // On Netlify, copy FFmpeg binary to /tmp and make it executable
          // This is necessary because binaries in node_modules may not be executable
          const { copyFileSync, chmodSync } = require("fs")
          const tmpFfmpegPath = "/tmp/ffmpeg"
          
          try {
            console.log(`📦 Copying FFmpeg binary from ${ffmpegStatic} to ${tmpFfmpegPath}...`)
            copyFileSync(ffmpegStatic, tmpFfmpegPath)
            chmodSync(tmpFfmpegPath, 0o755) // Make executable (rwxr-xr-x)
            ffmpeg.setFfmpegPath(tmpFfmpegPath)
            console.log(`✅ Using ffmpeg from ffmpeg-static (copied to ${tmpFfmpegPath})`)
            ffmpegPathSet = true
          } catch (copyError: any) {
            console.log(`⚠️  Failed to copy ffmpeg to /tmp: ${copyError.message}`)
            console.log(`   Trying original path: ${ffmpegStatic}`)
            // Try original path anyway
            ffmpeg.setFfmpegPath(ffmpegStatic)
            console.log("✅ Using ffmpeg from ffmpeg-static (original path)")
            ffmpegPathSet = true
          }
        } else {
          // Local development - use original path
          ffmpeg.setFfmpegPath(ffmpegStatic)
          console.log("✅ Using ffmpeg from ffmpeg-static")
          ffmpegPathSet = true
        }
      } else {
        console.log(`⚠️  ffmpeg-static path does not exist: ${ffmpegStatic}`)
      }
    } catch (staticError: any) {
      console.log(`⚠️  ffmpeg-static not available: ${staticError.message}`)
    }
    
    // If ffmpeg-static didn't work, try @ffmpeg-installer/ffmpeg
    if (!ffmpegPathSet) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        let ffmpegInstaller: any
        try {
          require.resolve("@ffmpeg-installer/ffmpeg")
          ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
        } catch (resolveError: any) {
          throw resolveError
        }
        if (ffmpegInstaller && ffmpegInstaller.path && existsSync(ffmpegInstaller.path)) {
          if (isNetlifyEnv) {
            // On Netlify, copy to /tmp
            const { copyFileSync, chmodSync } = require("fs")
            const tmpFfmpegPath = "/tmp/ffmpeg"
            try {
              console.log(`📦 Copying FFmpeg binary from ${ffmpegInstaller.path} to ${tmpFfmpegPath}...`)
              copyFileSync(ffmpegInstaller.path, tmpFfmpegPath)
              chmodSync(tmpFfmpegPath, 0o755)
              ffmpeg.setFfmpegPath(tmpFfmpegPath)
              console.log(`✅ Using ffmpeg from @ffmpeg-installer (copied to ${tmpFfmpegPath})`)
              ffmpegPathSet = true
            } catch (copyError: any) {
              console.log(`⚠️  Failed to copy ffmpeg to /tmp: ${copyError.message}`)
              ffmpeg.setFfmpegPath(ffmpegInstaller.path)
              console.log("✅ Using ffmpeg from @ffmpeg-installer (original path)")
              ffmpegPathSet = true
            }
          } else {
            ffmpeg.setFfmpegPath(ffmpegInstaller.path)
            console.log("✅ Using ffmpeg from @ffmpeg-installer")
            ffmpegPathSet = true
          }
        }
      } catch (installerError: any) {
        console.log(`⚠️  @ffmpeg-installer not available: ${installerError.message}`)
      }
    }
    
    // If both packages failed, try system ffmpeg
    if (!ffmpegPathSet) {
      console.log("⚠️  FFmpeg packages not available, trying system ffmpeg")
      // System ffmpeg should be in PATH, fluent-ffmpeg will find it automatically
      // If system ffmpeg is not available, the error will be caught below
    }
    
    // Try to verify FFmpeg is available by checking if we can get version
    // This is a basic check to ensure FFmpeg is accessible
    try {
      const { execSync } = require("child_process")
      let ffmpegPath = null
      
      // Try to find ffmpeg path from fluent-ffmpeg
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ffmpegStatic = require("ffmpeg-static")
        if (ffmpegStatic) {
          ffmpegPath = ffmpegStatic
        }
      } catch {
        // Try @ffmpeg-installer
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
          if (ffmpegInstaller?.path) {
            ffmpegPath = ffmpegInstaller.path
          }
        } catch {
          // Use system ffmpeg
          ffmpegPath = "ffmpeg"
        }
      }
      
      if (ffmpegPath && existsSync(ffmpegPath)) {
        console.log(`✅ FFmpeg verified at: ${ffmpegPath}`)
      } else {
        console.log(`⚠️  FFmpeg path not verified, will attempt to use anyway: ${ffmpegPath || "system ffmpeg"}`)
      }
    } catch (verifyError: any) {
      console.log(`⚠️  Could not verify FFmpeg, will attempt mixing anyway: ${verifyError.message}`)
    }
    
    console.log("✅ FFmpeg setup complete, will attempt mixing")

    // Map music type to file path
    // On Netlify, try multiple possible paths for the public folder
    const getMusicPath = (musicFileName: string): string | null => {
      const possiblePaths = [
        // Standard Next.js path
        join(process.cwd(), "public", "background-music", musicFileName),
        // Netlify build path (sometimes different)
        join(process.cwd(), ".next", "server", "app", "public", "background-music", musicFileName),
        // Alternative Netlify path
        join("/var/task", "public", "background-music", musicFileName),
        // Fallback: try without process.cwd()
        join("public", "background-music", musicFileName),
      ]

      for (const path of possiblePaths) {
        if (existsSync(path)) {
          console.log(`✅ Found music file at: ${path}`)
          return path
        }
      }

      // Log all attempted paths for debugging
      console.warn(`❌ Music file not found: ${musicFileName}`)
      console.log("Attempted paths:")
      possiblePaths.forEach((p) => console.log(`  - ${p}`))
      console.log(`Current working directory: ${process.cwd()}`)
      return null
    }

    let musicPath = getMusicPath(`${musicType}.mp3`)
    let musicNeedsDownload = false
    
    // If file not found on filesystem, try to download from public URL (Netlify CDN)
    if (!musicPath) {
      console.log(`⚠️  Music file not found on filesystem, trying to download from public URL...`)
      // Get base URL - prefer NEXTAUTH_URL, fallback to site URL
      let baseUrl = "http://localhost:3000"
      if (process.env.NEXTAUTH_URL) {
        baseUrl = process.env.NEXTAUTH_URL
      } else if (process.env.NETLIFY) {
        // On Netlify, use the site URL from environment
        baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://capsoai.com"
      }
      const musicUrl = `${baseUrl}/background-music/${musicType}.mp3`
      console.log(`🌐 Attempting to download music from: ${musicUrl}`)
      
      try {
        const response = await fetch(musicUrl)
        if (response.ok) {
          // Download to temp file
          const tempDir = process.env.NETLIFY ? "/tmp" : join(process.cwd(), "tmp")
          await mkdir(tempDir, { recursive: true }).catch(() => {})
          musicPath = join(tempDir, `music-${musicType}-${randomUUID()}.mp3`)
          const musicBuffer = Buffer.from(await response.arrayBuffer())
          await writeFile(musicPath, musicBuffer)
          console.log(`✅ Downloaded music file to: ${musicPath} (${musicBuffer.length} bytes)`)
          musicNeedsDownload = true
        } else {
          console.error(`❌ Failed to download music file: HTTP ${response.status}`)
          return speechAudio
        }
      } catch (downloadError: any) {
        console.error(`❌ Error downloading music file:`, downloadError.message)
        console.warn(`Background music file not found for: ${musicType}`)
        console.log("💡 Add background music files to public/background-music/")
        console.log("   See BACKGROUND_MUSIC_LANGUAGE_SETUP.md for free music sources")
        return speechAudio
      }
    }

    // Create temp directory if it doesn't exist
    // On Netlify Functions, we MUST use /tmp (only writable directory)
    // Detect Netlify by checking multiple environment variables or path
    const isNetlify = !!(
      process.env.NETLIFY || 
      process.env.NETLIFY_DEV || 
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      process.cwd().includes("/var/task") ||
      process.cwd().includes("/opt/build")
    )
    
    // Always use /tmp on Netlify, fallback to process.cwd()/tmp for local dev
    const tempDir = isNetlify ? "/tmp" : join(process.cwd(), "tmp")
    
    console.log(`📁 Environment detection:`)
    console.log(`   - process.cwd(): ${process.cwd()}`)
    console.log(`   - NETLIFY: ${process.env.NETLIFY}`)
    console.log(`   - AWS_LAMBDA_FUNCTION_NAME: ${process.env.AWS_LAMBDA_FUNCTION_NAME}`)
    console.log(`   - isNetlify: ${isNetlify}`)
    console.log(`   - Using temp directory: ${tempDir}`)
    
    // Ensure temp directory exists
    try {
      await mkdir(tempDir, { recursive: true })
      console.log(`✅ Temp directory created/verified: ${tempDir}`)
      
      // Verify we can write to it by checking if it exists
      if (!existsSync(tempDir)) {
        throw new Error(`Temp directory does not exist after creation: ${tempDir}`)
      }
    } catch (mkdirError: any) {
      console.error(`❌ Failed to create temp directory: ${tempDir}`, mkdirError.message)
      console.error(`   Error code: ${mkdirError.code}, errno: ${mkdirError.errno}`)
      throw new Error(`Cannot create temp directory: ${tempDir}. Error: ${mkdirError.message}`)
    }

    // Create temp file paths
    const speechPath = join(tempDir, `speech-${randomUUID()}.mp3`)
    const outputPath = join(tempDir, `mixed-${randomUUID()}.mp3`)
    
    console.log(`📝 Temp file paths:`)
    console.log(`   - Speech: ${speechPath}`)
    console.log(`   - Output: ${outputPath}`)

    try {
      // Note: fluent-ffmpeg will use the path we set earlier or system ffmpeg
      console.log(`✅ Music file exists and is accessible: ${musicPath}`)

      // Write speech audio to temp file
      console.log(`📝 Writing speech audio to temp file: ${speechPath} (${speechAudio.length} bytes)`)
      await writeFile(speechPath, speechAudio)
      
      // Verify file was written
      if (!existsSync(speechPath)) {
        throw new Error(`Failed to write speech audio file: ${speechPath}`)
      }
      const speechFileStats = await import("fs/promises").then(m => m.stat(speechPath))
      console.log(`✅ Speech audio written successfully: ${speechFileStats.size} bytes at ${speechPath}`)
      
      // Verify music file exists
      if (!existsSync(musicPath)) {
        throw new Error(`Music file does not exist: ${musicPath}`)
      }
      const musicFileStats = await import("fs/promises").then(m => m.stat(musicPath))
      console.log(`✅ Music file verified: ${musicFileStats.size} bytes at ${musicPath}`)

      // Mix audio using ffmpeg
      // Speech volume: 0.7 (70%), Music volume: 0.15 (15%) - Subtle background music
      console.log(`🎬 Starting FFmpeg mixing process...`)
      console.log(`   Input 1 (speech): ${speechPath}`)
      console.log(`   Input 2 (music): ${musicPath}`)
      console.log(`   Output: ${outputPath}`)
      
      await new Promise<void>((resolve, reject) => {
        let ffmpegStarted = false
        let ffmpegEnded = false
        
        const ffmpegProcess = ffmpeg()
          .input(speechPath)
          .input(musicPath)
          .complexFilter([
            "[0:a]volume=0.7[speech]",
            "[1:a]volume=0.15,aloop=loop=-1:size=2e+09[music]",
            "[speech][music]amix=inputs=2:duration=first:dropout_transition=2[mixed]"
          ])
          .outputOptions(["-map", "[mixed]"])
          .output(outputPath)
          .on("start", (commandLine: string) => {
            ffmpegStarted = true
            console.log(`🎬 FFmpeg started successfully`)
            console.log(`🎬 FFmpeg command: ${commandLine.substring(0, 200)}...`)
          })
          .on("end", () => {
            ffmpegEnded = true
            console.log("✅ Audio mixing completed successfully")
            resolve()
          })
          .on("error", (err: Error) => {
            console.error("❌ FFmpeg error occurred:", err)
            console.error("Error details:", {
              message: err.message,
              code: (err as any).code,
              errno: (err as any).errno,
              syscall: (err as any).syscall,
              path: (err as any).path,
              stack: err.stack,
              ffmpegStarted: ffmpegStarted,
              ffmpegEnded: ffmpegEnded,
              speechPath: speechPath,
              musicPath: musicPath,
              outputPath: outputPath,
            })
            
            // Check if files still exist
            console.log(`File existence check:`)
            console.log(`   Speech file exists: ${existsSync(speechPath)}`)
            console.log(`   Music file exists: ${existsSync(musicPath)}`)
            console.log(`   Output file exists: ${existsSync(outputPath)}`)
            
            reject(err)
          })
          .on("stderr", (stderrLine: string) => {
            // FFmpeg outputs progress to stderr, we can ignore most of it
            if (stderrLine.includes("error") || stderrLine.includes("Error") || stderrLine.includes("failed")) {
              console.error("FFmpeg stderr error:", stderrLine)
            } else if (stderrLine.includes("Duration") || stderrLine.includes("time=")) {
              // Log progress for debugging
              console.log("FFmpeg progress:", stderrLine.trim())
            }
          })
          .run()
          
        // Add timeout to prevent hanging
        setTimeout(() => {
          if (!ffmpegEnded && !ffmpegStarted) {
            console.error("❌ FFmpeg process timeout - process did not start")
            reject(new Error("FFmpeg process timeout: process did not start within 5 seconds"))
          } else if (!ffmpegEnded && ffmpegStarted) {
            console.error("❌ FFmpeg process timeout - process started but did not complete")
            reject(new Error("FFmpeg process timeout: process started but did not complete within 30 seconds"))
          }
        }, 30000) // 30 second timeout
      })

      // Verify output file exists before reading
      if (!existsSync(outputPath)) {
        throw new Error(`Output file was not created: ${outputPath}`)
      }
      const outputFileStats = await import("fs/promises").then(m => m.stat(outputPath))
      console.log(`✅ Output file created: ${outputFileStats.size} bytes at ${outputPath}`)
      
      // Read mixed audio
      const mixedAudio = await readFile(outputPath)
      console.log(`✅ Mixed audio read successfully: ${mixedAudio.length} bytes`)
      
      // Verify mixed audio is different from original (should be larger)
      if (mixedAudio.length <= speechAudio.length) {
        console.warn(`⚠️  Mixed audio size (${mixedAudio.length}) is not larger than original (${speechAudio.length}). Mixing may have failed.`)
      } else {
        console.log(`✅ Mixed audio is larger than original (${mixedAudio.length} vs ${speechAudio.length}), mixing successful!`)
      }

      // Cleanup temp files
      await unlink(speechPath).catch(() => {})
      await unlink(outputPath).catch(() => {})
      // Cleanup downloaded music file if it was downloaded
      if (musicNeedsDownload && musicPath) {
        await unlink(musicPath).catch(() => {})
      }

      return mixedAudio
    } catch (mixingError: any) {
      console.error("Error during audio mixing:", mixingError)
      // Cleanup temp files on error
      await unlink(speechPath).catch(() => {})
      await unlink(outputPath).catch(() => {})
      // Cleanup downloaded music file if it was downloaded
      if (musicNeedsDownload && musicPath) {
        await unlink(musicPath).catch(() => {})
      }
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
    
    const openai = getOpenAIClient()
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
      max_tokens: summaryLength === "full" ? 800 : summaryLength === "medium" ? 400 : 150, // Reduced for faster generation
      stream: false, // Ensure no streaming for faster response
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
 * Clean markdown formatting from text for TTS
 * Removes markdown syntax so TTS doesn't read formatting characters
 */
function cleanMarkdownForTTS(text: string): string {
  let cleaned = text

  // Remove markdown bold: **text** or __text__
  // Must do this first before handling italic
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1")
  cleaned = cleaned.replace(/__(.*?)__/g, "$1")

  // Remove markdown italic: *text* or _text_
  // Match single asterisks/underscores that are not part of bold (already removed)
  // Pattern: whitespace or start, then * or _, then text, then * or _, then whitespace or end
  cleaned = cleaned.replace(/(^|\s)\*([^*\n]+?)\*(\s|$)/g, "$1$2$3")
  cleaned = cleaned.replace(/(^|\s)_([^_\n]+?)_(\s|$)/g, "$1$2$3")
  
  // Also handle italic at start/end of line
  cleaned = cleaned.replace(/^\*([^*\n]+?)\*(\s|$)/gm, "$1$2")
  cleaned = cleaned.replace(/^_([^_\n]+?)_(\s|$)/gm, "$1$2")

  // Remove markdown headers: # Header, ## Header, etc.
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "")

  // Remove markdown links: [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")

  // Remove markdown images: ![alt](url) -> alt
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")

  // Remove markdown code blocks: `code` -> code
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1")

  // Remove markdown code blocks with triple backticks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "")

  // Remove markdown lists: - item, * item, 1. item
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, "")
  cleaned = cleaned.replace(/^\d+\.\s+/gm, "")

  // Remove markdown blockquotes: > text
  cleaned = cleaned.replace(/^>\s+/gm, "")

  // Remove markdown horizontal rules: ---, ***, ___
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, "")

  // Remove markdown strikethrough: ~~text~~
  cleaned = cleaned.replace(/~~(.*?)~~/g, "$1")

  // Clean up extra whitespace
  // Replace multiple spaces with single space (but preserve newlines)
  cleaned = cleaned.replace(/[ \t]+/g, " ")
  // Replace multiple newlines with double newline (paragraph break)
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, "\n\n")
  // Remove trailing spaces from lines
  cleaned = cleaned.replace(/[ \t]+$/gm, "")

  // Trim the result
  cleaned = cleaned.trim()

  return cleaned
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

    // Clean markdown formatting from text before sending to TTS
    const cleanedText = cleanMarkdownForTTS(text)
    if (cleanedText !== text) {
      console.log("🧹 Cleaned markdown formatting from text for TTS")
      console.log("  - Original length:", text.length)
      console.log("  - Cleaned length:", cleanedText.length)
    }

    console.log("Calling LemonFox TTS API with:")
    console.log("  - Voice ID:", voiceId)
    console.log("  - Text length:", cleanedText.length, "characters")
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
        input: cleanedText,
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
 * LemonFox uses OpenAI-compatible voice IDs with proper gender mapping
 */
function getVoiceIdFromTone(voiceName: string): string {
  const voiceMap: Record<string, string> = {
    // Female voices (LemonFox/OpenAI compatible)
    sarah: "alloy", // Clear & Professional (female)
    emma: "echo", // Warm & Friendly (female)
    olivia: "nova", // Energetic & Young (female)
    
    // Male voices (LemonFox/OpenAI compatible)
    james: "onyx", // Deep & Authoritative (male)
    liam: "onyx", // Calm & Soothing (male) - using onyx as it's the main male voice
    noah: "onyx", // Confident & Clear (male) - using onyx as it's the main male voice
    
    // Alternative female voices if available
    // You can also try: "fable", "shimmer" for more variety
    
    // Legacy tone names (for backwards compatibility)
    professional: "alloy", // sarah
    warm: "echo", // emma
    energetic: "nova", // olivia
    calm: "onyx", // liam
    authoritative: "onyx", // james
    clear: "onyx", // noah
  }

  // Default to "alloy" (female, professional voice)
  return voiceMap[voiceName.toLowerCase()] || "alloy"
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
    console.log("🔍 User subscription tier:", subscriptionTier, "for user ID:", userId)

    // 3. Check Usage Limits
    const monthlyUploads = await getUserMonthlyUploads(userId)
    const uploadLimit = USAGE_LIMITS[subscriptionTier]
    console.log("📊 Usage check - Monthly uploads:", monthlyUploads, "Limit:", uploadLimit, "Tier:", subscriptionTier)

    // Only check limit if it's not Infinity (Pro users have unlimited)
    if (subscriptionTier !== "pro" && uploadLimit !== Infinity && monthlyUploads >= uploadLimit) {
      console.log("❌ Limit reached for Starter user")
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
    
    if (subscriptionTier === "pro") {
      console.log("✅ Pro user - unlimited access granted")
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
    console.log("Background Music:", backgroundMusic, "(type:", typeof backgroundMusic, ")")
    console.log("Language:", language)

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
      console.log(`🎵 Step 3.5: Mixing background music: ${backgroundMusic}...`)
      try {
        audioBuffer = await mixBackgroundMusic(audioBuffer, backgroundMusic)
        console.log("✅ Audio with background music:", audioBuffer.length, "bytes")
      } catch (mixingError: any) {
        console.error("❌ Failed to mix background music:", mixingError)
        console.error("Error details:", mixingError.message, mixingError.stack)
        // Continue with original audio if mixing fails
        console.log("⚠️  Continuing with original audio (no background music)")
      }
    } else {
      console.log("ℹ️  No background music selected (backgroundMusic:", backgroundMusic, ")")
    }

    // Step 4: Prepare audio for response
    // On Netlify, we can't save to public/audio (read-only filesystem)
    // Instead, we'll return the audio directly or store in database
    console.log("Step 4: Preparing audio response...")
    const audioId = randomUUID()
    const audioFileName = `${audioId}.mp3`
    
    // For Netlify compatibility: return audio as base64 in response
    // The audio will be available immediately, no file storage needed
    console.log("Converting audio buffer to base64...")
    const audioBase64 = audioBuffer.toString('base64')
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`
    
    // Generate download URL (will return audio directly)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const downloadUrl = `${baseUrl}/api/audio/download/${audioId}`
    
    console.log("Audio size:", audioBuffer.length, "bytes")
    console.log("Base64 size:", audioBase64.length, "chars")
    console.log("Audio data URL created, length:", audioDataUrl.length)

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
    console.log("Preparing response JSON...")
    const responseData = {
      success: true,
      audioData: audioDataUrl, // Base64 audio data for immediate use
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
    }
    
    console.log("Response data prepared, returning JSON...")
    console.log("Response size estimate:", JSON.stringify(responseData).length, "chars")
    
    return NextResponse.json(responseData)
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

