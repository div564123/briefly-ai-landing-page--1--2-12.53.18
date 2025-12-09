"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to sign up")
        setLoading(false)
        return
      }

      // Auto-login after successful signup
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/dashboard",
        email,
        password,
      })
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

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
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-base">Sign up to start transforming your courses into audio</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Email & Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11 border-2 focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 border-2 focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 border-2 focus:border-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-purple text-white font-semibold hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
