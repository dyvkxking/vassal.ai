"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
  UserCheck,
  UserMinus,
  Award,
  Target,
} from "lucide-react"

interface DelegateProfilePageProps {
  params: Promise<{ id: string }>
}

// Mock delegate data
const mockDelegates: Record<string, {
  address: string
  name?: string
  totalDelegated: number
  voters: number
  participationRate: number
  alignmentScore: number
  proposalsVoted: number
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  lastActivity: string
  since: string
  bio?: string
  website?: string
}> = {
  "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123": {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    name: "MeshGuardian",
    totalDelegated: 2450000,
    voters: 1247,
    participationRate: 98,
    alignmentScore: 94,
    proposalsVoted: 156,
    votesFor: 89,
    votesAgainst: 12,
    votesAbstain: 55,
    lastActivity: "2026-06-02",
    since: "2024-03-15",
    bio: "Experienced validator focused on protocol security and sustainable growth.",
    website: "https://meshguardian.io",
  },
  "0x8ba1f109551bD432803012645Ac136ddd64DBA72": {
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    name: "ValidatorPrime",
    totalDelegated: 1820000,
    voters: 892,
    participationRate: 95,
    alignmentScore: 89,
    proposalsVoted: 156,
    votesFor: 95,
    votesAgainst: 8,
    votesAbstain: 53,
    lastActivity: "2026-06-01",
    since: "2024-01-20",
    bio: "Professional validation services with focus on network reliability.",
  },
}

// Mock proposals voted on
const proposalsVoted = [
  {
    proposalId: "GIP-042",
    title: "Increase staking reward ratio to 12%",
    vote: "for",
    date: "2026-06-02",
    votingPower: 2450000,
    forVotes: 845200,
    againstVotes: 124300,
  },
  {
    proposalId: "GIP-041",
    title: "Reduce node operator commission to 5%",
    vote: "for",
    date: "2026-05-28",
    votingPower: 2450000,
    forVotes: 623100,
    againstVotes: 198700,
  },
  {
    proposalId: "GIP-039",
    title: "Add ETH as cross-chain settlement asset",
    vote: "abstain",
    date: "2026-05-20",
    votingPower: 2450000,
    forVotes: 712400,
    againstVotes: 89200,
  },
  {
    proposalId: "GIP-037",
    title: "Enable instant unstaking with 1% fee",
    vote: "against",
    date: "2026-05-15",
    votingPower: 2450000,
    forVotes: 534200,
    againstVotes: 445600,
  },
  {
    proposalId: "GIP-036",
    title: "Add Polygon as supported chain",
    vote: "for",
    date: "2026-05-10",
    votingPower: 2450000,
    forVotes: 698000,
    againstVotes: 45000,
  },
]

function formatAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`
  }
  return amount.toLocaleString()
}

function VoteBadge({ vote }: { vote: string }) {
  const config = {
    for: { icon: ThumbsUp, color: "text-green-600", bg: "bg-green-500/10", label: "For" },
    against: { icon: ThumbsDown, color: "text-red-600", bg: "bg-red-500/10", label: "Against" },
    abstain: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted", label: "Abstain" },
  }
  const { icon: Icon, color, bg, label } = config[vote as keyof typeof config] || config.abstain
  return (
    <Badge className={`${bg} ${color} border-0`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  )
}

function StatCard({ title, value, subtitle, icon: Icon }: {
  title: string
  value: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DelegateProfilePage({ params }: DelegateProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isDelegating, setIsDelegating] = useState(false)
  const [isUndelegating, setIsUndelegating] = useState(false)

  // For demo purposes, we'll use the first mock delegate if id is "profile"
  // In production, you'd look up by the actual id
  const resolvedId = (() => {
    // This is simplified - in real app would use router or params.id
    return "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123"
  })()

  const delegate = mockDelegates[resolvedId] || mockDelegates["0x742d35Cc6634C0532925a3b844Bc9e7595f8f123"]

  if (!delegate) {
    notFound()
  }

  const handleDelegate = () => {
    setIsDelegating(true)
    setTimeout(() => {
      setIsDelegating(false)
    }, 1500)
  }

  const handleUndelegate = () => {
    setIsUndelegating(true)
    setTimeout(() => {
      setIsUndelegating(false)
    }, 1500)
  }

  const totalVotes = delegate.votesFor + delegate.votesAgainst + delegate.votesAbstain
  const forPct = Math.round((delegate.votesFor / totalVotes) * 100)
  const againstPct = Math.round((delegate.votesAgainst / totalVotes) * 100)
  const abstainPct = 100 - forPct - againstPct

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/delegation"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Delegation
      </Link>

      {/* Delegate Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="font-mono text-sm">
                  Delegate
                </Badge>
                {delegate.name && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {delegate.name}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-mono">
                {formatAddress(delegate.address)}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span>Member since {delegate.since}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Last active: {delegate.lastActivity}</span>
              </div>
              {delegate.bio && (
                <p className="text-muted-foreground mt-2">{delegate.bio}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="default" onClick={handleDelegate} disabled={isDelegating}>
                <UserCheck className="w-4 h-4 mr-2" />
                {isDelegating ? "Delegating..." : "Delegate to This Address"}
              </Button>
              <Button variant="outline" onClick={handleUndelegate} disabled={isUndelegating}>
                <UserMinus className="w-4 h-4 mr-2" />
                {isUndelegating ? "Undelegating..." : "Undelegate"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Delegated"
          value={`${formatAmount(delegate.totalDelegated)} MESH`}
          subtitle={`${delegate.voters.toLocaleString()} voters`}
          icon={Users}
        />
        <StatCard
          title="Proposals Voted"
          value={delegate.proposalsVoted.toString()}
          subtitle={`${delegate.participationRate}% participation`}
          icon={BarChart3}
        />
        <StatCard
          title="Alignment Score"
          value={`${delegate.alignmentScore}%`}
          subtitle="With delegators"
          icon={Target}
        />
        <StatCard
          title="Vote Record"
          value={`${delegate.votesFor}/${delegate.votesAgainst}/${delegate.votesAbstain}`}
          subtitle="For/Against/Abstain"
          icon={Award}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Voting Record Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Voting Record Summary
              </CardTitle>
              <CardDescription>
                How this delegate has voted across all proposals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual vote breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">For: {delegate.votesFor} ({forPct}%)</span>
                  <span className="text-red-600 font-medium">Against: {delegate.votesAgainst} ({againstPct}%)</span>
                  <span className="text-muted-foreground">Abstain: {delegate.votesAbstain} ({abstainPct}%)</span>
                </div>
                <div className="h-6 rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="h-full bg-green-500 flex items-center justify-center"
                    style={{ width: `${forPct}%` }}
                  />
                  <div
                    className="h-full bg-red-500 flex items-center justify-center"
                    style={{ width: `${againstPct}%` }}
                  />
                  <div
                    className="h-full bg-muted-foreground/30"
                    style={{ width: `${abstainPct}%` }}
                  />
                </div>
              </div>

              <Separator />

              {/* Vote breakdown cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
                  <ThumbsUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{delegate.votesFor}</p>
                  <p className="text-sm text-muted-foreground">Votes For</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
                  <ThumbsDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{delegate.votesAgainst}</p>
                  <p className="text-sm text-muted-foreground">Votes Against</p>
                </div>
                <div className="p-4 rounded-lg bg-muted border text-center">
                  <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-bold text-muted-foreground">{delegate.votesAbstain}</p>
                  <p className="text-sm text-muted-foreground">Abstentions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Participation Rate</span>
                    <span className="font-medium">{delegate.participationRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Alignment with Delegators</span>
                    <span className="font-medium text-green-600">{delegate.alignmentScore}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Proposals Voted</span>
                    <span className="font-medium">{delegate.proposalsVoted}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Total Voters</span>
                    <span className="font-medium">{delegate.voters.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Total Delegated</span>
                    <span className="font-medium">{formatAmount(delegate.totalDelegated)} MESH</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-muted-foreground">Last Activity</span>
                    <span className="font-medium">{delegate.lastActivity}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          {/* Proposals Voted On */}
          <Card>
            <CardHeader>
              <CardTitle>Proposals Voted On</CardTitle>
              <CardDescription>
                Detailed voting history for this delegate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Vote</TableHead>
                    <TableHead className="text-right">Voting Power</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposalsVoted.map((proposal) => (
                    <TableRow key={proposal.proposalId}>
                      <TableCell>
                        <code className="text-sm font-mono">{proposal.proposalId}</code>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{proposal.title}</TableCell>
                      <TableCell>
                        <VoteBadge vote={proposal.vote} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatAmount(proposal.votingPower)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {proposal.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Detailed Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown of delegate performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Participation over time - simple visualization */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Participation Rate</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">{delegate.participationRate}%</div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${delegate.participationRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Based on {delegate.proposalsVoted} proposals</p>
                    </div>
                  </div>
                </div>

                {/* Voting pattern analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Consistency Score</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold">{delegate.alignmentScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Alignment with delegator preferences
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Active Voters</h4>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold">{delegate.voters.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total addresses delegating to this delegate
                    </p>
                  </div>
                </div>

                {/* Voting timeline */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last vote cast</span>
                      <span className="font-medium">{proposalsVoted[0]?.date || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total proposals voted</span>
                      <span className="font-medium">{delegate.proposalsVoted}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium">{delegate.since}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center border-t pt-6">
        <Button size="lg" onClick={handleDelegate} disabled={isDelegating}>
          <UserCheck className="w-5 h-5 mr-2" />
          {isDelegating ? "Delegating..." : "Delegate to This Address"}
        </Button>
        <Button size="lg" variant="outline" onClick={handleUndelegate} disabled={isUndelegating}>
          <UserMinus className="w-5 h-5 mr-2" />
          {isUndelegating ? "Undelegating..." : "Undelegate"}
        </Button>
      </div>
    </div>
  )
}