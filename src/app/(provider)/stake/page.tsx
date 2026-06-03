"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_STAKE_POSITIONS } from "@/lib/mock-data"

interface SlashEvent {
  id: string
  date: number
  amount: number
  reason: string
}

const MOCK_SLASH_EVENTS: SlashEvent[] = [
  {
    id: "slash-001",
    date: Date.now() - 2 * 86400000,
    amount: 50,
    reason: "Latency SLA breach - P99 exceeded threshold",
  },
  {
    id: "slash-002",
    date: Date.now() - 5 * 86400000,
    amount: 25,
    reason: "Downtime during scheduled maintenance window",
  },
  {
    id: "slash-003",
    date: Date.now() - 10 * 86400000,
    amount: 10,
    reason: "Incorrect data provider response",
  },
]

const MOCK_UNLOCKING_QUEUE = [
  { sessionId: "unlock-001", amount: 500, releaseIn: "2h 34m" },
  { sessionId: "unlock-002", amount: 1200, releaseIn: "5h 12m" },
  { sessionId: "unlock-003", amount: 300, releaseIn: "1d 4h" },
]

export default function StakeManagementPage() {
  const [lockAmount, setLockAmount] = useState("")
  const [lockPurpose, setLockPurpose] = useState("provider")
  const [delegateAddress, setDelegateAddress] = useState("")
  const [delegateAmount, setDelegateAmount] = useState("")
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)

  const totalStake = MOCK_STAKE_POSITIONS.reduce((sum, p) => sum + p.amount, 0)
  const lockedStake = MOCK_STAKE_POSITIONS.reduce((sum, p) => sum + p.lockedAmount, 0)
  const availableStake = totalStake - lockedStake
  const delegatedStake = 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Stake Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your stake positions, lockup status, and unlocking queue.
        </p>
      </div>

      {/* Stake Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStake.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">$MESH</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Locked in Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockedStake.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">$MESH</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableStake.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">$MESH</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delegated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delegatedStake.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">$MESH</p>
          </CardContent>
        </Card>
      </div>

      {/* Lock Stake Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lock Stake</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Amount to lock"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
              />
            </div>
            <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
              <DialogTrigger>
                <Button variant="default">Lock Stake</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lock Stake</DialogTitle>
                  <DialogDescription>
                    Confirm the amount and purpose for locking your stake.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <div className="text-2xl font-bold">{lockAmount || "0"} $MESH</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Purpose</label>
                    <Select value={lockPurpose} onValueChange={(v) => setLockPurpose(v ?? lockPurpose)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider">Provider Node</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLockDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsLockDialogOpen(false)}>
                    Confirm Lock
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Lockup Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lockup Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Amount Locked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STAKE_POSITIONS.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-mono text-xs">{position.id}</TableCell>
                  <TableCell>{position.lockedAmount.toLocaleString()} $MESH</TableCell>
                  <TableCell>
                    <Badge variant={position.unlockingAt ? "secondary" : "default"}>
                      {position.unlockingAt ? "Unlocking" : "Locked"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {position.unlockingAt
                      ? new Date(position.unlockingAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {!position.unlockingAt && (
                      <Button variant="outline" size="sm">
                        Request Unlock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unlocking Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Unlocking Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_UNLOCKING_QUEUE.length > 0 ? (
            <div className="space-y-4">
              {MOCK_UNLOCKING_QUEUE.map((item) => (
                <div
                  key={item.sessionId}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <div className="font-mono text-sm">{item.sessionId}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount.toLocaleString()} $MESH
                    </div>
                  </div>
                  <Badge variant="outline">
                    Releases in {item.releaseIn}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No pending unlocks.</p>
          )}
        </CardContent>
      </Card>

      {/* Slash History */}
      <Card>
        <CardHeader>
          <CardTitle>Slash History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SLASH_EVENTS.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="text-red-500">-{event.amount.toLocaleString()}</span> $MESH
                  </TableCell>
                  <TableCell className="text-muted-foreground">{event.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delegation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Delegation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Delegate to address (0x...)"
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Amount"
                value={delegateAmount}
                onChange={(e) => setDelegateAmount(e.target.value)}
              />
            </div>
            <Button variant="default">Delegate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}