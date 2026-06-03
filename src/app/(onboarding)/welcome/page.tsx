"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Circle, Cpu, Wrench, User, Zap } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: Circle },
  { number: 2, label: "Choose Role", icon: Circle },
  { number: 3, label: "Setup", icon: Circle },
]

const ROLES = [
  {
    id: "provider",
    icon: Cpu,
    title: "I'm a Compute Provider",
    description: "Earn from your GPU by hosting agents and processing tasks.",
    color: "text-violet-600",
    badge: "Earn GPU rewards",
  },
  {
    id: "builder",
    icon: Wrench,
    title: "I'm a Builder",
    description: "Create and deploy AI agents to serve clients worldwide.",
    color: "text-amber-600",
    badge: "Build agents",
  },
  {
    id: "client",
    icon: User,
    title: "I'm a Client",
    description: "Rent specialized agents to automate your workflows.",
    color: "text-emerald-600",
    badge: "Rent agents",
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

export default function WelcomePage() {
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
          {/* Welcome Headline */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Welcome to vassal.ai</h1>
            <p className="text-lg text-muted-foreground">
              The decentralized AI agent marketplace. Get started in minutes.
            </p>
          </div>

          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.number === 1
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.number === 1 ? "text-foreground" : "text-muted-foreground"
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

          {/* Role Selection Cards */}
          <div className="mb-10">
            <h2 className="mb-4 text-center text-xl font-semibold">Choose your role</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ROLES.map((role) => (
                <Card key={role.id} className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${role.color}`}>
                          <role.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{role.title}</CardTitle>
                      </div>
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

          {/* Connect Wallet CTA */}
          <div className="flex flex-col items-center gap-4">
            <Separator />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to get started with vassal.ai
              </p>
              <ConnectButton />
            </div>
            <p className="text-xs text-muted-foreground">
              By connecting, you agree to our{" "}
              <Link href="/terms" className="underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}