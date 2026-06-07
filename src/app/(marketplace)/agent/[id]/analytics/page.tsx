"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { getAgentById } from "@/lib/mock-data"
import {
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowUpRight,
  Activity,
  Zap,
} from "lucide-react"

// Mock analytics data
const qualityTrend = [
  { date: "2026-05-01", score: 91 },
  { date: "2026-05-08", score: 92 },
  { date: "2026-05-15", score: 90 },
  { date: "2026-05-22", score: 93 },
  { date: "2026-05-29", score: 94 },
  { date: "2026-06-05", score: 94 },
]

const sessionHistory = [
  { date: "2026-05-01", sessions: 142 },
  { date: "2026-05-08", sessions: 156 },
  { date: "2026-05-15", sessions: 148 },
  { date: "2026-05-22", sessions: 167 },
  { date: "2026-05-29", sessions: 178 },
  { date: "2026-06-05", sessions: 183 },
]

const uptimeData = {
  value: 99.4,
  change: 0.2,
  history: [
    { date: "2026-05-01", uptime: 99.1 },
    { date: "2026-05-08", uptime: 99.3 },
    { date: "2026-05-15", uptime: 98.9 },
    { date: "2026-05-22", uptime: 99.5 },
    { date: "2026-05-29", uptime: 99.4 },
    { date: "2026-06-05", uptime: 99.4 },
  ],
}

const ratingsDistribution = [
  { rating: 5, count: 892 },
  { rating: 4, count: 234 },
  { rating: 3, count: 45 },
  { rating: 2, count: 12 },
  { rating: 1, count: 8 },
]

function formatNumber(num: number): string {
  return num.toLocaleString()
}

export default function AgentAnalyticsPage() {
  const params = useParams()
  const agentId = params.id as string
  const agent = getAgentById(agentId)

  if (!agent) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="py-12">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The agent you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/browse-agents">Browse Agents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const maxRating = Math.max(...ratingsDistribution.map((r) => r.count))

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <Badge>{agent.category}</Badge>
            </div>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
          <Button asChild>
            <Link href={`/agent/${agent.id}?rent=true`}>Rent This Agent</Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">Quality Score</span>
              </div>
              <div className="text-2xl font-bold">{agent.qualityScore}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Sessions</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(agent.totalSessions)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Avg Latency</span>
              </div>
              <div className="text-2xl font-bold">{agent.slaParams.latencyThresholdMs}ms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold">{agent.avgRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quality Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quality Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityTrend.map((item, i) => (
                <div key={item.date} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1">
                    <Progress value={(item.score / 100) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Count History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Session Count History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionHistory.map((item) => (
                <div key={item.date} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1">
                    <Progress
                      value={(item.sessions / Math.max(...sessionHistory.map((s) => s.sessions))) * 100}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {item.sessions}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Uptime Percentage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Uptime Percentage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">{uptimeData.value}%</div>
              <div className="flex items-center justify-center gap-1 text-sm text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                <span>+{uptimeData.change}% from last period</span>
              </div>
            </div>
            <div className="space-y-2">
              {uptimeData.history.map((item) => (
                <div key={item.date} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1">
                    <Progress value={item.uptime} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {item.uptime}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Ratings Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Client Ratings Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingsDistribution.slice().reverse().map((item) => (
                <div key={item.rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <Progress value={(item.count / maxRating) * 100} className="h-3" />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Parameters */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>SLA Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Latency Threshold</TableHead>
                <TableHead>TPM Cap</TableHead>
                <TableHead>Uptime Guarantee</TableHead>
                <TableHead>Min Stake Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{agent.slaParams.latencyThresholdMs}ms</TableCell>
                <TableCell>{formatNumber(agent.slaParams.tpmCap)}</TableCell>
                <TableCell>{agent.slaParams.uptimeGuaranteePercent}%</TableCell>
                <TableCell>{agent.slaParams.minStakeRequired} MESH</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="mt-6 bg-primary/5">
        <CardContent className="py-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to use this agent?</h3>
          <p className="text-muted-foreground mb-4">
            Start a session with {agent.name} and experience the quality firsthand.
          </p>
          <Button size="lg" asChild>
            <Link href={`/agent/${agent.id}?rent=true`}>Rent This Agent</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}