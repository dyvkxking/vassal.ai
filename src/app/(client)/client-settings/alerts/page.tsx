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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const alertTypes = [
  { id: "session_start", name: "Session Start", description: "When an agent session begins" },
  { id: "session_end", name: "Session End", description: "When an agent session completes" },
  { id: "sla_warning", name: "SLA Warning", description: "When response time exceeds threshold" },
  { id: "slash", name: "Slash Commands", description: "When slash commands are executed" },
  { id: "proposal", name: "Proposals", description: "New proposals from builders" },
  { id: "earnings", name: "Earnings", description: "Payment received and withdrawals" },
]

const channels = ["in-app", "email", "push"]

export default function ClientAlertsPage() {
  const [alerts, setAlerts] = useState(
    alertTypes.reduce((acc, alert) => {
      acc[alert.id] = { inApp: true, email: true, push: false }
      return acc
    }, {} as Record<string, Record<string, boolean>>)
  )
  const [quietHours, setQuietHours] = useState(false)
  const [quietStart, setQuietStart] = useState("22:00")
  const [quietEnd, setQuietEnd] = useState("08:00")
  const [testNotification, setTestNotification] = useState(false)

  const toggleChannel = (alertId: string, channel: string) => {
    setAlerts((prev) => ({
      ...prev,
      [alertId]: {
        ...prev[alertId],
        [channel]: !prev[alertId][channel],
      },
    }))
  }

  const handleTestNotification = async () => {
    setTestNotification(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTestNotification(false)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Notification Alerts</h1>
        <p className="mt-1 text-muted-foreground">
          Configure how you receive alerts and notifications
        </p>
      </div>

      <div className="space-y-8">
        {/* Alert Types */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Channels by Type</CardTitle>
            <CardDescription>
              Configure which channels receive each type of alert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">Alert Type</div>
              <div className="col-span-1 text-center">In-App</div>
              <div className="col-span-1 text-center">Email</div>
              <div className="col-span-1 text-center">Push</div>
            </div>
            <Separator />
            {alertTypes.map((alert) => (
              <div key={alert.id} className="space-y-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1">
                    <p className="font-medium">{alert.name}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Switch
                      checked={alerts[alert.id].inApp}
                      onCheckedChange={() => toggleChannel(alert.id, "inApp")}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Switch
                      checked={alerts[alert.id].email}
                      onCheckedChange={() => toggleChannel(alert.id, "email")}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Switch
                      checked={alerts[alert.id].push}
                      onCheckedChange={() => toggleChannel(alert.id, "push")}
                    />
                  </div>
                </div>
                {alert.id !== alertTypes[alertTypes.length - 1].id && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>
                  Pause non-critical notifications during specified times
                </CardDescription>
              </div>
              <Switch checked={quietHours} onCheckedChange={setQuietHours} />
            </div>
          </CardHeader>
          {quietHours && (
            <CardContent className="space-y-6">
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Critical alerts (budget exceeded, SLA breaches) will still be sent during quiet hours.
              </p>
              <Button variant="outline">Save Quiet Hours</Button>
            </CardContent>
          )}
        </Card>

        {/* Per-Alert Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Per-Alert-Type Quiet Hours</CardTitle>
            <CardDescription>
              Set different quiet hours for different alert types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Session Alerts</p>
                  <p className="text-sm text-muted-foreground">No quiet hours</p>
                </div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Proposal Notifications</p>
                  <p className="text-sm text-muted-foreground">Weekends only</p>
                </div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Earnings</p>
                  <p className="text-sm text-muted-foreground">Disabled (always notify)</p>
                </div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Notification */}
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
            <CardDescription>Verify your notification settings are working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send a test notification to verify your channel configurations.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTestNotification}
                disabled={testNotification}
              >
                {testNotification ? "Sending..." : "Send Test Notification"}
              </Button>
            </div>
            {testNotification && (
              <div className="rounded-lg bg-green-500/10 p-4">
                <p className="text-sm text-green-600 font-medium">Test notification sent successfully!</p>
                <p className="text-xs text-muted-foreground mt-1">Check your configured channels (in-app, email, push)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}