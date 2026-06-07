"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Download,
  Search,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  BarChart3,
  Users,
  Filter,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react"

// Mock user's voting history
const userVotingHistory = [
  {
    proposalId: "GIP-042",
    title: "Increase staking reward ratio to 12%",
    vote: "for",
    date: "2026-06-02",
    votingPower: 125000,
    reason: "Competitive rewards are essential for network security and validator retention.",
    status: "active",
    category: "tokenomics",
  },
  {
    proposalId: "GIP-041",
    title: "Reduce node operator commission to 5%",
    vote: "for",
    date: "2026-05-28",
    votingPower: 125000,
    reason: "Lower commissions will attract more validators and improve decentralization.",
    status: "active",
    category: "protocol_upgrade",
  },
  {
    proposalId: "GIP-039",
    title: "Add ETH as cross-chain settlement asset",
    vote: "abstain",
    date: "2026-05-20",
    votingPower: 125000,
    reason: "",
    status: "passed",
    category: "tokenomics",
  },
  {
    proposalId: "GIP-037",
    title: "Enable instant unstaking with 1% fee",
    vote: "against",
    date: "2026-05-15",
    votingPower: 125000,
    reason: "The 1% fee is too low to deter abuse. Consider 2-3% minimum.",
    status: "defeated",
    category: "protocol_upgrade",
  },
  {
    proposalId: "GIP-036",
    title: "Add Polygon as supported chain",
    vote: "for",
    date: "2026-05-10",
    votingPower: 125000,
    reason: "Polygon integration will improve cross-chain interoperability.",
    status: "passed",
    category: "other",
  },
  {
    proposalId: "GIP-034",
    title: "Increase validator slash rate for downtime",
    vote: "for",
    date: "2026-04-28",
    votingPower: 120000,
    reason: "Stronger accountability leads to better network reliability.",
    status: "passed",
    category: "sla_thresholds",
  },
  {
    proposalId: "GIP-033",
    title: "Treasury diversification into USDC",
    vote: "abstain",
    date: "2026-04-20",
    votingPower: 120000,
    reason: "",
    status: "passed",
    category: "treasury",
  },
  {
    proposalId: "GIP-031",
    title: "Enable Layer 2 scaling solution",
    vote: "for",
    date: "2026-04-15",
    votingPower: 100000,
    reason: "L2 solutions are critical for scalability.",
    status: "passed",
    category: "protocol_upgrade",
  },
]

// Delegate's voting history (if user has delegated)
const delegateVotingHistory = [
  {
    proposalId: "GIP-042",
    title: "Increase staking reward ratio to 12%",
    delegateVote: "for",
    yourDelegatedPower: 125000,
    date: "2026-06-02",
    delegateAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    delegateName: "MeshGuardian",
  },
  {
    proposalId: "GIP-041",
    title: "Reduce node operator commission to 5%",
    delegateVote: "for",
    yourDelegatedPower: 125000,
    date: "2026-05-28",
    delegateAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    delegateName: "MeshGuardian",
  },
  {
    proposalId: "GIP-039",
    title: "Add ETH as cross-chain settlement asset",
    delegateVote: "abstain",
    yourDelegatedPower: 125000,
    date: "2026-05-20",
    delegateAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    delegateName: "MeshGuardian",
  },
]

// Voting statistics
const votingStats = {
  totalVotes: 8,
  forVotes: 5,
  againstVotes: 1,
  abstainVotes: 2,
  participationRate: 80,
  avgVotingPower: 120000,
  activeDelegation: true,
  delegateAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
  delegateName: "MeshGuardian",
  totalDelegated: 125000,
}

function formatAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`
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

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    passed: "bg-green-500/10 text-green-600 border-green-500/20",
    defeated: "bg-red-500/10 text-red-600 border-red-500/20",
    executed: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    expired: "bg-muted text-muted-foreground",
  }
  return (
    <Badge className={`${statusColors[status] || ""} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string
  value: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${color || ""}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`p-2 bg-primary/10 rounded-lg`}>
            <Icon className={`w-5 h-5 ${color || "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VotingHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("votes")
  const [sortBy, setSortBy] = useState<"date" | "proposal">("date")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")

  const filteredVotes = userVotingHistory.filter(
    (v) =>
      v.proposalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = () => {
    // In real app, would generate and download file
    console.log(`Exporting as ${exportFormat}`)
    setShowExportDialog(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Voting History</h1>
          <p className="text-muted-foreground mt-1">
            View and export all your governance votes
          </p>
        </div>
        <Button onClick={() => setShowExportDialog(true)}>
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Voting Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Votes"
          value={votingStats.totalVotes.toString()}
          subtitle="All time"
          icon={BarChart3}
        />
        <StatCard
          title="For"
          value={votingStats.forVotes.toString()}
          subtitle={`${Math.round((votingStats.forVotes / votingStats.totalVotes) * 100)}%`}
          icon={ThumbsUp}
          color="text-green-600"
        />
        <StatCard
          title="Against"
          value={votingStats.againstVotes.toString()}
          subtitle={`${Math.round((votingStats.againstVotes / votingStats.totalVotes) * 100)}%`}
          icon={ThumbsDown}
          color="text-red-600"
        />
        <StatCard
          title="Abstain"
          value={votingStats.abstainVotes.toString()}
          subtitle={`${Math.round((votingStats.abstainVotes / votingStats.totalVotes) * 100)}%`}
          icon={Minus}
          color="text-muted-foreground"
        />
        <StatCard
          title="Participation"
          value={`${votingStats.participationRate}%`}
          subtitle="Last 30 days"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Avg. Power"
          value={formatAmount(votingStats.avgVotingPower)}
          subtitle="MESH"
          icon={Calendar}
          color="text-primary"
        />
      </div>

      {/* Active Delegation Notice */}
      {votingStats.activeDelegation && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">You have an active delegation</p>
                  <p className="text-sm text-muted-foreground">
                    Delegated {formatAmount(votingStats.totalDelegated)} MESH to{" "}
                    <Link
                      href={`/governance/delegate/${votingStats.delegateAddress}`}
                      className="text-blue-600 hover:underline"
                    >
                      {votingStats.delegateName || formatAddress(votingStats.delegateAddress)}
                    </Link>
                  </p>
                </div>
              </div>
              <Link href="/delegation">
                <Button variant="outline">
                  Manage Delegation
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="votes">My Votes</TabsTrigger>
          <TabsTrigger value="delegate">Delegate&apos;s Votes</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="votes" className="space-y-6">
          {/* Search and filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Sort:</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                <option value="date">Date</option>
                <option value="proposal">Proposal</option>
              </select>
            </div>
          </div>

          {/* Votes Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Vote</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Voting Power</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVotes.map((vote) => (
                    <TableRow key={vote.proposalId}>
                      <TableCell>
                        <Link
                          href={`/governance/proposals/${vote.proposalId}`}
                          className="font-mono text-sm hover:text-primary"
                        >
                          {vote.proposalId}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {vote.title}
                      </TableCell>
                      <TableCell>
                        <VoteBadge vote={vote.vote} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={vote.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatAmount(vote.votingPower)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {vote.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredVotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No votes found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vote Reasons */}
          {filteredVotes.filter((v) => v.reason).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vote Reasons</CardTitle>
                <CardDescription>
                  Your reasoning for votes with explanations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredVotes
                  .filter((v) => v.reason)
                  .map((vote) => (
                    <div
                      key={vote.proposalId}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/governance/proposals/${vote.proposalId}`}
                          className="font-mono text-sm font-medium hover:text-primary"
                        >
                          {vote.proposalId}
                        </Link>
                        <VoteBadge vote={vote.vote} />
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{vote.reason}&quot;
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delegate" className="space-y-6">
          {/* Delegate's Votes Table */}
          <Card>
            <CardHeader>
              <CardTitle>How Your Delegate Voted</CardTitle>
              <CardDescription>
                Voting record of{" "}
                <Link
                  href={`/governance/delegate/${votingStats.delegateAddress}`}
                  className="text-blue-600 hover:underline"
                >
                  {votingStats.delegateName || formatAddress(votingStats.delegateAddress)}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Delegate&apos;s Vote</TableHead>
                    <TableHead className="text-right">Your Power</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delegateVotingHistory.map((vote) => (
                    <TableRow key={vote.proposalId}>
                      <TableCell>
                        <Link
                          href={`/governance/proposals/${vote.proposalId}`}
                          className="font-mono text-sm hover:text-primary"
                        >
                          {vote.proposalId}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {vote.title}
                      </TableCell>
                      <TableCell>
                        <VoteBadge vote={vote.delegateVote} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatAmount(vote.yourDelegatedPower)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {vote.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Delegation Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Delegation Impact</CardTitle>
              <CardDescription>
                How your delegation affects governance decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Voting Power</p>
                  <p className="text-2xl font-bold">{formatAmount(votingStats.totalDelegated)}</p>
                  <p className="text-xs text-muted-foreground">MESH</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Proposals Voted</p>
                  <p className="text-2xl font-bold">{delegateVotingHistory.length}</p>
                  <p className="text-xs text-muted-foreground">by delegate</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Share</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((votingStats.totalDelegated / 2450000) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground">of delegate&apos;s total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Voting Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vote Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600">For</span>
                      <span>{votingStats.forVotes} votes</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(votingStats.forVotes / votingStats.totalVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600">Against</span>
                      <span>{votingStats.againstVotes} votes</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(votingStats.againstVotes / votingStats.totalVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Abstain</span>
                      <span>{votingStats.abstainVotes} votes</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-muted-foreground/50"
                        style={{
                          width: `${(votingStats.abstainVotes / votingStats.totalVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { category: "Protocol Upgrade", count: 3 },
                    { category: "Tokenomics", count: 2 },
                    { category: "Other", count: 1 },
                    { category: "SLA Thresholds", count: 1 },
                    { category: "Treasury", count: 1 },
                  ].map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{item.category}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">{votingStats.totalVotes}</p>
                  <p className="text-sm text-muted-foreground">Total Proposals</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredVotes.filter((v) => v.status === "passed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {filteredVotes.filter((v) => v.status === "defeated").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Defeated</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredVotes.filter((v) => v.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[400px] mx-4">
            <CardHeader>
              <CardTitle>Export Voting History</CardTitle>
              <CardDescription>
                Download your voting history as a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="flex gap-2">
                  <Button
                    variant={exportFormat === "csv" ? "default" : "outline"}
                    onClick={() => setExportFormat("csv")}
                    className="flex-1"
                  >
                    CSV
                  </Button>
                  <Button
                    variant={exportFormat === "json" ? "default" : "outline"}
                    onClick={() => setExportFormat("json")}
                    className="flex-1"
                  >
                    JSON
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Export includes:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>All {userVotingHistory.length} votes</li>
                  <li>Proposal details</li>
                  <li>Vote choices</li>
                  <li>Voting power</li>
                </ul>
              </div>
            </CardContent>
            <CardContent className="flex gap-2 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExportDialog(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}