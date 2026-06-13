import type {
  Agent as PrismaAgent,
  Session as PrismaSession,
  ProviderNode as PrismaProviderNode,
  Skill as PrismaSkill,
  AgentCapability as PrismaAgentCapability,
  SlashEvent as PrismaSlashEvent,
  Proposal as PrismaProposal,
  VoteRecord as PrismaVoteRecord,
  StakePosition as PrismaStakePosition,
  UserProfile as PrismaUserProfile,
  Notification as PrismaNotification,
} from '@/generated/prisma/client'

// ============ HELPERS ============

export function decimalToNumber(val: unknown): number {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }
  return Number(val)
}

export function bigIntToNumber(val: unknown): number {
  if (val === null || val === undefined) return 0
  if (typeof val === 'bigint') return Number(val)
  return Number(val)
}

export function dateToTimestamp(val: Date | string | number | null | undefined): number {
  if (!val) return 0
  if (typeof val === 'number') return val
  return new Date(val).getTime()
}

// ============ AGENT ============

export interface TransformedAgent {
  id: string
  creator: string
  name: string
  description: string
  category: string
  capabilities: TransformedCapability[]
  slaParams: {
    latencyThresholdMs: number
    tpmCap: number
    uptimeGuaranteePercent: number
    minStakeRequired: number
  }
  pricing: {
    type: string
    pricePerMinute?: number
    pricePerSecond?: number
    pricePerCall?: number
    flatPrice?: number
    tiers?: Array<{ name: string; tpmCap: number; pricePerMinute: number }>
  }
  qualityScore: number
  totalSessions: number
  avgRating: number
  createdAt: number
  updatedAt: number
  status: string
  skillDependencies: string[]
  avatarUrl?: string
  bannerUrl?: string
  learningEnabled: boolean
  version: string
}

export interface TransformedCapability {
  id: string
  name: string
  description: string
  tpmRequired: number
  category: string
}

export function transformAgent(
  agent: PrismaAgent& {
    capabilities?: PrismaAgentCapability[]
    skillDependencies?: Array<{ skillId: string }>
  }
): TransformedAgent {
  return {
    id: agent.id,
    creator: agent.creator,
    name: agent.name,
    description: agent.description,
    category: agent.category,
    capabilities: (agent.capabilities || []).map(transformCapability),
    slaParams: {
      latencyThresholdMs: 2000, // Default - could be stored in agent if needed
      tpmCap: 100000,
      uptimeGuaranteePercent: 99,
      minStakeRequired: 0,
    },
    pricing: {
      type: agent.pricingType,
      pricePerMinute: agent.pricePerMinute ? decimalToNumber(agent.pricePerMinute) : undefined,
      pricePerSecond: agent.pricePerSecond ? decimalToNumber(agent.pricePerSecond) : undefined,
      pricePerCall: agent.pricePerCall ? decimalToNumber(agent.pricePerCall) : undefined,
      flatPrice: agent.flatPrice ? decimalToNumber(agent.flatPrice) : undefined,
    },
    qualityScore: agent.qualityScore,
    totalSessions: bigIntToNumber(agent.totalSessions),
    avgRating: decimalToNumber(agent.avgRating),
    createdAt: dateToTimestamp(agent.createdAt),
    updatedAt: dateToTimestamp(agent.updatedAt),
    status: agent.status,
    skillDependencies: (agent.skillDependencies || []).map((d) => d.skillId),
    avatarUrl: agent.avatarUrl || undefined,
    bannerUrl: agent.bannerUrl || undefined,
    learningEnabled: agent.learningEnabled,
    version: agent.version,
  }
}

export function transformCapability(cap: PrismaAgentCapability): TransformedCapability {
  return {
    id: cap.id,
    name: cap.name,
    description: cap.description,
    tpmRequired: cap.tpmRequired,
    category: cap.category,
  }
}

// ============ SESSION ============

export interface TransformedSession {
  id: string
  client: string
  agentId: string
  providerNode: string
  status: string
  slaParams: {
    latencyThresholdMs: number
    tpmCap: number
    uptimeGuaranteePercent: number
    minStakeRequired: number
  }
  startTime: number
  endTime?: number
  tpmUsed: number
  totalCost: number
  latencyMetrics: {
    avgLatencyMs: number
    p50LatencyMs: number
    p95LatencyMs: number
    p99LatencyMs: number
    breaches: number
  }
  rating?: number
  feedback?: string
  slashEvents: TransformedSlashEvent[]
  learningSignal?: unknown
}

