"use client"

import { useState } from 'react'
import Link from 'next/link'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ---- Mock Data ----
const PENDING_REVIEWS = [
  {
    id: 'audit-001',
    name: 'Yield Harvester Pro',
    type: 'agent',
    submitter: '0xaaaa...1111',
    submittedAt: Date.now() - 86400000 * 2,
    priority: 'high',
  },
  {
    id: 'audit-002',
    name: 'Cross-Chain Bridge v2',
    type: 'skill',
    submitter: '0xbbbb...2222',
    submittedAt: Date.now() - 86400000 * 1,
    priority: 'medium',
  },
  {
    id: 'audit-003',
    name: 'ArrowRightvernance Proposal #47',
    type: 'proposal',
    submitter: '0xcccc...3333',
    submittedAt: Date.now() - 3600000 * 6,
    priority: 'high',
  },
  {
    id: 'audit-004',
    name: 'Liquidity Monitor',
    type: 'skill',
    submitter: '0xdddd...4444',
    submittedAt: Date.now() - 3600000 * 2,
    priority: 'low',
  },
]

const IN_REVIEW = [
  {
    id: 'audit-005',
    name: 'Flash Loan Arbitrage Bot',
    type: 'agent',
    submitter: '0xeeee...5555',
    submittedAt: Date.now() - 86400000 * 5,
    reviewer: 'Admin 0xfff...abc',
    startedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'audit-006',
    name: 'NFT Floor Alert System',
    type: 'agent',
    submitter: '0xffff...6666',
    submittedAt: Date.now() - 86400000 * 3,
    reviewer: 'Admin 0x111...def',
    startedAt: Date.now() - 3600000 * 1,
  },
]

const DECISION_HISTORY = [
  {
    id: 'hist-001',
    name: 'DAO Vote Aggregator',
    type: 'agent',
    outcome: 'approved',
    admin: '0xadmin...001',
    decidedAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'hist-002',
    name: 'Liquidity Pool Scanner',
    type: 'skill',
    outcome: 'rejected',
    admin: '0xadmin...002',
    reason: 'Incomplete documentation',
    decidedAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'hist-003',
    name: 'Treasury Management v3',
    type: 'skill',
    outcome: 'approved',
    admin: '0xadmin...001',
    decidedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'hist-004',
    name: 'Proposal #43 - Fee Adjustment',
    type: 'proposal',
    outcome: 'rejected',
    admin: '0xadmin...003',
    reason: 'Insufficient quorum threshold',
    decidedAt: Date.now() - 86400000 * 2,
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

function priorityBadge(priority: string) {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High</Badge>
    case 'medium':
      return <Badge variant="default">BookOpen</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
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

function outcomeBadge(outcome: string) {
  return outcome === 'approved' ? (
    <Badge variant="default" className="bg-green-600">Approved</Badge>
  ) : (
    <Badge variant="destructive">Rejected</Badge>
  )
}

// ---- Pending Reviews Tab ----
function PendingReviewsTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === PENDING_REVIEWS.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(PENDING_REVIEWS.map((x) => x.id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {PENDING_REVIEWS.length} items awaiting review
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={() => setOpenApproveDialog(true)}
          >
            Approve Selected ({selectedIds.length})
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={() => setOpenRejectDialog(true)}
          >
            Reject Selected
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <input
                type="checkbox"
                checked={selectedIds.length === PENDING_REVIEWS.length && PENDING_REVIEWS.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PENDING_REVIEWS.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="rounded"
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                </div>
              </TableCell>
              <TableCell>{typeBadge(item.type)}</TableCell>
              <TableCell className="font-mono text-xs">{item.submitter}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(item.submittedAt)}
              </TableCell>
              <TableCell>{priorityBadge(item.priority)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/audit-queue/${item.id}`}>Review</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Bulk Approve Dialog */}
      <Dialog open={openApproveDialog} onOpenChange={setOpenApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Approve</DialogTitle>
            <DialogDescription>
              Approve {selectedIds.length} selected items? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setOpenApproveDialog(false)
                setSelectedIds([])
              }}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Reject</DialogTitle>
            <DialogDescription>
              Reject {selectedIds.length} selected items. Provide a reason that will be shared with submitters.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpenRejectDialog(false)
                setSelectedIds([])
                setRejectReason('')
              }}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---- In Review Tab ----
function InReviewTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {IN_REVIEW.length} item{IN_REVIEW.length !== 1 ? 's' : ''} currently being reviewed
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Started</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {IN_REVIEW.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                </div>
              </TableCell>
              <TableCell>{typeBadge(item.type)}</TableCell>
              <TableCell className="font-mono text-xs">{item.submitter}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(item.submittedAt)}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{item.reviewer}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatRelative(item.startedAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/audit-queue/${item.id}`}>Continue Review</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Decision History Tab ----
function DecisionHistoryTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {DECISION_HISTORY.length} past decision{DECISION_HISTORY.length !== 1 ? 's' : ''}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DECISION_HISTORY.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                </div>
              </TableCell>
              <TableCell>{typeBadge(item.type)}</TableCell>
              <TableCell>{outcomeBadge(item.outcome)}</TableCell>
              <TableCell className="font-mono text-xs">{item.admin}</TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                {item.reason || '—'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(item.decidedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Main Page ----
export default function AuditQueuePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Central hub for reviewing agents, skills, and proposals before they go live.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <Badge variant="secondary" className="mr-1">{PENDING_REVIEWS.length}</Badge>
            Pending
          </span>
          <span>
            <Badge variant="default" className="mr-1">{IN_REVIEW.length}</Badge>
            In Review
          </span>
          <span>
            <Badge variant="outline" className="mr-1">{DECISION_HISTORY.length}</Badge>
            Decided
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Reviews
            <Badge variant="secondary" className="ml-2">{PENDING_REVIEWS.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-review">
            In Review
            <Badge variant="default" className="ml-2">{IN_REVIEW.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="history">
            Decision History
            <Badge variant="outline" className="ml-2">{DECISION_HISTORY.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <PendingReviewsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Currently In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <InReviewTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision History</CardTitle>
            </CardHeader>
            <CardContent>
              <DecisionHistoryTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}