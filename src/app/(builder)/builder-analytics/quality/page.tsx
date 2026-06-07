"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Generate quality score trend data (12 weeks)
function generateQualityTrendData(baseLine: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const trend = i * 0.8 // Upward trend
    const noise = (Math.random() - 0.5) * 6
    return Math.max(60, Math.min(100, baseLine + trend + noise))
  })
}

// SLA compliance heatmap data (7 days x 24 hours)
function generateSLAHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => ({
    day,
    hours: Array.from({ length: 24 }, (_, hour) => {
      // Simulate SLA compliance (green = compliant, yellow = marginal, red = breach)
      const isPeakHour = hour >= 9 && hour <= 17
      const isWeekend = day === "Sat" || day === "Sun"
      const baseCompliance = isWeekend ? 95 : isPeakHour ? 88 : 94
      const variance = Math.random() * 10
      return Math.min(100, baseCompliance + (Math.random() > 0.7 ? -variance : variance))
    }),
  }))
}

// Client rating distribution
const ratingDistribution = [
  { rating: 5, count: 145, percentage: 42 },
  { rating: 4, count: 98, percentage: 28 },
  { rating: 3, count: 52, percentage: 15 },
  { rating: 2, count: 31, percentage: 9 },
  { rating: 1, count: 21, percentage: 6 },
]

// Learning impact data
const learningImpactData = {
  "Customer Support Agent": [
    { week: "W1", before: 72, after: 74 },
    { week: "W2", before: 71, after: 76 },
    { week: "W4", before: 73, after: 80 },
    { week: "W6", before: 72, after: 84 },
    { week: "W8", before: 74, after: 87 },
    { week: "W10", before: 73, after: 89 },
  ],
  "Sales Assistant": [
    { week: "W1", before: 68, after: 70 },
    { week: "W2", before: 67, after: 73 },
    { week: "W4", before: 69, after: 78 },
    { week: "W6", before: 70, after: 81 },
    { week: "W8", before: 69, after: 83 },
    { week: "W10", before: 71, after: 84 },
  ],
  "Technical Support Bot": [
    { week: "W1", before: 81, after: 82 },
    { week: "W2", before: 80, after: 84 },
    { week: "W4", before: 82, after: 87 },
    { week: "W6", before: 81, after: 90 },
    { week: "W8", before: 83, after: 91 },
    { week: "W10", before: 82, after: 92 },
  ],
}

// Improvement recommendations
const recommendations = [
  {
    priority: "high",
    category: "Latency",
    recommendation: "Implement response caching for frequently accessed data",
    impact: "+12% quality",
  },
  {
    priority: "medium",
    category: "Context",
    recommendation: "Reduce context window usage by optimizing prompts",
    impact: "+8% quality",
  },
  {
    priority: "medium",
    category: "Training",
    recommendation: "Add more examples of edge-case handling in training data",
    impact: "+6% quality",
  },
  {
    priority: "low",
    category: "Monitoring",
    recommendation: "Add real-time quality monitoring alerts",
    impact: "+3% quality",
  },
]

// Agent-specific configurations
const agentConfigs = {
  "agent-1": {
    baseQualityScore: 78,
    currentScore: 89,
    improvementRate: 17,
    slaCompliance: 94,
  },
  "agent-2": {
    baseQualityScore: 82,
    currentScore: 84,
    improvementRate: 12,
    slaCompliance: 91,
  },
  "agent-3": {
    baseQualityScore: 88,
    currentScore: 92,
    improvementRate: 8,
    slaCompliance: 97,
  },
}

