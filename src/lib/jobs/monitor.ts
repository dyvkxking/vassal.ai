// Job monitoring - provides metrics and visibility into job processing

import type { JobType, JobResult } from './types'
import { getQueue } from './queue'
import { getScheduler } from './scheduler'

// Monitoring metrics
export interface QueueStats {
  queued: number
  processing: number
  completed: number
  failed: number
  totalProcessed: number
  depth: number
  isRunning: boolean
}

export interface JobHistoryEntry {
  jobId: string
  type: JobType
  success: boolean
  durationMs: number
  timestamp: number
  error?: string
}

export interface MonitorMetrics {
  queue: QueueStats
  jobsPerHour: number
  averageDurationMs: number
  failureRate: number
  byType: Record<JobType, {
    count: number
    successRate: number
    avgDurationMs: number
  }>
}

/**
 * Get queue statistics
 */
export function getQueueStats(): QueueStats {
  const queue = getQueue()
  const stats = queue.getStats()

  return {
    queued: stats.queued,
    processing: stats.processing,
    completed: stats.completed,
    failed: stats.failed,
    totalProcessed: stats.totalProcessed,
    depth: queue.getDepth(),
    isRunning: queue.isActive(),
  }
}

/**
 * Get job history for a specific job type
 */
export function getJobHistory(type?: JobType, limit: number = 100): JobHistoryEntry[] {
  const queue = getQueue()
  const history = queue.getHistory(limit * 2) // Get extra in case we need to filter

  let filtered = history
  if (type) {
    filtered = history.filter((h) => h.type === type)
  }

  return filtered.slice(-limit).map((h) => ({
    jobId: h.jobId,
    type: h.type,
    success: h.success,
    durationMs: h.durationMs,
    timestamp: h.timestamp,
    error: h.error,
  }))
}

/**
 * Get failed jobs
 */
export function getFailedJobs(limit?: number): JobResult[] {
  const queue = getQueue()
  return queue.getFailedJobs(limit)
}

/**
 * Get scheduler task statuses
 */
export function getScheduledTasks(): Array<{
  id: string
  type: JobType
  intervalMs: number
  lastRun: number
  nextRun: number
  enabled: boolean
}> {
  const scheduler = getScheduler()
  return scheduler.getAllTaskStatuses().map((task) => ({
    id: task.id,
    type: task.type,
    intervalMs: task.intervalMs,
    lastRun: task.lastRun,
    nextRun: task.nextRun,
    enabled: task.enabled,
  }))
}

/**
 * Calculate comprehensive monitoring metrics
 */
export function getMonitorMetrics(): MonitorMetrics {
  const queue = getQueue()
  const history = queue.getHistory(1000)

  // Calculate jobs per hour (last hour only)
  const oneHourAgo = Date.now() - 3600000
  const recentJobs = history.filter((h) => h.timestamp > oneHourAgo)

  const jobsPerHour = recentJobs.length

  // Calculate average duration
  const totalDuration = history.reduce((sum, h) => sum + h.durationMs, 0)
  const averageDurationMs = history.length > 0 ? totalDuration / history.length : 0

  // Calculate failure rate
  const recentFailures = recentJobs.filter((h) => !h.success).length
  const failureRate = recentJobs.length > 0 ? recentFailures / recentJobs.length : 0

  // Calculate per-type metrics
  const byType: MonitorMetrics['byType'] = {
    SlashCalculationJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    RewardDistributionJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    NodeHeartbeatCheckJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    SessionCleanupJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    ProposalStatusJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    NotificationDispatchJob: { count: 0, successRate: 0, avgDurationMs: 0 },
    MetricAggregationJob: { count: 0, successRate: 0, avgDurationMs: 0 },
  }

  for (const job of history) {
    const typeStats = byType[job.type]
    typeStats.count++
    typeStats.avgDurationMs =
      (typeStats.avgDurationMs * (typeStats.count - 1) + job.durationMs) / typeStats.count
  }

  // Calculate success rates per type
  for (const type of Object.keys(byType) as JobType[]) {
    const typeJobs = history.filter((h) => h.type === type)
    const successful = typeJobs.filter((h) => h.success).length
    byType[type].successRate = typeJobs.length > 0 ? successful / typeJobs.length : 0
  }

  return {
    queue: getQueueStats(),
    jobsPerHour,
    averageDurationMs: Math.round(averageDurationMs),
    failureRate: Math.round(failureRate * 10000) / 10000,
    byType,
  }
}

/**
 * Check if alerts should fire
 */
export function checkAlerts(): Array<{
  alert: string
  severity: 'warning' | 'critical'
}> {
  const alerts: Array<{ alert: string; severity: 'warning' | 'critical' }> = []
  const metrics = getMonitorMetrics()

  // Alert if failure rate > 5%
  if (metrics.failureRate > 0.05) {
    alerts.push({
      alert: `High job failure rate: ${(metrics.failureRate * 100).toFixed(2)}%`,
      severity: 'critical',
    })
  }

  // Alert if queue depth > 1000
  if (metrics.queue.depth > 1000) {
    alerts.push({
      alert: `Queue depth exceeded 1000: ${metrics.queue.depth}`,
      severity: 'critical',
    })
  }

  // Alert if average job duration > 30 seconds
  if (metrics.averageDurationMs > 30000) {
    alerts.push({
      alert: `High average job duration: ${(metrics.averageDurationMs / 1000).toFixed(2)}s`,
      severity: 'warning',
    })
  }

  // Alert if failed jobs in history > 10
  const failedJobs = getFailedJobs()
  if (failedJobs.length > 10) {
    alerts.push({
      alert: `Dead letter queue growing: ${failedJobs.length} failed jobs`,
      severity: 'warning',
    })
  }

  return alerts
}

/**
 * Format metrics for display
 */
export function formatMetrics(): string {
  const metrics = getMonitorMetrics()
  const lines: string[] = []

  lines.push('=== Job Queue Metrics ===')
  lines.push(`Queue Depth: ${metrics.queue.depth}`)
  lines.push(`Processing: ${metrics.queue.processing}`)
  lines.push(`Completed: ${metrics.queue.completed}`)
  lines.push(`Failed: ${metrics.queue.failed}`)
  lines.push(`Jobs/Hour: ${metrics.jobsPerHour}`)
  lines.push(`Avg Duration: ${(metrics.averageDurationMs / 1000).toFixed(2)}s`)
  lines.push(`Failure Rate: ${(metrics.failureRate * 100).toFixed(2)}%`)
  lines.push('')
  lines.push('=== By Job Type ===')

  for (const [type, stats] of Object.entries(metrics.byType)) {
    if (stats.count > 0) {
      lines.push(
        `${type}: ${stats.count} jobs, ` +
        `${(stats.successRate * 100).toFixed(1)}% success, ` +
        `${(stats.avgDurationMs / 1000).toFixed(2)}s avg`
      )
    }
  }

  return lines.join('\n')
}