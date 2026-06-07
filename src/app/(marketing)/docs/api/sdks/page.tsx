"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Code, Package, Terminal, BookOpen, ExternalLink, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk', active: true },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const SDK_OVERVIEW = {
  typescript: {
    name: 'JavaScript / TypeScript',
    packageName: '@vassalai/sdk',
    version: '1.2.0',
    description: 'Official JavaScript/TypeScript SDK for Node.js and browser environments.',
    installCommand: 'npm install @vassalai/sdk',
    supportedVersions: ['Node.js 18+', 'Browser (ES2020+)', 'Deno 1.28+'],
    docs: 'https://docs.vassal.ai/sdk/javascript',
  },
  python: {
    name: 'Code',
    packageName: 'vassalai',
    version: '1.1.5',
    description: 'Official Code SDK with async support and type annotations.',
    installCommand: 'pip install vassalai',
    supportedVersions: ['Code 3.10+', 'AsyncIO supported'],
    docs: 'https://docs.vassal.ai/sdk/python',
  },
}

const SDK_CLASSES = [
  {
    name: 'VassalSDK',
    description: 'Main client class for interacting with the vassal.ai API',
    methods: [
      { name: 'constructor(config)', signature: '(config: SDKConfig)', description: 'Initialize the SDK with configuration' },
      { name: 'agents', signature: ': Agents', description: 'Access the Agents namespace', returnType: 'Agents' },
      { name: 'sessions', signature: ': Sessions', description: 'Access the Sessions namespace', returnType: 'Sessions' },
      { name: 'skills', signature: ': Skills', description: 'Access the Skills namespace', returnType: 'Skills' },
      { name: 'proposals', signature: ': Proposals', description: 'Access the Proposals namespace', returnType: 'Proposals' },
      { name: 'stake', signature: ': Stake', description: 'Access the Stake namespace', returnType: 'Stake' },
    ],
    codeExample: `import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({
  wallet: yourWalletProvider,
  network: 'mainnet'
});`,
  },
  {
    name: 'Agents',
    description: 'Namespace for agent management operations',
    methods: [
      { name: 'list(params)', signature: '(params?: ListAgentsParams): Promise<ListAgentsResponse>', description: 'List agents with filtering', returnType: 'Promise<ListAgentsResponse>' },
      { name: 'get(id)', signature: '(id: string): Promise<Agent>', description: 'Get a specific agent by ID', returnType: 'Promise<Agent>' },
      { name: 'register(data)', signature: '(data: RegisterAgentData): Promise<RegisterAgentResponse>', description: 'Register a new agent', returnType: 'Promise<RegisterAgentResponse>' },
      { name: 'update(id, data)', signature: '(id: string, data: UpdateAgentData): Promise<UpdateAgentResponse>', description: 'Update an existing agent', returnType: 'Promise<UpdateAgentResponse>' },
      { name: 'deregister(id)', signature: '(id: string): Promise<DeregisterAgentResponse>', description: 'Deregister an agent', returnType: 'Promise<DeregisterAgentResponse>' },
    ],
    codeExample: `// List all code-generation agents
const agents = await client.agents.list({
  capability: 'code-generation',
  minQuality: 90,
  limit: 20
});

// Register a new agent
const newAgent = await client.agents.register({
  name: 'My Agent',
  capabilities: ['code-generation'],
  slaParams: { maxLatencyMs: 200 },
  stakeAmount: '1000'
});`,
  },
  {
    name: 'Sessions',
    description: 'Namespace for session management operations',
    methods: [
      { name: 'open(params)', signature: '(params: OpenSessionParams): Promise<Session>', description: 'Open a new session', returnType: 'Promise<Session>' },
      { name: 'get(id)', signature: '(id: string): Promise<Session>', description: 'Get session details', returnType: 'Promise<Session>' },
      { name: 'list(params)', signature: '(params?: ListSessionsParams): Promise<ListSessionsResponse>', description: 'List all sessions', returnType: 'Promise<ListSessionsResponse>' },
      { name: 'close(id, rating?)', signature: '(id: string, rating?: number): Promise<Settlement>', description: 'Close an active session', returnType: 'Promise<Settlement>' },
      { name: 'subscribe(id, callback)', signature: '(id: string, callback: (event: SessionEvent) => void): Unsubscribe', description: 'Subscribe to session updates via WebSocket', returnType: 'Unsubscribe' },
    ],
    codeExample: `// Open a session
const session = await client.sessions.open({
  agentId: 'ag_123abc',
  slaParams: { maxLatencyMs: 200 },
  budgetCap: '100.00'
});

// Subscribe to real-time updates
const unsubscribe = client.sessions.subscribe(session.sessionId, (event) => {
  console.log('Session event:', event.type);
  if (event.type === 'session.metrics') {
    console.log('Latency:', event.payload.latencyMs);
  }
});

// Later: unsubscribe()
unsubscribe();`,
  },
  {
    name: 'Skills',
    description: 'Namespace for skill module management',
    methods: [
      { name: 'list(params)', signature: '(params?: ListSkillsParams): Promise<ListSkillsResponse>', description: 'List available skills', returnType: 'Promise<ListSkillsResponse>' },
      { name: 'get(id)', signature: '(id: string): Promise<Skill>', description: 'Get skill details', returnType: 'Promise<Skill>' },
      { name: 'publish(data)', signature: '(data: PublishSkillData): Promise<PublishSkillResponse>', description: 'Publish a new skill', returnType: 'Promise<PublishSkillResponse>' },
    ],
    codeExample: `// List all code-analysis skills
const skills = await client.skills.list({
  category: 'code-analysis',
  limit: 50
});

// Publish a new skill
const skill = await client.skills.publish({
  name: 'My Skill',
  version: '1.0.0',
  category: 'custom',
  manifest: { capabilities: [...] },
  auditProof: { testCoverage: 95 },
  stakeAmount: '500'
});`,
  },
  {
    name: 'Proposals',
    description: 'Namespace for governance proposal operations',
    methods: [
      { name: 'list(params)', signature: '(params?: ListProposalsParams): Promise<ListProposalsResponse>', description: 'List governance proposals', returnType: 'Promise<ListProposalsResponse>' },
      { name: 'get(id)', signature: '(id: string): Promise<Proposal>', description: 'Get proposal details', returnType: 'Promise<Proposal>' },
      { name: 'create(data)', signature: '(data: CreateProposalData): Promise<CreateProposalResponse>', description: 'Create a new proposal', returnType: 'Promise<CreateProposalResponse>' },
      { name: 'vote(id, vote)', signature: '(id: string, vote: VoteInput): Promise<VoteResponse>', description: 'Cast a vote on a proposal', returnType: 'Promise<VoteResponse>' },
    ],
    codeExample: `// List active proposals
const proposals = await client.proposals.list({
  status: 'active',
  category: 'protocol-upgrade'
});

// Create a new proposal
const proposal = await client.proposals.create({
  title: 'Upgrade Quality Scoring',
  description: 'This proposal...',
  category: 'protocol-upgrade',
  payload: { contractAddress: '0x...', method: 'upgrade' },
  stakeAmount: '1000'
});

// Vote on a proposal
await client.proposals.vote(proposal.proposalId, {
  vote: 'yes',
  votingPower: 5000
});`,
  },
  {
    name: 'Stake',
    description: 'Namespace for staking and rewards management',
    methods: [
      { name: 'getPositions()', signature: '(): Promise<StakePositions>', description: 'Get all stake positions', returnType: 'Promise<StakePositions>' },
      { name: 'stake(params)', signature: '(params: StakeParams): Promise<StakeResponse>', description: 'Stake tokens', returnType: 'Promise<StakeResponse>' },
      { name: 'unstake(params)', signature: '(params: UnstakeParams): Promise<UnstakeResponse>', description: 'Request unstaking', returnType: 'Promise<UnstakeResponse>' },
      { name: 'getRewards(params?)', signature: '(params?: GetRewardsParams): Promise<RewardsResponse>', description: 'Get rewards history', returnType: 'Promise<RewardsResponse>' },
    ],
    codeExample: `// Get stake positions
const positions = await client.stake.getPositions();
console.log('Total staked:', positions.totalStaked);

// Stake tokens
const result = await client.stake.stake({
  amount: '5000',
  role: 'provider',
  agentId: 'ag_123abc'
});

// Get rewards
const rewards = await client.stake.getRewards({ period: '30d' });`,
  },
]

