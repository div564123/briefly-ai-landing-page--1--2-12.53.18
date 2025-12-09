export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Lazy load CommonJS modules
let mammoth: any = null

function loadMammoth() {
  if (!mammoth) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mammoth = require("mammoth")
  }
  return mammoth
}

/**
 * Extract text from uploaded file (PDF, DOCX, or DOC)
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
                          fullText += decodeURIComponent(run.T) + " "
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
      const mammoth = loadMammoth()
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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate API keys
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json({ 
        error: "OPENAI_API_KEY is not configured. Please add your OpenAI API key to .env.local" 
      }, { status: 500 })
    }

    console.log("=== Extracting Text from File ===")
    console.log("File:", file.name)

    // Extract text from file
    const extractedText = await extractTextFromFile(file)
    console.log("Text extracted:", extractedText.length, "characters")

    return NextResponse.json({
      success: true,
      text: extractedText,
      length: extractedText.length,
    })
  } catch (error: any) {
    console.error("Error extracting text:", error)
    
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
      { error: error?.message || "Failed to extract text" },
      { status: 500 }
    )
  }
}

