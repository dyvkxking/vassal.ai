"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Data ----
const AUDIT_ITEM = {
  id: 'audit-001',
  name: 'Yield Harvester Pro',
  type: 'agent',
  submitter: '0xaaaa...1111',
  submittedAt: Date.now() - 86400000 * 2,
  description: 'An advanced DeFi yield optimization agent that automatically moves funds across protocols to maximize returns. Features real-time risk assessment and automated position management.',
  version: '1.0.0',
  category: 'defi',
  priority: 'high',
  reviewer: null,
  startedAt: null,
}

const CHECKLIST_ITEMS = [
  { id: 'completeness', label: 'Completeness', description: 'All required fields and documentation are provided' },
  { id: 'compliance', label: 'Compliance', description: 'Follows protocol standards and guidelines' },
  { id: 'quality', label: 'Quality', description: 'Meets minimum quality thresholds for functionality' },
  { id: 'safety', label: 'Safety', description: 'No security vulnerabilities or harmful behavior' },
]

const CHANGE_HISTORY = [
  {
    id: 'ch-001',
    field: 'description',
    oldValue: 'Basic yield optimization',
    newValue: 'An advanced DeFi yield optimization agent...',
    changedAt: Date.now() - 86400000 * 4,
    changedBy: '0xaaaa...1111',
  },
  {
    id: 'ch-002',
    field: 'version',
    oldValue: '0.9.0',
    newValue: '1.0.0',
    changedAt: Date.now() - 86400000 * 3,
    changedBy: '0xaaaa...1111',
  },
  {
    id: 'ch-003',
    field: 'documentation',
    oldValue: 'Missing',
    newValue: 'Complete',
    changedAt: Date.now() - 86400000 * 1,
    changedBy: '0xaaaa...1111',
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

function typeBadge(type: string) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    agent: 'default',
    skill: 'secondary',
    proposal: 'outline',
  }
  return <Badge variant={variants[type] || 'outline'}>{type}</Badge>
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

// ---- Review Checklist ----
function ReviewChecklist({ checked, onChange }: { checked: Record<string, boolean>, onChange: (id: string, val: boolean) => void }) {
  return (
    <div className="space-y-3">
      {CHECKLIST_ITEMS.map((item) => (
        <div key={item.id} className="flex items-start space-x-3">
          <Checkbox
            id={item.id}
            checked={checked[item.id] || false}
            onCheckedChange={(val) => onChange(item.id, !!val)}
          />
          <div className="grid gap-1 leading-none">
            <Label
              htmlFor={item.id}
              className="text-sm font-medium cursor-pointer"
            >
              {item.label}
            </Label>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- Main Page ----
export default function AuditDetailPage() {
  const params = useParams()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [internalNotes, setInternalNotes] = useState('')
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false)

  const allChecked = CHECKLIST_ITEMS.every((item) => checkedItems[item.id])

  const handleCheckChange = (id: string, val: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: val }))
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/audit-queue" className="hover:text-foreground">Audit Queue</Link>
        <span>/</span>
        <span className="font-mono">{params.id as string}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{AUDIT_ITEM.name}</h1>
            {typeBadge(AUDIT_ITEM.type)}
            {priorityBadge(AUDIT_ITEM.priority)}
          </div>
          <p className="mt-1 text-sm text-muted-foreground font-mono">{AUDIT_ITEM.id}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>By <span className="font-mono">{AUDIT_ITEM.submitter}</span></span>
            <span>Submitted {formatDate(AUDIT_ITEM.submittedAt)}</span>
            <span>v{AUDIT_ITEM.version}</span>
            <span>{AUDIT_ITEM.category}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenHistoryDialog(true)}>
            View History
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{AUDIT_ITEM.description}</p>
            </CardContent>
          </Card>

          {/* Review Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewChecklist checked={checkedItems} onChange={handleCheckChange} />
              {!allChecked && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Complete all checklist items before submitting your decision.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add internal notes for other admins (not visible to submitter)..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Decision Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenRejectDialog(true)}
            >
              Reject
            </Button>
            <Button
              variant="default"
              disabled={!allChecked}
              onClick={() => setOpenApproveDialog(true)}
            >
              Approve
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Item Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{AUDIT_ITEM.type}</span>
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{AUDIT_ITEM.category}</span>
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">{AUDIT_ITEM.version}</span>
                <span className="text-muted-foreground">Priority</span>
                <span>{priorityBadge(AUDIT_ITEM.priority)}</span>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Submitter</p>
                <p className="font-mono text-xs">{AUDIT_ITEM.submitter}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Submitted</p>
                <p className="text-xs">{formatDate(AUDIT_ITEM.submittedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/audit-queue/${params.id}/history`}>
                  View Full History
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Request Changes
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive">
                Flag for Emergency Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onOpenChange={setOpenApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Item</DialogTitle>
            <DialogDescription>
              Confirm approval for "{AUDIT_ITEM.name}". It will be listed in the marketplace or proceed to the next stage.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTitle>Review Complete</AlertTitle>
            <AlertDescription>
              All checklist items have been verified. Confirm to finalize this decision.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setOpenApproveDialog(false)
              }}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting "{AUDIT_ITEM.name}". The submitter will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
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
                setRejectReason('')
              }}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={openHistoryDialog} onOpenChange={setOpenHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change History</DialogTitle>
            <DialogDescription>
              Track all changes made to this item before the audit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {CHANGE_HISTORY.map((change) => (
              <div key={change.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{change.field}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(change.changedAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Previous</p>
                    <p className="line-through text-muted-foreground">{change.oldValue}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Updated</p>
                    <p className="font-medium">{change.newValue}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">by {change.changedBy}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenHistoryDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}