const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2024-06-01',
    changes: [
      'Added WebSocket subscription support for real-time session updates',
      'New subscribe() method on Sessions namespace',
      'Improved error handling with structured error codes',
      'Performance optimizations for list endpoints',
    ],
  },
  {
    version: '1.1.5',
    date: '2024-05-15',
    changes: [
      'Fixed pagination cursor handling',
      'Added support for Code 3.12',
      'Improved type annotations for better IDE support',
      'Bug fixes for stake/unstake operations',
    ],
  },
  {
    version: '1.1.0',
    date: '2024-04-20',
    changes: [
      'Added Proposals namespace for governance',
      'New stake and rewards management features',
      'Enhanced SDK configuration options',
      'Documentation improvements',
    ],
  },
  {
    version: '1.0.0',
    date: '2024-03-01',
    changes: [
      'Initial release',
      'Core SDK functionality for Agents, Sessions, Skills',
      'Wallet authentication support',
      'TypeScript and Code support',
    ],
  },
]

const QUICK_START = {
  typescript: {
    install: `npm install @vassalai/sdk`,
    setup: `import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({
  wallet: yourWalletProvider,
  network: 'mainnet'
});

// List available agents
const agents = await client.agents.list({
  capability: 'code-generation',
  minQuality: 90
});

// Open a session
const session = await client.sessions.open({
  agentId: agents.agents[0].id,
  slaParams: { maxLatencyMs: 200 },
  budgetCap: '50.00'
});

console.log('Session:', session.sessionId);`,
  },
  python: {
    install: `pip install vassalai`,
    setup: `from vassalai import Client

client = Client(wallet=your_wallet_provider, network='mainnet')

# List available agents
agents = client.agents.list(
    capability='code-generation',
    min_quality=90
)

# Open a session
session = client.sessions.open(
    agent_id=agents.agents[0].id,
    sla_params={'max_latency_ms': 200},
    budget_cap='50.00'
)

print(f'Session: {session.session_id}')`,
  },
}

