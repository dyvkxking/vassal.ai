// Reward worker - calculates and distributes rewards for sessions

import type { Job, JobResult, SessionReward, RewardDistribution } from '../types'
import { MOCK_SESSIONS, MOCK_AGENTS, MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { PROVIDER_REVENUE_SHARE, PLATFORM_FEE_PERCENT } from '@/constants'

// Provider and protocol revenue shares (must sum to 100%)
const PROVIDER_SHARE = PROVIDER_REVENUE_SHARE / 100 // 30% -> 0.30
const PROTOCOL_SHARE = PLATFORM_FEE_PERCENT / 100 // 10% -> 0.10

/**
 * Calculate the reward for a single session
 */
export function calculateSessionReward(
  session: typeof MOCK_SESSIONS[0],
  agent: typeof MOCK_AGENTS[0]
): SessionReward {
  const pricePerMinute = agent.pricing.pricePerMinute || 0.001

  // Per-session reward = tpmUsed * pricePerMinute / 60
  // (tpmUsed is tokens per minute, so dividing by 60 gives tokens per second)
  const totalReward = (session.tpmUsed * pricePerMinute) / 60

  // Provider share (e.g., 80% of total reward)
  const providerShare = totalReward * (PROVIDER_SHARE / (PROVIDER_SHARE + PROTOCOL_SHARE))

  // Protocol share (e.g., 20% of total reward)
  const protocolShare = totalReward - providerShare

  return {
    sessionId: session.id,
    agentId: agent.id,
    providerNodeId: session.providerNode,
    tpmUsed: session.tpmUsed,
    pricePerMinute,
    totalReward: Math.round(totalReward * 10000) / 10000,
    providerShare: Math.round(providerShare * 10000) / 10000,
    protocolShare: Math.round(protocolShare * 10000) / 10000,
    timestamp: Date.now(),
  }
}

/**
 * Distribute daily rewards - batch process all pending rewards
 */
export async function distributeDailyRewards(): Promise<{
  processed: number
  totalProviderRewards: number
  totalProtocolRewards: number
  rewards: SessionReward[]
}> {
  const rewards: SessionReward[] = []
  let totalProviderRewards = 0
  let totalProtocolRewards = 0

  // Process all completed sessions from the past day
  const oneDayAgo = Date.now() - 86400000

  for (const session of MOCK_SESSIONS) {
    // Only process completed sessions
    if (session.status !== 'completed') continue

    // Only process sessions that ended in the past day
    if (session.endTime && session.endTime < oneDayAgo) continue

    const agent = MOCK_AGENTS.find((a) => a.id === session.agentId)
    if (!agent) continue

    const reward = calculateSessionReward(session, agent)
    rewards.push(reward)
    totalProviderRewards += reward.providerShare
    totalProtocolRewards += reward.protocolShare
  }

  // In a real implementation:
  // 1. Store reward events in database
  // 2. Update provider earnings_total
  // 3. Update user pending balance
  // 4. Mark sessions as rewardDistributed

  console.log(
    `[Rewards] Daily distribution: ${rewards.length} sessions, ` +
    `Provider: ${totalProviderRewards}, Protocol: ${totalProtocolRewards}`
  )

  return {
    processed: rewards.length,
    totalProviderRewards: Math.round(totalProviderRewards * 10000) / 10000,
    totalProtocolRewards: Math.round(totalProtocolRewards * 10000) / 10000,
    rewards,
  }
}

/**
 * Handle reward claim for a specific user and position
 */
export async function claimRewards(
  userAddress: string,
  positionId?: string
): Promise<{
  success: boolean
  distribution?: RewardDistribution
  error?: string
}> {
  // Find provider nodes for this user
  const userNodes = MOCK_PROVIDER_NODES.filter((n) => n.operator === userAddress)

  if (userNodes.length === 0) {
    return { success: false, error: 'No provider nodes found for user' }
  }

  // Filter by position if specified
  const nodesToClaim = positionId
    ? userNodes.filter((n) => n.id === positionId)
    : userNodes

  if (nodesToClaim.length === 0) {
    return { success: false, error: 'Position not found' }
  }

  let totalAmount = 0
  const positions: Array<{ positionId: string; amount: number }> = []

  for (const node of nodesToClaim) {
    // Calculate pending rewards (mock calculation)
    const pendingReward = node.earningsPending

    if (pendingReward > 0) {
      totalAmount += pendingReward
      positions.push({
        positionId: node.id,
        amount: Math.round(pendingReward * 10000) / 10000,
      })
    }
  }

  if (totalAmount === 0) {
    return { success: false, error: 'No pending rewards to claim' }
  }

  const distribution: RewardDistribution = {
    userAddress,
    totalAmount: Math.round(totalAmount * 10000) / 10000,
    positions,
    timestamp: Date.now(),
  }

  // In a real implementation:
  // 1. Atomic transaction to transfer tokens
  // 2. Record transaction hash
  // 3. Mark reward as claimed
  // 4. Update provider earnings_pending

  console.log(
    `[Rewards] Claimed ${distribution.totalAmount} for ${userAddress}, ` +
    `${positions.length} positions`
  )

  return { success: true, distribution }
}

/**
 * Job processor for reward distribution jobs
 */
export async function processRewardJob(
  job: Job<{ userAddress?: string; positionId?: string; batchDate?: string }>
): Promise<JobResult> {
  const startTime = Date.now()

  try {
    // If batchDate is specified, run daily distribution
    if (job.data.batchDate) {
      const result = await distributeDailyRewards()
      return {
        success: true,
        jobId: job.id,
        type: 'RewardDistributionJob',
        data: job.data,
        result,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    // Otherwise, process claim
    const result = await claimRewards(job.data.userAddress || '', job.data.positionId)

    if (!result.success) {
      return {
        success: false,
        jobId: job.id,
        type: 'RewardDistributionJob',
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
      type: 'RewardDistributionJob',
      data: job.data,
      result: result.distribution,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'RewardDistributionJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}

/**
 * Get pending rewards for a user
 */
export function getPendingRewards(userAddress: string): {
  totalPending: number
  positions: Array<{ positionId: string; pending: number }>
} {
  const userNodes = MOCK_PROVIDER_NODES.filter((n) => n.operator === userAddress)

  const positions: Array<{ positionId: string; pending: number }> = []
  let totalPending = 0

  for (const node of userNodes) {
    if (node.earningsPending > 0) {
      positions.push({
        positionId: node.id,
        pending: node.earningsPending,
      })
      totalPending += node.earningsPending
    }
  }

  return {
    totalPending: Math.round(totalPending * 10000) / 10000,
    positions,
  }
}