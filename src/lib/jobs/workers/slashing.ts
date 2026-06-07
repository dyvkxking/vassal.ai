// Slashing worker - calculates and applies slash events for SLA breaches

import type { Job, JobResult, SlashCalculation } from '../types'
import { MOCK_SESSIONS, MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { DEFAULT_LATENCY_THRESHOLD_MS } from '@/constants'

// Latency breach rate (percentage of locked stake to slash)
const LATENCY_BREACH_RATE = 0.05
// TPM breach rate
const TPM_BREACH_RATE = 0.03
// Uptime breach rate
const UPTIME_BREACH_RATE = 0.10

/**
 * Process a slash calculation job
 */
export async function processSlashCalculation(
  sessionId: string
): Promise<{ slash?: SlashCalculation; error?: string }> {
  const session = MOCK_SESSIONS.find((s) => s.id === sessionId)

  if (!session) {
    return { error: `Session not found: ${sessionId}` }
  }

  const node = MOCK_PROVIDER_NODES.find((n) => n.id === session.providerNode)

  if (!node) {
    return { error: `Provider node not found: ${session.providerNode}` }
  }

  // Detect breach type
  const breachType = detectLatencyBreach(session)
    ? 'latency'
    : detectTpmBreach(session)
    ? 'tpm'
    : detectUptimeBreach(node)
    ? 'uptime'
    : 'latency' // default fallback

  // Calculate slash amount
  const breachRate =
    breachType === 'latency'
      ? LATENCY_BREACH_RATE
      : breachType === 'tpm'
      ? TPM_BREACH_RATE
      : UPTIME_BREACH_RATE

  const slashAmount = calculateSlashAmount(node.lockedStake, breachRate)

  const slash: SlashCalculation = {
    sessionId,
    nodeId: node.id,
    breachType,
    lockedStake: node.lockedStake,
    breachRate,
    slashAmount,
    timestamp: Date.now(),
  }

  // In a real implementation, this would:
  // 1. Create a SlashEvent record in the database
  // 2. Debit provider locked_stake
  // 3. Credit protocol treasury
  // 4. Emit on-chain event

  console.log(`[Slashing] Applied ${slashAmount} slash to node ${node.id} for ${breachType} breach`)

  return { slash }
}

/**
 * Calculate the slash amount based on locked stake and breach rate
 */
export function calculateSlashAmount(lockedStake: number, breachRate: number): number {
  return Math.floor(lockedStake * breachRate * 10000) / 10000 // 4 decimal precision
}

/**
 * Detect if a session has a latency breach
 */
export function detectLatencyBreach(session: typeof MOCK_SESSIONS[0]): boolean {
  const threshold = session.slaParams.latencyThresholdMs || DEFAULT_LATENCY_THRESHOLD_MS
  return session.latencyMetrics.avgLatencyMs > threshold
}

/**
 * Detect if a session exceeded TPM cap
 */
export function detectTpmBreach(session: typeof MOCK_SESSIONS[0]): boolean {
  return session.tpmUsed > session.slaParams.tpmCap
}

/**
 * Detect if a node has an uptime breach (heartbeat staleness)
 */
export function detectUptimeBreach(node: typeof MOCK_PROVIDER_NODES[0]): boolean {
  const heartbeatAgeSeconds = (Date.now() - node.lastHeartbeat) / 1000
  // Node is stale if no heartbeat for 60+ seconds
  return heartbeatAgeSeconds > 60
}

/**
 * Job processor for slash calculation jobs
 */
export async function processSlashJob(job: Job<{ sessionId: string }>): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const { sessionId } = job.data
    const result = await processSlashCalculation(sessionId)

    if (result.error) {
      return {
        success: false,
        jobId: job.id,
        type: 'SlashCalculationJob',
        data: job.data,
        error: result.error,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    return {
      success: true,
      jobId: job.id,
      type: 'SlashCalculationJob',
      data: job.data,
      result: result.slash,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'SlashCalculationJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}

/**
 * Check all sessions for SLA breaches and queue slash jobs
 */
export async function checkAllSessionsForBreaches(): Promise<string[]> {
  const breachingSessionIds: string[] = []

  for (const session of MOCK_SESSIONS) {
    if (session.status !== 'active' && session.status !== 'completed') continue

    if (detectLatencyBreach(session) || detectTpmBreach(session)) {
      breachingSessionIds.push(session.id)
    }
  }

  return breachingSessionIds
}

/**
 * Check all nodes for uptime breaches
 */
export async function checkAllNodesForUptimeBreaches(): Promise<string[]> {
  const breachingNodeIds: string[] = []

  for (const node of MOCK_PROVIDER_NODES) {
    if (node.status === 'offline' || node.status === 'maintenance') continue

    if (detectUptimeBreach(node)) {
      breachingNodeIds.push(node.id)
    }
  }

  return breachingNodeIds
}