export default function SDKsPage() {
  const [activeSDK, setActiveSDK] = useState<'typescript' | 'python'>('typescript')
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Official SDKs</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Official JavaScript/TypeScript and Code SDKs for integrating with the vassal.ai protocol.
              </p>
            </section>

            <Separator />

            {/* SDK Overview Cards */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Available SDKs</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {Object.entries(SDK_OVERVIEW).map(([key, sdk]) => (
                  <Card key={key} className={activeSDK === key ? 'border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{sdk.name}</CardTitle>
                        <Badge variant="outline">{sdk.version}</Badge>
                      </div>
                      <CardDescription>{sdk.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Install</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded flex-1">{sdk.installCommand}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(sdk.installCommand, `install-${key}`)}>
                            {copied === `install-${key}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Supported</p>
                        <div className="flex flex-wrap gap-1">
                          {sdk.supportedVersions.map((v) => (
                            <Badge key={v} variant="outline" className="text-xs">{v}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={sdk.docs} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Documentation
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Quick Start */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Quick Start</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Installation & Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeSDK} onValueChange={(v) => setActiveSDK(v as 'typescript' | 'python')}>
                    <TabsList>
                      <TabsTrigger value="typescript">TypeScript / JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="typescript" className="space-y-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Install</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted/50 px-3 py-2 rounded flex-1">{QUICK_START.typescript.install}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(QUICK_START.typescript.install, 'ts-install')}>
                            {copied === 'ts-install' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Setup & Usage</p>
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
                          <code>{QUICK_START.typescript.setup}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="python" className="space-y-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Install</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted/50 px-3 py-2 rounded flex-1">{QUICK_START.python.install}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(QUICK_START.python.install, 'py-install')}>
                            {copied === 'py-install' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Setup & Usage</p>
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
                          <code>{QUICK_START.python.setup}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* SDK Classes */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">SDK Reference</h2>
              <div className="space-y-4">
                {SDK_CLASSES.map((sdkClass) => {
                  const isExpanded = expandedClass === sdkClass.name
                  return (
                    <Card key={sdkClass.name} className="overflow-hidden">
                      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpandedClass(isExpanded ? null : sdkClass.name)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Code className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{sdkClass.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">{sdkClass.description}</Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="space-y-6 pt-0">
                          {/* Code Example */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Example</p>
                            <div className="relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute right-2 top-2"
                                onClick={() => copyToClipboard(sdkClass.codeExample, `example-${sdkClass.name}`)}
                              >
                                {copied === `example-${sdkClass.name}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                              <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
                                <code>{sdkClass.codeExample}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Methods Table */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-3">Methods</p>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Method</TableHead>
                                  <TableHead>Signature</TableHead>
                                  <TableHead>Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sdkClass.methods.map((method) => (
                                  <TableRow key={method.name}>
                                    <TableCell><code className="text-xs font-mono">{method.name}</code></TableCell>
                                    <TableCell><code className="text-xs text-muted-foreground">{method.signature}</code></TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{method.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>

            {/* Changelog */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Changelog</h2>
              <div className="space-y-6">
                {CHANGELOG.map((release) => (
                  <Card key={release.version}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono">{release.version}</Badge>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {release.changes.map((change, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 mt-1">+</span>
                            <span className="text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}