// Text-based line chart for quality trend
function QualityTrendChart({ data }: { data: number[] }) {
  const chars = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
  const weekLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]
  const maxValue = 100

  return (
    <div className="font-mono text-xs">
      <div className="flex items-end gap-1">
        {data.map((value, i) => {
          const normalized = Math.floor((value / maxValue) * 8)
          const heightBlocks = Math.min(normalized, 8)
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="flex flex-col-reverse">
                {Array.from({ length: 10 }, (_, j) => (
                  <span
                    key={j}
                    className={j < heightBlocks ? "text-primary" : "text-muted-foreground/20"}
                  >
                    █
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground mt-1">{weekLabels[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Learning impact before/after chart
function LearningImpactChart({ data }: { data: { week: string; before: number; after: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((row, i) => {
        const beforeHeight = (row.before / 100) * 100
        const afterHeight = (row.after / 100) * 100
        const improvement = row.after - row.before

        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{row.week}</span>
            <div className="flex-1 flex items-end gap-1 h-16">
              <div
                className="w-6 bg-muted rounded-t"
                style={{ height: `${beforeHeight}%` }}
                title={`Before: ${row.before}%`}
              />
              <div
                className="w-6 bg-primary rounded-t"
                style={{ height: `${afterHeight}%` }}
                title={`After: ${row.after}%`}
              />
            </div>
            <Badge variant={improvement > 10 ? "default" : "secondary"} className="text-xs">
              +{improvement}%
            </Badge>
          </div>
        )
      })}
      <div className="flex items-center justify-center gap-4 text-xs mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-muted rounded" />
          <span className="text-muted-foreground">Before Learning</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded" />
          <span className="text-muted-foreground">After Learning</span>
        </div>
      </div>
    </div>
  )
}

// SLA compliance heatmap
function SLAHeatmap({ data }: { data: { day: string; hours: number[] }[] }) {
  const getColor = (compliance: number) => {
    if (compliance >= 95) return "bg-emerald-500"
    if (compliance >= 85) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex gap-1 mb-2">
          <div className="w-8" />
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="w-6 text-center text-xs text-muted-foreground">
              {i % 6 === 0 ? `${i}` : ""}
            </div>
          ))}
        </div>
        {data.map((row, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-8 text-xs text-muted-foreground">{row.day}</div>
            {row.hours.map((compliance, j) => (
              <div
                key={j}
                className={`w-6 h-4 rounded-sm ${getColor(compliance)}`}
                title={`${compliance.toFixed(1)}% SLA`}
              />
            ))}
          </div>
        ))}
        <div className="flex items-center justify-end gap-3 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-emerald-500" />
            <span className="text-xs text-muted-foreground">95%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-amber-500" />
            <span className="text-xs text-muted-foreground">85-95%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-red-500" />
            <span className="text-xs text-muted-foreground">&lt;85%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rating distribution bars
function RatingDistributionChart({ data }: { data: { rating: number; count: number; percentage: number }[] }) {
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="space-y-3">
      {[...data].reverse().map((item, i) => {
        const barWidth = (item.count / maxCount) * 100
        const index = data.length - 1 - i
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{item.rating}</span>
              <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-4 bg-amber-500/30 rounded-sm" style={{ width: `${barWidth}%` }} />
              <span className="text-xs font-mono">{item.count}</span>
              <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function QualityAnalyticsPage() {
  const [selectedAgent, setSelectedAgent] = useState("agent-1")

  const agent = mockAgents.find((a) => a.id === selectedAgent)!
  const config = agentConfigs[selectedAgent as keyof typeof agentConfigs]

  const qualityTrendData = generateQualityTrendData(config.baseQualityScore)
  const slaHeatmapData = generateSLAHeatmap()
  const impactData = learningImpactData[agent.name as keyof typeof learningImpactData]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Builder Quality Analytics</h1>
        <p className="text-muted-foreground">
          Quality metrics and improvement analysis per agent
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

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{config.currentScore}%</div>
              <div className="text-sm text-muted-foreground mt-1">Current Quality Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">+{config.improvementRate}%</div>
              <div className="text-sm text-muted-foreground mt-1">Improvement Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{config.slaCompliance}%</div>
              <div className="text-sm text-muted-foreground mt-1">SLA Compliance</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">4.2</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Client Rating</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Score Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quality Score Trend (12 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <QualityTrendChart data={qualityTrendData} />
          <div className="text-xs text-muted-foreground text-center mt-4">
            Steady upward trend showing positive learning impact
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Learning Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningImpactChart data={impactData} />
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Learning Effectiveness</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Average Improvement</span>
                <Badge variant="default">+{config.improvementRate}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SLA Compliance Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <SLAHeatmap data={slaHeatmapData} />
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Target: 95% SLA compliance — current avg: {config.slaCompliance}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Client Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Client Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingDistributionChart data={ratingDistribution} />
            <div className="mt-4 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <span className="text-xs text-muted-foreground">Average Rating</span>
                <div className="text-2xl font-bold">4.2</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Total Reviews</span>
                <div className="text-2xl font-bold">347</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">5-Star Rate</span>
                <div className="text-2xl font-bold">42%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Improvement Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge
                  variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"}
                  className="mt-0.5"
                >
                  {rec.priority}
                </Badge>
                <div className="flex-1">
                  <div className="text-sm font-medium">{rec.category}</div>
                  <div className="text-xs text-muted-foreground mt-1">{rec.recommendation}</div>
                </div>
                <Badge variant="outline" className="text-emerald-600">
                  {rec.impact}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}