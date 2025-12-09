import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 hover:bg-muted/50 transition-colors bg-transparent"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 hover:bg-muted/50 transition-colors bg-transparent"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign in with Apple
            </Button>
          </div>

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
