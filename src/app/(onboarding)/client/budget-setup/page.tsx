"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Circle, CheckCircle2, DollarSign, AlertTriangle, Bell } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2 },
  { number: 2, label: "Choose Role", icon: CheckCircle2 },
  { number: 3, label: "Setup", icon: Circle },
]

const MONTHLY_BUDGETS = [
  { value: 25, label: "$25/mo" },
  { value: 50, label: "$50/mo" },
  { value: 100, label: "$100/mo" },
  { value: 250, label: "$250/mo" },
  { value: 500, label: "$500/mo" },
]

const SESSION_MAX_BUDGETS = [
  { value: 5, label: "$5/session" },
  { value: 10, label: "$10/session" },
  { value: 25, label: "$25/session" },
  { value: 50, label: "$50/session" },
]

const BUDGET_ALERTS = [
  { id: "50", label: "Alert at 50% of budget" },
  { id: "75", label: "Alert at 75% of budget" },
  { id: "90", label: "Alert at 90% of budget" },
  { id: "100", label: "Alert when budget exceeded" },
]

export default function BudgetSetupPage() {
  const [monthlyBudget, setMonthlyBudget] = useState(50)
  const [sessionMaxBudget, setSessionMaxBudget] = useState(10)
  const [alerts, setAlerts] = useState(["50", "75"])

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.number <= 3
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.number <= 3 ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-4 h-px w-12 bg-muted-foreground/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Budget Setup */}
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-semibold">Set Your Budget</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Control how much you spend on agent sessions
            </p>

            {/* Monthly Budget */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20">
                    <DollarSign className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Monthly Budget</CardTitle>
                    <CardDescription>Maximum spending per month</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {MONTHLY_BUDGETS.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => setMonthlyBudget(budget.value)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        monthlyBudget === budget.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">{budget.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Per-Session Max Budget */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                    <AlertTriangle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Per-Session Maximum</CardTitle>
                    <CardDescription>Maximum spending per session</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {SESSION_MAX_BUDGETS.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => setSessionMaxBudget(budget.value)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        sessionMaxBudget === budget.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">{budget.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Budget Alerts</CardTitle>
                    <CardDescription>Get notified when spending reaches certain thresholds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {BUDGET_ALERTS.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => toggleAlert(alert.id)}
                      className={`flex items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                        alerts.includes(alert.id)
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border hover:border-amber-500/50"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded ${
                          alerts.includes(alert.id)
                            ? "bg-amber-500 text-white"
                            : "border border-muted-foreground/30"
                        }`}
                      >
                        {alerts.includes(alert.id) && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-sm">{alert.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Budget Summary</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">${monthlyBudget}</p>
                <p className="text-sm text-muted-foreground">Monthly Limit</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">${sessionMaxBudget}</p>
                <p className="text-sm text-muted-foreground">Per Session</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/client/first-session">
              <Button variant="ghost">← Back</Button>
            </Link>
            <Link href="/client/complete">
              <Button>Complete Setup →</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}