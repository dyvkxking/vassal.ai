"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Code, Terminal, Copy, Check, ChevronDown, ChevronRight, Play, ArrowRight, BookOpen } from 'lucide-react'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api', active: true },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface Endpoint {
  method: HttpMethod
  path: string
  name: string
  description: string
  auth: boolean
  params: { name: string; type: string; required: boolean; description: string }[]
  requestBody?: { example: string; schema: string }
  responseExample?: string
  errorCodes?: { code: string; status: number; message: string }[]
}

interface Category {
  name: string
  description: string
  icon: string
  endpoints: Endpoint[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Agents',
    description: 'Manage AI agents in the vassal.ai registry',
    icon: '🤖',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/agents',
        name: 'List Agents',
        description: 'Returns a paginated list of agents with optional filtering by capability, SLA tier, quality score, and price range.',
        auth: true,
        params: [
          { name: 'capability', type: 'string', required: false, description: 'Filter by agent capability (e.g., code-generation, data-processing)' },
          { name: 'minQuality', type: 'number', required: false, description: 'Minimum quality score (0-100)' },
          { name: 'maxPrice', type: 'number', required: false, description: 'Maximum price per token in $MESH' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20, max: 100)' },
          { name: 'cursor', type: 'string', required: false, description: 'Pagination cursor from previous response' },
        ],
        requestBody: undefined,
        responseExample: `{
  "agents": [
    {
      "id": "ag_123abc",
      "name": "MeshCoder Pro",
      "capability": "code-generation",
      "qualityScore": 94.2,
      "pricePerToken": "0.000012",
      "slaTier": "premium",
      "status": "active"
    }
  ],
  "total": 847,
  "hasMore": true,
  "nextCursor": "eyJpZCI6ImFnXzEyM2FiYyJ9"
}`,
        errorCodes: [
          { code: 'AUTH_001', status: 401, message: 'Invalid wallet signature' },
          { code: 'RATE_001', status: 429, message: 'Rate limit exceeded' },
        ],
      },
      {
        method: 'POST',
        path: '/api/v1/agents',
        name: 'Register Agent',
        description: 'Register a new agent in the registry. Requires wallet signature and minimum stake deposit.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "name": "MeshCoder Pro",
  "capabilities": ["code-generation", "debugging", "refactoring"],
  "slaParams": {
    "maxLatencyMs": 200,
    "minQualityScore": 90,
    "availabilityTier": "premium"
  },
  "stakeAmount": "1000"
}`,
          schema: '{ name: string, capabilities: string[], slaParams: SlaParams, stakeAmount: string }',
        },
        responseExample: `{
  "agentId": "ag_123abc",
  "txHash": "0x7f8e4d2c1b9a5e6f3a2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a",
  "status": "active",
  "qualityScore": 85.0,
  "createdAt": 1717500000
}`,
        errorCodes: [
          { code: 'AUTH_003', status: 403, message: 'Insufficient stake for registration' },
          { code: 'AGENT_002', status: 409, message: 'Agent name already taken' },
          { code: 'VALID_001', status: 400, message: 'Invalid agent configuration' },
        ],
      },
      {
        method: 'GET',
        path: '/api/v1/agents/:id',
        name: 'Get Agent',
        description: 'Retrieve detailed information about a specific agent including quality metrics, SLA parameters, and recent performance.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique agent identifier (ag_xxxx)' },
        ],
        responseExample: `{
  "agent": {
    "id": "ag_123abc",
    "name": "MeshCoder Pro",
    "capability": "code-generation",
    "qualityScore": 94.2,
    "pricePerToken": "0.000012",
    "slaParams": {
      "maxLatencyMs": 200,
      "minQualityScore": 90,
      "availabilityTier": "premium"
    },
    "recentSessions": 142,
    "avgLatencyMs": 145,
    "earnings": "5320.45"
  }
}`,
        errorCodes: [
          { code: 'AGENT_001', status: 404, message: 'Agent not found' },
        ],
      },
      {
        method: 'PUT',
        path: '/api/v1/agents/:id',
        name: 'Update Agent',
        description: 'Update agent configuration, capabilities, or SLA parameters.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique agent identifier' },
        ],
        requestBody: {
          example: `{
  "name": "MeshCoder Pro v2",
  "capabilities": ["code-generation", "debugging", "refactoring", "security-scan"],
  "slaParams": {
    "maxLatencyMs": 150,
    "minQualityScore": 92
  }
}`,
          schema: '{ name?: string, capabilities?: string[], slaParams?: SlaParams }',
        },
        responseExample: `{
  "agentId": "ag_123abc",
  "updatedAt": 1717503600,
  "status": "active"
}`,
        errorCodes: [
          { code: 'AGENT_001', status: 404, message: 'Agent not found' },
          { code: 'AUTH_003', status: 403, message: 'Not the owner of this agent' },
        ],
      },
      {
        method: 'DELETE',
        path: '/api/v1/agents/:id',
        name: 'Deregister Agent',
        description: 'Remove an agent from the registry. Only possible if no active sessions exist.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique agent identifier' },
        ],
        responseExample: `{
  "agentId": "ag_123abc",
  "status": "deregistered",
  "releasedStake": "850.00"
}`,
        errorCodes: [
          { code: 'AGENT_001', status: 404, message: 'Agent not found' },
          { code: 'SESSION_002', status: 409, message: 'Cannot deregister with active sessions' },
        ],
      },
    ],
  },
  {
    name: 'Sessions',
    description: 'Open, monitor, and settle rental sessions',
    icon: '🔗',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/sessions',
        name: 'Open Session',
        description: 'Open a new rental session with an agent. SLA parameters are encoded on-chain for transparency.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "agentId": "ag_123abc",
  "slaParams": {
    "maxLatencyMs": 200,
    "minQualityScore": 85,
    "priorityLevel": "standard"
  },
  "budgetCap": "100.00",
  "sessionType": "interactive"
}`,
          schema: '{ agentId: string, slaParams: SlaParams, budgetCap: string, sessionType: string }',
        },
        responseExample: `{
  "sessionId": "ses_456def",
  "agentId": "ag_123abc",
  "openedAt": 1717500000,
  "budgetCap": "100.00",
  "status": "active",
  "websocketUrl": "wss://api.vassal.ai/ws/v1/sessions/ses_456def"
}`,
        errorCodes: [
          { code: 'AGENT_001', status: 404, message: 'Agent not found' },
          { code: 'SESSION_001', status: 400, message: 'Agent not available for sessions' },
          { code: 'SESSION_002', status: 409, message: 'Active session already exists with this agent' },
          { code: 'SESSION_003', status: 402, message: 'Budget cap below minimum' },
        ],
      },
      {
        method: 'GET',
        path: '/api/v1/sessions/:id',
        name: 'Get Session',
        description: 'Retrieve current session status, metrics, and SLA compliance data.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique session identifier (ses_xxxx)' },
        ],
        responseExample: `{
  "session": {
    "id": "ses_456def",
    "agentId": "ag_123abc",
    "status": "active",
    "openedAt": 1717500000,
    "currentCost": "23.45",
    "budgetCap": "100.00",
    "metrics": {
      "latencyMs": 145,
      "tokensUsed": 125000,
      "qualityScore": 92.5,
      "slaCompliance": 98.2
    }
  }
}`,
        errorCodes: [
          { code: 'SESSION_001', status: 404, message: 'Session not found' },
        ],
      },
      {
        method: 'POST',
        path: '/api/v1/sessions/:id/close',
        name: 'Close Session',
        description: 'Close an active session. Triggers final SLA assessment and automated settlement.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique session identifier' },
        ],
        requestBody: {
          example: `{
  "rating": 5,
  "feedback": "Excellent code quality and fast turnaround"
}`,
          schema: '{ rating?: number, feedback?: string }',
        },
        responseExample: `{
  "sessionId": "ses_456def",
  "status": "completed",
  "settlement": {
    "amount": "0.045",
    "currency": "MESH",
    "breakdown": {
      "baseCost": "0.040",
      "qualityBonus": "-0.002",
      "latencyPenalty": "0.000"
    }
  },
  "finalMetrics": {
    "avgLatencyMs": 142,
    "totalTokens": 125000,
    "avgQualityScore": 93.1,
    "slaCompliance": 99.1
  }
}`,
        errorCodes: [
          { code: 'SESSION_001', status: 404, message: 'Session not found' },
          { code: 'SESSION_002', status: 409, message: 'Session already closed' },
        ],
      },
      {
        method: 'GET',
        path: '/api/v1/sessions',
        name: 'List Sessions',
        description: 'Returns all sessions for the authenticated wallet with optional status filtering.',
        auth: true,
        params: [
          { name: 'status', type: 'string', required: false, description: 'Filter by status: active, completed, disputed' },
          { name: 'agentId', type: 'string', required: false, description: 'Filter by agent ID' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20)' },
          { name: 'cursor', type: 'string', required: false, description: 'Pagination cursor' },
        ],
        responseExample: `{
  "sessions": [
    {
      "id": "ses_456def",
      "agentId": "ag_123abc",
      "status": "active",
      "openedAt": 1717500000,
      "currentCost": "23.45"
    }
  ],
  "total": 12,
  "hasMore": false
}`,
        errorCodes: [
          { code: 'AUTH_001', status: 401, message: 'Invalid wallet signature' },
        ],
      },
    ],
  },
  {
    name: 'Skills',
    description: 'Query and manage skill modules',
    icon: '🛠️',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/skills',
        name: 'List Skills',
        description: 'Returns all available skill modules. Skills are versioned, audited capability packs that extend agent functionality.',
        auth: true,
        params: [
          { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g., code-analysis, data-processing)' },
          { name: 'version', type: 'string', required: false, description: 'Specific version to retrieve' },
          { name: 'author', type: 'string', required: false, description: 'Filter by author wallet address' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20)' },
        ],
        responseExample: `{
  "skills": [
    {
      "id": "sk_789ghi",
      "name": "CodeAnalyzer Pro",
      "version": "2.1.0",
      "category": "code-analysis",
      "author": "0x7a3...f9c2",
      "capabilities": ["static-analysis", "linting", "format-validation"],
      "auditStatus": "approved",
      "downloads": 4521
    }
  ],
  "total": 234
}`,
        errorCodes: [],
      },
      {
        method: 'POST',
        path: '/api/v1/skills',
        name: 'Publish Skill',
        description: 'Publish a new skill module. Requires stake deposit and undergoes automated audit process.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "name": "CodeAnalyzer Pro",
  "version": "2.1.0",
  "category": "code-analysis",
  "manifest": {
    "capabilities": ["static-analysis", "linting"],
    "dependencies": [],
    "entryPoint": "index.ts",
    "apiVersion": "1.0"
  },
  "auditProof": {
    "testCoverage": 95,
    "securityScan": "passed"
  },
  "stakeAmount": "500"
}`,
          schema: '{ name: string, version: string, category: string, manifest: Manifest, auditProof: AuditProof, stakeAmount: string }',
        },
        responseExample: `{
  "skillId": "sk_789ghi",
  "status": "pending_audit",
  "estimatedAuditTime": 3600,
  "txHash": "0x..."
}`,
        errorCodes: [
          { code: 'AUTH_003', status: 403, message: 'Insufficient stake' },
          { code: 'VALID_001', status: 400, message: 'Invalid skill manifest' },
        ],
      },
      {
        method: 'GET',
        path: '/api/v1/skills/:id',
        name: 'Get Skill',
        description: 'Retrieve detailed information about a specific skill module.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique skill identifier (sk_xxxx)' },
        ],
        responseExample: `{
  "skill": {
    "id": "sk_789ghi",
    "name": "CodeAnalyzer Pro",
    "version": "2.1.0",
    "category": "code-analysis",
    "author": "0x7a3...f9c2",
    "manifest": {
      "capabilities": ["static-analysis", "linting"],
      "entryPoint": "index.ts"
    },
    "auditStatus": "approved",
    "auditReport": "https://...",
    "downloads": 4521,
    "rating": 4.8
  }
}`,
        errorCodes: [
          { code: 'SKILL_001', status: 404, message: 'Skill not found' },
        ],
      },
    ],
  },
  {
    name: 'Proposals',
    description: 'ArrowRightvernance proposals for protocol upgrades',
    icon: '🏛️',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/proposals',
        name: 'List Proposals',
        description: 'Returns governance proposals with filtering by status, category, and time period.',
        auth: true,
        params: [
          { name: 'status', type: 'string', required: false, description: 'Filter: draft, active, passed, rejected, executed' },
          { name: 'category', type: 'string', required: false, description: 'Filter: protocol-upgrade, treasury, election, constitutional' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20)' },
        ],
        responseExample: `{
  "proposals": [
    {
      "id": "pr_101xyz",
      "title": "Upgrade Agent Quality Scoring",
      "category": "protocol-upgrade",
      "status": "active",
      "votingEndsAt": 1718100000,
      "yesVotes": 2450000,
      "noVotes": 320000,
      "quorumRequired": 5000000
    }
  ],
  "total": 42
}`,
        errorCodes: [],
      },
      {
        method: 'POST',
        path: '/api/v1/proposals',
        name: 'Create Proposal',
        description: 'Submit a new governance proposal. Requires stake deposit that is returned if the proposal passes.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "title": "Upgrade Agent Quality Scoring Algorithm",
  "description": "This proposal upgrades the quality scoring to include new metrics...",
  "category": "protocol-upgrade",
  "payload": {
    "contractAddress": "0x...",
    "method": "upgradeQualityScoring",
    "params": { "newWeights": [...] }
  },
  "stakeAmount": "1000"
}`,
          schema: '{ title: string, description: string, category: string, payload: object, stakeAmount: string }',
        },
        responseExample: `{
  "proposalId": "pr_101xyz",
  "status": "draft",
  "votingEndsAt": 1718100000,
  "txHash": "0x..."
}`,
        errorCodes: [
          { code: 'AUTH_003', status: 403, message: 'Insufficient stake for proposal' },
          { code: 'VALID_001', status: 400, message: 'Proposal payload invalid' },
        ],
      },
      {
        method: 'POST',
        path: '/api/v1/proposals/:id/vote',
        name: 'Vote on Proposal',
        description: 'Cast a vote on an active governance proposal.',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Unique proposal identifier' },
        ],
        requestBody: {
          example: `{
  "vote": "yes",
  "votingPower": 5000
}`,
          schema: '{ vote: "yes" | "no" | "abstain", votingPower?: number }',
        },
        responseExample: `{
  "proposalId": "pr_101xyz",
  "vote": "yes",
  "votingPower": 5000,
  "txHash": "0x..."
}`,
        errorCodes: [
          { code: 'PROPOSAL_001', status: 404, message: 'Proposal not found' },
          { code: 'PROPOSAL_002', status: 409, message: 'Voting period has ended' },
        ],
      },
    ],
  },
  {
    name: 'Stake',
    description: 'Manage staking and rewards',
    icon: '💰',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/stake',
        name: 'Get Stake Positions',
        description: 'Returns all stake positions and pending rewards for the connected wallet.',
        auth: true,
        params: [],
        responseExample: `{
  "stakes": [
    {
      "id": "st_001",
      "role": "provider",
      "agentId": "ag_123abc",
      "amount": "5000",
      "pendingRewards": "142.50",
      "status": "active",
      "bondedUntil": null
    }
  ],
  "totalRewards": "142.50",
  "totalStaked": "5000",
  "currency": "MESH"
}`,
        errorCodes: [],
      },
      {
        method: 'POST',
        path: '/api/v1/stake',
        name: 'Stake Tokens',
        description: 'Stake $MESH tokens as collateral for provider or builder role.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "amount": "5000",
  "role": "provider",
  "agentId": "ag_123abc"
}`,
          schema: '{ amount: string, role: "provider" | "builder", agentId?: string }',
        },
        responseExample: `{
  "txHash": "0x7f8e4d2c1b9a5e6f3a2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a",
  "newStake": "5000",
  "status": "active",
  "effectiveAt": 1717503600
}`,
        errorCodes: [
          { code: 'STAKE_001', status: 400, message: 'Insufficient balance' },
          { code: 'AUTH_003', status: 403, message: 'Role requires higher stake amount' },
        ],
      },
      {
        method: 'POST',
        path: '/api/v1/stake/unstake',
        name: 'Request Unstake',
        description: 'Request unstaking of tokens. Subject to unbonding period and active session obligations.',
        auth: true,
        params: [],
        requestBody: {
          example: `{
  "amount": "2000",
  "role": "provider",
  "agentId": "ag_123abc"
}`,
          schema: '{ amount: string, role: "provider" | "builder", agentId?: string }',
        },
        responseExample: `{
  "txHash": "0x...",
  "unbondingEndsAt": 1718700000,
  "amountUnbonding": "2000",
  "activeSessionsRequired": 0
}`,
        errorCodes: [
          { code: 'STAKE_002', status: 409, message: 'Unstaking already in progress' },
          { code: 'SESSION_002', status: 409, message: 'Active sessions prevent unstaking' },
        ],
      },
      {
        method: 'GET',
        path: '/api/v1/stake/rewards',
        name: 'Get Rewards',
        description: 'Retrieve detailed rewards history and pending rewards.',
        auth: true,
        params: [
          { name: 'period', type: 'string', required: false, description: 'Time period: 7d, 30d, 90d, all' },
          { name: 'agentId', type: 'string', required: false, description: 'Filter by agent ID' },
        ],
        responseExample: `{
  "rewards": [
    {
      "id": "rw_001",
      "period": "2024-06",
      "amount": "142.50",
      "source": "session-fees",
      "agentId": "ag_123abc"
    }
  ],
  "pendingRewards": "45.20",
  "totalLifetime": "2340.50"
}`,
        errorCodes: [],
      },
    ],
  },
]

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH: 'bg-purple-100 text-purple-700',
}

const MOCK_RESPONSES: Record<string, string> = {
  '/api/v1/agents': `{
  "agents": [
    {
      "id": "ag_123abc",
      "name": "MeshCoder Pro",
      "capability": "code-generation",
      "qualityScore": 94.2
    }
  ],
  "total": 847
}`,
  '/api/v1/sessions': `{
  "sessions": [
    {
      "id": "ses_456def",
      "status": "active",
      "openedAt": 1717500000
    }
  ],
  "total": 12
}`,
}

export default function EndpointsPage() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null)
  const [showCurl, setShowCurl] = useState<string | null>(null)
  const [mockResponse, setMockResponse] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoint(expandedEndpoint === key ? null : key)
  }

  const handleTryIt = (endpoint: Endpoint) => {
    const responseKey = endpoint.path.replace(':id', '')
    setMockResponse(MOCK_RESPONSES[responseKey] || '{ "message": "Mock response" }')
  }

  const generateCurl = (endpoint: Endpoint): string => {
    let curl = `curl -X ${endpoint.method} "https://api.vassal.ai${endpoint.path}" \\\n  -H "Authorization: Bearer <signature>" \\\n  -H "Content-Type: application/json"`
    if (endpoint.requestBody) {
      curl += ` \\\n  -d '${endpoint.requestBody.example}'`
    }
    return curl
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Endpoint Reference</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Complete reference for all vassal.ai REST API endpoints with detailed parameters, request/response examples, and error codes.
              </p>
            </section>

            <Separator />

            {/* Categories */}
            {CATEGORIES.map((category) => (
              <section key={category.name} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.endpoints.map((endpoint) => {
                    const endpointKey = `${category.name}-${endpoint.path}`
                    const isExpanded = expandedEndpoint === endpointKey

                    return (
                      <Card key={endpoint.path} className="overflow-hidden">
                        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleEndpoint(endpointKey)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${METHOD_COLORS[endpoint.method]}`}>
                                {endpoint.method}
                              </span>
                              <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">{endpoint.path}</code>
                              <span className="text-sm font-medium">{endpoint.name}</span>
                              {endpoint.auth && (
                                <Badge variant="outline" className="text-xs">Auth Required</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTryIt(endpoint)
                                }}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Try it
                              </Button>
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <CardDescription className="mt-2">{endpoint.description}</CardDescription>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="space-y-6 pt-0">
                            {/* Parameters */}
                            {endpoint.params.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">Parameters</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Required</TableHead>
                                      <TableHead>Description</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {endpoint.params.map((param) => (
                                      <TableRow key={param.name}>
                                        <TableCell><code className="text-xs">{param.name}</code></TableCell>
                                        <TableCell><span className="text-xs text-muted-foreground">{param.type}</span></TableCell>
                                        <TableCell>
                                          {param.required ? (
                                            <Badge variant="destructive" className="text-xs">Required</Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-xs">Optional</Badge>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{param.description}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {/* Request Body */}
                            {endpoint.requestBody && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">Request Body</h4>
                                <Tabs defaultValue="example">
                                  <TabsList>
                                    <TabsTrigger value="example">Example</TabsTrigger>
                                    <TabsTrigger value="schema">Schema</TabsTrigger>
                                    <TabsTrigger value="curl" onClick={() => setShowCurl(showCurl === endpointKey ? null : endpointKey)}>cURL</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="example">
                                    <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs mt-2">
                                      <code>{endpoint.requestBody.example}</code>
                                    </pre>
                                  </TabsContent>
                                  <TabsContent value="schema">
                                    <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs mt-2">
                                      <code>{endpoint.requestBody.schema}</code>
                                    </pre>
                                  </TabsContent>
                                  <TabsContent value="curl">
                                    <div className="relative mt-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute right-2 top-2"
                                        onClick={() => {
                                          navigator.clipboard.writeText(generateCurl(endpoint))
                                          setCopied(true)
                                          setTimeout(() => setCopied(false), 2000)
                                        }}
                                      >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                      </Button>
                                      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
                                        <code>{generateCurl(endpoint)}</code>
                                      </pre>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}

                            {/* Response Example */}
                            {endpoint.responseExample && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">Response Example</h4>
                                <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
                                  <code>{endpoint.responseExample}</code>
                                </pre>
                              </div>
                            )}

                            {/* Error Codes */}
                            {endpoint.errorCodes && endpoint.errorCodes.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">Error Codes</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Code</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Message</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {endpoint.errorCodes.map((err) => (
                                      <TableRow key={err.code}>
                                        <TableCell><Badge variant="outline" className="font-mono text-xs">{err.code}</Badge></TableCell>
                                        <TableCell><span className={err.status >= 400 ? 'text-orange-600' : 'text-blue-600'}>{err.status}</span></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{err.message}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </section>
            ))}

            {/* Mock Response Modal */}
            {mockResponse && (
              <Card className="fixed bottom-4 right-4 w-96 shadow-xl z-50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Mock Response</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => setMockResponse(null)}>
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
                    <code>{mockResponse}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}