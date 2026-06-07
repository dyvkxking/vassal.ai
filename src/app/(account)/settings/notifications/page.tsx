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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const notificationCategories = [
  {
    id: "session_alerts",
    label: "Session Alerts",
    description: "Login attempts, password changes, and security notifications",
  },
  {
    id: "slash_alerts",
    label: "Slash Alerts",
    description: "Updates about slash commands and agent activities",
  },
  {
    id: "proposals",
    label: "Proposals",
    description: "New proposal notifications and proposal status changes",
  },
  {
    id: "earnings",
    label: "Earnings",
    description: "Payment notifications and earnings reports",
  },
  {
    id: "system",
    label: "System",
    description: "System announcements and maintenance notices",
  },
]

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
]

export default function NotificationsSettingsPage() {
  const [categories, setCategories] = useState<Record<string, boolean>>({
    session_alerts: true,
    slash_alerts: true,
    proposals: true,
    earnings: true,
    system: false,
  })

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false,
  })

  const [email, setEmail] = useState("alex.morgan@example.com")
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietHoursStart, setQuietHoursStart] = useState("22:00")
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00")
  const [timezone, setTimezone] = useState("America/New_York")
  const [isSaving, setIsSaving] = useState(false)

  const handleToggleCategory = (categoryId: string, enabled: boolean) => {
    setCategories((prev) => ({ ...prev, [categoryId]: enabled }))
  }

  const handleToggleChannel = (channel: keyof typeof channels, enabled: boolean) => {
    setChannels((prev) => ({ ...prev, [channel]: enabled }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleCancel = () => {
    // Reset to saved state (simplified for demo)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Notifications</h1>
        <p className="mt-1 text-muted-foreground">
          Configure how you receive notifications and alerts
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <Label className="text-base">{category.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Switch
                  checked={categories[category.id]}
                  onCheckedChange={(enabled) =>
                    handleToggleCategory(category.id, enabled)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Channel Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the application
                </p>
              </div>
              <Switch
                checked={channels.inApp}
                onCheckedChange={(enabled) =>
                  handleToggleChannel("inApp", enabled)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={channels.email}
                  onCheckedChange={(enabled) =>
                    handleToggleChannel("email", enabled)
                  }
                />
              </div>

              {channels.email && (
                <div className="pl-6 space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="max-w-sm"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
              <Switch
                checked={channels.push}
                onCheckedChange={(enabled) =>
                  handleToggleChannel("push", enabled)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Quiet Hours</CardTitle>
            <CardDescription>
              Set a time range when notifications are paused
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specified hours
                </p>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>

            {quietHoursEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={(v) => setTimezone(v ?? timezone)}>
                    <SelectTrigger id="quiet-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Timezone</SelectLabel>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save/Cancel */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  )
}