'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, GitCompareIcon, PlayIcon, ShieldCheckIcon, SparklesIcon, StarIcon, ZapIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgentCard } from '@/components/shared/agent-card'
import { EmptyState } from '@/components/shared/empty-state'

import { getAgentById, MOCK_AGENTS } from '@/lib/mock-data'
import type { Agent } from '@/types'
import { cn } from '@/lib/utils'

// ---------- Mock browse-context data ----------
type RecentSession = {
  client: string
  durationMin: number
  cost: number
  outcome: 'success' | 'partial' | 'failed'
  when: string
}

const MOCK_RECENT_SESSIONS: RecentSession[] = [
  { client: '0xa1b2...c3d4', durationMin: 42, cost: 0.0105, outcome: 'success', when: '12 min ago' },
  { client: '0x55ee...8b21', durationMin: 18, cost: 0.0045, outcome: 'success', when: '38 min ago' },
  { client: '0x99af...22c1', durationMin: 6, cost: 0.0014, outcome: 'partial', when: '1 hr ago' },
  { client: '0x1234...abcd', durationMin: 120, cost: 0.0301, outcome: 'success', when: '3 hr ago' },
]

const MOCK_AVAILABILITY = {
  status: 'available' as 'available' | 'busy' | 'offline',
  activeNodes: 7,
  queueLen: 0,
  nextSlotIn: 'now',
}

// ---------- Small primitives ----------
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card
      className={cn(
        'overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-[10px]',
        className
      )}
    >
      {children}
    </Card>
  )
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] font-medium uppercase tracking-[3px] text-muted-foreground">{label}</div>
      <div className={cn('font-mono text-2xl font-semibold tabular-nums', accent)}>{value}</div>
      {sub ? <div className="text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  )
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            'size-3.5',
            i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
          )}
        />
      ))}
    </div>
  )
}

function AvailabilityPill({ status }: { status: typeof MOCK_AVAILABILITY.status }) {
  const styles = {
    available: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    busy: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    offline: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
  }[status]
  const dot = {
    available: 'bg-emerald-500 animate-pulse',
    busy: 'bg-amber-500',
    offline: 'bg-zinc-500',
  }[status]
  const label = { available: 'Available now', busy: 'Busy', offline: 'Offline' }[status]
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium', styles)}>
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}

function OutcomeBadge({ outcome }: { outcome: RecentSession['outcome'] }) {
  const map = {
    success: { label: 'Success', cls: 'border-emerald-500/30 text-emerald-500' },
    partial: { label: 'Partial', cls: 'border-amber-500/30 text-amber-500' },
    failed: { label: 'Failed', cls: 'border-red-500/30 text-red-500' },
  }[outcome]
  return (
    <Badge variant="outline" className={cn('text-[10px] font-medium uppercase tracking-wider', map.cls)}>
      {map.label}
    </Badge>
  )
}

