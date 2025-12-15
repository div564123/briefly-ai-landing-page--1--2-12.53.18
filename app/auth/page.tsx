"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12">
      {/* Logo/Brand */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            Capso <span className="text-primary">AI</span>
          </span>
        </Link>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md soft-shadow border-2">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">Sign in to continue your learning journey</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email & Password Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 border-2 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 border-2 focus:border-primary transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-purple text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
