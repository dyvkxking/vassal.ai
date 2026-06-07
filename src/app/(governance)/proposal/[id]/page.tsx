'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProposalById } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow, format } from 'date-fns'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Minus,
  Clock,
  Users,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Zap,
} from 'lucide-react'
import type { Proposal, Vote, VoteChoice } from '@/types'

interface ProposalDetailPageProps {
  params: Promise<{ id: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  slash_amounts: 'Slash Amounts',
  sla_thresholds: 'SLA Thresholds',
  protocol_upgrade: 'Protocol Upgrade',
  tokenomics: 'Tokenomics',
  treasury: 'Treasury',
  other: 'Other',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  passed: 'bg-green-500/10 text-green-600 border-green-500/20',
  failed: 'bg-red-500/10 text-red-600 border-red-500/20',
  executed: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  expired: 'bg-muted text-muted-foreground',
}

// Mock discussion data
const MOCK_DISCUSSIONS: Array<{
  id: string
  voter: string
  choice: VoteChoice
  text: string
  votingPower: number
  timestamp: number
}> = [
  {
    id: 'arg-001',
    voter: '0xabc1...def1',
    choice: 'for',
    text: 'This change is necessary to improve service quality. Providers with poor latency should face stronger penalties.',
    votingPower: 150000,
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'arg-002',
    voter: '0xabc2...def2',
    choice: 'against',
    text: '10% is too aggressive. Small network hiccups can cause latency spikes that are outside provider control.',
    votingPower: 80000,
    timestamp: Date.now() - 86400000 * 1.5,
  },
  {
    id: 'arg-003',
    voter: '0xabc3...def3',
    choice: 'for',
    text: 'Clients deserve better guarantees. The current 5% rate does not adequately incentivize reliability.',
    votingPower: 320000,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'arg-004',
    voter: '0xabc4...def4',
    choice: 'against',
    text: 'Consider a graduated approach instead of doubling immediately. Start at 7.5%.',
    votingPower: 210000,
    timestamp: Date.now() - 86400000 * 0.5,
  },
  {
    id: 'arg-005',
    voter: '0xabc5...def5',
    choice: 'abstain',
    text: 'I support the intent but need more data on average latency distributions before taking a position.',
    votingPower: 50000,
    timestamp: Date.now() - 3600000,
  },
]

// Mock voter list - top voters
const MOCK_TOP_VOTERS: Array<{ voter: string; votingPower: number; choice: VoteChoice }> = [
  { voter: '0xvoter...0001', votingPower: 500000, choice: 'for' },
  { voter: '0xvoter...0002', votingPower: 350000, choice: 'for' },
  { voter: '0xvoter...0003', votingPower: 320000, choice: 'for' },
  { voter: '0xvoter...0004', votingPower: 280000, choice: 'against' },
  { voter: '0xvoter...0005', votingPower: 210000, choice: 'against' },
  { voter: '0xvoter...0006', votingPower: 180000, choice: 'abstain' },
  { voter: '0xvoter...0007', votingPower: 150000, choice: 'for' },
  { voter: '0xvoter...0008', votingPower: 120000, choice: 'against' },
]

function formatAddress(addr: string): string {
  if (addr.length > 16) {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }
  return addr
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

function QuorumStatus({ current, required }: { current: number; required: number }) {
  const percentage = calculatePercentage(current, required)
  const reached = current >= required

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Quorum Progress</span>
        <span className={reached ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
          {formatNumber(current)} / {formatNumber(required)} ({percentage}%)
        </span>
      </div>
      <Progress
        value={Math.min(percentage, 100)}
        className="h-2"
      />
      {reached ? (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Quorum reached
        </p>
      ) : (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatNumber(required - current)} more votes needed
        </p>
      )}
    </div>
  )
}

function VoteTally({
  proposal,
  compact = false,
}: {
  proposal: Proposal
  compact?: boolean
}) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const forPct = calculatePercentage(proposal.votesFor, totalVotes)
  const againstPct = calculatePercentage(proposal.votesAgainst, totalVotes)
  const abstainPct = calculatePercentage(proposal.votesAbstain, totalVotes)

