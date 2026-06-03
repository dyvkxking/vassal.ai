"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock data for 3 agents
const mockAgents = [
  { id: "agent-1", name: "Customer Support Agent", status: "active" },
  { id: "agent-2", name: "Sales Assistant", status: "active" },
  { id: "agent-3", name: "Technical Support Bot", status: "inactive" },
]

// Generate 30 days of quality score data
function generateQualityScoreData(baseLine: number, variance: number) {
  return Array.from({ length: 30 }, (_, i) => {
    const trend = Math.sin(i / 5) * 5
    const noise = (Math.random() - 0.5) * variance
    return Math.max(60, Math.min(100, baseLine + trend + noise))
  })
}

// Generate weekly TPM data
function generateTPMData(contracted: number) {
  return Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    tpm: Math.floor(contracted * (0.8 + Math.random() * 0.4)),
    contracted,
  }))
}

// Generate latency heatmap data (7 days x 24 hours)
function generateLatencyHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => ({
    day,
    hours: Array.from({ length: 24 }, (_, hour) => {
      // Simulate higher latency during peak hours (9-17)
      const isPeakHour = hour >= 9 && hour <= 17
      const baseLatency = isPeakHour ? 250 : 80
      const variance = Math.random() * (isPeakHour ? 200 : 50)
      return Math.floor(baseLatency + variance)
    }),
  }))
}

// Generate rating data for 12 weeks
function generateRatingData(baseRating: number) {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    rating: Math.max(3, Math.min(5, baseRating + (Math.random() - 0.5) * 0.5)),
  }))
}

// Session data with costs
const sessionData = [
  { id: "sess-001", timestamp: "2026-06-02 14:32", duration: "4m 23s", cost: "$0.12", quality: 94 },
  { id: "sess-002", timestamp: "2026-06-02 12:15", duration: "7m 45s", cost: "$0.28", quality: 87 },
  { id: "sess-003", timestamp: "2026-06-01 09:22", duration: "2m 58s", cost: "$0.08", quality: 96 },
  { id: "sess-004", timestamp: "2026-05-31 16:45", duration: "12m 10s", cost: "$0.45", quality: 78 },
  { id: "sess-005", timestamp: "2026-05-30 11:08", duration: "5m 33s", cost: "$0.18", quality: 91 },
]

// Learning impact data
const learningImpactData = {
  "Customer Support Agent": { before: 72, after: 89 },
  "Sales Assistant": { before: 68, after: 84 },
  "Technical Support Bot": { before: 81, after: 92 },
}

// Client type distribution
const clientTypeData = {
  "Customer Support Agent": [
    { type: "Enterprise", count: 45, percentage: 38 },
    { type: "SMB", count: 38, percentage: 32 },
    { type: "Startup", count: 25, percentage: 21 },
    { type: "Individual", count: 10, percentage: 9 },
  ],
  "Sales Assistant": [
    { type: "Enterprise", count: 52, percentage: 44 },
    { type: "SMB", count: 35, percentage: 30 },
    { type: "Startup", count: 22, percentage: 19 },
    { type: "Individual", count: 8, percentage: 7 },
  ],
  "Technical Support Bot": [
    { type: "Enterprise", count: 61, percentage: 51 },
    { type: "SMB", count: 32, percentage: 27 },
    { type: "Startup", count: 18, percentage: 15 },
    { type: "Individual", count: 8, percentage: 7 },
  ],
}

// Failure mode analysis
const failureModeData = {
  "Customer Support Agent": [
    { reason: "Context window exceeded", count: 23, percentage: 31 },
    { reason: "Rate limit hit", count: 18, percentage: 24 },
    { reason: "Invalid tool response", count: 15, percentage: 20 },
    { reason: "Timeout", count: 12, percentage: 16 },
    { reason: "Other", count: 6, percentage: 9 },
  ],
  "Sales Assistant": [
    { reason: "Context window exceeded", count: 19, percentage: 28 },
    { reason: "Rate limit hit", count: 22, percentage: 32 },
    { reason: "Invalid tool response", count: 14, percentage: 20 },
    { reason: "Timeout", count: 9, percentage: 13 },
    { reason: "Other", count: 5, percentage: 7 },
  ],
  "Technical Support Bot": [
    { reason: "Context window exceeded", count: 31, percentage: 39 },
    { reason: "Rate limit hit", count: 12, percentage: 15 },
    { reason: "Invalid tool response", count: 20, percentage: 25 },
    { reason: "Timeout", count: 12, percentage: 16 },
    { reason: "Other", count: 4, percentage: 5 },
  ],
}