export interface TransformedSlashEvent {
  id: string
  sessionId: string
  type: string
  amount: number
  timestamp: number
  reason: string
}

export function transformSession(
  session: PrismaSession & {
    slashEvents?: PrismaSlashEvent[]
  }
): TransformedSession {
  return {
    id: session.id,
    client: session.client,
    agentId: session.agentId,
    providerNode: session.providerNodeId,
    status: session.status,
    slaParams: {
      latencyThresholdMs: session.latencyThresholdMs,
      tpmCap: session.tpmCap,
      uptimeGuaranteePercent: decimalToNumber(session.uptimeGuaranteePercent),
      minStakeRequired: decimalToNumber(session.minStakeRequired),
    },
    startTime: dateToTimestamp(session.startTime),
    endTime: session.endTime ? dateToTimestamp(session.endTime) : undefined,
    tpmUsed: session.tpmUsed,
    totalCost: decimalToNumber(session.totalCost),
    latencyMetrics: {
      avgLatencyMs: session.avgLatencyMs,
      p50LatencyMs: session.p50LatencyMs,
      p95LatencyMs: session.p95LatencyMs,
      p99LatencyMs: session.p99LatencyMs,
      breaches: session.latencyBreaches,
    },
    rating: session.rating || undefined,
    feedback: session.feedback || undefined,
    slashEvents: (session.slashEvents || []).map(transformSlashEvent),
    learningSignal: session.learningSignal as TransformedSession['learningSignal'],
  }
}

export function transformSlashEvent(event: PrismaSlashEvent): TransformedSlashEvent {
  return {
    id: event.id,
    sessionId: event.sessionId,
    type: event.type,
    amount: decimalToNumber(event.amount),
    timestamp: dateToTimestamp(event.createdAt),
    reason: event.reason,
  }
}

// ============ PROVIDER NODE ============

export interface TransformedProviderNode {
  id: string
  operator: string
  status: string
  stakeAmount: number
  lockedStake: number
  availableStake: number
  hardware: {
    cpuCores: number
    gpuModel?: string
    gpuMemoryGb?: number
    ramGb: number
    diskGb: number
    bandwidthMbps: number
  }
  location: string
  totalSessions: number
  avgUptime: number
  earningsTotal: number
  earningsPending: number
  lastHeartbeat: number
  registeredAt: number
  isGenesis: boolean
}

export function transformProviderNode(node: PrismaProviderNode): TransformedProviderNode {
  return {
    id: node.id,
    operator: node.operator,
    status: node.status,
    stakeAmount: decimalToNumber(node.stakeAmount),
    lockedStake: decimalToNumber(node.lockedStake),
    availableStake: decimalToNumber(node.availableStake),
    hardware: {
      cpuCores: node.cpuCores,
      gpuModel: node.gpuModel || undefined,
      gpuMemoryGb: node.gpuMemoryGb || undefined,
      ramGb: node.ramGb,
      diskGb: node.diskGb,
      bandwidthMbps: node.bandwidthMbps,
    },
    location: node.location,
    totalSessions: bigIntToNumber(node.totalSessions),
    avgUptime: decimalToNumber(node.avgUptime),
    earningsTotal: decimalToNumber(node.earningsTotal),
    earningsPending: decimalToNumber(node.earningsPending),
    lastHeartbeat: dateToTimestamp(node.lastHeartbeat),
    registeredAt: dateToTimestamp(node.registeredAt),
    isGenesis: node.isGenesis,
  }
}

// ============ SKILL ============

export interface TransformedSkill {
  id: string
  author: string
  name: string
  description: string
  category: string
  version: string
  pricePerInvocation: number
  usageCount: number
  avgRating: number
  status: string
  spec: {
    inputSchema: Record<string, unknown>
    outputSchema: Record<string, unknown>
    parameters: Array<{
      name: string
      type: string
      required: boolean
      description: string
    }>
    examples: Array<{
      input: Record<string, unknown>
      output: Record<string, unknown>
    }>
  }
  createdAt: number
  updatedAt: number
}

