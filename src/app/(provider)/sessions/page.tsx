"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MOCK_SESSIONS, MOCK_AGENTS, getAgentById } from "@/lib/mock-data"
import type { Session } from "@/types"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ============ HELPERS ============

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

function truncateAddress(addr: string, chars = 6): string {
  if (addr.length <= chars * 2 + 3) return addr
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`
}

// ============ SESSION ROW COMPONENTS ============

interface ActiveSessionRowProps {
  session: Session
  providerLastHeartbeat: number
}

function ActiveSessionRow({ session, providerLastHeartbeat }: ActiveSessionRowProps) {
  const agent = getAgentById(session.agentId)
  const duration = Date.now() - session.startTime
  const heartbeatAge = Math.floor((Date.now() - providerLastHeartbeat) / 1000)

  const slaHealthy = session.latencyMetrics.breaches === 0
  const slaWarning = session.latencyMetrics.breaches > 0 && session.latencyMetrics.breaches <= 2
  const slaBreached = session.latencyMetrics.breaches > 2

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{session.id}</TableCell>
      <TableCell>
        <Link
          href={`/marketplace/agent/${session.agentId}`}
          className="text-primary hover:underline"
        >
          {agent?.name ?? session.agentId}
        </Link>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground">
          {truncateAddress(session.client)}
        </span>
      </TableCell>
      <TableCell>{formatDuration(duration)}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">{(session.tpmUsed / 1000).toFixed(1)}k</span>
      </TableCell>
      <TableCell className="font-medium">${session.totalCost.toFixed(4)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div className={cn("size-2 rounded-full", {
            "bg-green-500": slaHealthy,
            "bg-yellow-500": slaWarning,
            "bg-red-500": slaBreached,
          })} />
          <span className={cn("text-xs font-medium", {
            "text-green-600 dark:text-green-400": slaHealthy,
            "text-yellow-600 dark:text-yellow-400": slaWarning,
            "text-red-600 dark:text-red-400": slaBreached,
          })}>
            {slaHealthy ? "Healthy" : slaWarning ? "Warning" : "Breached"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div className={cn("size-2 rounded-full", {
            "bg-green-500 animate-pulse": heartbeatAge < 30,
            "bg-yellow-500": heartbeatAge >= 30,
          })} />
          <span className="text-xs text-muted-foreground">
            {heartbeatAge < 5 ? "Live" : `${heartbeatAge}s ago`}
          </span>
        </div>
      </TableCell>
    </TableRow>
  )
}

interface CompletedSessionRowProps {
  session: Session
}

function CompletedSessionRow({ session }: CompletedSessionRowProps) {
  const agent = getAgentById(session.agentId)
  const duration = session.endTime ? session.endTime - session.startTime : 0

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{session.id}</TableCell>
      <TableCell>
        <Link
          href={`/marketplace/agent/${session.agentId}`}
          className="text-primary hover:underline"
        >
          {agent?.name ?? session.agentId}
        </Link>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground">
          {truncateAddress(session.client)}
        </span>
      </TableCell>
      <TableCell>{formatDuration(duration)}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">{(session.tpmUsed / 1000).toFixed(1)}k</span>
      </TableCell>
      <TableCell className="font-medium">${session.totalCost.toFixed(4)}</TableCell>
      <TableCell>
        {session.rating != null ? (
          <div className="flex items-center gap-1">
            <svg className="size-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-medium">{session.rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
      <TableCell>
        {session.slashEvents && session.slashEvents.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {session.slashEvents.map((event) => (
              <Badge key={event.id} variant="destructive" className="text-xs">
                SLASH {event.amount.toFixed(4)}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
      <TableCell>
        {session.feedback ? (
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px] block" title={session.feedback}>
            {session.feedback}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
    </TableRow>
  )
}

interface CancelledSessionRowProps {
  session: Session
}

function CancelledSessionRow({ session }: CancelledSessionRowProps) {
  const agent = getAgentById(session.agentId)
  const duration = session.endTime ? session.endTime - session.startTime : 0

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{session.id}</TableCell>
      <TableCell>
        <Link
          href={`/marketplace/agent/${session.agentId}`}
          className="text-primary hover:underline"
        >
          {agent?.name ?? session.agentId}
        </Link>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground">
          {truncateAddress(session.client)}
        </span>
      </TableCell>
      <TableCell>{formatDuration(duration)}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">{(session.tpmUsed / 1000).toFixed(1)}k</span>
      </TableCell>
      <TableCell className="font-medium">${session.totalCost.toFixed(4)}</TableCell>
    </TableRow>
  )
}

// ============ TABLE COMPONENTS ============

interface ActiveSessionsTableProps {
  sessions: Session[]
  page: number
  pageSize: number
}

function ActiveSessionsTable({ sessions, page, pageSize }: ActiveSessionsTableProps) {
  const paginated = sessions.slice((page - 1) * pageSize, page * pageSize)
  const lastHeartbeat = Date.now() - 30000 // mock last heartbeat

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>TPM Used</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>SLA Health</TableHead>
            <TableHead>Heartbeat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No active sessions found.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((session) => (
              <ActiveSessionRow
                key={session.id}
                session={session}
                providerLastHeartbeat={lastHeartbeat}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface CompletedSessionsTableProps {
  sessions: Session[]
  page: number
  pageSize: number
}

function CompletedSessionsTable({ sessions, page, pageSize }: CompletedSessionsTableProps) {
  const paginated = sessions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>TPM Used</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Slash Events</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No completed sessions found.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((session) => (
              <CompletedSessionRow key={session.id} session={session} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface CancelledSessionsTableProps {
  sessions: Session[]
  page: number
  pageSize: number
}

function CancelledSessionsTable({ sessions, page, pageSize }: CancelledSessionsTableProps) {
  const paginated = sessions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>TPM Used</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No cancelled sessions found.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((session) => (
              <CancelledSessionRow key={session.id} session={session} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// ============ PAGINATION ============

interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

function Pagination({ total, page, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} sessions
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
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

// ============ FILTER BAR ============

interface FilterBarProps {
  dateFrom: string
  dateTo: string
  agentId: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  onAgentIdChange: (v: string) => void
}

function FilterBar({
  dateFrom,
  dateTo,
  agentId,
  onDateFromChange,
  onDateToChange,
  onAgentIdChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">From:</span>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-[140px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">To:</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-[140px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Agent:</span>
        <Select value={agentId} onValueChange={onAgentIdChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {MOCK_AGENTS.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ============ PAGE ============

const PAGE_SIZE = 10

export default function ProviderSessionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "cancelled">("active")
  const [activePage, setActivePage] = useState(1)
  const [completedPage, setCompletedPage] = useState(1)
  const [cancelledPage, setCancelledPage] = useState(1)

  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [agentFilter, setAgentFilter] = useState("all")

  const filteredSessions = useMemo(() => {
    return MOCK_SESSIONS.filter((session) => {
      if (agentFilter !== "all" && session.agentId !== agentFilter) return false

      const sessionDate = new Date(session.startTime)
      if (dateFrom && sessionDate < new Date(dateFrom)) return false
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (sessionDate > toDate) return false
      }

      return true
    })
  }, [dateFrom, dateTo, agentFilter])

  const activeSessions = filteredSessions.filter((s) => s.status === "active")
  const completedSessions = filteredSessions.filter((s) => s.status === "completed")
  const cancelledSessions = filteredSessions.filter((s) => s.status === "cancelled")

  const getCurrentPage = (tab: "active" | "completed" | "cancelled") => {
    if (tab === "active") return activePage
    if (tab === "completed") return completedPage
    return cancelledPage
  }

  const setCurrentPage = (tab: "active" | "completed" | "cancelled", page: number) => {
    if (tab === "active") setActivePage(page)
    else if (tab === "completed") setCompletedPage(page)
    else setCancelledPage(page)
  }

  const getSessionsForTab = (tab: "active" | "completed" | "cancelled") => {
    if (tab === "active") return activeSessions
    if (tab === "completed") return completedSessions
    return cancelledSessions
  }

  const currentPage = getCurrentPage(activeTab)
  const sessions = getSessionsForTab(activeTab)

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab)
    setActivePage(1)
    setCompletedPage(1)
    setCancelledPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Provider Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your compute sessions, earnings, and SLA performance.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg font-medium">Sessions</CardTitle>
            <FilterBar
              dateFrom={dateFrom}
              dateTo={dateTo}
              agentId={agentFilter}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onAgentIdChange={setAgentFilter}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="active">
                Active
                <Badge variant="secondary" className="ml-1.5">
                  {activeSessions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <Badge variant="secondary" className="ml-1.5">
                  {completedSessions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                <Badge variant="secondary" className="ml-1.5">
                  {cancelledSessions.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4 space-y-4">
              <ActiveSessionsTable
                sessions={activeSessions}
                page={activePage}
                pageSize={PAGE_SIZE}
              />
              {activeSessions.length > PAGE_SIZE && (
                <Pagination
                  total={activeSessions.length}
                  page={activePage}
                  pageSize={PAGE_SIZE}
                  onPageChange={(p) => setActivePage(p)}
                />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4 space-y-4">
              <CompletedSessionsTable
                sessions={completedSessions}
                page={completedPage}
                pageSize={PAGE_SIZE}
              />
              {completedSessions.length > PAGE_SIZE && (
                <Pagination
                  total={completedSessions.length}
                  page={completedPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={(p) => setCompletedPage(p)}
                />
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-4 space-y-4">
              <CancelledSessionsTable
                sessions={cancelledSessions}
                page={cancelledPage}
                pageSize={PAGE_SIZE}
              />
              {cancelledSessions.length > PAGE_SIZE && (
                <Pagination
                  total={cancelledSessions.length}
                  page={cancelledPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={(p) => setCancelledPage(p)}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}