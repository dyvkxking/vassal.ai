// Platform-wide constants for vassal.ai

export const PLATFORM_NAME = 'vassal.ai'
export const TOKEN_SYMBOL = 'MESH'
export const TOKEN_NAME = 'MeshToken'

export const PLATFORM_FEE_PERCENT = 10
export const CREATOR_REVENUE_SHARE = 60
export const PROVIDER_REVENUE_SHARE = 30

export const HEARTBEAT_INTERVAL_SECONDS = 30
export const MIN_SESSION_DURATION_SECONDS = 45
export const DEFAULT_TPM_CAP = 100000
export const DEFAULT_LATENCY_THRESHOLD_MS = 2000

export const GENESIS_PROVIDER_BONUS_MULTIPLIER = 2
export const GENESIS_PROVIDER_BONUS_DURATION_MONTHS = 6
export const GENESIS_BUILDER_FREE_LISTING_MONTHS = 3

export const STAKE_UNLOCK_DELAY_BLOCKS = 100

export const PAGE_SIZE_DEFAULT = 20
export const PAGE_SIZE_MAX = 100

export const SUPPORTED_WALLETS = [
  'metaMask',
  'walletConnect',
  'coinbase',
  'rainbow',
] as const

export const AGENT_CATEGORIES = [
  'web3',
  'data',
  'analytics',
  'infrastructure',
  'defi',
  'nft',
  'dao',
  'ai-ml',
  'gaming',
  'social',
  'other',
] as const

export const SESSION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const

export const SLA_BREACH_TYPES = {
  LATENCY: 'latency',
  TPM: 'tpm',
  UPTIME: 'uptime',
  HEARTBEAT: 'heartbeat',
} as const

export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PASSED: 'passed',
  FAILED: 'failed',
  EXECUTED: 'executed',
  EXPIRED: 'expired',
} as const

export const VOTE_OPTIONS = {
  FOR: 'for',
  AGAINST: 'against',
  ABSTAIN: 'abstain',
} as const

export const NOTIFICATION_TYPES = {
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  SESSION_SLA_WARNING: 'session_sla_warning',
  SESSION_TERMINATED: 'session_terminated',
  SLASHED: 'slashed',
  PROPOSAL_NEW: 'proposal_new',
  PROPOSAL_VOTE_REMINDER: 'proposal_vote_reminder',
  PROPOSAL_RESULTS: 'proposal_results',
  PAYOUT_READY: 'payout_ready',
  REWARD_EARNED: 'reward_earned',
  SKILL_PAYMENT: 'skill_payment',
  SYSTEM_UPGRADE: 'system_upgrade',
} as const

export const REDIS_KEYS = {
  SESSION_PREFIX: 'session:',
  AGENT_PREFIX: 'agent:',
  NODE_PREFIX: 'node:',
  MATCH_PREFIX: 'match:',
  LEARNING_PREFIX: 'learning:',
} as const

export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
export const IPFS_RESOLVER = 'https://cloudflare-ipfs.com/ipfs/'

export const SOMNIA_CHAIN_ID = 101
export const SOMNIA_RPC_URL = process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://rpc.somnia.network'
export const SOMNIA_BLOCK_EXPLORER = 'https://explorer.somnia.network'

export const RATE_LIMIT = {
  API_PER_MINUTE: 120,
  SESSION_CREATE_PER_HOUR: 10,
  MATCH_QUERY_PER_MINUTE: 60,
} as const