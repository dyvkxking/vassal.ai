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

// ---- Mock Data ----
const TREASURY_BALANCE = {
  totalMesh: 1847500,
  totalUsd: 9240000,
  change24h: '+2.4%',
}

const RECENT_TRANSACTIONS = [
  {
    id: 'tx-001',
    type: 'out',
    amount: 15000,
    destination: '0xGRANT...aaaa',
    description: 'Ecosystem grants — Q2 funding batch',
    date: Date.now() - 3600000 * 2,
  },
  {
    id: 'tx-002',
    type: 'in',
    amount: 42000,
    destination: 'Protocol Fees',
    description: 'Platform fee collection — Week 22',
    date: Date.now() - 86400000,
  },
  {
    id: 'tx-003',
    type: 'out',
    amount: 8500,
    destination: '0xREWARD...bbbb',
    description: 'Agent performance rewards — top providers',
    date: Date.now() - 86400000 * 2,
  },
  {
    id: 'tx-004',
    type: 'out',
    amount: 3200,
    destination: '0xOPS...cccc',
    description: 'Operations expenditure — infrastructure',
    date: Date.now() - 86400000 * 3,
  },
  {
    id: 'tx-005',
    type: 'in',
    amount: 18000,
    destination: 'Provider deposits',
    description: 'New provider stake deposits',
    date: Date.now() - 86400000 * 4,
  },
]

const ALLOCATION_BREAKDOWN = [
  { category: 'Grants', amount: 620000, percentage: 33.6, color: '■' },
  { category: 'Rewards', amount: 480000, percentage: 26.0, color: '●' },
  { category: 'Operations', amount: 310000, percentage: 16.8, color: '▲' },
  { category: 'Reserve', amount: 437500, percentage: 23.7, color: '◆' },
]

const PENDING_PROPOSALS = [
  {
    id: 'prop-001',
    title: 'Increase developer grants budget by 15%',
    amount: 75000,
    proposer: '0xGOV...1111',
    votesFor: 68,
    votesAgainst: 12,
    expiresAt: Date.now() + 86400000 * 2,
  },
  {
    id: 'prop-002',
    title: 'Fund new security audit initiative',
    amount: 25000,
    proposer: '0xSEC...2222',
    votesFor: 81,
    votesAgainst: 5,
    expiresAt: Date.now() + 86400000 * 1,
  },
]

const AUTHORIZED_SIGNERS = [
  { address: '0xSIG1...aaaa', name: 'Multi-sig Owner 1', role: 'Signer' },
  { address: '0xSIG2...bbbb', name: 'Multi-sig Owner 2', role: 'Signer' },
  { address: '0xSIG3...cccc', name: 'Multi-sig Owner 3', role: 'Signer' },
  { address: '0xADMIN...dddd', name: 'Admin Wallet', role: 'Admin' },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAmount(amount: number): string {
  return amount.toLocaleString()
}

// ---- Treasury Balance Card ----
function TreasuryBalanceCard() {
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">Treasury Balance</div>
        <div className="mt-1 text-4xl font-bold">
          {formatAmount(TREASURY_BALANCE.totalMesh).replace(',', ' ')} $MESH
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <span className="text-xs text-muted-foreground">~${TREASURY_BALANCE.totalUsd.toLocaleString()} USD</span>
          </div>
          <Badge variant="default" className="text-xs">
            {TREASURY_BALANCE.change24h} 24h
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Allocation Breakdown ----
function AllocationBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Allocation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ALLOCATION_BREAKDOWN.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-primary">{item.color}</span>
                <span className="text-sm">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{formatAmount(item.amount)} $MESH</span>
                <span className="ml-2 text-xs text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        <Separator className="mt-4" />
        <div className="mt-3 flex justify-between text-sm">
          <span className="font-medium">Total</span>
          <span className="font-bold">{formatAmount(TREASURY_BALANCE.totalMesh)} $MESH</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Recent Transactions ----
function RecentTransactionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <Badge variant={tx.type === 'in' ? 'default' : 'destructive'} className="text-xs">
                    {tx.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {tx.type === 'in' ? '+' : '-'}{formatAmount(tx.amount)}
                </TableCell>
                <TableCell className="font-mono text-xs">{tx.destination}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                  {tx.description}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(tx.date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---- Pending Proposals ----
function PendingProposalsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Pending Proposals</CardTitle>
          <Badge variant="outline">{PENDING_PROPOSALS.length} active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {PENDING_PROPOSALS.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst
          const forPct = Math.round((proposal.votesFor / totalVotes) * 100)
          return (
            <div key={proposal.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{proposal.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    by {proposal.proposer} — {formatAmount(proposal.amount)} $MESH requested
                  </p>
                </div>
                <Badge variant={forPct > 70 ? 'default' : 'outline'} className="text-xs">
                  {forPct}% for
                </Badge>
              </div>
              <div className="mt-3">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${forPct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires {formatDate(proposal.expiresAt)}
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="default" size="sm" className="h-7 text-xs">
                  Approve
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ---- Treasury Security ----
function TreasurySecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Treasury Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Multi-sig Configuration</span>
            <Badge variant="default">3-of-4</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            3 signatures required to execute treasury transactions
          </p>
        </div>
        <div className="space-y-2">
          {AUTHORIZED_SIGNERS.map((signer) => (
            <div key={signer.address} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{signer.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{signer.address}</p>
              </div>
              <Badge variant="outline" className="text-xs">{signer.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Create Proposal Form ----
function CreateProposalForm() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Create Proposal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Treasury Proposal</DialogTitle>
          <DialogDescription>
            Submit a new allocation proposal for treasury funds. Requires multi-sig approval to execute.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Proposal Title</Label>
            <Input
              className="mt-1"
              placeholder="Brief title for the proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Amount ($MESH)</Label>
            <Input
              className="mt-1"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
              placeholder="Describe the purpose and intended use of funds..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setOpen(false)
              setTitle('')
              setAmount('')
              setDescription('')
            }}
          >
            Submit Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Main Page ----
export default function TreasuryPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Treasury Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage treasury funds, allocations, and multi-sig controls.
            </p>
          </div>
          <CreateProposalForm />
        </div>
      </div>

      {/* Balance + Allocation */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <TreasuryBalanceCard />
        <AllocationBreakdown />
      </div>

      {/* Transactions + Proposals */}
      <div className="mb-6">
        <RecentTransactionsSection />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PendingProposalsSection />
        <TreasurySecuritySection />
      </div>
    </div>
  )
}