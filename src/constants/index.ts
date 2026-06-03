export const AGENT_CATEGORIES = [
  'defi', 'nft', 'dao', 'infrastructure', 'analytics',
  'data', 'web3', 'ai-ml', 'gaming', 'social'
] as const

export const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

export const SLA_BREACH_TYPES = {
  LATENCY: 'latency',
  TPM: 'tpm',
  HEARTBEAT: 'heartbeat',
  UPTIME: 'uptime',
} as const

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PASSED: 'passed',
  FAILED: 'failed',
  QUEUED: 'queued',
} as const

export const VOTE_OPTIONS = {
  FOR: 'for',
  AGAINST: 'against',
  ABSTAIN: 'abstain',
} as const

export const NOTIFICATION_TYPES = {
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  SESSION_WARNING: 'session_warning',
  SESSION_TERMINATED: 'session_terminated',
  SLASH_EVENT: 'slash_event',
  PROPOSAL_NEW: 'proposal_new',
  PROPOSAL_VOTE_REMINDER: 'proposal_vote_reminder',
  PROPOSAL_RESULTS: 'proposal_results',
  REWARD_EARNED: 'reward_earned',
  PAYOUT_READY: 'payout_ready',
  SKILL_PAYMENT: 'skill_payment',
  SYSTEM: 'system',
} as const

export const GENESIS_TIERS = {
  NONE: 'none',
  GENESIS: 'genesis',
  UPGRADED: 'upgraded',
} as const

export const PLATFORM_FEE_PERCENT = 2.5 // 2.5% platform fee
export const PROVIDER_REWARD_PERCENT = 70 // 70% to provider, 30% to creator

export const SLA_LATENCY_BREACH_THRESHOLD_MS = 100
export const SLA_TPM_BREACH_THRESHOLD_PERCENT = 90
export const SLA_HEARTBEAT_INTERVAL_SECONDS = 30