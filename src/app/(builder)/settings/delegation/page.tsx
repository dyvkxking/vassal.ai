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
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockDelegations = [
  { id: "del_1", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", amount: 500, category: "protocol", date: "2026-05-15" },
  { id: "del_2", address: "0x8626f6940E2eb28930eFb4CeF496B1d4969e2C78", amount: 250, category: "treasury", date: "2026-06-01" },
]

export default function BuilderDelegationPage() {
  const [delegations, setDelegations] = useState(mockDelegations)
  const [autoDelegationEnabled, setAutoDelegationEnabled] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newDelegation, setNewDelegation] = useState({ address: "", amount: "", category: "general" })

  const handleAddDelegation = () => {
    if (!newDelegation.address || !newDelegation.amount) return
    setDelegations((prev) => [
      ...prev,
      {
        id: `del_${Date.now()}`,
        address: newDelegation.address,
        amount: parseInt(newDelegation.amount),
        category: newDelegation.category,
        date: new Date().toISOString().split("T")[0],
      },
    ])
    setShowAddDialog(false)
    setNewDelegation({ address: "", amount: "", category: "general" })
  }

  const handleRevoke = (id: string) => {
    setDelegations((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Delegation</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your voting power delegation to other addresses
        </p>
      </div>

      <div className="space-y-8">
        {/* Manual Delegation */}
        <Card>
          <CardHeader>
            <CardTitle>Delegate Voting Power</CardTitle>
            <CardDescription>
              Delegate your voting power to another address for governance participation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="delegate-address">Delegate Address</Label>
                <Input
                  id="delegate-address"
                  placeholder="0x..."
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delegate-amount">Amount (VP)</Label>
                <Input
                  id="delegate-amount"
                  type="number"
                  placeholder="100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delegate-category">Category</Label>
              <div className="flex gap-2 flex-wrap">
                {["general", "protocol", "treasury", "grants"].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Switch id={`cat-${cat}`} />
                    <Label htmlFor={`cat-${cat}`} className="text-sm capitalize">{cat}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button>Delegate Voting Power</Button>
          </CardContent>
        </Card>

        {/* Auto-Delegation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Auto-Delegate Rules</CardTitle>
                <CardDescription>
                  Automatically delegate for specific proposal categories
                </CardDescription>
              </div>
              <Switch
                checked={autoDelegationEnabled}
                onCheckedChange={setAutoDelegationEnabled}
              />
            </div>
          </CardHeader>
          {autoDelegationEnabled && (
            <CardContent className="space-y-4">
              <Separator />
              <p className="text-sm text-muted-foreground">
                Configure automatic delegation rules for different proposal categories
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Protocol Decisions</p>
                    <p className="text-sm text-muted-foreground">Auto-delegate to core team for protocol changes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0x..." className="max-w-[200px] font-mono text-sm" />
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Treasury Management</p>
                    <p className="text-sm text-muted-foreground">Auto-delegate to multisig for spending proposals</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0x..." className="max-w-[200px] font-mono text-sm" />
                    <Switch />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Grants Program</p>
                    <p className="text-sm text-muted-foreground">Auto-delegate to grants committee</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0x..." className="max-w-[200px] font-mono text-sm" />
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              <Button variant="outline">Save Auto-Delegation Rules</Button>
            </CardContent>
          )}
        </Card>

        {/* Delegation History */}
        <Card>
          <CardHeader>
            <CardTitle>Delegation History</CardTitle>
            <CardDescription>View your current and past delegations</CardDescription>
          </CardHeader>
          <CardContent>
            {delegations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delegate Address</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delegations.map((del) => (
                    <TableRow key={del.id}>
                      <TableCell className="font-mono text-sm">{del.address}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{del.amount} VP</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize">
                          {del.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{del.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active delegations
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Delegation</DialogTitle>
            <DialogDescription>
              Delegate your voting power to another address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-del-address">Delegate Address</Label>
              <Input
                id="new-del-address"
                value={newDelegation.address}
                onChange={(e) => setNewDelegation({ ...newDelegation, address: e.target.value })}
                placeholder="0x..."
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-del-amount">Amount (VP)</Label>
              <Input
                id="new-del-amount"
                type="number"
                value={newDelegation.amount}
                onChange={(e) => setNewDelegation({ ...newDelegation, amount: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddDelegation}>Add Delegation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}