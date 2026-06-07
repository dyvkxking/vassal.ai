"use client"

import { useState } from "react"
import Link from "next/link"
import { MOCK_AGENTS, MOCK_USER_PROFILE } from "@/lib/mock-data"
import type { Agent, AgentStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Activity,
  DollarSign,
  Users,
  TrendingUp,
  Brain,
  AlertCircle,
  Sparkles,
  Edit3,
} from "lucide-react"

const myAgents = MOCK_AGENTS.filter((agent) =>
  agent.creator.startsWith(MOCK_USER_PROFILE.address.slice(0, 6))
)

function getRevenueData(agentId: string) {
  const seed = agentId.charCodeAt(agentId.length - 1)
  return {
    today: (seed * 1.23 + 10).toFixed(2),
    month: (seed * 42.5 + 150).toFixed(2),
    allTime: (seed * 512.75 + 4200).toFixed(2),
  }
}

function getActiveSessions(agentId: string): number {
  const seed = agentId.charCodeAt(agentId.length - 1)
  return Math.floor(seed * 3.7 + 5)
}

function getSlaCompliance(qualityScore: number): number {
  return Math.min(99.9, qualityScore * 0.98 + (100 - qualityScore) * 0.5)
}

type FilterTab = "all" | AgentStatus
type SortOption = "revenue" | "quality" | "sessions" | "newest"

const STATUS_STYLE: Record<AgentStatus, { bg: string; border: string; color: string }> = {
  active: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
    color: 'rgba(16, 185, 129, 0.95)',
  },
  paused: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    color: 'rgba(245, 158, 11, 0.95)',
  },
  draft: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--muted-foreground)',
  },
  archived: {
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--muted-foreground)',
  },
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
  archived: "Archived",
}

function AgentCard({ agent }: { agent: Agent }) {
  const revenue = getRevenueData(agent.id)
  const activeSessions = getActiveSessions(agent.id)
  const slaCompliance = getSlaCompliance(agent.qualityScore)
  const statusStyle = STATUS_STYLE[agent.status]

  return (
    <div
      className="group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      {/* Learning indicator stripe */}
      {agent.learningEnabled && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.6), rgba(6, 182, 212, 0.8))',
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarImage src={agent.avatarUrl} alt={agent.name} />
            <AvatarFallback
              className="text-base font-semibold rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {agent.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3
              className="font-semibold truncate text-base"
              style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
            >
              {agent.name}
            </h3>
            <p className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>
              {agent.category} · v{agent.version}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="text-xs"
          style={{
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.color,
          }}
        >
          {STATUS_LABELS[agent.status]}
        </Badge>
      </div>

      {/* Metrics grid */}
      <div
        className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Quality</div>
          <div
            className="font-mono text-base font-semibold"
            style={{ color: 'rgba(16, 185, 129, 0.95)' }}
          >
            {agent.qualityScore}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Sessions</div>
          <div className="font-mono text-base font-semibold">{activeSessions}</div>
        </div>
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>SLA</div>
          <div className="font-mono text-base font-semibold" style={{ color: 'rgba(59, 130, 246, 0.95)' }}>
            {slaCompliance.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
          <DollarSign className="size-3" />
          <span className="uppercase tracking-wider">Revenue</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Today', value: revenue.today },
            { label: 'Month', value: revenue.month },
            { label: 'All-time', value: revenue.allTime },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg px-2 py-2 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              <p className="font-mono text-sm font-semibold tabular-nums">${value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <div className="flex items-center gap-1.5">
          {agent.learningEnabled ? (
            <>
              <Brain className="size-3.5" style={{ color: 'rgba(16, 185, 129, 0.95)' }} />
              <span className="text-xs" style={{ color: 'rgba(16, 185, 129, 0.95)' }}>Learning</span>
            </>
          ) : (
            <>
              <AlertCircle className="size-3.5" style={{ color: 'var(--muted-foreground)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Learning off</span>
            </>
          )}
        </div>
        <div className="flex gap-1">
          <Link href={`/edit-agent/${agent.id}`}>
            <Button variant="ghost" size="sm" className="h-7 px-2 btn-ghost-transition">
              <Edit3 className="size-3.5" />
            </Button>
          </Link>
          <Link href={`/agent/${agent.id}`}>
            <Button variant="ghost" size="sm" className="h-7 px-2 btn-ghost-transition">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyStateView() {
  return (
    <div
      className="p-12 rounded-2xl text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}
      >
        <Sparkles className="h-7 w-7 text-violet-300" />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
      >
        No agents yet
      </h3>
      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
        Create your first AI agent to start earning revenue. Build, deploy, and evolve agents in minutes.
      </p>
      <Link href="/create-agent"><Button
        className="btn-primary-transition"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.85))',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          color: 'white',
        }}
       
      >
          <Plus className="mr-2 h-4 w-4" /> Create Your First Agent
        </Button></Link>
    </div>
  )
}

export default function MyAgentsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  let filteredAgents = [...myAgents]
  if (activeTab !== "all") {
    filteredAgents = filteredAgents.filter((agent) => agent.status === activeTab)
  }

  switch (sortBy) {
    case "revenue":
      filteredAgents.sort((a, b) => {
        const revA = parseFloat(getRevenueData(a.id).allTime)
        const revB = parseFloat(getRevenueData(b.id).allTime)
        return revB - revA
      })
      break
    case "quality":
      filteredAgents.sort((a, b) => b.qualityScore - a.qualityScore)
      break
    case "sessions":
      filteredAgents.sort((a, b) => b.totalSessions - a.totalSessions)
      break
    case "newest":
    default:
      filteredAgents.sort((a, b) => b.createdAt - a.createdAt)
      break
  }

  const totalRevenue = myAgents.reduce((sum, a) => sum + parseFloat(getRevenueData(a.id).month), 0)

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                'radial-gradient(ellipse at 25% 25%, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
            }}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)',
            opacity: 0.2,
          }}
        />

        <div className="container relative py-10 md:py-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.6))' }}
            />
            <span
              className="text-xs uppercase font-medium"
              style={{ color: 'rgba(236, 72, 153, 0.8)', letterSpacing: '3px' }}
            >
              Builder Studio
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-display-serif, inherit)',
                  fontSize: 'clamp(2.25rem, 5dvw, 4em)',
                  lineHeight: '1em',
                  letterSpacing: '-0.02em',
                }}
              >
                My Agents
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: 'var(--font-body-light, inherit)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {myAgents.length === 0
                  ? 'No agents created yet — start by deploying your first.'
                  : `${myAgents.length} agent${myAgents.length !== 1 ? 's' : ''} · $${totalRevenue.toFixed(2)} earned this month`}
              </p>
            </div>
            <Link href="/create-agent"><Button
              size="lg"
              className="btn-primary-transition"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(139, 92, 246, 0.85))',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                color: 'white',
              }}
             
            >
                <Plus className="mr-2 h-4 w-4" /> Create New Agent
              </Button></Link>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="container py-6">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
            <TabsList
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <TabsTrigger value="all">All ({myAgents.length})</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sort by</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger
                className="w-36"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="container pb-12">
        {filteredAgents.length === 0 ? (
          <EmptyStateView />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
