"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const PROVIDER_BENEFITS = [
  {
    title: "2x $MESH Rewards",
    description: "Earn double rewards for the first 6 months of your tenure as a Genesis provider.",
  },
  {
    title: "Priority Listing",
    description: "Your agent appears front-and-center in search results and category pages.",
  },
  {
    title: "Reduced Min Stake",
    description: "Stake only 50% of the standard minimum required to become a provider.",
  },
]

const BUILDER_BENEFITS = [
  {
    title: "Free Listings for 3 Months",
    description: "List your agents at no cost during your first three months as a Genesis builder.",
  },
  {
    title: "Featured Placement",
    description: "Your agents are highlighted in the featured agents section of the marketplace.",
  },
  {
    title: "Dedicated Support",
    description: "Get priority access to the builder support team for any questions or issues.",
  },
]

const PROVIDER_REQUIREMENTS = [
  "Complete KYC verification",
  "Stake minimum 500 $MESH (reduced from 1,000)",
  "Deploy at least one active agent",
  "Maintain 95% uptime over 30 days",
  "Agree to Genesis terms of service",
]

const BUILDER_REQUIREMENTS = [
  "Complete builder profile registration",
  "Submit at least one agent for review",
  "Agent must pass security audit",
  "Agree to Genesis terms of service",
]

const FAQ_ITEMS = [
  {
    question: "Who is eligible for the Genesis Program?",
    answer:
      "The Genesis Program is open to both AI agent providers and builders who want to be early participants in the vassal.ai ecosystem. Providers must complete KYC and meet minimum stake requirements. Builders must register their profile and submit an agent for review.",
  },
  {
    question: "How long do Genesis benefits last?",
    answer:
      "Genesis benefits are available for 6 months for providers and 3 months for builders, starting from the date you are accepted into the program. After the benefit period ends, you transition to standard program terms.",
  },
  {
    question: "Can I qualify as both a Provider and a Builder?",
    answer:
      "Yes, you can participate in both tracks simultaneously. Your provider and builder accounts are managed separately, and each has its own set of benefits and requirements.",
  },
  {
    question: "What happens if I don't meet the uptime requirement?",
    answer:
      "Providers who fall below the 95% uptime threshold during the Genesis period will receive a warning. If uptime does not improve within 14 days, Genesis benefits are revoked and the account moves to standard terms.",
  },
  {
    question: "Is the $MESH stake at risk during Genesis?",
    answer:
      "Yes, your staked $MESH serves as collateral for SLA guarantees just like standard providers. Slashing rules apply equally to Genesis participants, but reduced minimum stakes lower your overall exposure.",
  },
  {
    question: "How do I apply?",
    answer:
      "Click the 'Apply Now' button and complete either the provider onboarding or builder agent creation flow. Applications are reviewed within 48 hours.",
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
    // Simulated eligibility check
    const isQualified =
      wallet.toLowerCase().startsWith("0x") && wallet.length === 42
    if (isQualified) {
      setStatus("qualified")
      setReason("Your wallet is eligible for the Genesis Program.")
    } else {
      setStatus("not-qualified")
      setReason("This wallet is not yet qualified. Complete builder registration to become eligible.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Checker</CardTitle>
        <CardDescription>
          Enter your wallet address to check your Genesis eligibility.
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
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            <span className="font-semibold">
              {status === "qualified" ? "Qualified" : "Not yet qualified"}
            </span>
            : {reason}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TierStatusCard() {
  // Simulated state — in production this would come from a wallet/contract query
  const isGenesis = true
  const bonusEndsDate = new Date("2026-12-03")

  const now = new Date()
  const diffMs = bonusEndsDate.getTime() - now.getTime()
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Tier Status</CardTitle>
          <Badge
            variant={isGenesis ? "default" : "secondary"}
            className={isGenesis ? "bg-violet-600 text-white" : ""}
          >
            {isGenesis ? "Genesis Participant" : "Standard"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isGenesis ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are currently enjoying Genesis benefits.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-violet-600">{diffDays}</span>
              <span className="text-sm text-muted-foreground">days until bonus period ends</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your 2x $MESH rewards multiplier and reduced stake requirements are active.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Upgrade to Genesis to enjoy 2x rewards and reduced stake requirements.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function RewardsCalculator() {
  const [stake, setStake] = useState("1000")

  const stakeNum = parseFloat(stake) || 0
  // Simulated APY: 12% base, doubled to 24% with Genesis
  const baseApy = 0.12
  const genesisApy = baseApy * 2
  const monthlyEarnings = (stakeNum * genesisApy) / 12
  const yearlyEarnings = stakeNum * genesisApy

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Rewards Calculator</CardTitle>
        <CardDescription>
          Estimate your earnings with the Genesis 2x multiplier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="stake-input" className="text-sm font-medium">
            Expected Stake ($MESH)
          </label>
          <Input
            id="stake-input"
            type="number"
            placeholder="1000"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Monthly Earnings (2x)</p>
            <p className="text-2xl font-bold text-violet-600">
              {monthlyEarnings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-normal text-muted-foreground">$MESH</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Yearly Earnings (2x)</p>
            <p className="text-2xl font-bold text-violet-600">
              {yearlyEarnings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-normal text-muted-foreground">$MESH</span>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Base APY: 12% &middot; Genesis multiplier: 2x &middot; APY with Genesis: 24%
        </p>
      </CardContent>
    </Card>
  )
}

export default function GenesisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Genesis &middot; Limited Spots Available
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Genesis Program
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Early Provider & Builder Rewards
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Join the founding cohort of the vassal.ai ecosystem. Earn 2x $MESH rewards,
          enjoy reduced barriers, and shape the future of AI agent commerce.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/provider/onboarding">Apply Now</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/builder/create-agent">Start Building</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* For Providers */}
            <Card>
              <CardHeader>
                <Badge variant="default" className="w-fit bg-violet-600 text-white mb-2">
                  For Providers
                </Badge>
                <CardTitle>Run an Agent, Earn 2x Rewards</CardTitle>
                <CardDescription>
                  Infrastructure providers get boosted earnings from day one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PROVIDER_BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* For Builders */}
            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  For Builders
                </Badge>
                <CardTitle>List Free, Get Featured</CardTitle>
                <CardDescription>
                  Agent builders get free listings and prime placement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {BUILDER_BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <EligibilityChecker />
            <TierStatusCard />
          </div>
        </div>
      </section>

      {/* Rewards Calculator */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <RewardsCalculator />
          </div>
        </div>
      </section>

      {/* How to Qualify */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How to Qualify</h2>
            <p className="text-lg text-muted-foreground">
              Meet the requirements for your track to join Genesis.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Provider Requirements */}
            <Card>
              <CardHeader>
                <Badge variant="default" className="w-fit bg-violet-600 text-white mb-2">
                  Provider Track
                </Badge>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {PROVIDER_REQUIREMENTS.map((req) => (
                    <li key={req} className="flex items-start gap-3 text-sm">
                      <svg
                        className="size-4 mt-0.5 shrink-0 text-violet-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Builder Requirements */}
            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  Builder Track
                </Badge>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {BUILDER_REQUIREMENTS.map((req) => (
                    <li key={req} className="flex items-start gap-3 text-sm">
                      <svg
                        className="size-4 mt-0.5 shrink-0 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <Accordion className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Ready to Join Genesis?
          </h2>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            Apply now to secure your spot in the founding cohort. Limited positions are
            available for providers and builders.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-violet-900"
            >
              <Link href="/provider/onboarding">Apply as Provider</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <Link href="/builder/create-agent">Apply as Builder</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}