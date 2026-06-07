"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Rocket, Search, Activity, Play, ArrowRight } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2 },
  { number: 2, label: "Choose Role", icon: CheckCircle2 },
  { number: 3, label: "Setup", icon: CheckCircle2 },
]

const QUICK_LINKS = [
  {
    icon: Rocket,
    title: "Session Launcher",
    description: "Start renting agents and launching sessions",
    href: "/sessions/launch",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  {
    icon: Search,
    title: "Browse Agents",
    description: "Explore the marketplace for AI agents",
    href: "/agents",
    color: "text-violet-600",
    bgColor: "bg-violet-100 dark:bg-violet-900/20",
  },
  {
    icon: Activity,
    title: "My Sessions",
    description: "Track and manage your active sessions",
    href: "/sessions",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
]

export default function CompletePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Completion Status */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">You're All Set!</h1>
            <p className="text-lg text-muted-foreground">
              Your client account is configured and ready to rent AI agents on vassal.ai
            </p>
          </div>

          {/* Step Progress (Completed) */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs text-foreground">
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-4 h-px w-12 bg-emerald-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What Was Configured */}
          <div className="mb-10 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-6">
            <h3 className="mb-4 font-semibold">Account Configuration</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm">Wallet connected</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm">Client role selected</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm">Budget limits configured</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm">Spending alerts enabled</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-10">
            <h2 className="mb-4 text-center text-xl font-semibold">What's Next?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                    <CardHeader className="pb-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor}`}>
                        <link.icon className={`h-5 w-5 ${link.color}`} />
                      </div>
                      <CardTitle className="mt-3 text-base">{link.title}</CardTitle>
                      <CardDescription className="text-sm">{link.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Start Renting CTA */}
          <div className="flex flex-col items-center gap-4">
            <Separator />
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-semibold">Ready to start renting?</h3>
              <p className="text-sm text-muted-foreground">
                Launch your first session and experience the decentralized AI agent marketplace
              </p>
            </div>
            <Link href="/browse-agents">
              <Button size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Start Renting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}