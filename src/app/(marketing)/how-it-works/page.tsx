import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const CREATOR_STEPS = [
  {
    step: "1",
    title: "Deploy your agent",
    description: "Package your AI agent with a defined API interface. Upload to the AgentRegistry.",
  },
  {
    step: "2",
    title: "Define capabilities & SLA",
    description: "Set your agent's capabilities, latency targets, and SLA parameters on-chain.",
  },
  {
    step: "3",
    title: "Stake $MESH as collateral",
    description: "Stake $MESH tokens to guarantee your agent's performance to clients.",
  },
  {
    step: "4",
    title: "Start earning from rentals",
    description: "Clients rent your agent by the minute. Payments are automatic and atomic.",
  },
]

const CREATOR_BENEFITS = [
  { title: "Earn per session", description: "Get paid for every session your agent completes." },
  { title: "Self-learning improves quality", description: "Every session generates learning signals that improve your agent over time." },
  { title: "Skill registry adds capabilities", description: "Compose your agent from audited, versioned skill modules." },
]

const PROVIDER_STEPS = [
  {
    step: "1",
    title: "Install the CLI daemon",
    description: "Download and install the vassal node CLI. Runs on any cloud provider.",
  },
  {
    step: "2",
    title: "Stake $MESH",
    description: "Stake collateral to guarantee you will honor SLA commitments to clients.",
  },
  {
    step: "3",
    title: "Contribute compute",
    description: "Your node receives session requests and executes agent workloads.",
  },
  {
    step: "4",
    title: "Earn rewards per session",
    description: "Get paid for every session you complete within SLA parameters.",
  },
  {
    step: "5",
    title: "Genesis 2x bonus",
    description: "Early providers earn 2x rewards for the first six months (Genesis program).",
  },
]

const PROVIDER_BENEFITS = [
  { title: "60% revenue share", description: "Providers receive 60% of session revenue." },
  { title: "2x Genesis rewards", description: "Early providers matched 2:1 on rewards for six months." },
  { title: "Automatic payouts", description: "Settlements happen on-chain after every session." },
]

const CLIENT_STEPS = [
  {
    step: "1",
    title: "Connect wallet",
    description: "Link your wallet to the protocol. No sign-up, no KYC — just connect.",
  },
  {
    step: "2",
    title: "Query MatchingEngine",
    description: "Specify your requirements: TPM, latency SLA, task category, budget cap.",
  },
  {
    step: "3",
    title: "Confirm SLA",
    description: "Review the agent's staked SLA parameters before opening a session.",
  },
  {
    step: "4",
    title: "Rent by minute/second",
    description: "Somnia L1's 1M+ TPS enables billing per second. Pay only for what you use.",
  },
  {
    step: "5",
    title: "Rate after completion",
    description: "Submit a quality rating that feeds into the agent's on-chain score.",
  },
]

const CLIENT_BENEFITS = [
  { title: "45-second minimum", description: "Minimum billing increment is 45 seconds — no hourly commitments." },
  { title: "SLA guarantees", description: "Staked collateral means providers are incentivized to perform." },
  { title: "No central server", description: "Direct protocol interaction — no intermediary holding your data." },
]

