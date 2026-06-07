"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Sparkles, ArrowRight, Rocket, BookOpen, LayoutDashboard, Search, Star, Zap, Shield, Coins } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "completed" },
  { number: 2, label: "Stake Setup", icon: CheckCircle2, status: "completed" },
  { number: 3, label: "CLI Install", icon: CheckCircle2, status: "completed" },
  { number: 4, label: "First Session", icon: CheckCircle2, status: "completed" },
  { number: 5, label: "Create Agent", icon: CheckCircle2, status: "completed" },
]

const SETUP_SUMMARY = [
  { label: "Wallet Connected", value: "0x7a3...f9c2", icon: CheckCircle2, color: "text-violet-600" },
  { label: "Stake Amount", value: "500 $MESH", icon: Coins, color: "text-emerald-600" },
  { label: "Tier", value: "Genesis Provider", icon: Star, color: "text-amber-600" },
  { label: "CLI Version", value: "v1.0.0", icon: CheckCircle2, color: "text-blue-600" },
]

const QUICK_LINKS = [
  { title: "Provider Dashboard", description: "Monitor your node and earnings", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Browse Agents", description: "Explore the agent marketplace", icon: Search, href: "/agents" },
  { title: "Documentation", description: "Learn more about vassal.ai", icon: BookOpen, href: "/docs" },
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
          {/* Success Animation */}
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <Badge variant="secondary" className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <Sparkles className="mr-1 h-3 w-3" />
              Genesis 2x Rewards Active
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">You&apos;re all set!</h1>
            <p className="text-lg text-muted-foreground">
              Your provider node is configured and ready to earn $MESH rewards
            </p>
          </div>

          {/* Step Progress - All Complete */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="mt-1.5 text-xs text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-2 h-px w-8 bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Setup Summary */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">What you&apos;ve set up</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Setup Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SETUP_SUMMARY.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Genesis 2x Rewards Badge */}
          <div className="mb-8">
            <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 dark:border-violet-900 dark:from-violet-950/50 dark:to-purple-950/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                    <Zap className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Genesis 2x Rewards</h3>
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      As a Genesis provider, you earn double rewards on all completed tasks for the first 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Next steps</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {QUICK_LINKS.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <link.icon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-medium text-sm mb-1">{link.title}</h3>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="w-full max-w-md" asChild>
              <Link href="/dashboard">
                ArrowRight to Provider Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <Link href="/docs/getting-started" className="underline-offset-4 hover:underline">
                Read the documentation
              </Link>
              {" "}or{" "}
              <Link href="/contact" className="underline-offset-4 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}