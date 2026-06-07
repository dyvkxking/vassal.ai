import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { UpdateNodeSchema, ProviderNodeSchema } from '@/lib/schemas/nodes'
import type { ProviderNode } from '@/types'

// In-memory store (mutable for development)
let nodesStore: ProviderNode[] = [...MOCK_PROVIDER_NODES]

const HEARTBEAT_STALE_THRESHOLD_MS = 60000

function isNodeStale(node: ProviderNode): boolean {
  return Date.now() - node.lastHeartbeat > HEARTBEAT_STALE_THRESHOLD_MS
}

// GET /api/provider/nodes/[id] — Get single node
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Update stale nodes to offline
  nodesStore = nodesStore.map((node) => {
    if (node.status !== 'offline' && isNodeStale(node)) {
      return { ...node, status: 'offline' as const }
    }
    return node
  })

  const node = nodesStore.find((n) => n.id === id)

  if (!node) {
    return NextResponse.json(
      { error: 'Node not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: node }, { status: 200 })
}

// PATCH /api/provider/nodes/[id] — Update node (operator only)
export async function PATCH(
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

  // Operator can only modify their own nodes
  if (node.operator !== walletAddress) {
    return NextResponse.json(
      { error: 'You can only modify your own nodes', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()

    const result = UpdateNodeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Validate hardware if provided
    if (data.hardware) {
      if (data.hardware.cpuCores <= 0) {
        return NextResponse.json(
          { error: 'cpuCores must be positive', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
      if (data.hardware.gpuModel && data.hardware.gpuMemoryGb !== undefined && data.hardware.gpuMemoryGb <= 0) {
        return NextResponse.json(
          { error: 'gpuMemoryGb must be positive when gpuModel is provided', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
      if (data.hardware.bandwidthMbps <= 0) {
        return NextResponse.json(
          { error: 'bandwidthMbps must be positive', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
    }

    // Merge updates
    const updatedNode: ProviderNode = {
      ...node,
      ...(data.status && { status: data.status }),
      ...(data.hardware && { hardware: { ...node.hardware, ...data.hardware } }),
      ...(data.location && { location: data.location }),
    }

    // Validate
    const nodeResult = ProviderNodeSchema.safeParse(updatedNode)
    if (!nodeResult.success) {
      return NextResponse.json(
        { error: 'Failed to update node', code: 'INTERNAL_ERROR', details: nodeResult.error.flatten() },
        { status: 500 }
      )
    }

    nodesStore[nodeIndex] = updatedNode

    return NextResponse.json({ data: nodeResult.data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}

// DELETE /api/provider/nodes/[id] — Delete node (operator only)
export async function DELETE(
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

  // Operator can only delete their own nodes
  if (node.operator !== walletAddress) {
    return NextResponse.json(
      { error: 'You can only delete your own nodes', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  nodesStore.splice(nodeIndex, 1)

  return NextResponse.json({ data: { deleted: true, id } }, { status: 200 })
}