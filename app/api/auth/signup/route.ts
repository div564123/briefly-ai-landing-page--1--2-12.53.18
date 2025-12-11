export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        subscriptionTier: "starter", // All new users start with free plan
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Signup error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Something went wrong"
    
    // Check for common database errors
    if (errorMessage.includes("Can't reach database server") || 
        errorMessage.includes("P1001") ||
        errorMessage.includes("Connection")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please check your DATABASE_URL environment variable.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      }, { status: 500 })
    }
    
    if (errorMessage.includes("P2002") || errorMessage.includes("Unique constraint")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: "Something went wrong during signup",
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 })
  }
}


