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
    console.log("🔍 DATABASE_URL check:", {
      exists: !!databaseUrl,
      length: databaseUrl?.length || 0,
      startsWith: databaseUrl?.substring(0, 20) || "N/A",
      isPlaceholder: databaseUrl?.includes("build:build@build:5432") || databaseUrl?.includes("placeholder:placeholder@localhost")
    })
    
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not configured")
      return NextResponse.json({ 
        error: "Database not configured. Please add DATABASE_URL in Netlify dashboard.",
        details: "Go to: Netlify Dashboard → Site settings → Build & deploy → Environment → Add variable: DATABASE_URL",
        help: "See FIX_DATABASE_CONNECTION.md for detailed instructions"
      }, { status: 500 })
    }

    // Check if using build-time placeholder
    if (databaseUrl.includes("build:build@build:5432") || databaseUrl.includes("placeholder:placeholder@localhost")) {
      console.error("❌ Using build-time placeholder DATABASE_URL:", databaseUrl.substring(0, 50) + "...")
      return NextResponse.json({ 
        error: "Database not configured. Please add REAL DATABASE_URL in Netlify dashboard.",
        details: "The placeholder DATABASE_URL is being used. You MUST add your real PostgreSQL connection string in Netlify dashboard.",
        instructions: [
          "1. Go to app.netlify.com",
          "2. Select your site → Site settings → Build & deploy → Environment",
          "3. Click 'Add variable'",
          "4. Key: DATABASE_URL",
          "5. Value: postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres",
          "6. Click Save, then redeploy"
        ]
      }, { status: 500 })
    }

    // Test database connection before proceeding
    try {
      console.log("🔌 Attempting to connect to database...")
      await prisma.$connect()
      console.log("✅ Database connection successful")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      const errorCode = (dbError as any)?.code
      
      console.error("Error details:", {
        code: errorCode,
        message: errorMessage,
        databaseUrl: databaseUrl ? `${databaseUrl.substring(0, 30)}...` : "N/A"
      })
      
      // Check for specific connection errors
      if (errorCode === "P1001" || 
          errorMessage.includes("Can't reach database server") || 
          errorMessage.includes("connect ECONNREFUSED") ||
          errorMessage.includes("ENOTFOUND") ||
          errorMessage.includes("getaddrinfo")) {
        return NextResponse.json({ 
          error: "Cannot connect to database server.",
          details: "The database server is not reachable. Please verify:",
          checklist: [
            "✓ DATABASE_URL is set in Netlify dashboard (not netlify.toml)",
            "✓ DATABASE_URL format is correct: postgresql://user:password@host:5432/dbname",
            "✓ Database password is correct (no special characters need URL encoding)",
            "✓ Database server is accessible from internet (Supabase/Neon should be accessible)",
            "✓ You redeployed after adding DATABASE_URL"
          ],
          help: "See FIX_DATABASE_CONNECTION.md for step-by-step instructions"
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: "Cannot connect to database. Please check your DATABASE_URL configuration.",
        details: process.env.NODE_ENV === "development" ? errorMessage : "Database connection failed. Check Netlify function logs for details.",
        errorCode: errorCode || "UNKNOWN"
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