  const forBar = Math.round(forPct * 0.3) // 30 chars max for visual bar
  const againstBar = Math.round(againstPct * 0.3)
  const abstainBar = Math.round(abstainPct * 0.3)

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600 font-medium">{forPct}%</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${forPct}%` }}
            />
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${againstPct}%` }}
            />
            <div
              className="h-full bg-muted-foreground/30 transition-all"
              style={{ width: `${abstainPct}%` }}
            />
          </div>
          <span className="text-red-600 font-medium">{againstPct}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Big visual bar */}
      <div className="relative h-12 rounded-lg overflow-hidden flex bg-muted">
        <div
          className="h-full bg-green-500 flex items-center justify-center transition-all"
          style={{ width: `${forPct}%` }}
        >
          {forPct > 10 && (
            <span className="text-white font-bold text-lg drop-shadow-md">
              {forPct}%
            </span>
          )}
        </div>
        <div
          className="h-full bg-red-500 flex items-center justify-center transition-all"
          style={{ width: `${againstPct}%` }}
        >
          {againstPct > 10 && (
            <span className="text-white font-bold text-lg drop-shadow-md">
              {againstPct}%
            </span>
          )}
        </div>
        <div
          className="h-full bg-muted-foreground/30 flex items-center justify-center transition-all"
          style={{ width: `${abstainPct}%` }}
        >
          {abstainPct > 10 && (
            <span className="text-white font-bold text-lg drop-shadow-md">
              {abstainPct}%
            </span>
          )}
        </div>
      </div>

      {/* Vote breakdown legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <ThumbsUp className="h-4 w-4" />
            For
          </div>
          <div className="text-2xl font-bold text-green-600">{formatNumber(proposal.votesFor)}</div>
          <div className="text-sm text-muted-foreground">{forPct}%</div>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <ThumbsDown className="h-4 w-4" />
            Against
          </div>
          <div className="text-2xl font-bold text-red-600">{formatNumber(proposal.votesAgainst)}</div>
          <div className="text-sm text-muted-foreground">{againstPct}%</div>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-muted border border-muted-foreground/20">
          <div className="flex items-center gap-2 text-muted-foreground font-semibold">
            <Minus className="h-4 w-4" />
            Abstain
          </div>
          <div className="text-2xl font-bold text-muted-foreground">{formatNumber(proposal.votesAbstain)}</div>
          <div className="text-sm text-muted-foreground">{abstainPct}%</div>
        </div>
      </div>

      {/* Total votes */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {proposal.totalVoters} total voters
        </span>
        <span>{formatNumber(totalVotes)} total voting power</span>
      </div>

      <Separator />

      {/* Quorum status */}
      <QuorumStatus current={totalVotes} required={proposal.quorumRequired} />
    </div>
  )
}

function VoteBreakdownChart({ proposal }: { proposal: Proposal }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const forPct = calculatePercentage(proposal.votesFor, totalVotes)
  const againstPct = calculatePercentage(proposal.votesAgainst, totalVotes)
  const abstainPct = calculatePercentage(proposal.votesAbstain, totalVotes)

  // Build text-based pie chart (30 chars wide)
  const totalBars = 30
  const forBars = Math.round((forPct / 100) * totalBars)
  const againstBars = Math.round((againstPct / 100) * totalBars)
  const abstainBars = totalBars - forBars - againstBars

  const forBlock = '█'.repeat(forBars)
  const againstBlock = '▒'.repeat(againstBars)
  const abstainBlock = '░'.repeat(abstainBars)

  return (
    <div className="space-y-2">
      <div className="font-medium text-sm text-muted-foreground mb-3">Vote Distribution</div>
      <div className="font-mono text-lg tracking-tight leading-relaxed">
        <span className="text-green-600">{forBlock}</span>
        <span className="text-red-600">{againstBlock}</span>
        <span className="text-muted-foreground/50">{abstainBlock}</span>
      </div>
      <div className="flex gap-4 text-xs">
        <span className="text-green-600 flex items-center gap-1">
          <span className="font-mono">{forBlock.slice(0, 3)}</span> {forPct}% for
        </span>
        <span className="text-red-600 flex items-center gap-1">
          <span className="font-mono">{againstBlock.slice(0, 3)}</span> {againstPct}% against
        </span>
        <span className="text-muted-foreground/50 flex items-center gap-1">
          <span className="font-mono">{abstainBlock.slice(0, 3)}</span> {abstainPct}% abstain
        </span>
      </div>
    </div>
  )
}

function DiscussionThreadItem({
  discussion,
}: {
  discussion: (typeof MOCK_DISCUSSIONS)[0]
}) {
  const choiceConfig = {
    for: { icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-500/10' },
    against: { icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-500/10' },
    abstain: { icon: Minus, color: 'text-muted-foreground', bg: 'bg-muted' },
  }

  const config = choiceConfig[discussion.choice]
  const Icon = config.icon

  return (
    <div className="flex gap-3 p-4 rounded-lg border bg-card">
      <div className={`p-2 rounded-full h-fit ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{formatAddress(discussion.voter)}</span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatNumber(discussion.votingPower)} power</span>
            <span>{formatDistanceToNow(discussion.timestamp, { addSuffix: true })}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{discussion.text}</p>
      </div>
    </div>
  )
}

