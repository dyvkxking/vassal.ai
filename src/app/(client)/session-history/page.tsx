"use client"

import React, { useState, useMemo } from "react"
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DownloadIcon, StarIcon } from "lucide-react"

// --- Types ---
type SessionStatus = "completed" | "failed" | "cancelled"
type SlaVerdict = "PASS" | "FAIL"

interface ClientSession {
  id: string
  date: Date
  agentId: string
  agentName: string
  duration: number // minutes
  cost: number
  status: SessionStatus
  slaVerdict: SlaVerdict
  rating: number | null
  failureReason?: string
  partialCharge?: number
}

// --- Mock Data ---
const MOCK_AGENTS = [
  { id: "agent-001", name: "CodeMaster AI" },
  { id: "agent-002", name: "DataCruncher" },
  { id: "agent-003", name: "LegalEase Bot" },
  { id: "agent-004", name: "ContentGen Pro" },
  { id: "agent-005", name: "ResearchAssistant" },
]

const MOCK_CLIENT_SESSIONS: ClientSession[] = [
  {
    id: "cs-001",
    date: new Date("2026-05-28T14:30:00"),
    agentId: "agent-001",
    agentName: "CodeMaster AI",
    duration: 45,
    cost: 0.0234,
    status: "completed",
    slaVerdict: "PASS",
    rating: 5,
  },
  {
    id: "cs-002",
    date: new Date("2026-05-27T09:15:00"),
    agentId: "agent-002",
    agentName: "DataCruncher",
    duration: 120,
    cost: 0.0876,
    status: "completed",
    slaVerdict: "PASS",
    rating: 4,
  },
  {
    id: "cs-003",
    date: new Date("2026-05-26T16:45:00"),
    agentId: "agent-003",
    agentName: "LegalEase Bot",
    duration: 30,
    cost: 0.015,
    status: "failed",
    slaVerdict: "FAIL",
    rating: null,
    failureReason: "Response latency exceeded SLA threshold",
    partialCharge: 0.005,
  },
  {
    id: "cs-004",
    date: new Date("2026-05-25T11:00:00"),
    agentId: "agent-001",
    agentName: "CodeMaster AI",
    duration: 90,
    cost: 0.054,
    status: "completed",
    slaVerdict: "PASS",
    rating: 5,
  },
  {
    id: "cs-005",
    date: new Date("2026-05-24T08:30:00"),
    agentId: "agent-004",
    agentName: "ContentGen Pro",
    duration: 60,
    cost: 0.036,
    status: "cancelled",
    slaVerdict: "FAIL",
    rating: null,
    failureReason: "Client requested cancellation before completion",
    partialCharge: 0.012,
  },
  {
    id: "cs-006",
    date: new Date("2026-05-23T15:00:00"),
    agentId: "agent-005",
    agentName: "ResearchAssistant",
    duration: 180,
    cost: 0.124,
    status: "completed",
    slaVerdict: "PASS",
    rating: 4,
  },
  {
    id: "cs-007",
    date: new Date("2026-05-22T10:20:00"),
    agentId: "agent-002",
    agentName: "DataCruncher",
    duration: 75,
    cost: 0.048,
    status: "failed",
    slaVerdict: "FAIL",
    rating: null,
    failureReason: "API rate limit exceeded",
    partialCharge: 0.018,
  },
  {
    id: "cs-008",
    date: new Date("2026-05-21T13:45:00"),
    agentId: "agent-003",
    agentName: "LegalEase Bot",
    duration: 40,
    cost: 0.022,
    status: "completed",
    slaVerdict: "PASS",
    rating: 3,
  },
  {
    id: "cs-009",
    date: new Date("2026-05-20T17:00:00"),
    agentId: "agent-001",
    agentName: "CodeMaster AI",
    duration: 55,
    cost: 0.031,
    status: "completed",
    slaVerdict: "PASS",
    rating: 5,
  },
  {
    id: "cs-010",
    date: new Date("2026-05-19T09:30:00"),
    agentId: "agent-004",
    agentName: "ContentGen Pro",
    duration: 35,
    cost: 0.019,
    status: "cancelled",
    slaVerdict: "FAIL",
    rating: null,
    failureReason: "Payment processing failed",
    partialCharge: 0.007,
  },
  {
    id: "cs-011",
    date: new Date("2026-05-18T12:00:00"),
    agentId: "agent-005",
    agentName: "ResearchAssistant",
    duration: 200,
    cost: 0.145,
    status: "completed",
    slaVerdict: "PASS",
    rating: 4,
  },
  {
    id: "cs-012",
    date: new Date("2026-05-17T14:15:00"),
    agentId: "agent-002",
    agentName: "DataCruncher",
    duration: 95,
    cost: 0.062,
    status: "completed",
    slaVerdict: "PASS",
    rating: 5,
  },
]

// --- Components ---

