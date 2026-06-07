'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

// Mock data
const stats = {
  totalEarnings: 12847.52,
  pendingPayout: 2340.00,
  thisMonth: 3842.75,
  genesisBonus: 2150.00,
}

const revenueBreakdown = [
  { category: "Base earnings", amount: 6340.00, percentage: 49 },
  { category: "SLA compliance bonuses", amount: 2180.00, percentage: 17 },
  { category: "Genesis bonuses", amount: 2150.00, percentage: 17 },
  { category: "Skill invocation earnings", amount: 2177.52, percentage: 17 },
]

const payoutHistory = [
  {
    date: "2026-06-01",
    amount: 1850.00,
    status: "Paid",
    txHash: "0x7f3a...8b2c",
  },
  {
    date: "2026-05-15",
    amount: 2340.00,
    status: "Paid",
    txHash: "0x3d9e...1a4f",
  },
  {
    date: "2026-05-01",
    amount: 1920.50,
    status: "Paid",
    txHash: "0x8c1b...7e9d",
  },
  {
    date: "2026-04-15",
    amount: 2150.00,
    status: "Paid",
    txHash: "0x2f4a...9c3b",
  },
  {
    date: "2026-04-01",
    amount: 1780.25,
    status: "Paid",
    txHash: "0x5e7f...4a8c",
  },
]

const pendingPayout = {
  amount: 3842.75,
  unlockDate: "2026-06-15",
}

const forecast = {
  projectedThisMonth: 4200.0,
  sessionsPerDay: 47,
  avgSessionsPerDay: 42,
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function UnicodeBarChart({ percentage }: { percentage: number }) {
  const filled = Math.round(percentage / 5)
  const empty = 20 - filled
  return (
    <span className="font-mono text-xs text-muted-foreground">
      [{"=".repeat(filled)}
      {" ".repeat(empty)}] {percentage}%
    </span>
  )
}

export default function EarningsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Earnings</h1>
          <p className="text-muted-foreground">Your provider earnings breakdown</p>
        </div>
        <Button
          variant="outline"
          onClick={() => console.log("Exporting earnings...")}
        >
          Export Earnings
        </Button>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayout)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Genesis Bonus
              <Badge variant="secondary" className="text-xs">
                2x
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.genesisBonus)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="tabular-nums">{formatCurrency(item.amount)}</span>
                </div>
                <UnicodeBarChart percentage={item.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Payouts */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-3xl font-bold">{formatCurrency(pendingPayout.amount)}</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm text-muted-foreground">Unlock Date</div>
              <div className="text-lg font-medium">{formatDate(pendingPayout.unlockDate)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Forecast */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Earnings Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Projected this month:{" "}
            <span className="font-bold text-foreground">
              {formatCurrency(forecast.projectedThisMonth)}
            </span>{" "}
            based on {forecast.sessionsPerDay} sessions/day avg (vs.{" "}
            {forecast.avgSessionsPerDay} sessions/day historically)
          </p>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.txHash}>
                  <TableCell>{formatDate(payout.date)}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payout.status === "Paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {payout.txHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}