"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

const QUALIFICATION_REQUIREMENTS = [
  { label: "Complete KYC verification", completed: true },
  { label: "Stake minimum 500 $MESH", completed: true },
  { label: "Deploy at least one active agent", completed: true },
  { label: "Maintain 95% uptime over 30 days", completed: true },
  { label: "Agree to Genesis terms of service", completed: true },
]

const HISTORICAL_BONUS_DATA = [
  { month: "Jan 2026", bonusEarned: 245, multiplier: "2.0x" },
  { month: "Feb 2026", bonusEarned: 312, multiplier: "2.0x" },
  { month: "Mar 2026", bonusEarned: 289, multiplier: "2.0x" },
  { month: "Apr 2026", bonusEarned: 401, multiplier: "2.0x" },
  { month: "May 2026", bonusEarned: 378, multiplier: "2.0x" },
]

function RewardsTracker() {
  const bonusEarningsMonth = 378
  const multiplierStatus = "2.0x Active"
  const daysRemaining = 211

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rewards Tracker</CardTitle>
          <Badge className="bg-violet-600 text-white">2x Active</Badge>
        </div>
        <CardDescription>Your Genesis provider rewards status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bonus Earnings This Month</p>
            <p className="text-3xl font-bold text-violet-600">
              {bonusEarningsMonth}
              <span className="text-sm font-normal text-muted-foreground ml-1">$MESH</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Multiplier Status</p>
            <p className="text-3xl font-bold text-emerald-600">{multiplierStatus}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Genesis Period</span>
            <span className="font-medium">{daysRemaining} days remaining</span>
          </div>
          <Progress value={35} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            6-month Genesis period: Dec 2025 - Jun 2026
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function GenesisPeriodCountdown() {
  const now = new Date()
  const endDate = new Date("2026-12-03")
  const diffMs = endDate.getTime() - now.getTime()
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  const diffHours = Math.max(0, Math.ceil((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genesis Period Countdown</CardTitle>
        <CardDescription>Time remaining in your 6-month Genesis term</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-violet-600">{diffDays}</p>
            <p className="text-sm text-muted-foreground">Days</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-violet-600">{diffHours}</p>
            <p className="text-sm text-muted-foreground">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-muted-foreground">6</p>
            <p className="text-sm text-muted-foreground">Months Total</p>
          </div>
        </div>
        <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-4 text-center">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            After your Genesis period ends, you will transition to standard provider terms with reduced rewards.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function QualificationChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualification Requirements</CardTitle>
        <CardDescription>Requirements to maintain Genesis status</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {QUALIFICATION_REQUIREMENTS.map((req) => (
            <li key={req.label} className="flex items-start gap-3 text-sm">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function MaintainStatusGuide() {
  const requirements = [
    { title: "Uptime Requirement", desc: "Maintain at least 95% uptime over any 30-day rolling period. Monitor your agent health via the dashboard." },
    { title: "Minimum Stake", desc: "Keep at least 500 $MESH staked in your provider wallet. Insufficient stake triggers a 30-day cure period." },
    { title: "Agent Activity", desc: "Ensure at least one agent remains active and responsive. Inactive agents for 7+ days may trigger review." },
    { title: "SLA Compliance", desc: "Respond to any SLA breach notices within 48 hours. Repeated breaches may result in Genesis status revocation." },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Maintain Genesis Status</CardTitle>
        <CardDescription>Keep your 2x rewards active by meeting these standards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.map((req) => (
          <div key={req.title} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">{req.title}</h4>
              <p className="text-xs text-muted-foreground">{req.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function HistoricalBonusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Bonus Earnings</CardTitle>
        <CardDescription>Your monthly Genesis bonus earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Bonus Earned</TableHead>
              <TableHead>Multiplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORICAL_BONUS_DATA.map((row) => (
              <TableRow key={row.month}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell className="text-violet-600 font-semibold">{row.bonusEarned} $MESH</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                    {row.multiplier}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function GenesisProviderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge className="mb-6 px-4 py-1.5 text-sm bg-violet-600 text-white">
          2x Rewards Active
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Genesis Provider
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Manage your Genesis provider status, track rewards, and monitor your 2x multiplier benefits.
        </p>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/genesis/how-to-join">View How to Join</Link>
        </Button>
      </section>

      {/* Rewards Tracker */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <RewardsTracker />
            <GenesisPeriodCountdown />
          </div>
        </div>
      </section>

      {/* Status Cards */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <QualificationChecklist />
            <MaintainStatusGuide />
          </div>
        </div>
      </section>

      {/* Historical Earnings */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <HistoricalBonusChart />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Upgrade Your Provider Experience
          </h2>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            Refer other providers to earn additional bonuses and maintain your Genesis status longer.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-violet-900"
          >
            <Link href="/genesis/how-to-join">Become a Genesis Provider</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}