// ---------- Page ----------
export default function BrowseAgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string

  const agent = useMemo<Agent | undefined>(() => getAgentById(agentId), [agentId])

  // Similar agents: same category, exclude current. Fall back to top 3 by rating.
  const similarAgents = useMemo(() => {
    if (!agent) return MOCK_AGENTS.slice(0, 3)
    const sameCat = MOCK_AGENTS.filter((a) => a.id !== agent.id && a.category === agent.category)
    if (sameCat.length >= 3) return sameCat.slice(0, 3)
    const filler = MOCK_AGENTS.filter((a) => a.id !== agent.id && !sameCat.includes(a))
    return [...sameCat, ...filler].slice(0, 3)
  }, [agent])

  const [favorited, setFavorited] = useState(false)

  if (!agent) {
    return (
      <div className="container mx-auto max-w-3xl px-5 py-20">
        <EmptyState
          title="Agent not found"
          description="This agent may have been removed from the marketplace or the link is incorrect."
          icon={SparklesIcon}
          secondaryAction={{ label: 'Back to browse', href: '/browse-agents' }}
        />
      </div>
    )
  }

  const priceLabel =
    agent.pricing.type === 'per_minute'
      ? `${agent.pricing.pricePerMinute?.toFixed(4)} MESH/min`
      : agent.pricing.type === 'per_second'
      ? `${(agent.pricing.pricePerSecond ?? 0).toFixed(6)} MESH/sec`
      : `${agent.pricing.pricePerCall?.toFixed(4)} MESH/call`

  return (
    <div className="min-h-screen bg-background">
      {/* ───── Header bar ───── */}
      <div className="border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="container mx-auto max-w-7xl px-5 py-5">
          <div className="mb-6 flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/browse-agents">
                <ArrowLeftIcon className="size-4" />
                Browse
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setFavorited((f) => !f)}
              >
                <BookmarkIcon className={cn('size-4', favorited && 'fill-yellow-400 text-yellow-400')} />
                {favorited ? 'Saved' : 'Save'}
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={`/compare?agents=${agent.id}`}>
                  <GitCompareIcon className="size-4" />
                  Compare
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="text-[10px] uppercase tracking-[3px]">
                  {agent.category}
                </Badge>
                <AvailabilityPill status={MOCK_AVAILABILITY.status} />
                <span className="text-xs font-mono text-muted-foreground">
                  v{agent.version}
                </span>
              </div>

              <div className="flex items-start gap-5">
                <Avatar className="size-16 border border-white/10">
                  <AvatarFallback className="bg-white/[0.05] text-xl font-light">
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="font-serif text-4xl font-normal leading-[1em] tracking-tight md:text-5xl">
                    {agent.name}
                  </h1>
                  <p className="max-w-2xl text-base font-light leading-snug text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <RatingStars rating={agent.avgRating} />
                  <span className="font-mono tabular-nums">{agent.avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({agent.totalSessions.toLocaleString()} sessions)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="font-mono text-muted-foreground">
                  by {agent.creator}
                </span>
              </div>
            </div>

            {/* CTA panel */}
            <GlassCard className="md:w-[320px]">
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <div className="text-[10px] font-medium uppercase tracking-[3px] text-muted-foreground">
                    Rate
                  </div>
                  <div className="font-mono text-2xl font-semibold tabular-nums">
                    {priceLabel}
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">Quality</div>
                    <div className="font-mono text-base">{agent.qualityScore}/100</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-mono text-base">{agent.slaParams.uptimeGuaranteePercent}%</div>
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  <Button asChild className="w-full gap-2">
                    <Link href={`/launcher?agent=${agent.id}`}>
                      <PlayIcon className="size-4" />
                      Launch session
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href={`/agent/${agent.id}`}>
                      Full details
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* ───── Body ───── */}
      <div className="container mx-auto max-w-7xl px-5 py-10">
        {/* Top stats strip */}
        <GlassCard className="mb-8">
          <CardContent className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
            <StatTile
              label="Quality score"
              value={`${agent.qualityScore}`}
              sub="Out of 100"
              accent={agent.qualityScore >= 90 ? 'text-emerald-500' : agent.qualityScore >= 70 ? 'text-amber-500' : 'text-red-500'}
            />
            <StatTile
              label="Sessions run"
              value={agent.totalSessions.toLocaleString()}
              sub="Lifetime"
            />
            <StatTile
              label="Latency target"
              value={`${agent.slaParams.latencyThresholdMs}ms`}
              sub="p95 threshold"
            />
            <StatTile
              label="Active nodes"
              value={`${MOCK_AVAILABILITY.activeNodes}`}
              sub={MOCK_AVAILABILITY.queueLen === 0 ? 'No queue' : `${MOCK_AVAILABILITY.queueLen} in queue`}
              accent="text-emerald-500"
            />
          </CardContent>
        </GlassCard>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/[0.04] backdrop-blur-[10px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="recent">Recent activity</TabsTrigger>
            <TabsTrigger value="similar">Similar agents</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <GlassCard className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">SLA contract</CardTitle>
                  <CardDescription>What this agent guarantees per session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Latency p95 cap</span>
                      <span className="font-mono">{agent.slaParams.latencyThresholdMs}ms</span>
                    </div>
                    <Progress value={70} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">TPM cap</span>
                      <span className="font-mono">{agent.slaParams.tpmCap.toLocaleString()}</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime guarantee</span>
                      <span className="font-mono">{agent.slaParams.uptimeGuaranteePercent}%</span>
                    </div>
                    <Progress value={agent.slaParams.uptimeGuaranteePercent} className="h-1.5" />
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <ShieldCheckIcon className="mt-0.5 size-5 text-emerald-500" />
                    <div className="text-sm">
                      <div className="font-medium">Stake-backed by {agent.slaParams.minStakeRequired.toLocaleString()} MESH</div>
                      <p className="text-muted-foreground">
                        Provider stake is slashed on SLA breach. You get refunded automatically for any
                        breach window.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardHeader>
                  <CardTitle className="text-base">Skills used</CardTitle>
                  <CardDescription>Dependencies pinned to this version</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {agent.skillDependencies.map((skill) => (
                    <Link
                      key={skill}
                      href={`/skill/${skill}`}
                      className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <span className="font-mono text-xs">{skill}</span>
                      <ArrowRightIcon className="size-3.5 text-muted-foreground" />
                    </Link>
                  ))}
                  <Button asChild variant="ghost" size="sm" className="mt-2 w-full justify-between text-xs">
                    <Link href={`/agent/${agent.id}/analytics`}>
                      View skill graph
                      <ArrowRightIcon className="size-3" />
                    </Link>
                  </Button>
                </CardContent>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Capabilities */}
          <TabsContent value="capabilities">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-base">Capabilities ({agent.capabilities.length})</CardTitle>
                <CardDescription>What this agent can do, with TPM cost</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {agent.capabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ZapIcon className="size-4 text-amber-500" />
                        <div className="text-sm font-medium">{cap.name}</div>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {(cap.tpmRequired / 1000).toFixed(0)}K TPM
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{cap.description}</p>
                  </div>
                ))}
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Recent activity */}
          <TabsContent value="recent">
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-base">Last 24 hours</CardTitle>
                <CardDescription>Live signal — anonymised client sessions</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-white/5">
                {MOCK_RECENT_SESSIONS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-white/[0.05] font-mono text-[10px]">
                        {s.client.slice(2, 4)}
                      </div>
                      <div>
                        <div className="font-mono text-xs">{s.client}</div>
                        <div className="text-[11px] text-muted-foreground">{s.when}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="hidden font-mono text-muted-foreground tabular-nums sm:block">
                        {s.durationMin}m
                      </div>
                      <div className="font-mono tabular-nums">
                        {s.cost.toFixed(4)} <span className="text-xs text-muted-foreground">MESH</span>
                      </div>
                      <OutcomeBadge outcome={s.outcome} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Similar agents */}
          <TabsContent value="similar">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Other agents in <span className="font-medium text-foreground">{agent.category}</span>
              </p>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href={`/browse-agents?category=${agent.category}`}>
                  See all
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarAgents.map((a) => (
                <AgentCard key={a.id} agent={a} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA — full page */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-[10px]">
          <SparklesIcon className="size-7 text-amber-400" />
          <h2 className="font-serif text-3xl font-normal leading-[1em]">Need the full picture?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            See historic analytics, full review feed, version history, and capability benchmarks on the
            full agent profile.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href={`/agent/${agent.id}`}>
              Open full agent profile
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
