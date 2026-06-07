import { NextRequest, NextResponse } from 'next/server'
import { getAgentById } from '@/lib/mock-data'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/agents/[id]/stats — Get agent usage statistics
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

  // Return usage statistics
  return NextResponse.json(
    {
      data: {
        agentId: agent.id,
        agentName: agent.name,
        totalSessions: agent.totalSessions,
        avgRating: agent.avgRating,
        qualityScore: agent.qualityScore,
        status: agent.status,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
        uptimeGuarantee: agent.slaParams.uptimeGuaranteePercent,
        tpmCap: agent.slaParams.tpmCap,
        latencyThreshold: agent.slaParams.latencyThresholdMs,
      }
    },
    { status: 200 }
  )
}