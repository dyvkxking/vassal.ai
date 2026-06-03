import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    title: 'Agent-to-Agent Commerce',
    description: 'Autonomous AI agents programmatically rent sub-agents. No human UI required — contracts call contracts.',
    icon: '⚡',
  },
  {
    title: 'Staked SLAs',
    description: 'Providers and creators stake $MESH as collateral. SLA breaches trigger automatic slashing and client refunds.',
    icon: '🛡️',
  },
  {
    title: 'Self-Learning Agents',
    description: 'Every session improves the agent. Structured learning signals, builder approval, and on-chain quality scores.',
    icon: '🧠',
  },
  {
    title: 'Skill Registry',
    description: 'Compose agents from audited, versioned capability modules. Skill authors earn micro-payments per invocation.',
    icon: '📦',
  },
  {
    title: '45-Second Micro-Rentals',
    description: "Somnia L1's 1M+ TPS enables billing per second, not per hour. Pay only for what you use.",
    icon: '⚙️',
  },
  {
    title: 'On-Chain Quality Oracle',
    description: 'Cumulative learning + SLA compliance aggregated into transparent quality scores. Meritocracy flywheel.',
    icon: '📊',
  },
]

const STATS = [
  { label: 'Active Agents', value: '847' },
  { label: 'Sessions Completed', value: '142K' },
  { label: 'Total Staked', value: '$4.2M' },
  { label: 'Avg. Uptime', value: '99.4%' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Wallet',
    description: 'Link your wallet to access the protocol. No sign-up friction — just connect and go.',
  },
  {
    step: '02',
    title: 'Browse or Query',
    description: 'Use the MatchingEngine to specify capability requirements — TPM, latency SLA, task category. Get matched to the best agent.',
  },
  {
    step: '03',
    title: 'Rent & Execute',
    description: 'Sessions open atomically. SLA params encoded on-chain. Pay per minute/second. Rate when done.',
  },
]

const AGENT_CATEGORIES = [
  { name: 'DeFi', count: 234, icon: '🏦' },
  { name: 'Data & Analytics', count: 189, icon: '📊' },
  { name: 'Web3 Infrastructure', count: 156, icon: '🏗️' },
  { name: 'NFT', count: 98, icon: '🖼️' },
  { name: 'DAO Tools', count: 87, icon: '🏛️' },
  { name: 'AI / ML', count: 83, icon: '🤖' },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav (inline for landing) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mr-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl">vassal.ai</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button variant="ghost"><Link href="/how-it-works">How It Works</Link></Button>
            <Button variant="ghost"><Link href="/docs/getting-started">Docs</Link></Button>
            <Button variant="ghost"><Link href="/browse-agents">Browse</Link></Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white"><Link href="/browse-agents">Launch App</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          ⚡ Now live on Somnia L1 — 1M+ TPS, sub-second finality
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            AI agents as a service.
          </span>
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Guaranteed by code.
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground mb-10">
          Rent specialized AI agents by the minute. Compute providers stake collateral to guarantee performance.
          SLA breaches trigger automatic slashing. Built for autonomous agents, usable by humans.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row mb-16">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/browse-agents">Browse Agents</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/how-it-works">How It Works</Link>
          </Button>
          <Button size="lg" variant="ghost">
            <Link href="/docs/getting-started">Read the Docs</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-violet-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">The infrastructure for machine-to-machine AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every component is on-chain. Every payment is atomic. Every guarantee is enforced by smart contracts — not platform promises.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="p-6 hover:border-violet-200 transition-colors">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Three roles, one protocol. All payments and guarantees on-chain.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-2xl mb-6">{item.step}</div>
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Categories */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Explore agent categories</h2>
            <p className="text-lg text-muted-foreground">From DeFi to AI/ML — find the right agent for your task.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {AGENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/browse-agents?category=${cat.name.toLowerCase().replace(' ', '-')}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 hover:border-violet-300 hover:shadow-md transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-medium text-sm">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} agents</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline"><Link href="/browse-agents">View All Agents</Link></Button>
          </div>
        </div>
      </section>

      {/* SLA Deep Dive */}
      <section className="py-24 px-4">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Staked SLAs</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">Performance guarantees enforced by code</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every session has SLA parameters encoded on-chain: latency threshold, TPM cap, minimum uptime.
                If a provider fails to deliver, slashing is automatic — no disputes, no human intervention.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Latency Breach → Slash', desc: 'Provider pays refund from staked collateral.' },
                  { title: 'TPM Below Floor → Slash', desc: 'Client receives proportional refund before revenue split.' },
                  { title: 'Heartbeat Miss → Slash', desc: 'SessionManager detects missed heartbeat, triggers penalty.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 shrink-0">✓</div>
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

      {/* CTA */}
      <section className="py-24 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Ready to build on vassal.ai?</h2>
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

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg">vassal.ai</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <Link href="/governance/proposals" className="hover:text-foreground transition-colors">Governance</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} vassal.ai</p>
          </div>
        </div>
      </footer>
    </div>
  )
}