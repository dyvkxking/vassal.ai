'use client'

import Link from 'next/link'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TrendingUp, Sparkles, Award, Gem } from 'lucide-react'
import type { Agent } from '@/types'

// ============ DERIVED DATA ============
const ALL_AGENTS = MOCK_AGENTS

const TRENDING_NOW = [...ALL_AGENTS]
  .sort((a, b) => b.totalSessions - a.totalSessions)
  .slice(0, 8)

const FASTEST_GROWING = ALL_AGENTS
  .map(a => ({ ...a, qualityGain: 5 + ((a.qualityScore * 13) % 15) }))
  .sort((a, b) => b.qualityGain - a.qualityGain)
  .slice(0, 6)

const BEST_VALUE = [...ALL_AGENTS]
  .map(a => ({
    ...a,
    valueScore: a.qualityScore / ((a.pricing.pricePerMinute ?? 0.001) * 1000),
  }))
  .sort((a, b) => b.valueScore - a.valueScore)
  .slice(0, 6)

const TOP_RATED = ALL_AGENTS
  .filter(a => a.avgRating >= 4.5 && a.totalSessions >= 50)
  .sort((a, b) => b.avgRating - a.avgRating)
  .slice(0, 6)

const CATEGORY_LEADERS: Record<string, Agent[]> = {
  defi: ALL_AGENTS.filter(a => a.category === 'defi').slice(0, 4),
  nft: ALL_AGENTS.filter(a => a.category === 'nft').slice(0, 4),
  dao: ALL_AGENTS.filter(a => a.category === 'dao').slice(0, 4),
  infrastructure: ALL_AGENTS.filter(a => a.category === 'infrastructure').slice(0, 4),
}

// ============ TRENDING AGENT CARD ============
function TrendingAgentCard({ agent, rank, subtitle }: { agent: Agent; rank?: number; subtitle?: string }) {
  return (
    <Link href={`/agent/${agent.id}`}>
      <div
        className="group relative p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        {/* Rank badge */}
        {rank !== undefined && (
          <div
            className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background: rank <= 3
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(236, 72, 153, 0.6))'
                : 'rgba(139, 92, 246, 0.8)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {rank}
          </div>
        )}

        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarImage src={agent.avatarUrl} />
            <AvatarFallback
              className="text-lg font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {agent.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-sm truncate group-hover:text-violet-300 transition-colors"
              style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
            >
              {agent.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-0.5">
                <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {agent.avgRating}
              </span>
              <span>·</span>
              <span>{agent.totalSessions.toLocaleString()}</span>
            </div>
            {subtitle && (
              <Badge
                variant="secondary"
                className="text-xs mt-2"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: 'rgba(139, 92, 246, 0.9)',
                }}
              >
                {subtitle}
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
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
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              ${agent.pricing.pricePerMinute?.toFixed(4)}/m
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============ SECTION WRAPPER ============
function Section({
  title,
  subtitle,
  icon: Icon,
  children,
  columns = 3,
}: {
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  columns?: 2 | 3 | 4
}) {
  return (
    <div
      className="p-8 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
          >
            <Icon className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {children}
      </div>
    </div>
  )
}

export default function TrendingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ================================================
          PAGE HEADER — Premium Design DNA
          ================================================ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                'radial-gradient(ellipse at 20% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 50%)',
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

        <div className="container relative py-12 md:py-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.6))' }}
            />
            <span
              className="text-xs uppercase font-medium"
              style={{ color: 'rgba(245, 158, 11, 0.8)', letterSpacing: '3px' }}
            >
              Live Leaderboard
            </span>
          </div>

          <h1
            className="font-bold mb-3"
            style={{
              fontFamily: 'var(--font-display-serif, inherit)',
              fontSize: 'clamp(2.5rem, 6dvw, 5em)',
              lineHeight: '1em',
              letterSpacing: '-0.02em',
            }}
          >
            Trending Agents
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mb-6"
            style={{
              fontFamily: 'var(--font-body-light, inherit)',
              lineHeight: '1.15em',
              color: 'var(--muted-foreground)',
            }}
          >
            Discover the most popular, fastest-growing, and best-value AI agents
            on the network — updated every block.
          </p>

          <div className="inline-flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                {ALL_AGENTS.length}
              </span>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                tracked agents
              </span>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border)', opacity: 0.3 }} />
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                {ALL_AGENTS.reduce((sum, a) => sum + a.totalSessions, 0).toLocaleString()}
              </span>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                sessions this week
              </span>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border)', opacity: 0.3 }} />
            <Link href="/browse-agents"><Button
              variant="outline"
              className="btn-ghost-transition"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
             
            >Browse all agents</Button></Link>
          </div>
        </div>
      </div>

      {/* ================================================
          MAIN CONTENT
          ================================================ */}
      <div className="container py-8 space-y-8">
        <Section title="Trending Now" subtitle="Top agents by session volume this week" icon={TrendingUp} columns={4}>
          {TRENDING_NOW.map((agent, idx) => (
            <TrendingAgentCard key={agent.id} agent={agent} rank={idx + 1} />
          ))}
        </Section>

        <Section title="Fastest Growing" subtitle="Quality-score gains, week-over-week" icon={Sparkles} columns={3}>
          {FASTEST_GROWING.map(agent => (
            <TrendingAgentCard
              key={agent.id}
              agent={agent}
              subtitle={`+${(agent as Agent & { qualityGain: number }).qualityGain.toFixed(1)} pts`}
            />
          ))}
        </Section>

        <Section title="Best Value" subtitle="Optimal price-to-quality ratio" icon={Gem} columns={3}>
          {BEST_VALUE.map(agent => (
            <TrendingAgentCard key={agent.id} agent={agent} subtitle="Best Value" />
          ))}
        </Section>

        <Section title="Top Rated" subtitle="4.5★+ with 50+ completed sessions" icon={Award} columns={3}>
          {TOP_RATED.length > 0 ? (
            TOP_RATED.map(agent => <TrendingAgentCard key={agent.id} agent={agent} subtitle="Top Rated" />)
          ) : (
            <div className="col-span-full text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              No agents meet the criteria yet
            </div>
          )}
        </Section>

        {/* Category Leaderboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(CATEGORY_LEADERS).map(([category, agents]) => (
            <div
              key={category}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-base capitalize flex items-center gap-2 font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  <Badge
                    variant="secondary"
                    className="capitalize"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: 'rgba(139, 92, 246, 0.9)',
                    }}
                  >
                    {category}
                  </Badge>
                  Leaderboard
                </h3>
              </div>
              <div className="space-y-2">
                {agents.length > 0 ? (
                  agents.map((agent, idx) => (
                    <Link key={agent.id} href={`/agent/${agent.id}`}>
                      <div
                        className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-white/[0.04]"
                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                      >
                        <span className="text-xs font-mono w-4" style={{ color: 'var(--muted-foreground)' }}>
                          {idx + 1}
                        </span>
                        <Avatar className="h-8 w-8 rounded">
                          <AvatarFallback
                            className="text-xs"
                            style={{
                              background: 'rgba(139, 92, 246, 0.15)',
                              color: 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            {agent.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{agent.name}</div>
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            <span>★ {agent.avgRating}</span>
                            <span>·</span>
                            <span>{agent.totalSessions.toLocaleString()} sessions</span>
                          </div>
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
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    No agents in this category
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
