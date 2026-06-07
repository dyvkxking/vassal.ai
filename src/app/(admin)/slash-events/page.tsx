"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ---- Mock Data ----
type SlashReason = 'latency' | 'tpm' | 'uptime' | 'heartbeat'
type Severity = 'low' | 'medium' | 'high'

const SLASH_EVENTS = [
  {
    id: 'slash-001',
    agentName: 'DeFi Pulse Scanner',
    provider: '0xPROV...aaaa',
    slashAmount: 0.02,
    reason: 'latency' as SlashReason,
    severity: 'low' as Severity,
    description: 'Average latency exceeded threshold (450ms vs 200ms limit)',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'slash-002',
    agentName: 'Yield Optimizer Pro',
    provider: '0xPROV...bbbb',
    slashAmount: 0.15,
    reason: 'tpm' as SlashReason,
    severity: 'high' as Severity,
    description: 'TPM quota exceeded by 40% — 3rd violation in 30 days',
    timestamp: Date.now() - 3600000 * 8,
  },
  {
    id: 'slash-003',
    agentName: 'NFT Floor Monitor',
    provider: '0xPROV...cccc',
    slashAmount: 0.05,
    reason: 'uptime' as SlashReason,
    severity: 'medium' as Severity,
    description: 'Uptime dropped below 99% SLA (97.3% last 7 days)',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'slash-004',
    agentName: 'ArrowRightvernance Voter',
    provider: '0xPROV...dddd',
    slashAmount: 0.01,
    reason: 'heartbeat' as SlashReason,
    severity: 'low' as Severity,
    description: 'Missed heartbeat signals — 2 consecutive gaps',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'slash-005',
    agentName: 'MEV Detector',
    provider: '0xPROV...eeee',
    slashAmount: 0.30,
    reason: 'tpm' as SlashReason,
    severity: 'high' as Severity,
    description: 'Critical TPM abuse — systematic throttling bypass attempt',
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'slash-006',
    agentName: 'Liquidity Hunter',
    provider: '0xPROV...ffff',
    slashAmount: 0.08,
    reason: 'uptime' as SlashReason,
    severity: 'medium' as Severity,
    description: 'Repeated uptime violations — 5th incident this month',
    timestamp: Date.now() - 86400000 * 4,
  },
  {
    id: 'slash-007',
    agentName: 'Flash Loan Arbitrage',
    provider: '0xPROV...gggg',
    slashAmount: 0.50,
    reason: 'tpm' as SlashReason,
    severity: 'high' as Severity,
    description: 'Excessive TPM consumption — 200%+ over quota limit',
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: 'slash-008',
    agentName: 'Whale Alert Bot',
    provider: '0xPROV...hhhh',
    slashAmount: 0.03,
    reason: 'latency' as SlashReason,
    severity: 'low' as Severity,
    description: 'Latency spike detected (380ms average over 24h)',
    timestamp: Date.now() - 86400000 * 6,
  },
]

const PROVIDER_LEADERBOARD = [
  { rank: 1, provider: '0xPROV...eeee', totalSlashed: 0.82, events: 7 },
  { rank: 2, provider: '0xPROV...bbbb', totalSlashed: 0.45, events: 4 },
  { rank: 3, provider: '0xPROV...ffff', totalSlashed: 0.28, events: 6 },
  { rank: 4, provider: '0xPROV...cccc', totalSlashed: 0.15, events: 3 },
  { rank: 5, provider: '0xPROV...aaaa', totalSlashed: 0.08, events: 2 },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function reasonBadgeVariant(reason: SlashReason): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<SlashReason, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    latency: 'secondary',
    tpm: 'destructive',
    uptime: 'default',
    heartbeat: 'outline',
  }
  return map[reason]
}

function severityColor(severity: Severity): string {
  const map: Record<Severity, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return map[severity]
}

// ---- Summary Stats ----
function SummaryStats() {
  const totalSlashed = SLASH_EVENTS.reduce((sum, e) => sum + e.slashAmount, 0)
  const highSeverityCount = SLASH_EVENTS.filter((e) => e.severity === 'high').length
  const tpmCount = SLASH_EVENTS.filter((e) => e.reason === 'tpm').length
  const latencyCount = SLASH_EVENTS.filter((e) => e.reason === 'latency').length

  return (
    <div className="flex gap-4">
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Total Slashed</div>
          <div className="text-2xl font-bold">{totalSlashed.toFixed(2)} $MESH</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Total Events</div>
          <div className="text-2xl font-bold">{SLASH_EVENTS.length}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">High Severity</div>
          <div className="text-2xl font-bold text-red-600">{highSeverityCount}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">TPM Violations</div>
          <div className="text-2xl font-bold">{tpmCount}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Latency Issues</div>
          <div className="text-2xl font-bold">{latencyCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---- Filter Bar ----
function FilterBar({
  reasonFilter,
  setReasonFilter,
}: {
  reasonFilter: string
  setReasonFilter: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Reason:</span>
        <Select value={reasonFilter} onValueChange={setReasonFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="latency">Latency</SelectItem>
            <SelectItem value="tpm">TPM</SelectItem>
            <SelectItem value="uptime">Uptime</SelectItem>
            <SelectItem value="heartbeat">Heartbeat</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ---- Slash Events Table ----
function SlashEventsTable() {
  const [reasonFilter, setReasonFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = SLASH_EVENTS.filter((event) => {
    if (reasonFilter !== 'all' && event.reason !== reasonFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <FilterBar reasonFilter={reasonFilter} setReasonFilter={setReasonFilter} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((event) => (
            <>
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium text-sm">{event.agentName}</p>
                </TableCell>
                <TableCell className="font-mono text-xs">{event.provider}</TableCell>
                <TableCell>
                  <Badge variant={reasonBadgeVariant(event.reason)} className="text-xs capitalize">
                    {event.reason}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-red-600">
                  -{event.slashAmount} $MESH
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(event.timestamp)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  >
                    {expandedId === event.id ? 'Hide' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedId === event.id && (
                <TableRow key={`${event.id}-expanded`}>
                  <TableCell colSpan={7} className="bg-muted/30 px-4 py-3">
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Violation Details</p>
                      <p className="text-sm">{event.description}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Provider Leaderboard ----
function ProviderLeaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Provider Slash Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Total Slashed</TableHead>
              <TableHead>Events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROVIDER_LEADERBOARD.map((entry) => (
              <TableRow key={entry.rank}>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    #{entry.rank}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{entry.provider}</TableCell>
                <TableCell className="font-mono text-sm text-red-600">
                  {entry.totalSlashed.toFixed(2)} $MESH
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{entry.events}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function SlashEventsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Slash Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and review all SLA violation slash events across the protocol.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-6">
        <SummaryStats />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Slash Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <SlashEventsTable />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProviderLeaderboard />
        </div>
      </div>
    </div>
  )
}