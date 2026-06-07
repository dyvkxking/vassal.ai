"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Shield, Zap, TrendingUp, Lock, Info } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, done: true },
  { number: 2, label: "Choose Role", icon: CheckCircle2, done: true },
  { number: 3, label: "Stake Setup", icon: CheckCircle2, active: true },
]

const STAKING_BENEFITS = [
  {
    icon: Shield,
    title: "Agent Reputation",
    description: "Higher stake = more trusted agent listings and better visibility",
  },
  {
    icon: Zap,
    title: "Priority Access",
    description: "Early access to new features and premium builder tools",
  },
  {
    icon: TrendingUp,
    title: "Higher Limits",
    description: "Increased TPM caps and concurrent agent limits",
  },
  {
    icon: Lock,
    title: "Slashing Protection",
    description: "Stake protects against false slashing claims from malicious actors",
  },
]

const MIN_STAKE = 250

export default function StakeSetupPage() {
  const router = useRouter()
  const [stakeAmount, setStakeAmount] = useState(MIN_STAKE.toString())

  const handleContinue = () => {
    router.push("/builder/agent-creation")
  }

  const handleSkip = () => {
    router.push("/builder/agent-creation")
  }

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
                        step.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : step.active
                            ? "border-primary bg-background text-primary"
                            : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.done || step.active ? "text-foreground" : "text-muted-foreground"
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

          {/* Page Title */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Stake for Builder</h1>
            <p className="text-lg text-muted-foreground">
              Secure your builder position with $MESH stake. Higher stake unlocks more features.
            </p>
          </div>

          {/* Staking Benefits */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-center">Staking Benefits</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {STAKING_BENEFITS.map((benefit) => (
                <Card key={benefit.title}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <benefit.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stake Input */}
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Stake Amount</CardTitle>
              <CardDescription>
                Minimum {MIN_STAKE} $MESH required to become a builder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">$MESH Amount</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={MIN_STAKE}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">$MESH</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Your stake is locked while your agent is active on the network. You can increase
                  your stake at any time for better visibility and higher limits.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" onClick={handleContinue} className="w-full max-w-xs">
              Stake {stakeAmount} $MESH
            </Button>
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            <p className="text-xs text-muted-foreground">
              You can stake later from your builder dashboard
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}