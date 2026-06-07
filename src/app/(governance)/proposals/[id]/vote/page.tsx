'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProposalById } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow, format } from 'date-fns'
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
  Zap,
  AlertCircle,
  Check,
  Wallet,
  Share2,
  CheckCircle2,
} from 'lucide-react'
import type { VoteChoice } from '@/types'

interface VotePageProps {
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

export default async function VoteConfirmationPage({ params }: VotePageProps) {
  const { id } = await params
  const proposal = getProposalById(id)

  if (!proposal) {
    notFound()
  }

  const isActive = proposal.status === 'active'
  const createdDate = format(proposal.createdAt, 'MMM d, yyyy')
  const startDate = format(proposal.startTime, 'MMM d, yyyy')
  const endDate = format(proposal.endTime, 'MMM d, yyyy')
  const timeRemaining = formatDistanceToNow(proposal.endTime, { addSuffix: true })

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href={`/proposal/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposal
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Confirm Your Vote</h1>
          <p className="text-muted-foreground text-sm">
            Review the proposal and cast your vote
          </p>
        </div>

        {/* Proposal Summary Card */}
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
                <CardTitle className="text-xl font-bold leading-tight">
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
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {proposal.description}
              </p>
            </div>

            <Separator />

            {/* Vote Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <ThumbsUp className="h-4 w-4" />
                  For
                </div>
                <div className="text-xl font-bold text-green-600">{formatNumber(proposal.votesFor)}</div>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <ThumbsDown className="h-4 w-4" />
                  Against
                </div>
                <div className="text-xl font-bold text-red-600">{formatNumber(proposal.votesAgainst)}</div>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted border border-muted-foreground/20">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Minus className="h-4 w-4" />
                  Abstain
                </div>
                <div className="text-xl font-bold text-muted-foreground">{formatNumber(proposal.votesAbstain)}</div>
              </div>
            </div>

            <Separator />

            {/* Voting Period */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Voting ends {timeRemaining}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{startDate} - {endDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vote Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Cast Your Vote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isActive ? (
              <>
                {/* Vote Selection */}
                <div className="space-y-3">
                  <Label className="text-base">Your Vote</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="vote" value="for" className="sr-only peer" />
                      <div className="p-4 rounded-lg border-2 border-green-600 bg-green-600/5 hover:bg-green-600/10 transition-colors peer-checked:border-green-600 peer-checked:bg-green-600/10 text-center">
                        <ThumbsUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="font-medium text-green-600">For</div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="vote" value="against" className="sr-only peer" />
                      <div className="p-4 rounded-lg border-2 border-red-600 bg-red-600/5 hover:bg-red-600/10 transition-colors peer-checked:border-red-600 peer-checked:bg-red-600/10 text-center">
                        <ThumbsDown className="h-6 w-6 mx-auto mb-2 text-red-600" />
                        <div className="font-medium text-red-600">Against</div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="vote" value="abstain" className="sr-only peer" />
                      <div className="p-4 rounded-lg border-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors peer-checked:border-muted-foreground peer-checked:bg-muted text-center">
                        <Minus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <div className="font-medium text-muted-foreground">Abstain</div>
                      </div>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Reason/Notes */}
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-base flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Reason / Notes (optional)
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Share your reasoning or notes for voting this way..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your reason will be visible in the discussion thread.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium mb-1">Voting Closed</p>
                <p className="text-sm">
                  {proposal.status === 'passed'
                    ? 'This proposal has passed. Voting is no longer available.'
                    : proposal.status === 'failed'
                    ? 'This proposal has failed. Voting is no longer available.'
                    : 'Voting is not available for this proposal.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voting Power Explanation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Voting Power
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* MESH Weight */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="text-sm text-muted-foreground mb-1">Your MESH Weight</div>
              <div className="text-3xl font-bold text-yellow-600">50,000</div>
              <div className="text-xs text-muted-foreground mt-1">MESH</div>
            </div>

            {/* Delegation Info */}
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Delegated from</span>
                <Badge variant="outline" className="font-mono text-xs">
                  None
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delegation impact</span>
                <span className="text-sm font-medium text-blue-600">+0</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Your voting power is determined by your MESH token holdings at the time of vote.
                Any tokens delegated to you add to your effective voting power.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        {isActive && (
          <div className="space-y-4">
            <Button className="w-full" size="lg">
              <Check className="h-4 w-4 mr-2" />
              Confirm Vote
            </Button>

            {/* Transaction Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>You will be asked to confirm a transaction to record your vote on-chain.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}