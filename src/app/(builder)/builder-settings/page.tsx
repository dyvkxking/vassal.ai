"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const mockApiKeys = [
  { id: "key-1", name: "Production API", createdAt: "2026-05-15", lastUsed: "2026-06-02" },
  { id: "key-2", name: "Development Key", createdAt: "2026-04-20", lastUsed: "2026-06-01" },
]

const mockSessions = [
  { device: "Chrome on MacOS", location: "San Francisco, CA", lastActive: "2026-06-02 14:32", current: true },
  { device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2026-06-01 09:15", current: false },
  { device: "Firefox on Monitor", location: "New York, NY", lastActive: "2026-05-28 18:45", current: false },
]

const mockLoginHistory = [
  { date: "2026-06-02 14:32", device: "Chrome on MacOS", location: "San Francisco, CA", status: "Success" },
  { date: "2026-06-01 09:15", device: "Safari on iPhone", location: "San Francisco, CA", status: "Success" },
  { date: "2026-05-30 22:18", device: "Chrome on Monitor", location: "New York, NY", status: "Success" },
  { date: "2026-05-28 18:45", device: "Firefox on Monitor", location: "New York, NY", status: "Success" },
]

const notificationPreferences = {
  learningApprovals: true,
  sessionAlerts: true,
  earnings: false,
  proposals: true,
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function BuilderSettingsPage() {
  const [profile, setProfile] = useState({
    displayName: "Alex Chen",
    bio: "AI agent builder specializing in customer support and sales automation.",
    avatarUrl: "",
  })

  const [notifications, setNotifications] = useState(notificationPreferences)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your builder account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="delegation">Delegation</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your public builder profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell others about yourself and your expertise..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your profile picture
                </p>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="learning-approvals">Learning Approvals</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your agents complete learning cycles
                  </p>
                </div>
                <Switch
                  id="learning-approvals"
                  checked={notifications.learningApprovals}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, learningApprovals: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-alerts">Session Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about agent session status and issues
                  </p>
                </div>
                <Switch
                  id="session-alerts"
                  checked={notifications.sessionAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sessionAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="earnings">Earnings Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about payment received and withdrawals
                  </p>
                </div>
                <Switch
                  id="earnings"
                  checked={notifications.earnings}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, earnings: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="proposals">New Proposals</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when clients submit agent proposals for your review
                  </p>
                </div>
                <Switch
                  id="proposals"
                  checked={notifications.proposals}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, proposals: checked })
                  }
                />
              </div>

              <Button className="mt-4">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage keys for programmatic agent management</CardDescription>
                </div>
                <Button onClick={() => console.log("Create new API key")}>
                  Create New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mockApiKeys.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>{formatDate(key.createdAt)}</TableCell>
                        <TableCell>{formatDate(key.lastUsed)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm">
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys created yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delegation */}
        <TabsContent value="delegation">
          <Card>
            <CardHeader>
              <CardTitle>Delegation Settings</CardTitle>
              <CardDescription>Manage your voting power delegations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Auto-Delegation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delegate voting power based on proposal categories
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Current Delegations</Label>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-mono text-sm">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</p>
                      <p className="text-xs text-muted-foreground">Protocol decisions</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                  </div>
                </div>
              </div>
              <Button variant="outline">Configure Delegation Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CI/CD */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>CI/CD Integration</CardTitle>
              <CardDescription>
                Configure a webhook URL for automated agent deployments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.example.com/webhooks/vassal"
                />
                <p className="text-xs text-muted-foreground">
                  We will send POST requests to this URL on agent events (build, deploy, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Webhook Events</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Switch id="event-build" defaultChecked />
                    <Label htmlFor="event-build" className="text-sm">
                      Agent build completed
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="event-deploy" defaultChecked />
                    <Label htmlFor="event-deploy" className="text-sm">
                      Agent deployed
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="event-learning" defaultChecked />
                    <Label htmlFor="event-learning" className="text-sm">
                      Learning cycle completed
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="event-alert" />
                    <Label htmlFor="event-alert" className="text-sm">
                      SLA breach alert
                    </Label>
                  </div>
                </div>
              </div>

              <Button onClick={() => console.log("Save webhook settings")}>
                Save Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* 2FA */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">2FA Status</div>
                    <div className="text-sm text-muted-foreground">
                      {is2FAEnabled ? "Enabled" : "Not enabled"}
                    </div>
                  </div>
                  <Button
                    variant={is2FAEnabled ? "outline" : "default"}
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  >
                    {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((session) => (
                      <TableRow key={session.device}>
                        <TableCell className="font-medium">{session.device}</TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                        <TableCell>
                          {session.current ? (
                            <Badge>Current</Badge>
                          ) : (
                            <Button variant="ghost" size="sm">
                              Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Login History */}
            <Card>
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent login activity on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLoginHistory.map((login, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{login.date}</TableCell>
                        <TableCell>{login.device}</TableCell>
                        <TableCell>{login.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={login.status === "Success" ? "default" : "destructive"}
                          >
                            {login.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}