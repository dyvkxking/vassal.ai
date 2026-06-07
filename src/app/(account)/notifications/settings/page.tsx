"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Bell, Mail, Smartphone, Moon, Sun } from 'lucide-react'

interface NotificationTypeSettings {
  inApp: boolean
  email: boolean
  push: boolean
}

interface NotificationPreferences {
  sessionAlerts: NotificationTypeSettings
  slashAlerts: NotificationTypeSettings
  proposals: NotificationTypeSettings
  earnings: NotificationTypeSettings
  system: NotificationTypeSettings
}

function NotificationTypeRow({
  label,
  description,
  settings,
  onUpdate,
}: {
  label: string
  description: string
  settings: NotificationTypeSettings
  onUpdate: (channel: keyof NotificationTypeSettings, value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="space-y-0.5 flex-1">
        <Label className="text-base">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={settings.inApp}
            onCheckedChange={(checked) => onUpdate("inApp", checked)}
          />
          <span className="text-xs text-muted-foreground">In-app</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={settings.email}
            onCheckedChange={(checked) => onUpdate("email", checked)}
          />
          <span className="text-xs text-muted-foreground">Email</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={settings.push}
            onCheckedChange={(checked) => onUpdate("push", checked)}
          />
          <span className="text-xs text-muted-foreground">Push</span>
        </div>
      </div>
    </div>
  )
}

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    sessionAlerts: { inApp: true, email: true, push: false },
    slashAlerts: { inApp: true, email: true, push: true },
    proposals: { inApp: true, email: false, push: false },
    earnings: { inApp: true, email: true, push: false },
    system: { inApp: true, email: false, push: false },
  })
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietHoursStart, setQuietHoursStart] = useState("22:00")
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateNotificationType = (
    type: keyof NotificationPreferences,
    channel: keyof NotificationTypeSettings,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: { ...prev[type], [channel]: value },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Notification Preferences</h1>
        <p className="mt-1 text-muted-foreground">
          Configure how and when you receive notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Choose how you want to be notified for each activity type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <NotificationTypeRow
                label="Session Alerts"
                description="Updates about agent sessions you are participating in"
                settings={preferences.sessionAlerts}
                onUpdate={(channel, value) =>
                  updateNotificationType("sessionAlerts", channel, value)
                }
              />
              <Separator />
              <NotificationTypeRow
                label="Slash Alerts"
                description="Notifications about slashed funds and disputes"
                settings={preferences.slashAlerts}
                onUpdate={(channel, value) =>
                  updateNotificationType("slashAlerts", channel, value)
                }
              />
              <Separator />
              <NotificationTypeRow
                label="Proposals"
                description="ArrowRightvernance proposals and voting reminders"
                settings={preferences.proposals}
                onUpdate={(channel, value) =>
                  updateNotificationType("proposals", channel, value)
                }
              />
              <Separator />
              <NotificationTypeRow
                label="Earnings"
                description="Payout ready, rewards earned, and skill payments"
                settings={preferences.earnings}
                onUpdate={(channel, value) =>
                  updateNotificationType("earnings", channel, value)
                }
              />
              <Separator />
              <NotificationTypeRow
                label="System"
                description="System upgrades, maintenance, and announcements"
                settings={preferences.system}
                onUpdate={(channel, value) =>
                  updateNotificationType("system", channel, value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Pause notifications during specified hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Pause all notifications during these hours
                </p>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>
            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quiet-start"
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quiet-end"
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  )
}