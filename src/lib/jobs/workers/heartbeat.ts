// Heartbeat monitor - checks node health and handles online/offline transitions

import type { Job, JobResult, HeartbeatStatus } from '../types'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { HEARTBEAT_INTERVAL_SECONDS } from '@/constants'

// Stale threshold in seconds (60s as per spec)
const STALE_THRESHOLD_SECONDS = 60
// Warning threshold (30s)
const WARNING_THRESHOLD_SECONDS = 30

/**
 * Check if a node is stale (heartbeat > 60s old)
 */
export function isNodeStale(node: typeof MOCK_PROVIDER_NODES[0]): boolean {
  const heartbeatAgeSeconds = (Date.now() - node.lastHeartbeat) / 1000
  return heartbeatAgeSeconds > STALE_THRESHOLD_SECONDS
}

/**
 * Check if a node is in warning state (heartbeat > 30s old)
 */
export function isNodeWarning(node: typeof MOCK_PROVIDER_NODES[0]): boolean {
  const heartbeatAgeSeconds = (Date.now() - node.lastHeartbeat) / 1000
  return heartbeatAgeSeconds > WARNING_THRESHOLD_SECONDS && heartbeatAgeSeconds <= STALE_THRESHOLD_SECONDS
}

/**
 * Get heartbeat status for a node
 */
export function getHeartbeatStatus(node: typeof MOCK_PROVIDER_NODES[0]): HeartbeatStatus {
  const heartbeatAgeSeconds = (Date.now() - node.lastHeartbeat) / 1000

  let status: HeartbeatStatus['status'] = 'online'

  if (node.status === 'maintenance') {
    status = 'maintenance'
  } else if (heartbeatAgeSeconds > STALE_THRESHOLD_SECONDS) {
    status = 'offline'
  } else if (heartbeatAgeSeconds > WARNING_THRESHOLD_SECONDS) {
    status = 'warning'
  }

  return {
    nodeId: node.id,
    lastHeartbeat: node.lastHeartbeat,
    status,
    staleSeconds: Math.max(0, heartbeatAgeSeconds - STALE_THRESHOLD_SECONDS),
    timestamp: Date.now(),
  }
}

/**
 * Check node health - returns true if node is healthy
 */
export async function checkNodeHealth(nodeId: string): Promise<{
  healthy: boolean
  status: HeartbeatStatus
}> {
  const node = MOCK_PROVIDER_NODES.find((n) => n.id === nodeId)

  if (!node) {
    return {
      healthy: false,
      status: {
        nodeId,
        lastHeartbeat: 0,
        status: 'offline',
        staleSeconds: 0,
        timestamp: Date.now(),
      },
    }
  }

  const status = getHeartbeatStatus(node)
  const healthy = status.status === 'online'

  return { healthy, status }
}

/**
 * Mark a node as offline
 */
export async function markNodeOffline(nodeId: string): Promise<{
  success: boolean
  error?: string
}> {
  const nodeIndex = MOCK_PROVIDER_NODES.findIndex((n) => n.id === nodeId)

  if (nodeIndex === -1) {
    return { success: false, error: `Node not found: ${nodeId}` }
  }

  const node = MOCK_PROVIDER_NODES[nodeIndex]

  // Don't mark as offline if already offline or in maintenance
  if (node.status === 'offline' || node.status === 'maintenance') {
    return { success: false, error: 'Node is already offline or in maintenance' }
  }

  // In a real implementation:
  // 1. Update node status in database
  // 2. Lock additional stake as penalty
  // 3. Send notification to provider

  console.log(`[Heartbeat] Node ${nodeId} marked as OFFLINE`)

  return { success: true }
}

/**
 * Mark a node as online (restore on successful heartbeat)
 */
export async function markNodeOnline(nodeId: string): Promise<{
  success: boolean
  error?: string
}> {
  const nodeIndex = MOCK_PROVIDER_NODES.findIndex((n) => n.id === nodeId)

  if (nodeIndex === -1) {
    return { success: false, error: `Node not found: ${nodeId}` }
  }

  const node = MOCK_PROVIDER_NODES[nodeIndex]

  // Don't auto-re-enable if manually set to offline
  // (in real impl, would check a manualOffline flag)
  if (node.status === 'offline' && node.lastHeartbeat < Date.now() - 300000) {
    // 5 min stale
    return { success: false, error: 'Node was manually set offline, requires manual re-enable' }
  }

  // In a real implementation:
  // 1. Update node status in database
  // 2. Release penalty stake
  // 3. Send notification to provider

  console.log(`[Heartbeat] Node ${nodeId} marked as ONLINE`)

  return { success: true }
}

/**
 * Check all nodes and update status based on heartbeats
 */
export async function checkAllNodesHealth(): Promise<{
  online: string[]
  offline: string[]
  warning: string[]
}> {
  const online: string[] = []
  const offline: string[] = []
  const warning: string[] = []

  for (const node of MOCK_PROVIDER_NODES) {
    if (node.status === 'maintenance') continue

    const status = getHeartbeatStatus(node)

    if (status.status === 'online') {
      online.push(node.id)
    } else if (status.status === 'warning') {
      warning.push(node.id)
    } else {
      offline.push(node.id)
    }
  }

  return { online, offline, warning }
}

/**
 * Job processor for heartbeat check jobs
 */
export async function processHeartbeatJob(
  job: Job<{ nodeId: string }>
): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const { nodeId } = job.data
    const { healthy, status } = await checkNodeHealth(nodeId)

    // Auto-mark offline if stale
    if (status.status === 'offline') {
      await markNodeOffline(nodeId)
    }

    return {
      success: true,
      jobId: job.id,
      type: 'NodeHeartbeatCheckJob',
      data: job.data,
      result: { healthy, status },
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'NodeHeartbeatCheckJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}

/**
 * Calculate stake penalty for downtime
 */
export function calculateDowntimePenalty(
  lockedStake: number,
  downtimeSeconds: number
): number {
  // Penalty rate: 1% of locked stake per minute of downtime
  const penaltyPerMinute = lockedStake * 0.01
  const downtimeMinutes = downtimeSeconds / 60
  return Math.min(penaltyPerMinute * downtimeMinutes, lockedStake * 0.5) // Cap at 50%
}