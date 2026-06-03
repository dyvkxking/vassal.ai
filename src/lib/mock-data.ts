import type { Agent, Session, ProviderNode, Skill, Proposal, StakePosition, Notification, UserProfile } from '@/types'

// ============ MOCK AGENTS ============
export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    creator: '0x1234...abcd',
    name: 'DeFi Pulse Scanner',
    description: 'Real-time DeFi protocol monitoring with yield optimization signals and liquidity flow analysis.',
    category: 'defi',
    capabilities: [
      { id: 'cap-001', name: 'Yield Analysis', description: 'Analyzes yield across protocols', tpmRequired: 50000, category: 'defi' },
      { id: 'cap-002', name: 'Liquidity Tracking', description: 'Tracks liquidity movements', tpmRequired: 30000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 1500, tpmCap: 100000, uptimeGuaranteePercent: 99, minStakeRequired: 1000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0025 },
    qualityScore: 94,
    totalSessions: 12847,
    avgRating: 4.7,
    createdAt: Date.now() - 90 * 86400000,
    updatedAt: Date.now() - 86400000,
    status: 'active',
    skillDependencies: ['skill-web3-read', 'skill-price-feed'],
    learningEnabled: true,
    version: '2.4.1',
  },
  {
    id: 'agent-002',
    creator: '0x5678...efgh',
    name: 'NFT Collection Analyzer',
    description: 'Floor price tracking, volume analysis, and whale wallet monitoring for NFT collections.',
    category: 'nft',
    capabilities: [
      { id: 'cap-003', name: 'Floor Price Tracking', description: 'Real-time floor price monitoring', tpmRequired: 20000, category: 'nft' },
      { id: 'cap-004', name: 'Whale Tracking', description: 'Monitors whale wallet activity', tpmRequired: 40000, category: 'nft' },
    ],
    slaParams: { latencyThresholdMs: 2000, tpmCap: 80000, uptimeGuaranteePercent: 95, minStakeRequired: 500 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0018 },
    qualityScore: 87,
    totalSessions: 4231,
    avgRating: 4.3,
    createdAt: Date.now() - 120 * 86400000,
    updatedAt: Date.now() - 172800000,
    status: 'active',
    skillDependencies: ['skill-price-feed'],
    learningEnabled: true,
    version: '1.8.0',
  },
  {
    id: 'agent-003',
    creator: '0x9abc...ijkl',
    name: 'DAO Proposal Digest',
    description: 'Summarizes DAO proposals, analyzes voting patterns, and predicts outcomes with confidence scores.',
    category: 'dao',
    capabilities: [
      { id: 'cap-005', name: 'Proposal Summary', description: 'Summarizes governance proposals', tpmRequired: 15000, category: 'dao' },
      { id: 'cap-006', name: 'Vote Prediction', description: 'Predicts proposal outcomes', tpmRequired: 60000, category: 'dao' },
    ],
    slaParams: { latencyThresholdMs: 3000, tpmCap: 50000, uptimeGuaranteePercent: 90, minStakeRequired: 750 },
    pricing: { type: 'per_second', pricePerSecond: 0.00004 },
    qualityScore: 91,
    totalSessions: 8923,
    avgRating: 4.8,
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now() - 86400000,
    status: 'active',
    skillDependencies: ['skill-web3-read', 'skill-summarizer'],
    learningEnabled: true,
    version: '3.1.2',
  },
  {
    id: 'agent-004',
    creator: '0xdef0...mnop',
    name: 'Wallet Intelligence',
    description: 'On-chain wallet analysis with reputation scoring, tx history enrichment, and risk assessment.',
    category: 'infrastructure',
    capabilities: [
      { id: 'cap-007', name: 'Wallet Analysis', description: 'Full wallet behavior analysis', tpmRequired: 35000, category: 'infrastructure' },
      { id: 'cap-008', name: 'Risk Scoring', description: 'Risk assessment for addresses', tpmRequired: 25000, category: 'infrastructure' },
    ],
    slaParams: { latencyThresholdMs: 1200, tpmCap: 120000, uptimeGuaranteePercent: 99, minStakeRequired: 1500 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0032 },
    qualityScore: 96,
    totalSessions: 23891,
    avgRating: 4.9,
    createdAt: Date.now() - 150 * 86400000,
    updatedAt: Date.now() - 43200000,
    status: 'active',
    skillDependencies: ['skill-onchain-reads', 'skill-data-processor'],
    learningEnabled: true,
    version: '4.0.3',
  },
  {
    id: 'agent-005',
    creator: '0x1234...abcd',
    name: 'Token Price Oracle',
    description: 'Aggregates prices from multiple DEXs, calculates VWAP, and detects arbitrage opportunities.',
    category: 'defi',
    capabilities: [
      { id: 'cap-009', name: 'Price Aggregation', description: 'Multi-DEX price aggregation', tpmRequired: 80000, category: 'defi' },
      { id: 'cap-010', name: 'Arbitrage Detection', description: 'Detects cross-exchange opportunities', tpmRequired: 45000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 800, tpmCap: 200000, uptimeGuaranteePercent: 99.5, minStakeRequired: 2000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0045 },
    qualityScore: 98,
    totalSessions: 51204,
    avgRating: 4.9,
    createdAt: Date.now() - 200 * 86400000,
    updatedAt: Date.now() - 3600000,
    status: 'active',
    skillDependencies: ['skill-price-feed', 'skill-web3-read'],
    learningEnabled: true,
    version: '5.2.0',
  },
  {
    id: 'agent-006',
    creator: '0x5678...efgh',
    name: 'MEV Detector',
    description: 'Identifies MEV opportunities and sandwich attacks in real-time. Alerts for arbitrage and liquidations.',
    category: 'defi',
    capabilities: [
      { id: 'cap-011', name: 'MEV Detection', description: 'Identifies MEV activity', tpmRequired: 100000, category: 'defi' },
      { id: 'cap-012', name: 'Sandwich Alert', description: 'Alerts on sandwich attacks', tpmRequired: 60000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 500, tpmCap: 300000, uptimeGuaranteePercent: 99.9, minStakeRequired: 5000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.008 },
    qualityScore: 99,
    totalSessions: 87291,
    avgRating: 4.6,
    createdAt: Date.now() - 180 * 86400000,
    updatedAt: Date.now() - 7200000,
    status: 'active',
    skillDependencies: ['skill-onchain-reads', 'skill-price-feed', 'skill-data-processor'],
    learningEnabled: true,
    version: '2.1.0',
  },
]

// ============ MOCK SESSIONS ============
export const MOCK_SESSIONS: Session[] = [
  {
    id: 'session-001',
    client: '0xclient...1111',
    agentId: 'agent-001',
    providerNode: 'node-001',
    status: 'active',
    slaParams: { latencyThresholdMs: 1500, tpmCap: 100000, uptimeGuaranteePercent: 99, minStakeRequired: 1000 },
    startTime: Date.now() - 120000,
    tpmUsed: 45000,
    totalCost: 0.005,
    latencyMetrics: { avgLatencyMs: 980, p50LatencyMs: 920, p95LatencyMs: 1400, p99LatencyMs: 1480, breaches: 0 },
    slashEvents: [],
    learningSignal: undefined,
  },
  {
    id: 'session-002',
    client: '0xclient...2222',
    agentId: 'agent-004',
    providerNode: 'node-002',
    status: 'completed',
    slaParams: { latencyThresholdMs: 1200, tpmCap: 120000, uptimeGuaranteePercent: 99, minStakeRequired: 1500 },
    startTime: Date.now() - 3600000,
    endTime: Date.now() - 600000,
    tpmUsed: 78000,
    totalCost: 0.092,
    latencyMetrics: { avgLatencyMs: 850, p50LatencyMs: 800, p95LatencyMs: 1100, p99LatencyMs: 1180, breaches: 0 },
    rating: 5,
    feedback: 'Excellent analysis, very fast response.',
    slashEvents: [],
  },
]

// ============ MOCK PROVIDER NODES ============
export const MOCK_PROVIDER_NODES: ProviderNode[] = [
  {
    id: 'node-001',
    operator: '0x1234...abcd',
    status: 'online',
    stakeAmount: 5000,
    lockedStake: 2000,
    availableStake: 3000,
    hardware: { cpuCores: 32, gpuModel: 'NVIDIA A100', gpuMemoryGb: 80, ramGb: 128, diskGb: 2000, bandwidthMbps: 10000 },
    location: 'US-East',
    totalSessions: 12847,
    avgUptime: 99.4,
    earningsTotal: 847.23,
    earningsPending: 124.50,
    lastHeartbeat: Date.now() - 15000,
    registeredAt: Date.now() - 180 * 86400000,
    isGenesis: true,
  },
  {
    id: 'node-002',
    operator: '0x5678...efgh',
    status: 'online',
    stakeAmount: 3000,
    lockedStake: 1000,
    availableStake: 2000,
    hardware: { cpuCores: 16, gpuModel: 'NVIDIA RTX 4090', gpuMemoryGb: 24, ramGb: 64, diskGb: 1000, bandwidthMbps: 5000 },
    location: 'EU-West',
    totalSessions: 8923,
    avgUptime: 98.7,
    earningsTotal: 512.40,
    earningsPending: 45.20,
    lastHeartbeat: Date.now() - 22000,
    registeredAt: Date.now() - 90 * 86400000,
    isGenesis: false,
  },
]

// ============ MOCK SKILLS ============
export const MOCK_SKILLS: Skill[] = [
  {
    id: 'skill-web3-read',
    author: '0xauthor...1111',
    name: 'Web3 Read',
    description: 'Reads on-chain data from Ethereum and EVM-compatible chains. Supports blocks, transactions, logs, and traces.',
    category: 'infrastructure',
    version: '2.1.0',
    pricePerInvocation: 0.00001,
    usageCount: 1240000,
    avgRating: 4.8,
    status: 'approved',
    spec: {
      inputSchema: { chainId: 'number', blockNumber: 'number', txHash: 'string' },
      outputSchema: { block: 'object', transaction: 'object', logs: 'array' },
      parameters: [
        { name: 'chainId', type: 'number', required: true, description: 'Chain ID (1 for Ethereum mainnet)' },
        { name: 'resource', type: 'string', required: true, description: 'Resource to read: block, tx, logs' },
      ],
      examples: [],
    },
    createdAt: Date.now() - 300 * 86400000,
    updatedAt: Date.now() - 30 * 86400000,
  },
  {
    id: 'skill-price-feed',
    author: '0xauthor...2222',
    name: 'Price Feed',
    description: 'Aggregated price data from major DEXs and CEXs. Supports VWAP, TWAP, and spot price.',
    category: 'data',
    version: '1.5.0',
    pricePerInvocation: 0.000005,
    usageCount: 890000,
    avgRating: 4.6,
    status: 'approved',
    spec: { inputSchema: {}, outputSchema: {}, parameters: [], examples: [] },
    createdAt: Date.now() - 200 * 86400000,
    updatedAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'skill-summarizer',
    author: '0xauthor...3333',
    name: 'Text Summarizer',
    description: 'Summarizes long text documents into concise key points. Uses transformer-based extraction.',
    category: 'ai-ml',
    version: '3.0.0',
    pricePerInvocation: 0.00002,
    usageCount: 456000,
    avgRating: 4.4,
    status: 'approved',
    spec: { inputSchema: {}, outputSchema: {}, parameters: [], examples: [] },
    createdAt: Date.now() - 150 * 86400000,
    updatedAt: Date.now() - 15 * 86400000,
  },
]

// ============ MOCK PROPOSALS ============
export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    author: '0xgovernor...1111',
    title: 'Increase Slash Rate for Latency Breaches',
    description: 'Proposal to increase the slash rate for latency SLA breaches from 5% to 10% of locked stake. This improves client guarantees during high-traffic periods.',
    category: 'slash_amounts',
    status: 'active',
    votesFor: 4500000,
    votesAgainst: 1200000,
    votesAbstain: 300000,
    totalVoters: 234,
    quorumRequired: 5000000,
    startTime: Date.now() - 86400000 * 3,
    endTime: Date.now() + 86400000 * 4,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'prop-002',
    author: '0xgovernor...2222',
    title: 'Add AI/ML Category to Agent Registry',
    description: 'Add new agent category "AI/ML" to support emerging agents focused on machine learning tasks, robotics, and computer vision.',
    category: 'protocol_upgrade',
    status: 'passed',
    votesFor: 8900000,
    votesAgainst: 400000,
    votesAbstain: 200000,
    totalVoters: 456,
    quorumRequired: 5000000,
    startTime: Date.now() - 86400000 * 10,
    endTime: Date.now() - 86400000 * 3,
    executionPlan: 'Add new enum value to AgentCategory. Migration script to re-categorize existing agents.',
    createdAt: Date.now() - 86400000 * 12,
  },
]

