import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { HeartbeatSchema } from '@/lib/schemas/nodes'
import type { ProviderNode } from '@/types'

// In-memory store (mutable for development)
let nodesStore: ProviderNode[] = [...MOCK_PROVIDER_NODES]

const HEARTBEAT_STALE_THRESHOLD_MS = 60000

function isNodeStale(node: ProviderNode): boolean {
  return Date.now() - node.lastHeartbeat > HEARTBEAT_STALE_THRESHOLD_MS
}

// POST /api/provider/nodes/[id]/heartbeat — Send heartbeat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

  const nodeIndex = nodesStore.findIndex((n) => n.id === id)

  if (nodeIndex === -1) {
    return NextResponse.json(
      { error: 'Node not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  const node = nodesStore[nodeIndex]

  // Only the operator of this node can send heartbeats
  if (node.operator !== walletAddress) {
    return NextResponse.json(
      { error: 'You can only send heartbeats for your own nodes', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()

    const result = HeartbeatSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check for stale status and restore to online if needed
    const wasStale = isNodeStale(node)
    const previousStatus = node.status

    const updatedNode: ProviderNode = {
      ...node,
      lastHeartbeat: data.timestamp,
      status: wasStale ? 'online' : node.status === 'offline' ? 'online' : node.status,
    }

    nodesStore[nodeIndex] = updatedNode

    return NextResponse.json({
      data: {
        nodeId: id,
        timestamp: data.timestamp,
        status: updatedNode.status,
        previousStatus: wasStale ? previousStatus : undefined,
        restored: wasStale,
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}