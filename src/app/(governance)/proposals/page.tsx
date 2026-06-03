"use client"

import * as React from "react"
import Link from "next/link"
import { MOCK_PROPOSALS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProposalStatus } from "@/types"

const statusColors: Record<ProposalStatus, string> = {
  active: "bg-green-500",
  passed: "bg-blue-500",
  failed: "bg-red-500",
  draft: "bg-gray-500",
  queued: "bg-yellow-500",
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ProposalCard({ proposal }: { proposal: typeof MOCK_PROPOSALS[0] }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0

  return (
    <Link href={`/proposal/${proposal.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {proposal.category}
                </Badge>
                <Badge className={`${statusColors[proposal.status]} text-white`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
              <CardTitle className="text-lg">{proposal.title}</CardTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{proposal.summary}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                by {proposal.author} &bull; {formatDate(proposal.createdAt)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes For</span>
                <span className="font-medium">{formatNumber(proposal.votesFor)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${forPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatNumber(proposal.votesAgainst)} Against</span>
                <span>{formatNumber(proposal.votesAbstain)} Abstain</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ProposalsTab({ status }: { status: ProposalStatus }) {
  const filtered = MOCK_PROPOSALS.filter((p) => p.status === status)
  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No {status} proposals
      </div>
    )
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  )
}

export default function ProposalsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Governance Proposals</h1>
          <p className="text-muted-foreground">Participate in protocol governance</p>
        </div>
        <Link
          href="/proposals/create"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Create New Proposal
        </Link>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="passed">Passed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="queued">Queued</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ProposalsTab status="active" />
        </TabsContent>
        <TabsContent value="passed">
          <ProposalsTab status="passed" />
        </TabsContent>
        <TabsContent value="failed">
          <ProposalsTab status="failed" />
        </TabsContent>
        <TabsContent value="draft">
          <ProposalsTab status="draft" />
        </TabsContent>
        <TabsContent value="queued">
          <ProposalsTab status="queued" />
        </TabsContent>
      </Tabs>
    </div>
  )
}