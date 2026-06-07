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
type Severity = 'low' | 'medium' | 'high' | 'critical'
type Status = 'active' | 'suspended' | 'banned'

const FLAGGED_USERS = [
  {
    id: 'flag-u-001',
    address: '0xDDDD...4444',
    role: 'Provider',
    reason: 'SLA abuse — repeated heartbeat failures',
    severity: 'high' as Severity,
    status: 'active' as Status,
    lastActivity: Date.now() - 3600000 * 3,
    flagsCount: 8,
    suspiciousIndicators: ['Latency spikes', 'TPM throttling bypass', 'Heartbeat gaps'],
  },
  {
    id: 'flag-u-002',
    address: '0xEEEE...5555',
    role: 'Agent Developer',
    reason: 'Abusive API usage — rate limit violations',
    severity: 'medium' as Severity,
    status: 'active' as Status,
    lastActivity: Date.now() - 86400000,
    flagsCount: 5,
    suspiciousIndicators: ['Excessive request volume', 'Spike traffic patterns'],
  },
  {
    id: 'flag-u-003',
    address: '0xFFFF...6666',
    role: 'Consumer',
    reason: 'Fraudulent refund requests — 4 incidents',
    severity: 'high' as Severity,
    status: 'active' as Status,
    lastActivity: Date.now() - 86400000 * 2,
    flagsCount: 4,
    suspiciousIndicators: ['Chargeback abuse', 'Fake disputes'],
  },
  {
    id: 'flag-u-004',
    address: '0xAAAA...1111',
    role: 'Provider',
    reason: 'Sybil attack indicators — multiple fake accounts',
    severity: 'critical' as Severity,
    status: 'suspended' as Status,
    lastActivity: Date.now() - 86400000 * 5,
    flagsCount: 12,
    suspiciousIndicators: ['Clustered wallet patterns', 'Coordinated behavior', 'Fake stake'],
  },
  {
    id: 'flag-u-005',
    address: '0xBBBB...2222',
    role: 'Agent Developer',
    reason: 'Spam submissions — fake agent listings',
    severity: 'low' as Severity,
    status: 'active' as Status,
    lastActivity: Date.now() - 86400000 * 10,
    flagsCount: 2,
    suspiciousIndicators: ['Low quality submissions', 'Repeated rejections'],
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

function statusBadgeVariant(status: Status): 'default' | 'secondary' | 'destructive' {
  const map: Record<Status, 'default' | 'secondary' | 'destructive'> = {
    active: 'default',
    suspended: 'secondary',
    banned: 'destructive',
  }
  return map[status]
}

function roleColor(role: string): string {
  const map: Record<string, string> = {
    Provider: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Agent Developer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Consumer: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }
  return map[role] ?? 'bg-gray-100 text-gray-800'
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ---- Suspicious Activity Indicators ----
function SuspiciousActivityIndicators({ indicators }: { indicators: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {indicators.map((ind) => (
        <Badge key={ind} variant="destructive" className="text-xs">
          {ind}
        </Badge>
      ))}
    </div>
  )
}

// ---- Flagged Users Table ----
function FlaggedUsersTable() {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = FLAGGED_USERS.filter((user) => {
    if (severityFilter !== 'all' && user.severity !== severityFilter) return false
    if (statusFilter !== 'all' && user.status !== statusFilter) return false
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
            <TableHead>Address</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((user) => (
            <>
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-mono text-sm">{user.address}</p>
                    {expandedId === user.id && (
                      <p className="mt-1 text-xs text-muted-foreground">{user.reason}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor(user.role)}`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(user.severity)}`}>
                    {user.severity}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="text-xs">{user.flagsCount}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(user.lastActivity)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(user.status)} className="text-xs">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                    >
                      {expandedId === user.id ? 'Hide' : 'Details'}
                    </Button>
                    {user.status === 'active' && (
                      <>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Suspend
                        </Button>
                        <Button variant="destructive" size="sm" className="h-7 text-xs">
                          Ban
                        </Button>
                      </>
                    )}
                    {user.status === 'suspended' && (
                      <Button variant="default" size="sm" className="h-7 text-xs">
                        Reinstate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === user.id && (
                <TableRow key={`${user.id}-expanded`}>
                  <TableCell colSpan={7} className="bg-muted/30 px-4 py-3">
                    <div className="space-y-3">
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Flag Reason</p>
                        <p className="text-sm">{user.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Suspicious Activity</p>
                        <SuspiciousActivityIndicators indicators={user.suspiciousIndicators} />
                      </div>
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

// ---- Summary Stats ----
function SummaryStats() {
  const counts = {
    total: FLAGGED_USERS.length,
    critical: FLAGGED_USERS.filter((u) => u.severity === 'critical').length,
    high: FLAGGED_USERS.filter((u) => u.severity === 'high').length,
    suspended: FLAGGED_USERS.filter((u) => u.status === 'suspended' || u.status === 'banned').length,
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
          <div className="text-xs text-muted-foreground">Suspended / Banned</div>
          <div className="text-2xl font-bold">{counts.suspended}</div>
        </CardContent>
      </Card>
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
            <p className="text-xs text-muted-foreground">Clear flags on all low-severity accounts</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            Dismiss All Low
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Escalate High Severity</p>
            <p className="text-xs text-muted-foreground">Flag high/critical users for urgent review</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">
            Escalate High
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Suspend All Suspected Sybil</p>
            <p className="text-xs text-muted-foreground">Bulk suspend accounts with sybil indicators</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">
            Suspend Sybil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function FlaggedUsersPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Flagged Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and take action on user accounts flagged for suspicious or abusive behavior.
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
              <CardTitle className="text-base">Flagged Users</CardTitle>
            </CardHeader>
            <CardContent>
              <FlaggedUsersTable />
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