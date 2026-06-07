// Jobs module - background job processing infrastructure

// Types
export * from './types'

// Queue
export { JobQueue, getQueue, createQueue } from './queue'

// Scheduler
export { JobScheduler, getScheduler, startScheduler } from './scheduler'

// Monitor
export * from './monitor'

// Workers
export * from './workers/slashing'
export * from './workers/rewards'
export * from './workers/heartbeat'
export * from './workers/cleanup'
export * from './workers/proposals'
export * from './workers/notifications'
export * from './workers/metrics'

// Convenience function to register all workers with a queue
import { JobQueue } from './queue'
import { processSlashJob } from './workers/slashing'
import { processRewardJob } from './workers/rewards'
import { processHeartbeatJob } from './workers/heartbeat'
import { processCleanupJob } from './workers/cleanup'
import { processProposalJob } from './workers/proposals'
import { processNotificationJob } from './workers/notifications'
import { processMetricAggregationJob } from './workers/metrics'

export function registerAllProcessors(queue: JobQueue): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('SlashCalculationJob', processSlashJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('RewardDistributionJob', processRewardJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('NodeHeartbeatCheckJob', processHeartbeatJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('SessionCleanupJob', processCleanupJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('ProposalStatusJob', processProposalJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('NotificationDispatchJob', processNotificationJob as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue.registerProcessor('MetricAggregationJob', processMetricAggregationJob as any)
}