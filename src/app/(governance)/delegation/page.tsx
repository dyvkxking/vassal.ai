"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock delegators data
const myDelegators = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    amount: 125000,
    votes: 8,
    lastActivity: "2026-06-01",
  },
  {
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    amount: 85000,
    votes: 5,
    lastActivity: "2026-05-28",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    amount: 42000,
    votes: 3,
    lastActivity: "2026-05-15",
  },
]

// Mock delegate history
const delegationHistory = [
  { date: "2026-05-20", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123", amount: 125000, action: "Delegate" },
  { date: "2026-04-15", address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", amount: 85000, action: "Delegate" },
  { date: "2026-03-10", address: "0x0000000000000000000000000000000000000000", amount: 200000, action: "Undelegate" },
  { date: "2026-01-05", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123", amount: 150000, action: "Delegate" },
]

// Pending undelegation
const pendingUndelegation = {
  amount: 50000,
  releaseDate: "2026-06-10",
  claimable: false,
}

// Current delegate
const currentDelegate = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
  amount: 125000,
  since: "2026-05-20",
}

// Auto-delegate rules
const autoDelegateRules = [
  { id: "1", category: "Treasury Management", enabled: true, delegate: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123" },
  { id: "2", category: "Partnership Votes", enabled: false, delegate: "0x8ba1f109551bD432803012645Ac136ddd64DBA72" },
  { id: "3", category: "Protocol Upgrades", enabled: true, delegate: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123" },
]

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatAmount(amount: number): string {
  return amount.toLocaleString()
}

export default function DelegationPage() {
  const [searchAddress, setSearchAddress] = useState("")
  const [delegateAddress, setDelegateAddress] = useState("")
  const [delegateAmount, setDelegateAmount] = useState(50)
  const [isDelegating, setIsDelegating] = useState(false)
  const [rules, setRules] = useState(autoDelegateRules)

  const handleDelegate = () => {
    setIsDelegating(true)
    setTimeout(() => {
      setIsDelegating(false)
      setDelegateAddress("")
      setDelegateAmount(50)
    }, 1500)
  }

  const handleUndelegate = () => {
    // In real app, this would trigger undelegation flow
  }

  const handleClaim = () => {
    // In real app, this would claim undelegated tokens
  }

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delegation</h1>
          <p className="text-muted-foreground mt-1">
            Manage your voting power delegation
          </p>
        </div>
      </div>

      {/* My Delegators Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Delegators</CardTitle>
          <CardDescription>
            Addresses that have delegated their voting power to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myDelegators.map((delegator, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{formatAddress(delegator.address)}</code>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatAmount(delegator.amount)} tokens delegated
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{delegator.votes} votes cast</p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {delegator.lastActivity}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total delegated to you:</span>
                <span className="font-medium">
                  {formatAmount(myDelegators.reduce((sum, d) => sum + d.amount, 0))} tokens
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Delegate Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Delegate</CardTitle>
          <CardDescription>
            The address you are currently delegating your voting power to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentDelegate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{formatAddress(currentDelegate.address)}</code>
                    <Badge>Delegated</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatAmount(currentDelegate.amount)} tokens delegated since{" "}
                    {currentDelegate.since}
                  </p>
                </div>
                <Button variant="destructive" onClick={handleUndelegate}>
                  Undelegate
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Not delegating to anyone
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delegate Search and Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delegate Search */}
        <Card>
          <CardHeader>
            <CardTitle>Find Delegate</CardTitle>
            <CardDescription>
              Search for an address to delegate your voting power to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter address (0x...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
              <Button variant="secondary">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Delegate Form */}
        <Card>
          <CardHeader>
            <CardTitle>Delegate Voting Power</CardTitle>
            <CardDescription>
              Delegate your tokens to another address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delegateAddress">Delegate Address</Label>
              <Input
                id="delegateAddress"
                placeholder="0x..."
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delegateAmount">
                Amount to Delegate: {delegateAmount}%
              </Label>
              <Slider
                id="delegateAmount"
                min={0}
                max={100}
                step={1}
                value={[delegateAmount]}
                onValueChange={(value) => setDelegateAmount(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleDelegate}
              disabled={!delegateAddress || isDelegating}
            >
              {isDelegating ? "Delegating..." : "Delegate"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Undelegation */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Undelegation</CardTitle>
          <CardDescription>
            Tokens waiting to be released after the undelegation period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUndelegation ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">
                  {formatAmount(pendingUndelegation.amount)} tokens
                </p>
                <p className="text-sm text-muted-foreground">
                  Release date: {pendingUndelegation.releaseDate}
                </p>
              </div>
              <Button
                disabled={!pendingUndelegation.claimable}
                onClick={handleClaim}
              >
                {pendingUndelegation.claimable ? "Claim" : "Locked"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No pending undelegations
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delegation History */}
      <Card>
        <CardHeader>
          <CardTitle>Delegation History</CardTitle>
          <CardDescription>
            Your recent delegation and undelegation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delegationHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                  <TableCell>
                    <code className="text-sm">{formatAddress(entry.address)}</code>
                  </TableCell>
                  <TableCell>{formatAmount(entry.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.action === "Delegate" ? "default" : "secondary"}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Auto-Delegate Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Delegate Rules</CardTitle>
          <CardDescription>
            Automatically delegate to specific addresses for certain proposal categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{rule.category}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Delegate to:</span>
                    <code className="font-mono">{formatAddress(rule.delegate)}</code>
                  </div>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-end">
            <Button variant="secondary">Save Rules</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}