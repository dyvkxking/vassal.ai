import { NextRequest, NextResponse } from 'next/server'
import { proposalsStore } from '../../route'
import { VoteSchema } from '@/lib/schemas/proposals'

// In-memory vote store
const votesStore: Array<{
  id: string
  proposalId: string
  voter: string
  choice: 'for' | 'against' | 'abstain'
  votingPower: number
  timestamp: number
}> = []

// GET /api/governance/proposals/[id]/votes — Get vote breakdown
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

  // Get all votes for this proposal
  const proposalVotes = votesStore.filter((v) => v.proposalId === id)

  // Validate votes
  const validatedVotes = proposalVotes.map((vote) => {
    const result = VoteSchema.safeParse(vote)
    return result.success ? result.data : null
  }).filter(Boolean)

  // Calculate breakdown
  const breakdown = {
    for: proposalVotes.filter((v) => v.choice === 'for').reduce((sum, v) => sum + v.votingPower, 0),
    against: proposalVotes.filter((v) => v.choice === 'against').reduce((sum, v) => sum + v.votingPower, 0),
    abstain: proposalVotes.filter((v) => v.choice === 'abstain').reduce((sum, v) => sum + v.votingPower, 0),
  }

  return NextResponse.json(
    {
      data: {
        votes: validatedVotes,
        breakdown,
        totalVoters: validatedVotes.length,
      },
    },
    { status: 200 }
  )
}

// Export store for use by vote route
export { votesStore }
