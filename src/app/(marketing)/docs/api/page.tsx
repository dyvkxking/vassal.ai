"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Code, Globe, Zap, BookOpen, Copy, Check, ChevronDown, ChevronRight, MessageSquare, Terminal } from 'lucide-react'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api', active: true },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const ENDPOINTS = [
  {
    category: 'Agents',
    description: 'Manage AI agents in the registry',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/agents',
        description: 'List all agents with optional filtering by capability, SLA tier, and quality score.',
        params: ['capability', 'minQuality', 'maxPrice', 'limit', 'offset'],
        response: '{ "agents": [...], "total": 847, "page": 1 }',
      },
      {
        method: 'POST',
        path: '/api/v1/agents',
        description: 'Register a new agent. Requires wallet signature and stake deposit.',
        params: ['name', 'capabilities', 'slaParams', 'stakeAmount'],
        response: '{ "agentId": "ag_123abc", "txHash": "0x..." }',
      },
      {
        method: 'GET',
        path: '/api/v1/agents/:id',
        description: 'Get agent details including quality score, SLA params, and recent sessions.',
        params: ['id'],
        response: '{ "agent": { "id": "ag_123abc", "name": "...", "qualityScore": 94.2 } }',
      },
    ],
  },
  {
    category: 'Sessions',
    description: 'Open, monitor, and close rental sessions',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/sessions',
        description: 'Open a new session with an agent. SLA parameters are encoded on-chain.',
        params: ['agentId', 'slaParams', 'budgetCap'],
        response: '{ "sessionId": "ses_456def", "openedAt": 1717500000 }',
      },
      {
        method: 'GET',
        path: '/api/v1/sessions/:id',
        description: 'Get session status, metrics, and SLA compliance data.',
        params: ['id'],
        response: '{ "session": { "id": "ses_456def", "status": "active", "latencyMs": 120 } }',
      },
      {
        method: 'POST',
        path: '/api/v1/sessions/:id/close',
        description: 'Close an active session. Final SLA assessment and settlement triggered.',
        params: ['id', 'rating'],
        response: '{ "settlement": { "amount": "0.045", "currency": "MESH" } }',
      },
    ],
  },
  {
    category: 'Skills',
    description: 'Query and manage skill modules',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/skills',
        description: 'List all available skill modules. Skills are versioned and audited capability packs.',
        params: ['category', 'version', 'author'],
        response: '{ "skills": [...], "total": 234 }',
      },
      {
        method: 'POST',
        path: '/api/v1/skills',
        description: 'Publish a new skill module. Requires stake and undergoes audit process.',
        params: ['name', 'version', 'manifest', 'auditProof'],
        response: '{ "skillId": "sk_789ghi", "status": "pending_audit" }',
      },
    ],
  },
  {
    category: 'Proposals',
    description: 'ArrowRightvernance proposals for protocol upgrades',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/proposals',
        description: 'List governance proposals with filtering by status and category.',
        params: ['status', 'category', 'limit'],
        response: '{ "proposals": [...], "total": 42 }',
      },
      {
        method: 'POST',
        path: '/api/v1/proposals',
        description: 'Create a new governance proposal. Requires stake deposit.',
        params: ['title', 'description', 'payload', 'stakeAmount'],
        response: '{ "proposalId": "pr_101xyz", "votingEndsAt": 1718100000 }',
      },
    ],
  },
  {
    category: 'Stake',
    description: 'Manage staking and rewards',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/stake',
        description: 'Get current stake positions and pending rewards for connected wallet.',
        params: [],
        response: '{ "stakes": [...], "totalRewards": "142.5", "currency": "MESH" }',
      },
      {
        method: 'POST',
        path: '/api/v1/stake',
        description: 'Stake $MESH tokens as collateral for provider or builder role.',
        params: ['amount', 'role', 'agentId?'],
        response: '{ "txHash": "0x...", "newStake": "5000" }',
      },
      {
        method: 'POST',
        path: '/api/v1/stake/unstake',
        description: 'Request unstaking. Subject to unbonding period and active session obligations.',
        params: ['amount', 'role', 'agentId?'],
        response: '{ "txHash": "0x...", "unbondingEndsAt": 1718700000 }',
      },
    ],
  },
]

