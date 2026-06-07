"use client"

import Link from "next/link"
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
import { Download, DollarSign, TrendingUp, Clock, BarChart3 } from 'lucide-react'

const stats = {
  totalRevenue: 48750.0,
  thisMonth: 8420.0,
  pendingSettlements: 2340.0,
  avgPerAgent: 3150.0,
}

const revenuePerAgent = [
  { name: "DeFi Pulse Scanner", revenueThisMonth: 4200.0, totalRevenue: 18500.0, cut: 2520.0 },
  { name: "Token Price Oracle", revenueThisMonth: 2850.0, totalRevenue: 15200.0, cut: 1710.0 },
  { name: "Wallet Intelligence", revenueThisMonth: 1370.0, totalRevenue: 10050.0, cut: 822.0 },
  { name: "DAO Proposal Digest", revenueThisMonth: 0, totalRevenue: 5000.0, cut: 0 },
]

const slaRefunds = [
  { agent: "DeFi Pulse Scanner", amount: -85.0, reason: "Latency SLA breach", date: "2026-06-01" },
  { agent: "Token Price Oracle", amount: -42.5, reason: "Resolution SLA breach", date: "2026-05-28" },
  { agent: "Wallet Intelligence", amount: -120.0, reason: "Availability SLA breach", date: "2026-05-25" },
]

const pendingSettlements = [
  { amount: 1540.0, expectedDate: "2026-06-15", agent: "DeFi Pulse Scanner" },
  { amount: 800.0, expectedDate: "2026-06-20", agent: "Token Price Oracle" },
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
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 rounded-2xl ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {children}
    </div>
  )
}

