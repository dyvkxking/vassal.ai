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
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

// ---- Mock Data ----
const QUEUE_SUMMARY = {
  agents: 12,
  skills: 8,
  proposals: 5,
}

const PRIORITY_QUEUE = [
  {
    id: 'pq-001',
    name: 'ArrowRightvernance Proposal #50 - Emergency Pause',
    type: 'proposal',
    urgency: 'critical',
    submittedAt: Date.now() - 3600000 * 2,
    submitter: '0xcccc...3333',
  },
  {
    id: 'pq-002',
    name: 'Flash Loan Arbitrage Bot',
    type: 'agent',
    urgency: 'high',
    submittedAt: Date.now() - 3600000 * 6,
    submitter: '0xeeee...5555',
  },
  {
    id: 'pq-003',
    name: 'Cross-Chain Bridge v2',
    type: 'skill',
    urgency: 'high',
    submittedAt: Date.now() - 86400000 * 1,
    submitter: '0xbbbb...2222',
  },
  {
    id: 'pq-004',
    name: 'Yield Harvester Pro',
    type: 'agent',
    urgency: 'high',
    submittedAt: Date.now() - 86400000 * 2,
    submitter: '0xaaaa...1111',
  },
  {
    id: 'pq-005',
    name: 'NFT Floor Alert System',
    type: 'agent',
    urgency: 'medium',
    submittedAt: Date.now() - 86400000 * 1,
    submitter: '0xffff...6666',
  },
]

const ALL_PENDING = [
  ...PRIORITY_QUEUE,
  {
    id: 'pq-006',
    name: 'Liquidity Pool Scanner',
    type: 'skill',
    urgency: 'medium',
    submittedAt: Date.now() - 86400000 * 2,
    submitter: '0xdddd...4444',
  },
  {
    id: 'pq-007',
    name: 'DAO Vote Aggregator',
    type: 'agent',
    urgency: 'low',
    submittedAt: Date.now() - 86400000 * 3,
    submitter: '0x1111...7777',
  },
  {
    id: 'pq-008',
    name: 'Treasury Rebalancer',
    type: 'agent',
    urgency: 'low',
    submittedAt: Date.now() - 86400000 * 5,
    submitter: '0x2222...8888',
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
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

function urgencyBadge(urgency: string) {
  switch (urgency) {
    case 'critical':
      return <Badge variant="destructive" className="animate-pulse">Critical</Badge>
    case 'high':
      return <Badge variant="destructive">High</Badge>
    case 'medium':
      return <Badge variant="default">BookOpen</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">{urgency}</Badge>
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

// ---- Queue Summary Cards ----
function QueueSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Agents</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-3xl font-bold">{QUEUE_SUMMARY.agents}</p>
          <Badge variant="default">{QUEUE_SUMMARY.agents} pending</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-3xl font-bold">{QUEUE_SUMMARY.skills}</p>
          <Badge variant="secondary">{QUEUE_SUMMARY.skills} pending</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Proposals</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-3xl font-bold">{QUEUE_SUMMARY.proposals}</p>
          <Badge variant="outline">{QUEUE_SUMMARY.proposals} pending</Badge>
        </CardContent>
      </Card>
    </div>
  )
}

// ---- Priority Queue Tab ----
function PriorityQueueTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {PRIORITY_QUEUE.length} urgent item{PRIORITY_QUEUE.length !== 1 ? 's' : ''} requiring immediate attention
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PRIORITY_QUEUE.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.id}</p>
                </div>
              </TableCell>
              <TableCell>{typeBadge(item.type)}</TableCell>
              <TableCell>{urgencyBadge(item.urgency)}</TableCell>
              <TableCell className="font-mono text-xs">{item.submitter}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatRelative(item.submittedAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/audit-queue/${item.id}`}>Review</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- All Pending Tab ----
function AllPendingTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterUrgency, setFilterUrgency] = useState<string>('all')

  const filteredItems = ALL_PENDING.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (filterUrgency !== 'all' && item.urgency !== filterUrgency) return false
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map((x) => x.id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Type</Label>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="agent">Agent</option>
            <option value="skill">Skill</option>
            <option value="proposal">Proposal</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Urgency</Label>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">BookOpen</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex-1" />
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

      <div className="text-sm text-muted-foreground">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} (selected: {selectedIds.length})
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
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
              <TableCell>{urgencyBadge(item.urgency)}</TableCell>
              <TableCell className="font-mono text-xs">{item.submitter}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatRelative(item.submittedAt)}
              </TableCell>
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
              disabled={!rejectReason.trim()}
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

// ---- Main Page ----
export default function PendingReviewsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Pending Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Central dashboard for all items awaiting admin review, sorted by priority.
        </p>
      </div>

      {/* Summary Cards */}
      <QueueSummaryCards />

      {/* Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="priority" className="w-full">
          <TabsList>
            <TabsTrigger value="priority">
              Priority Queue
              <Badge variant="destructive" className="ml-2">{PRIORITY_QUEUE.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all">
              All Pending
              <Badge variant="secondary" className="ml-2">{ALL_PENDING.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="priority" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Urgent Items</CardTitle>
              </CardHeader>
              <CardContent>
                <PriorityQueueTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <AllPendingTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}