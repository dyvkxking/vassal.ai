"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, Circle, Coins, Shield, TrendingUp, Clock, AlertTriangle, ArrowRight, Lock } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "completed" },
  { number: 2, label: "Stake Setup", icon: CheckCircle2, status: "current" },
  { number: 3, label: "CLI Install", icon: Circle, status: "pending" },
  { number: 4, label: "First Session", icon: Circle, status: "pending" },
  { number: 5, label: "Create Agent", icon: Circle, status: "pending" },
]

const STAKE_TIERS = [
  {
    name: "Genesis Provider",
    minStake: 500,
    color: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    benefits: ["Priority task allocation", "2x rewards multiplier", "Featured in provider directory"],
  },
  {
    name: "Standard Provider",
    minStake: 1000,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    benefits: ["Standard task allocation", "Base reward rate", "Community support"],
  },
]

const STAKING_BENEFITS = [
  { icon: TrendingUp, title: "Earn Rewards", description: "Receive $MESH tokens for every task you complete" },
  { icon: Shield, title: "Slashing Protection", description: "Maintain high uptime to avoid penalty deductions" },
  { icon: Clock, title: "Flexible Unstaking", description: "Unlock your stake after minimum lock period" },
]

export default function StakeSetupPage() {
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
            <Badge variant="secondary" className="mb-4">Step 2 of 5</Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Stake $MESH</h1>
            <p className="text-lg text-muted-foreground">
              Stake tokens to become a verified provider and unlock earning potential
            </p>
          </div>

          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.status === "current"
                          ? "border-primary bg-primary text-primary-foreground"
                          : step.status === "completed"
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-xs ${
                        step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`mx-2 h-px w-8 ${step.status === "completed" ? "bg-primary" : "bg-muted-foreground/20"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stake Tiers */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Choose your stake tier</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {STAKE_TIERS.map((tier) => (
                <Card key={tier.name} className={`${tier.bgColor} transition-all hover:border-primary/50`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className={`h-5 w-5 ${tier.color}`} />
                        <CardTitle className="text-base">{tier.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-2xl font-bold text-foreground">
                      {tier.minStake} $MESH
                      <span className="text-sm font-normal text-muted-foreground"> minimum</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className={`h-4 w-4 ${tier.color}`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stake Amount Input */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enter stake amount</CardTitle>
                <CardDescription>You can stake more than the minimum for higher task allocation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="flex-1"
                    min="500"
                  />
                  <Button variant="outline">$MESH</Button>
                </div>
                <div className="flex gap-2">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <Button
                      key={amount}
                      variant="secondary"
                      size="sm"
                      onClick={() => {}}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staking Benefits */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {STAKING_BENEFITS.map((benefit, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <benefit.icon className="h-8 w-8 text-violet-600 mb-3" />
                    <h3 className="font-medium text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Start Staking CTA */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <Button size="lg" className="w-full max-w-md">
              <Lock className="mr-2 h-4 w-4" />
              Start Staking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              This will open the Stake Manager to complete your staking
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion className="w-full">
            <AccordionItem value="slashing">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  What happens if I&apos;m slashed?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Slashing occurs when you fail to fulfill task requirements, such as going offline
                    during critical operations or providing incorrect results. Penalties range from:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Minor violations:</strong> 5-10% of stake deduction</li>
                    <li><strong>Severe violations:</strong> 25-50% of stake deduction</li>
                    <li><strong>Malicious behavior:</strong> Up to 100% stake slashing + removal</li>
                  </ul>
                  <p className="mt-2">
                    To avoid slashing, maintain high uptime and respond promptly to task assignments.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="unlock">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  How long does it take to unlock my stake?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Once you initiate an unstake request, there is a mandatory cooldown period:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Genesis providers:</strong> 7-day cooldown</li>
                    <li><strong>Standard providers:</strong> 14-day cooldown</li>
                  </ul>
                  <p className="mt-2">
                    During cooldown, you cannot accept new tasks but may still complete in-progress work.
                    Your stake remains locked until the period expires.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  )
}