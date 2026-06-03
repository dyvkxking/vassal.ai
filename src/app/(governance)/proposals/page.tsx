"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MOCK_PROPOSALS } from "@/lib/mock-data"
import type { Proposal, ProposalStatus } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  Plus,
} from "lucide-react"

type FilterTab = "all" | ProposalStatus
type SortOption = "ending_soon" | "most_votes" | "newest"

const STATUS_CONFIG = {
  active: {
    label: "Active",
    variant: "default" as const,
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  passed: {
    label: "Passed",
    variant: "secondary" as const,
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  failed: {
    label: "Failed",
    variant: "destructive" as const,
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  draft: {
    label: "Draft",
    variant: "outline" as const,
    className: "bg-muted text-muted-foreground",
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  slash_amounts: "Slash Amounts",
  sla_thresholds: "SLA Thresholds",
  protocol_upgrade: "Protocol Upgrade",
  tokenomics: "Tokenomics",
  treasury: "Treasury",
  other: "Other",
}

function formatTimeRemaining(endTime: number): string {
  const now = Date.now()
  const diff = endTime - now

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h remaining`
  return "Less than 1h remaining"
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

function getQuorumProgress(proposal: Proposal): number {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  return Math.min((totalVotes / proposal.quorumRequired) * 100, 100)
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(proposal.endTime))
  const isActive = proposal.status === "active"
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
  const abstainPercent = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0
  const quorumProgress = getQuorumProgress(proposal)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(proposal.endTime))
    }, 60000)
    return () => clearInterval(interval)
  }, [proposal.endTime])

  const statusConfig = STATUS_CONFIG[proposal.status]

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isActive
          ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          : "hover:border-muted-foreground/20"
      }`}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">
                {proposal.id.toUpperCase()}
              </span>
              <Badge
                variant={statusConfig.variant}
                className={`${statusConfig.className} text-xs`}
              >
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {CATEGORY_LABELS[proposal.category] || proposal.category}
              </Badge>
            </div>
            <Link href={`/governance/${proposal.id}`} className="group">
              <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                {proposal.title}
              </CardTitle>
            </Link>
          </div>
          {isActive && (
            <Button variant="outline" size="sm">
              <Link href={`/governance/${proposal.id}`}>Vote</Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {proposal.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>For</span>
            <span>Against</span>
            <span>Abstain</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${forPercent}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${againstPercent}%` }}
            />
            <div
              className="bg-muted-foreground/50 transition-all"
              style={{ width: `${abstainPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-emerald-500 font-medium">
              {formatNumber(proposal.votesFor)} ({forPercent.toFixed(1)}%)
            </span>
            <span className="text-red-500 font-medium">
              {formatNumber(proposal.votesAgainst)} ({againstPercent.toFixed(1)}%)
            </span>
            <span className="text-muted-foreground">
              {formatNumber(proposal.votesAbstain)} ({abstainPercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className={isActive ? "text-amber-500" : ""}>{timeRemaining}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{proposal.totalVoters} voters</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              Quorum: {quorumProgress.toFixed(0)}%
            </div>
            <Progress value={quorumProgress} className="w-16 h-1.5" />
          </div>
        </div>

        {isActive && (
          <div className="flex items-center justify-end">
            <Link
              href={`/governance/${proposal.id}`}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({ filter }: { filter: FilterTab }) {
  const messages: Record<FilterTab, string> = {
    all: "No proposals found",
    active: "No active proposals at the moment",
    passed: "No passed proposals yet",
    failed: "No failed proposals",
    draft: "No draft proposals",
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">{messages[filter]}</h3>
      <p className="text-sm text-muted-foreground">
        Check back later or create a new proposal
      </p>
    </div>
  )
}

export default function GovernanceProposalsPage() {
  const [filter, setFilter] = useState<FilterTab>("all")
  const [sort, setSort] = useState<SortOption>("ending_soon")

  const userVotingPower = 12500 // Mock user voting power

  const filteredProposals = MOCK_PROPOSALS.filter((p) => {
    if (filter === "all") return true
    return p.status === filter
  })

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sort) {
      case "ending_soon":
        return a.endTime - b.endTime
      case "most_votes":
        const votesA = a.votesFor + a.votesAgainst + a.votesAbstain
        const votesB = b.votesFor + b.votesAgainst + b.votesAbstain
        return votesB - votesA
      case "newest":
        return b.createdAt - a.createdAt
      default:
        return 0
    }
  })

  const activeCount = MOCK_PROPOSALS.filter((p) => p.status === "active").length
  const passedCount = MOCK_PROPOSALS.filter((p) => p.status === "passed").length
  const failedCount = MOCK_PROPOSALS.filter((p) => p.status === "failed").length
  const draftCount = MOCK_PROPOSALS.filter((p) => p.status === "draft").length

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governance</h1>
          <p className="text-muted-foreground mt-1">
            Participate in protocol decisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Voting Power</div>
            <div className="text-xl font-semibold text-primary">
              {formatNumber(userVotingPower)} $MESH
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Proposal
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as FilterTab)}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active
              {activeCount > 0 && (
                <span className="ml-1.5 text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                  {activeCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="passed">
              Passed
              {passedCount > 0 && (
                <span className="ml-1.5 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  {passedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed
              {failedCount > 0 && (
                <span className="ml-1.5 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                  {failedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft
              {draftCount > 0 && (
                <span className="ml-1.5 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  {draftCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort:</span>
          <Tabs value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <TabsList className="h-8">
              <TabsTrigger value="ending_soon" className="text-xs px-2 py-1">
                Ending Soon
              </TabsTrigger>
              <TabsTrigger value="most_votes" className="text-xs px-2 py-1">
                Most Votes
              </TabsTrigger>
              <TabsTrigger value="newest" className="text-xs px-2 py-1">
                Newest
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {sortedProposals.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-4">
          {sortedProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  )
}