"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  Plus,
  Minus,
  ChevronRight,
  Shield,
  Users,
  HandCoins,
} from "lucide-react";
import { MOCK_STAKE_POSITIONS } from "@/lib/mock-data";

interface StakeStats {
  totalMesh: string;
  locked: string;
  available: string;
  delegated: string;
}

interface UnlockRequest {
  id: string;
  amount: string;
  purpose: string;
  requestDate: string;
  unlockDate: string;
  countdown: string;
  status: "pending" | "ready";
}

interface StakeHistoryEntry {
  id: string;
  date: string;
  type: "lock" | "unlock" | "slash" | "delegate" | "undelegate";
  amount: string;
  status: "completed" | "pending" | "failed";
  txHash: string;
  blockNumber: string;
}

interface SlashEvent {
  id: string;
  date: string;
  amount: string;
  reason: string;
  nodeId: string;
  txHash: string;
  blockNumber: string;
}

const STAKE_STATS: StakeStats = {
  totalMesh: "125,400 MESH",
  locked: "98,750 MESH",
  available: "26,650 MESH",
  delegated: "15,200 MESH",
};

const UNLOCK_REQUESTS: UnlockRequest[] = [
  {
    id: "UR-2024-042",
    amount: "5,000 MESH",
    purpose: "Session担保",
    requestDate: "2024-01-18",
    unlockDate: "2024-01-25",
    countdown: "2d 14h",
    status: "pending",
  },
  {
    id: "UR-2024-038",
    amount: "2,500 MESH",
    purpose: "Agent collateral",
    requestDate: "2024-01-15",
    unlockDate: "2024-01-22",
    countdown: "6d 8h",
    status: "pending",
  },
  {
    id: "UR-2024-031",
    amount: "8,000 MESH",
    purpose: "Delegation",
    requestDate: "2024-01-10",
    unlockDate: "2024-01-17",
    countdown: "Ready",
    status: "ready",
  },
];

const STAKE_HISTORY: StakeHistoryEntry[] = [
  {
    id: "TX-2024-892",
    date: "2024-01-20",
    type: "lock",
    amount: "+10,000 MESH",
    status: "completed",
    txHash: "0x7f3a...2e9b",
    blockNumber: "15,234,891",
  },
  {
    id: "TX-2024-876",
    date: "2024-01-18",
    type: "unlock",
    amount: "-5,000 MESH",
    status: "pending",
    txHash: "0x3c8a...9f2d",
    blockNumber: "15,198,442",
  },
  {
    id: "TX-2024-851",
    date: "2024-01-15",
    type: "delegate",
    amount: "+3,000 MESH",
    status: "completed",
    txHash: "0x9e2b...4c1f",
    blockNumber: "15,156,772",
  },
  {
    id: "TX-2024-834",
    date: "2024-01-12",
    type: "slash",
    amount: "-800 MESH",
    status: "completed",
    txHash: "0x1a5c...7e8g",
    blockNumber: "15,123,445",
  },
  {
    id: "TX-2024-812",
    date: "2024-01-08",
    type: "lock",
    amount: "+15,000 MESH",
    status: "completed",
    txHash: "0x4d7f...3h9k",
    blockNumber: "15,089,221",
  },
  {
    id: "TX-2024-789",
    date: "2024-01-05",
    type: "undelegate",
    amount: "-2,000 MESH",
    status: "completed",
    txHash: "0x8b2e...6j5l",
    blockNumber: "15,042,883",
  },
];

const SLASH_HISTORY: SlashEvent[] = [
  {
    id: "SL-2024-065",
    date: "2024-01-12",
    amount: "800 MESH",
    reason: "Downtime violation",
    nodeId: "node_0x7a3...2e9b",
    txHash: "0x1a5c...7e8g",
    blockNumber: "15,123,445",
  },
  {
    id: "SL-2024-048",
    date: "2024-01-03",
    amount: "350 MESH",
    reason: "Late attestation",
    nodeId: "node_0x3f9...8c2d",
    txHash: "0x5d8a...2f6h",
    blockNumber: "14,987,112",
  },
];

type LockPurpose = "session" | "agent" | "delegation";

