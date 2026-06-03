"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  Palette,
  Bell,
  ShieldCheck,
  Plug,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  {
    title: "Account",
    description: "Manage your account details and preferences",
    href: "/settings/account",
    icon: User,
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of your dashboard",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Notifications",
    description: "Configure how you receive alerts and updates",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Security",
    description: "Protect your account with two-factor authentication",
    href: "/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Connected Apps",
    description: "Manage third-party integrations and API access",
    href: "/settings/connected-apps",
    icon: Plug,
  },
  {
    title: "Data & Privacy",
    description: "Control your data and privacy settings",
    href: "/settings/data",
    icon: Database,
  },
]

export default function SettingsPage() {
  const pathname = usePathname()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
                  "!data-[active=true]:bg-accent !data-[active=true]:text-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 text-muted-foreground transition-colors",
                    "group-hover:text-foreground group-data-[active=true]:text-accent-foreground"
                  )}
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Content Area */}
        <div className="rounded-xl border bg-card text-card-foreground ring-1 ring-foreground/10">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-muted">
              <User className="size-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-medium">Select a settings section</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Choose a category from the sidebar to manage your account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}