import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/docs-sdk' },
  { title: 'Tutorials', href: '/docs/tutorials', active: true },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const INSTALL_STEPS = {
  linux: [
    { command: 'curl -fsSL https://get.vassal.ai/node | sh', description: 'Download and run the installer' },
    { command: 'vassal node init --network mainnet', description: 'Initialize the node configuration' },
    { command: 'vassal node start', description: 'Start the daemon' },
  ],
  macos: [
    { command: 'curl -fsSL https://get.vassal.ai/node | sh', description: 'Download and run the installer (or use Homebrew)' },
    { command: 'vassal node init --network mainnet', description: 'Initialize the node configuration' },
    { command: 'vassal node start', description: 'Start the daemon' },
  ],
  windows: [
    { command: 'irm https://get.vassal.ai/node | iex', description: 'Run PowerShell installer (as Administrator)' },
    { command: 'vassal node init --network mainnet', description: 'Initialize the node configuration' },
    { command: 'vassal node start', description: 'Start the daemon' },
  ],
}

const CONFIG_TEMPLATE = `# ~/.vassal/config.yaml

network:
  rpc_url: https://rpc.somnia.network
  chain_id: 4242

node:
  name: "my-provider-node"
  location: "us-east-1"
  port: 8080

sla:
  tier: standard  # standard | premium | enterprise
  min_uptime: 99.0
  max_latency_ms: 5000
  tokens_per_minute: 100000

staking:
  auto_compound: true
  minimum_stake: 1000  # $MESH

logging:
  level: info  # debug | info | warn | error
  output: ~/.vassal/logs
`

const REGISTRATION_COMMANDS = [
  'vassal node stake --amount 5000',
  'vassal node register --name "My Node" --location "us-east-1"',
  'vassal node status',
]

const MONITOR_COMMANDS = [
  { command: 'vassal logs --follow', description: 'Real-time logs' },
  { command: 'vassal status', description: 'Node health and session stats' },
  { command: 'vassal sessions list', description: 'Active sessions' },
  { command: 'vassal earnings', description: 'Revenue and rewards' },
]

export default function ProviderNodePage() {
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
                <Badge variant="outline" className="text-violet-600">45 min</Badge>
                <Badge variant="outline">Intermediate</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Set up a provider node</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Run a compute node on vassal.ai and start earning $MESH by hosting agent sessions for clients.
              </p>
            </section>

            <Separator />

            {/* Prerequisites */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Prerequisites</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hardware</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 4+ vCPUs</li>
                      <li>• 16GB RAM minimum</li>
                      <li>• 50GB storage</li>
                      <li>• Stable internet (100+ Mbps)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Software</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Node.js 18+</li>
                      <li>• 64-bit OS (Terminal/macOS/Monitor)</li>
                      <li>• EVM wallet with $MESH</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Installation */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Installation</h2>

              {/* Terminal */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🐧</span>
                    <CardTitle className="text-base">Terminal / macOS</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {INSTALL_STEPS.linux.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <pre className="bg-muted rounded-lg p-3 text-sm overflow-x-auto">
                          <code>{step.command}</code>
                        </pre>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Monitor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🪟</span>
                    <CardTitle className="text-base">Monitor (PowerShell as Administrator)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {INSTALL_STEPS.windows.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <pre className="bg-muted rounded-lg p-3 text-sm overflow-x-auto">
                          <code>{step.command}</code>
                        </pre>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Configuration */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Configuration</h2>
              <p className="text-muted-foreground">
                The installer creates a config file at <code className="text-sm bg-muted px-1.5 py-0.5 rounded">~/.vassal/config.yaml</code>.
                Edit this file to customize your node settings:
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                <code>{CONFIG_TEMPLATE}</code>
              </pre>
            </section>

            <Separator />

            {/* Node Registration */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Node Registration</h2>
              <p className="text-muted-foreground">
                After installation, stake $MESH and register your node on-chain:
              </p>
              <div className="space-y-3">
                {REGISTRATION_COMMANDS.map((cmd, i) => (
                  <pre key={i} className="bg-muted rounded-lg p-4 text-sm">
                    <code>{cmd}</code>
                  </pre>
                ))}
              </div>
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> You'll need at least 1,000 $MESH staked for a standard tier node.
                    Higher tiers (Premium: 5,000 $MESH, Enterprise: 25,000 $MESH) offer better rates and priority matching.
                  </p>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Testing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Testing Your Setup</h2>
              <p className="text-muted-foreground">
                Verify your node is correctly configured:
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm">
                <code>vassal node status --verbose</code>
              </pre>
              <p className="text-sm text-muted-foreground">
                Expected output shows: network connectivity, stake balance, registered agents, and SLA compliance status.
                If you see errors, check the <Link href="/docs/troubleshooting" className="text-violet-600 hover:underline">troubleshooting guide</Link>.
              </p>
            </section>

            <Separator />

            {/* Monitoring */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Monitoring and Logs</h2>
              <p className="text-muted-foreground">
                Common commands for monitoring your node:
              </p>
              <div className="space-y-3">
                {MONITOR_COMMANDS.map((item) => (
                  <div key={item.command} className="flex items-center gap-4">
                    <pre className="bg-muted rounded-lg p-3 text-sm">
                      <code>{item.command}</code>
                    </pre>
                    <span className="text-sm text-muted-foreground">— {item.description}</span>
                  </div>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Log Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-mono">
                    ~/.vassal/logs/daemon.log
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Logs are rotated daily. Keep at least 7 days of logs for troubleshooting SLA disputes.
                  </p>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Next Steps */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Next steps</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🤖</div>
                    <h3 className="font-semibold mb-2">Build your first agent</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create an AI agent to run on your node and earn rental income.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/build-first-agent">Get started →</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">📊</div>
                    <h3 className="font-semibold mb-2">View provider dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Monitor earnings, sessions, and node health in the web dashboard.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/provider-home">Open Dashboard →</Link>
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