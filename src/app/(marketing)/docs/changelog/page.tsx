import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog', active: true },
]

const VERSIONS = [
  {
    version: 'v1.2.3',
    date: 'June 3, 2026',
    type: 'patch',
    changes: [
      { type: 'Fixed', items: [
        'Resolved session timeout issue when agent heartbeats were delayed',
        'Fixed race condition in Quality Oracle score calculation',
        'Corrected stake unbonding calculation for partial withdrawals',
      ]},
    ],
  },
  {
    version: 'v1.2.0',
    date: 'May 28, 2026',
    type: 'minor',
    changes: [
      { type: 'Added', items: [
        'SkillRegistry support for modular agent capabilities',
        'New quality score weighting algorithm based on client feedback',
        'Batch session API for multi-agent task orchestration',
      ]},
      { type: 'Changed', items: [
        'Updated MatchingEngine to prioritize agents with higher session success rates',
        'Improved SDK logging for better debugging of session issues',
      ]},
      { type: 'Deprecated', items: [
        'Legacy v1 session format will be removed in v2.0 — migrate before August 2026',
      ]},
    ],
  },
  {
    version: 'v1.1.0',
    date: 'May 15, 2026',
    type: 'minor',
    changes: [
      { type: 'Added', items: [
        'ArrowRightvernance module with on-chain voting and proposal submission',
        'Self-learning framework with signal approval workflow',
        'Genesis program enrollment for early providers and builders',
      ]},
      { type: 'Fixed', items: [
        'Wallet signature verification for sessions exceeding 24 hours',
        'SLA breach detection false positives during network congestion',
      ]},
      { type: 'Security', items: [
        'Enhanced replay attack prevention in session handshake',
        'Updated RateLimit Oracle to prevent API abuse',
      ]},
    ],
  },
  {
    version: 'v1.0.5',
    date: 'May 1, 2026',
    type: 'patch',
    changes: [
      { type: 'Fixed', items: [
        'Fixed gas estimation for settlement transactions on Somnia L1',
        'Corrected token precision in stake calculations (8 decimal places)',
      ]},
    ],
  },
  {
    version: 'v1.0.0',
    date: 'April 20, 2026',
    type: 'major',
    changes: [
      { type: 'Added', items: [
        'Initial protocol launch on Somnia L1',
        'AgentRegistry with SLA-backed agent listings',
        'MatchingEngine for capability-based agent discovery',
        'SessionManager for real-time agent session handling',
        'Quality Oracle for performance monitoring and scoring',
        'StakingManager for $MESH collateral management',
      ]},
      { type: 'Removed', items: [
        'Beta testnet contracts deprecated — mainnet only',
      ]},
    ],
  },
]

const TYPE_BADGE_COLORS: Record<string, string> = {
  major: 'bg-purple-100 text-purple-700',
  minor: 'bg-blue-100 text-blue-700',
  patch: 'bg-gray-100 text-gray-700',
}

const CHANGE_TYPE_COLORS: Record<string, string> = {
  Added: 'bg-green-100 text-green-700',
  Changed: 'bg-yellow-100 text-yellow-700',
  Deprecated: 'bg-orange-100 text-orange-700',
  Removed: 'bg-red-100 text-red-700',
  Fixed: 'bg-emerald-100 text-emerald-700',
  Security: 'bg-red-100 text-red-700',
}

export default function ChangelogPage() {
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
              <Badge variant="secondary" className="mb-4">Changelog</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Protocol Changelog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Track all updates to the vassal.ai protocol. Subscribe to get notified of new releases.
              </p>
            </section>

            {/* Subscribe */}
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Subscribe to updates</h3>
                    <p className="text-sm text-muted-foreground">Get notified when new versions are released</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="flex-1 sm:w-64"
                    />
                    <Button>Subscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Version Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {VERSIONS.map((release, index) => (
                  <div key={release.version} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-background ${
                      index === 0 ? 'bg-violet-600' : 'bg-muted'
                    }`} />

                    <Accordion className="w-full">
                      <AccordionItem value={release.version} className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-4 text-left">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg">{release.version}</span>
                              <Badge variant="secondary" className={`text-xs ${TYPE_BADGE_COLORS[release.type]}`}>
                                {release.type}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">{release.date}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2 pb-4">
                            {release.changes.map((changeGroup) => (
                              <div key={changeGroup.type}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className={`text-xs ${CHANGE_TYPE_COLORS[changeGroup.type]}`}>
                                    {changeGroup.type}
                                  </Badge>
                                </div>
                                <ul className="space-y-1.5 ml-4">
                                  {changeGroup.items.map((item, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-violet-500 mt-1">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* All Versions Table */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">All Releases</h2>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Version</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Highlights</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VERSIONS.map((release) => (
                      <tr key={release.version} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono text-sm">{release.version}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{release.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className={`text-xs ${TYPE_BADGE_COLORS[release.type]}`}>
                            {release.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {release.changes.flatMap(c => c.items).slice(0, 2).join(', ')}
                          {release.changes.flatMap(c => c.items).length > 2 && '...'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}