function StatCard({
  title,
  value,
  subValue,
}: {
  title: string
  value: string
  subValue?: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        {subValue && (
          <div className="mt-1 text-xs text-muted-foreground">{subValue}</div>
        )}
      </CardContent>
    </Card>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`size-3 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const variants: Record<SessionStatus, "default" | "destructive" | "secondary"> = {
    completed: "default",
    failed: "destructive",
    cancelled: "secondary",
  }
  const labels: Record<SessionStatus, string> = {
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
  }
  return (
    <Badge variant={variants[status]} className="capitalize">
      {labels[status]}
    </Badge>
  )
}

function SlaBadge({ verdict }: { verdict: SlaVerdict }) {
  return (
    <Badge
      variant={verdict === "PASS" ? "default" : "destructive"}
      className={verdict === "PASS" ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {verdict}
    </Badge>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

const ITEMS_PER_PAGE = 5

export default function SessionHistoryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "failed">("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [agentFilter, setAgentFilter] = useState<string>("all")
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  const filteredSessions = useMemo(() => {
    return MOCK_CLIENT_SESSIONS.filter((session) => {
      // Tab filter
      if (activeTab === "completed" && session.status !== "completed") return false
      if (activeTab === "failed" && session.status !== "failed" && session.status !== "cancelled")
        return false

      // Date filter
      if (dateFrom && new Date(session.date) < new Date(dateFrom)) return false
      if (dateTo && new Date(session.date) > new Date(dateTo)) return false

      // Agent filter
      if (agentFilter !== "all" && session.agentId !== agentFilter) return false

      // Outcome filter
      if (outcomeFilter !== "all" && session.status !== outcomeFilter) return false

      return true
    })
  }, [activeTab, dateFrom, dateTo, agentFilter, outcomeFilter])

  // Stats
  const stats = useMemo(() => {
    const completed = MOCK_CLIENT_SESSIONS.filter((s) => s.status === "completed")
    const totalSpent = MOCK_CLIENT_SESSIONS.reduce((sum, s) => sum + s.cost, 0)
    const avgCost =
      completed.length > 0
        ? completed.reduce((sum, s) => sum + s.cost, 0) / completed.length
        : 0
    const ratedSessions = completed.filter((s) => s.rating !== null)
    const avgRating =
      ratedSessions.length > 0
        ? ratedSessions.reduce((sum, s) => sum + (s.rating ?? 0), 0) / ratedSessions.length
        : 0

    return {
      totalSessions: MOCK_CLIENT_SESSIONS.length,
      totalSpent,
      avgCost,
      avgRating,
    }
  }, [])

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)
  const paginatedSessions = filteredSessions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleExport = () => {
    console.log("Exporting session history to CSV...")
    // TODO: Implement actual CSV export
  }

  const handleViewReceipt = (sessionId: string) => {
    console.log("Viewing receipt for session:", sessionId)
    // TODO: Implement receipt viewing
  }

  const handleRateAgent = (sessionId: string) => {
    console.log("Rating agent for session:", sessionId)
    // TODO: Implement agent rating
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your past agent rental sessions.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <DownloadIcon className="mr-2 size-4" />
          Export Session History
        </Button>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sessions" value={stats.totalSessions.toString()} />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent.toFixed(4)}`}
        />
        <StatCard
          title="Avg Cost/Session"
          value={`$${stats.avgCost.toFixed(4)}`}
        />
        <StatCard
          title="Avg Rating Given"
          value={stats.avgRating.toFixed(1)}
          subValue={
            stats.avgRating > 0 ? (
              <StarRating rating={Math.round(stats.avgRating)} />
            ) : undefined
          }
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as typeof activeTab)
          setPage(1)
        }}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed/Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setPage(1)
                }}
                className="w-40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setPage(1)
                }}
                className="w-40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Agent</label>
              <Select
                value={agentFilter}
                onValueChange={(v) => {
                  setAgentFilter(v ?? "all")
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Agents</SelectLabel>
                    <SelectItem value="all">All Agents</SelectItem>
                    {MOCK_AGENTS.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Outcome</label>
              <Select
                value={outcomeFilter}
                onValueChange={(v) => {
                  setOutcomeFilter(v ?? "all")
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Outcomes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Outcomes</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Verdict</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-xs">
                      {session.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{session.agentName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.duration}m
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      ${session.cost.toFixed(4)}
                      {session.partialCharge !== undefined && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (partial: ${session.partialCharge.toFixed(4)})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={session.status} />
                    </TableCell>
                    <TableCell>
                      <SlaBadge verdict={session.slaVerdict} />
                    </TableCell>
                    <TableCell>
                      {session.rating !== null ? (
                        <StarRating rating={session.rating} />
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleViewReceipt(session.id)}
                        >
                          View Receipt
                        </Button>
                        {session.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleRateAgent(session.id)}
                          >
                            Rate Agent
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredSessions.length > ITEMS_PER_PAGE && (
            <div className="mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}