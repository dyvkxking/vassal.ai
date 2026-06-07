"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

// ---- Mock Data ----
const AUDIT_ITEM = {
  id: 'audit-001',
  name: 'Yield Harvester Pro',
  type: 'agent',
  submitter: '0xaaaa...1111',
  submittedAt: Date.now() - 86400000 * 2,
}

const AUDIT_ATTEMPTS = [
  {
    id: 'attempt-001',
    attemptNumber: 3,
    status: 'approved',
    admin: '0xadmin...001',
    startedAt: Date.now() - 86400000 * 1,
    completedAt: Date.now() - 3600000 * 18,
    notes: 'All checklist items verified. Agent meets all quality thresholds.',
  },
  {
    id: 'attempt-002',
    attemptNumber: 2,
    status: 'rejected',
    admin: '0xadmin...002',
    startedAt: Date.now() - 86400000 * 5,
    completedAt: Date.now() - 86400000 * 4,
    notes: 'Documentation incomplete. Missing SLA metrics.',
    reason: 'Incomplete documentation and missing SLA metrics',
  },
  {
    id: 'attempt-001-first',
    attemptNumber: 1,
    status: 'rejected',
    admin: '0xadmin...003',
    startedAt: Date.now() - 86400000 * 10,
    completedAt: Date.now() - 86400000 * 8,
    notes: 'Initial review found security concerns.',
    reason: 'Security vulnerability in position management',
  },
]

const RESUBMISSIONS = [
  {
    id: 'resub-003',
    version: '1.0.0',
    resubmittedAt: Date.now() - 86400000 * 1,
    changes: 'Added complete SLA documentation and security audit certificate',
  },
  {
    id: 'resub-002',
    version: '0.9.1',
    resubmittedAt: Date.now() - 86400000 * 5,
    changes: 'Fixed position management vulnerability, added risk assessment module',
  },
  {
    id: 'resub-001',
    version: '0.9.0',
    resubmittedAt: Date.now() - 86400000 * 10,
    changes: 'Initial submission after addressing pre-audit concerns',
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  const hours = Math.floor(diff / 3600000)
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

function statusBadge(status: string) {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-600">Approved</Badge>
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>
    case 'pending':
      return <Badge variant="outline">Pending</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function typeBadge(type: string) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    agent: 'default',
    skill: 'secondary',
    proposal: 'outline',
  }
  return <Badge variant={variants[type] || 'outline'}>{type}</Badge>
}

// ---- Audit Attempts Tab ----
function AuditAttemptsTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {AUDIT_ATTEMPTS.length} audit attempt{AUDIT_ATTEMPTS.length !== 1 ? 's' : ''} for this item
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AUDIT_ATTEMPTS.map((attempt) => {
            const durationMs = attempt.completedAt - attempt.startedAt
            const durationHours = Math.round(durationMs / 3600000)
            return (
              <TableRow key={attempt.id}>
                <TableCell>
                  <Badge variant="outline">#{attempt.attemptNumber}</Badge>
                </TableCell>
                <TableCell>{statusBadge(attempt.status)}</TableCell>
                <TableCell className="font-mono text-xs">{attempt.admin}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(attempt.startedAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(attempt.completedAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {durationHours}h
                </TableCell>
                <TableCell className="text-xs max-w-[200px] truncate">
                  {attempt.notes}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Rejections Tab ----
function RejectionsTab() {
  const rejections = AUDIT_ATTEMPTS.filter((a) => a.status === 'rejected')
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {rejections.length} rejection{rejections.length !== 1 ? 's' : ''} with reasons
      </div>
      <div className="space-y-4">
        {rejections.map((attempt) => (
          <Card key={attempt.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Attempt #{attempt.attemptNumber}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Rejected</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelative(attempt.completedAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Rejection Reason</p>
                <p className="text-sm font-medium text-destructive">{attempt.reason}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Admin Notes</p>
                <p className="text-sm">{attempt.notes}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Reviewed by {attempt.admin}</span>
                <span>{formatDate(attempt.completedAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ---- Resubmissions Tab ----
function ResubmissionsTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {RESUBMISSIONS.length} resubmission{RESUBMISSIONS.length !== 1 ? 's' : ''}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Resubmitted</TableHead>
            <TableHead>Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {RESUBMISSIONS.map((resub) => (
            <TableRow key={resub.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono">{resub.version}</Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(resub.resubmittedAt)}
              </TableCell>
              <TableCell className="text-sm">{resub.changes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Main Page ----
export default function AuditHistoryPage() {
  const params = useParams()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/audit-queue" className="hover:text-foreground">Audit Queue</Link>
        <span>/</span>
        <Link href={`/audit-queue/${params.id}`} className="hover:text-foreground font-mono">
          {params.id as string}
        </Link>
        <span>/</span>
        <span>History</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Audit History</h1>
          {typeBadge(AUDIT_ITEM.type)}
        </div>
        <p className="mt-1 text-sm text-muted-foreground font-mono">{AUDIT_ITEM.id}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span>By <span className="font-mono">{AUDIT_ITEM.submitter}</span></span>
          <span>Submitted {formatDate(AUDIT_ITEM.submittedAt)}</span>
          <span>{AUDIT_ITEM.name}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{AUDIT_ATTEMPTS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">
              {AUDIT_ATTEMPTS.filter((a) => a.status === 'rejected').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resubmissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{RESUBMISSIONS.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attempts" className="w-full">
        <TabsList>
          <TabsTrigger value="attempts">Audit Attempts</TabsTrigger>
          <TabsTrigger value="rejections">
            Rejections
            <Badge variant="destructive" className="ml-2">
              {AUDIT_ATTEMPTS.filter((a) => a.status === 'rejected').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="resubmissions">
            Resubmissions
            <Badge variant="secondary" className="ml-2">{RESUBMISSIONS.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attempts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Audit Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditAttemptsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rejection Details</CardTitle>
            </CardHeader>
            <CardContent>
              <RejectionsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resubmissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resubmission History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResubmissionsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Back Button */}
      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href={`/audit-queue/${params.id}`}>Back to Audit Detail</Link>
        </Button>
      </div>
    </div>
  )
}