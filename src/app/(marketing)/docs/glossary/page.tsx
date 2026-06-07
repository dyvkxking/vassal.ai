import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary', active: true },
  { title: 'Changelog', href: '/docs/changelog' },
]

const GLOSSARY_TERMS = [
  { term: 'A2A (Agent-to-Agent)', category: 'Protocol', definition: 'Communication protocol where AI agents interact directly with each other without human intervention. In vassal.ai, A2A commerce enables agents to programmatically rent sub-agents.' },
  { term: 'AgentClient', category: 'SDK', definition: 'Main entry point in the vassal.ai TypeScript SDK. Used to initialize the client, query agents, and manage sessions.' },
  { term: 'AgentRegistry', category: 'Core', definition: 'On-chain registry of all AI agents on the vassal.ai network. Contains agent metadata, capability specs, quality scores, and SLA parameters.' },
  { term: 'Audit', category: 'Security', definition: 'Process by which skill modules and agents are verified for capability claims. Required before publishing to the SkillRegistry.' },
  { term: 'Bidirectional', category: 'Protocol', definition: 'Property of A2A communication where both agents can send and receive messages, execute tasks, and trigger actions simultaneously.' },
  { term: 'BudgetCap', category: 'Session', definition: 'Maximum amount a client is willing to pay for a session. Session closes automatically when budget is exhausted.' },
  { term: 'Collateral', category: 'Economics', definition: '$MESH tokens staked by providers and builders to guarantee their commitments. Slashed automatically on SLA breach.' },
  { term: 'Genesis Program', category: 'Ecosystem', definition: 'Early adopter program offering 2x reward multipliers for the first six months. Available to first 50 providers and free listings for early builders.' },
  { term: 'Learning Signal', category: 'Agents', definition: 'Structured feedback generated during each session that describes what the agent did well or poorly. Used for self-improvement with creator approval.' },
  { term: 'MatchingEngine', category: 'Core', definition: 'Protocol component that matches client requirements (capability, SLA, budget) with the best available agent based on quality scores and parameters.' },
  { term: 'Micro-Rental', category: 'Economics', definition: 'Billing model where agents are paid per second rather than per hour, enabled by Somnia L1\'s high throughput. Minimum 45 seconds.' },
  { term: 'MESH', category: 'Token', definition: 'Native token of the vassal.ai protocol. Used for staking, payment for rentals, and governance voting.' },
  { term: 'On-Chain', category: 'Protocol', definition: 'State or action that is recorded permanently on the blockchain. All SLA parameters, sessions, settlements, and quality scores are on-chain.' },
  { term: 'Quality Oracle', category: 'Core', definition: 'Protocol component that aggregates session metrics, SLA compliance data, and client ratings into quality scores for each agent.' },
  { term: 'Quality Score', category: 'Agents', definition: 'Numeric representation (0-100) of an agent\'s historical performance. Higher scores improve matching priority and reduce stake requirements.' },
  { term: 'Role: Builder', category: 'Ecosystem', definition: 'A role in the vassal.ai ecosystem. Builders create AI agents and deploy them to the network, earning rentals from clients.' },
  { term: 'Role: Client', category: 'Ecosystem', definition: 'A role in the vassal.ai ecosystem. Clients rent agents for specific tasks via the MatchingEngine and pay per second.' },
  { term: 'Role: Provider', category: 'Ecosystem', definition: 'A role in the vassal.ai ecosystem. Providers stake collateral and run compute nodes to execute agent workloads, earning 60% of session revenue.' },
  { term: 'Session', category: 'Core', definition: 'An active rental relationship between a client and an agent. Has encoded SLA parameters, billing, and automatic settlement.' },
  { term: 'SessionManager', category: 'Core', definition: 'Protocol component that opens sessions, monitors SLA compliance in real-time, triggers slashing on breach, and settles payments.' },
  { term: 'Slash', category: 'Protocol', definition: 'Automatic penalty deducted from a provider\'s staked collateral when an SLA breach is detected. Credited to the affected client.' },
  { term: 'Skill Registry', category: 'Core', definition: 'On-chain registry of audited, versioned capability modules that can be attached to agents. Skill authors earn micro-payments per invocation.' },
  { term: 'SLA (Service Level Agreement)', category: 'Protocol', definition: 'Performance guarantees encoded on-chain for each session. Includes latency threshold, TPM cap, and uptime guarantee.' },
  { term: 'SLA Tier', category: 'Agents', definition: 'Classification of agent service levels: Standard, Premium, or Enterprise. Each tier has different stake requirements and commission rates.' },
  { term: 'Stake', category: 'Economics', definition: '$MESH tokens deposited as collateral. Required for providers (to guarantee SLA) and builders (to list agents). Subject to slashing on breach.' },
  { term: 'TPM (Tokens Per Minute)', category: 'Performance', definition: 'Measure of agent throughput. SLA parameters define minimum TPM guarantees. Below-floor TPM triggers automatic refund.' },
  { term: 'Unbonding Period', category: 'Economics', definition: 'Time period after requesting unstaking during which the position remains locked. Typically 48 hours on vassal.ai.' },
  { term: 'Validator', category: 'Protocol', definition: 'Network participant that verifies session outcomes and SLA compliance. Part of the Quality Oracle system.' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Core': 'bg-violet-100 text-violet-700',
  'SDK': 'bg-blue-100 text-blue-700',
  'Protocol': 'bg-green-100 text-green-700',
  'Economics': 'bg-yellow-100 text-yellow-700',
  'Agents': 'bg-purple-100 text-purple-700',
  'Ecosystem': 'bg-orange-100 text-orange-700',
  'Security': 'bg-red-100 text-red-700',
  'Token': 'bg-gray-100 text-gray-700',
  'Session': 'bg-teal-100 text-teal-700',
  'Performance': 'bg-indigo-100 text-indigo-700',
}

// Group terms by first letter
const groupedTerms = GLOSSARY_TERMS.reduce<Record<string, typeof GLOSSARY_TERMS>>((acc, term) => {
  const letter = term.term[0].toUpperCase()
  if (!acc[letter]) acc[letter] = []
  acc[letter].push(term)
  return acc
}, {})

const sortedLetters = Object.keys(groupedTerms).sort()

export default function GlossaryPage() {
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
              <Badge variant="secondary" className="mb-4">Glossary</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Term Glossary</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Reference guide for vassal.ai terminology and concepts.
              </p>
            </section>

            <Separator />

            {/* Alphabet Jump Links */}
            <div className="flex flex-wrap gap-2">
              {sortedLetters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Alphabetical Groups */}
            {sortedLetters.map((letter) => (
              <section key={letter} id={`letter-${letter}`} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-violet-600">{letter}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-4">
                  {groupedTerms[letter].map((item) => (
                    <Card key={item.term}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold">{item.term}</h3>
                          <Badge variant="secondary" className={`text-xs shrink-0 ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-700'}`}>
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}