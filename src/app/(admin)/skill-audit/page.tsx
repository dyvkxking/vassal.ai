"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ---- Mock Data ----
const PENDING_SKILLS = [
  {
    id: 'skill-pend-001',
    name: 'On-Chain Transaction Decoder',
    author: '0xaaaa...1111',
    version: '1.0.0',
    category: 'infrastructure',
    submittedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'skill-pend-002',
    name: 'LP Pool Analytics',
    author: '0xbbbb...2222',
    version: '0.5.0',
    category: 'defi',
    submittedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'skill-pend-003',
    name: 'ArrowRightvernance Vote Aggregator',
    author: '0xcccc...3333',
    version: '2.0.0-beta',
    category: 'dao',
    submittedAt: Date.now() - 3600000 * 6,
  },
]

const AUDIT_DECISION_TOOLS = [
  { label: 'Bulk Approve', description: 'Approve all low-risk skills in queue', variant: 'default' as const },
  { label: 'Auto-Flag Suspicious', description: 'Mark skills with potential security concerns', variant: 'destructive' as const },
  { label: 'Export Queue', description: 'Download pending audit queue as CSV', variant: 'outline' as const },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ---- Pending Skills Table ----
function PendingSkillsTable() {
  const [openApproveDialog, setOpenApproveDialog] = useState<string | null>(null)
  const [openRejectDialog, setOpenRejectDialog] = useState<string | null>(null)
  const [openChangesDialog, setOpenChangesDialog] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [changesRequest, setChangesRequest] = useState('')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skill</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PENDING_SKILLS.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell>
              <div>
                <p className="font-medium">{skill.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{skill.id}</p>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">{skill.author}</TableCell>
            <TableCell>
              <Badge variant="outline">{skill.category}</Badge>
            </TableCell>
            <TableCell className="font-mono text-xs">{skill.version}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatDate(skill.submittedAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {/* Approve */}
                <Dialog
                  open={openApproveDialog === skill.id}
                  onOpenChange={(o) => setOpenApproveDialog(o ? skill.id : null)}
                >
                  <DialogTrigger>
                    <Button variant="default" size="sm" className="h-7 text-xs">
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Skill</DialogTitle>
                      <DialogDescription>
                        Confirm approval for "{skill.name}" v{skill.version}. It will be listed in the marketplace.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenApproveDialog(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => setOpenApproveDialog(null)}
                      >
                        Confirm Approval
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Reject */}
                <Dialog
                  open={openRejectDialog === skill.id}
                  onOpenChange={(o) => setOpenRejectDialog(o ? skill.id : null)}
                >
                  <DialogTrigger>
                    <Button variant="destructive" size="sm" className="h-7 text-xs">
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Skill</DialogTitle>
                      <DialogDescription>
                        Provide a reason for rejecting "{skill.name}". The author will be notified.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenRejectDialog(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setOpenRejectDialog(null)
                          setRejectReason('')
                        }}
                      >
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Request Changes */}
                <Dialog
                  open={openChangesDialog === skill.id}
                  onOpenChange={(o) => setOpenChangesDialog(o ? skill.id : null)}
                >
                  <DialogTrigger>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Request Changes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{skill.name}</DialogTitle>
                      <DialogDescription>
                        Describe what changes are required before resubmission.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Describe required changes..."
                      value={changesRequest}
                      onChange={(e) => setChangesRequest(e.target.value)}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenChangesDialog(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOpenChangesDialog(null)
                          setChangesRequest('')
                        }}
                      >
                        Send Feedback
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---- Audit Decision Tools ----
function AuditDecisionTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Decision Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {AUDIT_DECISION_TOOLS.map((tool, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{tool.label}</p>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
            <Button variant={tool.variant} size="sm" className="h-8 shrink-0">
              {tool.label}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- Review Queue Data ----
const REVIEW_QUEUE = [
  {
    id: 'skill-req-001',
    name: 'On-Chain Transaction Decoder',
    author: '0xaaaa...1111',
    version: '1.0.0',
    category: 'infrastructure',
    submittedAt: Date.now() - 86400000 * 3,
    status: 'pending' as const,
    invocations: 0,
    avgRating: 0,
  },
  {
    id: 'skill-req-002',
    name: 'LP Pool Analytics',
    author: '0xbbbb...2222',
    version: '0.5.0',
    category: 'defi',
    submittedAt: Date.now() - 86400000 * 1,
    status: 'pending' as const,
    invocations: 0,
    avgRating: 0,
  },
  {
    id: 'skill-req-003',
    name: 'ArrowRightvernance Vote Aggregator',
    author: '0xcccc...3333',
    version: '2.0.0-beta',
    category: 'dao',
    submittedAt: Date.now() - 3600000 * 6,
    status: 'changes_requested' as const,
    invocations: 0,
    avgRating: 0,
  },
]

// ---- Review Queue Cards ----
function ReviewQueueCards() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [bulkApproveDialogOpen, setBulkApproveDialogOpen] = useState(false)

  const selected = REVIEW_QUEUE.find(s => s.id === selectedSkill)

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {REVIEW_QUEUE.filter(s => s.status === 'pending').length} skills awaiting review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkApproveDialogOpen(true)}
          >
            Bulk Approve
          </Button>
          <Button variant="destructive" size="sm">
            Bulk Reject
          </Button>
        </div>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REVIEW_QUEUE.map((skill) => (
          <Card
            key={skill.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedSkill(skill.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium">
                  {skill.name}
                </CardTitle>
                <Badge
                  variant={
                    skill.status === 'pending'
                      ? 'secondary'
                      : skill.status === 'changes_requested'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {skill.status === 'changes_requested' ? 'Changes Requested' : skill.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1">{skill.id}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Author</span>
                <span className="font-mono text-xs">{skill.author}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <Badge variant="outline" className="font-mono text-xs">
                  v{skill.version}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{skill.category}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submitted</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(skill.submittedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedSkill} onOpenChange={(o) => !o && setSelectedSkill(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {selected?.category} &bull; v{selected?.version} &bull; by {selected?.author}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selected.status === 'pending'
                        ? 'secondary'
                        : selected.status === 'changes_requested'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {selected.status === 'changes_requested' ? 'Changes Requested' : selected.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDate(selected.submittedAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Invocations (testnet)</p>
                  <p className="font-medium">{selected.invocations.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Author Rating</p>
                  <p className="font-medium">{selected.avgRating > 0 ? selected.avgRating : 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Skill Description</p>
                <p className="text-sm">Skill description not available in queue view.</p>
              </div>

              <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-500">
                  This skill has not been reviewed yet. Full technical spec available after approval.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedSkill(null)}>
              Close
            </Button>
            <Link href={`/skill-audit/${selected?.id}`}>
              <Button variant="default">Full Audit</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approve Dialog */}
      <Dialog open={bulkApproveDialogOpen} onOpenChange={setBulkApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Approve Skills</DialogTitle>
            <DialogDescription>
              Approve {REVIEW_QUEUE.filter(s => s.status === 'pending').length} skills at once.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {REVIEW_QUEUE.filter(s => s.status === 'pending').map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm">{skill.name}</span>
                <Badge variant="outline">v{skill.version}</Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setBulkApproveDialogOpen(false)}>
              Approve All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---- Main Page ----
export default function SkillAuditPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Skill Audit Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve skill submissions before they go live in the marketplace.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <Badge variant="secondary">{REVIEW_QUEUE.length}</Badge>
            <span className="ml-1">Total in Queue</span>
          </span>
          <span>
            <Badge variant="secondary">{REVIEW_QUEUE.filter(s => s.status === 'pending').length}</Badge>
            <span className="ml-1">Pending</span>
          </span>
        </div>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReviewQueueCards />
            </div>
            <div className="space-y-6">
              <AuditDecisionTools />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      placeholder="Search skills..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pending Skills Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pending Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <PendingSkillsTable />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AuditDecisionTools />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
