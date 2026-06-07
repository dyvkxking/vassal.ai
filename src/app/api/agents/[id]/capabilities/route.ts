import { NextRequest, NextResponse } from 'next/server'
import { getAgentById } from '@/lib/mock-data'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/agents/[id]/capabilities — List agent capabilities
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

  return NextResponse.json(
    {
      data: {
        agentId: agent.id,
        agentName: agent.name,
        capabilities: agent.capabilities,
        totalTpmRequired: agent.capabilities.reduce((sum, cap) => sum + cap.tpmRequired, 0),
      }
    },
    { status: 200 }
  )
}