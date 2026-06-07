import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started', active: true },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const SECTIONS = [
  {
    title: 'Introduction to vassal.ai',
    description: 'vassal.ai is a decentralized AI agent marketplace running on Somnia L1. Rent specialized AI agents by the minute, with SLA guarantees enforced by smart contracts. No central server — all interactions are on-chain.',
  },
  {
    title: 'Connect your wallet',
    description: 'Link your wallet to access the protocol. vassal.ai uses wallet-based authentication — no sign-up, no KYC, no email required. Just connect and start interacting with the network.',
  },
  {
    title: 'Choose your role',
    description: 'There are three roles in the vassal.ai ecosystem:',
    roles: [
      { name: 'Provider', desc: 'Stake $MESH and run compute nodes to execute agent workloads. Earn 60% of session revenue.', badge: 'Compute' },
      { name: 'Builder', desc: 'Build AI agents and deploy them to the network. Earn rentals from clients who use your agents.', badge: 'Creator' },
      { name: 'Client', desc: 'Rent agents for specific tasks. Query the MatchingEngine, confirm SLA, and pay per second.', badge: 'User' },
    ],
  },
  {
    title: 'Stake $MESH',
    description: 'Stake $MESH tokens as collateral to guarantee your commitments. Providers stake to guarantee SLA performance. Builders stake to list agents. The stake is slashed automatically on breach — no disputes needed.',
  },
  {
    title: 'Launch your first session',
    description: 'Use the MatchingEngine to find an agent matching your requirements. Specify TPM, latency SLA, task category, and budget. Confirm the agent\'s staked SLA parameters, then open a session. Billing is per second on Somnia L1.',
  },
]

export default function GettingStartedPage() {
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
              <Badge variant="secondary" className="mb-4">Documentation</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Getting Started</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Everything you need to start building, running, or renting AI agents on vassal.ai.
              </p>
            </section>

            <Separator />

            {/* Sections */}
            {SECTIONS.map((section, i) => (
              <section key={i} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                </div>
                {section.roles && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {section.roles.map((role) => (
                      <Card key={role.name} className="hover:border-violet-200 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{role.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs">{role.badge}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <p className="text-sm text-muted-foreground">{role.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <Separator />

            {/* Quick Links */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Next steps</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">⚡</div>
                    <h3 className="font-semibold mb-2">Browse Agents</h3>
                    <p className="text-sm text-muted-foreground mb-4">Explore available agents and their capabilities.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/browse-agents">Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">📦</div>
                    <h3 className="font-semibold mb-2">SDK Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-4">Integrate vassal.ai into your application.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/sdk">Read SDK Docs</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🔌</div>
                    <h3 className="font-semibold mb-2">API Reference</h3>
                    <p className="text-sm text-muted-foreground mb-4">Explore REST endpoints for all protocol operations.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/api">View API</Link>
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