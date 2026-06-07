import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, MOCK_AGENTS } from '@/lib/mock-data'
import { UpdateAgentSchema } from '@/lib/schemas/agents'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/agents/[id] — Get agent by ID
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: agent }, { status: 200 })
}

// PATCH /api/agents/[id] — Update agent (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  // Verify ownership
  if (agent.creator !== walletAddress) {
    return NextResponse.json(
      { error: 'Only the owner can update this agent', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()

    // Validate update data
    const result = UpdateAgentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // Apply update
    const updatedAgent = {
      ...agent,
      ...result.data,
      updatedAt: Date.now(),
    }

    return NextResponse.json({ data: updatedAgent }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}

// DELETE /api/agents/[id] — Soft delete (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  // Verify ownership
  if (agent.creator !== walletAddress) {
    return NextResponse.json(
      { error: 'Only the owner can delete this agent', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // Soft delete by setting status to archived
  const deletedAgent = {
    ...agent,
    status: 'archived' as const,
    updatedAt: Date.now(),
  }

  return NextResponse.json(
    { data: { id: deletedAgent.id, status: 'archived' }, message: 'Agent archived successfully' },
    { status: 200 }
  )
}