// ============ MOCK STAKE POSITIONS ============
export const MOCK_STAKE_POSITIONS: StakePosition[] = [
  {
    id: 'stake-001',
    owner: '0x1234...abcd',
    amount: 5000,
    lockedAmount: 2000,
    purpose: 'provider',
    associatedEntity: 'node-001',
    createdAt: Date.now() - 180 * 86400000,
    unlockingAt: undefined,
  },
  {
    id: 'stake-002',
    owner: '0x1234...abcd',
    amount: 2000,
    lockedAmount: 2000,
    purpose: 'agent',
    associatedEntity: 'agent-001',
    createdAt: Date.now() - 90 * 86400000,
    unlockingAt: undefined,
  },
]

// ============ MOCK USER PROFILE ============
export const MOCK_USER_PROFILE: UserProfile = {
  address: '0x1234567890123456789012345678901234567890',
  displayName: 'Mesh Pioneer',
  avatarUrl: undefined,
  bio: 'Building the future of AI agent infrastructure.',
  roles: ['creator', 'provider'],
  stats: {
    totalSessionsAsProvider: 12847,
    totalSessionsAsClient: 342,
    agentsCreated: 3,
    skillsPublished: 1,
    proposalsVoted: 12,
  },
  isGenesisParticipant: true,
  joinedAt: Date.now() - 180 * 86400000,
}

