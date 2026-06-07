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

export default function ClientSettingsPage() {
  const [budgetEnabled, setBudgetEnabled] = useState(true)
  const [alertEnabled, setAlertEnabled] = useState(true)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your client account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Budget Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Budget Management</CardTitle>
                <CardDescription>Control your spending limits and alerts</CardDescription>
              </div>
              <Switch checked={budgetEnabled} onCheckedChange={setBudgetEnabled} />
            </div>
          </CardHeader>
          {budgetEnabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Monthly Budget</p>
                  <p className="text-sm text-muted-foreground">$500 limit per month</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Per-Session Limit</p>
                  <p className="text-sm text-muted-foreground">$50 max per session</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <Button variant="outline">View Spending Details</Button>
            </CardContent>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive alerts and updates</CardDescription>
              </div>
              <Switch checked={alertEnabled} onCheckedChange={setAlertEnabled} />
            </div>
          </CardHeader>
          {alertEnabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Session Alerts</p>
                  <p className="text-sm text-muted-foreground">Start/end, SLA warnings</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">50%, 75%, 90%, exceeded</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Proposal Notifications</p>
                  <p className="text-sm text-muted-foreground">New proposals, status updates</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}