export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

/**
 * Generate summary from extracted text
 */
async function generateSummary(text: string, summaryLength: "short" | "medium" | "full"): Promise<string> {
  try {
    const lengthInstructions = {
      short: "Create a very brief summary focusing ONLY on the most important and key points (2-3 sentences, ~100 words). Extract and highlight only the essential information, main concepts, and critical takeaways. Do not include everything - be selective and focus on what matters most.",
      medium: "Create a concise summary (1-2 paragraphs, ~200-300 words). Include key points and important details, prioritizing the most significant information.",
      full: "Create a comprehensive summary (3-5 paragraphs, ~500-800 words). Include all important information and context, organizing it clearly.",
    }

    const prompt = `You are an expert at creating clear, concise summaries of educational content. ${lengthInstructions[summaryLength]}

IMPORTANT FORMATTING RULES:
- Use **bold markdown** to highlight important sections, titles, key concepts, and main points
- Format section headings as **Section Title**
- Bold important terms, definitions, or critical information
- Make the summary easy to scan and understand at a glance

Text to summarize:
${text}

Summary (with bold formatting for important parts):`

    const model = "gpt-4o-mini"
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates clear, concise summaries of educational content. Your summaries are well-structured and easy to understand. Always use **bold markdown** to highlight important sections, titles, key concepts, and main points to make the text easy to scan.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: summaryLength === "short" ? 150 : summaryLength === "medium" ? 400 : 1000,
    })

    const summary = completion.choices[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error("Failed to generate summary: Empty response from OpenAI")
    }

    return summary
  } catch (error: any) {
    console.error("Error generating summary:", error)
    throw new Error(`Failed to generate summary: ${error?.message || "Unknown error"}`)
  }
}

/**
 * Translate text to target language
 */
async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      en: "English",
      fr: "French",
      es: "Spanish",
    }

    const targetLanguageName = languageNames[targetLanguage] || "English"

    const prompt = `Translate the following text to ${targetLanguageName}. Maintain the same tone and style. Only return the translated text, nothing else.

Text to translate:
${text}

Translation:`

    const model = "gpt-4o-mini"
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate text accurately while maintaining the original meaning and tone.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const translated = completion.choices[0]?.message?.content?.trim()

    if (!translated) {
      throw new Error("Failed to translate: Empty response from OpenAI")
    }

    return translated
  } catch (error: any) {
    console.error("Error translating text:", error)
    throw new Error(`Failed to translate: ${error?.message || "Unknown error"}`)
  }
}

/**
 * Extract text from uploaded file
 */
async function extractTextFromFile(file: File): Promise<string> {
  try {
    console.log("Extracting text from file:", file.name, "Type:", file.type)
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (file.type === "application/pdf") {
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
            let fullText = ""
            if (pdfData.Pages && pdfData.Pages.length > 0) {
              for (const page of pdfData.Pages) {
                if (page.Texts && page.Texts.length > 0) {
                  for (const textItem of page.Texts) {
                    if (textItem.R && textItem.R.length > 0) {
                      for (const run of textItem.R) {
                        if (run.T) {
                          try {
                            // Try to decode URI-encoded text
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
            if (text.length === 0) {
              reject(new Error("PDF appears to be empty or contains only images without selectable text. Please use a PDF with actual text content or convert scanned images using OCR."))
            } else {
              resolve(text)
            }
          } catch (error) {
            reject(error)
          }
        })
        
        pdfParser.parseBuffer(buffer)
      })
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
      const mammoth = require("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      const text = result.value.trim()
      
      if (text.length === 0) {
        throw new Error("Document appears to be empty or contains only images. Please use a document with actual text content.")
      }
      
      return text
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, or DOC file.`)
    }
  } catch (error: any) {
    console.error("Error extracting text:", error)
    if (error.message.includes("empty") || error.message.includes("image")) {
      throw error
    }
    
    // Handle malformed PDF errors
    if (error?.message?.includes("malformed") || 
        error?.message?.includes("URI") || 
        error?.message?.includes("decodeURIComponent") ||
        error?.message?.includes("Invalid URI")) {
      throw new Error("This PDF file appears to be corrupted or in an unsupported format. Please try converting it to a different PDF format or use a DOCX file instead.")
    }
    
    throw new Error(`Failed to extract text from file: ${error?.message || "Unknown error"}`)
  }
}

export async function POST(req: Request) {
  try {
    // 1. Check Authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    // 2. Get form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const summaryLength = formData.get("summaryLength") as string
    const language = formData.get("language") as string || "en"
    const customText = formData.get("customText") as string | null // Optional: if user wants to summarize existing text

    if (!file && !customText) {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 })
    }

    // Validate API keys
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json({ 
        error: "OPENAI_API_KEY is not configured. Please add your OpenAI API key to .env.local" 
      }, { status: 500 })
    }

    // Map summary length
    const summaryLengthMap: Record<string, "short" | "medium" | "full"> = {
      summary: "short",
      median: "medium",
      full: "full",
    }
    const summaryLengthValue = summaryLengthMap[summaryLength] || "medium"

    console.log("=== Generating Summary Only ===")
    if (file) {
      console.log("File:", file.name)
    }
    console.log("Summary Length:", summaryLengthValue)
    console.log("Language:", language)

    let extractedText: string

    // Use custom text if provided, otherwise extract from file
    if (customText && customText.trim()) {
      console.log("Using custom text provided by user")
      extractedText = customText.trim()
    } else if (file) {
      // Step 1: Extract text from file
      console.log("Step 1: Extracting text from file...")
      extractedText = await extractTextFromFile(file)
      console.log("Text extracted:", extractedText.substring(0, 100) + "...")
    } else {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 })
    }

    // Step 2: Generate summary
    console.log("Step 2: Generating summary...")
    let summary = await generateSummary(extractedText, summaryLengthValue)
    console.log("Summary generated:", summary.substring(0, 100) + "...")

    // Step 3: Translate if needed
    if (language !== "en") {
      console.log(`Step 3: Translating to ${language}...`)
      summary = await translateText(summary, language)
      console.log("Summary translated:", summary.substring(0, 100) + "...")
    }

    return NextResponse.json({
      success: true,
      summary: summary,
      originalTextLength: extractedText.length,
      summaryLength: summary.length,
    })
  } catch (error: any) {
    console.error("Error generating summary:", error)
    
    // Handle specific error types
    if (error?.message?.includes("empty") || error?.message?.includes("image")) {
      return NextResponse.json(
        { 
          error: error.message,
          errorType: "file_error"
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "Failed to generate summary" },
      { status: 500 }
    )
  }
}