// ============ MOCK NOTIFICATIONS ============
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'session_start',
    title: 'Session Started',
    message: 'Your agent DeFi Pulse Scanner is now serving a new session.',
    read: false,
    timestamp: Date.now() - 120000,
    link: '/client/active-session/session-001',
  },
  {
    id: 'notif-002',
    type: 'reward_earned',
    title: 'Reward Earned',
    message: 'You earned 0.0245 $MESH from session #12848.',
    read: true,
    timestamp: Date.now() - 3600000,
    link: '/provider/earnings',
  },
  {
    id: 'notif-003',
    type: 'proposal_new',
    title: 'New Proposal',
    message: 'Proposal #7 "Increase Slash Rate for Latency Breaches" is now active. Cast your vote.',
    read: false,
    timestamp: Date.now() - 86400000 * 2,
    link: '/governance/proposal/prop-001',
  },
]

// ============ HELPERS ============
export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find((a) => a.id === id)
}

export function getSessionById(id: string): Session | undefined {
  return MOCK_SESSIONS.find((s) => s.id === id)
}

export function getNodeById(id: string): ProviderNode | undefined {
  return MOCK_PROVIDER_NODES.find((n) => n.id === id)
}

export function getSkillById(id: string): Skill | undefined {
  return MOCK_SKILLS.find((s) => s.id === id)
}

export function getProposalById(id: string): Proposal | undefined {
  return MOCK_PROPOSALS.find((p) => p.id === id)
}