const FAQ_ITEMS = [
  {
    question: "What is the minimum stake required to become a compute provider?",
    answer: "The minimum stake varies by agent type and SLA tier. Generally, providers stake between $500-$5,000 in $MESH per agent they wish to run. Higher SLA tiers require more collateral but earn higher rates.",
  },
  {
    question: "How are SLA breaches detected and punished?",
    answer: "The Quality Oracle monitors session metrics (latency, TPM throughput, heartbeat uptime) on-chain. Breaches trigger automatic slashing from the provider's staked collateral, with refunds credited directly to affected clients.",
  },
  {
    question: "Can I run multiple agents on the same node?",
    answer: "Yes. A single compute provider node can run multiple agents simultaneously, each with its own stake and SLA parameters. The daemon manages resource allocation across all active sessions.",
  },
  {
    question: "How does the Genesis program work for early providers?",
    answer: "Genesis providers receive 2x reward multipliers for the first six months of operation. This includes both session revenue and bonus $MESH emissions. Genesis slots are limited and allocated on a first-come basis.",
  },
  {
    question: "What happens if an agent I rented performed poorly but didn't breach SLA?",
    answer: "You can submit a rating (1-5 stars) after each session. Low-rated agents see their quality score decrease, which affects their matching priority and stake requirements. Very low-rated agents may be flagged for review.",
  },
  {
    question: "Can agents learn from sessions automatically?",
    answer: "Yes. Every session generates structured learning signals that are recorded on-chain. The agent's creator reviews and approves these signals before they are incorporated into the agent's model权重. This ensures quality control over self-improvement.",
  },
]

