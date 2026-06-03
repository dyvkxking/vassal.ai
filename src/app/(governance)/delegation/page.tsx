"use client"

import * as React from "react"
import { MOCK_DELEGATORS, MOCK_DELEGATIONS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface AutoDelegateRules {
  slash_amounts: boolean
  sla_thresholds: boolean
  protocol_upgrade: boolean
  fee_adjustment: boolean
  governance_process: boolean
}

export default function DelegationPage() {
  const [searchInput, setSearchInput] = React.useState("")
  const [delegateAmount, setDelegateAmount] = React.useState("")
  const [delegateAddress, setDelegateAddress] = React.useState("")
  const [currentDelegate, setCurrentDelegate] = React.useState("0xdelegate...xyz")
  const [myDelegatedAmount, setMyDelegatedAmount] = React.useState("1000000")
  const [autoRules, setAutoRules] = React.useState<AutoDelegateRules>({
    slash_amounts: true,
    sla_thresholds: false,
    protocol_upgrade: true,
    fee_adjustment: false,
    governance_process: true,
  })

  const handleDelegate = () => {
    if (delegateAddress && delegateAmount) {
      alert(`Delegated ${delegateAmount} MESH to ${delegateAddress}`)
      setDelegateAmount("")
      setDelegateAddress("")
    }
  }

  const handleUndelegate = () => {
    alert("Undelegated from current delegate")
  }

  const toggleAutoRule = (rule: keyof AutoDelegateRules) => {
    setAutoRules((prev) => ({ ...prev, [rule]: !prev[rule] }))
  }

  const recentVotingActivity = [
    { proposal: "Increase TPM Floor", choice: "for", date: "2026-06-02" },
    { proposal: "Add DeFi Category", choice: "for", date: "2026-05-28" },
    { proposal: "Reduce Slash Amounts", choice: "against", date: "2026-05-25" },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Delegation</h1>
        <p className="text-muted-foreground">Manage your voting power delegation</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Delegators */}
        <Card>
          <CardHeader>
            <CardTitle>My Delegators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search delegators..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_DELEGATORS.map((delegator, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{delegator.address}</TableCell>
                    <TableCell className="font-medium">{formatNumber(delegator.amount)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(delegator.lastActivity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-sm text-muted-foreground">
              Total: {formatNumber(MOCK_DELEGATORS.reduce((sum, d) => sum + d.amount, 0))} MESH
            </div>
          </CardContent>
        </Card>

        {/* My Delegate */}
        <Card>
          <CardHeader>
            <CardTitle>My Delegate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Current Delegate</div>
              <div className="font-mono text-lg mt-1">{currentDelegate}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Amount Delegated</div>
              <div className="text-2xl font-bold mt-1">{formatNumber(parseInt(myDelegatedAmount))} MESH</div>
            </div>
            <Button variant="destructive" className="w-full" onClick={handleUndelegate}>
              Undelegate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delegate Search */}
      <Card>
        <CardHeader>
          <CardTitle>Delegate to Someone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Delegate Address</label>
              <Input
                placeholder="0x..."
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Amount (MESH)</label>
              <Input
                placeholder="1000000"
                type="number"
                value={delegateAmount}
                onChange={(e) => setDelegateAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleDelegate}>Delegate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delegation History */}
      <Card>
        <CardHeader>
          <CardTitle>Delegation History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Delegate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DELEGATIONS.map((del) => (
                <TableRow key={del.id}>
                  <TableCell className="text-muted-foreground">{formatDate(del.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">delegate</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatNumber(del.amount)}</TableCell>
                  <TableCell className="font-mono text-xs">{del.delegate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Voting Activity */}
      <Card>
        <CardHeader>
          <CardTitle>How Your Delegate Voted</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Vote</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVotingActivity.map((activity, i) => (
                <TableRow key={i}>
                  <TableCell>{activity.proposal}</TableCell>
                  <TableCell>
                    <Badge variant={activity.choice === "for" ? "default" : "destructive"}>
                      {activity.choice}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Auto-delegate Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Delegate Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Automatically delegate your voting power on specific proposal categories
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Slash Amounts</div>
                <div className="text-sm text-muted-foreground">Automatically vote on slash amount changes</div>
              </div>
              <Switch checked={autoRules.slash_amounts} onCheckedChange={() => toggleAutoRule("slash_amounts")} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">SLA Thresholds</div>
                <div className="text-sm text-muted-foreground">Automatically vote on SLA threshold proposals</div>
              </div>
              <Switch checked={autoRules.sla_thresholds} onCheckedChange={() => toggleAutoRule("sla_thresholds")} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Protocol Upgrade</div>
                <div className="text-sm text-muted-foreground">Automatically vote on protocol upgrades</div>
              </div>
              <Switch checked={autoRules.protocol_upgrade} onCheckedChange={() => toggleAutoRule("protocol_upgrade")} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Fee Adjustment</div>
                <div className="text-sm text-muted-foreground">Automatically vote on fee changes</div>
              </div>
              <Switch checked={autoRules.fee_adjustment} onCheckedChange={() => toggleAutoRule("fee_adjustment")} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Governance Process</div>
                <div className="text-sm text-muted-foreground">Automatically vote on governance changes</div>
              </div>
              <Switch checked={autoRules.governance_process} onCheckedChange={() => toggleAutoRule("governance_process")} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}