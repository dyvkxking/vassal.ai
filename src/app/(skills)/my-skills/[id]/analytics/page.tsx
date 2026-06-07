'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
} from '@/components/ui'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { getSkillById, MOCK_USER_PROFILE } from '@/lib/mock-data'

// Mock analytics data
const generateAnalyticsData = (skillId: string) => {
  const baseInvocations = 15000
  return {
    totalInvocations: baseInvocations,
    invocations30Day: Math.floor(baseInvocations * 0.42),
    revenue30Day: 247.5,
    uniqueAgents: Math.floor(baseInvocations / 12500),
    errorRate: 0.023,
    dailyInvocations: [
      { day: 'Mon', count: 1200 },
      { day: 'Tue', count: 1450 },
      { day: 'Wed', count: 1380 },
      { day: 'Thu', count: 1520 },
      { day: 'Fri', count: 1690 },
      { day: 'Sat', count: 980 },
      { day: 'Sun', count: 820 },
    ],
    topAgents: [
      { agentId: 'agent-001', name: 'DeFi Pulse Scanner', invocations: 4200 },
      { agentId: 'agent-004', name: 'Wallet Intelligence', invocations: 3100 },
      { agentId: 'agent-006', name: 'MEV Detector', invocations: 2800 },
      { agentId: 'agent-002', name: 'NFT Collection Analyzer', invocations: 1900 },
      { agentId: 'agent-005', name: 'Token Price Oracle', invocations: 1500 },
    ],
    revenueByDay: [
      { day: 'Mon', revenue: 18.5 },
      { day: 'Tue', revenue: 22.3 },
      { day: 'Wed', revenue: 21.2 },
      { day: 'Thu', revenue: 23.4 },
      { day: 'Fri', revenue: 26.0 },
      { day: 'Sat', revenue: 15.1 },
      { day: 'Sun', revenue: 12.6 },
    ],
    adoptionByWeek: [
      { week: 'W1', agents: 12 },
      { week: 'W2', agents: 18 },
      { week: 'W3', agents: 24 },
      { week: 'W4', agents: 31 },
      { week: 'W5', agents: 38 },
    ],
    geographicDistribution: [
      { region: 'North America', percentage: 45 },
      { region: 'Europe', percentage: 32 },
      { region: 'Asia Pacific', percentage: 18 },
      { region: 'Other', percentage: 5 },
    ],
  }
}

function ASCIIBarChart({ data, maxValue, height = 10 }: { data: { day: string; count: number }[]; maxValue: number; height?: number }) {
  const bars = data.map(d => ({
    day: d.day,
    barHeight: Math.round((d.count / maxValue) * height),
  }))

  return (
    <div className="font-mono text-xs leading-none">
      <div className="flex items-end gap-3 h-32">
        {bars.map((bar) => (
          <div key={bar.day} className="flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse justify-end" style={{ height: `${height * 6}px` }}>
              <div
                className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${bar.barHeight * 6}px` }}
              />
            </div>
            <span className="text-muted-foreground">{bar.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineChart({ data, maxValue }: { data: { day: string; revenue: number }[]; maxValue: number }) {
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.revenue / maxValue) * 100,
  }))

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#lineGradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  )
}

function ErrorRateGauge({ rate }: { rate: number }) {
  const percentage = rate * 100
  const color = percentage < 1 ? 'text-emerald-500' : percentage < 5 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-muted"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
          />
          <path
            className={color}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${color}`}>{percentage.toFixed(2)}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-2">Error Rate</span>
    </div>
  )
}

export default function SkillAnalyticsPage() {
  const params = useParams()
  const skillId = params.id as string
  const skill = getSkillById(skillId)
  const analytics = generateAnalyticsData(skillId)

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Skill Not Found</CardTitle>
            <CardDescription>
              The skill you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-skills">Back to My Skills</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = skill.author === MOCK_USER_PROFILE.address

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view analytics for this skill.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-skills">Back to My Skills</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/my-skills">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{skill.name} — Analytics</h1>
              <p className="text-sm text-muted-foreground">Performance metrics and insights</p>
            </div>
            <Badge variant="outline">v{skill.version}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{analytics.totalInvocations.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Invocations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{analytics.invocations30Day.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">30-Day Invocations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold font-mono">{analytics.revenue30Day.toFixed(4)} MESH</div>
              <div className="text-sm text-muted-foreground">30-Day Revenue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{analytics.uniqueAgents}</div>
              <div className="text-sm text-muted-foreground">Unique Agents</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 30-Day Invocations Chart */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Invocations</CardTitle>
              <CardDescription>Daily call volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ASCIIBarChart
                data={analytics.dailyInvocations}
                maxValue={Math.max(...analytics.dailyInvocations.map(d => d.count))}
              />
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue in MESH</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={analytics.revenueByDay}
                maxValue={Math.max(...analytics.revenueByDay.map(d => d.revenue))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Adoption Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Adoption Trend</CardTitle>
              <CardDescription>Unique agents over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {analytics.adoptionByWeek.map((w, idx) => (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                      style={{ height: `${(w.agents / 40) * 120}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{w.week}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Error Rate</CardTitle>
              <CardDescription>Failed invocations percentage</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
              <ErrorRateGauge rate={analytics.errorRate} />
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Usage by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.geographicDistribution.map((geo) => (
                <div key={geo.region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{geo.region}</span>
                    <span className="font-medium">{geo.percentage}%</span>
                  </div>
                  <Progress value={geo.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Using Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Using Agents</CardTitle>
            <CardDescription>Agents with most invocations of this skill</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Invocations</TableHead>
                  <TableHead>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topAgents.map((agent, idx) => (
                  <TableRow key={agent.agentId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agent.invocations.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(agent.invocations / analytics.topAgents[0].invocations) * 100}
                          className="w-20 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {((agent.invocations / analytics.totalInvocations) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}