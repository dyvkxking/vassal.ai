'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_PROVIDER_NODES, MOCK_SESSIONS, getAgentById } from '@/lib/mock-data'
import {
  ArrowRight,
  Activity,
  Server,
  TrendingUp,
  Cpu,
  DollarSign,
  Settings,
  Wallet,
  LineChart,
} from 'lucide-react'

const DAILY_EARNINGS = [
  { day: 'Mon', amount: 12 },
  { day: 'Tue', amount: 18 },
  { day: 'Wed', amount: 15 },
  { day: 'Thu', amount: 22 },
  { day: 'Fri', amount: 19 },
  { day: 'Sat', amount: 28 },
  { day: 'Sun', amount: 25 },
]

const PROVIDER_STATS = {
  totalEarnings: 847.23,
  pendingPayout: 124.5,
  activeSessions: 3,
  uptime: 99.4,
  totalSessions: 12847,
  stakeAmount: 5000,
  lockedStake: 2000,
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
  trend?: 'up' | 'down' | 'neutral'
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
          <span
            className="text-xs uppercase font-medium"
            style={{ color: 'var(--muted-foreground)', letterSpacing: '2px' }}
          >
            {title}
          </span>
          <Icon className="h-4 w-4 opacity-50" />
        </div>
        <div
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
        >
          {value}
        </div>
        {subValue && (
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {trend && (
              <span
                style={{
                  color:
                    trend === 'up'
                      ? 'rgba(16, 185, 129, 0.95)'
                      : trend === 'down'
                      ? 'rgba(239, 68, 68, 0.95)'
                      : 'var(--muted-foreground)',
                }}
              >
                {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}
              </span>
            )}
            {subValue}
          </div>
        )}
      </div>
    </div>
  )
}

