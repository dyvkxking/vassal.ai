"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Types
type LearningSignalStatus = "pending" | "approved" | "rejected"
type SpotCheckResult = "passed" | "failed" | "review"
type SortOption = "newest" | "oldest" | "lowest_rating" | "highest_impact"

interface LearningSignal {
  id: string
  agentId: string
  agentName: string
  taskDescription: string
  agentResponseSnippet: string
  clientRating: number
  taskCompletionStatus: "completed" | "partial" | "failed"
  latencyMetrics: { avg: number; p95: number }
  tpmAchieved: number
  spotCheckResult: SpotCheckResult
  timestamp: Date
  status: LearningSignalStatus
  impact: "high" | "medium" | "low"
  rejectionReason?: string
}

// Mock data for pending signals
const mockPendingSignals: LearningSignal[] = [
  {
    id: "ls-001",
    agentId: "agent-1",
    agentName: "Customer Support Agent",
    taskDescription: "Handle customer refund request for order #12345",
    agentResponseSnippet: "Confirmed order is eligible for full refund within 30-day return window.",
    clientRating: 5,
    taskCompletionStatus: "completed",
    latencyMetrics: { avg: 1450, p95: 2200 },
    tpmAchieved: 72,
    spotCheckResult: "review",
    timestamp: new Date("2026-06-02T14:32:00"),
    status: "pending",
    impact: "high",
  },
  {
    id: "ls-002",
    agentId: "agent-2",
    agentName: "Sales Assistant",
    taskDescription: "Generate pricing quote for enterprise client",
    agentResponseSnippet: "Created detailed pricing proposal with volume discounts and implementation timeline.",
    clientRating: 4,
    taskCompletionStatus: "completed",
    latencyMetrics: { avg: 2100, p95: 3200 },
    tpmAchieved: 58,
    spotCheckResult: "review",
    timestamp: new Date("2026-06-02T12:15:00"),
    status: "pending",
    impact: "medium",
  },
  {
    id: "ls-003",
    agentId: "agent-1",
    agentName: "Customer Support Agent",
    taskDescription: "Process subscription cancellation request",
    agentResponseSnippet: "Cancelled subscription and confirmed end date. Applied retention discount.",
    clientRating: 3,
    taskCompletionStatus: "partial",
    latencyMetrics: { avg: 1800, p95: 2800 },
    tpmAchieved: 45,
    spotCheckResult: "review",
    timestamp: new Date("2026-06-01T09:22:00"),
    status: "pending",
    impact: "medium",
  },
  {
    id: "ls-004",
    agentId: "agent-3",
    agentName: "Technical Support Bot",
    taskDescription: "Debug API connection timeout issue",
    agentResponseSnippet: "Identified connection pool exhaustion. Increased pool size and added retry logic.",
    clientRating: 5,
    taskCompletionStatus: "completed",
    latencyMetrics: { avg: 950, p95: 1400 },
    tpmAchieved: 82,
    spotCheckResult: "review",
    timestamp: new Date("2026-05-31T16:45:00"),
    status: "pending",
    impact: "high",
  },
  {
    id: "ls-005",
    agentId: "agent-2",
    agentName: "Sales Assistant",
    taskDescription: "Prepare demo environment for prospect",
    agentResponseSnippet: "Set up demo environment with sample data matching prospect's use case.",
    clientRating: 4,
    taskCompletionStatus: "completed",
    latencyMetrics: { avg: 1200, p95: 1800 },
    tpmAchieved: 65,
    spotCheckResult: "review",
    timestamp: new Date("2026-05-30T11:08:00"),
    status: "pending",
    impact: "low",
  },
]

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`size-3 ${star <= rating ? "text-amber-400" : "text-muted"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function PendingApprovalsPage() {
  const [signals, setSignals] = useState(mockPendingSignals)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(false)
  const [autoApproveThreshold, setAutoApproveThreshold] = useState([4])
  const [showBulkApproveDialog, setShowBulkApproveDialog] = useState(false)
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false)

  // Sort signals
  const sortedSignals = [...signals].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.timestamp.getTime() - a.timestamp.getTime()
      case "oldest":
        return a.timestamp.getTime() - b.timestamp.getTime()
      case "lowest_rating":
        return a.clientRating - b.clientRating
      case "highest_impact":
        const impactOrder = { high: 0, medium: 1, low: 2 }
        return impactOrder[a.impact] - impactOrder[b.impact]
      default:
        return 0
    }
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedSignals.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedSignals.map((s) => s.id))
    }
  }

  const handleBulkApprove = () => {
    setSignals((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: "approved" as const } : s
      )
    )
    setSelectedIds([])
    setShowBulkApproveDialog(false)
  }

  const handleBulkReject = () => {
    setSignals((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: "rejected" as const } : s
      )
    )
    setSelectedIds([])
    setShowBulkRejectDialog(false)
  }

  const pendingCount = signals.filter((s) => s.status === "pending").length
  const selectedCount = selectedIds.length

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pending Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve learning signals awaiting memory integration
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{pendingCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Pending Approval</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {signals.filter((s) => s.impact === "high").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">High Impact</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {signals.filter((s) => s.spotCheckResult === "review").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Needs Review</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">4.1</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Rating</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Sort */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Tabs
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <TabsList>
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="oldest">Oldest</TabsTrigger>
                  <TabsTrigger value="lowest_rating">Lowest Rating</TabsTrigger>
                  <TabsTrigger value="highest_impact">Highest Impact</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Bulk Actions */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} selected
                </span>
                <Dialog open={showBulkApproveDialog} onOpenChange={setShowBulkApproveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      Bulk Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Approve</DialogTitle>
                      <DialogDescription>
                        Approve {selectedCount} learning signals? They will be marked as approved and ready for production.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowBulkApproveDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBulkApprove}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showBulkRejectDialog} onOpenChange={setShowBulkRejectDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Bulk Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Reject</DialogTitle>
                      <DialogDescription>
                        Reject {selectedCount} learning signals? They will not be applied to production.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowBulkRejectDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleBulkReject}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signals Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedIds.length === sortedSignals.length &&
                      sortedSignals.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSignals.map((signal) => (
                <TableRow key={signal.id} className={selectedIds.includes(signal.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(signal.id)}
                      onCheckedChange={() => toggleSelect(signal.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <div className="font-medium text-sm truncate">
                        {signal.taskDescription}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {signal.agentResponseSnippet}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{signal.agentName}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StarRating rating={signal.clientRating} />
                      <span className="text-sm font-medium">{signal.clientRating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        signal.impact === "high"
                          ? "destructive"
                          : signal.impact === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {signal.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {signal.timestamp.toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/learning-logs/${signal.id}`}>View</a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Auto-Approve Rules Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Auto-Approve Rules</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically approve learning signals meeting criteria
              </p>
            </div>
            <Switch checked={autoApproveEnabled} onCheckedChange={setAutoApproveEnabled} />
          </div>
        </CardHeader>
        {autoApproveEnabled && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Minimum Rating Threshold</div>
                  <div className="text-xs text-muted-foreground">
                    Signals below this rating will be flagged for manual review
                  </div>
                </div>
                <span className="text-lg font-bold">{autoApproveThreshold[0]} stars</span>
              </div>
              <Slider
                value={autoApproveThreshold}
                onValueChange={(v) => setAutoApproveThreshold(Array.isArray(v) ? v : [v])}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 (strict)</span>
                <span>3</span>
                <span>5 (lenient)</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Task Completion Status</div>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-emerald-100 text-emerald-700">completed</Badge>
                  <Badge variant="secondary">partial</Badge>
                  <Badge variant="secondary">failed</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Only signals with "completed" status are auto-approved
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Minimum TPM</div>
                  <div className="text-xs text-muted-foreground">
                    Signals must achieve this TPM to be auto-approved
                  </div>
                </div>
                <span className="text-lg font-bold">50</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <Separator />

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Auto-Approve Preview</div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {signals.filter((s) => s.clientRating >= autoApproveThreshold[0] && s.taskCompletionStatus === "completed").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Would be auto-approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {signals.filter((s) => s.clientRating < autoApproveThreshold[0]).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Would be flagged</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}