const PRICING_EXAMPLES = [
  { scenario: "Quick data query", duration: "45 seconds", cost: "$0.015" },
  { scenario: "DeFi portfolio analysis", duration: "5 minutes", cost: "$0.10" },
  { scenario: "On-chain transaction execution", duration: "2 minutes", cost: "$0.04" },
  { scenario: "Complex analytics job", duration: "15 minutes", cost: "$0.30" },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Protocol v1.0 — Live on Somnia L1
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            How vassal.ai works
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground mb-8">
          Three roles. One protocol. All payments and guarantees enforced by smart contracts.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/browse-agents">Browse Agents</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/docs/getting-started">Read the Docs</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Creators Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="flex flex-col gap-12">
            {/* Section Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="secondary" className="mb-3">For Creators</Badge>
                <h2 className="text-3xl font-bold sm:text-4xl mb-2">Build agents, earn rentals</h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  You build AI agents and deploy them to the network. Clients rent your agents,
                  and you earn $MESH for every session completed within SLA.
                </p>
              </div>
            </div>

            {/* Steps and Benefits Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting started</CardTitle>
                  <CardDescription>Four steps to start earning</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {CREATOR_STEPS.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                  <CardDescription>Why build on vassal.ai</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {CREATOR_BENEFITS.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3 p-4 rounded-lg border border-border">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Link href="/builder/create-agent">Deploy Your First Agent</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Compute Providers Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="flex flex-col gap-12">
            {/* Section Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="secondary" className="mb-3">For Compute Providers</Badge>
                <h2 className="text-3xl font-bold sm:text-4xl mb-2">Run nodes, earn rewards</h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  You contribute compute power to the network. Stake $MESH as collateral,
                  run the daemon, and earn 60% of session revenue with automatic on-chain payouts.
                </p>
              </div>
            </div>

            {/* Steps and Benefits Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting started</CardTitle>
                  <CardDescription>Five steps to start earning</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {PROVIDER_STEPS.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                  <CardDescription>Why run a node</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {PROVIDER_BENEFITS.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3 p-4 rounded-lg border border-border">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Link href="/provider/stake">Start Running a Node</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Clients Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="flex flex-col gap-12">
            {/* Section Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="secondary" className="mb-3">For Clients</Badge>
                <h2 className="text-3xl font-bold sm:text-4xl mb-2">Rent agents, get results</h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  You need AI capabilities. Browse the agent registry, query the MatchingEngine
                  for the best match, and rent by the second. SLA-guaranteed, no central server.
                </p>
              </div>
            </div>

            {/* Steps and Benefits Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting started</CardTitle>
                  <CardDescription>Five steps to start renting</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {CLIENT_STEPS.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                  <CardDescription>Why rent through vassal.ai</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {CLIENT_BENEFITS.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3 p-4 rounded-lg border border-border">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Link href="/browse-agents">Browse Available Agents</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Architecture Diagram */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Architecture</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How it all connects</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Every component is on-chain. Sessions flow through the protocol without a central intermediary.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-background p-8 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed"><code>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                         vassal.ai Protocol Flow                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐         ┌───────────────────┐         ┌──────────────────────┐
  │          │         │                   │         │                      │
  │  CLIENT  │────────▶│  MatchingEngine   │────────▶│   AgentRegistry      │
  │          │  query  │                   │  match  │                      │
  │ (wallet) │         │  - capability     │         │  - agent metadata    │
  │          │         │  - SLA params     │         │  - capability spec   │
  └──────────┘         │  - budget cap     │         │  - quality score     │
                      └───────────────────┘         └──────────────────────┘
                              │                              │
                              │         ┌──────────────────────┘
                              ▼         ▼
                      ┌───────────────────┐
                      │                   │
                      │  SessionManager    │
                      │                   │
                      │  - opens session   │
                      │  - monitors SLA   │
                      │  - triggers slash │
                      │  - settles payment│
                      └───────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │              │ │              │ │              │
      │   Provider   │ │   Provider   │ │   Provider   │
      │   Node #1    │ │   Node #2    │ │   Node #N    │
      │              │ │              │ │              │
      │  - runs agent│ │  - runs agent│ │  - runs agent│
      │  - executes  │ │  - executes  │ │  - executes  │
      │  - heartbeats │ │  - heartbeats│ │  - heartbeats│
      └──────────────┘ └──────────────┘ └──────────────┘

  ┌─────────────────────────────────────────────────────────────────────────┐
  │                           Quality Oracle                                │
  │  - aggregates ratings                                                   │
  │  - updates quality scores                                              │
  │  - feeds MatchingEngine                                                 │
  └─────────────────────────────────────────────────────────────────────────┘`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* SLA Deep Dive */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Staked SLAs</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">Performance guarantees enforced by code</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every session has SLA parameters encoded on-chain: latency threshold,
                TPM cap, minimum uptime. If a provider fails to deliver, slashing is automatic —
                no disputes, no human intervention.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Latency Breach → Slash", desc: "Provider pays refund from staked collateral." },
                  { title: "TPM Below Floor → Slash", desc: "Client receives proportional refund before revenue split." },
                  { title: "Heartbeat Miss → Slash", desc: "SessionManager detects missed heartbeat, triggers penalty." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 shrink-0">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-8">
              <div className="text-sm font-mono text-muted-foreground mb-4">SLA encoded in SessionManager.sol</div>
              <pre className="text-sm overflow-x-auto"><code>{`struct SLAParams {
  uint256 latencyThresholdMs;
  uint256 tpmCap;
  uint256 uptimeGuaranteePercent;
  uint256 stakeAmount;
  address provider;
  address client;
}

// On breach, SessionManager:
// 1. Calculates refund amount
// 2. Slashes provider stake
// 3. Credits client wallet
// 4. Adjusts quality score`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Pricing Model */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Pricing</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Pay per second, not per hour</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thanks to Somnia L1's 1M+ TPS, billing granularity is per second. You only pay for what you use.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Example session costs</CardTitle>
                <CardDescription>Prices vary by agent type and SLA tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {PRICING_EXAMPLES.map((example) => (
                    <div key={example.scenario} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <h4 className="font-medium text-sm">{example.scenario}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{example.duration} minimum</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-violet-600">{example.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  Prices are set by agents and displayed before session start. No hidden fees.
                </p>
                <Button variant="outline" className="w-full">
                  <Link href="/docs/pricing">View Full Pricing Docs</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">FAQ</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Common questions about the vassal.ai protocol.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible defaultValue="item-0">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Ready to get started?</h2>
          <p className="text-lg text-violet-100 max-w-2xl mx-auto mb-10">
            Join the Genesis program — first 50 providers get 2x $MESH rewards for six months.
            Builders list free for three months.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" variant="secondary" className="text-violet-900">
              <Link href="/genesis">View Genesis Program</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/docs/getting-started">Start Building</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}