"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockSessions = [
  { id: "1", device: "Chrome on Mac OS", location: "San Francisco, CA", lastActive: "2 minutes ago", current: true },
  { id: "2", device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "1 hour ago", current: false },
  { id: "3", device: "Firefox on Monitor", location: "New York, NY", lastActive: "2 days ago", current: false },
]

const mockLoginHistory = [
  { id: "1", device: "Chrome on Mac OS", location: "San Francisco, CA", date: "2026-06-05 10:30 AM", success: true },
  { id: "2", device: "Safari on iPhone", location: "San Francisco, CA", date: "2026-06-04 3:45 PM", success: true },
  { id: "3", device: "Firefox on Monitor", location: "New York, NY", date: "2026-03-15 8:20 PM", success: false },
]

const mockRecoveryCodes = [
  "ABCD-EFGH-1234",
  "IJKL-MNOP-5678",
  "QRST-UVWX-9012",
  "YZA1-BCDE-3456",
  "FGHI-JKLM-7890",
  "NOPQ-RSTU-1234",
  "VWXY-ZABC-5678",
  "DEFG-HIJK-9012",
]

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sessions, setSessions] = useState(mockSessions)
  const [passwordError, setPasswordError] = useState("")

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleToggle2FA = async (enabled: boolean) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIs2FAEnabled(enabled)
    if (enabled) {
      setShowRecoveryCodes(true)
    }
    setIsSaving(false)
  }

  const handleRevokeSession = async (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId))
  }

  const handleRevokeAllOtherSessions = async () => {
    setSessions(sessions.filter((s) => s.current))
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Security</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your password, two-factor authentication, and session history
        </p>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="history">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={handleToggle2FA}
                  disabled={isSaving}
                />
              </div>

              {is2FAEnabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Recovery Codes</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Save these codes in a secure place. You can use them to access your account if you lose access to your authenticator.
                      </p>
                    </div>

                    {showRecoveryCodes ? (
                      <div className="grid grid-cols-2 gap-2">
                        {mockRecoveryCodes.map((code, i) => (
                          <Badge key={i} variant="outline" className="font-mono text-sm py-2">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowRecoveryCodes(true)}
                      >
                        Show Recovery Codes
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices that are currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={handleRevokeAllOtherSessions}
                disabled={sessions.filter((s) => !s.current).length === 0}
              >
                Revoke All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                View recent login attempts and activity on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLoginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{login.device}</p>
                        <Badge variant={login.success ? "default" : "destructive"}>
                          {login.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {login.location} · {login.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}