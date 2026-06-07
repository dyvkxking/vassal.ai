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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  Search,
  Trophy,
  BarChart3,
  PieChart,
  Zap,
  Clock,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
} from "lucide-react"

// Mock user delegation data
const userDelegationData = {
  totalVotingPower: 125000,
  delegatedToMe: 252000,
  delegatesCount: 3,
  votingImpact: 377000,
  participationRate: 85,
  proposalsVoted: 42,
}

// Mock voting history for user
const userVotingHistory = [
  {
    proposalId: "GIP-042",
    title: "Increase staking reward ratio to 12%",
    vote: "for",
    date: "2026-06-02",
    votingPower: 125000,
  },
  {
    proposalId: "GIP-041",
    title: "Reduce node operator commission to 5%",
    vote: "for",
    date: "2026-05-28",
    votingPower: 125000,
  },
  {
    proposalId: "GIP-039",
    title: "Add ETH as cross-chain settlement asset",
    vote: "abstain",
    date: "2026-05-20",
    votingPower: 125000,
  },
  {
    proposalId: "GIP-037",
    title: "Enable instant unstaking with 1% fee",
    vote: "against",
    date: "2026-05-15",
    votingPower: 125000,
  },
  {
    proposalId: "GIP-036",
    title: "Add Polygon as supported chain",
    vote: "for",
    date: "2026-05-10",
    votingPower: 125000,
  },
]

// Top delegates leaderboard
const topDelegates = [
  {
    rank: 1,
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    delegatedAmount: 2450000,
    voters: 1247,
    participationRate: 98,
    alignmentScore: 94,
    proposalsVoted: 156,
  },
  {
    rank: 2,
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    delegatedAmount: 1820000,
    voters: 892,
    participationRate: 95,
    alignmentScore: 89,
    proposalsVoted: 156,
  },
  {
    rank: 3,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    delegatedAmount: 1450000,
    voters: 654,
    participationRate: 92,
    alignmentScore: 87,
    proposalsVoted: 150,
  },
  {
    rank: 4,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    delegatedAmount: 980000,
    voters: 432,
    participationRate: 88,
    alignmentScore: 82,
    proposalsVoted: 145,
  },
  {
    rank: 5,
    address: "0x2260FAC5E5542a773Aa44fCFfeF93C8D46C7A15B6",
    delegatedAmount: 760000,
    voters: 298,
    participationRate: 85,
    alignmentScore: 78,
    proposalsVoted: 140,
  },
]

