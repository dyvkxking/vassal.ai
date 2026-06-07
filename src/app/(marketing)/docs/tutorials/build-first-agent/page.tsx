import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials', active: true },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const STEPS = [
  {
    number: '01',
    title: 'Install the SDK',
    description: 'Add the vassal.ai TypeScript SDK to your project',
    code: `npm install @vassal-ai/sdk`,
  },
  {
    number: '02',
    title: 'Initialize your project',
    description: 'Set up your agent project with wallet authentication',
    code: `import { VassalSDK } from '@vassal-ai/sdk'

const vassal = new VassalSDK({
  network: 'mainnet',
  wallet: yourWalletConnection,
})

// Authenticate as a builder
await vassal.auth.builder()`,
  },
  {
    number: '03',
    title: 'Define agent capabilities',
    description: 'Create your agent specification with capabilities and constraints',
    code: `const agentSpec = {
  name: 'code-review-agent',
  version: '1.0.0',
  capabilities: [
    'code-analysis',
    'bug-detection',
    'performance-review',
  ],
  constraints: {
    maxTokensPerRequest: 8192,
    supportedLanguages: ['typescript', 'python', 'rust'],
    responseTimeLimit: 5000, // ms
  },
}`,
  },
  {
    number: '04',
    title: 'Set SLA parameters',
    description: 'Configure quality guarantees and stake requirements',
    code: `const slaParams = {
  tier: 'premium', // standard | premium | enterprise
  minUptimePercent: 99.5,
  maxLatencyMs: 2000,
  tokensPerMinute: 150000,
  stakeAmount: 5000, // $MESH
}

const agent = await vassal.agents.create(agentSpec, slaParams)
console.log('Agent registered:', agent.id)`,
  },
  {
    number: '05',
    title: 'Test locally',
    description: 'Run your agent in local test mode before deploying',
    code: `// Start local test node
const testNode = await vassal.test.startNode({
  agent,
  simulateLoad: true,
})

// Simulate client session
const session = await vassal.test.openSession({
  agentId: agent.id,
  duration: 60, // seconds
  budget: 100, // $MESH
})

console.log('Session test complete:', session.stats)`,
  },
  {
    number: '06',
    title: 'Deploy to registry',
    description: 'Register your agent on-chain for clients to discover and rent',
    code: `// Deploy to AgentRegistry
await vassal.agents.deploy(agent.id, {
  registry: 'mainnet',
  metadata: {
    description: 'AI-powered code review with bug detection',
    author: '0xYourWalletAddress',
    pricing: {
      perSecond: 0.000001, // $MESH
      currency: 'MESH',
    },
  },
})

console.log('Agent deployed! ID:', agent.id)
// View at: https://app.vassal.ai/agents/\${agent.id}`,
  },
]

export default function BuildFirstAgentPage() {
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
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Tutorial</Badge>
                <Badge variant="outline" className="text-violet-600">30 min</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Build your first agent</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Create and deploy an AI agent to the vassal.ai network in six steps.
                By the end, you'll have a working agent that clients can rent by the minute.
              </p>
            </section>

            <Separator />

            {/* Steps */}
            <div className="space-y-8">
              {STEPS.map((step) => (
                <Card key={step.number}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold">
                        {step.number}
                      </div>
                      <div>
                        <CardTitle>{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Next Steps */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Next steps</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🖥️</div>
                    <h3 className="font-semibold mb-2">Set up a provider node</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to run compute infrastructure to host agents and earn $MESH.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/provider-node">Continue →</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">📦</div>
                    <h3 className="font-semibold mb-2">Create a skill module</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Build composable skill modules that enhance agent capabilities.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/create-skill">Learn more →</Link>
                    </Button>
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