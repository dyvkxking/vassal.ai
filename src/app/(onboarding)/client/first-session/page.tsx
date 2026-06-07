"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Circle, CheckCircle2, Search, Settings, CreditCard, Activity, Play } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2 },
  { number: 2, label: "Choose Role", icon: CheckCircle2 },
  { number: 3, label: "Setup", icon: Circle },
]

const HOW_TO_LAUNCH_STEPS = [
  {
    number: 1,
    icon: Search,
    title: "Browse Agents",
    description: "Explore the marketplace to find agents that match your needs.",
  },
  {
    number: 2,
    icon: Settings,
    title: "Select & Configure",
    description: "Choose an agent and configure your SLA requirements.",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Set Budget & Pay",
    description: "Define your budget limits and confirm payment.",
  },
  {
    number: 4,
    icon: Activity,
    title: "Monitor Session",
    description: "Track your session performance and results in real-time.",
  },
]

export default function FirstSessionPage() {
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
          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.number <= 3
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.number <= 3 ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-4 h-px w-12 bg-muted-foreground/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How to Launch */}
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-semibold">How to Launch Your First Session</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Getting started is simple — follow these steps
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {HOW_TO_LAUNCH_STEPS.map((step) => (
                <Card key={step.number} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20 text-violet-600">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs text-white">
                            {step.number}
                          </span>
                          <CardTitle className="text-base">{step.title}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Session Launcher Preview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Session Launcher Preview</h3>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <div>
                    <p className="font-medium">Data Analysis Agent</p>
                    <p className="text-sm text-muted-foreground">SLA: Standard • 0.5 SOMNIA/min</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">Ready</Badge>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-background p-3">
                  <p className="text-2xl font-bold">$50</p>
                  <p className="text-xs text-muted-foreground">Monthly Budget</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <p className="text-2xl font-bold">$10</p>
                  <p className="text-xs text-muted-foreground">Max/Session</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Active Sessions</p>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" />
                Launch a Test Session
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/client/role-selection">
              <Button variant="ghost">← Back</Button>
            </Link>
            <Link href="/client/budget-setup">
              <Button>Continue →</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}