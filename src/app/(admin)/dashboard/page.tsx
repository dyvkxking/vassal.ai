"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_AGENTS, MOCK_SESSIONS } from '@/lib/mock-data'

// ---- Stats ----
interface StatCardProps {
  title: string
  value: string
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
}

function StatCard({ title, value, subValue, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-3xl font-bold">{value}</div>
        {subValue && (
          <div className="mt-1 text-xs text-muted-foreground">
            {trend && (
              <span
                className={
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                }
              >
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              </span>
            )}
            {subValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---- Sessions Over Time Chart (ASCII) ----
const SESSIONS_OVER_TIME = [
  { date: 'Jun 1', sessions: 412 },
  { date: 'Jun 2', sessions: 380 },
  { date: 'Jun 3', sessions: 510 },
  { date: 'Jun 4', sessions: 490 },
  { date: 'Jun 5', sessions: 600 },
  { date: 'Jun 6', sessions: 580 },
  { date: 'Jun 7', sessions: 640 },
]

function SessionsLineChart() {
  const maxSessions = Math.max(...SESSIONS_OVER_TIME.map((d) => d.sessions))
  const minSessions = Math.min(...SESSIONS_OVER_TIME.map((d) => d.sessions))
  const range = maxSessions - minSessions

  return (
    <div className="font-mono text-sm">
      <div className="mb-2 text-xs text-muted-foreground">Sessions (Last 7 Days)</div>
      <div className="flex items-end gap-1">
        {SESSIONS_OVER_TIME.map(({ date, sessions }) => {
          const barLen = range > 0 ? Math.max(2, Math.round(((sessions - minSessions) / range) * 10)) : 5
          const bar = '█'.repeat(barLen)
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{sessions}</span>
              <span className="text-primary">{bar}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{SESSIONS_OVER_TIME[0].date}</span>
        <span>{SESSIONS_OVER_TIME[SESSIONS_OVER_TIME.length - 1].date}</span>
      </div>
    </div>
  )
}

// ---- Pie Chart (ASCII) ----
const AGENT_CATEGORIES = [
  { category: 'DeFi', count: 2, marker: '■' },
  { category: 'NFT', count: 1, marker: '●' },
  { category: 'DAO', count: 1, marker: '▲' },
  { category: 'Infrastructure', count: 2, marker: '◆' },
]

function AgentPieChart() {
  const total = AGENT_CATEGORIES.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="font-mono text-sm">
      <div className="mb-2 text-xs text-muted-foreground">Agent Categories</div>
      <div className="space-y-1">
        {AGENT_CATEGORIES.map(({ category, count, marker }) => (
          <div key={category} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="text-primary">{marker}</span>
              <span className="text-xs">{category}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {count} ({Math.round((count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
        Total: {total} agents
      </div>
    </div>
  )
}

// ---- Recent Activity ----
const RECENT_ACTIVITY = [
  { id: 'act-001', type: 'session', message: 'New session started on DeFi Pulse Scanner', time: '2m ago' },
  { id: 'act-002', type: 'slash', message: 'SLA breach detected — node-002 — 0.02 $MESH slashed', time: '18m ago' },
  { id: 'act-003', type: 'agent', message: 'MEV Detector version 2.1.0 released', time: '1h ago' },
  { id: 'act-004', type: 'proposal', message: 'Proposal "Increase Slash Rate" reached quorum', time: '3h ago' },
  { id: 'act-005', type: 'session', message: 'Large volume session completed — 120K TPM tokens', time: '5h ago' },
  { id: 'act-006', type: 'agent', message: 'New agent "AI Vision Classifier" submitted for review', time: '7h ago' },
]

function RecentActivityFeed() {
  const typeColors: Record<string, string> = {
    session: 'text-blue-500',
    slash: 'text-red-500',
    agent: 'text-purple-500',
    proposal: 'text-amber-500',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <span className={`mt-0.5 h-2 w-2 rounded-full ${typeColors[activity.type] ?? 'bg-muted'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Flagged Content ----
const FLAGGED_AGENTS = [
  { id: 'flag-001', name: 'Flash Loan Maxi', creator: '0xaaaa...1111', reason: 'High report count (12)', reports: 12 },
  { id: 'flag-002', name: 'Rug Pull Detector', creator: '0xbbbb...2222', reason: 'Potential false signals', reports: 7 },
]

const FLAGGED_USERS = [
  { id: 'flag-u-001', address: '0xcccc...3333', reason: 'Abusive API usage', reports: 4 },
  { id: 'flag-u-002', address: '0xdddd...4444', reason: 'SLA abuse pattern', reports: 3 },
]

function FlaggedContentSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Flagged Content</CardTitle>
          <Badge variant="destructive">{FLAGGED_AGENTS.length + FLAGGED_USERS.length} Total</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Flagged Agents */}
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Agents</div>
          <div className="space-y-2">
            {FLAGGED_AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.creator} — {agent.reason}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">{agent.reports} reports</Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Flagged Users */}
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Users</div>
          <div className="space-y-2">
            {FLAGGED_USERS.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-mono truncate">{user.address}</p>
                  <p className="text-xs text-muted-foreground">{user.reason}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">{user.reports} reports</Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function AdminDashboardPage() {
  const totalAgents = MOCK_AGENTS.length
  const totalSessions = MOCK_SESSIONS.length
  const volumeMesh = 4.82
  const platformFees = 0.024
  const activeUsers = 1247
  const slashEvents = 3

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview, moderation, and governance controls.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Agents" value={totalAgents.toLocaleString()} subValue="registered" trend="up" />
        <StatCard title="Total Sessions" value={totalSessions.toLocaleString()} subValue="all time" trend="up" />
        <StatCard title="Volume ($MESH)" value={`${volumeMesh}M`} subValue="last 30 days" trend="up" />
        <StatCard title="Platform Fees" value={`${platformFees.toFixed(3)} $MESH`} subValue="collected" trend="neutral" />
        <StatCard title="Active Users" value={activeUsers.toLocaleString()} subValue="24h active" trend="up" />
        <StatCard title="Slash Events" value={slashEvents.toString()} subValue="last 7 days" trend="down" />
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionsLineChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentPieChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Recent Activity + Flagged Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivityFeed />
        <FlaggedContentSection />
      </div>
    </div>
  )
}
