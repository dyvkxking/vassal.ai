import { NextRequest, NextResponse } from 'next/server'
import { proposalsStore } from '../../route'
import { PROPOSAL_STATUS } from '@/constants'

// GET /api/governance/proposals/[id]/results — Get final results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const proposal = proposalsStore.find((p) => p.id === id)

  if (!proposal) {
    return NextResponse.json(
      { error: 'Proposal not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  const now = Date.now()

  // Calculate total votes
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

  // Check quorum
  const quorumMet = totalVotes >= proposal.quorumRequired

  // Determine if passed
  const passed = proposal.votesFor > proposal.votesAgainst

  // Determine current status
  let status = proposal.status
  if (status === PROPOSAL_STATUS.ACTIVE) {
    if (now > proposal.endTime) {
      // Voting period has ended
      if (quorumMet && passed) {
        status = PROPOSAL_STATUS.PASSED
      } else if (quorumMet && !passed) {
        status = PROPOSAL_STATUS.FAILED
      } else {
        // Quorum not met
        status = PROPOSAL_STATUS.FAILED
      }
    }
  }

  // Check if expired (past end time and not passed/executed)
  if (now > proposal.endTime && status === PROPOSAL_STATUS.ACTIVE) {
    status = PROPOSAL_STATUS.EXPIRED
  }

  const results = {
    proposalId: id,
    status,
    votesFor: proposal.votesFor,
    votesAgainst: proposal.votesAgainst,
    votesAbstain: proposal.votesAbstain,
    totalVotes,
    quorumRequired: proposal.quorumRequired,
    quorumMet,
    passed,
    endTime: proposal.endTime,
    isExpired: now > proposal.endTime,
  }

  return NextResponse.json({ data: results }, { status: 200 })
}
