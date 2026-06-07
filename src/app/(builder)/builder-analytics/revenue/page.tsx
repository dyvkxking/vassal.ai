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

// Generate 30 days revenue data
function generateRevenueData(baseRevenue: number) {
  return Array.from({ length: 30 }, (_, i) => {
    const dayOfWeek = i % 7
    // Lower revenue on weekends
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1
    const trend = 1 + (i / 30) * 0.1 // Slight upward trend
    const noise = 0.8 + Math.random() * 0.4
    return Math.floor(baseRevenue * weekendMultiplier * trend * noise)
  })
}

// Revenue by category
const revenueCategories = [
  { category: "Task Execution", revenue: 45230, percentage: 42, trend: "+8%" },
  { category: "API Calls", revenue: 32100, percentage: 30, trend: "+5%" },
  { category: "Usage-based", revenue: 18950, percentage: 18, trend: "+12%" },
  { category: "Subscription", revenue: 11200, percentage: 10, trend: "+2%" },
]

// Price elasticity data
const elasticityData = [
  { pricePoint: "$0.10", demand: 100, revenue: 1000 },
  { pricePoint: "$0.15", demand: 85, revenue: 1275 },
  { pricePoint: "$0.20", demand: 70, revenue: 1400 },
  { pricePoint: "$0.25", demand: 55, revenue: 1375 },
  { pricePoint: "$0.30", demand: 40, revenue: 1200 },
  { pricePoint: "$0.35", demand: 28, revenue: 980 },
]

// Agent-specific configurations
const agentConfigs = {
  "agent-1": {
    baseRevenue: 450,
    totalRevenue: 12847,
    lastMonthRevenue: 11432,
  },
  "agent-2": {
    baseRevenue: 520,
    totalRevenue: 15682,
    lastMonthRevenue: 14210,
  },
  "agent-3": {
    baseRevenue: 680,
    totalRevenue: 21340,
    lastMonthRevenue: 19870,
  },
}

