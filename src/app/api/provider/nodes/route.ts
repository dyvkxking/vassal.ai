import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { CreateNodeSchema, ProviderNodeSchema } from '@/lib/schemas/nodes'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'
import type { ProviderNode } from '@/types'

// In-memory store (mutable for development)
let nodesStore: ProviderNode[] = [...MOCK_PROVIDER_NODES]

const HEARTBEAT_STALE_THRESHOLD_MS = 60000 // 60 seconds

// Helper: check if node is stale (offline)
function isNodeStale(node: ProviderNode): boolean {
  return Date.now() - node.lastHeartbeat > HEARTBEAT_STALE_THRESHOLD_MS
}

// Helper: validate hardware
function validateHardware(hardware: { cpuCores: number; gpuModel?: string; gpuMemoryGb?: number; bandwidthMbps: number }): string | null {
  if (hardware.cpuCores <= 0) return 'cpuCores must be positive'
  if (hardware.gpuModel && hardware.gpuMemoryGb !== undefined && hardware.gpuMemoryGb <= 0) {
    return 'gpuMemoryGb must be positive when gpuModel is provided'
  }
  if (hardware.bandwidthMbps <= 0) return 'bandwidthMbps must be positive'
  return null
}

// GET /api/provider/nodes — List nodes with pagination, filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Parse pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Parse filters
  const status = searchParams.get('status')
  const location = searchParams.get('location')
  const minStake = searchParams.get('minStake') ? parseFloat(searchParams.get('minStake')!) : undefined

  // Update stale nodes to offline
  nodesStore = nodesStore.map((node) => {
    if (node.status !== 'offline' && isNodeStale(node)) {
      return { ...node, status: 'offline' as const }
    }
    return node
  })

  // Apply filters
  let filtered = nodesStore.filter((node) => {
    if (status && node.status !== status) return false
    if (location && node.location !== location) return false
    if (minStake !== undefined && node.stakeAmount < minStake) return false
    return true
  })

  // Sort by registeredAt desc
  filtered.sort((a, b) => b.registeredAt - a.registeredAt)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  const response = NextResponse.json(
    { data: paginated, total, page, pageSize, totalPages },
    {
      status: 200,
      headers: {
        'X-Total-Count': String(total),
        'X-Page': String(page),
        'X-Per-Page': String(pageSize),
      },
    }
  )

  return response
}

// POST /api/provider/nodes — Register a new node (provider role required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = CreateNodeSchema.safeParse(body)
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

    // Check role — only 'provider' can register nodes
    const role = request.headers.get('x-role')
    if (role !== 'provider') {
      return NextResponse.json(
        { error: 'Provider role required to register nodes', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Verify operator matches authenticated wallet
    if (data.operator !== walletAddress) {
      return NextResponse.json(
        { error: 'Operator address must match authenticated wallet', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Validate hardware constraints
    const hwError = validateHardware(data.hardware)
    if (hwError) {
      return NextResponse.json(
        { error: hwError, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Create new node
    const newNode: ProviderNode = {
      id: `node-${Date.now()}`,
      operator: data.operator,
      status: 'online',
      stakeAmount: 0,
      lockedStake: 0,
      availableStake: 0,
      hardware: data.hardware,
      location: data.location,
      totalSessions: 0,
      avgUptime: 0,
      earningsTotal: 0,
      earningsPending: 0,
      lastHeartbeat: Date.now(),
      registeredAt: Date.now(),
      isGenesis: false,
    }

    // Validate the created node
    const nodeResult = ProviderNodeSchema.safeParse(newNode)
    if (!nodeResult.success) {
      return NextResponse.json(
        { error: 'Failed to create node', code: 'INTERNAL_ERROR', details: nodeResult.error.flatten() },
        { status: 500 }
      )
    }

    nodesStore.push(newNode)

    return NextResponse.json({ data: nodeResult.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}