export function transformSkill(skill: PrismaSkill): TransformedSkill {
  return {
    id: skill.id,
    author: skill.author,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    version: skill.version,
    pricePerInvocation: decimalToNumber(skill.pricePerInvocation),
    usageCount: bigIntToNumber(skill.usageCount),
    avgRating: decimalToNumber(skill.avgRating),
    status: skill.status,
    spec: {
      inputSchema: skill.inputSchema as Record<string, unknown>,
      outputSchema: skill.outputSchema as Record<string, unknown>,
      parameters: skill.parameters as TransformedSkill['spec']['parameters'],
      examples: skill.examples as TransformedSkill['spec']['examples'],
    },
    createdAt: dateToTimestamp(skill.createdAt),
    updatedAt: dateToTimestamp(skill.updatedAt),
  }
}

// ============ PROPOSAL ============

export interface TransformedProposal {
  id: string
  author: string
  title: string
  description: string
  category: string
  status: string
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

export function transformProposal(proposal: PrismaProposal): TransformedProposal {
  return {
    id: proposal.id,
    author: proposal.author,
    title: proposal.title,
    description: proposal.description,
    category: proposal.category,
    status: proposal.status,
    votesFor: bigIntToNumber(proposal.votesFor),
    votesAgainst: bigIntToNumber(proposal.votesAgainst),
    votesAbstain: bigIntToNumber(proposal.votesAbstain),
    totalVoters: proposal.totalVoters,
    quorumRequired: bigIntToNumber(proposal.quorumRequired),
    startTime: dateToTimestamp(proposal.startTime),
    endTime: dateToTimestamp(proposal.endTime),
    executionPlan: proposal.executionPlan || undefined,
    createdAt: dateToTimestamp(proposal.createdAt),
  }
}

// ============ STAKE ============

export interface TransformedStakePosition {
  id: string
  owner: string
  amount: number
  lockedAmount: number
  availableStake: number
  purpose: string
  associatedEntity?: string
  createdAt: number
  unlockingAt?: number
}

export function transformStakePosition(stake: PrismaStakePosition): TransformedStakePosition {
  return {
    id: stake.id,
    owner: stake.owner,
    amount: decimalToNumber(stake.amount),
    lockedAmount: decimalToNumber(stake.lockedAmount),
    availableStake: decimalToNumber(stake.availableStake),
    purpose: stake.purpose,
    associatedEntity: stake.associatedEntity || undefined,
    createdAt: dateToTimestamp(stake.createdAt),
    unlockingAt: stake.unlockingAt ? dateToTimestamp(stake.unlockingAt) : undefined,
  }
}

// ============ USER PROFILE ============

export interface TransformedUserProfile {
  address: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  roles: string[]
  stats: {
    totalSessionsAsProvider: number
    totalSessionsAsClient: number
    agentsCreated: number
    skillsPublished: number
    proposalsVoted: number
  }
  isGenesisParticipant: boolean
  joinedAt: number
}

export function transformUserProfile(profile: PrismaUserProfile): TransformedUserProfile {
  return {
    address: profile.address,
    displayName: profile.displayName || undefined,
    avatarUrl: profile.avatarUrl || undefined,
    bio: profile.bio || undefined,
    roles: (profile.roles as string[]) || [],
    stats: {
      totalSessionsAsProvider: bigIntToNumber(profile.totalSessionsAsProvider),
      totalSessionsAsClient: bigIntToNumber(profile.totalSessionsAsClient),
      agentsCreated: profile.agentsCreated,
      skillsPublished: profile.skillsPublished,
      proposalsVoted: profile.proposalsVoted,
    },
    isGenesisParticipant: profile.isGenesisParticipant,
    joinedAt: dateToTimestamp(profile.joinedAt),
  }
}

// ============ NOTIFICATION ============

export interface TransformedNotification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  timestamp: number
  link?: string
  metadata?: Record<string, unknown>
}

export function transformNotification(notif: PrismaNotification): TransformedNotification {
  return {
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    read: notif.read,
    timestamp: dateToTimestamp(notif.timestamp),
    link: notif.link || undefined,
    metadata: (notif.metadata as Record<string, unknown>) || undefined,
  }
}
