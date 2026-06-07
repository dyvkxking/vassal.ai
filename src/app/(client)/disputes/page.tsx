'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Mock data types
interface Dispute {
  id: string
  date: number
  agentName: string
  amount: number
  status: 'open' | 'under_review' | 'resolved' | 'rejected' | 'appealed'
  reason: string
  description: string
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp-001',
    date: Date.now() - 604800000,
    agentName: 'MEV Detector',
    amount: 0.056,
    status: 'resolved',
    reason: 'SLA breach not refunded',
    description: 'Agent returned incorrect data output causing transaction to revert. Should have been refunded under SLA.',
  },
  {
    id: 'disp-002',
    date: Date.now() - 259200000,
    agentName: 'DeFi Pulse Scanner',
    amount: 0.034,
    status: 'open',
    reason: 'Billing error',
    description: 'Was charged for a session that failed to complete. No data was delivered.',
  },
  {
    id: 'disp-003',
    date: Date.now() - 86400000,
    agentName: 'Token Price Oracle',
    amount: 0.089,
    status: 'under_review',
    reason: 'Agent quality issue',
    description: 'Agent provided stale data leading to suboptimal trading decisions.',
  },
]

const DISPUTE_REASONS = [
  { value: 'sla_breach', label: 'SLA breach not refunded' },
  { value: 'agent_quality', label: 'Agent quality issue' },
  { value: 'billing_error', label: 'Billing error' },
  { value: 'other', label: 'Other' },
]

function StatusBadge({ status }: { status: Dispute['status'] }) {
  const styles: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    appealed: 'bg-purple-100 text-purple-700',
  }
  const labels: Record<string, string> = {
    open: 'Open',
    under_review: 'Under Review',
    resolved: 'Resolved',
    rejected: 'Rejected',
    appealed: 'Appealed',
  }
  return (
    <Badge variant="secondary" className={cn(styles[status])}>
      {labels[status]}
    </Badge>
  )
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES)
  const [showNewDispute, setShowNewDispute] = useState(false)
  const [newDispute, setNewDispute] = useState({
    reason: '',
    description: '',
  })

  const activeDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'under_review')
  const pastDisputes = disputes.filter((d) => d.status === 'resolved' || d.status === 'rejected' || d.status === 'appealed')

  const handleCreateDispute = () => {
    const newId = `disp-${String(disputes.length + 1).padStart(3, '0')}`
    setDisputes([
      ...disputes,
      {
        id: newId,
        date: Date.now(),
        agentName: 'Unknown Agent',
        amount: 0,
        status: 'open',
        reason: newDispute.reason,
        description: newDispute.description,
      },
    ])
    setShowNewDispute(false)
    setNewDispute({ reason: '', description: '' })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Disputes</h1>
            <p className="text-muted-foreground">
              Manage and track your service disputes.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Open New Dispute Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowNewDispute(true)}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Open New Dispute
          </Button>
        </div>

        {/* Active Disputes */}
        <Card>
          <CardHeader>
            <CardTitle>Active Disputes</CardTitle>
            <CardDescription>Disputes currently being processed</CardDescription>
          </CardHeader>
          <CardContent>
            {activeDisputes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {new Date(dispute.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{dispute.agentName}</TableCell>
                      <TableCell className="font-mono">${dispute.amount.toFixed(4)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dispute.reason}</TableCell>
                      <TableCell><StatusBadge status={dispute.status} /></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/disputes/${dispute.id}`}>View</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active disputes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Disputes */}
        <Card>
          <CardHeader>
            <CardTitle>Past Disputes</CardTitle>
            <CardDescription>Previously filed disputes and their outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {pastDisputes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {new Date(dispute.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{dispute.agentName}</TableCell>
                      <TableCell className="font-mono">${dispute.amount.toFixed(4)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dispute.reason}</TableCell>
                      <TableCell><StatusBadge status={dispute.status} /></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/disputes/${dispute.id}`}>View</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No past disputes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dispute Reasons Info */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute Reasons</CardTitle>
            <CardDescription>Common reasons for filing disputes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">SLA Breach Not Refunded</h4>
                <p className="text-sm text-muted-foreground">
                  When an agent fails to meet SLA requirements but no automatic refund was issued.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Agent Quality Issue</h4>
                <p className="text-sm text-muted-foreground">
                  Agent provided incorrect, stale, or low-quality output affecting your work.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Billing Error</h4>
                <p className="text-sm text-muted-foreground">
                  Incorrect charges, duplicate billing, or charges for incomplete/failed sessions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Dispute Dialog */}
      <Dialog open={showNewDispute} onOpenChange={setShowNewDispute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open New Dispute</DialogTitle>
            <DialogDescription>
              Submit a dispute for review. Our team will investigate and respond within 48 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select
                value={newDispute.reason}
                onValueChange={(value) => setNewDispute({ ...newDispute, reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {DISPUTE_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.label}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the issue in detail..."
                value={newDispute.description}
                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDispute(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDispute} disabled={!newDispute.reason || !newDispute.description}>
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}