// Agent-specific configurations
const agentConfigs = {
  "agent-1": {
    baseQualityScore: 78,
    qualityVariance: 12,
    contractedTPM: 450,
    baseRating: 4.2,
    sessionCompletionRate: 87,
    avgLatency: 180,
  },
  "agent-2": {
    baseQualityScore: 82,
    qualityVariance: 8,
    contractedTPM: 380,
    baseRating: 4.5,
    sessionCompletionRate: 92,
    avgLatency: 145,
  },
  "agent-3": {
    baseQualityScore: 88,
    qualityVariance: 5,
    contractedTPM: 520,
    baseRating: 4.7,
    sessionCompletionRate: 95,
    avgLatency: 98,
  },
}

// Text-based line chart component
function TextLineChart({ data, maxValue = 100 }: { data: number[]; maxValue?: number }) {
  const chartHeight = 10
  const chars = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]

  const getBarChar = (value: number): string => {
    const normalized = Math.floor((value / maxValue) * 8)
    return chars[Math.min(normalized, 8)]
  }

  // Group into weeks for x-axis labels
  const weekLabels = ["W1", "W2", "W3", "W4"]
  const weeksPerLabel = Math.ceil(data.length / 4)
  const weekAverages = weekLabels.map((_, i) => {
    const start = i * weeksPerLabel
    const end = Math.min(start + weeksPerLabel, data.length)
    const slice = data.slice(start, end)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })

  const maxAvg = Math.max(...weekAverages)

  return (
    <div className="font-mono text-xs">
      <div className="flex items-end gap-1">
        {weekAverages.map((avg, i) => {
          const heightBlocks = Math.floor((avg / maxAvg) * chartHeight)
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="flex flex-col-reverse">
                {Array.from({ length: chartHeight }, (_, j) => (
                  <span
                    key={j}
                    className={
                      j < heightBlocks
                        ? "text-foreground"
                        : "text-muted-foreground/30"
                    }
                  >
                    {j < heightBlocks ? "█" : "▄"}
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">{weekLabels[i]}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 text-center text-muted-foreground">
        Weekly Average
      </div>
    </div>
  )
}

// Text-based bar chart for TPM vs Contracted
function TPMBarChart({ data }: { data: { week: string; tpm: number; contracted: number }[] }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.tpm, d.contracted)))

  return (
    <div className="font-mono text-xs">
      <div className="flex items-end gap-3">
        {data.map((d, i) => {
          const tpmHeight = Math.floor((d.tpm / maxValue) * 15)
          const contractedHeight = Math.floor((d.contracted / maxValue) * 15)
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex items-end gap-1">
                <div className="flex flex-col-reverse">
                  {Array.from({ length: 15 }, (_, j) => (
                    <span
                      key={j}
                      className={
                        j < tpmHeight ? "text-primary" : "text-transparent"
                      }
                    >
                      █
                    </span>
                  ))}
                </div>
                <div className="flex flex-col-reverse">
                  {Array.from({ length: 15 }, (_, j) => (
                    <span
                      key={j}
                      className={
                        j < contractedHeight
                          ? "text-muted-foreground"
                          : "text-transparent"
                      }
                    >
                      █
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground">{d.week}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-primary">█</span>
          <span className="text-muted-foreground">Actual TPM</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">█</span>
          <span className="text-muted-foreground">Contracted</span>
        </div>
      </div>
    </div>
  )
}

// Latency heatmap component
function LatencyHeatmap({ data }: { data: { day: string; hours: number[] }[] }) {
  const getColor = (latency: number) => {
    if (latency < 150) return "bg-green-500"
    if (latency < 300) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex gap-1 mb-2">
          <div className="w-8" />
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="w-6 text-center text-xs text-muted-foreground">
              {i % 6 === 0 ? `${i}` : ""}
            </div>
          ))}
        </div>
        {/* Rows */}
        {data.map((row, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-8 text-xs text-muted-foreground">{row.day}</div>
            {row.hours.map((latency, j) => (
              <div
                key={j}
                className={`w-6 h-4 rounded-sm ${getColor(latency)}`}
                title={`${latency}ms`}
              />
            ))}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center justify-end gap-3 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-green-500" />
            <span className="text-xs text-muted-foreground">&lt;150ms</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-yellow-500" />
            <span className="text-xs text-muted-foreground">150-300ms</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-red-500" />
            <span className="text-xs text-muted-foreground">&gt;300ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Circular progress component using text
function CircularProgress({ value }: { value: number }) {
  const segments = 20
  const filled = Math.floor((value / 100) * segments)
  const empty = segments - filled

  const chars = ["", "▕", "▖", "▗", "▘", "▙", "▚", "▛", "▜", "▝", "▞", "▟"]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
            strokeDasharray="339.292"
            strokeDashoffset="84.823"
            transform="rotate(-90 60 60)"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-primary"
            strokeDasharray="339.292"
            strokeDashoffset={339.292 - (339.292 * value) / 100}
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">Session Completion</span>
    </div>
  )
}

// Client type bar chart
function ClientTypeBarChart({ data }: { data: { type: string; count: number; percentage: number }[] }) {
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const barWidth = Math.floor((item.count / maxCount) * 20)
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 text-xs">{item.type}</div>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-4 bg-primary rounded-sm" style={{ width: `${barWidth * 5}px` }} />
              <span className="text-xs font-mono">{item.count}</span>
              <Badge variant="outline" className="text-xs">
                {item.percentage}%
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Before/After comparison component
function BeforeAfterComparison({ before, after }: { before: number; after: number }) {
  const change = after - before
  const isPositive = change >= 0

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-1">Before</span>
        <div className="w-20 h-20 rounded-full border-4 border-muted flex items-center justify-center">
          <span className="text-2xl font-bold">{before}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-1">After</span>
        <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
          <span className="text-2xl font-bold">{after}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-1">Improvement</span>
        <Badge variant={isPositive ? "default" : "destructive"} className="text-lg px-3 py-1">
          {isPositive ? "+" : ""}{change}%
        </Badge>
      </div>
    </div>
  )
}

// Failure mode list component
function FailureModeList({ data }: { data: { reason: string; count: number; percentage: number }[] }) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-medium">
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">{item.reason}</span>
              <span className="text-xs text-muted-foreground">{item.count}</span>
            </div>
            <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [selectedAgent, setSelectedAgent] = useState("agent-1")

  const agent = mockAgents.find((a) => a.id === selectedAgent)!
  const config = agentConfigs[selectedAgent as keyof typeof agentConfigs]

  const qualityData = generateQualityScoreData(config.baseQualityScore, config.qualityVariance)
  const tpmData = generateTPMData(config.contractedTPM)
  const latencyData = generateLatencyHeatmap()
  const ratingData = generateRatingData(config.baseRating)
  const clientData = clientTypeData[agent.name as keyof typeof clientTypeData]
  const failureData = failureModeData[agent.name as keyof typeof failureModeData]
  const learningImpact = learningImpactData[agent.name as keyof typeof learningImpactData]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Builder Analytics</h1>
        <p className="text-muted-foreground">
          Per-agent performance analytics and metrics
        </p>
      </div>

      {/* Agent Selector Tabs */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs value={selectedAgent} onValueChange={(v) => setSelectedAgent(v ?? selectedAgent)}>
            <TabsList>
              {mockAgents.map((a) => (
                <TabsTrigger key={a.id} value={a.id}>
                  {a.name}
                  <Badge
                    variant={a.status === "active" ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {a.status}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{config.sessionCompletionRate}%</div>
              <div className="text-sm text-muted-foreground mt-1">Session Completion Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{config.avgLatency}ms</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Latency</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{config.contractedTPM}</div>
              <div className="text-sm text-muted-foreground mt-1">Contracted TPM</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quality Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <TextLineChart data={qualityData} />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Last 30 days performance
            </div>
          </CardContent>
        </Card>

        {/* TPM vs Contracted */}
        <Card>
          <CardHeader>
            <CardTitle>TPM vs Contracted</CardTitle>
          </CardHeader>
          <CardContent>
            <TPMBarChart data={tpmData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Latency Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Latency Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <LatencyHeatmap data={latencyData} />
          </CardContent>
        </Card>

        {/* Session Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Session Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <CircularProgress value={config.sessionCompletionRate} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Average Rating Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Average Rating Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TextLineChart data={ratingData.map((r) => r.rating * 20)} maxValue={100} />
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              {ratingData.map((r, i) => (
                <span key={i}>{r.week}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Impact</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <BeforeAfterComparison before={learningImpact.before} after={learningImpact.after} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Per Session */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Per Session</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Quality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionData.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-xs">{session.id}</TableCell>
                    <TableCell className="text-xs">{session.timestamp}</TableCell>
                    <TableCell className="text-xs">{session.duration}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{session.cost}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={session.quality >= 90 ? "default" : session.quality >= 80 ? "secondary" : "destructive"}
                      >
                        {session.quality}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Client Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Client Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientTypeBarChart data={clientData} />
          </CardContent>
        </Card>
      </div>

      {/* Failure Mode Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Failure Mode Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <FailureModeList data={failureData} />
        </CardContent>
      </Card>
    </div>
  )
}