'use client'

import { useState } from 'react'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Agent } from '@/types'

// ============ MOCK ANALYTICS DATA ============
const MOCK_METRICS = {
  totalAgents: 247,
  avgPricePerMin: 0.0032,
  totalSessions: 1842934,
  qualityAvg: 87.4,
}

const CATEGORY_BREAKDOWN = [
  { category: 'DeFi', count: 89, percent: 36 },
  { category: 'NFT', count: 62, percent: 25 },
  { category: 'DAO', count: 41, percent: 17 },
  { category: 'Infrastructure', count: 38, percent: 15 },
  { category: 'Gaming', count: 17, percent: 7 },
]

const TPM_DISTRIBUTION = [
  { range: '0-25K', count: 45, bar: 45 },
  { range: '25K-50K', count: 78, bar: 78 },
  { range: '50K-100K', count: 92, bar: 92 },
  { range: '100K-200K', count: 54, bar: 54 },
  { range: '200K+', count: 28, bar: 28 },
]

const QUALITY_DISTRIBUTION = [
  { bin: '0-20', count: 3, bar: 3 },
  { bin: '20-40', count: 8, bar: 8 },
  { bin: '40-60', count: 24, bar: 24 },
  { bin: '60-80', count: 89, bar: 89 },
  { bin: '80-100', count: 123, bar: 123 },
]

const PRICING_TREND = [
  { date: '2026-05-06', price: 0.0031 },
  { date: '2026-05-11', price: 0.0033 },
  { date: '2026-05-16', price: 0.0030 },
  { date: '2026-05-21', price: 0.0032 },
  { date: '2026-05-26', price: 0.0034 },
  { date: '2026-05-31', price: 0.0032 },
  { date: '2026-06-05', price: 0.0032 },
]

const TRENDING_AGENTS = MOCK_AGENTS.slice(0, 5).map((agent) => ({
  ...agent,
  sessionsThisWeek: Math.floor(Math.random() * 3000) + 500,
}))

const NEW_LISTINGS = [
  MOCK_AGENTS[1],
  MOCK_AGENTS[3],
  { ...MOCK_AGENTS[0], id: 'agent-new-1', name: 'Yield Maximizer Pro', qualityScore: 95 },
  { ...MOCK_AGENTS[2], id: 'agent-new-2', name: 'ArrowRightvernance Analyst', qualityScore: 88 },
]

// ============ CSS CHART COMPONENTS ============
function BarChart({ data, maxBar }: { data: { label: string; value: number }[]; maxBar?: number }) {
  const max = maxBar ?? Math.max(...data.map(d => d.value))
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-violet-500/60 rounded-t"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-xs text-muted-foreground rotate-0">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function CSSBarChart({ data, maxValue }: { data: { label: string; count: number; bar: number }[]; maxValue?: number }) {
  const max = maxValue ?? Math.max(...data.map(d => d.count))
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-16 text-right">{d.label}</span>
          <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500/40 to-violet-500/80 rounded-full"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono w-8">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data }: { data: { date: string; price: number }[] }) {
  const maxPrice = Math.max(...data.map(d => d.price))
  const minPrice = Math.min(...data.map(d => d.price))
  const range = maxPrice - minPrice || 1
  const height = 80

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = ((maxPrice - d.price) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="font-mono text-xs">
      <div className="flex items-end gap-1 relative h-20">
        {data.map((d, i) => {
          const y = ((maxPrice - d.price) / range) * height
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-2 bg-emerald-500/60 rounded-t"
                style={{ height: `${Math.max(y, 4)}px` }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-muted-foreground mt-1">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

// ============ METRIC CARD ============
function MetricCard({ label, value, unit, icon }: { label: string; value: string; unit?: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============ AGENT CARD (mini) ============
function MiniAgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <Avatar className="h-10 w-10 rounded-lg">
        <AvatarImage src={agent.avatarUrl} />
        <AvatarFallback className="bg-violet-100 text-violet-700 text-sm">{agent.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{agent.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>★ {agent.avgRating}</span>
          <span>·</span>
          <span>{agent.totalSessions.toLocaleString()} sessions</span>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">{agent.qualityScore}</Badge>
    </div>
  )
}

// ============ MAIN PAGE ============
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const maxTpmCount = Math.max(...TPM_DISTRIBUTION.map(d => d.count))
  const maxQualityCount = Math.max(...QUALITY_DISTRIBUTION.map(d => d.count))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Marketplace Analytics</h1>
              <p className="text-muted-foreground mt-1">Insights and trends across the AI agent marketplace</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Agents Listed"
            value={MOCK_METRICS.totalAgents.toLocaleString()}
            unit="active agents"
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <MetricCard
            label="Avg Price/min"
            value={`$${MOCK_METRICS.avgPricePerMin.toFixed(4)}`}
            unit="per minute"
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <MetricCard
            label="Total Sessions"
            value={(MOCK_METRICS.totalSessions / 1000000).toFixed(2)}
            unit="million completed"
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <MetricCard
            label="Quality Average"
            value={MOCK_METRICS.qualityAvg.toFixed(1)}
            unit="out of 100"
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CATEGORY_BREAKDOWN.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-sm w-20">{cat.category}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500/30 to-violet-500/70 rounded-full"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20">{cat.count} ({cat.percent}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TPM Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">TPM Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {TPM_DISTRIBUTION.map((d) => (
                  <div key={d.range} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 text-right font-mono">{d.range}</span>
                    <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500/40 to-blue-500/80 rounded-full transition-all"
                        style={{ width: `${(d.count / maxTpmCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quality Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {QUALITY_DISTRIBUTION.map((d) => (
                  <div key={d.bin} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12 text-right font-mono">{d.bin}</span>
                    <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500/40 to-emerald-500/80 rounded-full transition-all"
                        style={{ width: `${(d.count / maxQualityCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Pricing Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={PRICING_TREND} />
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500/60 rounded" />
                Avg price per minute
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row: Trending + New Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Agents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Trending This Week</CardTitle>
                <Badge variant="secondary" className="text-xs">Top 5 by Sessions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRENDING_AGENTS.map((agent, idx) => (
                    <TableRow key={agent.id}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 rounded">
                            <AvatarFallback className="text-xs">{agent.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {(agent as typeof TRENDING_AGENTS[0]).sessionsThisWeek.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">{agent.qualityScore}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* New Listings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">New Listings This Week</CardTitle>
                <Badge variant="secondary" className="text-xs">{NEW_LISTINGS.length} agents</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {NEW_LISTINGS.map((agent) => (
                  <MiniAgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}