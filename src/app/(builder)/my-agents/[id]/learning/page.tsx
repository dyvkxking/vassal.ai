"use client"

import { useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock agent data
const mockAgents = [
  { id: "agent-1", name: "Customer Support Agent", status: "active" },
  { id: "agent-2", name: "Sales Assistant", status: "active" },
  { id: "agent-3", name: "Technical Support Bot", status: "inactive" },
]

const agentConfigs = {
  "agent-1": {
    selfLearningEnabled: true,
    memoryRetentionDays: 30,
    autoApproveThreshold: 4,
    learningSignals: {
      taskCompletion: true,
      clientRating: true,
      latencyMetrics: true,
      errorPatterns: true,
      userFeedback: true,
    },
    totalSignals: 234,
    approvedSignals: 198,
    rejectedSignals: 21,
    pendingSignals: 15,
  },
  "agent-2": {
    selfLearningEnabled: false,
    memoryRetentionDays: 14,
    autoApproveThreshold: 3,
    learningSignals: {
      taskCompletion: true,
      clientRating: true,
      latencyMetrics: false,
      errorPatterns: true,
      userFeedback: true,
    },
    totalSignals: 156,
    approvedSignals: 142,
    rejectedSignals: 8,
    pendingSignals: 6,
  },
  "agent-3": {
    selfLearningEnabled: true,
    memoryRetentionDays: 60,
    autoApproveThreshold: 5,
    learningSignals: {
      taskCompletion: true,
      clientRating: true,
      latencyMetrics: true,
      errorPatterns: false,
      userFeedback: false,
    },
    totalSignals: 89,
    approvedSignals: 82,
    rejectedSignals: 4,
    pendingSignals: 3,
  },
}

// Signal types for learning
const signalTypes = [
  {
    id: "taskCompletion",
    label: "Task Completion",
    description: "Capture signals when tasks are completed successfully or partially",
  },
  {
    id: "clientRating",
    label: "Client Rating",
    description: "Capture signals based on client feedback ratings (1-5 stars)",
  },
  {
    id: "latencyMetrics",
    label: "Latency Metrics",
    description: "Record performance metrics like response time and throughput",
  },
  {
    id: "errorPatterns",
    label: "Error Patterns",
    description: "Track recurring error patterns for improvement learning",
  },
  {
    id: "userFeedback",
    label: "User Feedback",
    description: "Collect explicit user feedback and corrections",
  },
]

// Recent learning history
const learningHistory = [
  { id: "lh-001", date: "2026-06-02", signals: 12, approved: 10, rejected: 2, status: "applied" },
  { id: "lh-002", date: "2026-06-01", signals: 8, approved: 7, rejected: 1, status: "applied" },
  { id: "lh-003", date: "2026-05-31", signals: 15, approved: 12, rejected: 3, status: "applied" },
  { id: "lh-004", date: "2026-05-30", signals: 6, approved: 5, rejected: 1, status: "pending" },
  { id: "lh-005", date: "2026-05-29", signals: 10, approved: 8, rejected: 2, status: "applied" },
]

export default function AgentLearningPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [selectedTab, setSelectedTab] = useState("config")

  // Find agent - default to agent-1 if id not found
  const agent = mockAgents.find((a) => a.id === id) ?? mockAgents[0]
  const config = agentConfigs[id as keyof typeof agentConfigs] ?? agentConfigs["agent-1"]

  const [selfLearningEnabled, setSelfLearningEnabled] = useState(config.selfLearningEnabled)
  const [memoryRetentionDays, setMemoryRetentionDays] = useState(config.memoryRetentionDays)
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(config.autoApproveThreshold)
  const [learningSignals, setLearningSignals] = useState(config.learningSignals)

  const toggleSignal = (signalId: string) => {
    setLearningSignals((prev) => ({
      ...prev,
      [signalId]: !prev[signalId as keyof typeof prev],
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <a href="/my-agents" className="hover:underline">My Agents</a>
          <span>/</span>
          <span>{agent.name}</span>
          <span>/</span>
          <span>Learning</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="text-lg">
                {agent.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Learning Configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v ?? selectedTab)}>
            <TabsList>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="history">Learning History</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTab === "config" && (
        <>
          {/* Self-Learning Toggle */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Self-Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Enable Self-Learning</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    When enabled, the agent can learn from sessions and improve its responses
                  </div>
                </div>
                <Switch
                  checked={selfLearningEnabled}
                  onCheckedChange={setSelfLearningEnabled}
                />
              </div>

              {selfLearningEnabled && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Self-learning is active</span>
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    The agent will capture and process learning signals automatically
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Memory Retention */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Memory Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Retention Period</div>
                <span className="text-2xl font-bold">{memoryRetentionDays} days</span>
              </div>
              <Slider
                value={[memoryRetentionDays]}
                onValueChange={(v) => setMemoryRetentionDays(Array.isArray(v) ? v[0] : v)}
                min={7}
                max={90}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>7 days</span>
                <span>30 days</span>
                <span>60 days</span>
                <span>90 days</span>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Impact on Performance</div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Shorter retention</span>
                    <div className="text-lg font-bold">Faster learning cycle</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longer retention</span>
                    <div className="text-lg font-bold">More context preserved</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current setting</span>
                    <div className="text-lg font-bold">{memoryRetentionDays} days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Approve Threshold */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Auto-Approve Threshold</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Minimum Rating for Auto-Approve</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{autoApproveThreshold}</span>
                  <span className="text-muted-foreground">stars</span>
                </div>
              </div>
              <Slider
                value={[autoApproveThreshold]}
                onValueChange={(v) => setAutoApproveThreshold(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 (lenient)</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5 (strict)</span>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Preview</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Signals auto-approved</span>
                  <Badge variant="default" className="bg-emerald-100 text-emerald-700">
                    ~{Math.round(config.totalSignals * 0.85)}/year
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Signals requiring review</span>
                  <Badge variant="secondary">
                    ~{Math.round(config.totalSignals * 0.15)}/year
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Signal Types */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Signal Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Select which types of signals the agent should capture for learning
              </div>
              <div className="space-y-4">
                {signalTypes.map((signal) => (
                  <div
                    key={signal.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <Checkbox
                      checked={learningSignals[signal.id as keyof typeof learningSignals]}
                      onCheckedChange={() => toggleSignal(signal.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{signal.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {signal.description}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {learningSignals[signal.id as keyof typeof learningSignals] ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{config.totalSignals}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Signals</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{config.approvedSignals}</div>
                  <div className="text-xs text-muted-foreground mt-1">Approved</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{config.rejectedSignals}</div>
                  <div className="text-xs text-muted-foreground mt-1">Rejected</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{config.pendingSignals}</div>
                  <div className="text-xs text-muted-foreground mt-1">Pending</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Approval Rate</span>
                <span className="text-lg font-bold text-emerald-600">
                  {Math.round((config.approvedSignals / config.totalSignals) * 100)}%
                </span>
              </div>
              <Progress value={(config.approvedSignals / config.totalSignals) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </>
      )}

      {selectedTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Learning History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Signals Captured</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {learningHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="font-medium">{entry.date}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.signals}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-emerald-100 text-emerald-700">
                        {entry.approved}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{entry.rejected}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.status === "applied" ? "default" : "secondary"}
                        className={entry.status === "applied" ? "bg-emerald-100 text-emerald-700" : ""}
                      >
                        {entry.status === "applied" ? "Applied to Production" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/learning-logs/${entry.id}`}>View Details</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" asChild>
                <a href={`/learning-logs/pending`}>View Pending Approvals</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/my-agents/${id}/versions`}>View Agent Versions</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}