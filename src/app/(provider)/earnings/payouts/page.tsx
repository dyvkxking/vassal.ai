"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock payout data
const pendingPayout = {
  amount: 3842.75,
  unlockDate: "2026-06-15",
  daysUntilUnlock: 10,
  progress: 67,
}

const processedPayouts = [
  {
    id: "1",
    date: "2026-06-01",
    amount: 1850.00,
    status: "completed",
    txHash: "0x7f3a...8b2c",
    blockExplorer: "https://explorer.somnia.io/tx/0x7f3a...8b2c",
  },
  {
    id: "2",
    date: "2026-05-15",
    amount: 2340.00,
    status: "completed",
    txHash: "0x3d9e...1a4f",
    blockExplorer: "https://explorer.somnia.io/tx/0x3d9e...1a4f",
  },
  {
    id: "3",
    date: "2026-05-01",
    amount: 1920.50,
    status: "completed",
    txHash: "0x8c1b...7e9d",
    blockExplorer: "https://explorer.somnia.io/tx/0x8c1b...7e9d",
  },
  {
    id: "4",
    date: "2026-04-15",
    amount: 2150.00,
    status: "completed",
    txHash: "0x2f4a...9c3b",
    blockExplorer: "https://explorer.somnia.io/tx/0x2f4a...9c3b",
  },
  {
    id: "5",
    date: "2026-04-01",
    amount: 1780.25,
    status: "completed",
    txHash: "0x5e7f...4a8c",
    blockExplorer: "https://explorer.somnia.io/tx/0x5e7f...4a8c",
  },
]

const payoutSchedule = {
  frequency: "Bi-weekly",
  minimumAmount: 50.0,
  nextPayoutDate: "2026-06-15",
  processingTime: "1-2 business days",
  methods: ["Somnia Wallet", "ERC-20 Transfer"],
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "completed":
      return "default"
    case "processing":
      return "secondary"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}

export default function PayoutsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Payouts</h1>
          <p className="text-muted-foreground">
            Manage your payout schedule and history
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => console.log("Request early payout")}
        >
          Request Early Payout
        </Button>
      </div>

      {/* Pending Payout Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Payout</CardTitle>
          <CardDescription>
            Your next scheduled payout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-4xl font-bold">
                {formatCurrency(pendingPayout.amount)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Unlock Date</div>
              <div className="text-xl font-medium">
                {formatDate(pendingPayout.unlockDate)}
              </div>
              <div className="text-xs text-muted-foreground">
                {pendingPayout.daysUntilUnlock} days remaining
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>{pendingPayout.progress}%</span>
            </div>
            <Progress value={pendingPayout.progress} className="h-2" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Early payout available
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">3.5% fee</span>
              <Button size="sm" variant="outline">
                Request Early Payout ({formatCurrency(pendingPayout.amount * 0.965)})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Schedule */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payout Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground">Frequency</div>
              <div className="font-medium">{payoutSchedule.frequency}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Next Payout</div>
              <div className="font-medium">
                {formatDate(payoutSchedule.nextPayoutDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Minimum</div>
              <div className="font-medium">
                {formatCurrency(payoutSchedule.minimumAmount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
              <div className="font-medium">{payoutSchedule.processingTime}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Payment Methods
            </div>
            <div className="flex gap-2">
              {payoutSchedule.methods.map((method) => (
                <Badge key={method} variant="outline">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processed Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Record of all processed payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Hash</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{formatDate(payout.date)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {payout.txHash}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={payout.blockExplorer}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}