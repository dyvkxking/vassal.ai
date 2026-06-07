import { NextRequest, NextResponse } from 'next/server'
import { proposalsStore } from '../route'
import { ProposalSchema } from '@/lib/schemas/proposals'

// GET /api/governance/proposals/[id] — Get proposal details
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

  // Validate response data
  const result = ProposalSchema.safeParse(proposal)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Failed to parse proposal', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: result.data }, { status: 200 })
}
