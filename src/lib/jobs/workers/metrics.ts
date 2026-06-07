// Metric aggregation worker - aggregates hourly/daily/weekly stats

import type { Job, JobResult, AggregatedMetrics } from '../types'
import { MOCK_SESSIONS, MOCK_AGENTS, MOCK_PROVIDER_NODES } from '@/lib/mock-data'

/**
 * Aggregate metrics for a specific period
 */
export async function aggregateMetrics(
  period: 'hourly' | 'daily' | 'weekly',
  date?: string
): Promise<AggregatedMetrics> {
  const now = Date.now()
  let startTime: number
  let endTime: number

  // Calculate time range based on period
  if (period === 'hourly') {
    const hourStart = new Date(now)
    hourStart.setMinutes(0, 0, 0)
    startTime = hourStart.getTime()
    endTime = startTime + 3600000
  } else if (period === 'daily') {
    const dayStart = new Date(now)
    dayStart.setHours(0, 0, 0, 0)
    startTime = dayStart.getTime()
    endTime = startTime + 86400000
  } else {
    // weekly
    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    startTime = weekStart.getTime()
    endTime = startTime + 7 * 86400000
  }

  // Override with specific date if provided
  if (date) {
    const dateObj = new Date(date)
    if (period === 'hourly') {
      dateObj.setMinutes(0, 0, 0)
      startTime = dateObj.getTime()
      endTime = startTime + 3600000
    } else if (period === 'daily') {
      dateObj.setHours(0, 0, 0, 0)
      startTime = dateObj.getTime()
      endTime = startTime + 86400000
    }
  }

  // Calculate metrics from sessions
  let totalSessions = 0
  let totalCost = 0
  const uniqueAgents = new Set<string>()
  const uniqueProviders = new Set<string>()

  for (const session of MOCK_SESSIONS) {
    // Check if session falls within period
    const sessionTime = session.endTime || session.startTime
    if (sessionTime < startTime || sessionTime >= endTime) continue
    if (session.status !== 'completed') continue

    totalSessions++
    totalCost += session.totalCost
    uniqueAgents.add(session.agentId)
    uniqueProviders.add(session.providerNode)
  }

  // Calculate earnings
  const providerEarnings = totalCost * 0.8 // 80% to providers
  const protocolEarnings = totalCost * 0.1 // 10% to protocol

  const metrics: AggregatedMetrics = {
    period,
    startTime,
    endTime,
    totalSessions,
    totalCost: Math.round(totalCost * 10000) / 10000,
    providerEarnings: Math.round(providerEarnings * 10000) / 10000,
    protocolEarnings: Math.round(protocolEarnings * 10000) / 10000,
    uniqueAgents: uniqueAgents.size,
    uniqueProviders: uniqueProviders.size,
    timestamp: now,
  }

  // In real implementation:
  // 1. Store in daily_metrics table
  // 2. Prune metrics older than 90 days

  console.log(
    `[Metrics] Aggregated ${period} metrics: ${totalSessions} sessions, ` +
    `cost: ${metrics.totalCost}, providers: ${metrics.providerEarnings}`
  )

  return metrics
}

/**
 * Generate weekly digest metrics
 */
export async function generateWeeklyDigest(): Promise<{
  topAgents: Array<{ agentId: string; sessions: number }>
  topProviders: Array<{ providerId: string; earnings: number }>
  proposalParticipation: number
}> {
  const weekAgo = Date.now() - 7 * 86400000

  // Count sessions per agent
  const agentSessions = new Map<string, number>()
  for (const session of MOCK_SESSIONS) {
    if (session.startTime < weekAgo) continue
    if (session.status !== 'completed') continue

    const count = agentSessions.get(session.agentId) || 0
    agentSessions.set(session.agentId, count + 1)
  }

  // Sort and get top agents
  const topAgents = Array.from(agentSessions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([agentId, sessions]) => ({ agentId, sessions }))

  // Count earnings per provider
  const providerEarnings = new Map<string, number>()
  for (const session of MOCK_SESSIONS) {
    if (session.startTime < weekAgo) continue
    if (session.status !== 'completed') continue

    const node = MOCK_PROVIDER_NODES.find((n) => n.id === session.providerNode)
    if (node) {
      const earnings = providerEarnings.get(node.id) || 0
      providerEarnings.set(node.id, earnings + session.totalCost * 0.8)
    }
  }

  // Sort and get top providers
  const topProviders = Array.from(providerEarnings.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([providerId, earnings]) => ({ providerId, earnings: Math.round(earnings * 10000) / 10000 }))

  // Calculate proposal participation
  const proposalParticipation = 0 // In real impl: count unique voters

  console.log(
    `[Metrics] Weekly digest: ${topAgents.length} top agents, ` +
    `${topProviders.length} top providers`
  )

  return {
    topAgents,
    topProviders,
    proposalParticipation,
  }
}

/**
 * Job processor for metric aggregation jobs
 */
export async function processMetricAggregationJob(
  job: Job<{ period: 'hourly' | 'daily' | 'weekly'; date?: string }>
): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const { period, date } = job.data

    if (period === 'weekly') {
      // Weekly also includes digest generation
      const [metrics, digest] = await Promise.all([
        aggregateMetrics(period, date),
        generateWeeklyDigest(),
      ])

      return {
        success: true,
        jobId: job.id,
        type: 'MetricAggregationJob',
        data: job.data,
        result: { metrics, digest },
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    const metrics = await aggregateMetrics(period, date)

    return {
      success: true,
      jobId: job.id,
      type: 'MetricAggregationJob',
      data: job.data,
      result: metrics,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'MetricAggregationJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}