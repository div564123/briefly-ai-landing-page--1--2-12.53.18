export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { password, confirmEmail } = await req.json()

    if (!password || !confirmEmail) {
      return NextResponse.json(
        { error: "Password and email confirmation are required" },
        { status: 400 }
      )
    }

    // Verify email matches
    if (confirmEmail !== session.user.email) {
      return NextResponse.json({ error: "Email confirmation does not match" }, { status: 400 })
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    // Delete user (cascade will delete audioGenerations)
    await prisma.user.delete({
      where: { email: session.user.email },
    })

    return NextResponse.json({ success: true, message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}