function StatCard({
  title,
  value,
  subValue,
  accent,
  icon: Icon,
  highlight,
}: {
  title: string
  value: string
  subValue?: string
  accent: string
  icon: React.ComponentType<{ className?: string }>
  highlight?: boolean
}) {
  return (
    <div
      className="p-5 rounded-xl relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        transitionTimingFunction: "var(--ease-out-expo)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs uppercase font-medium"
            style={{ color: "var(--muted-foreground)", letterSpacing: "2px" }}
          >
            {title}
          </span>
          <Icon className="h-4 w-4 opacity-50" />
        </div>
        <div
          className="text-3xl font-semibold"
          style={{
            fontFamily: "var(--font-display-serif, inherit)",
            color: highlight ? "rgba(245, 158, 11, 0.95)" : undefined,
          }}
        >
          {value}
        </div>
        {subValue && (
          <div className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuilderEarningsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background:
                "radial-gradient(ellipse at 25% 25%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(245, 158, 11, 0.06) 0%, transparent 50%)",
            }}
          />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)",
            opacity: 0.2,
          }}
        />
        <div className="container relative py-10 md:py-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="inline-block w-8 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6))" }}
            />
            <span
              className="text-xs uppercase font-medium"
              style={{ color: "rgba(16, 185, 129, 0.8)", letterSpacing: "3px" }}
            >
              Builder Treasury
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display-serif, inherit)",
                  fontSize: "clamp(2.25rem, 5dvw, 4em)",
                  lineHeight: "1em",
                  letterSpacing: "-0.02em",
                }}
              >
                Earnings
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: "var(--font-body-light, inherit)",
                  color: "var(--muted-foreground)",
                }}
              >
                Your revenue breakdown, SLA refunds, settlements, and forecasted earnings.
              </p>
            </div>
            <Button
              variant="outline"
              className="btn-ghost-transition"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="container py-8 space-y-6">
        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subValue="All time"
            accent="rgba(16, 185, 129, 0.15)"
            icon={DollarSign}
          />
          <StatCard
            title="This Month"
            value={formatCurrency(stats.thisMonth)}
            subValue="+24% vs last month"
            accent="rgba(139, 92, 246, 0.15)"
            icon={TrendingUp}
          />
          <StatCard
            title="Pending Settlements"
            value={formatCurrency(stats.pendingSettlements)}
            subValue="Releases Mon 9:00"
            accent="rgba(245, 158, 11, 0.15)"
            icon={Clock}
            highlight
          />
          <StatCard
            title="Avg per Agent"
            value={formatCurrency(stats.avgPerAgent)}
            subValue="Monthly average"
            accent="rgba(59, 130, 246, 0.15)"
            icon={BarChart3}
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <TabsTrigger value="revenue">Revenue by Agent</TabsTrigger>
            <TabsTrigger value="refunds">SLA Refunds</TabsTrigger>
            <TabsTrigger value="settlements">Pending Settlements</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          {/* REVENUE */}
          <TabsContent value="revenue">
            <GlassCard>
              <div className="mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-display-serif, inherit)" }}
                >
                  Revenue per Agent
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Your cut is 60% of net revenue after platform fees.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">This Month</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Your Cut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenuePerAgent.map((agent) => (
                    <TableRow key={agent.name} style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-right tabular-nums font-mono">
                        {formatCurrency(agent.revenueThisMonth)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-mono">
                        {formatCurrency(agent.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <Badge
                          variant="secondary"
                          className="font-mono"
                          style={{
                            background: "rgba(16, 185, 129, 0.1)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "rgba(16, 185, 129, 0.95)",
                          }}
                        >
                          {formatCurrency(agent.cut)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCard>
          </TabsContent>

          {/* REFUNDS */}
          <TabsContent value="refunds">
            <GlassCard>
              <div className="mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-display-serif, inherit)" }}
                >
                  SLA Refunds
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Money refunded to clients due to SLA breaches.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                    <TableHead>Agent</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaRefunds.map((refund, i) => (
                    <TableRow key={i} style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}>
                      <TableCell className="font-medium">{refund.agent}</TableCell>
                      <TableCell style={{ color: "var(--muted-foreground)" }}>{refund.reason}</TableCell>
                      <TableCell style={{ color: "var(--muted-foreground)" }}>{formatDate(refund.date)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <Badge
                          variant="secondary"
                          className="font-mono"
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "rgba(239, 68, 68, 0.95)",
                          }}
                        >
                          {formatCurrency(refund.amount)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div
                className="mt-4 p-4 rounded-lg"
                style={{
                  background: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                }}
              >
                <p className="text-sm font-medium" style={{ color: "rgba(239, 68, 68, 0.95)" }}>
                  Total Refunds: {formatCurrency(slaRefunds.reduce((sum, r) => sum + r.amount, 0))}
                </p>
              </div>
            </GlassCard>
          </TabsContent>

          {/* SETTLEMENTS */}
          <TabsContent value="settlements">
            <GlassCard>
              <div className="mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-display-serif, inherit)" }}
                >
                  Pending Settlements
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Amounts not yet paid out to your account.
                </p>
              </div>
              <div className="space-y-3">
                {pendingSettlements.map((settlement, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <div>
                      <div
                        className="font-mono font-semibold text-lg"
                        style={{ color: "rgba(245, 158, 11, 0.95)" }}
                      >
                        {formatCurrency(settlement.amount)}
                      </div>
                      <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        From {settlement.agent}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Expected
                      </div>
                      <div className="font-medium text-sm">{formatDate(settlement.expectedDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6" style={{ background: "rgba(255, 255, 255, 0.08)" }} />
              <div>
                <h3
                  className="font-semibold mb-3"
                  style={{ fontFamily: "var(--font-display-serif, inherit)" }}
                >
                  Payment Schedule
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--muted-foreground)" }}>Next Payout</span>
                    <span className="font-mono">{formatDate(paymentSchedule.nextPayoutDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--muted-foreground)" }}>Frequency</span>
                    <span>{paymentSchedule.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--muted-foreground)" }}>Minimum Payout</span>
                    <span className="font-mono">{formatCurrency(paymentSchedule.minimumPayout)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* WITHDRAWALS */}
          <TabsContent value="withdrawals">
            <GlassCard>
              <div className="mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-display-serif, inherit)" }}
                >
                  Withdrawal History
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Record of past payouts to your wallet.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tx Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalHistory.map((withdrawal, i) => (
                    <TableRow key={i} style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}>
                      <TableCell>{formatDate(withdrawal.date)}</TableCell>
                      <TableCell className="text-right tabular-nums font-mono">
                        {formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            background: "rgba(16, 185, 129, 0.1)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "rgba(16, 185, 129, 0.95)",
                          }}
                        >
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {withdrawal.txHash}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* FORECAST */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-display-serif, inherit)" }}
            >
              Revenue Forecast
            </h2>
            <Link href="/builder-analytics/revenue"><Button variant="ghost" size="sm">View detail</Button></Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Projected this month at{" "}
                <span className="font-medium text-foreground font-mono">
                  {formatCurrency(forecast.avgPerDay)}/day
                </span>{" "}
                average
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl font-semibold"
                  style={{
                    fontFamily: "var(--font-display-serif, inherit)",
                    color: "rgba(16, 185, 129, 0.95)",
                  }}
                >
                  {formatCurrency(forecast.projectedThisMonth)}
                </span>
                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  · {forecast.daysRemaining} days remaining
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
