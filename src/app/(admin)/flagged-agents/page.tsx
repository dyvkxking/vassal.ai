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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ---- Mock Data ----
type Severity = 'low' | 'medium' | 'high' | 'critical'
type Status = 'pending' | 'reviewed' | 'dismissed'

const FLAGGED_AGENTS = [
  {
    id: 'flag-a-001',
    name: 'Yield Maximizer Pro',
    creator: '0xaaaa...1111',
    reason: 'False SLA claims — uptime guarantee not met',
    severity: 'high' as Severity,
    status: 'pending' as Status,
    dateFlagged: Date.now() - 86400000 * 3,
    reportCount: 14,
  },
  {
    id: 'flag-a-002',
    name: 'Flash Loan Sniper',
    creator: '0xbbbb...2222',
    reason: 'Potentially manipulative trading signals',
    severity: 'critical' as Severity,
    status: 'pending' as Status,
    dateFlagged: Date.now() - 86400000,
    reportCount: 21,
  },
  {
    id: 'flag-a-003',
    name: 'ArrowRightvernance Exploit Scanner',
    creator: '0xcccc...3333',
    reason: 'Harmful content — instructions for exploit usage',
    severity: 'critical' as Severity,
    status: 'reviewed' as Status,
    dateFlagged: Date.now() - 86400000 * 7,
    reportCount: 31,
  },
  {
    id: 'flag-a-004',
    name: 'Liquidity Hunter Bot',
    creator: '0xdddd...4444',
    reason: 'Repeated TPM abuse — throttling bypass attempts',
    severity: 'medium' as Severity,
    status: 'pending' as Status,
    dateFlagged: Date.now() - 86400000 * 2,
    reportCount: 6,
  },
  {
    id: 'flag-a-005',
    name: 'Whale Tracker V2',
    creator: '0xeeee...5555',
    reason: 'Spam reports from competitor',
    severity: 'low' as Severity,
    status: 'dismissed' as Status,
    dateFlagged: Date.now() - 86400000 * 10,
    reportCount: 3,
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function severityColor(severity: Severity): string {
  const map: Record<Severity, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return map[severity]
}

function statusBadgeVariant(status: Status): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<Status, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'destructive',
    reviewed: 'secondary',
    dismissed: 'outline',
  }
  return map[status]
}

// ---- Filter Bar ----
function FilterBar({
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
}: {
  severityFilter: string
  setSeverityFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Severity:</span>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">BookOpen</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ---- Flagged Agents Table ----
function FlaggedAgentsTable() {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = FLAGGED_AGENTS.filter((agent) => {
    if (severityFilter !== 'all' && agent.severity !== severityFilter) return false
    if (statusFilter !== 'all' && agent.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <FilterBar
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>Date Flagged</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((agent) => (
            <>
              <TableRow key={agent.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    {expandedId === agent.id && (
                      <p className="mt-1 text-xs text-muted-foreground">{agent.reason}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{agent.creator}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(agent.severity)}`}>
                    {agent.severity}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">{agent.reportCount}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(agent.dateFlagged)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(agent.status)} className="text-xs">
                    {agent.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setExpandedId(expandedId === agent.id ? null : agent.id)}
                    >
                      {expandedId === agent.id ? 'Hide' : 'Details'}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Dismiss
                    </Button>
                    <Button variant="destructive" size="sm" className="h-7 text-xs">
                      Suspend
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === agent.id && (
                <TableRow key={`${agent.id}-expanded`}>
                  <TableCell colSpan={7} className="bg-muted/30 px-4 py-3">
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Flag Reason</p>
                      <p className="text-sm">{agent.reason}</p>
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

// ---- Bulk Actions ----
function BulkActionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bulk Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Dismiss Low Severity</p>
            <p className="text-xs text-muted-foreground">Remove all low-severity flags automatically</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            Dismiss All Low
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Escalate High Severity</p>
            <p className="text-xs text-muted-foreground">Flag all high/critical agents for urgent review</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">
            Escalate High
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Ban Creator (Selected)</p>
            <p className="text-xs text-muted-foreground">Permanently ban the creator address from the platform</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">
            Ban Creators
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Summary Stats ----
function SummaryStats() {
  const counts = {
    total: FLAGGED_AGENTS.length,
    critical: FLAGGED_AGENTS.filter((a) => a.severity === 'critical').length,
    high: FLAGGED_AGENTS.filter((a) => a.severity === 'high').length,
    pending: FLAGGED_AGENTS.filter((a) => a.status === 'pending').length,
  }

  return (
    <div className="flex gap-4">
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Total Flagged</div>
          <div className="text-2xl font-bold">{counts.total}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Critical</div>
          <div className="text-2xl font-bold text-red-600">{counts.critical}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">High</div>
          <div className="text-2xl font-bold text-orange-600">{counts.high}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold">{counts.pending}</div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---- Main Page ----
export default function FlaggedAgentsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Flagged Agents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and take action on agents flagged for suspicious or harmful behavior.
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
              <CardTitle className="text-base">Flagged Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <FlaggedAgentsTable />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BulkActionsSection />
        </div>
      </div>
    </div>
  )
}