// In-memory job queue for background job processing

import type {
  Job,
  JobType,
  JobResult,
  QueueConfig,
  JobProcessor,
} from './types'

// Default queue configuration
const DEFAULT_CONFIG: QueueConfig = {
  concurrency: 5,
  defaultMaxRetries: 3,
  defaultPriority: 0,
  jobTimeoutMs: 60000,
}

// Queue statistics
interface QueueStats {
  queued: number
  processing: number
  completed: number
  failed: number
  totalProcessed: number
}

export class JobQueue {
  private queue: Job[] = []
  private processing: Set<string> = new Set()
  private results: JobResult[] = []
  private config: QueueConfig
  private processors: Map<JobType, JobProcessor> = new Map()
  private isRunning: boolean = false
  private processInterval: NodeJS.Timeout | null = null
  private stats: QueueStats = {
    queued: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalProcessed: 0,
  }

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Register a job processor for a specific job type
  registerProcessor(type: JobType, processor: (job: Job) => Promise<JobResult>): void {
    this.processors.set(type, processor as JobProcessor)
  }

  // Generate a unique job ID
  private generateJobId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Add a job to the queue
  enqueue<T>(type: JobType, data: T, options?: {
    priority?: number
    maxRetries?: number
    scheduledAt?: number
  }): Job<T> {
    const job: Job<T> = {
      id: this.generateJobId(),
      type,
      data,
      priority: options?.priority ?? this.config.defaultPriority,
      retries: 0,
      maxRetries: options?.maxRetries ?? this.config.defaultMaxRetries,
      createdAt: Date.now(),
      scheduledAt: options?.scheduledAt,
    }

    // Insert job based on priority (higher priority first)
    const insertIndex = this.queue.findIndex((j) => j.priority < job.priority)
    if (insertIndex === -1) {
      this.queue.push(job)
    } else {
      this.queue.splice(insertIndex, 0, job)
    }

    this.stats.queued = this.queue.length
    return job
  }

  // Get the next job to process
  private dequeue(): Job | undefined {
    const now = Date.now()

    // Find the next job that's due (scheduledAt <= now or no scheduling)
    for (let i = 0; i < this.queue.length; i++) {
      const job = this.queue[i]
      if (!job.scheduledAt || job.scheduledAt <= now) {
        this.queue.splice(i, 1)
        return job
      }
    }

    return undefined
  }

  // Process a single job
  private async processJob(job: Job): Promise<JobResult> {
    const startTime = Date.now()
    const processor = this.processors.get(job.type)

    if (!processor) {
      return {
        success: false,
        jobId: job.id,
        type: job.type,
        data: job.data,
        error: `No processor registered for job type: ${job.type}`,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    try {
      const result = await Promise.race([
        processor(job),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Job timeout')), this.config.jobTimeoutMs)
        ),
      ])

      return {
        ...result,
        jobId: job.id,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      // Retry logic
      if (job.retries < job.maxRetries) {
        job.retries++
        // Re-queue with same priority
        const insertIndex = this.queue.findIndex((j) => j.priority < job.priority)
        if (insertIndex === -1) {
          this.queue.push(job)
        } else {
          this.queue.splice(insertIndex, 0, job)
        }
        this.stats.queued = this.queue.length
      }

      return {
        success: false,
        jobId: job.id,
        type: job.type,
        data: job.data,
        error: errorMessage,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }
  }

  // Main processing loop
  private async processLoop(): Promise<void> {
    if (!this.isRunning) return
    if (this.processing.size >= this.config.concurrency) return

    const job = this.dequeue()
    if (!job) return

    this.processing.add(job.id)
    this.stats.queued = this.queue.length
    this.stats.processing = this.processing.size

    this.processJob(job)
      .then((result) => {
        this.results.push(result)
        this.stats.totalProcessed++

        if (result.success) {
          this.stats.completed++
        } else {
          this.stats.failed++
        }
      })
      .catch(() => {
        this.stats.failed++
      })
      .finally(() => {
        this.processing.delete(job.id)
        this.stats.processing = this.processing.size
      })
  }

  // Start the queue processor
  start(): void {
    if (this.isRunning) return
    this.isRunning = true

    // Process jobs every 100ms
    this.processInterval = setInterval(() => {
      this.processLoop()
    }, 100)
  }

  // Stop the queue processor
  stop(): void {
    this.isRunning = false
    if (this.processInterval) {
      clearInterval(this.processInterval)
      this.processInterval = null
    }
  }

  // Get queue statistics
  getStats(): QueueStats & { types: Record<JobType, number> } {
    const types: Record<JobType, number> = {
      SlashCalculationJob: 0,
      RewardDistributionJob: 0,
      NodeHeartbeatCheckJob: 0,
      SessionCleanupJob: 0,
      ProposalStatusJob: 0,
      NotificationDispatchJob: 0,
      MetricAggregationJob: 0,
    }

    for (const job of this.queue) {
      types[job.type]++
    }

    return {
      ...this.stats,
      types,
    }
  }

  // Get job history
  getHistory(limit: number = 100): JobResult[] {
    return this.results.slice(-limit)
  }

  // Get failed jobs
  getFailedJobs(limit?: number): JobResult[] {
    const failed = this.results.filter((r) => !r.success)
    return limit ? failed.slice(-limit) : failed
  }

  // Clear completed jobs from history
  clearHistory(): void {
    this.results = this.results.filter((r) => !r.success)
  }

  // Get current queue depth
  getDepth(): number {
    return this.queue.length
  }

  // Check if queue is running
  isActive(): boolean {
    return this.isRunning
  }
}

// Singleton instance for global access
let globalQueue: JobQueue | null = null

export function getQueue(): JobQueue {
  if (!globalQueue) {
    globalQueue = new JobQueue()
    globalQueue.start()
  }
  return globalQueue
}

export function createQueue(config?: Partial<QueueConfig>): JobQueue {
  const queue = new JobQueue(config)
  queue.start()
  return queue
}