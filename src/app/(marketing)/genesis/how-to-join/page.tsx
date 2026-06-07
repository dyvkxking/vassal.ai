"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const STEPS = [
  {
    step: 1,
    title: "Connect Wallet",
    description: "Connect your Web3 wallet to the vassal.ai platform. We support MetaMask, WalletConnect, and other major wallets.",
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Complete KYC",
    description: "If required for your region, complete identity verification. This helps us maintain a secure and compliant marketplace.",
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Stake Minimum $MESH",
    description: "Stake at least 500 $MESH to qualify as a Genesis provider. This reduced stake unlocks your 2x rewards multiplier.",
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Deploy or Create First Agent",
    description: "Deploy an existing agent or create a new one through our builder platform. Ensure it meets marketplace standards.",
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "Activate Genesis Status",
    description: "Once all requirements are met, your Genesis status is automatically activated. Enjoy your 2x rewards and reduced stake benefits.",
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
]

function EligibilityChecker() {
  const [wallet, setWallet] = useState("")
  const [status, setStatus] = useState<"idle" | "qualified" | "not-qualified">("idle")
  const [reason, setReason] = useState("")

  function handleCheck() {
    if (!wallet.trim()) {
      setStatus("not-qualified")
      setReason("Please enter a valid wallet address.")
      return
    }
    const isQualified = wallet.toLowerCase().startsWith("0x") && wallet.length === 42
    if (isQualified) {
      setStatus("qualified")
      setReason("Your wallet appears eligible. Complete the steps below to join Genesis.")
    } else {
      setStatus("not-qualified")
      setReason("This wallet address format is invalid. Please check and try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Checker</CardTitle>
        <CardDescription>
          Enter your wallet address to verify basic Genesis eligibility.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="0x..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <Button onClick={handleCheck}>Check Status</Button>
        </div>
        {status !== "idle" && (
          <div
            className={`rounded-lg p-3 text-sm ${
              status === "qualified"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <span className="font-semibold">
              {status === "qualified" ? "Potentially Eligible" : "Not Eligible"}
            </span>
            : {reason}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function GenesisHowToJoinPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          How to Join
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Join the Genesis
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Program
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Follow these five steps to become a Genesis participant and enjoy 2x rewards, reduced stake requirements, and more.
        </p>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/genesis/how-to-join">Apply Now</Link>
        </Button>
      </section>

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-8">
            {STEPS.map((step, index) => (
              <Card key={step.step} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 to-purple-500" />
                <CardContent className="pl-8 py-6">
                  <div className="flex items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Step {step.step}
                        </Badge>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
                        <svg className="size-6 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Checker */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <EligibilityChecker />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Ready to Join Genesis?
          </h2>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            Apply now to secure your spot in the Genesis founding cohort. Limited positions are available.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-violet-900"
            >
              <Link href="/provider-onboarding">Apply as Provider</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <Link href="/create-agent">Apply as Builder</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 border-t">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/genesis">Genesis Overview</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/provider">Provider Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/builder">Builder Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/faq">FAQ</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/terms">Program Terms</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}