"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const mockSpendingByCategory = [
  { category: "Agent Sessions", amount: 320, percentage: 64 },
  { category: "Compute", amount: 120, percentage: 24 },
  { category: "Storage", amount: 40, percentage: 8 },
  { category: "API Calls", amount: 20, percentage: 4 },
]

export default function ClientBudgetPage() {
  const [monthlyBudget, setMonthlyBudget] = useState("500")
  const [sessionBudget, setSessionBudget] = useState("50")
  const [alerts, setAlerts] = useState({
    fifty: true,
    seventyFive: true,
    ninety: true,
    exceeded: true,
  })
  const [resetDay, setResetDay] = useState("1")

  const currentSpending = 500
  const budgetCap = 500
  const percentUsed = (currentSpending / parseInt(monthlyBudget)) * 100

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Budget Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your spending limits and budget alerts
        </p>
      </div>

      <div className="space-y-8">
        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Set your monthly spending cap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-budget">Monthly Budget Cap ($)</Label>
              <Input
                id="monthly-budget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-budget">Per-Session Max Budget ($)</Label>
              <Input
                id="session-budget"
                type="number"
                value={sessionBudget}
                onChange={(e) => setSessionBudget(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-day">Budget Reset Day of Month</Label>
              <Input
                id="reset-day"
                type="number"
                min="1"
                max="28"
                value={resetDay}
                onChange={(e) => setResetDay(e.target.value)}
                className="max-w-[200px]"
              />
              <p className="text-xs text-muted-foreground">Budget resets on this day each month</p>
            </div>
            <Button>Save Budget Settings</Button>
          </CardContent>
        </Card>

        {/* Current Spending */}
        <Card>
          <CardHeader>
            <CardTitle>Current Spending</CardTitle>
            <CardDescription>June 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>${currentSpending} of ${budgetCap}</span>
                <span>{percentUsed.toFixed(0)}%</span>
              </div>
              <Progress value={percentUsed} />
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Spending by Category</Label>
              {mockSpendingByCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono w-16 text-right">${item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Alerts</CardTitle>
            <CardDescription>Get notified when you reach spending thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>50% Alert</Label>
                <p className="text-sm text-muted-foreground">Notify when half the budget is used</p>
              </div>
              <Switch
                checked={alerts.fifty}
                onCheckedChange={(checked) => setAlerts({ ...alerts, fifty: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>75% Alert</Label>
                <p className="text-sm text-muted-foreground">Notify when three-quarters is used</p>
              </div>
              <Switch
                checked={alerts.seventyFive}
                onCheckedChange={(checked) => setAlerts({ ...alerts, seventyFive: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>90% Alert</Label>
                <p className="text-sm text-muted-foreground">Notify when near budget limit</p>
              </div>
              <Switch
                checked={alerts.ninety}
                onCheckedChange={(checked) => setAlerts({ ...alerts, ninety: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Budget Exceeded Alert</Label>
                <p className="text-sm text-muted-foreground">Notify when budget limit is reached</p>
              </div>
              <Switch
                checked={alerts.exceeded}
                onCheckedChange={(checked) => setAlerts({ ...alerts, exceeded: checked })}
              />
            </div>
            <Button variant="outline">Save Alert Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}