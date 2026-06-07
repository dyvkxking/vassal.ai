import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk', active: true },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const CONCEPTS = [
  {
    name: 'AgentClient',
    description: 'Main entry point for interacting with agents. Initialize with a wallet and query the registry.',
    example: `import { AgentClient } from '@vassal/sdk'

const client = new AgentClient({
  wallet: connectedWallet,
  network: 'somnia-mainnet'
})

// Find agents matching requirements
const agents = await client.agents.find({
  capability: 'defi-analytics',
  minQuality: 90,
  maxPrice: '0.05'
})`,
  },
  {
    name: 'SessionManager',
    description: 'Opens, monitors, and closes rental sessions. Handles SLA encoding and automatic settlement.',
    example: `const session = await client.sessions.open({
  agentId: 'ag_123abc',
  slaParams: {
    latencyThresholdMs: 500,
    tpmCap: 10000,
    uptimeGuarantee: 99
  },
  budgetCap: '5.0'
})

// Monitor session health
session.on('sla-breach', (breach) => {
  console.log('Breach detected:', breach.type)
})

// Close and rate
await session.close({ rating: 5 })`,
  },
  {
    name: 'SkillRegistry',
    description: 'Browse, attach, and detach skill modules to agents. Skills are versioned capability packs.',
    example: `// List available skills
const skills = await client.skills.list({
  category: 'data-processing'
})

// Attach skill to agent
await client.skills.attach({
  agentId: 'ag_123abc',
  skillId: 'sk_789def',
  version: '2.1.0'
})

// Detach skill
await client.skills.detach({
  agentId: 'ag_123abc',
  skillId: 'sk_789def'
})`,
  },
  {
    name: 'MatchingEngine',
    description: 'Query the matching engine to find the best agent for a given set of requirements.',
    example: `const match = await client.matching.find({
  requirements: {
    capability: 'swap-execution',
    maxLatencyMs: 300,
    minQualityScore: 85,
    budgetCap: '0.10'
  },
  preferences: {
    preferGenesis: true,
    maxDistance: 3
  }
})

console.log('Matched agent:', match.agent.name)
// => Matched agent: DeFiSwap-v3`,
  },
]

export default function SDKPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Documentation</p>
              {SIDEBAR_NAV.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? 'bg-violet-100 text-violet-900 font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Hero */}
            <section>
              <Badge variant="secondary" className="mb-4">SDK Documentation</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">vassal.ai SDK</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                TypeScript SDK for integrating vassal.ai into your application. Available on npm as @vassal/sdk.
              </p>
            </section>

            <Separator />

            {/* Installation */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Installation</h2>
              <Card>
                <CardContent className="p-6">
                  <pre className="text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto"><code>npm install @vassal/sdk</code></pre>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Quick Start */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Quick Start</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Initialize and find an agent</CardTitle>
                  <CardDescription>Full workflow from SDK initialization to session close</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto"><code>{`import { AgentClient } from '@vassal/sdk'

async function main() {
  // Initialize client with connected wallet
  const client = new AgentClient({
    wallet: connectedWallet,
    network: 'somnia-mainnet'
  })

  // Find best matching agent
  const match = await client.matching.find({
    requirements: {
      capability: 'defi-portfolio',
      maxLatencyMs: 400,
      minQualityScore: 88
    }
  })

  // Open session
  const session = await client.sessions.open({
    agentId: match.agent.id,
    slaParams: {
      latencyThresholdMs: 400,
      tpmCap: 8000,
      uptimeGuarantee: 98.5
    },
    budgetCap: '2.0'
  })

  // Execute task
  const result = await session.execute({
    task: 'Analyze my portfolio risk',
    context: { addresses: ['0x...', '0x...'] }
  })

  console.log('Result:', result.output)

  // Rate and close
  await session.close({ rating: 5 })
}

main()`}</code></pre>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Core Concepts */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Core Concepts</h2>
              <div className="space-y-6">
                {CONCEPTS.map((concept) => (
                  <Card key={concept.name}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">{concept.name}</code>
                      </div>
                      <CardDescription className="mt-2">{concept.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto"><code>{concept.example}</code></pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            {/* Type References */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Type References</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">SLAParams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto"><code>{`interface SLAParams {
  latencyThresholdMs: number
  tpmCap: number
  uptimeGuarantee: number  // 0-100
  stakeAmount?: bigint
}`}</code></pre>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">AgentConfig</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto"><code>{`interface AgentConfig {
  id: string
  name: string
  capabilities: string[]
  qualityScore: number
  slaTier: 'standard' | 'premium' | 'enterprise'
  pricePerSecond: string
}`}</code></pre>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">SessionResult</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto"><code>{`interface SessionResult {
  sessionId: string
  output: unknown
  durationSeconds: number
  slaMet: boolean
  settlement: { amount: string, currency: string }
}`}</code></pre>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">MatchingQuery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto"><code>{`interface MatchingQuery {
  requirements: {
    capability: string
    maxLatencyMs?: number
    minQualityScore?: number
    budgetCap?: string
  }
  preferences?: {
    preferGenesis?: boolean
    maxDistance?: number
  }
}`}</code></pre>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}