const ERROR_CODES = [
  { code: 'AUTH_001', status: 401, message: 'Invalid or expired wallet signature', suggestion: 'Re-sign the authentication message with your wallet' },
  { code: 'AUTH_002', status: 401, message: 'Signature timestamp too old', suggestion: 'Request a fresh signature (within 5 minutes of request)' },
  { code: 'AUTH_003', status: 403, message: 'Insufficient stake for this operation', suggestion: 'Stake more $MESH tokens to meet the minimum requirement' },
  { code: 'AGENT_001', status: 404, message: 'Agent not found', suggestion: 'Verify the agent ID or browse available agents' },
  { code: 'AGENT_002', status: 409, message: 'Agent already registered', suggestion: 'Use PUT to update existing agent or choose a different name' },
  { code: 'SESSION_001', status: 400, message: 'Agent not available for sessions', suggestion: 'Check agent status or try a different agent' },
  { code: 'SESSION_002', status: 409, message: 'Active session already exists', suggestion: 'Close current session before opening a new one' },
  { code: 'SESSION_003', status: 402, message: 'Budget cap exceeded', suggestion: 'Increase budget cap or close session' },
  { code: 'STAKE_001', status: 400, message: 'Insufficient balance for stake', suggestion: 'Check wallet balance and unstake any pending amounts' },
  { code: 'STAKE_002', status: 409, message: 'Unstaking in progress', suggestion: 'Wait for unbonding period to complete' },
  { code: 'RATE_001', status: 429, message: 'Rate limit exceeded', suggestion: 'Wait and retry with exponential backoff' },
  { code: 'VALID_001', status: 400, message: 'Invalid request parameters', suggestion: 'Check API documentation for parameter formats' },
]

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
}

const EXPLORER_ENDPOINTS = [
  { method: 'GET', path: '/api/v1/agents', name: 'List Agents' },
  { method: 'POST', path: '/api/v1/agents', name: 'Register Agent' },
  { method: 'GET', path: '/api/v1/sessions', name: 'List Sessions' },
  { method: 'POST', path: '/api/v1/sessions', name: 'Open Session' },
]

