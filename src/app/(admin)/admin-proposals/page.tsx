"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Data ----
const ACTIVE_PROPOSALS = [
  {
    id: 'prop-001',
    title: 'Increase developer grants budget by 15%',
    description: 'Expanding the quarterly grants program to support more ecosystem tooling projects.',
    amount: 75000,
    proposer: '0xGOV...1111',
    votesFor: 68,
    votesAgainst: 12,
    status: 'active',
    expiresAt: Date.now() + 86400000 * 2,
  },
  {
    id: 'prop-002',
    title: 'Fund new security audit initiative',
    description: 'Comprehensive security audit for all core protocol contracts.',
    amount: 25000,
    proposer: '0xSEC...2222',
    votesFor: 81,
    votesAgainst: 5,
    status: 'active',
    expiresAt: Date.now() + 86400000 * 1,
  },
  {
    id: 'prop-003',
    title: 'Launch agent promotion campaign',
    description: 'Marketing campaign to boost agent marketplace visibility.',
    amount: 40000,
    proposer: '0xMKT...3333',
    votesFor: 55,
    votesAgainst: 25,
    status: 'active',
    expiresAt: Date.now() + 86400000 * 4,
  },
]

const PARAMETER_SETTINGS = {
  votingPeriodDays: 7,
  quorumThreshold: 0.51,
  proposalFee: 100,
  executionDelayHours: 24,
  minStakeForProposal: 1000,
}

// ---- Parameter Settings Form ----
function ParameterSettingsCard() {
  const [votingPeriod, setVotingPeriod] = useState(PARAMETER_SETTINGS.votingPeriodDays.toString())
  const [quorum, setQuorum] = useState((PARAMETER_SETTINGS.quorumThreshold * 100).toString())
  const [proposalFee, setProposalFee] = useState(PARAMETER_SETTINGS.proposalFee.toString())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ArrowRightvernance Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs">Voting Period (days)</Label>
            <Input
              className="mt-1"
              type="number"
              value={votingPeriod}
              onChange={(e) => setVotingPeriod(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Quorum Threshold (%)</Label>
            <Input
              className="mt-1"
              type="number"
              value={quorum}
              onChange={(e) => setQuorum(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Proposal Fee ($MESH)</Label>
            <Input
              className="mt-1"
              type="number"
              value={proposalFee}
              onChange={(e) => setProposalFee(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Min Stake for Proposal ($MESH)</Label>
            <Input
              className="mt-1"
              type="number"
              value={PARAMETER_SETTINGS.minStakeForProposal}
              disabled
            />
          </div>
        </div>
        <Button variant="default" size="sm" className="w-full">
          Update Parameters
        </Button>
      </CardContent>
    </Card>
  )
}

// ---- Active Proposals Table ----
function ActiveProposalsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active Proposals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proposal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVE_PROPOSALS.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst
              const forPct = Math.round((proposal.votesFor / totalVotes) * 100)
              const expiresDate = new Date(proposal.expiresAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
              return (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{proposal.title}</p>
                      <p className="text-xs text-muted-foreground">by {proposal.proposer}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {proposal.amount.toLocaleString()} $MESH
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-600">{forPct}%</span>
                        <span className="text-red-600">{100 - forPct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${forPct}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {expiresDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Vote
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---- Admin Override ----
function AdminOverrideSection() {
  const [forcePassOpen, setForcePassOpen] = useState(false)
  const [forceFailOpen, setForceFailOpen] = useState(false)

  return (
    <Card className="border-2 border-orange-500/30">
      <CardHeader>
        <CardTitle className="text-base">Admin Override</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="border-orange-500/50">
          <AlertTitle>Emergency Authority</AlertTitle>
          <AlertDescription>
            Admin can force-pass or force-fail proposals in emergencies. This overrides normal governance
            and requires wallet signature. All override actions are permanently logged.
          </AlertDescription>
        </Alert>
        <div className="flex gap-3">
          <Dialog open={forcePassOpen} onOpenChange={setForcePassOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700">
                Force-Pass Proposal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Force-Pass Proposal</DialogTitle>
                <DialogDescription>
                  This will override the governance vote and immediately execute the proposal.
                  Enter the proposal ID to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Proposal ID</Label>
                <Input placeholder="prop-XXX" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setForcePassOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setForcePassOpen(false)}
                >
                  Sign &amp; Force-Pass
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={forceFailOpen} onOpenChange={setForceFailOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                Force-Fail Proposal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Force-Fail Proposal</DialogTitle>
                <DialogDescription>
                  This will override the governance vote and permanently reject the proposal.
                  Enter the proposal ID to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Proposal ID</Label>
                <Input placeholder="prop-XXX" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setForceFailOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setForceFailOpen(false)}>
                  Sign &amp; Force-Fail
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Treasury Spend Approval ----
function TreasurySpendApproval() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Treasury Spend Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proposal</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVE_PROPOSALS.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{proposal.title}</p>
                    <p className="text-xs text-muted-foreground">by {proposal.proposer}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {proposal.amount.toLocaleString()} $MESH
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Pending Approval</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="default" size="sm" className="h-7 text-xs">
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" className="h-7 text-xs">
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function ProposalsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin ArrowRightvernance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Override capabilities, parameter settings, and treasury spend approvals.
        </p>
      </div>

      {/* Active Proposals */}
      <div className="mb-6">
        <ActiveProposalsTable />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AdminOverrideSection />
        </div>
        <div className="space-y-6">
          <ParameterSettingsCard />
          <TreasurySpendApproval />
        </div>
      </div>
    </div>
  )
}