export default function StakeManagerPage() {
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [lockAmount, setLockAmount] = useState("");
  const [lockPurpose, setLockPurpose] = useState<LockPurpose | "">("");
  const [lockNote, setLockNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLockStake = async () => {
    if (!lockAmount || !lockPurpose) return;
    setIsProcessing(true);
    // Simulate lock transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsLockDialogOpen(false);
    setLockAmount("");
    setLockPurpose("");
    setLockNote("");
  };

  const getHistoryTypeBadge = (type: StakeHistoryEntry["type"]) => {
    const config = {
      lock: { label: "Lock", variant: "default" as const, icon: Lock },
      unlock: { label: "Unlock", variant: "secondary" as const, icon: Unlock },
      slash: { label: "Slash", variant: "destructive" as const, icon: AlertTriangle },
      delegate: { label: "Delegate", variant: "default" as const, icon: ArrowUpRight },
      undelegate: { label: "Undelegate", variant: "secondary" as const, icon: ArrowDownRight },
    };
    const { label, variant, icon: Icon } = config[type];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      session: "Session担保",
      agent: "Agent collateral",
      delegation: "Delegation",
    };
    return labels[purpose] || purpose;
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stake Manager</h1>
          <p className="text-muted-foreground">
            Manage your MESH stake positions and delegations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Lock Stake
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Lock Stake</DialogTitle>
                <DialogDescription>
                  Lock your MESH tokens for staking, delegation, or as collateral.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="lockAmount">Amount (MESH)</Label>
                  <Input
                    id="lockAmount"
                    type="number"
                    placeholder="Enter amount to lock"
                    value={lockAmount}
                    onChange={(e) => setLockAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Available: {STAKE_STATS.available}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockPurpose">Purpose</Label>
                  <Select
                    value={lockPurpose}
                    onValueChange={(value) => setLockPurpose(value as LockPurpose)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="session">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Session担保
                        </div>
                      </SelectItem>
                      <SelectItem value="agent">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Agent collateral
                        </div>
                      </SelectItem>
                      <SelectItem value="delegation">
                        <div className="flex items-center gap-2">
                          <HandCoins className="w-4 h-4" />
                          Delegation
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockNote">Note (Optional)</Label>
                  <Textarea
                    id="lockNote"
                    placeholder="Add a note for your records"
                    value={lockNote}
                    onChange={(e) => setLockNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsLockDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLockStake}
                  disabled={!lockAmount || !lockPurpose || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Lock Stake"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total $MESH</p>
                <p className="text-3xl font-bold mt-1">{STAKE_STATS.totalMesh}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Coins className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locked (Sessions)</p>
                <p className="text-3xl font-bold mt-1">{STAKE_STATS.locked}</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{STAKE_STATS.available}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Unlock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delegated</p>
                <p className="text-3xl font-bold mt-1">{STAKE_STATS.delegated}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unlock-requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unlock-requests">Unlock Requests</TabsTrigger>
          <TabsTrigger value="stake-history">Stake History</TabsTrigger>
          <TabsTrigger value="slash-history">Slash History</TabsTrigger>
        </TabsList>

        {/* Unlock Requests */}
        <TabsContent value="unlock-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Unlock Requests</CardTitle>
              <CardDescription>
                Stake tokens are locked until the unlock period completes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {UNLOCK_REQUESTS.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Unlock Date</TableHead>
                      <TableHead>Countdown</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UNLOCK_REQUESTS.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-sm">{request.id}</TableCell>
                        <TableCell className="text-right font-medium">
                          {request.amount}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getPurposeLabel(request.purpose)}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.unlockDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span
                              className={
                                request.status === "ready"
                                  ? "text-green-600 font-medium"
                                  : ""
                              }
                            >
                              {request.countdown}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={request.status === "ready" ? "default" : "secondary"}
                          >
                            {request.status === "ready" ? "Ready to Claim" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Unlock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending unlock requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stake History */}
        <TabsContent value="stake-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stake History</CardTitle>
              <CardDescription>
                Complete history of your stake transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Block</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STAKE_HISTORY.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-sm">{entry.id}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{getHistoryTypeBadge(entry.type)}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          entry.amount.startsWith("+")
                            ? "text-green-600"
                            : entry.amount.startsWith("-")
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {entry.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.status === "completed"
                              ? "default"
                              : entry.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{entry.txHash}</TableCell>
                      <TableCell className="font-mono text-sm">{entry.blockNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slash History */}
        <TabsContent value="slash-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Slash History</CardTitle>
              <CardDescription>
                Record of slashing events affecting your stake
              </CardDescription>
            </CardHeader>
            <CardContent>
              {SLASH_HISTORY.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Node ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead>Block</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SLASH_HISTORY.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">{event.id}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell className="font-mono text-sm">{event.nodeId}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{event.reason}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          -{event.amount}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{event.txHash}</TableCell>
                        <TableCell className="font-mono text-sm">{event.blockNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No slash events recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
