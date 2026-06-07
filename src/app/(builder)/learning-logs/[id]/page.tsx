"use client"

import { useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for a single learning log
const mockLearningLog = {
  id: "ls-001",
  agentId: "agent-1",
  agentName: "Customer Support Agent",
  clientId: "client-42",
  clientName: "Acme Corp",
  sessionDate: "2026-06-02T14:32:00",
  duration: "4m 23s",
  taskDescription: "Handle customer refund request for order #12345, verify eligibility based on purchase date and reason for refund",
  agentResponseSnippet: "After reviewing the order details, I can confirm that order #12345 is eligible for a full refund within the 30-day return window. The order was placed on 2026-05-15, which falls within the eligible timeframe. I have processed a full refund of $89.99 to the original payment method. The refund should appear in 3-5 business days. I also added a note to prevent future charges on this account.",
  clientRating: 5,
  taskCompletionStatus: "completed",
  latencyMetrics: {
    avg: 1450,
    p95: 2200,
    max: 3500,
  },
  tpmAchieved: 72,
  tokensUsed: 2840,
  cost: "$0.12",
  spotCheckResult: "passed" as "passed" | "failed" | "review",
  status: "pending" as const,
}

// Star Rating Component
function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "size-3" : size === "lg" ? "size-6" : "size-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-amber-400" : "text-muted"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Latency bar component
function LatencyBar({ avg, p95, max }: { avg: number; p95: number; max: number }) {
  const maxLatency = 6000
  const avgPercent = (avg / maxLatency) * 100
  const p95Percent = (p95 / maxLatency) * 100
  const maxPercent = (max / maxLatency) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Avg: {avg}ms</span>
        <span>P95: {p95}ms</span>
        <span>Max: {max}ms</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full"
          style={{ width: `${avgPercent}%` }}
        />
        <div
          className="absolute top-0 h-full bg-primary/50 rounded-full"
          style={{ left: `${avgPercent}%`, width: `${p95Percent - avgPercent}%` }}
        />
        <div
          className="absolute top-0 h-full bg-red-500/30 rounded-full"
          style={{ left: `${p95Percent}%`, width: `${maxPercent - p95Percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Avg</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <span className="text-muted-foreground">P95</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/30" />
          <span className="text-muted-foreground">Max</span>
        </div>
      </div>
    </div>
  )
}

// TPM Progress component
function TPMProgress({ achieved, target }: { achieved: number; target: number }) {
  const percentage = Math.min((achieved / target) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">TPM Achieved</span>
        <span className="font-medium">{achieved}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>Target: {target}</span>
      </div>
    </div>
  )
}

export default function LearningLogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(mockLearningLog.status)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const log = mockLearningLog // In real app, would fetch by id

  const handleApprove = () => {
    setStatus("approved")
    setShowConfirmDialog(false)
  }

  const handleReject = () => {
    setStatus("rejected")
    setShowRejectDialog(false)
  }

  const handleApplyToProduction = () => {
    console.log("Applying to production...")
  }

  const statusColors = {
    completed: "bg-emerald-100 text-emerald-700",
    partial: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <a href="/learning-logs" className="hover:underline">Learning Logs</a>
          <span>/</span>
          <span className="font-mono">{log.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learning Log Detail</h1>
            <p className="text-muted-foreground">
              Review and approve memory updates from agent sessions
            </p>
          </div>
          <Badge
            variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Session Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Agent</div>
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="text-xs">CA</AvatarFallback>
                </Avatar>
                <span className="font-medium">{log.agentName}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Client</div>
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="text-xs">AC</AvatarFallback>
                </Avatar>
                <span className="font-medium">{log.clientName}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Session Date</div>
              <span className="font-medium">{new Date(log.sessionDate).toLocaleDateString()}</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Duration</div>
              <span className="font-medium">{log.duration}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Signal */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Signal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Description */}
          <div>
            <div className="text-sm font-medium mb-2">Task Description</div>
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              {log.taskDescription}
            </div>
          </div>

          <Separator />

          {/* Agent Response Quality */}
          <div>
            <div className="text-sm font-medium mb-2">Agent Response</div>
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              {log.agentResponseSnippet}
            </div>
          </div>

          <Separator />

          {/* Ratings and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Client Rating</div>
              <StarRating rating={log.clientRating} size="lg" />
              <div className="text-sm mt-2">
                <Badge variant="outline">{log.clientRating}/5</Badge>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Task Completion</div>
              <Badge className={statusColors[log.taskCompletionStatus as keyof typeof statusColors]} variant="outline">
                {log.taskCompletionStatus.charAt(0).toUpperCase() + log.taskCompletionStatus.slice(1)}
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">Status</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Spot Check</div>
              <Badge
                variant={log.spotCheckResult === "passed" ? "default" : log.spotCheckResult === "failed" ? "destructive" : "secondary"}
                className={log.spotCheckResult === "review" ? "bg-amber-100 text-amber-700" : log.spotCheckResult === "failed" ? "bg-red-100 text-red-700" : ""}
              >
                {log.spotCheckResult.charAt(0).toUpperCase() + log.spotCheckResult.slice(1)}
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">Result</div>
            </div>
          </div>

          <Separator />

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-4">Latency Metrics</div>
              <LatencyBar avg={log.latencyMetrics.avg} p95={log.latencyMetrics.p95} max={log.latencyMetrics.max} />
            </div>
            <div>
              <div className="text-sm font-medium mb-4">Throughput (TPM)</div>
              <TPMProgress achieved={log.tpmAchieved} target={450} />
            </div>
          </div>

          <Separator />

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground">Tokens Used</div>
              <div className="text-lg font-bold font-mono">{log.tokensUsed.toLocaleString()}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground">Cost</div>
              <div className="text-lg font-bold font-mono">{log.cost}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground">Session ID</div>
              <div className="text-lg font-bold font-mono text-xs">{log.id}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground">Agent ID</div>
              <div className="text-lg font-bold font-mono text-xs">{log.agentId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Builder Notes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Builder Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about this learning signal..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      {status === "pending" && log.spotCheckResult === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review this learning signal and decide whether to approve it for memory integration.
            </p>
            <div className="flex gap-4">
              <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex-1">
                    Approve Memory Update
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Memory Update</DialogTitle>
                    <DialogDescription>
                      This will mark this learning signal as approved. You can later apply it to production.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove}>Confirm Approval</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Learning Signal</DialogTitle>
                    <DialogDescription>
                      This will reject the memory update. The agent will not learn from this session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Reason for rejection (optional)..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "approved" && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <svg className="size-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Memory Update Approved</div>
                  <div className="text-sm text-muted-foreground">
                    This learning signal has been approved and is ready to apply to production.
                  </div>
                </div>
              </div>
              <Button onClick={handleApplyToProduction}>
                Apply to Production
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "rejected" && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="size-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Memory Update Rejected</div>
                <div className="text-sm text-muted-foreground">
                  This learning signal was rejected and will not be applied to production.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}