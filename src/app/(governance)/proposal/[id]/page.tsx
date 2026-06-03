"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { getProposalById, MOCK_VOTES } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { VoteChoice, ProposalStatus } from "@/types"

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
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ASCIIPieChart({ forPercent, againstPercent, abstainPercent }: { forPercent: number; againstPercent: number; abstainPercent: number }) {
  const width = 40
  const height = 20
  const filled = Math.round((forPercent / 100) * width)
  const empty = width - filled

  return (
    <div className="font-mono text-sm">
      <div className="text-center mb-2">Vote Breakdown</div>
      <div className="flex items-center justify-center gap-4">
        <div className="space-y-1">
          <div className="text-green-500">For: {forPercent.toFixed(1)}%</div>
          <div className="h-3 w-full bg-green-500 rounded" style={{ width: `${Math.max(forPercent / 5, 2)}px`, minWidth: "4px" }} />
        </div>
        <div className="space-y-1">
          <div className="text-red-500">Against: {againstPercent.toFixed(1)}%</div>
          <div className="h-3 w-full bg-red-500 rounded" style={{ width: `${Math.max(againstPercent / 5, 2)}px`, minWidth: "4px" }} />
        </div>
        <div className="space-y-1">
          <div className="text-gray-500">Abstain: {abstainPercent.toFixed(1)}%</div>
          <div className="h-3 w-full bg-gray-500 rounded" style={{ width: `${Math.max(abstainPercent / 5, 2)}px`, minWidth: "4px" }} />
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="inline-block border border-border rounded p-2">
          <div className="text-xs text-muted-foreground mb-1">ASCII Bar</div>
          <div className="flex">
            <div className="bg-green-500 h-4 text-center text-xs text-white" style={{ width: `${forPercent}%`, minWidth: filled > 0 ? "2px" : "0" }} />
            <div className="bg-red-500 h-4 text-center text-xs text-white" style={{ width: `${againstPercent}%`, minWidth: "2px" }} />
            <div className="bg-gray-500 h-4 text-center text-xs text-white" style={{ width: `${abstainPercent}%`, minWidth: "2px" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reason, setReason] = React.useState("")
  const [voted, setVoted] = React.useState(false)

  const proposal = getProposalById(params.id as string)

  if (!proposal) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Proposal not found</h1>
          <Button className="mt-4" onClick={() => router.push("/proposals")}>
            Back to Proposals
          </Button>
        </div>
      </div>
    )
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
  const abstainPercent = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0

  const myVotes = MOCK_VOTES.filter((v) => v.proposalId === proposal.id)
  const topVoters = [
    { address: "0xVote1...abcd", choice: "for" as VoteChoice, power: 2500000 },
    { address: "0xVote2...efgh", choice: "for" as VoteChoice, power: 1800000 },
    { address: "0xVote3...ijkl", choice: "against" as VoteChoice, power: 1200000 },
    { address: "0xVote4...mnop", choice: "for" as VoteChoice, power: 900000 },
    { address: "0xVote5...qrst", choice: "abstain" as VoteChoice, power: 600000 },
  ]

  const handleVote = (choice: VoteChoice) => {
    setVoted(true)
    setTimeout(() => {
      alert(`Vote recorded: ${choice}`)
    }, 100)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/proposals")}>
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{proposal.category}</Badge>
            <Badge className={`${statusColors[proposal.status]} text-white`}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{proposal.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>ID: {proposal.id}</span>
            <span>by {proposal.author}</span>
            <span>Created: {formatDate(proposal.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Full Proposal Content */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Motivation</h3>
                <p className="text-muted-foreground">{proposal.content.motivation}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Specification</h3>
                <p className="text-muted-foreground whitespace-pre-line">{proposal.content.specification}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Implementation Plan</h3>
                <p className="text-muted-foreground whitespace-pre-line">{proposal.content.implementationPlan}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Timeline</h3>
                <p className="text-muted-foreground">{proposal.content.timeline}</p>
              </div>
            </CardContent>
          </Card>

          {/* Discussion Thread */}
          {proposal.discussion.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {proposal.discussion.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={entry.choice === "for" ? "default" : entry.choice === "against" ? "destructive" : "secondary"}>
                          {entry.choice.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-mono">{entry.address}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm">{entry.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Vote Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Vote Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ASCIIPieChart
                forPercent={forPercent}
                againstPercent={againstPercent}
                abstainPercent={abstainPercent}
              />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-500/10 rounded">
                  <div className="text-lg font-bold text-green-500">{formatNumber(proposal.votesFor)}</div>
                  <div className="text-xs text-muted-foreground">For</div>
                </div>
                <div className="p-2 bg-red-500/10 rounded">
                  <div className="text-lg font-bold text-red-500">{formatNumber(proposal.votesAgainst)}</div>
                  <div className="text-xs text-muted-foreground">Against</div>
                </div>
                <div className="p-2 bg-gray-500/10 rounded">
                  <div className="text-lg font-bold text-gray-500">{formatNumber(proposal.votesAbstain)}</div>
                  <div className="text-xs text-muted-foreground">Abstain</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Voters */}
          <Card>
            <CardHeader>
              <CardTitle>Top Voters</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {topVoters.map((voter, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{voter.address}</TableCell>
                      <TableCell>
                        <Badge variant={voter.choice === "for" ? "default" : voter.choice === "against" ? "destructive" : "secondary"} className="text-xs">
                          {voter.choice}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(voter.power)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Cast Vote Panel */}
          {proposal.status === "active" && !voted && (
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={() => handleVote("for")}>
                    For
                  </Button>
                  <Button variant="destructive" onClick={() => handleVote("against")}>
                    Against
                  </Button>
                  <Button variant="secondary" onClick={() => handleVote("abstain")}>
                    Abstain
                  </Button>
                </div>
                <Textarea
                  placeholder="Optional: Add reason for your vote..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </CardContent>
            </Card>
          )}

          {voted && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-green-500 font-semibold">Vote Recorded!</div>
              </CardContent>
            </Card>
          )}

          {/* Your Vote History */}
          {myVotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Vote History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {myVotes.map((vote) => (
                      <TableRow key={vote.id}>
                        <TableCell>
                          <Badge variant={vote.choice === "for" ? "default" : vote.choice === "against" ? "destructive" : "secondary"}>
                            {vote.choice}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(vote.timestamp)}</TableCell>
                        <TableCell>{vote.reason || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Execution Plan (if passed) */}
          {proposal.status === "passed" && (
            <Card>
              <CardHeader>
                <CardTitle>Execution Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  This proposal has passed and is awaiting execution. The implementation will be carried out according to the timeline specified above.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voting Power */}
          <Card>
            <CardHeader>
              <CardTitle>Your Voting Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">500,000</div>
              <div className="text-sm text-muted-foreground">MESH Weight</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}