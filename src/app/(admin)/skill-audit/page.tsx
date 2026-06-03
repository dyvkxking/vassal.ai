"use client"

import { useState } from 'react'
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
    name: 'Governance Vote Aggregator',
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

// ---- Main Page ----
export default function SkillAuditPage() {
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
            <Badge variant="secondary">{PENDING_SKILLS.length}</Badge>
            <span className="ml-1">Pending Review</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main table area */}
        <div className="lg:col-span-2 space-y-6">
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
    </div>
  )
}
