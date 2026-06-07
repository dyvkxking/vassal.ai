"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SettingsSection =
  | "profile"
  | "notifications"
  | "payment"
  | "api-keys"
  | "security"
  | "connected-tools"
  | "cli-update"
  | "uninstall"

const NAV_ITEMS: { id: SettingsSection; label: string }[] = [
  { id: "profile", label: "Profile Settings" },
  { id: "notifications", label: "Notification Preferences" },
  { id: "payment", label: "Payment Details" },
  { id: "api-keys", label: "API Keys" },
  { id: "security", label: "Security" },
  { id: "connected-tools", label: "Connected Tools" },
  { id: "cli-update", label: "CLI Update" },
  { id: "uninstall", label: "Uninstall Node" },
]

// Mock data for API keys
const MOCK_API_KEYS = [
  {
    id: "key_1",
    name: "Production API Key",
    permissions: ["read", "write"],
    createdDate: "2024-03-15",
    lastUsed: "2024-06-02",
  },
  {
    id: "key_2",
    name: "Development Key",
    permissions: ["read"],
    createdDate: "2024-05-01",
    lastUsed: "2024-05-28",
  },
]

// Mock session data
const MOCK_SESSIONS = [
  {
    id: "sess_1",
    device: "Chrome on macOS",
    location: "San Francisco, CA",
    lastActive: "2024-06-03T10:30:00",
    current: true,
  },
  {
    id: "sess_2",
    device: "Safari on iPhone",
    location: "San Francisco, CA",
    lastActive: "2024-06-01T18:45:00",
    current: false,
  },
]

// Mock login history
const MOCK_LOGIN_HISTORY = [
  { id: "log_1", timestamp: "2024-06-03T10:30:00", device: "Chrome on macOS", ip: "192.168.1.1", success: true },
  { id: "log_2", timestamp: "2024-06-01T14:22:00", device: "Safari on iPhone", ip: "192.168.1.2", success: true },
  { id: "log_3", timestamp: "2024-05-28T09:15:00", device: "Firefox on Monitor", ip: "10.0.0.1", success: true },
  { id: "log_4", timestamp: "2024-05-20T23:45:00", device: "Unknown", ip: "185.220.101.34", success: false },
]

// Notification categories with their toggles
const NOTIFICATION_CATEGORIES = [
  {
    category: "Session alerts",
    channels: { email: true, inApp: true, push: false },
  },
  {
    category: "Slash alerts",
    channels: { email: true, inApp: true, push: true },
  },
  {
    category: "Proposals",
    channels: { email: false, inApp: true, push: false },
  },
  {
    category: "Earnings",
    channels: { email: true, inApp: false, push: true },
  },
  {
    category: "System",
    channels: { email: true, inApp: true, push: true },
  },
]

