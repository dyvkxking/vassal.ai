import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROPOSALS } from '@/lib/mock-data'
import { CreateProposalSchema, ProposalSchema } from '@/lib/schemas/proposals'
import { ProposalFiltersSchema } from '@/lib/schemas/api'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX, PROPOSAL_STATUS } from '@/constants'

// In-memory store for proposals (mutable for voting)
const proposalsStore = [...MOCK_PROPOSALS]

// GET /api/governance/proposals — List proposals with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filters
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const author = searchParams.get('author')

  // Apply filters
  let filtered = [...proposalsStore]

  if (status) {
    filtered = filtered.filter((p) => p.status === status)
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (author) {
    filtered = filtered.filter((p) => p.author === author)
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => b.createdAt - a.createdAt)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  // Validate response data
  const validated = paginated.map((proposal) => {
    const result = ProposalSchema.safeParse(proposal)
    if (!result.success) {
      return null
    }
    return result.data
  }).filter(Boolean)

  return NextResponse.json(
    { data: validated, total, page, pageSize, totalPages },
    {
      status: 200,
      headers: {
        'X-Total-Count': String(total),
        'X-Page': String(page),
        'X-Per-Page': String(pageSize),
      },
    }
  )
}

// POST /api/governance/proposals — Create proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = CreateProposalSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Create new proposal
    const now = Date.now()
    const newProposal = {
      id: `prop-${Date.now()}`,
      author: walletAddress,
      title: data.title,
      description: data.description,
      category: data.category,
      status: PROPOSAL_STATUS.DRAFT,
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      totalVoters: 0,
      quorumRequired: 0.1, // 10% quorum default
      startTime: now + 86400000, // Start in 24 hours
      endTime: now + 86400000 * 7, // End in 7 days
      executionPlan: data.executionPlan,
      createdAt: now,
    }

    // Validate the created proposal
    const proposalResult = ProposalSchema.safeParse(newProposal)
    if (!proposalResult.success) {
      return NextResponse.json(
        { error: 'Failed to create proposal', code: 'INTERNAL_ERROR', details: proposalResult.error.flatten() },
        { status: 500 }
      )
    }

    // Add to store
    proposalsStore.push(proposalResult.data)

    return NextResponse.json({ data: proposalResult.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}

// Export store for use by other routes
export { proposalsStore }