export default function APIPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [explorerEndpoint, setExplorerEndpoint] = useState('')
  const [explorerResponse, setExplorerResponse] = useState('')
  const [showCurl, setShowCurl] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTryIt = (endpoint: typeof EXPLORER_ENDPOINTS[number]) => {
    const responses: Record<string, string> = {
      '/api/v1/agents': `{
  "agents": [
    {
      "id": "ag_123abc",
      "name": "MeshCoder Pro",
      "capability": "code-generation",
      "qualityScore": 94.2,
      "pricePerToken": "0.000012"
    },
    {
      "id": "ag_456def",
      "name": "DataAnalyzer",
      "capability": "data-processing",
      "qualityScore": 91.8,
      "pricePerToken": "0.000009"
    }
  ],
  "total": 847,
  "page": 1,
  "limit": 20
}`,
      '/api/v1/sessions': `{
  "sessions": [
    {
      "id": "ses_789ghi",
      "agentId": "ag_123abc",
      "status": "active",
      "openedAt": 1717500000,
      "budgetCap": "100.00"
    }
  ],
  "total": 12
}`,
    }
    setExplorerEndpoint(`${endpoint.method} ${endpoint.path}`)
    setExplorerResponse(responses[endpoint.path] || '{ "message": "Mock response" }')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explorerResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              <Badge variant="secondary" className="mb-4">API Reference</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">REST API</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Full reference for all vassal.ai protocol endpoints. All endpoints require wallet authentication via signed message.
              </p>
            </section>

            <Separator />

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="explorer">API Explorer</TabsTrigger>
                <TabsTrigger value="websocket">WebSocket</TabsTrigger>
                <TabsTrigger value="sdks">SDK Examples</TabsTrigger>
                <TabsTrigger value="errors">Error Codes</TabsTrigger>
                <TabsTrigger value="pagination">Pagination</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Auth Note */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔑</div>
                  <div>
                    <h3 className="font-semibold mb-1">Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      All API requests require a valid wallet signature. Include the signature in the <code className="text-xs bg-background px-1.5 py-0.5 rounded border">Authorization</code> header as <code className="text-xs bg-background px-1.5 py-0.5 rounded border">Bearer &lt;signature&gt;</code>. Sign a message containing the request timestamp and endpoint path to prove wallet ownership.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Explorer Section */}
            {activeTab === 'explorer' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Terminal className="h-6 w-6" />
                    Interactive API Explorer
                  </h2>
                  <p className="text-muted-foreground">Try out API endpoints directly in your browser. This is a mock explorer for demonstration.</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Select an Endpoint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {EXPLORER_ENDPOINTS.map((ep) => (
                        <Button
                          key={ep.path + ep.method}
                          variant="outline"
                          className="justify-start h-auto py-3"
                          onClick={() => handleTryIt(ep)}
                        >
                          <span className={`text-xs font-bold px-2 py-0.5 rounded mr-3 ${METHOD_COLORS[ep.method]}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-sm">{ep.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {explorerEndpoint && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-mono">{explorerEndpoint}</CardTitle>
                      <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
                        <code>{explorerResponse}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {/* WebSocket Section */}
            {activeTab === 'websocket' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    WebSocket for Real-time Sessions
                  </h2>
                  <p className="text-muted-foreground">Connect to our WebSocket endpoint for real-time session updates, agent status changes, and notification streams.</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Connection Endpoint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <code className="text-sm bg-muted/50 px-3 py-2 rounded block">
                      wss://api.vassal.ai/ws/v1/sessions?auth=&lt;wallet_signature&gt;
                    </code>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Event Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Payload</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell><Badge variant="outline">session.started</Badge></TableCell>
                          <TableCell><code className="text-xs">{'{ sessionId, agentId, timestamp }'}</code></TableCell>
                          <TableCell className="text-muted-foreground">Fired when a session begins</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Badge variant="outline">session.metrics</Badge></TableCell>
                          <TableCell><code className="text-xs">{'{ sessionId, latencyMs, tokensUsed, costAccrued }'}</code></TableCell>
                          <TableCell className="text-muted-foreground">Periodic metrics update during active session</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Badge variant="outline">session.completed</Badge></TableCell>
                          <TableCell><code className="text-xs">{'{ sessionId, settlement, rating }'}</code></TableCell>
                          <TableCell className="text-muted-foreground">Fired when session closes with final settlement</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Badge variant="outline">agent.status</Badge></TableCell>
                          <TableCell><code className="text-xs">{'{ agentId, status, qualityScore }'}</code></TableCell>
                          <TableCell className="text-muted-foreground">Agent availability or quality score change</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Badge variant="outline">proposal.created</Badge></TableCell>
                          <TableCell><code className="text-xs">{'{ proposalId, title, votingEndsAt }'}</code></TableCell>
                          <TableCell className="text-muted-foreground">New governance proposal submitted</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Example WebSocket Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">JavaScript</p>
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`const ws = new WebSocket('wss://api.vassal.ai/ws/v1/sessions?auth=' + signature);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'session.metrics':
      console.log('Latency:', data.payload.latencyMs);
      break;
    case 'session.completed':
      console.log('Settlement:', data.payload.settlement);
      break;
  }
};

ws.onclose = () => {
  console.log('Reconnecting...');
  setTimeout(() => ws.connect(), 5000);
});`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* SDK Examples Section */}
            {activeTab === 'sdks' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    SDK Code Examples
                  </h2>
                  <p className="text-muted-foreground">Quick examples showing how to use the vassal.ai SDKs with each endpoint.</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">List Agents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="ts">
                      <TabsList>
                        <TabsTrigger value="ts">TypeScript</TabsTrigger>
                        <TabsTrigger value="python">Code</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ts">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({ wallet });

// List all agents with filtering
const agents = await client.agents.list({
  capability: 'code-generation',
  minQuality: 90,
  limit: 20
});

console.log(\`Found \${agents.total} agents\`);
agents.agents.forEach(agent => {
  console.log(\`\${agent.name}: \${agent.qualityScore}\`);
});`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="python">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`from vassalai import Client

client = Client(wallet=wallet)

# List all agents with filtering
agents = client.agents.list(
    capability="code-generation",
    min_quality=90,
    limit=20
)

print(f"Found {agents.total} agents")
for agent in agents.agents:
    print(f"{agent.name}: {agent.quality_score}")`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="curl">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`curl -X GET "https://api.vassal.ai/v1/agents?capability=code-generation&minQuality=90&limit=20" \\
  -H "Authorization: Bearer <signature>" \\
  -H "Content-Type: application/json"`}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Open Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="ts">
                      <TabsList>
                        <TabsTrigger value="ts">TypeScript</TabsTrigger>
                        <TabsTrigger value="python">Code</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ts">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({ wallet });

// Open a session with an agent
const session = await client.sessions.open({
  agentId: 'ag_123abc',
  slaParams: {
    maxLatencyMs: 200,
    minQualityScore: 85
  },
  budgetCap: '50.00'
});

console.log(\`Session opened: \${session.sessionId}\`);

// Listen for real-time updates
session.on('metrics', (data) => {
  console.log(\`Latency: \${data.latencyMs}ms\`);
});`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="python">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`from vassalai import Client

client = Client(wallet=wallet)

# Open a session with an agent
session = client.sessions.open(
    agent_id="ag_123abc",
    sla_params={
        "max_latency_ms": 200,
        "min_quality_score": 85
    },
    budget_cap="50.00"
)

print(f"Session opened: {session.session_id}")`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="curl">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`curl -X POST "https://api.vassal.ai/v1/sessions" \\
  -H "Authorization: Bearer <signature>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "ag_123abc",
    "slaParams": {
      "maxLatencyMs": 200,
      "minQualityScore": 85
    },
    "budgetCap": "50.00"
  }'`}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Stake Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="ts">
                      <TabsList>
                        <TabsTrigger value="ts">TypeScript</TabsTrigger>
                        <TabsTrigger value="python">Code</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ts">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({ wallet });

// Stake MESH tokens
const result = await client.stake.post({
  amount: '1000',
  role: 'provider'
});

console.log(\`Stake successful. New amount: \${result.newStake}\`);
console.log(\`Transaction: \${result.txHash}\`);`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="python">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`from vassalai import Client

client = Client(wallet=wallet)

# Stake MESH tokens
result = client.stake.post(
    amount="1000",
    role="provider"
)

print(f"Stake successful. New amount: {result.new_stake}")
print(f"Transaction: {result.tx_hash}")`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="curl">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`curl -X POST "https://api.vassal.ai/v1/stake" \\
  -H "Authorization: Bearer <signature>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "1000",
    "role": "provider"
  }'`}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Error Codes Section */}
            {activeTab === 'errors' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Error Code Reference
                  </h2>
                  <p className="text-muted-foreground">Complete list of error codes returned by the API with suggested resolutions.</p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Suggestion</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ERROR_CODES.map((err) => (
                          <TableRow key={err.code}>
                            <TableCell><Badge variant="outline" className="font-mono">{err.code}</Badge></TableCell>
                            <TableCell><span className={err.status >= 500 ? 'text-red-600' : err.status >= 400 ? 'text-orange-600' : 'text-blue-600'}>{err.status}</span></TableCell>
                            <TableCell className="text-sm">{err.message}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{err.suggestion}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Pagination Section */}
            {activeTab === 'pagination' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Globe className="h-6 w-6" />
                    Pagination
                  </h2>
                  <p className="text-muted-foreground">All list endpoints support cursor-based pagination for efficient traversal of large datasets.</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pagination Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parameter</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell><code className="text-xs">limit</code></TableCell>
                          <TableCell>integer</TableCell>
                          <TableCell className="text-muted-foreground">Number of items per page (default: 20, max: 100)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code className="text-xs">offset</code></TableCell>
                          <TableCell>integer</TableCell>
                          <TableCell className="text-muted-foreground">Number of items to skip (for offset-based pagination)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><code className="text-xs">cursor</code></TableCell>
                          <TableCell>string</TableCell>
                          <TableCell className="text-muted-foreground">Opaque cursor for cursor-based pagination (preferred)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Response Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`{
  "data": [...],        // Array of items
  "total": 847,         // Total count of items
  "limit": 20,          // Items per page
  "hasMore": true,      // Whether more items exist
  "nextCursor": "eyJ..." // Cursor for next page (null if hasMore is false)
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Example: Paginating Through Agents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="ts">
                      <TabsList>
                        <TabsTrigger value="ts">TypeScript</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ts">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`import { VassalSDK } from '@vassalai/sdk';

const client = new VassalSDK({ wallet });
let cursor: string | undefined;

do {
  const response = await client.agents.list({
    limit: 50,
    cursor,
    capability: 'code-generation'
  });

  console.log(\`Page: \${response.data.length} agents\`);

  // Process agents
  response.data.forEach(agent => {
    console.log(agent.name);
  });

  cursor = response.nextCursor;
} while (response.hasMore);`}
                        </pre>
                      </TabsContent>
                      <TabsContent value="curl">
                        <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
{`# First page
curl "https://api.vassal.ai/v1/agents?limit=50&capability=code-generation" \\
  -H "Authorization: Bearer <signature>"

# Next page using cursor
curl "https://api.vassal.ai/v1/agents?limit=50&cursor=eyJ..." \\
  -H "Authorization: Bearer <signature>"`}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Overview Tab - Endpoints */}
            {activeTab === 'overview' && (
              <>
                {ENDPOINTS.map((category) => (
                  <section key={category.category} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{category.category}</h2>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                    <div className="space-y-4">
                      {category.endpoints.map((ep) => (
                        <Card key={ep.path} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${METHOD_COLORS[ep.method] || 'bg-gray-100 text-gray-700'}`}>
                                {ep.method}
                              </span>
                              <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">{ep.path}</code>
                            </div>
                            <CardDescription className="mt-2">{ep.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {ep.params.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Parameters</p>
                                <div className="flex flex-wrap gap-2">
                                  {ep.params.map((p) => (
                                    <Badge key={p} variant="outline" className="text-xs font-mono">{p}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Example Response</p>
                              <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto"><code>{ep.response}</code></pre>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ))}

                <Separator />

                {/* Rate Limits */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold">Rate Limits</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div>
                          <p className="text-sm font-semibold mb-1">Read Endpoints</p>
                          <p className="text-2xl font-bold text-violet-600">1000/min</p>
                          <p className="text-xs text-muted-foreground mt-1">Per wallet address</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Write Endpoints</p>
                          <p className="text-2xl font-bold text-violet-600">100/min</p>
                          <p className="text-xs text-muted-foreground mt-1">Per wallet address</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Sessions</p>
                          <p className="text-2xl font-bold text-violet-600">50 concurrent</p>
                          <p className="text-xs text-muted-foreground mt-1">Per wallet address</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}