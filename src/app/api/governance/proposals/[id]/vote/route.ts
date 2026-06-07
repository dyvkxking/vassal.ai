import { NextRequest, NextResponse } from 'next/server'
import { proposalsStore } from '../../route'
import { votesStore } from '../votes/route'
import { CastVoteSchema } from '@/lib/schemas/proposals'
import { MOCK_STAKE_POSITIONS } from '@/lib/mock-data'

const MIN_STAKE_TO_VOTE = 100 // Minimum stake required to vote

// POST /api/governance/proposals/[id]/vote — Cast a vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Find proposal
    const proposal = proposalsStore.find((p) => p.id === id)
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check if voting period is active
    const now = Date.now()
    if (now < proposal.startTime) {
      return NextResponse.json(
        { error: 'Voting has not started yet', code: 'VOTING_NOT_STARTED' },
        { status: 400 }
      )
    }
    if (now > proposal.endTime) {
      return NextResponse.json(
        { error: 'Voting has ended', code: 'VOTING_ENDED' },
        { status: 400 }
      )
    }

    // Parse and validate vote
    const body = await request.json()
    const result = CastVoteSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { choice } = result.data

    // Check minimum stake (using mock stake positions)
    const stakePosition = MOCK_STAKE_POSITIONS.find((s) => s.owner === walletAddress)
    const totalStake = stakePosition?.amount || 0
    if (totalStake < MIN_STAKE_TO_VOTE) {
      return NextResponse.json(
        { error: `Minimum stake of ${MIN_STAKE_TO_VOTE} required to vote`, code: 'INSUFFICIENT_STAKE' },
        { status: 403 }
      )
    }

    // Check for existing vote
    const existingVote = votesStore.find(
      (v) => v.proposalId === id && v.voter === walletAddress
    )
    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this proposal', code: 'ALREADY_VOTED' },
        { status: 400 }
      )
    }

    // Calculate vote weight (proportional to stake)
    const votingPower = totalStake

    // Create vote
    const vote = {
      id: `vote-${Date.now()}`,
      proposalId: id,
      voter: walletAddress,
      choice,
      votingPower,
      timestamp: now,
    }

    // Update proposal vote counts
    if (choice === 'for') {
      proposal.votesFor += votingPower
    } else if (choice === 'against') {
      proposal.votesAgainst += votingPower
    } else {
      proposal.votesAbstain += votingPower
    }
    proposal.totalVoters += 1

    // Add to votes store
    votesStore.push(vote)

    return NextResponse.json(
      {
        data: {
          vote,
          proposal: {
            votesFor: proposal.votesFor,
            votesAgainst: proposal.votesAgainst,
            votesAbstain: proposal.votesAbstain,
            totalVoters: proposal.totalVoters,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}