// Delegate performance comparison
const delegatePerformance = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f123",
    name: "MeshGuardian",
    votesFor: 89,
    votesAgainst: 12,
    votesAbstain: 55,
    participationRate: 98,
    avgVotingPower: 2450000,
    lastActivity: "2026-06-02",
  },
  {
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    name: "ValidatorPrime",
    votesFor: 95,
    votesAgainst: 8,
    votesAbstain: 53,
    participationRate: 95,
    avgVotingPower: 1820000,
    lastActivity: "2026-06-01",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name: "StakeMax",
    votesFor: 78,
    votesAgainst: 15,
    votesAbstain: 57,
    participationRate: 92,
    avgVotingPower: 1450000,
    lastActivity: "2026-05-30",
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

export default function DelegationAnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDelegate, setSelectedDelegate] = useState<typeof topDelegates[0] | null>(null)
  const [activeTab, setActiveTab] = useState("impact")

  const filteredDelegates = topDelegates.filter(
    (d) =>
      d.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.voters.toString().includes(searchQuery)
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delegation Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your delegation impact and discover top delegates
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="impact">Your Impact</TabsTrigger>
          <TabsTrigger value="history">Voting Record</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="space-y-6">
          {/* Your Delegation Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Voting Power</p>
                    <p className="text-3xl font-bold mt-1">{formatAmount(userDelegationData.totalVotingPower)}</p>
                    <p className="text-xs text-muted-foreground">MESH</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delegated to You</p>
                    <p className="text-3xl font-bold mt-1">{formatAmount(userDelegationData.delegatedToMe)}</p>
                    <p className="text-xs text-muted-foreground">MESH from {userDelegationData.delegatesCount} delegators</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Voting Impact</p>
                    <p className="text-3xl font-bold mt-1 text-blue-600">{formatAmount(userDelegationData.votingImpact)}</p>
                    <p className="text-xs text-muted-foreground">Combined power</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Participation</p>
                    <p className="text-3xl font-bold mt-1">{userDelegationData.participationRate}%</p>
                    <p className="text-xs text-muted-foreground">{userDelegationData.proposalsVoted} proposals voted</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voting Power Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Your Voting Power Breakdown
              </CardTitle>
              <CardDescription>
                How your voting power is composed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-medium">Your MESH Holdings</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">125,000</p>
                    <p className="text-xs text-muted-foreground">33.2% of total</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium">Delegators ({userDelegationData.delegatesCount})</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">252,000</p>
                    <p className="text-xs text-muted-foreground">66.8% of total</p>
                  </div>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-6">
                <div className="h-6 rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: "33.2%" }}
                    title="Your holdings: 125,000 MESH"
                  />
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: "66.8%" }}
                    title="Delegators: 252,000 MESH"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>125K (33.2%)</span>
                  <span>252K (66.8%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delegators List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Delegators</CardTitle>
              <CardDescription>
                Addresses that have delegated their voting power to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Amount Delegated</TableHead>
                    <TableHead className="text-right">Votes Cast</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <code className="text-sm font-mono">0x742d...f123</code>
                    </TableCell>
                    <TableCell className="text-right font-medium">125,000</TableCell>
                    <TableCell className="text-right">8</TableCell>
                    <TableCell>2026-06-01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-sm font-mono">0x8ba1...A72</code>
                    </TableCell>
                    <TableCell className="text-right font-medium">85,000</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell>2026-05-28</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-sm font-mono">0xa0b8...eb48</code>
                    </TableCell>
                    <TableCell className="text-right font-medium">42,000</TableCell>
                    <TableCell className="text-right">3</TableCell>
                    <TableCell>2026-05-15</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Historical Voting Record */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Voting Record
              </CardTitle>
              <CardDescription>
                How you have voted on proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Your Vote</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Voting Power</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userVotingHistory.map((vote) => (
                    <TableRow key={vote.proposalId}>
                      <TableCell>
                        <code className="text-sm font-mono">{vote.proposalId}</code>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{vote.title}</TableCell>
                      <TableCell>
                        <VoteBadge vote={vote.vote} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{vote.date}</TableCell>
                      <TableCell className="text-right">{formatAmount(vote.votingPower)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Voting Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Votes Cast</p>
                <p className="text-3xl font-bold mt-2">{userVotingHistory.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">For</p>
                <p className="text-3xl font-bold mt-2 text-green-600">
                  {userVotingHistory.filter((v) => v.vote === "for").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Against</p>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {userVotingHistory.filter((v) => v.vote === "against").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Abstain</p>
                <p className="text-3xl font-bold mt-2 text-muted-foreground">
                  {userVotingHistory.filter((v) => v.vote === "abstain").length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          {/* Delegate Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Delegate Performance Comparison</CardTitle>
              <CardDescription>
                Compare how different delegates have voted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delegate</TableHead>
                    <TableHead className="text-right">For</TableHead>
                    <TableHead className="text-right">Against</TableHead>
                    <TableHead className="text-right">Abstain</TableHead>
                    <TableHead className="text-right">Participation</TableHead>
                    <TableHead className="text-right">Avg. Power</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delegatePerformance.map((delegate, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{delegate.name || formatAddress(delegate.address)}</p>
                          <code className="text-xs text-muted-foreground">{formatAddress(delegate.address)}</code>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">{delegate.votesFor}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">{delegate.votesAgainst}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{delegate.votesAbstain}</TableCell>
                      <TableCell className="text-right">{delegate.participationRate}%</TableCell>
                      <TableCell className="text-right">{formatAmount(delegate.avgVotingPower)}</TableCell>
                      <TableCell className="text-muted-foreground">{delegate.lastActivity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Visual comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Pattern Comparison</CardTitle>
              <CardDescription>
                For/Against ratio visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {delegatePerformance.map((delegate, index) => {
                const total = delegate.votesFor + delegate.votesAgainst
                const forPct = Math.round((delegate.votesFor / total) * 100)
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[150px]">
                        {delegate.name || formatAddress(delegate.address)}
                      </span>
                      <span className="text-muted-foreground">{forPct}% for</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${forPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Find a Delegate Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find a Delegate
              </CardTitle>
              <CardDescription>
                Search for delegates to delegate your voting power to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by address or voter count..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary">Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Delegates Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Delegates Leaderboard
              </CardTitle>
              <CardDescription>
                Top performing delegates by total delegated amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Delegate</TableHead>
                    <TableHead className="text-right">Total Delegated</TableHead>
                    <TableHead className="text-right">Voters</TableHead>
                    <TableHead className="text-right">Participation</TableHead>
                    <TableHead className="text-right">Alignment</TableHead>
                    <TableHead className="text-right">Proposals</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDelegates.map((delegate) => (
                    <TableRow key={delegate.rank}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
                          {delegate.rank <= 3 ? (
                            <Trophy className={`w-4 h-4 ${
                              delegate.rank === 1 ? "text-yellow-500" :
                              delegate.rank === 2 ? "text-gray-400" :
                              "text-amber-600"
                            }`} />
                          ) : (
                            delegate.rank
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm font-mono">{formatAddress(delegate.address)}</code>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatAmount(delegate.delegatedAmount)} MESH
                      </TableCell>
                      <TableCell className="text-right">{delegate.voters.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={delegate.participationRate >= 95 ? "default" : "secondary"}>
                          {delegate.participationRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">{delegate.alignmentScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{delegate.proposalsVoted}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDelegate(delegate)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delegate Profile Dialog */}
      <Dialog open={!!selectedDelegate} onOpenChange={() => setSelectedDelegate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delegate Profile</DialogTitle>
            <DialogDescription>
              View delegate details and performance metrics
            </DialogDescription>
          </DialogHeader>
          {selectedDelegate && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Delegate Address</p>
                <code className="text-sm font-mono break-all">{selectedDelegate.address}</code>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Delegated</p>
                  <p className="text-xl font-bold">{formatAmount(selectedDelegate.delegatedAmount)}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground">Voters</p>
                  <p className="text-xl font-bold">{selectedDelegate.voters.toLocaleString()}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground">Participation Rate</p>
                  <p className="text-xl font-bold">{selectedDelegate.participationRate}%</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground">Alignment Score</p>
                  <p className="text-xl font-bold text-green-600">{selectedDelegate.alignmentScore}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="secondary" className="flex-1">
                  Delegate to This Address
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}