function CastVotePanel({ proposal }: { proposal: Proposal }) {
  const [selectedVote, setSelectedVote] = useState<VoteChoice | null>(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mock voting power - in real app would come from connected wallet/stake
  const votingPower = 50000

  const handleSubmit = async () => {
    if (!selectedVote) return
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Vote Submitted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your vote of <span className="font-medium capitalize">{selectedVote}</span> has been recorded
            with {formatNumber(votingPower)} voting power.
          </p>
        </CardContent>
      </Card>
    )
  }

  const isActive = proposal.status === 'active'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Cast Your Vote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voting power display */}
        <div className="p-3 rounded-lg bg-muted">
          <div className="text-sm text-muted-foreground">Your Voting Power</div>
          <div className="text-2xl font-bold">{formatNumber(votingPower)}</div>
        </div>

        {/* Vote buttons */}
        {isActive ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedVote === 'for' ? 'default' : 'outline'}
                className={
                  selectedVote === 'for'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'border-green-600 text-green-600 hover:bg-green-600/10'
                }
                onClick={() => setSelectedVote('for')}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                For
              </Button>
              <Button
                variant={selectedVote === 'against' ? 'default' : 'outline'}
                className={
                  selectedVote === 'against'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'border-red-600 text-red-600 hover:bg-red-600/10'
                }
                onClick={() => setSelectedVote('against')}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Against
              </Button>
              <Button
                variant={selectedVote === 'abstain' ? 'default' : 'outline'}
                onClick={() => setSelectedVote('abstain')}
              >
                <Minus className="h-4 w-4 mr-2" />
                Abstain
              </Button>
            </div>

            {/* Optional reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Reason (optional)
              </label>
              <Textarea
                placeholder="Share your reasoning..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit button */}
            <Button
              className="w-full"
              disabled={!selectedVote || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {proposal.status === 'passed'
                ? 'This proposal has passed and voting is closed.'
                : proposal.status === 'failed'
                ? 'This proposal has failed and voting is closed.'
                : 'Voting is not available for this proposal.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function VoterList({ voters }: { voters: typeof MOCK_TOP_VOTERS }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top Voters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {voters.map((v, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                <span className="text-sm font-medium">{formatAddress(v.voter)}</span>
                {v.choice === 'for' && (
                  <Badge variant="outline" className="text-green-600 border-green-600/30 text-xs">
                    For
                  </Badge>
                )}
                {v.choice === 'against' && (
                  <Badge variant="outline" className="text-red-600 border-red-600/30 text-xs">
                    Against
                  </Badge>
                )}
                {v.choice === 'abstain' && (
                  <Badge variant="outline" className="text-muted-foreground text-xs">
                    Abstain
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(v.votingPower)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ExecutionPlan({ plan, proposalId }: { plan: string; proposalId: string }) {
  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Execution Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{plan}</p>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Execution available after:</span>
          <Badge variant="outline" className="font-mono">
            {proposalId}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = await params
  const proposal = getProposalById(id)

  if (!proposal) {
    notFound()
  }

  const isActive = proposal.status === 'active'
  const hasPassed = proposal.status === 'passed'
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

  // Format dates
  const createdDate = format(proposal.createdAt, 'MMM d, yyyy')
  const startDate = format(proposal.startTime, 'MMM d, yyyy')
  const endDate = format(proposal.endTime, 'MMM d, yyyy')
  const timeRemaining = formatDistanceToNow(proposal.endTime, { addSuffix: true })

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/governance/proposals"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>

        {/* Proposal Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs">
                    #{proposal.id}
                  </Badge>
                  <Badge className={STATUS_COLORS[proposal.status]}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </Badge>
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[proposal.category] || proposal.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold leading-tight">
                  {proposal.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span>By {formatAddress(proposal.author)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Created {createdDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Vote Tally - Always visible at top */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vote Tally
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VoteTally proposal={proposal} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{proposal.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Motivation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The current slash rate of 5% for latency breaches has proven insufficient to
                    enforce reliable service quality during peak traffic periods. Analysis of
                    recent network data shows that providers with consistently poor latency are
                    not adequately deterred, resulting in degraded client experience. This proposal
                    seeks to increase the financial incentive for maintaining high performance
                    standards.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Specification</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Modify the slash parameter <code className="px-1 py-0.5 rounded bg-muted text-sm">LATENCY_BREACH_SLASH_RATE</code> from{' '}
                    <code className="px-1 py-0.5 rounded bg-muted text-sm">500</code> (basis points = 5%) to{' '}
                    <code className="px-1 py-0.5 rounded bg-muted text-sm">1000</code> (basis points = 10%). This affects
                    all provider nodes with active SLA commitments.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Implementation Plan</h3>
                  <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                    <li>Smart contract upgrade to update slash rate parameter</li>
                    <li>Migration script to update off-chain configuration</li>
                    <li>48-hour timelock before changes take effect</li>
                    <li>Monitoring period to assess impact on network behavior</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If passed, execution will occur within 7 days. The upgrade requires a 48-hour
                    timelock period after governance approval before parameters change.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Discussion Thread */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Arguments</TabsTrigger>
                    <TabsTrigger value="for" className="text-green-600">
                      For ({MOCK_DISCUSSIONS.filter((d) => d.choice === 'for').length})
                    </TabsTrigger>
                    <TabsTrigger value="against" className="text-red-600">
                      Against ({MOCK_DISCUSSIONS.filter((d) => d.choice === 'against').length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    {MOCK_DISCUSSIONS.map((d) => (
                      <DiscussionThreadItem key={d.id} discussion={d} />
                    ))}
                  </TabsContent>
                  <TabsContent value="for" className="space-y-4">
                    {MOCK_DISCUSSIONS.filter((d) => d.choice === 'for').map((d) => (
                      <DiscussionThreadItem key={d.id} discussion={d} />
                    ))}
                  </TabsContent>
                  <TabsContent value="against" className="space-y-4">
                    {MOCK_DISCUSSIONS.filter((d) => d.choice === 'against').map((d) => (
                      <DiscussionThreadItem key={d.id} discussion={d} />
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Cast Vote Panel */}
            <CastVotePanel proposal={proposal} />

            {/* Vote Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vote Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <VoteBreakdownChart proposal={proposal} />
              </CardContent>
            </Card>

            {/* Top Voters */}
            <VoterList voters={MOCK_TOP_VOTERS} />

            {/* Execution Plan - shown if passed */}
            {hasPassed && proposal.executionPlan && (
              <ExecutionPlan plan={proposal.executionPlan} proposalId={proposal.id} />
            )}

            {/* Voting Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voting Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span>{startDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span>{endDate}</span>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Ends {timeRemaining}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}