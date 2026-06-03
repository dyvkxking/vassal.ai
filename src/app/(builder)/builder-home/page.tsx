import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress, ProgressIndicator } from '@/components/ui/progress'
import { MOCK_AGENTS, MOCK_USER_PROFILE } from '@/lib/mock-data'

// Mock pending approvals count
const PENDING_APPROVALS = 3

// Mock recent activity feed
const RECENT_ACTIVITY = [
  'Agent DeFi Pulse Scanner: 3 new sessions',
  'Learning update pending approval',
  'Quality score improved to 94',
  'Agent Token Price Oracle: 12 new sessions',
  'New review received for Wallet Intelligence',
]

// Mock revenue data per agent (today)
const AGENT_REVENUE_TODAY: Record<string, number> = {
  'agent-001': 24.5,
  'agent-002': 8.3,
  'agent-003': 15.7,
  'agent-004': 42.1,
  'agent-005': 67.8,
  'agent-006': 112.4,
}

// Mock active sessions per agent
const AGENT_ACTIVE_SESSIONS: Record<string, number> = {
  'agent-001': 12,
  'agent-002': 3,
  'agent-003': 7,
  'agent-004': 18,
  'agent-005': 31,
  'agent-006': 0,
}

function StatCard({
  title,
  value,
  subValue,
}: {
  title: string
  value: string
  subValue?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-3xl font-bold">{value}</div>
        {subValue && <div className="mt-1 text-xs text-muted-foreground">{subValue}</div>}
      </CardContent>
    </Card>
  )
}

function AgentMiniCard({
  agent,
}: {
  agent: (typeof MOCK_AGENTS)[number]
}) {
  const revenueToday = AGENT_REVENUE_TODAY[agent.id] ?? 0
  const activeSessions = AGENT_ACTIVE_SESSIONS[agent.id] ?? 0

  return (
    <Card size="sm">
      <CardContent className="px-3 py-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{agent.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              ${revenueToday.toFixed(2)} today
            </p>
          </div>
          <div className="ml-2 flex flex-col items-end gap-1">
            <Badge
              variant={agent.qualityScore >= 95 ? 'default' : 'secondary'}
              className="text-xs"
            >
              {agent.qualityScore}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activeSessions} sessions
            </span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Quality</span>
            <span className="font-mono font-medium">{agent.qualityScore}/100</span>
          </div>
          <Progress value={agent.qualityScore} className="mt-1 h-1.5" />
        </div>
      </CardContent>
    </Card>
  )
}

function WelcomeBanner() {
  const { displayName, isGenesisParticipant, roles } = MOCK_USER_PROFILE

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback className="text-lg">
              {(displayName ?? "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {displayName}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="outline" className="capitalize">
                  {role}
                </Badge>
              ))}
              {isGenesisParticipant && (
                <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border-amber-500/30">
                  Genesis Participant
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Create New Agent</Button>
          <Button variant="outline" size="sm">
            View Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingApprovalsBanner() {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-500 text-white" variant="default">
            {PENDING_APPROVALS}
          </Badge>
          <span className="text-sm font-medium">
            Learning signals awaiting your approval
          </span>
        </div>
        <Button variant="outline" size="sm">
          Review Now
        </Button>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          Create New Agent
        </Button>
        <Button variant="outline" className="w-full justify-start">
          View Learning Logs
        </Button>
        <Button variant="outline" className="w-full justify-start">
          View Analytics
        </Button>
      </CardContent>
    </Card>
  )
}

function RecentActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {RECENT_ACTIVITY.map((activity, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">{activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function BuilderDashboardPage() {
  // Get top 3 agents by quality score
  const topAgents = [...MOCK_AGENTS]
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, 3)

  // Calculate stats
  const totalRevenueAllTime = AGENT_REVENUE_TODAY['agent-001'] +
    AGENT_REVENUE_TODAY['agent-002'] +
    AGENT_REVENUE_TODAY['agent-003'] +
    AGENT_REVENUE_TODAY['agent-004'] +
    AGENT_REVENUE_TODAY['agent-005'] +
    AGENT_REVENUE_TODAY['agent-006']

  const thisMonthRevenue = totalRevenueAllTime * 0.38 // Mock: ~38% of total
  const activeSessionsCount = Object.values(AGENT_ACTIVE_SESSIONS).reduce((a, b) => a + b, 0)
  const avgQualityScore = Math.round(
    MOCK_AGENTS.reduce((acc, a) => acc + a.qualityScore, 0) / MOCK_AGENTS.length
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Builder Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your AI agents and monitor their performance.
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="mb-6">
        <WelcomeBanner />
      </div>

      {/* Pending Approvals Indicator */}
      {PENDING_APPROVALS > 0 && (
        <div className="mb-6">
          <PendingApprovalsBanner />
        </div>
      )}

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue (All Time)"
          value={`$${totalRevenueAllTime.toFixed(2)}`}
          subValue="across all agents"
        />
        <StatCard
          title="This Month"
          value={`$${thisMonthRevenue.toFixed(2)}`}
          subValue="current period"
        />
        <StatCard
          title="Active Sessions"
          value={activeSessionsCount.toString()}
          subValue="currently running"
        />
        <StatCard
          title="Avg Quality Score"
          value={`${avgQualityScore}`}
          subValue="across all agents"
        />
      </div>

      {/* Main Content: Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Agents Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Agents</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topAgents.map((agent) => (
                <AgentMiniCard key={agent.id} agent={agent} />
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivityFeed />
        </div>

        {/* Right column: 1/3 width */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions */}
          <QuickActions />

          {/* Agent Stats Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agent Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Agents</span>
                <span className="font-medium">{MOCK_AGENTS.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-medium">
                  {MOCK_AGENTS.reduce((acc, a) => acc + a.totalSessions, 0).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Rating</span>
                <span className="font-medium">
                  {(MOCK_AGENTS.reduce((acc, a) => acc + a.avgRating, 0) / MOCK_AGENTS.length).toFixed(1)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue Today</span>
                <span className="font-medium">${totalRevenueAllTime.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}