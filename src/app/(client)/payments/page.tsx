'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock data types
interface Transaction {
  id: string
  date: number
  agentId: string
  agentName: string
  amount: number
  status: 'completed' | 'pending' | 'refunded' | 'disputed'
  txHash: string
}

interface Refund {
  id: string
  date: number
  agentName: string
  amount: number
  reason: string
  slaBreach: string
}

interface Dispute {
  id: string
  date: number
  agentName: string
  amount: number
  status: 'open' | 'resolved' | 'rejected'
  reason: string
}

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-001', date: Date.now() - 86400000, agentId: 'agent-001', agentName: 'DeFi Pulse Scanner', amount: 0.045, status: 'completed', txHash: '0xabc123...def456' },
  { id: 'tx-002', date: Date.now() - 172800000, agentId: 'agent-004', agentName: 'Wallet Intelligence', amount: 0.092, status: 'completed', txHash: '0xghi789...jkl012' },
  { id: 'tx-003', date: Date.now() - 259200000, agentId: 'agent-003', agentName: 'DAO Proposal Digest', amount: 0.018, status: 'completed', txHash: '0xmno345...pqr678' },
  { id: 'tx-004', date: Date.now() - 345600000, agentId: 'agent-002', agentName: 'NFT Collection Analyzer', amount: 0.031, status: 'refunded', txHash: '0xstu901...vwx234' },
  { id: 'tx-005', date: Date.now() - 432000000, agentId: 'agent-005', agentName: 'Token Price Oracle', amount: 0.127, status: 'completed', txHash: '0xyza567...bcd890' },
  { id: 'tx-006', date: Date.now() - 518400000, agentId: 'agent-006', agentName: 'MEV Detector', amount: 0.089, status: 'completed', txHash: '0xefg123...hij456' },
]

const MOCK_REFUNDS: Refund[] = [
  { id: 'ref-001', date: Date.now() - 345600000, agentName: 'NFT Collection Analyzer', amount: 0.031, reason: 'SLA breach: latency exceeded threshold', slaBreach: 'Latency breach (2500ms > 2000ms)' },
]

const MOCK_DISPUTES: Dispute[] = [
  { id: 'disp-001', date: Date.now() - 604800000, agentName: 'MEV Detector', amount: 0.056, status: 'resolved', reason: 'Incorrect data output - tx reverted' },
]

// 7-day spending data
const SPENDING_DATA = [
  { day: 'Mon', amount: 0.12 },
  { day: 'Tue', amount: 0.08 },
  { day: 'Wed', amount: 0.23 },
  { day: 'Thu', amount: 0.05 },
  { day: 'Fri', amount: 0.18 },
  { day: 'Sat', amount: 0.09 },
  { day: 'Sun', amount: 0.14 },
]

function TextBarChart({ data, maxValue }: { data: { day: string; amount: number }[]; maxValue: number }) {
  const chartHeight = 8
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item) => {
        const barHeight = Math.round((item.amount / maxValue) * chartHeight)
        return (
          <div key={item.day} className="flex flex-col items-center gap-1 flex-1">
            <div className="text-xs text-muted-foreground font-mono">${item.amount.toFixed(2)}</div>
            <div className="w-full flex flex-col-reverse">
              {Array.from({ length: chartHeight }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-full h-4 border',
                    i < barHeight ? 'bg-violet-200 border-violet-300' : 'bg-muted/30 border-transparent'
                  )}
                />
              ))}
            </div>
            <div className="text-xs font-medium">{item.day}</div>
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-blue-100 text-blue-700',
    disputed: 'bg-red-100 text-red-700',
  }
  return (
    <Badge variant="secondary" className={cn('capitalize', styles[status])}>
      {status}
    </Badge>
  )
}

export default function PaymentsPage() {
  const [sessionBudget, setSessionBudget] = useState('')
  const [monthlyCap, setMonthlyCap] = useState('')
  const [budgetEnabled, setBudgetEnabled] = useState(false)
  const [sessionCapEnabled, setSessionCapEnabled] = useState(false)

  const totalSpent = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0)
  const thisMonth = MOCK_TRANSACTIONS.filter((t) => Date.now() - t.date < 30 * 86400000).reduce((sum, t) => sum + t.amount, 0)
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)
  const sessionsCount = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').length
  const avgPerSession = sessionsCount > 0 ? totalSpent / sessionsCount : 0
  const maxSpending = Math.max(...SPENDING_DATA.map((d) => d.amount))

  const walletAddress = '0x1234...abcd'

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">
              Manage your spending, budgets, and transaction history.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Payment Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent (All Time)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${thisMonth.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">${pending.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg per Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgPerSession.toFixed(4)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Chart (7 Days)</CardTitle>
            <CardDescription>Daily spending over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <TextBarChart data={SPENDING_DATA} maxValue={maxSpending} />
          </CardContent>
        </Card>

        {/* Budget Management */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>Set spending limits to control your costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-budget">Max Budget per Session</Label>
                <p className="text-sm text-muted-foreground">Limit how much you spend in a single session</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="session-budget"
                  type="number"
                  step="0.001"
                  placeholder="0.00"
                  className="w-32"
                  value={sessionBudget}
                  onChange={(e) => setSessionBudget(e.target.value)}
                  disabled={!sessionCapEnabled}
                />
                <Switch
                  id="session-cap"
                  checked={sessionCapEnabled}
                  onCheckedChange={setSessionCapEnabled}
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="monthly-cap">Monthly Spending Cap</Label>
                <p className="text-sm text-muted-foreground">Hard limit on total spending per month</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="monthly-cap"
                  type="number"
                  step="0.001"
                  placeholder="0.00"
                  className="w-32"
                  value={monthlyCap}
                  onChange={(e) => setMonthlyCap(e.target.value)}
                  disabled={!budgetEnabled}
                />
                <Switch
                  id="budget-toggle"
                  checked={budgetEnabled}
                  onCheckedChange={setBudgetEnabled}
                />
              </div>
            </div>
            {budgetEnabled && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-[35%]" />
                  </div>
                  <span>${thisMonth.toFixed(4)} of ${monthlyCap || '—'} used this month</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Connected wallet for transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-violet-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Wallet Address</div>
                <div className="text-sm text-muted-foreground font-mono">{walletAddress}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Receipts */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Receipts</CardTitle>
            <CardDescription>Your recent payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tx Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{tx.agentName}</TableCell>
                    <TableCell className="font-mono">${tx.amount.toFixed(4)}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{tx.txHash}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Refund History */}
        <Card>
          <CardHeader>
            <CardTitle>Refund History</CardTitle>
            <CardDescription>SLA breach refunds</CardDescription>
          </CardHeader>
          <CardContent>
            {MOCK_REFUNDS.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>SLA Breach</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REFUNDS.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(refund.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{refund.agentName}</TableCell>
                      <TableCell className="font-mono text-green-600">+${refund.amount.toFixed(4)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{refund.reason}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">{refund.slaBreach}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No refunds yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dispute History */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute History</CardTitle>
            <CardDescription>Raised disputes and their resolution status</CardDescription>
          </CardHeader>
          <CardContent>
            {MOCK_DISPUTES.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DISPUTES.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(dispute.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{dispute.agentName}</TableCell>
                      <TableCell className="font-mono">${dispute.amount.toFixed(4)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            dispute.status === 'resolved' && 'bg-green-100 text-green-700',
                            dispute.status === 'open' && 'bg-yellow-100 text-yellow-700',
                            dispute.status === 'rejected' && 'bg-red-100 text-red-700'
                          )}
                        >
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dispute.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No disputes raised
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}