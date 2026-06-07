"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// ---- Mock Dependency Data ----
const SKILL_INFO = {
  id: 'skill-web3-read',
  name: 'Web3 Read',
  version: '2.1.0',
  status: 'approved',
}

// Agents using this skill
const AGENTS_USING = [
  {
    id: 'agent-001',
    name: 'DeFi Pulse Scanner',
    category: 'defi',
    version: '2.4.1',
    invocations: 12847,
    addedAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'agent-003',
    name: 'DAO Proposal Digest',
    category: 'dao',
    version: '3.1.2',
    invocations: 8923,
    addedAt: Date.now() - 45 * 86400000,
  },
  {
    id: 'agent-005',
    name: 'Token Price Oracle',
    category: 'defi',
    version: '5.2.0',
    invocations: 51204,
    addedAt: Date.now() - 30 * 86400000,
  },
]

// Skills this skill depends on
const DEPENDS_ON = [
  {
    id: 'skill-data-processor',
    name: 'Data Processor',
    version: '1.2.0',
    status: 'approved',
    description: 'Provides data normalization and transformation utilities.',
  },
]

// Skill that depend on this skill
const USED_BY = [
  {
    id: 'skill-onchain-reads',
    name: 'On-Chain Reads',
    version: '3.0.0',
    status: 'approved',
    description: 'Aggregates on-chain data from multiple sources.',
  },
  {
    id: 'skill-block-explorer',
    name: 'Block Explorer',
    version: '2.1.0',
    status: 'approved',
    description: 'Block and transaction browser utilities.',
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function DependencyNode({
  name,
  version,
  type,
  description,
}: {
  name: string
  version: string
  type: 'this-skill' | 'depends-on' | 'used-by'
  description?: string
}) {
  const borderColors = {
    'this-skill': 'border-primary',
    'depends-on': 'border-blue-500',
    'used-by': 'border-emerald-500',
  }

  const bgColors = {
    'this-skill': 'bg-primary/5',
    'depends-on': 'bg-blue-500/5',
    'used-by': 'bg-emerald-500/5',
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${borderColors[type]} ${bgColors[type]} relative`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{name}</span>
        <Badge variant="outline" className="font-mono text-xs">v{version}</Badge>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {type === 'this-skill' && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
          This Skill
        </div>
      )}
    </div>
  )
}

function DependencyGraph() {
  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        {/* Top: Used by */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-2">Used by</p>
          <div className="flex gap-4">
            {USED_BY.map((skill) => (
              <DependencyNode
                key={skill.id}
                name={skill.name}
                version={skill.version}
                type="used-by"
                description={skill.description}
              />
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <svg className="w-4 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Middle: This Skill */}
        <DependencyNode
          name={SKILL_INFO.name}
          version={SKILL_INFO.version}
          type="this-skill"
        />

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <svg className="w-4 h-8 text-muted-foreground rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Bottom: Depends on */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-2">Depends on</p>
          <div className="flex gap-4">
            {DEPENDS_ON.map((skill) => (
              <DependencyNode
                key={skill.id}
                name={skill.name}
                version={skill.version}
                type="depends-on"
                description={skill.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AgentCard({
  agent,
}: {
  agent: (typeof AGENTS_USING)[0]
}) {
  return (
    <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/agent/${agent.id}`} className="font-medium text-sm hover:underline">
            {agent.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{agent.category}</Badge>
            <span className="text-xs text-muted-foreground font-mono">v{agent.version}</span>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {agent.invocations.toLocaleString()} calls
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Added {formatDate(agent.addedAt)}</span>
        <Link href={`/agent/${agent.id}`}>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            View Agent
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function SkillDependenciesPage() {
  const params = useParams()
  const skillId = params.id as string

  const totalInvocations = AGENTS_USING.reduce((acc, a) => acc + a.invocations, 0)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/skill/${skillId}`} className="hover:text-foreground">
          {SKILL_INFO.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Dependencies</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dependencies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Understand what this skill depends on and what uses it.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Used by:</span>{' '}
            <span className="font-medium">{AGENTS_USING.length} agents</span>
          </div>
          <div>
            <span className="text-muted-foreground">Depends on:</span>{' '}
            <span className="font-medium">{DEPENDS_ON.length} skills</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dependency Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Dependency Graph</CardTitle>
            <CardDescription>Visual overview of skill relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <DependencyGraph />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* What uses this skill */}
          <Card>
            <CardHeader>
              <CardTitle>What Uses This Skill</CardTitle>
              <CardDescription>Agents currently using this skill</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AGENTS_USING.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
              <Separator className="my-4" />
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{AGENTS_USING.length} agents</span> using this skill
                  across{' '}
                  <span className="font-mono font-medium">{totalInvocations.toLocaleString()}</span>{' '}
                  total invocations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What this skill depends on */}
          <Card>
            <CardHeader>
              <CardTitle>What This Skill Depends On</CardTitle>
              <CardDescription>Required dependencies for this skill</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEPENDS_ON.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/skill/${skill.id}`} className="font-medium text-sm hover:underline">
                        {skill.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">v{skill.version}</Badge>
                  </div>
                </div>
              ))}
              {DEPENDS_ON.length === 0 && (
                <p className="text-sm text-muted-foreground">No dependencies.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis</CardTitle>
            <CardDescription>What happens if you deprecate this skill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-2xl font-bold">{AGENTS_USING.length}</p>
                <p className="text-sm text-muted-foreground">Agents affected</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-2xl font-bold">{totalInvocations.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total invocations at risk</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-2xl font-bold">{USED_BY.length}</p>
                <p className="text-sm text-muted-foreground">Downstream skills affected</p>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Deprecation warning:</span> This skill has active usage
                across multiple agents. A deprecation would require a migration path for{' '}
                <span className="font-medium">{AGENTS_USING.length} agents</span> and coordination
                with downstream skill maintainers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deprecation Warning */}
        {AGENTS_USING.length > 0 && (
          <Card className="border-amber-500/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">Active Skill Warning</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This skill is actively used by production agents. Consider providing a migration
                    path before deprecation. Check with affected agent owners first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}