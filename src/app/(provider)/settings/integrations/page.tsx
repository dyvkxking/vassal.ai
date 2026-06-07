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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockIntegrations = [
  {
    id: "github",
    name: "Globe",
    description: "Connect your repository for CI/CD",
    status: "connected",
    lastSync: "2026-06-05T10:30:00",
    config: { autoDeploy: true, branch: "main" },
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Monitor node performance and metrics",
    status: "connected",
    lastSync: "2026-06-05T09:15:00",
    config: { apiKey: "dd_api_key_***" },
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Visualize metrics and dashboards",
    status: "disconnected",
    lastSync: null,
    config: {},
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Scrape and store metrics",
    status: "disconnected",
    lastSync: null,
    config: {},
  },
  {
    id: "slack",
    name: "Hash",
    description: "Receive notifications in Hash channels",
    status: "connected",
    lastSync: "2026-06-05T11:00:00",
    config: { channel: "#vassal-alerts" },
  },
  {
    id: "discord",
    name: "MessageCircle",
    description: "Receive notifications in MessageCircle servers",
    status: "disconnected",
    lastSync: null,
    config: {},
  },
]

const mockWebhooks = [
  { id: "wh_1", name: "Agent Events", url: "https://api.example.com/webhooks/agents", events: ["deploy", "update"], active: true },
  { id: "wh_2", name: "Payment Notifications", url: "https://api.example.com/webhooks/payments", events: ["earning", "payout"], active: true },
]

export default function ProviderIntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [webhooks, setWebhooks] = useState(mockWebhooks)
  const [showWebhookDialog, setShowWebhookDialog] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<typeof mockWebhooks[0] | null>(null)
  const [webhookForm, setWebhookForm] = useState({ name: "", url: "", events: [] as string[] })

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, status: int.status === "connected" ? "disconnected" : "connected" }
          : int
      )
    )
  }

  const handleSaveWebhook = () => {
    if (editingWebhook) {
      setWebhooks((prev) =>
        prev.map((wh) =>
          wh.id === editingWebhook.id
            ? { ...wh, name: webhookForm.name, url: webhookForm.url, events: webhookForm.events }
            : wh
        )
      )
    } else {
      setWebhooks((prev) => [
        ...prev,
        { id: `wh_${Date.now()}`, ...webhookForm, active: true },
      ])
    }
    setShowWebhookDialog(false)
    setEditingWebhook(null)
    setWebhookForm({ name: "", url: "", events: [] })
  }

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Connected</span>
    }
    return <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Disconnected</span>
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Integrations</h1>
        <p className="mt-1 text-muted-foreground">
          Connect and manage third-party tools and services
        </p>
      </div>

      <div className="space-y-8">
        {/* Globe Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GH</span>
                </div>
                <div>
                  <CardTitle>Globe</CardTitle>
                  <CardDescription>Connect your repository for CI/CD</CardDescription>
                </div>
              </div>
              {getStatusBadge(integrations.find((i) => i.id === "github")?.status || "disconnected")}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-Deploy on Agent Update</p>
                <p className="text-sm text-muted-foreground">Automatically deploy when agents are updated</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Repository Branch</Label>
              <Input defaultValue="main" className="max-w-xs" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Configure Repository</Button>
              <Button variant="outline">Disconnect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Tools</CardTitle>
            <CardDescription>Connect monitoring and observability platforms</CardDescription>
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
                {["datadog", "grafana", "prometheus"].map((id) => {
                  const integration = integrations.find((i) => i.id === id)!
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">{integration.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        {integration.status === "connected" ? (
                          <Button variant="ghost" size="sm">Configure</Button>
                        ) : (
                          <Button variant="ghost" size="sm">Connect</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Notification Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Integrations</CardTitle>
            <CardDescription>Receive alerts via Hash, MessageCircle, and other platforms</CardDescription>
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
                {["slack", "discord"].map((id) => {
                  const integration = integrations.find((i) => i.id === id)!
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">{integration.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        {integration.status === "connected" ? (
                          <Button variant="ghost" size="sm">Configure</Button>
                        ) : (
                          <Button variant="ghost" size="sm">Connect</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API Webhooks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Webhooks</CardTitle>
                <CardDescription>Configure webhook endpoints for events</CardDescription>
              </div>
              <Button onClick={() => setShowWebhookDialog(true)}>+ Add Webhook</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{webhook.url}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="secondary">{event}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {webhook.active ? (
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Active</span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setEditingWebhook(webhook)
                          setWebhookForm({ name: webhook.name, url: webhook.url, events: webhook.events })
                          setShowWebhookDialog(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWebhook ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
            <DialogDescription>
              Configure a webhook endpoint to receive events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                placeholder="My Webhook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL</Label>
              <Input
                id="webhook-url"
                value={webhookForm.url}
                onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="flex flex-wrap gap-2">
                {["deploy", "update", "earning", "payout", "alert"].map((event) => (
                  <div key={event} className="flex items-center gap-2">
                    <Switch
                      id={`event-${event}`}
                      checked={webhookForm.events.includes(event)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setWebhookForm({ ...webhookForm, events: [...webhookForm.events, event] })
                        } else {
                          setWebhookForm({ ...webhookForm, events: webhookForm.events.filter((e) => e !== event) })
                        }
                      }}
                    />
                    <Label htmlFor={`event-${event}`} className="text-sm">{event}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowWebhookDialog(false); setEditingWebhook(null); setWebhookForm({ name: "", url: "", events: [] }) }}>
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook}>Save Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}