// Job type definitions for background job processing

import type { Session, ProviderNode, Proposal } from '@/types'

// ============ JOB TYPES ============

export type JobType =
  | 'SlashCalculationJob'
  | 'RewardDistributionJob'
  | 'NodeHeartbeatCheckJob'
  | 'SessionCleanupJob'
  | 'ProposalStatusJob'
  | 'NotificationDispatchJob'
  | 'MetricAggregationJob'

// ============ JOB DATA INTERFACES ============

export interface SlashCalculationJobData {
  sessionId: string
  breachType: 'latency' | 'tpm' | 'uptime'
}

export interface RewardDistributionJobData {
  userAddress: string
  positionId?: string
  batchDate?: string
}

export interface NodeHeartbeatCheckJobData {
  nodeId: string
}

export interface SessionCleanupJobData {
  olderThanDays?: number
}

export interface ProposalStatusJobData {
  proposalId?: string
}

export interface NotificationDispatchJobData {
  notificationId: string
  userAddress: string
}

export interface MetricAggregationJobData {
  period: 'hourly' | 'daily' | 'weekly'
  date?: string
}

// ============ JOB RESULT ============

export interface JobResult {
  success: boolean
  jobId: string
  type: JobType
  data: unknown
  result?: unknown
  error?: string
  durationMs: number
  timestamp: number
  retries: number
}

// ============ JOB INSTANCE ============

export interface Job<T = unknown> {
  id: string
  type: JobType
  data: T
  priority: number
  retries: number
  maxRetries: number
  createdAt: number
  scheduledAt?: number
}

// ============ JOB PROCESSOR ============

export type JobProcessor<T = unknown> = (job: Job<T>) => Promise<JobResult>

// ============ QUEUE CONFIG ============

export interface QueueConfig {
  concurrency: number
  defaultMaxRetries: number
  defaultPriority: number
  jobTimeoutMs: number
}

// ============ SLASHING TYPES ============

export interface SlashCalculation {
  sessionId: string
  nodeId: string
  breachType: 'latency' | 'tpm' | 'uptime'
  lockedStake: number
  breachRate: number
  slashAmount: number
  timestamp: number
}

// ============ REWARD TYPES ============

export interface SessionReward {
  sessionId: string
  agentId: string
  providerNodeId: string
  tpmUsed: number
  pricePerMinute: number
  totalReward: number
  providerShare: number
  protocolShare: number
  timestamp: number
}

export interface RewardDistribution {
  userAddress: string
  totalAmount: number
  positions: Array<{
    positionId: string
    amount: number
  }>
  timestamp: number
}

// ============ HEARTBEAT TYPES ============

export interface HeartbeatStatus {
  nodeId: string
  lastHeartbeat: number
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  staleSeconds: number
  timestamp: number
}

// ============ PROPOSAL STATUS TYPES ============

export interface ProposalTransition {
  proposalId: string
  fromStatus: string
  toStatus: string
  votesFor: number
  votesAgainst: number
  quorumMet: boolean
  timestamp: number
}

// ============ METRIC TYPES ============

export interface AggregatedMetrics {
  period: 'hourly' | 'daily' | 'weekly'
  startTime: number
  endTime: number
  totalSessions: number
  totalCost: number
  providerEarnings: number
  protocolEarnings: number
  uniqueAgents: number
  uniqueProviders: number
  timestamp: number
}