function EarningsChart() {
  const maxAmount = Math.max(...DAILY_EARNINGS.map((d) => d.amount))

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
          >
            7-Day Earnings
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Daily payout in USDC
          </p>
        </div>
        <Link href="/provider-earnings"><Button variant="ghost" size="sm">
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </Button></Link>
      </div>

      <div className="flex items-end gap-3 h-40">
        {DAILY_EARNINGS.map(({ day, amount }) => {
          const heightPct = (amount / maxAmount) * 100
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-xs font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                ${amount}
              </div>
              <div className="w-full relative" style={{ height: `${heightPct}%`, minHeight: '12px' }}>
                <div
                  className="absolute inset-0 rounded-md transition-all duration-300 group-hover:scale-y-105"
                  style={{
                    background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6) 0%, rgba(236, 72, 153, 0.3) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    transformOrigin: 'bottom',
                  }}
                />
              </div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {day}
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

export default function ProviderHomePage() {
  const node = MOCK_PROVIDER_NODES[0]

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                'radial-gradient(ellipse at 30% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
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
              style={{ background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6))' }}
            />
            <span
              className="text-xs uppercase font-medium"
              style={{ color: 'rgba(16, 185, 129, 0.8)', letterSpacing: '3px' }}
            >
              Provider Operations
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
                Node Operations
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: 'var(--font-body-light, inherit)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Operator: <span className="font-mono text-sm">{node.operator}</span> · Region:{' '}
                <span className="font-mono text-sm">{node.location}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/node"><Button
                variant="outline"
                className="btn-ghost-transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
               
              >
                  <Server className="mr-2 h-4 w-4" /> Node Status
                </Button></Link>
              <Link href="/sessions"><Button
                className="btn-primary-transition"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(59, 130, 246, 0.85))',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: 'white',
                }}
               
              >
                  <Activity className="mr-2 h-4 w-4" /> View Sessions
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
            title="Total Earnings"
            value={`$${PROVIDER_STATS.totalEarnings.toFixed(2)}`}
            subValue="+12.3% vs last week"
            trend="up"
            accent="rgba(16, 185, 129, 0.15)"
            icon={DollarSign}
          />
          <StatCard
            title="Pending Payout"
            value={`$${PROVIDER_STATS.pendingPayout.toFixed(2)}`}
            subValue="next: Mon 9:00"
            accent="rgba(245, 158, 11, 0.15)"
            icon={Wallet}
          />
          <StatCard
            title="Active Sessions"
            value={PROVIDER_STATS.activeSessions.toString()}
            subValue="3 GPUs in use"
            accent="rgba(139, 92, 246, 0.15)"
            icon={Activity}
          />
          <StatCard
            title="Uptime (30d)"
            value={`${PROVIDER_STATS.uptime}%`}
            subValue="exceeds SLA"
            trend="up"
            accent="rgba(59, 130, 246, 0.15)"
            icon={TrendingUp}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* EARNINGS CHART */}
            <EarningsChart />

            {/* ACTIVE SESSIONS */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Active Sessions
                </h2>
                <Link href="/sessions"><Button variant="ghost" size="sm">
                    All sessions <ArrowRight className="ml-1 h-3 w-3" />
                  </Button></Link>
              </div>
              <div className="space-y-2">
                {MOCK_SESSIONS.filter((s) => s.status === 'active').slice(0, 3).map((session) => {
                  const agent = getAgentById(session.agentId)
                  if (!agent) return null
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: 'rgba(16, 185, 129, 0.9)' }}
                          />
                          <div
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ background: 'rgba(16, 185, 129, 0.5)' }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                            {session.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            TPM
                          </div>
                          <div className="font-mono text-sm">
                            {(session.tpmUsed / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            Cost
                          </div>
                          <div className="font-mono text-sm" style={{ color: 'rgba(16, 185, 129, 0.9)' }}>
                            ${session.totalCost.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {MOCK_SESSIONS.filter((s) => s.status === 'active').length === 0 && (
                  <p className="text-sm text-center py-6" style={{ color: 'var(--muted-foreground)' }}>
                    No active sessions
                  </p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* NODE HEALTH */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Node Health
                </h2>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: 'rgba(16, 185, 129, 0.9)',
                  }}
                >
                  Online
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>GPU</span>
                  <span className="font-mono">{node.hardware.gpuModel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>VRAM</span>
                  <span className="font-mono">{node.hardware.gpuMemoryGb} GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>CPU Cores</span>
                  <span className="font-mono">{node.hardware.cpuCores}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>RAM</span>
                  <span className="font-mono">{node.hardware.ramGb} GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Bandwidth</span>
                  <span className="font-mono">{node.hardware.bandwidthMbps} Mbps</span>
                </div>
              </div>
              <Link href="/node"><Button
                variant="outline"
                size="sm"
                className="w-full mt-4 btn-ghost-transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
               
              >
                  <Cpu className="mr-2 h-3.5 w-3.5" />
                  Diagnostics
                </Button></Link>
            </GlassCard>

            {/* STAKE */}
            <GlassCard>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                Stake Position
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--muted-foreground)' }}>Total Stake</span>
                    <span className="font-mono font-semibold">
                      {PROVIDER_STATS.stakeAmount.toLocaleString()} MESH
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(PROVIDER_STATS.lockedStake / PROVIDER_STATS.stakeAmount) * 100}%`,
                        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.9), rgba(236, 72, 153, 0.7))',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Locked: {PROVIDER_STATS.lockedStake.toLocaleString()}</span>
                    <span>Available: {(PROVIDER_STATS.stakeAmount - PROVIDER_STATS.lockedStake).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/stake"><Button
                  variant="outline"
                  size="sm"
                  className="btn-ghost-transition"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                 
                >Manage</Button></Link>
                <Link href="/stake-manager"><Button
                  variant="outline"
                  size="sm"
                  className="btn-ghost-transition"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                 
                >History</Button></Link>
              </div>
            </GlassCard>

            {/* QUICK LINKS */}
            <GlassCard>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                Quick Links
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/earnings/payouts', icon: DollarSign, label: 'Payout History' },
                  { href: '/earnings/forecast', icon: LineChart, label: 'Earnings Forecast' },
                  { href: '/earnings/export', icon: ArrowRight, label: 'Export Statements' },
                  { href: '/provider-settings', icon: Settings, label: 'Node Settings' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                      style={{ transitionTimingFunction: 'var(--ease-out-quart)' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: 'rgba(16, 185, 129, 0.8)' }} />
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
