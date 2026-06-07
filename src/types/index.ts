// Core domain types for vassal.ai

// ============ AGENT ============
export interface Agent {
  id: string
  creator: string
  name: string
  description: string
  category: AgentCategory
  capabilities: Capability[]
  slaParams: SLAParams
  pricing: PricingModel
  qualityScore: number
  totalSessions: number
  avgRating: number
  createdAt: number
  updatedAt: number
  status: AgentStatus
  skillDependencies: string[]
  avatarUrl?: string
  bannerUrl?: string
  learningEnabled: boolean
  version: string
}

export type AgentCategory = typeof AGENT_CATEGORIES[number]
export type AgentStatus = 'active' | 'paused' | 'draft' | 'archived'

export interface Capability {
  id: string
  name: string
  description: string
  tpmRequired: number
  category: string
}

export interface SLAParams {
  latencyThresholdMs: number
  tpmCap: number
  uptimeGuaranteePercent: number
  minStakeRequired: number
}

export interface PricingModel {
  type: 'per_minute' | 'per_second' | 'per_call' | 'flat_rate' | 'tiered'
  pricePerMinute?: number
  pricePerSecond?: number
  pricePerCall?: number
  flatPrice?: number
  tiers?: PricingTier[]
}

export interface PricingTier {
  name: string
  tpmCap: number
  pricePerMinute: number
}

// ============ SESSION ============
export interface Session {
  id: string
  client: string
  agentId: string
  providerNode: string
  status: SessionStatus
  slaParams: SLAParams
  startTime: number
  endTime?: number
  tpmUsed: number
  totalCost: number
  latencyMetrics: LatencyMetrics
  rating?: number
  feedback?: string
  slashEvents: SlashEvent[]
  learningSignal?: LearningSignal
}

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

export interface LatencyMetrics {
  avgLatencyMs: number
  p50LatencyMs: number
  p95LatencyMs: number
  p99LatencyMs: number
  breaches: number
}

export interface SlashEvent {
  id: string
  sessionId: string
  type: SlashType
  amount: number
  timestamp: number
  reason: string
}

export type SlashType = typeof SLA_BREACH_TYPES[keyof typeof SLA_BREACH_TYPES]

export interface LearningSignal {
  taskDescription: string
  agentResponse: string
  clientRating: number
  taskCompletionStatus: 'completed' | 'partial' | 'failed'
  latencyMetrics: LatencyMetrics
  tpmAchieved: number
  spotCheckPassed?: boolean
  approvedByBuilder?: boolean
  appliedToMemory?: boolean
}

// ============ PROVIDER ============
export interface ProviderNode {
  id: string
  operator: string
  status: NodeStatus
  stakeAmount: number
  lockedStake: number
  availableStake: number
  hardware: HardwareSpec
  location: string
  totalSessions: number
  avgUptime: number
  earningsTotal: number
  earningsPending: number
  lastHeartbeat: number
  registeredAt: number
  isGenesis: boolean
}

export type NodeStatus = 'online' | 'offline' | 'warning' | 'maintenance' | 'draining'

export interface HardwareSpec {
  cpuCores: number
  gpuModel?: string
  gpuMemoryGb?: number
  ramGb: number
  diskGb: number
  bandwidthMbps: number
}

// ============ SKILL ============
export interface Skill {
  id: string
  author: string
  name: string
  description: string
  category: string
  version: string
  pricePerInvocation: number
  usageCount: number
  avgRating: number
  status: SkillStatus
  spec: SkillSpec
  createdAt: number
  updatedAt: number
}

export type SkillStatus = 'draft' | 'under_review' | 'pending' | 'approved' | 'rejected' | 'deprecated'

export interface SkillSpec {
  inputSchema: Record<string, unknown>
  outputSchema: Record<string, unknown>
  parameters: SkillParameter[]
  examples: SkillExample[]
}

export interface SkillParameter {
  name: string
  type: string
  required: boolean
  description: string
}

export interface SkillExample {
  input: Record<string, unknown>
  output: Record<string, unknown>
}

// ============ GOVERNANCE ============
export interface Proposal {
  id: string
  author: string
  title: string
  description: string
  category: ProposalCategory
  status: ProposalStatus
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalVoters: number
  quorumRequired: number
  startTime: number
  endTime: number
  executionPlan?: string
  createdAt: number
}

export type ProposalCategory = 'slash_amounts' | 'sla_thresholds' | 'protocol_upgrade' | 'tokenomics' | 'treasury' | 'other'
export type ProposalStatus = typeof PROPOSAL_STATUS[keyof typeof PROPOSAL_STATUS]

export interface Vote {
  id: string
  proposalId: string
  voter: string
  choice: VoteChoice
  votingPower: number
  timestamp: number
}

export type VoteChoice = typeof VOTE_OPTIONS[keyof typeof VOTE_OPTIONS]

// ============ STAKE ============
export interface StakePosition {
  id: string
  owner: string
  amount: number
  lockedAmount: number
  purpose: 'provider' | 'agent' | 'delegation'
  associatedEntity?: string
  createdAt: number
  unlockingAt?: number
}

export interface UnlockRequest {
  id: string
  owner: string
  amount: number
  requestTime: number
  releaseTime: number
  status: 'pending' | 'ready' | 'claimed'
}

// ============ USER / PROFILE ============
export interface UserProfile {
  address: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  roles: UserRole[]
  stats: UserStats
  isGenesisParticipant: boolean
  joinedAt: number
}

export type UserRole = 'creator' | 'provider' | 'client' | 'governor' | 'admin'

export interface UserStats {
  totalSessionsAsProvider: number
  totalSessionsAsClient: number
  agentsCreated: number
  skillsPublished: number
  proposalsVoted: number
}

// ============ NOTIFICATION ============
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  timestamp: number
  link?: string
  metadata?: Record<string, unknown>
}

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

// ============ GENESIS ============
export interface GenesisStatus {
  providerTier: 'none' | 'genesis' | 'upgraded'
  builderFreeListing: boolean
  genesisStartDate: number
  bonusEndDate?: number
  currentMultiplier: number
}

// Re-export constants for use in types
import { AGENT_CATEGORIES, SESSION_STATUS, SLA_BREACH_TYPES, PROPOSAL_STATUS, VOTE_OPTIONS, NOTIFICATION_TYPES } from '@/constants'