function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Display Name
          </label>
          <Input id="displayName" defaultValue="Provider Node Alpha" placeholder="Your display name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <Textarea
            id="bio"
            defaultValue="Compute provider running high-performance GPU nodes for the vassal.ai network."
            placeholder="Tell clients about yourself and your compute resources"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="avatarUrl" className="text-sm font-medium">
            Avatar URL
          </label>
          <Input
            id="avatarUrl"
            defaultValue="https://images.unsplash.com/photo-1535713875002-d1d0cf209f85"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState(NOTIFICATION_CATEGORIES)

  const toggleChannel = (categoryIndex: number, channel: "email" | "inApp" | "push") => {
    setNotifications((prev) =>
      prev.map((cat, idx) =>
        idx === categoryIndex
          ? {
              ...cat,
              channels: {
                ...cat.channels,
                [channel]: !cat.channels[channel],
              },
            }
          : cat
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Category</div>
            <div className="col-span-1 text-center">Email</div>
            <div className="col-span-1 text-center">In-App</div>
            <div className="col-span-1 text-center">Push</div>
          </div>
          <Separator />
          {notifications.map((item, categoryIndex) => (
            <div key={item.category} className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="col-span-1 text-sm font-medium">{item.category}</div>
              <div className="col-span-1 flex justify-center">
                <Switch
                  checked={item.channels.email}
                  onCheckedChange={() => toggleChannel(categoryIndex, "email")}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Switch
                  checked={item.channels.inApp}
                  onCheckedChange={() => toggleChannel(categoryIndex, "inApp")}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Switch
                  checked={item.channels.push}
                  onCheckedChange={() => toggleChannel(categoryIndex, "push")}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentSection() {
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
  const [isEditing, setIsEditing] = useState(false)
  const [tempAddress, setTempAddress] = useState(walletAddress)

  const handleUpdate = () => {
    setWalletAddress(tempAddress)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Wallet Payout Address</label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono text-sm"
              />
              <Button onClick={handleUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                value={walletAddress}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Update Payout Address
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Earnings will be sent to this wallet address on demand.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ApiKeysSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Keys</CardTitle>
        <Button>Create New Key</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_API_KEYS.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {key.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{key.createdDate}</TableCell>
                <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Two-Factor Authentication</label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch disabled />
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-4">Active Sessions</h3>
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
                {MOCK_SESSIONS.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.device}</TableCell>
                    <TableCell className="text-muted-foreground">{session.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(session.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {session.current ? (
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                          Current
                        </span>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LOGIN_HISTORY.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.device}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    {log.success ? (
                      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-600">
                        Failed
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CLIUpdateSection() {
  const [currentVersion, setCurrentVersion] = useState("1.2.4")
  const [isChecking, setIsChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  const handleCheckForUpdates = async () => {
    setIsChecking(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsChecking(false)
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUpdateProgress(i)
    }
    setIsUpdating(false)
    setUpdateAvailable(false)
    setCurrentVersion("1.2.5")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Node CLI Update</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Version</p>
            <p className="text-2xl font-mono">{currentVersion}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleCheckForUpdates}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Check for Updates"}
          </Button>
        </div>

        {updateAvailable && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                    Update Available
                  </span>
                  <span className="text-sm font-medium">v1.2.5</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Version 1.2.5 includes performance improvements, bug fixes, and enhanced monitoring capabilities.
                </p>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Changelog:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Improved node heartbeat stability</li>
                    <li>Reduced memory usage by 15%</li>
                    <li>Enhanced error reporting for network issues</li>
                    <li>Better GPU utilization metrics</li>
                  </ul>
                </div>
              </div>

              {isUpdating ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Installing update...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${updateProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button onClick={handleUpdate}>Update Now</Button>
              )}

              <Button variant="ghost" className="text-muted-foreground">
                Rollback to Previous Version
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ConnectedToolsSection() {
  const [integrations, setIntegrations] = useState([
    { id: "gh", name: "Globe", status: "connected", lastSync: "2026-06-05T10:30:00", icon: "github" },
    { id: "dd", name: "Datadog", status: "connected", lastSync: "2026-06-05T09:15:00", icon: "datadog" },
    { id: "slack", name: "Hash", status: "pending", lastSync: null, icon: "slack" },
  ])

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Connected</span>
    }
    return <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-600">Pending</span>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Connected Tools</CardTitle>
          <Button variant="outline" size="sm">Browse Integrations</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.map((integration) => (
              <TableRow key={integration.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">{integration.name[0]}</span>
                    </div>
                    <span className="font-medium">{integration.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(integration.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">Configure</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Disconnect</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function UninstallSection() {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Uninstall Node</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will remove your node from the network. Make sure you have withdrawn all earnings
            before uninstalling. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setShowConfirm(true)}>
            Uninstall Node
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently remove your node from the network. All data associated with your
              node will be lost. Make sure you have withdrawn all earnings before proceeding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowConfirm(false)}>
              Yes, Uninstall My Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ProviderSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your provider account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "payment" && <PaymentSection />}
          {activeSection === "api-keys" && <ApiKeysSection />}
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "connected-tools" && <ConnectedToolsSection />}
          {activeSection === "cli-update" && <CLIUpdateSection />}
          {activeSection === "uninstall" && <UninstallSection />}
        </div>
      </div>
    </div>
  )
}