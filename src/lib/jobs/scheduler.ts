// Job scheduler - manages periodic and delayed job execution

import type { JobType } from './types'
import { getQueue } from './queue'

// Scheduled task interface
interface ScheduledTask {
  id: string
  type: JobType
  intervalMs: number
  lastRun: number
  nextRun: number
  data?: unknown
  enabled: boolean
}

// Scheduler configuration
interface SchedulerConfig {
  heartbeatIntervalMs: number
  proposalCheckIntervalMs: number
  cleanupIntervalMs: number
  metricsIntervalMs: number
}

const DEFAULT_CONFIG: SchedulerConfig = {
  heartbeatIntervalMs: 30000, // 30 seconds
  proposalCheckIntervalMs: 300000, // 5 minutes
  cleanupIntervalMs: 3600000, // 1 hour
  metricsIntervalMs: 3600000, // 1 hour
}

export class JobScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private intervalIds: Map<string, NodeJS.Timeout> = new Map()
  private config: SchedulerConfig
  private isRunning: boolean = false

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Schedule a one-time job with delay
  scheduleJob<T>(
    type: JobType,
    data: T,
    delayMs: number,
    options?: { priority?: number }
  ): string {
    const queue = getQueue()
    const scheduledAt = Date.now() + delayMs

    const job = queue.enqueue(type, data, {
      priority: options?.priority,
      scheduledAt,
    })

    console.log(`[Scheduler] Scheduled ${type} job ${job.id} for ${new Date(scheduledAt).toISOString()}`)

    return job.id
  }

  // Schedule a recurring job
  scheduleRecurring(
    taskId: string,
    type: JobType,
    intervalMs: number,
    data?: unknown
  ): void {
    if (this.tasks.has(taskId)) {
      console.warn(`[Scheduler] Task ${taskId} already exists, skipping`)
      return
    }

    const now = Date.now()
    const task: ScheduledTask = {
      id: taskId,
      type,
      intervalMs,
      lastRun: 0,
      nextRun: now + intervalMs,
      data,
      enabled: true,
    }

    this.tasks.set(taskId, task)

    // Set up interval for this task
    const intervalId = setInterval(() => {
      this.runTask(taskId)
    }, intervalMs)

    this.intervalIds.set(taskId, intervalId)

    console.log(`[Scheduler] Registered recurring task ${taskId} (${type}) every ${intervalMs}ms`)
  }

  // Run a specific task immediately
  private runTask(taskId: string): void {
    const task = this.tasks.get(taskId)
    if (!task || !task.enabled) return

    const now = Date.now()
    if (now < task.nextRun) return // Not yet time

    const queue = getQueue()

    // Enqueue the job
    queue.enqueue(task.type, task.data || {}, { priority: 0 })

    // Update task timing
    task.lastRun = now
    task.nextRun = now + task.intervalMs

    console.log(`[Scheduler] Executed task ${taskId} (${task.type})`)
  }

  // Run a task immediately (outside its schedule)
  runTaskNow(taskId: string): void {
    if (!this.tasks.has(taskId)) {
      console.warn(`[Scheduler] Task ${taskId} not found`)
      return
    }

    this.runTask(taskId)
  }

  // Cancel a scheduled task
  cancelTask(taskId: string): void {
    const intervalId = this.intervalIds.get(taskId)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervalIds.delete(taskId)
    }
    this.tasks.delete(taskId)

    console.log(`[Scheduler] Cancelled task ${taskId}`)
  }

  // Enable/disable a task
  setTaskEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.enabled = enabled
      console.log(`[Scheduler] Task ${taskId} ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  // Get task status
  getTaskStatus(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId)
  }

  // Get all task statuses
  getAllTaskStatuses(): ScheduledTask[] {
    return Array.from(this.tasks.values())
  }

  // Start the scheduler
  start(): void {
    if (this.isRunning) return
    this.isRunning = true

    // Register default periodic tasks

    // Heartbeat check every 30 seconds
    this.scheduleRecurring(
      'heartbeat-check',
      'NodeHeartbeatCheckJob',
      this.config.heartbeatIntervalMs,
      {}
    )

    // Proposal status check every 5 minutes
    this.scheduleRecurring(
      'proposal-status',
      'ProposalStatusJob',
      this.config.proposalCheckIntervalMs,
      {}
    )

    // Cleanup every hour
    this.scheduleRecurring(
      'cleanup',
      'SessionCleanupJob',
      this.config.cleanupIntervalMs,
      {}
    )

    // Metrics aggregation every hour
    this.scheduleRecurring(
      'metrics',
      'MetricAggregationJob',
      this.config.metricsIntervalMs,
      { period: 'hourly' }
    )

    console.log('[Scheduler] Started with default tasks')
  }

  // Stop the scheduler
  stop(): void {
    // Clear all intervals
    for (const intervalId of this.intervalIds.values()) {
      clearInterval(intervalId)
    }
    this.intervalIds.clear()
    this.tasks.clear()
    this.isRunning = false

    console.log('[Scheduler] Stopped')
  }

  // Check if scheduler is running
  isActive(): boolean {
    return this.isRunning
  }
}

// Singleton instance
let globalScheduler: JobScheduler | null = null

export function getScheduler(): JobScheduler {
  if (!globalScheduler) {
    globalScheduler = new JobScheduler()
  }
  return globalScheduler
}

export function startScheduler(): JobScheduler {
  const scheduler = getScheduler()
  scheduler.start()
  return scheduler
}