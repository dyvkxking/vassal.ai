"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock forecast data
const forecastScenarios = {
  conservative: {
    label: "Conservative",
    projections: [
      { period: "30 days", amount: 3800, sessions: 42, avgValue: 302 },
      { period: "60 days", amount: 7600, sessions: 41, avgValue: 305 },
      { period: "90 days", amount: 11200, sessions: 40, avgValue: 308 },
    ],
    growthRate: 2,
  },
  moderate: {
    label: "Moderate",
    projections: [
      { period: "30 days", amount: 4200, sessions: 47, avgValue: 298 },
      { period: "60 days", amount: 8700, sessions: 48, avgValue: 302 },
      { period: "90 days", amount: 13500, sessions: 50, avgValue: 306 },
    ],
    growthRate: 5,
  },
  optimistic: {
    label: "Optimistic",
    projections: [
      { period: "30 days", amount: 4600, sessions: 52, avgValue: 295 },
      { period: "60 days", amount: 9800, sessions: 54, avgValue: 298 },
      { period: "90 days", amount: 15800, sessions: 58, avgValue: 302 },
    ],
    growthRate: 10,
  },
}

const previousPeriods = [
  { period: "Last 30 days", amount: 3842.75, sessions: 47 },
  { period: "Previous 30 days", amount: 3510.20, sessions: 43 },
  { period: "30 days before", amount: 3280.50, sessions: 40 },
]

const assumptions = {
  conservative: { avgDailySessions: 41, avgSessionValue: 305, growthRate: 2 },
  moderate: { avgDailySessions: 48, avgSessionValue: 300, growthRate: 5 },
  optimistic: { avgDailySessions: 55, avgSessionValue: 296, growthRate: 10 },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export default function ForecastPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Earnings Forecast</h1>
          <p className="text-muted-foreground">
            Project your future earnings with scenario modeling
          </p>
        </div>
        <Button variant="outline" onClick={() => console.log("Export forecast")}>
          Export Forecast
        </Button>
      </div>

      {/* Scenario Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Forecast Scenario</CardTitle>
          <CardDescription>
            Select a scenario to see projected earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {(Object.keys(forecastScenarios) as Array<keyof typeof forecastScenarios>).map(
              (scenario) => (
                <Button
                  key={scenario}
                  variant="outline"
                  className="flex-1"
                  onClick={() => console.log("Selected scenario:", scenario)}
                >
                  {forecastScenarios[scenario].label}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projection Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>30/60/90 Day Earnings Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {forecastScenarios.moderate.projections.map((proj) => (
            <div key={proj.period} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{proj.period}</span>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">
                    {formatCurrency(proj.amount)}
                  </span>
                  <Badge variant="secondary">
                    {proj.sessions} sessions/day
                  </Badge>
                </div>
              </div>
              <Progress value={(proj.amount / 16000) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${proj.avgValue}/session avg</span>
                <span>{Math.round((proj.amount / 4200 - 1) * 100)}% vs baseline</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assumptions Display */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Daily Sessions
                </span>
                <span className="font-medium">48</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Session Value
                </span>
                <span className="font-medium">$300</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <Badge>5%</Badge>
              </div>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              Based on your last 90 days of performance data
            </div>
          </CardContent>
        </Card>

        {/* Compare to Previous Periods */}
        <Card>
          <CardHeader>
            <CardTitle>Compare to Previous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousPeriods.map((period, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{period.period}</div>
                    <div className="text-xs text-muted-foreground">
                      {period.sessions} sessions/day
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(period.amount)}</div>
                    {i === 0 && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(forecastScenarios) as Array<keyof typeof forecastScenarios>).map(
              (scenario) => {
                const data = forecastScenarios[scenario]
                const lastProj = data.projections[data.projections.length - 1]
                return (
                  <div
                    key={scenario}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{data.label}</span>
                      <Badge
                        variant={
                          scenario === "moderate"
                            ? "default"
                            : scenario === "optimistic"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {data.growthRate}% growth
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(lastProj.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      90-day projection
                    </div>
                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Sessions/day</span>
                        <span>{lastProj.sessions}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Session value</span>
                        <span>${lastProj.avgValue}</span>
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}