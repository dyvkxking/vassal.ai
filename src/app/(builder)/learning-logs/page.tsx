"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress, ProgressIndicator } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types
type LearningSignalStatus = "pending" | "approved" | "rejected"
type SpotCheckResult = "passed" | "failed" | "review"

interface LearningSignal {
  id: string
  taskDescription: string
  agentResponseSnippet: string
  clientRating: number
  taskCompletionStatus: "completed" | "partial" | "failed"
  latencyMetrics: {
    avg: number
    p95: number
  }
  tpmAchieved: number
  spotCheckResult: SpotCheckResult
  timestamp: Date
  status: LearningSignalStatus
  rejectionReason?: string
}

// Mock Data
const mockLearningSignals: LearningSignal[] = [
  {
    ,
    status: "approved",
  },
  {
    ,
    status: "approved",
  },
  {
    ,
    status: "pending",
  },
  {
    ,
    status: "approved",
  },
  {
    ,
    status: "approved",
  },
  {
    ,
    status: "rejected",
    rejectionReason: "Missing critical authentication section and error handling documentation is incomplete",
  },
  {
    ,
    status: "approved",
  },
  {
    id: "ls-008",
    taskDescription: "Analyze customer feedback and compile insights",
    agentResponseSnippet: "Aggregated 234 feedback entries into 8 key themes. Provided sentiment distribution and actionable recommendations.",
    clientRating: 4,
    taskCompletionStatus: "completed",
    latencyMetrics: { avg: 1850, p95: 2900 },
    tpmAchieved: 68,
    spotCheckResult: "passed",
    timestamp: new Date("2026-06-01T11:45:00"),
  },
]

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`size-4 ${star <= rating ? "text-amber-400" : "text-muted"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Spot Check Badge
function SpotCheckBadge({ result }: { result: SpotCheckResult }) {
  const config = {
    passed: { label: "Passed", variant: "default" as const, className: "bg-emerald-100 text-emerald-700" },
    failed: { label: "Failed", variant: "destructive" as const, className: "bg-red-100 text-red-700" },
    review: { label: "Review", variant: "secondary" as const, className: "bg-amber-100 text-amber-700" },
  }
  const { label, className } = config[result]
  return (
    <Badge className={className} variant="outline">
      {label}
    </Badge>
  )
}

// Latency Bar
function LatencyBar({ avg, p95 }: { avg: number; p95: number }) {
  const maxLatency = 6000
  const avgPercent = (avg / maxLatency) * 100
  const p95Percent = (p95 / maxLatency) * 100
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Avg: {avg}ms</span>
        <span>P95: {p95}ms</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full"
          style={{ width: `${avgPercent}%` }}
        />
        <div
          className="absolute top-0 h-full bg-primary/40 rounded-full"
          style={{ left: `${avgPercent}%`, width: `${p95Percent - avgPercent}%` }}
        />
      </div>
    </div>
  )
}

// Learning Signal Card
function LearningSignalCard({
  signal,
  onApprove,
  onReject,
}: {
  signal: LearningSignal
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  const statusColors = {
    completed: "bg-emerald-100 text-emerald-700",
    partial: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-sm leading-snug">
              {signal.taskDescription}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {signal.agentResponseSnippet}
            </CardDescription>
          </div>
          <SpotCheckBadge result={signal.spotCheckResult} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Rating & Completion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StarRating rating={signal.clientRating} />
            <Separator orientation="vertical" className="h-4" />
            <Badge className={statusColors[signal.taskCompletionStatus]} variant="outline">
              {signal.taskCompletionStatus.charAt(0).toUpperCase() + signal.taskCompletionStatus.slice(1)}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {signal.timestamp.toLocaleString()}
          </span>
        </div>

        {/* Latency Metrics */}
        <LatencyBar avg={signal.latencyMetrics.avg} p95={signal.latencyMetrics.p95} />

        {/* TPM */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">TPM Achieved</span>
          <div className="flex items-center gap-2">
            <Progress value={Math.min(signal.tpmAchieved, 100)} className="w-20">
              <ProgressIndicator style={{ width: `${Math.min(signal.tpmAchieved, 100)}%` }} />
            </Progress>
            <span className="text-sm font-medium tabular-nums w-12 text-right">
              {signal.tpmAchieved}
            </span>
          </div>
        </div>

        {/* Rejection Reason */}
        {signal.rejectionReason && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">
              <span className="font-medium">Rejection Reason:</span> {signal.rejectionReason}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Actions */}
      {signal.spotCheckResult === "review" && (
        <CardFooter className="gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onApprove?.(signal.id)}
            className="flex-1"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject?.(signal.id)}
            className="flex-1"
          >
            Reject
          </Button>
        </CardFooter>
      )}
      {signal.status === "approved" && (
        <CardFooter>
          <Badge variant="secondary" className="w-full justify-center">Applied to Memory</Badge>
        </CardFooter>
      )}
    </Card>
  )
}

// Summary Card
function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Auto-Approve Rules Section
function AutoApproveRules({
  enabled,
  threshold,
  onToggle,
  onThresholdChange,
}: {
  enabled: boolean
  threshold: number
  onToggle: (value: boolean) => void
  onThresholdChange: (value: number[]) => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Auto-Approve Rules</CardTitle>
            <CardDescription>
              Automatically approve learning signals meeting criteria
            </CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Rating</span>
              <span className="font-medium">{threshold} stars</span>
            </div>
            <Slider
              value={[threshold]}
              onValueChange={onThresholdChange}
              min={1}
              max={5}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>3</span>
              <span>5</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Main Page
export default function LearningLogsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending")
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(false)
  const [autoApproveThreshold, setAutoApproveThreshold] = useState([4])

  // Compute stats
  const signals = mockLearningSignals
  const pendingSignals = signals.filter((s) => s.spotCheckResult === "review")
  const approvedSignals = signals.filter((s) => s.spotCheckResult === "passed" && s.taskCompletionStatus === "completed")
  const rejectedSignals = signals.filter((s) => s.spotCheckResult === "failed" || s.rejectionReason)

  const filteredSignals = {
    pending: pendingSignals,
    approved: approvedSignals,
    rejected: rejectedSignals,
    all: signals,
  }

  const handleApprove = (id: string) => {
    console.log("Approve signal:", id)
  }

  const handleReject = (id: string) => {
    console.log("Reject signal:", id)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Builder Learning Logs</h1>
        <p className="text-muted-foreground">
          Review and approve session learning signals for memory integration
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Sessions"
          value={signals.length}
          description="All time signals"
          icon={
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <SummaryCard
          title="Pending Approval"
          value={pendingSignals.length}
          description="Awaiting review"
          icon={
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Approved"
          value={approvedSignals.length}
          description="Ready to apply"
          icon={
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Rejected"
          value={rejectedSignals.length}
          description="Not approved"
          icon={
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v ?? activeTab)}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approval ({pendingSignals.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedSignals.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedSignals.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({signals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSignals[activeTab as keyof typeof filteredSignals]?.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No signals in this category
              </div>
            ) : (
              filteredSignals[activeTab as keyof typeof filteredSignals]?.map((signal) => (
                <LearningSignalCard
                  key={signal.id}
                  signal={signal}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Auto-Approve Rules */}
      <AutoApproveRules
        enabled={autoApproveEnabled}
        threshold={autoApproveThreshold[0]}
        onToggle={setAutoApproveEnabled}
        onThresholdChange={setAutoApproveThreshold}
      />
    </div>
  )
}