// Text-based bar chart for revenue
function RevenueBarChart({ data }: { data: number[] }) {
  const maxValue = Math.max(...data)
  const chars = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
  const weekLabels = ["W1", "W2", "W3", "W4"]

  const weekAverages = weekLabels.map((_, i) => {
    const start = i * 7
    const end = Math.min(start + 7, data.length)
    const slice = data.slice(start, end)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })

  return (
    <div className="font-mono text-xs">
      <div className="flex items-end gap-2">
        {weekAverages.map((avg, i) => {
          const heightBlocks = Math.floor((avg / maxValue) * 12)
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex flex-col-reverse">
                {Array.from({ length: 12 }, (_, j) => (
                  <span
                    key={j}
                    className={j < heightBlocks ? "text-primary" : "text-muted-foreground/20"}
                  >
                    █
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">{weekLabels[i]}</span>
              <span className="text-muted-foreground">${Math.floor(avg)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Revenue comparison component
function RevenueComparison({ current, previous }: { current: number; previous: number }) {
  const change = current - previous
  const percentage = ((change / previous) * 100).toFixed(1)
  const isPositive = change >= 0

  return (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">This Month</div>
        <div className="text-2xl font-bold">${current.toLocaleString()}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">Last Month</div>
        <div className="text-2xl font-bold text-muted-foreground">${previous.toLocaleString()}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">Change</div>
        <Badge variant={isPositive ? "default" : "destructive"} className="text-lg px-3 py-1">
          {isPositive ? "+" : ""}{percentage}%
        </Badge>
      </div>
    </div>
  )
}

// Category breakdown bar
function CategoryBar({ category, revenue, percentage, trend }: {
  category: string
  revenue: number
  percentage: number
  trend: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{category}</span>
        <div className="flex items-center gap-3">
          <Badge variant="outline">${revenue.toLocaleString()}</Badge>
          <Badge variant={trend.startsWith("+") ? "default" : "destructive"}>{trend}</Badge>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Price elasticity chart
function ElasticityChart({ data }: { data: { pricePoint: string; demand: number; revenue: number }[] }) {
  const maxDemand = Math.max(...data.map((d) => d.demand))
  const maxRevenue = Math.max(...data.map((d) => d.revenue))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-center gap-4 h-40">
        {data.map((d, i) => {
          const demandHeight = (d.demand / maxDemand) * 100
          const revenueHeight = (d.revenue / maxRevenue) * 100
          return (
            <div key={i} className="flex flex-col items-center gap-2 w-16">
              <div className="flex items-end gap-1 h-32">
                <div className="w-6 bg-blue-500/60 rounded-t" style={{ height: `${demandHeight}%` }} />
                <div className="w-6 bg-emerald-500/60 rounded-t" style={{ height: `${revenueHeight}%` }} />
              </div>
              <span className="text-xs font-medium">{d.pricePoint}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500/60 rounded" />
          <span className="text-muted-foreground">Demand</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500/60 rounded" />
          <span className="text-muted-foreground">Revenue</span>
        </div>
      </div>
    </div>
  )
}

// Revenue forecast chart
function ForecastChart({ data }: { data: { day: string; actual: number | null; forecast: number }[] }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.actual ?? 0, d.forecast)))

  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const actualHeight = d.actual ? (d.actual / maxValue) * 100 : 0
        const forecastHeight = (d.forecast / maxValue) * 100

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">{d.day}</span>
            <div className="flex-1 flex items-end h-8 gap-1">
              {d.actual && (
                <div
                  className="bg-primary rounded-t"
                  style={{ height: `${actualHeight}%`, width: "16px" }}
                />
              )}
              <div
                className={`rounded-t ${d.actual ? "bg-primary/40" : "bg-primary"}`}
                style={{ height: `${forecastHeight}%`, width: "16px" }}
              />
            </div>
            <span className="text-xs font-mono w-16 text-right">
              {d.actual ? `$${d.actual}` : d.forecast ? `~$${d.forecast}` : "-"}
            </span>
          </div>
        )
      })}
      <div className="flex items-center justify-end gap-4 text-xs mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded" />
          <span className="text-muted-foreground">Actual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary/40 rounded" />
          <span className="text-muted-foreground">Forecast</span>
        </div>
      </div>
    </div>
  )
}

export default function RevenueAnalyticsPage() {
  const [selectedAgent, setSelectedAgent] = useState("agent-1")

  const agent = mockAgents.find((a) => a.id === selectedAgent)!
  const config = agentConfigs[selectedAgent as keyof typeof agentConfigs]

  const revenueData = generateRevenueData(config.baseRevenue)

  // Forecast data for next 7 days
  const forecastData = [
    { day: "Mon", actual: 520, forecast: 520 },
    { day: "Tue", actual: 480, forecast: 480 },
    { day: "Wed", actual: 550, forecast: 550 },
    { day: "Thu", actual: null, forecast: 530 },
    { day: "Fri", actual: null, forecast: 560 },
    { day: "Sat", actual: null, forecast: 340 },
    { day: "Sun", actual: null, forecast: 290 },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Builder Revenue Analytics</h1>
        <p className="text-muted-foreground">
          Revenue performance and forecasting per agent
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

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                ${config.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Revenue (30d)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                ${Math.floor(config.totalRevenue / 30).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Daily Average</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">${config.baseRevenue}</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Revenue/Session</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <RevenueComparison current={config.totalRevenue} previous={config.lastMonthRevenue} />
        </CardContent>
      </Card>

      {/* Revenue Per Agent (Bar Chart) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue Per Agent (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RevenueBarChart data={revenueData} />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Weekly breakdown — bars show average daily revenue per week
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {revenueCategories.map((cat, i) => (
              <CategoryBar
                key={i}
                category={cat.category}
                revenue={cat.revenue}
                percentage={cat.percentage}
                trend={cat.trend}
              />
            ))}
          </CardContent>
        </Card>

        {/* Price Elasticity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Price Elasticity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ElasticityChart data={elasticityData} />
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Optimal price point: $0.20 — max revenue at sustainable demand
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ForecastChart data={forecastData} />
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Forecast Summary</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Projected Weekly Revenue</span>
                <div className="text-lg font-bold">$3,120</div>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence</span>
                <div className="text-lg font-bold">85%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Trend</span>
                <Badge variant="default">+4.2%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}