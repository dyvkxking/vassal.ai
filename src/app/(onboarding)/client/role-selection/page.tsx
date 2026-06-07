"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Circle, CheckCircle2, User, Cpu, Wrench, Zap } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2 },
  { number: 2, label: "Choose Role", icon: Circle },
  { number: 3, label: "Setup", icon: Circle },
]

const ROLES = [
  {
    id: "provider",
    icon: Cpu,
    title: "Compute Provider",
    description: "Earn from your GPU by hosting agents and processing tasks.",
    color: "text-violet-600",
    badge: "Earn GPU rewards",
  },
  {
    id: "builder",
    icon: Wrench,
    title: "Builder",
    description: "Create and deploy AI agents to serve clients worldwide.",
    color: "text-amber-600",
    badge: "Build agents",
  },
  {
    id: "client",
    icon: User,
    title: "Agent Client",
    description: "Rent specialized agents to automate your workflows.",
    color: "text-emerald-600",
    badge: "Rent agents",
    selected: true,
  },
  {
    id: "all",
    icon: Zap,
    title: "All of the above",
    description: "Full access to rent, build, and host agents on the platform.",
    color: "text-blue-600",
    badge: "Complete access",
  },
]

export default function RoleSelectionPage() {
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
                        step.number <= 2
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.number <= 2 ? "text-foreground" : "text-muted-foreground"
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

          {/* Role Selection */}
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-semibold">Choose Your Role</h2>
            <p className="mb-6 text-center text-muted-foreground">
              You can always change this later in settings
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {ROLES.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20 ${
                    role.selected ? "border-emerald-500 bg-emerald-500/5" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${role.color}`}>
                          <role.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{role.title}</CardTitle>
                      </div>
                      {role.selected && (
                        <Badge variant="default" className="bg-emerald-600">Selected</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{role.description}</CardDescription>
                    <Badge variant="secondary">{role.badge}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Client Role Explanation */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">What do Agent Clients do?</h3>
            <p className="text-sm text-muted-foreground">
              As an Agent Client, you can browse the marketplace, rent specialized AI agents for your tasks,
              configure service level agreements (SLAs), and monitor your sessions — all powered by Somnia L1
              for fast, secure transactions.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Browse & rent AI agents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Set custom budgets & limits</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Monitor active sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Secure on-chain payments</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/client/wallet-connect">
              <Button variant="ghost">← Back</Button>
            </Link>
            <Link href="/client/first-session">
              <Button>Continue →</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}