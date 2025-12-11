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
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not configured")
      return NextResponse.json({ 
        error: "Database not configured. Please configure DATABASE_URL in your environment variables.",
        details: "DATABASE_URL environment variable is missing. This is required for the application to work."
      }, { status: 500 })
    }

    // Check if using build-time placeholder
    if (databaseUrl.includes("build:build@build:5432") || databaseUrl.includes("placeholder:placeholder@localhost")) {
      console.error("❌ Using build-time placeholder DATABASE_URL. Real DATABASE_URL must be set in Netlify dashboard.")
      return NextResponse.json({ 
        error: "Database not configured. Please set DATABASE_URL in Netlify dashboard (Site settings → Environment variables).",
        details: "The build-time placeholder DATABASE_URL is being used. You must add the real PostgreSQL connection string in Netlify dashboard for the app to work."
      }, { status: 500 })
    }

    // Test database connection before proceeding
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      
      // Check for specific connection errors
      if (errorMessage.includes("Can't reach database server") || 
          errorMessage.includes("connect ECONNREFUSED") ||
          errorMessage.includes("ENOTFOUND")) {
        return NextResponse.json({ 
          error: "Cannot connect to database. Please check your DATABASE_URL configuration.",
          details: "The database server is not reachable. Verify that your DATABASE_URL is correct and the database is accessible."
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: "Cannot connect to database. Please check your DATABASE_URL configuration.",
        details: process.env.NODE_ENV === "development" ? errorMessage : "Database connection failed"
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


