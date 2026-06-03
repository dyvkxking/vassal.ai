"use client"

import * as React from "react"
import { GOVERNANCE_STATS, MOCK_PROPOSALS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toFixed(1)
}

function ASCIILineChart({ data, width = 60, height = 10 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
  const maxVal = Math.max(...data.map((d) => d.value))
  const minVal = Math.min(...data.map((d) => d.value))
  const range = maxVal - minVal || 1

  const points = data.map((d, i) => {
    const x = Math.round(((i) / (data.length - 1)) * (width - 1))
    const y = Math.round(((maxVal - d.value) / range) * (height - 1))
    return [x, y] as [number, number]
  })

  const grid: string[][] = Array.from({ length: height }, () => Array(width).fill(" "))

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1)
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const x = Math.round(x1 + (x2 - x1) * t)
      const y = Math.round(y1 + (y2 - y1) * t)
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = "*"
      }
    }
  }

  return (
    <div className="font-mono text-xs">
      <div className="mb-1">Value</div>
      <div className="border border-border p-2">
        {grid.map((row, i) => (
          <div key={i}>{row.join("")}</div>
        ))}
      </div>
      <div className="mt-1 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="text-muted-foreground">{d.label}</span>
        ))}
      </div>
    </div>
  )
}

function ASCIIBarChart({ data, maxWidth = 40 }: { data: { label: string; value: number; color?: string }[]; maxWidth?: number }) {
  const maxVal = Math.max(...data.map((d) => d.value))

  return (
    <div className="font-mono text-xs space-y-1">
      {data.map((d, i) => {
        const barWidth = Math.round((d.value / maxVal) * maxWidth)
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-16 text-right">{d.label}</span>
            <span className="text-muted-foreground">|</span>
            <span className="bg-primary h-3" style={{ width: `${barWidth * 2}px`, display: "inline-block" }} />
            <span>{formatNumber(d.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

function ASCIIPieChart({ forPercent, againstPercent, abstainPercent }: { forPercent: number; againstPercent: number; abstainPercent: number }) {
  return (
    <div className="font-mono text-xs">
      <div className="text-center mb-2">Vote Distribution</div>
      <div className="flex justify-center gap-1">
        <div className="bg-green-500/80 h-6 text-center text-white" style={{ width: `${forPercent / 2}%`, minWidth: forPercent > 0 ? "2px" : "0" }} title={`For: ${forPercent.toFixed(1)}%`} />
        <div className="bg-red-500/80 h-6 text-center text-white" style={{ width: `${againstPercent / 2}%`, minWidth: "2px" }} title={`Against: ${againstPercent.toFixed(1)}%`} />
        <div className="bg-gray-500/80 h-6 text-center text-white" style={{ width: `${abstainPercent / 2}%`, minWidth: "2px" }} title={`Abstain: ${abstainPercent.toFixed(1)}%`} />
      </div>
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <span className="text-green-500">For {forPercent.toFixed(0)}%</span>
        <span className="text-red-500">Against {againstPercent.toFixed(0)}%</span>
        <span className="text-gray-500">Abstain {abstainPercent.toFixed(0)}%</span>
      </div>
    </div>
  )
}

export default function GovernanceAnalyticsPage() {
  const participationTrend = [
    { label: "Jan", value: 62 },
    { label: "Feb", value: 58 },
    { label: "Mar", value: 65 },
    { label: "Apr", value: 70 },
    { label: "May", value: 68 },
    { label: "Jun", value: 72 },
  ]

  const successRateTrend = [
    { label: "Jan", value: 68 },
    { label: "Feb", value: 72 },
    { label: "Mar", value: 65 },
    { label: "Apr", value: 78 },
    { label: "May", value: 75 },
    { label: "Jun", value: 82 },
  ]

  const voterTurnout = [
    { label: "Week 1", value: 45 },
    { label: "Week 2", value: 52 },
    { label: "Week 3", value: 48 },
    { label: "Week 4", value: 61 },
  ]

  const totalVotes = MOCK_PROPOSALS.reduce((sum, p) => sum + p.votesFor + p.votesAgainst + p.votesAbstain, 0)
  const totalFor = MOCK_PROPOSALS.reduce((sum, p) => sum + p.votesFor, 0)
  const totalAgainst = MOCK_PROPOSALS.reduce((sum, p) => sum + p.votesAgainst, 0)
  const totalAbstain = MOCK_PROPOSALS.reduce((sum, p) => sum + p.votesAbstain, 0)
  const forPercent = totalVotes > 0 ? (totalFor / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (totalAgainst / totalVotes) * 100 : 0
  const abstainPercent = totalVotes > 0 ? (totalAbstain / totalVotes) * 100 : 0

  const mostContested = [...MOCK_PROPOSALS]
    .map((p) => ({
      ...p,
      margin: Math.abs(p.votesFor - p.votesAgainst),
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5)

  const topDelegators = [
    { label: "0xDeleg1...abc", value: 4500000 },
    { label: "0xDeleg2...def", value: 3200000 },
    { label: "0xDeleg3...ghi", value: 2800000 },
    { label: "0xDeleg4...jkl", value: 2100000 },
    { label: "0xDeleg5...mno", value: 1800000 },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Governance Analytics</h1>
        <p className="text-muted-foreground">Monitor participation and voting trends</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{GOVERNANCE_STATS.totalProposals}</div>
            <div className="text-sm text-muted-foreground">Total Proposals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{GOVERNANCE_STATS.participationRate}%</div>
            <div className="text-sm text-muted-foreground">Participation Rate</div>
            <div className="text-xs text-green-500 mt-1">+3.2% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{GOVERNANCE_STATS.proposalSuccessRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{GOVERNANCE_STATS.avgVoteMargin}%</div>
            <div className="text-sm text-muted-foreground">Avg Vote Margin</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Participation Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Participation Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ASCIILineChart data={participationTrend} />
            <div className="mt-4 text-center text-sm">
              <span className="text-green-500">+10%</span> increase over 6 months
            </div>
          </CardContent>
        </Card>

        {/* Vote Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ASCIIPieChart forPercent={forPercent} againstPercent={againstPercent} abstainPercent={abstainPercent} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Based on {formatNumber(totalVotes)} total votes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Contested Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Most Contested Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostContested.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      proposal.status === "passed" ? "bg-blue-500" :
                      proposal.status === "failed" ? "bg-red-500" :
                      proposal.status === "active" ? "bg-green-500" : "bg-gray-500"
                    } text-white`}>
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(proposal.margin)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Proposal Success Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Proposal Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ASCIILineChart data={successRateTrend} />
            <div className="mt-4 text-center text-sm">
              <span className="text-green-500">+14%</span> improvement this period
            </div>
          </CardContent>
        </Card>

        {/* Voter Turnout */}
        <Card>
          <CardHeader>
            <CardTitle>Voter Turnout</CardTitle>
          </CardHeader>
          <CardContent>
            <ASCIIBarChart data={voterTurnout} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Weekly average turnout
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delegation Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Top Delegators</CardTitle>
        </CardHeader>
        <CardContent>
          <ASCIIBarChart data={topDelegators} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total delegated: {formatNumber(topDelegators.reduce((sum, d) => sum + d.value, 0))} MESH
          </div>
        </CardContent>
      </Card>
    </div>
  )
}