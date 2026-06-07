'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AGENT_CATEGORIES } from '@/constants'

interface NotificationPrefs {
  email: boolean
  inApp: boolean
  threshold50: boolean
  threshold75: boolean
  threshold90: boolean
}

export default function BudgetManagePage() {
  const [monthlyCap, setMonthlyCap] = useState('1.5')
  const [sessionMax, setSessionMax] = useState('0.2')
  const [budgetEnabled, setBudgetEnabled] = useState(true)
  const [sessionCapEnabled, setSessionCapEnabled] = useState(true)
  const [excludedCategories, setExcludedCategories] = useState<string[]>([])
  const [resetDay, setResetDay] = useState('1')
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    email: true,
    inApp: true,
    threshold50: true,
    threshold75: true,
    threshold90: true,
  })

  const toggleCategory = (category: string) => {
    setExcludedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">
              Configure spending limits, caps, and notification preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Monthly Cap Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Cap</CardTitle>
            <CardDescription>Set a hard limit on total spending per month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="monthly-cap-toggle">Enable Monthly Cap</Label>
                <p className="text-sm text-muted-foreground">Limit total monthly spending</p>
              </div>
              <Switch
                id="monthly-cap-toggle"
                checked={budgetEnabled}
                onCheckedChange={setBudgetEnabled}
              />
            </div>
            {budgetEnabled && (
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="monthly-cap">Monthly Cap Amount</Label>
                  <Input
                    id="monthly-cap"
                    type="number"
                    step="0.001"
                    value={monthlyCap}
                    onChange={(e) => setMonthlyCap(e.target.value)}
                    className="w-40"
                    disabled={!budgetEnabled}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Per-Session Max Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Per-Session Maximum</CardTitle>
            <CardDescription>Limit spending on individual sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-cap-toggle">Enable Session Cap</Label>
                <p className="text-sm text-muted-foreground">Prevent overspending on single sessions</p>
              </div>
              <Switch
                id="session-cap-toggle"
                checked={sessionCapEnabled}
                onCheckedChange={setSessionCapEnabled}
              />
            </div>
            {sessionCapEnabled && (
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="session-max">Max Per Session</Label>
                  <Input
                    id="session-max"
                    type="number"
                    step="0.001"
                    value={sessionMax}
                    onChange={(e) => setSessionMax(e.target.value)}
                    className="w-40"
                    disabled={!sessionCapEnabled}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Excluded Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Exclude Categories from Budget</CardTitle>
            <CardDescription>Select categories that should not count against your budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AGENT_CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={excludedCategories.includes(category) ? 'destructive' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => toggleCategory(category)}
                >
                  {excludedCategories.includes(category) ? 'Excluded' : ''}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>
            {excludedCategories.length > 0 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {excludedCategories.length} category(ies) excluded from budget tracking
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Reset Date */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Reset Date</CardTitle>
            <CardDescription>Configure when your monthly budget resets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-day">Reset Day of Month</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="reset-day"
                  type="number"
                  min="1"
                  max="28"
                  value={resetDay}
                  onChange={(e) => setResetDay(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  Budget resets on day {resetDay} of each month
                </span>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next reset:</span>
                <span className="font-medium">July 1, 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how and when you receive budget alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts in the dashboard</p>
              </div>
              <Switch
                checked={notifications.inApp}
                onCheckedChange={(checked) => setNotifications({ ...notifications, inApp: checked })}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Alert Thresholds</Label>
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-100 text-green-700">50%</Badge>
                    <span className="text-sm">Alert at 50% budget usage</span>
                  </div>
                  <Switch
                    checked={notifications.threshold50}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, threshold50: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">75%</Badge>
                    <span className="text-sm">Alert at 75% budget usage</span>
                  </div>
                  <Switch
                    checked={notifications.threshold75}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, threshold75: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-red-100 text-red-700">90%</Badge>
                    <span className="text-sm">Alert at 90% budget usage</span>
                  </div>
                  <Switch
                    checked={notifications.threshold90}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, threshold90: checked })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => {
            setMonthlyCap('1.5')
            setSessionMax('0.2')
            setBudgetEnabled(true)
            setSessionCapEnabled(true)
            setExcludedCategories([])
            setResetDay('1')
            setNotifications({
              email: true,
              inApp: true,
              threshold50: true,
              threshold75: true,
              threshold90: true,
            })
          }}>
            Reset to Defaults
          </Button>
          <Button onClick={() => {
            // Save configuration
          }}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}