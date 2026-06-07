"use client"

import { useState } from 'react'
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
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Data ----
const PENDING_AGENTS = [
  {
    id: 'agent-pend-001',
    name: 'Arbitrage Hunter Pro',
    creator: '0xaaaa...1111',
    category: 'defi',
    version: '1.0.0',
    description: 'Cross-exchange arbitrage opportunity detector with flash loan support.',
    submittedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'agent-pend-002',
    name: 'DAO Voter Assistant',
    creator: '0xbbbb...2222',
    category: 'dao',
    version: '0.9.0',
    description: 'Helps DAO members analyze proposals and cast informed votes.',
    submittedAt: Date.now() - 86400000,
  },
  {
    id: 'agent-pend-003',
    name: 'NFT Whale Tracker',
    creator: '0xcccc...3333',
    category: 'nft',
    version: '1.2.0',
    description: 'Tracks NFT whale wallets and alerts on collection floor price changes.',
    submittedAt: Date.now() - 3600000 * 4,
  },
]

const FLAGGED_AGENTS = [
  {
    id: 'agent-flag-001',
    name: 'Yield Maximizer',
    creator: '0xdddd...4444',
    reason: 'False SLA claims — uptime guarantee not met',
    reports: 14,
    firstReported: Date.now() - 86400000 * 5,
  },
  {
    id: 'agent-flag-002',
    name: 'Token Sniper X',
    creator: '0xeeee...5555',
    reason: 'Potentially manipulative trading signals',
    reports: 8,
    firstReported: Date.now() - 86400000 * 3,
  },
  {
    id: 'agent-flag-003',
    name: 'ArrowRightvernance Exploit Scanner',
    creator: '0xffff...6666',
    reason: 'Harmful content — instructions for exploit usage',
    reports: 22,
    firstReported: Date.now() - 86400000 * 7,
  },
]

const SUSPENDED_AGENTS = [
  {
    id: 'agent-susp-001',
    name: 'Dark Pool Analyzer',
    creator: '0xdanger...0000',
    reason: 'Violation of protocol terms — market manipulation',
    suspendedAt: Date.now() - 86400000 * 30,
    appealStatus: 'pending',
  },
  {
    id: 'agent-susp-002',
    name: 'Rug Pull Predictor',
    creator: '0xfraud...9999',
    reason: 'Confirmed false reporting of legitimate protocols',
    suspendedAt: Date.now() - 86400000 * 60,
    appealStatus: 'rejected',
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ---- Pending Agents Tab ----
function PendingAgentsTab() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {PENDING_AGENTS.length} agent{PENDING_AGENTS.length !== 1 ? 's' : ''} awaiting review
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PENDING_AGENTS.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.creator}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{agent.category}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{agent.version}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(agent.submittedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="default" size="sm" className="h-7 text-xs">
                    Approve
                  </Button>
                  <Dialog open={openDialog === agent.id} onOpenChange={(o) => setOpenDialog(o ? agent.id : null)}>
                    <DialogTrigger>
                      <Button variant="destructive" size="sm" className="h-7 text-xs">
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Agent</DialogTitle>
                        <DialogDescription>
                          Provide a reason for rejecting "{agent.name}". The author will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(null)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setOpenDialog(null)
                            setRejectReason('')
                          }}
                        >
                          Confirm Rejection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Flagged Agents Tab ----
function FlaggedAgentsTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {FLAGGED_AGENTS.length} agent{FLAGGED_AGENTS.length !== 1 ? 's' : ''} reported by users
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>First Reported</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FLAGGED_AGENTS.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.creator}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-destructive">{agent.reason}</span>
              </TableCell>
              <TableCell>
                <Badge variant="destructive">{agent.reports}</Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(agent.firstReported)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="destructive" size="sm" className="h-7 text-xs">
                    Suspend
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Suspended Agents Tab ----
function SuspendedAgentsTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {SUSPENDED_AGENTS.length} banned agent{SUSPENDED_AGENTS.length !== 1 ? 's' : ''}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Suspended On</TableHead>
            <TableHead>Appeal Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SUSPENDED_AGENTS.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.creator}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{agent.reason}</span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(agent.suspendedAt)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    agent.appealStatus === 'pending'
                      ? 'default'
                      : agent.appealStatus === 'rejected'
                        ? 'destructive'
                        : 'outline'
                  }
                >
                  {agent.appealStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Review Appeal
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Reinstate
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Main Page ----
export default function ModerationPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Agent Moderation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review pending agents, handle user reports, and manage suspended agents.
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6" variant="default">
        <AlertTitle>Moderation Queue</AlertTitle>
        <AlertDescription>
          All agent submissions are reviewed for SLA compliance, content safety, and protocol adherence before being listed on the marketplace.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approval
            <Badge variant="secondary" className="ml-2">{PENDING_AGENTS.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged
            <Badge variant="destructive" className="ml-2">{FLAGGED_AGENTS.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended
            <Badge variant="outline" className="ml-2">{SUSPENDED_AGENTS.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <PendingAgentsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Flagged by Users</CardTitle>
            </CardHeader>
            <CardContent>
              <FlaggedAgentsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suspended Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <SuspendedAgentsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
