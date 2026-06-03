"use client"

import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const stats = {
  totalRevenue: 48750.0,
  thisMonth: 8420.0,
  pendingSettlements: 2340.0,
  avgPerAgent: 3150.0,
}

const revenuePerAgent = [
  {
    name: "Customer Support Agent",
    revenueThisMonth: 4200.0,
    totalRevenue: 18500.0,
    cut: 2520.0, // 60% of net after platform fee
  },
  {
    name: "Sales Assistant",
    revenueThisMonth: 2850.0,
    totalRevenue: 15200.0,
    cut: 1710.0,
  },
  {
    name: "Technical Support Bot",
    revenueThisMonth: 1370.0,
    totalRevenue: 10050.0,
    cut: 822.0,
  },
  {
    name: "Onboarding Assistant",
    revenueThisMonth: 0,
    totalRevenue: 5000.0,
    cut: 0,
  },
]

const slaRefunds = [
  { agent: "Customer Support Agent", amount: -85.0, reason: "Response time SLA breach", date: "2026-06-01" },
  { agent: "Sales Assistant", amount: -42.5, reason: "Resolution SLA breach", date: "2026-05-28" },
  { agent: "Technical Support Bot", amount: -120.0, reason: "Availability SLA breach", date: "2026-05-25" },
]

const pendingSettlements = [
  { amount: 1540.0, expectedDate: "2026-06-15", agent: "Customer Support Agent" },
  { amount: 800.0, expectedDate: "2026-06-20", agent: "Sales Assistant" },
]

const withdrawalHistory = [
  { date: "2026-06-01", amount: 1850.0, status: "Completed", txHash: "0x7f3a...8b2c" },
  { date: "2026-05-15", amount: 2340.0, status: "Completed", txHash: "0x3d9e...1a4f" },
  { date: "2026-05-01", amount: 1920.5, status: "Completed", txHash: "0x8c1b...7e9d" },
  { date: "2026-04-15", amount: 2150.0, status: "Completed", txHash: "0x2f4a...9c3b" },
  { date: "2026-04-01", amount: 1780.25, status: "Completed", txHash: "0x5e7f...4a8c" },
]

const paymentSchedule = {
  nextPayoutDate: "2026-06-15",
  frequency: "Bi-weekly",
  minimumPayout: 50.0,
}

const forecast = {
  projectedThisMonth: 8900.0,
  avgPerDay: 280.0,
  daysRemaining: 12,
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

export default function BuilderEarningsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Earnings</h1>
          <p className="text-muted-foreground">Your builder earnings and revenue breakdown</p>
        </div>
        <Button variant="outline" onClick={() => console.log("Export earnings")}>
          Export Report
        </Button>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Settlements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {formatCurrency(stats.pendingSettlements)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg per Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgPerAgent)}</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue by Agent</TabsTrigger>
          <TabsTrigger value="refunds">SLA Refunds</TabsTrigger>
          <TabsTrigger value="settlements">Pending Settlements</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
        </TabsList>

        {/* Revenue Per Agent */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Per Agent</CardTitle>
              <CardDescription>
                Your cut is 60% of net revenue after platform fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead className="text-right">Revenue This Month</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Your Cut (60%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenuePerAgent.map((agent) => (
                    <TableRow key={agent.name}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(agent.revenueThisMonth)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(agent.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <Badge variant="default">
                          {formatCurrency(agent.cut)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Refunds */}
        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>SLA Refunds</CardTitle>
              <CardDescription>
                Money refunded to clients due to SLA breaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaRefunds.map((refund, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{refund.agent}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>{formatDate(refund.date)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <Badge variant="destructive">
                          {formatCurrency(refund.amount)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  Total Refunds: {formatCurrency(slaRefunds.reduce((sum, r) => sum + r.amount, 0))}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Settlements */}
        <TabsContent value="settlements">
          <Card>
            <CardHeader>
              <CardTitle>Pending Settlements</CardTitle>
              <CardDescription>
                Amounts not yet paid out to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pendingSettlements.map((settlement, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{formatCurrency(settlement.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      From {settlement.agent}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Expected</div>
                    <div className="font-medium">{formatDate(settlement.expectedDate)}</div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Payment Schedule</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Payout Date</span>
                    <span>{formatDate(paymentSchedule.nextPayoutDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency</span>
                    <span>{paymentSchedule.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Payout</span>
                    <span>{formatCurrency(paymentSchedule.minimumPayout)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawal History */}
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Record of past payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalHistory.map((withdrawal, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatDate(withdrawal.date)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            withdrawal.status === "Completed" ? "default" : "secondary"
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {withdrawal.txHash}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Revenue Forecast */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Projected this month based on{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(forecast.avgPerDay)}/day
                </span>{" "}
                average
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(forecast.projectedThisMonth)}</span>
                <span className="text-sm text-muted-foreground">
                  projected for {forecast.daysRemaining} days remaining
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Days Remaining</div>
              <div className="text-2xl font-bold">{forecast.daysRemaining}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}