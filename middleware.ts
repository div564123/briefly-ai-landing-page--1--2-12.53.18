import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For now, just pass through - authentication is handled by NextAuth
  // You can add additional middleware logic here if needed
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
