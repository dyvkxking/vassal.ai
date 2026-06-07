'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight,
  Wallet,
  Zap,
  CreditCard,
  Settings,
  Search,
  Sparkles,
  History,
  Heart,
  TrendingUp,
} from 'lucide-react'

const CLIENT_STATS = {
  totalSpent: 847.32,
  activeSessions: 2,
  totalSessions: 142,
  avgQualityScore: 94,
}

const CATEGORIES = [
  { name: 'DeFi', icon: '🏦', count: 234, accent: 'rgba(16, 185, 129, 0.6)' },
  { name: 'Analytics', icon: '📊', count: 189, accent: 'rgba(245, 158, 11, 0.6)' },
  { name: 'Infrastructure', icon: '🏗️', count: 156, accent: 'rgba(59, 130, 246, 0.6)' },
  { name: 'NFT', icon: '🖼️', count: 98, accent: 'rgba(236, 72, 153, 0.6)' },
  { name: 'DAO', icon: '🏛️', count: 87, accent: 'rgba(139, 92, 246, 0.6)' },
  { name: 'AI/ML', icon: '🤖', count: 83, accent: 'rgba(99, 102, 241, 0.6)' },
]

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

function StatCard({ title, value, subValue, accent }: { title: string; value: string; subValue?: string; accent: string }) {
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
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div className="relative">
        <div
          className="text-xs uppercase font-medium mb-2"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '2px' }}
        >
          {title}
        </div>
        <div
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
        >
          {value}
        </div>
        {subValue && (
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ClientLandingPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                'radial-gradient(ellipse at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)',
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
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6))' }}
            />
            <span
              className="text-xs uppercase font-medium"
              style={{ color: 'rgba(139, 92, 246, 0.8)', letterSpacing: '3px' }}
            >
              Client Workspace
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
                Welcome back
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: 'var(--font-body-light, inherit)',
                  lineHeight: '1.15em',
                  color: 'var(--muted-foreground)',
                }}
              >
                Find and rent specialized AI agents for any task — staked, audited, on-chain.
              </p>
            </div>
            <Button
              size="lg"
              className="btn-primary-transition shadow-lg group"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.85))',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: 'white',
              }}
              onClick={() => router.push('/launcher')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Launch New Session
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="container py-8 space-y-8">
        {/* STAT GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Spent" value={`$${CLIENT_STATS.totalSpent.toFixed(2)}`} subValue="lifetime spend" accent="rgba(139, 92, 246, 0.15)" />
          <StatCard title="Active Sessions" value={CLIENT_STATS.activeSessions.toString()} subValue="currently running" accent="rgba(16, 185, 129, 0.15)" />
          <StatCard title="Total Sessions" value={CLIENT_STATS.totalSessions.toString()} subValue="completed" accent="rgba(59, 130, 246, 0.15)" />
          <StatCard title="Quality Avg" value={CLIENT_STATS.avgQualityScore.toString()} subValue="across all sessions" accent="rgba(245, 158, 11, 0.15)" />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* QUICK LAUNCH */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Quick Launch
                </h2>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    color: 'rgba(139, 92, 246, 0.9)',
                  }}
                >
                  AI-matched
                </Badge>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Describe your task in natural language and we'll find the optimal agent.
              </p>
              <Link href="/launcher">
                <div
                  className="rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                    transitionTimingFunction: 'var(--ease-out-expo)',
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                    }}
                  >
                    <Search className="h-7 w-7 text-violet-300" />
                  </div>
                  <h3
                    className="font-medium mb-1"
                    style={{ fontFamily: 'var(--font-display-serif, inherit)', fontSize: '20px' }}
                  >
                    Find an Agent
                  </h3>
                  <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>
                    e.g. "analyze yield opportunities across Aave, Compound, and Curve"
                  </p>
                  <Button
                    className="btn-primary-transition"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    Open Launcher
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </GlassCard>

            {/* CATEGORIES */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Browse by Category
                </h2>
                <Link href="/browse-agents"><Button variant="ghost" size="sm">
                    All categories <ArrowRight className="ml-1 h-3 w-3" />
                  </Button></Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/browse-agents?category=${cat.name.toLowerCase()}`}
                  >
                    <div
                      className="p-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] group cursor-pointer relative overflow-hidden"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                    >
                      <div
                        className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `radial-gradient(circle, ${cat.accent} 0%, transparent 70%)` }}
                      />
                      <span className="text-2xl relative">{cat.icon}</span>
                      <div className="relative">
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {cat.count} agents
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* QUICK ACTIONS */}
            <GlassCard>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/launcher', icon: Zap, label: 'New Session' },
                  { href: '/session-history', icon: History, label: 'Session History' },
                  { href: '/favorites', icon: Heart, label: 'Favorites' },
                  { href: '/payments', icon: CreditCard, label: 'Payments' },
                  { href: '/trending', icon: TrendingUp, label: 'Trending' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
                      style={{ transitionTimingFunction: 'var(--ease-out-quart)' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: 'rgba(139, 92, 246, 0.8)' }} />
                      <span className="text-sm">{label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-30" />
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>

            {/* ACTIVE SESSIONS */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Active Sessions
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
                  {CLIENT_STATS.activeSessions} live
                </Badge>
              </div>
              {CLIENT_STATS.activeSessions > 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: CLIENT_STATS.activeSessions }).map((_, i) => (
                    <Link key={i} href={`/active-session/session-${i + 1}`}>
                      <div
                        className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/[0.04] cursor-pointer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          transitionTimingFunction: 'var(--ease-out-expo)',
                        }}
                      >
                        <div className="flex items-center gap-2.5">
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
                            <p className="font-medium text-sm">DeFi Pulse Scanner</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Running · 12m
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                  No active sessions
                </p>
              )}
            </GlassCard>

            {/* BUDGET */}
            <GlassCard>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                Budget Status
              </h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Monthly Budget</span>
                  <span className="font-medium font-mono">$500.00</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: '34%',
                      background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.7))',
                    }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                  $169.32 of $500 used · 31 days remaining
                </p>
              </div>
              <Link href="/budget"><Button
                variant="outline"
                size="sm"
                className="w-full btn-ghost-transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
               
              >
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Manage Budget
                </Button></Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
