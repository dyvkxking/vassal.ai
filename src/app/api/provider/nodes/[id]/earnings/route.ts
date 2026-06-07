import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import type { ProviderNode } from '@/types'

// In-memory store (mutable for development)
let nodesStore: ProviderNode[] = [...MOCK_PROVIDER_NODES]

// GET /api/provider/nodes/[id]/earnings — Get node earnings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const node = nodesStore.find((n) => n.id === id)

  if (!node) {
    return NextResponse.json(
      { error: 'Node not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Return earnings breakdown
  return NextResponse.json({
    data: {
      nodeId: id,
      earningsTotal: node.earningsTotal,
      earningsPending: node.earningsPending,
      earningsPaid: node.earningsTotal - node.earningsPending,
      stakeAmount: node.stakeAmount,
      lockedStake: node.lockedStake,
      availableStake: node.availableStake,
    }
  }, { status: 200 })
}