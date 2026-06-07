'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MOCK_AGENTS } from '@/lib/mock-data'
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Bot,
  DollarSign,
  Activity,
  Bell,
  Sparkles,
  BarChart3,
  GitBranch,
} from 'lucide-react'

const PENDING_APPROVALS = 3

const RECENT_ACTIVITY = [
  { type: 'session', label: 'Agent DeFi Pulse Scanner: 3 new sessions', timestamp: '2m ago' },
  { type: 'learning', label: 'Learning update pending approval', timestamp: '12m ago' },
  { type: 'quality', label: 'Quality score improved to 94 (+2)', timestamp: '1h ago' },
  { type: 'session', label: 'Token Price Oracle: 12 new sessions', timestamp: '3h ago' },
  { type: 'review', label: 'New 5★ review on Wallet Intelligence', timestamp: '5h ago' },
]

const AGENT_REVENUE_TODAY: Record<string, number> = {
  'agent-001': 24.5,
  'agent-002': 8.3,
  'agent-003': 15.7,
  'agent-004': 42.1,
  'agent-005': 67.8,
  'agent-006': 112.4,
}

const AGENT_ACTIVE_SESSIONS: Record<string, number> = {
  'agent-001': 12,
  'agent-002': 3,
  'agent-003': 7,
  'agent-004': 18,
  'agent-005': 31,
  'agent-006': 0,
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 rounded-2xl ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {children}
    </div>
  )
}

function StatCard({
  title,
  value,
  subValue,
  trend,
  accent,
  icon: Icon,
}: {
  title: string
  value: string
  subValue?: string
  trend?: 'up' | 'down'
  accent: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div
      className="p-5 rounded-xl relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-medium" style={{ color: 'var(--muted-foreground)', letterSpacing: '2px' }}>
            {title}
          </span>
          <Icon className="h-4 w-4 opacity-50" />
        </div>
        <div className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display-serif, inherit)' }}>
          {value}
        </div>
        {subValue && (
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {trend && (
              <span
                style={{
                  color: trend === 'up' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                }}
              >
                {trend === 'up' ? '↑ ' : '↓ '}
              </span>
            )}
            {subValue}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuilderHomePage() {
  const myAgents = MOCK_AGENTS.slice(0, 6)
  const totalRevenue = Object.values(AGENT_REVENUE_TODAY).reduce((s, v) => s + v, 0)
  const totalActiveSessions = Object.values(AGENT_ACTIVE_SESSIONS).reduce((s, v) => s + v, 0)
  const avgQuality = Math.round(myAgents.reduce((s, a) => s + a.qualityScore, 0) / myAgents.length)

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                'radial-gradient(ellipse at 25% 25%, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)',
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
                Your Agents
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: 'var(--font-body-light, inherit)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Design, deploy, and evolve specialized AI agents with on-chain quality guarantees.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/my-agents"><Button
                variant="outline"
                className="btn-ghost-transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
               
              >
                  <Bot className="mr-2 h-4 w-4" /> My Agents
                </Button></Link>
              <Link href="/create-agent"><Button
                className="btn-primary-transition"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(139, 92, 246, 0.85))',
                  border: '1px solid rgba(236, 72, 153, 0.4)',
                  color: 'white',
                }}
               
              >
                  <Plus className="mr-2 h-4 w-4" /> Create Agent
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="container py-8 space-y-8">
        {/* STAT GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Revenue Today"
            value={`$${totalRevenue.toFixed(2)}`}
            subValue="+18.2% vs yesterday"
            trend="up"
            accent="rgba(16, 185, 129, 0.15)"
            icon={DollarSign}
          />
          <StatCard
            title="Active Sessions"
            value={totalActiveSessions.toString()}
            subValue={`across ${myAgents.length} agents`}
            accent="rgba(139, 92, 246, 0.15)"
            icon={Activity}
          />
          <StatCard
            title="Avg Quality"
            value={avgQuality.toString()}
            subValue="+3 pts this week"
            trend="up"
            accent="rgba(245, 158, 11, 0.15)"
            icon={TrendingUp}
          />
          <StatCard
            title="Pending Learning"
            value={PENDING_APPROVALS.toString()}
            subValue="awaiting approval"
            accent="rgba(236, 72, 153, 0.15)"
            icon={Bell}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Your Agents
                </h2>
                <Link href="/my-agents"><Button variant="ghost" size="sm">
                    Manage all <ArrowRight className="ml-1 h-3 w-3" />
                  </Button></Link>
              </div>
              <div className="space-y-2">
                {myAgents.map((agent) => {
                  const revenue = AGENT_REVENUE_TODAY[agent.id] ?? 0
                  const sessions = AGENT_ACTIVE_SESSIONS[agent.id] ?? 0
                  return (
                    <Link key={agent.id} href={`/agent/${agent.id}`}>
                      <div
                        className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          transitionTimingFunction: 'var(--ease-out-expo)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-xl">
                            <AvatarFallback
                              className="font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                                color: 'rgba(255, 255, 255, 0.9)',
                              }}
                            >
                              {agent.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{agent.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge
                                variant="secondary"
                                className="text-xs h-4 px-1.5"
                                style={{
                                  background: 'rgba(139, 92, 246, 0.1)',
                                  border: '1px solid rgba(139, 92, 246, 0.2)',
                                  color: 'rgba(139, 92, 246, 0.9)',
                                }}
                              >
                                v{agent.version}
                              </Badge>
                              <span className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>
                                {agent.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-right">
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Sessions
                            </div>
                            <div className="font-mono">{sessions}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Today
                            </div>
                            <div className="font-mono" style={{ color: 'rgba(16, 185, 129, 0.9)' }}>
                              ${revenue.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Quality
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: 'rgba(16, 185, 129, 0.9)',
                              }}
                            >
                              {agent.qualityScore}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Recent Activity
                </h2>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    color: 'rgba(236, 72, 153, 0.9)',
                  }}
                >
                  Live
                </Badge>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background:
                          activity.type === 'session'
                            ? 'rgba(16, 185, 129, 0.9)'
                            : activity.type === 'learning'
                            ? 'rgba(245, 158, 11, 0.9)'
                            : activity.type === 'quality'
                            ? 'rgba(59, 130, 246, 0.9)'
                            : 'rgba(236, 72, 153, 0.9)',
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{activity.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                Quick Tools
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/create-agent', icon: Plus, label: 'Create new agent' },
                  { href: '/builder-earnings', icon: DollarSign, label: 'Earnings' },
                  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
                  { href: '/learning-logs', icon: Sparkles, label: 'Learning logs' },
                  { href: '/learning-logs/pending', icon: Bell, label: 'Pending approvals' },
                  { href: '/builder-settings', icon: GitBranch, label: 'CI / CD' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                      style={{ transitionTimingFunction: 'var(--ease-out-quart)' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: 'rgba(236, 72, 153, 0.8)' }} />
                      <span className="text-sm">{label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-30" />
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
