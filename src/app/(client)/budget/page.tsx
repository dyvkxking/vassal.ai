'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock data types
interface SpendingByAgent {
  agentId: string
  agentName: string
  amount: number
  percentage: number
  color: string
}

interface SpendingByCategory {
  category: string
  amount: number
  percentage: number
}

interface BudgetAlert {
  id: string
  date: number
  threshold: number
  spent: number
  budget: number
  acknowledged: boolean
}

// Mock data
const SPENT_THIS_MONTH = 0.847
const MONTHLY_BUDGET = 1.5
const REMAINING = MONTHLY_BUDGET - SPENT_THIS_MONTH

const SPENDING_BY_AGENT: SpendingByAgent[] = [
  { agentId: 'agent-001', agentName: 'DeFi Pulse Scanner', amount: 0.312, percentage: 36.8, color: 'bg-violet-500' },
  { agentId: 'agent-005', agentName: 'Token Price Oracle', amount: 0.254, percentage: 30.0, color: 'bg-blue-500' },
  { agentId: 'agent-006', agentName: 'MEV Detector', amount: 0.178, percentage: 21.0, color: 'bg-green-500' },
  { agentId: 'agent-003', agentName: 'DAO Proposal Digest', amount: 0.103, percentage: 12.2, color: 'bg-yellow-500' },
]

const SPENDING_BY_CATEGORY: SpendingByCategory[] = [
  { category: 'DeFi', amount: 0.412, percentage: 48.6 },
  { category: 'Analytics', amount: 0.235, percentage: 27.7 },
  { category: 'Security', amount: 0.200, percentage: 23.6 },
]

const ALERT_HISTORY: BudgetAlert[] = [
  { id: 'alert-001', date: Date.now() - 172800000, threshold: 50, spent: 0.42, budget: 1.5, acknowledged: true },
  { id: 'alert-002', date: Date.now() - 86400000, threshold: 75, spent: 0.68, budget: 1.5, acknowledged: true },
]

function PieChart({ data }: { data: SpendingByAgent[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)
  let cumulativePercent = 0

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, index) => {
            const percent = item.amount / total * 100
            const startPercent = cumulativePercent
            cumulativePercent += percent
            const startX = 50 + 50 * Math.cos(2 * Math.PI * startPercent / 100)
            const startY = 50 + 50 * Math.sin(2 * Math.PI * startPercent / 100)
            const endX = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercent / 100)
            const endY = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercent / 100)
            const largeArc = percent > 50 ? 1 : 0
            const pathData = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`
            return (
              <path
                key={item.agentId}
                d={pathData}
                fill={item.color}
                className="transition-opacity hover:opacity-80"
              />
            )
          })}
          <circle cx="50" cy="50" r="25" fill="background" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">${total.toFixed(3)}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.agentId} className="flex items-center gap-3">
            <div className={cn('w-3 h-3 rounded-full', item.color)} />
            <span className="text-sm font-medium">{item.agentName}</span>
            <span className="text-sm text-muted-foreground ml-auto">${item.amount.toFixed(3)} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryBar({ data }: { data: SpendingByCategory[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.category} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.category}</span>
            <span className="text-muted-foreground">${item.amount.toFixed(3)} ({item.percentage}%)</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-blue-500"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BudgetPage() {
  const [showAdjustForm, setShowAdjustForm] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState('')

  const percentUsed = (SPENT_THIS_MONTH / MONTHLY_BUDGET) * 100

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Budget Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor spending, track budget usage, and manage alerts.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Monthly Budget Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${MONTHLY_BUDGET.toFixed(3)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Spent This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-600">${SPENT_THIS_MONTH.toFixed(3)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${REMAINING.toFixed(3)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{percentUsed.toFixed(1)}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-violet-500'
                  )}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress Bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Budget Progress</CardTitle>
                <CardDescription>Track your spending against your monthly limit</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAdjustForm(true)}>
                Adjust Budget
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Spent</span>
                  <span className="font-mono">${SPENT_THIS_MONTH.toFixed(4)}</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-violet-500'
                    )}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">of ${MONTHLY_BUDGET.toFixed(3)}</p>
                <p className="text-lg font-semibold">${REMAINING.toFixed(3)} left</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={percentUsed >= 90 ? 'destructive' : percentUsed >= 75 ? 'default' : 'secondary'}>
                90% threshold
              </Badge>
              <Badge variant={percentUsed >= 75 ? 'destructive' : percentUsed >= 50 ? 'default' : 'secondary'}>
                75% threshold
              </Badge>
              <Badge variant={percentUsed >= 50 ? 'default' : 'secondary'}>
                50% threshold
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Agent */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Agent</CardTitle>
              <CardDescription>Distribution of spending across agents</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart data={SPENDING_BY_AGENT} />
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Breakdown by task category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBar data={SPENDING_BY_CATEGORY} />
            </CardContent>
          </Card>
        </div>

        {/* Budget Alerts History */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Alerts History</CardTitle>
            <CardDescription>Past notifications when spending reached thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            {ALERT_HISTORY.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Spent at Alert</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ALERT_HISTORY.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(alert.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{alert.threshold}%</Badge>
                      </TableCell>
                      <TableCell className="font-mono">${alert.spent.toFixed(4)}</TableCell>
                      <TableCell className="font-mono">${alert.budget.toFixed(4)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(alert.acknowledged ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}
                        >
                          {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No alerts triggered yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Adjustment Form */}
        {showAdjustForm && (
          <Card>
            <CardHeader>
              <CardTitle>Adjust Budget</CardTitle>
              <CardDescription>Modify your monthly budget limit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">New Monthly Budget</label>
                  <input
                    type="number"
                    step="0.001"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Enter new budget"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAdjustForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Handle budget adjustment
                    setShowAdjustForm(false)
                    setAdjustAmount('')
                  }}>
                    Apply Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}