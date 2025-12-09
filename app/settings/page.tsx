"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Shield, ArrowLeft, Save, Lock, Trash2, BarChart3, Mail, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  // Profile state
  const [profile, setProfile] = useState<{ name: string; email: string }>({ name: "", email: "" })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  // Usage statistics
  const [usage, setUsage] = useState<{ current: number; limit: number; tier: string; remaining: number } | null>(null)

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    generationAlerts: true,
  })
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState<string | null>(null)
  const [notificationsSuccess, setNotificationsSuccess] = useState<string | null>(null)

  // Account deletion state
  const [deleteAccountData, setDeleteAccountData] = useState({
    password: "",
    confirmEmail: "",
  })
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Data export state
  const [exportLoading, setExportLoading] = useState(false)

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile({ name: data.name || "", email: data.email || "" })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/audio/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error)
      }
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/user/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications({
            emailNotifications: data.emailNotifications ?? true,
            generationAlerts: data.generationAlerts ?? true,
          })
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    if (session) {
      fetchProfile()
      fetchUsage()
      fetchNotifications()
    }
  }, [session])

  // Auto-dismiss success messages
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [profileSuccess])

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [passwordSuccess])

  useEffect(() => {
    if (notificationsSuccess) {
      const timer = setTimeout(() => setNotificationsSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notificationsSuccess])

  const handleManageBilling = async () => {
    setLoading(true)
    setError(null)

    try {
      // API will automatically get customer ID from database based on authenticated user
      const response = await fetch("/api/billing/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create billing session")
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setProfileSuccess("Profile updated successfully!")
      // Update session if email changed
      if (data.user.email !== session?.user?.email) {
        // Sign out and redirect to login to refresh session
        await signOut({ callbackUrl: "/login" })
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      setPasswordSuccess("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUpdateNotifications = async () => {
    setNotificationsLoading(true)
    setNotificationsError(null)
    setNotificationsSuccess(null)

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update notification preferences")
      }

      setNotificationsSuccess("Notification preferences updated successfully!")
    } catch (err) {
      setNotificationsError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setNotificationsLoading(false)
    }
  }

  const handleExportData = async () => {
    setExportLoading(true)
    try {
      const response = await fetch("/api/user/export-data")
      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `capso-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to export data")
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteAccountLoading(true)
    setDeleteAccountError(null)

    if (deleteAccountData.confirmEmail !== session?.user?.email) {
      setDeleteAccountError("Email confirmation does not match")
      setDeleteAccountLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deleteAccountData.password,
          confirmEmail: deleteAccountData.confirmEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      // Sign out and redirect
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      setDeleteAccountError(err instanceof Error ? err.message : "Something went wrong")
      setDeleteAccountLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Subscription & Billing */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <CardTitle>Subscription & Billing</CardTitle>
            </div>
            <CardDescription>Manage your subscription, payment methods, and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleManageBilling}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {loading ? "Loading..." : "Manage Subscription & Billing"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            {passwordError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {passwordSuccess && (
              <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                <AlertDescription className="text-green-800 dark:text-green-200">{passwordSuccess}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min. 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button type="submit" disabled={passwordLoading} className="w-full sm:w-auto">
                {passwordLoading ? (
                  "Changing Password..."
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        {usage && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Usage Statistics</CardTitle>
              </div>
              <CardDescription>Your current plan usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className="text-sm font-semibold capitalize">{usage.tier}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Uploads</span>
                  <span className="text-sm font-semibold">
                    {usage.current} / {usage.limit === Infinity ? "∞" : usage.limit}
                  </span>
                </div>
                {usage.limit !== Infinity && (
                  <>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((usage.current / usage.limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="text-sm font-semibold">{usage.remaining} generations</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Export</Label>
                  <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData} disabled={exportLoading}>
                  {exportLoading ? (
                    "Exporting..."
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Enable 2FA
                </Button>
              </div>
              <Separator />
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-destructive" />
                        <Label className="text-destructive">Danger Zone</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteAccountError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteAccountError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deletePassword">Enter your password</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deleteAccountData.password}
                  onChange={(e) => setDeleteAccountData({ ...deleteAccountData, password: e.target.value })}
                  placeholder="Your password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deleteEmail">Type your email to confirm</Label>
                <Input
                  id="deleteEmail"
                  type="email"
                  value={deleteAccountData.confirmEmail}
                  onChange={(e) => setDeleteAccountData({ ...deleteAccountData, confirmEmail: e.target.value })}
                  placeholder={session?.user?.email || "your@email.com"}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={deleteAccountLoading}>
                  {deleteAccountLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

