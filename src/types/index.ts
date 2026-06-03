export type AgentCategory =
  | "Web3"
  | "Data"
  | "Analytics"
  | "Infrastructure"
  | "DeFi"
  | "NFT"
  | "AI/ML"
  | "Gaming";

export type AgentStatus = "active" | "paused" | "draft";

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  tpm: number;
  tpmCap: number;
  latencySla: number;
  pricePerMinute: number;
  pricePerSecond: number;
  qualityScore: number;
  sessions: number;
  rating: number;
  status: AgentStatus;
  creator: string;
  createdAt: string;
  avatar?: string;
  uptimeGuarantee: number;
  isAvailable: boolean;
}

export interface CategoryBreakdown {
  category: AgentCategory;
  count: number;
  avgPrice: number;
  avgQuality: number;
}

export interface PricingTrend {
  date: string;
  avgPrice: number;
}

export interface TpmDistribution {
  range: string;
  count: number;
}

export interface QualityDistribution {
  range: string;
  count: number;
}

export interface SkillVersion {
  version: string;
  releaseDate: string;
  changelog: string;
  status: "active" | "deprecated" | "beta";
}

export interface SkillSpec {
  input: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  output: {
    name: string;
    type: string;
    description: string;
  }[];
  parameters: {
    name: string;
    type: string;
    default?: string;
    description: string;
  }[];
  returnValues: {
    code: string;
    description: string;
  }[];
  errorCodes: {
    code: string;
    description: string;
    suggestion?: string;
  }[];
}

export interface SkillAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  reputation: number;
  totalSkills: number;
  joinedDate: string;
}

export interface SkillReview {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  version: string;
  author: SkillAuthor;
  category: string;
  tags: string[];
  pricing: {
    type: "free" | "per-invocation" | "subscription";
    price?: number;
    currency?: string;
  };
  usageCount: number;
  rating: number;
  reviewCount: number;
  status: "active" | "draft" | "deprecated";
  createdAt: string;
  updatedAt: string;
  useCases: string[];
  specifications: SkillSpec;
  versions: SkillVersion[];
  dependencies: {
    incoming: { skillId: string; skillName: string }[];
    outgoing: { skillId: string; skillName: string }[];
  };
  reviews: SkillReview[];
  earnings?: {
    total: number;
    byVersion: { version: string; amount: number; invocations: number }[];
    payoutHistory: { date: string; amount: number; status: string }[];
  };
}

export interface EarningsBreakdown {
  baseEarnings: number;
  slaComplianceBonus: number;
  genesisProgramBonus: number;
  skillInvocationEarnings: number;
}

export interface ProviderNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  maxConcurrentSessions: number;
  minTpmFloor: number;
  maxLatencyThreshold: number;
  skillWhitelist: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  agentName: string;
  client: string;
  tpmUsed: number;
  earnings: number;
  slaHealth: number;
  status: 'active' | 'completed' | 'cancelled';
  startedAt: string;
  endedAt?: string;
  cancellationReason?: string;
  partialCharges?: number;
  outcome?: string;
  slaCompliant?: boolean;
  slashEvents?: number;
}

export interface ClientSession {
  id: string;
  agentId: string;
  agentName: string;
  clientId: string;
  status: "active" | "completed" | "failed" | "cancelled";
  startTime: string;
  endTime?: string;
  duration?: number;
  tpmUsed: number;
  tpmCap: number;
  latency: number;
  cost: number;
  rating?: number;
  feedback?: string;
  failureReason?: string;
  refundApplied?: number;
  slaPenaltyApplied?: number;
  events: ClientSessionEvent[];
}

export interface ClientSessionEvent {
  timestamp: string;
  type: "heartbeat" | "tpm_spike" | "warning" | "sla_breach" | "session_end" | "session_extended";
  message: string;
}

export interface FavoriteAgent {
  agentId: string;
  addedAt: string;
  alertEnabled: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  rateLimit: number;
}

export interface LoginEntry {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  status: 'success' | 'failed';
}

export interface ConnectedTool {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
  type: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface SkillAnalytics {
  totalInvocations: number;
  uniqueAgents: number;
  totalEarnings: number;
  revenueBySkill: { skillId: string; skillName: string; revenue: number; invocations: number }[];
  adoptionTrend: { date: string; count: number }[];
  topUsingAgents: { agentId: string; agentName: string; invocations: number }[];
  errorRate: number;
}