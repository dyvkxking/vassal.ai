"use client"

import { useState } from "react"
import { MOCK_AGENTS, MOCK_USER_PROFILE } from "@/lib/mock-data"
import type { Agent, AgentStatus } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusIcon,
  ActivityIcon,
  DollarSignIcon,
  UsersIcon,
  TrendingUpIcon,
  BrainIcon,
  AlertCircleIcon,
} from "lucide-react"

// Filter agents for current builder (match by address prefix since mock uses truncated addresses)
const myAgents = MOCK_AGENTS.filter(
  (agent) => agent.creator.startsWith(MOCK_USER_PROFILE.address.slice(0, 6)) // 0x1234
)

// Mock revenue data per agent (generate deterministic values based on agent id)
function getRevenueData(agentId: string) {
  const seed = agentId.charCodeAt(agentId.length - 1)
  return {
    today: (seed * 1.23 + 10).toFixed(2),
    month: (seed * 42.5 + 150).toFixed(2),
    allTime: (seed * 512.75 + 4200).toFixed(2),
  }
}

// Mock active sessions per agent
function getActiveSessions(agentId: string): number {
  const seed = agentId.charCodeAt(agentId.length - 1)
  return Math.floor(seed * 3.7 + 5)
}

// Mock SLA compliance percentage
function getSlaCompliance(qualityScore: number): number {
  return Math.min(99.9, qualityScore * 0.98 + (100 - qualityScore) * 0.5)
}

type FilterTab = "all" | AgentStatus
type SortOption = "revenue" | "quality" | "sessions" | "newest"

const STATUS_COLORS: Record<AgentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  paused: "secondary",
  draft: "outline",
  archived: "secondary",
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

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      {/* Learning indicator stripe */}
      {agent.learningEnabled && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="ring-2 ring-muted">
              <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                {agent.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{agent.name}</CardTitle>
              <CardDescription className="text-xs capitalize">{agent.category}</CardDescription>
            </div>
          </div>
          <Badge variant={STATUS_COLORS[agent.status]}>{STATUS_LABELS[agent.status]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quality & Sessions Row */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold">{agent.qualityScore}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-muted-foreground">100</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active Sessions</span>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums">{activeSessions}</span>
        </div>

        {/* Revenue Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSignIcon className="size-4" />
            <span>Revenue</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border bg-card px-2 py-1.5 text-center">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="font-mono text-sm font-semibold tabular-nums">${revenue.today}</p>
            </div>
            <div className="rounded-md border bg-card px-2 py-1.5 text-center">
              <p className="text-xs text-muted-foreground">Month</p>
              <p className="font-mono text-sm font-semibold tabular-nums">${revenue.month}</p>
            </div>
            <div className="rounded-md border bg-card px-2 py-1.5 text-center">
              <p className="text-xs text-muted-foreground">All-time</p>
              <p className="font-mono text-sm font-semibold tabular-nums">${revenue.allTime}</p>
            </div>
          </div>
        </div>

        {/* SLA & Learning Row */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <ActivityIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">SLA Compliance</span>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums">{slaCompliance.toFixed(1)}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1.5">
            {agent.learningEnabled ? (
              <>
                <BrainIcon className="size-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Learning</span>
              </>
            ) : (
              <>
                <AlertCircleIcon className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Learning disabled</span>
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">v{agent.version}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <UsersIcon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No agents yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Create your first AI agent to start earning revenue. Build and deploy agents in minutes.
      </p>
      <Button>
        <PlusIcon className="mr-2 size-4" />
        Create Your First Agent
      </Button>
    </div>
  )
}

function AgentsGrid({ filteredAgents }: { filteredAgents: Agent[] }) {
  if (filteredAgents.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredAgents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}

export default function MyAgentsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  // Apply filter
  let filteredAgents = [...myAgents]
  if (activeTab !== "all") {
    filteredAgents = filteredAgents.filter((agent) => agent.status === activeTab)
  }

  // Apply sort
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground">
            {myAgents.length === 0 ? "No agents created yet" : `${myAgents.length} agent${myAgents.length !== 1 ? "s" : ""} created`}
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Create New Agent
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList variant="line">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-36">
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

      {/* Agents Grid */}
      <AgentsGrid filteredAgents={filteredAgents} />
    </div>
  )
}