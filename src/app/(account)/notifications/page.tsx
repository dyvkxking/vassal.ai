"use client"

import { useState } from "react"
import Link from "next/link"
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data"
import { NOTIFICATION_TYPES } from "@/constants"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Notification type to category mapping
const typeToCategory: Record<string, string> = {
  [NOTIFICATION_TYPES.SESSION_START]: "session",
  [NOTIFICATION_TYPES.SESSION_END]: "session",
  [NOTIFICATION_TYPES.SESSION_SLA_WARNING]: "session",
  [NOTIFICATION_TYPES.SESSION_TERMINATED]: "session",
  [NOTIFICATION_TYPES.SLASHED]: "slash",
  [NOTIFICATION_TYPES.PROPOSAL_NEW]: "proposals",
  [NOTIFICATION_TYPES.PROPOSAL_VOTE_REMINDER]: "proposals",
  [NOTIFICATION_TYPES.PROPOSAL_RESULTS]: "proposals",
  [NOTIFICATION_TYPES.PAYOUT_READY]: "earnings",
  [NOTIFICATION_TYPES.REWARD_EARNED]: "earnings",
  [NOTIFICATION_TYPES.SKILL_PAYMENT]: "earnings",
  [NOTIFICATION_TYPES.SYSTEM_UPGRADE]: "system",
}

// Icon mapping for notification types
const typeToIcon: Record<string, string> = {
  [NOTIFICATION_TYPES.SESSION_START]: "M13 10V3L4 14h7v7l9-11h-7z",
  [NOTIFICATION_TYPES.SESSION_END]: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
  [NOTIFICATION_TYPES.SESSION_SLA_WARNING]: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  [NOTIFICATION_TYPES.SESSION_TERMINATED]: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636",
  [NOTIFICATION_TYPES.SLASHED]: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  [NOTIFICATION_TYPES.PROPOSAL_NEW]: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  [NOTIFICATION_TYPES.PROPOSAL_VOTE_REMINDER]: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z",
  [NOTIFICATION_TYPES.PROPOSAL_RESULTS]: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  [NOTIFICATION_TYPES.PAYOUT_READY]: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  [NOTIFICATION_TYPES.REWARD_EARNED]: "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83",
  [NOTIFICATION_TYPES.SKILL_PAYMENT]: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z",
  [NOTIFICATION_TYPES.SYSTEM_UPGRADE]: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15",
}

function formatTimestamp(ts: number): string {
  const now = Date.now()
  const diff = now - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

interface NotificationCardProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    timestamp: number
    link?: string
  }
  onMarkAsRead: (id: string) => void
}

function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const iconPath = typeToIcon[notification.type] || typeToIcon[NOTIFICATION_TYPES.SYSTEM_UPGRADE]

  return (
    <Card
      className={cn(
        "group relative p-4 transition-colors hover:bg-muted/50",
        !notification.read && "border-l-4 border-l-blue-500"
      )}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d={iconPath} />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className={cn("text-sm font-medium", !notification.read && "text-foreground")}>
                {notification.title}
              </h3>
              {!notification.read && (
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" />
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <div className="mt-3 flex items-center gap-3">
            {notification.link && (
              <Link
                href={notification.link}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Details
              </Link>
            )}
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-sm text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface NotificationSettingsProps {
  settings: {
    inApp: boolean
    email: boolean
    push: boolean
  }
  onUpdate: (channel: "inApp" | "email" | "push", value: boolean) => void
  label: string
}

function NotificationSettingsRow({ settings, onUpdate, label }: NotificationSettingsProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">In-app</span>
          <Switch
            checked={settings.inApp}
            onCheckedChange={(checked) => onUpdate("inApp", checked)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Email</span>
          <Switch
            checked={settings.email}
            onCheckedChange={(checked) => onUpdate("email", checked)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Push</span>
          <Switch
            checked={settings.push}
            onCheckedChange={(checked) => onUpdate("push", checked)}
          />
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [settings, setSettings] = useState({
    session: { inApp: true, email: true, push: false },
    slash: { inApp: true, email: true, push: true },
    proposals: { inApp: true, email: false, push: false },
    earnings: { inApp: true, email: true, push: false },
    system: { inApp: true, email: false, push: false },
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const updateSetting = (
    category: keyof typeof settings,
    channel: "inApp" | "email" | "push",
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: value },
    }))
  }

  const getUnreadCount = () => notifications.filter((n) => !n.read).length

  const filteredNotifications = (category: string) => {
    if (category === "all") return notifications
    if (category === "unread") return notifications.filter((n) => !n.read)
    return notifications.filter((n) => typeToCategory[n.type] === category)
  }

  const hasUnread = (category: string) => {
    if (category === "all") return notifications.some((n) => !n.read)
    if (category === "unread") return false
    return notifications.some((n) => !n.read && typeToCategory[n.type] === category)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getUnreadCount() > 0
              ? `${getUnreadCount()} unread notification${getUnreadCount() > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {getUnreadCount() > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all" className="relative">
            All
            {hasUnread("all") && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {hasUnread("unread") && (
              <span className="ml-1.5 flex h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="session">Session Alerts</TabsTrigger>
          <TabsTrigger value="slash">Slash Alerts</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Notification Lists */}
        {["all", "unread", "session", "slash", "proposals", "earnings", "system"].map(
          (category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredNotifications(category).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/50 mb-4"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <p className="text-muted-foreground">No notifications in this category</p>
                </div>
              ) : (
                filteredNotifications(category).map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))
              )}
            </TabsContent>
          )
        )}
      </Tabs>

      {/* Notification Settings */}
      <div className="mt-12">
        <Separator className="mb-8" />
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <Card className="p-4">
          <div className="space-y-0">
            <NotificationSettingsRow
              label="Session Alerts"
              settings={settings.session}
              onUpdate={(channel, value) => updateSetting("session", channel, value)}
            />
            <Separator />
            <NotificationSettingsRow
              label="Slash Alerts"
              settings={settings.slash}
              onUpdate={(channel, value) => updateSetting("slash", channel, value)}
            />
            <Separator />
            <NotificationSettingsRow
              label="Proposals"
              settings={settings.proposals}
              onUpdate={(channel, value) => updateSetting("proposals", channel, value)}
            />
            <Separator />
            <NotificationSettingsRow
              label="Earnings"
              settings={settings.earnings}
              onUpdate={(channel, value) => updateSetting("earnings", channel, value)}
            />
            <Separator />
            <NotificationSettingsRow
              label="System"
              settings={settings.system}
              onUpdate={(channel, value) => updateSetting("system", channel, value)}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}