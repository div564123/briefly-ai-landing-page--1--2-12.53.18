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

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not configured")
      return NextResponse.json({ 
        error: "Database configuration error. Please contact support.",
        details: "DATABASE_URL environment variable is missing"
      }, { status: 500 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        subscriptionTier: "starter", // All new users start with free plan
      },
    })

    console.log("✅ User created successfully:", newUser.email)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Signup error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      code: (error as any)?.code,
    })
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Something went wrong"
    const errorCode = (error as any)?.code
    
    // Check for common database errors
    if (errorCode === "P1001" || 
        errorMessage.includes("Can't reach database server") || 
        errorMessage.includes("Connection") ||
        errorMessage.includes("connect ECONNREFUSED")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please check your DATABASE_URL environment variable.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      }, { status: 500 })
    }
    
    if (errorCode === "P2002" || errorMessage.includes("Unique constraint")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Check for Prisma schema errors
    if (errorCode === "P1003" || errorMessage.includes("does not exist")) {
      return NextResponse.json({ 
        error: "Database schema error. Please run migrations.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: "Something went wrong during signup",
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 })
  }
}


