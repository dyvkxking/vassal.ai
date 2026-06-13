import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transformAgent } from '@/lib/db/transformers'
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

  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        capabilities: true,
        skillDependencies: true,
      },
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: transformAgent(agent) }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// PATCH /api/agents/[id] — Update agent (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  try {
    // Fetch current agent to check ownership
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
 })

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingAgent.creator !== walletAddress) {
      return NextResponse.json(
        { error: 'Only the owner can update this agent', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate update data
    const result = UpdateAgentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const updateData = result.data as Record<string, unknown>

    // Build pricing data separately
    const pricingData: Record<string, unknown> = {}
    if (updateData.pricing) {
      const pricing = updateData.pricing as { type: string; pricePerMinute?: number; pricePerSecond?: number; flatPrice?: number }
      pricingData.pricingType = pricing.type
      if (pricing.type === 'per_minute') {
        pricingData.pricePerMinute = pricing.pricePerMinute
      } else if (pricing.type === 'per_second') {
        pricingData.pricePerSecond = pricing.pricePerSecond
      } else if (pricing.type === 'flat_rate') {
        pricingData.flatPrice = pricing.flatPrice
      }
      delete updateData.pricing
    }

    // Update agent
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        ...updateData,
        ...pricingData,
        updatedAt: new Date(),
      },
      include: {
        capabilities: true,
        skillDependencies: true,
      },
    })

    return NextResponse.json({ data: transformAgent(updatedAgent) }, { status: 200 })
  } catch (error) {
    console.error('Failed to update agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/[id] — Soft delete (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  try {
    // Fetch current agent to check ownership
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingAgent.creator !== walletAddress) {
      return NextResponse.json(
        { error: 'Only the owner can delete this agent', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Soft delete by setting status to archived
    await prisma.agent.update({
      where: { id },
      data: {
        status: 'archived',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      { data: { id, status: 'archived' }, message: 'Agent archived successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
