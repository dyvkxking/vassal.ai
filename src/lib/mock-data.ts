import type { Agent, ProviderNode, Session, ApiKey, LoginEntry, ConnectedTool, LogEntry, EarningsBreakdown, AgentCategory, CategoryBreakdown, PricingTrend, TpmDistribution, QualityDistribution, ClientSession, FavoriteAgent } from '@/types';

export const MOCK_AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Alpha Miner', category: 'Web3', description: 'Advanced blockchain analysis agent', tpm: 5000000, tpmCap: 5000000, latencySla: 150, pricePerMinute: 0.05, pricePerSecond: 0.00083, qualityScore: 4.8, sessions: 1247, rating: 4.9, status: 'active', creator: '0x1234...abcd', createdAt: '2026-05-01', uptimeGuarantee: 99.5, isAvailable: true },
  { id: 'agent-2', name: 'Data Weaver', category: 'Data', description: 'Complex data transformation and ETL', tpm: 3000000, tpmCap: 3000000, latencySla: 200, pricePerMinute: 0.03, pricePerSecond: 0.0005, qualityScore: 4.5, sessions: 892, rating: 4.7, status: 'active', creator: '0x5678...efgh', createdAt: '2026-05-03', uptimeGuarantee: 99.0, isAvailable: true },
  { id: 'agent-3', name: 'Analytics Pro', category: 'Analytics', description: 'Real-time analytics and reporting', tpm: 4000000, tpmCap: 4000000, latencySla: 180, pricePerMinute: 0.04, pricePerSecond: 0.00067, qualityScore: 4.6, sessions: 1056, rating: 4.8, status: 'active', creator: '0x9abc...ijkl', createdAt: '2026-05-05', uptimeGuarantee: 99.2, isAvailable: true },
  { id: 'agent-4', name: 'Infra Manager', category: 'Infrastructure', description: 'Cloud infrastructure orchestration', tpm: 2500000, tpmCap: 2500000, latencySla: 250, pricePerMinute: 0.035, pricePerSecond: 0.00058, qualityScore: 4.3, sessions: 634, rating: 4.5, status: 'active', creator: '0xdef0...mnop', createdAt: '2026-05-08', uptimeGuarantee: 98.5, isAvailable: true },
  { id: 'agent-5', name: 'DeFi Strategist', category: 'DeFi', description: 'Decentralized finance strategy engine', tpm: 4500000, tpmCap: 4500000, latencySla: 160, pricePerMinute: 0.055, pricePerSecond: 0.00092, qualityScore: 4.7, sessions: 789, rating: 4.9, status: 'active', creator: '0x4321...qrst', createdAt: '2026-05-10', uptimeGuarantee: 99.8, isAvailable: true },
  { id: 'agent-6', name: 'NFT Collector', category: 'NFT', description: 'NFT collection management and trading', tpm: 2000000, tpmCap: 2000000, latencySla: 220, pricePerMinute: 0.025, pricePerSecond: 0.00042, qualityScore: 4.2, sessions: 445, rating: 4.4, status: 'active', creator: '0x8765...uvwx', createdAt: '2026-05-12', uptimeGuarantee: 98.0, isAvailable: true },
  { id: 'agent-7', name: 'AI Scribe', category: 'AI/ML', description: 'Content generation with ML models', tpm: 3500000, tpmCap: 3500000, latencySla: 190, pricePerMinute: 0.045, pricePerSecond: 0.00075, qualityScore: 4.9, sessions: 1567, rating: 4.9, status: 'active', creator: '0xbcde...yz12', createdAt: '2026-05-15', uptimeGuarantee: 99.9, isAvailable: true },
  { id: 'agent-8', name: 'Game Master', category: 'Gaming', description: 'Gaming analytics and optimization', tpm: 2800000, tpmCap: 2800000, latencySla: 210, pricePerMinute: 0.038, pricePerSecond: 0.00063, qualityScore: 4.4, sessions: 523, rating: 4.6, status: 'active', creator: '0x3456...abcd', createdAt: '2026-05-18', uptimeGuarantee: 99.0, isAvailable: true },
  { id: 'agent-9', name: 'Web3 Watcher', category: 'Web3', description: 'Smart contract monitoring', tpm: 2200000, tpmCap: 2200000, latencySla: 230, pricePerMinute: 0.028, pricePerSecond: 0.00047, qualityScore: 4.1, sessions: 312, rating: 4.3, status: 'paused', creator: '0x7890...efgh', createdAt: '2026-05-20', uptimeGuarantee: 97.5, isAvailable: false },
  { id: 'agent-10', name: 'Data Oracle', category: 'Data', description: 'Real-time data aggregation', tpm: 3800000, tpmCap: 3800000, latencySla: 175, pricePerMinute: 0.042, pricePerSecond: 0.0007, qualityScore: 4.7, sessions: 978, rating: 4.8, status: 'active', creator: '0x1111...ijkl', createdAt: '2026-05-22', uptimeGuarantee: 99.5, isAvailable: true },
  { id: 'agent-11', name: 'Trend Analyzer', category: 'Analytics', description: 'Market trend analysis engine', tpm: 3200000, tpmCap: 3200000, latencySla: 195, pricePerMinute: 0.036, pricePerSecond: 0.0006, qualityScore: 4.5, sessions: 654, rating: 4.6, status: 'active', creator: '0x2222...mnop', createdAt: '2026-05-25', uptimeGuarantee: 99.0, isAvailable: true },
  { id: 'agent-12', name: 'Chain Sentinel', category: 'Infrastructure', description: 'Blockchain infrastructure monitor', tpm: 1800000, tpmCap: 1800000, latencySla: 260, pricePerMinute: 0.022, pricePerSecond: 0.00037, qualityScore: 4.0, sessions: 234, rating: 4.2, status: 'draft', creator: '0x3333...qrst', createdAt: '2026-05-28', uptimeGuarantee: 97.0, isAvailable: false },
];

export const MOCK_CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { category: 'Web3', count: 2, avgPrice: 0.039, avgQuality: 4.45 },
  { category: 'Data', count: 2, avgPrice: 0.036, avgQuality: 4.6 },
  { category: 'Analytics', count: 2, avgPrice: 0.038, avgQuality: 4.55 },
  { category: 'Infrastructure', count: 2, avgPrice: 0.0285, avgQuality: 4.15 },
  { category: 'DeFi', count: 1, avgPrice: 0.055, avgQuality: 4.7 },
  { category: 'NFT', count: 1, avgPrice: 0.025, avgQuality: 4.2 },
  { category: 'AI/ML', count: 1, avgPrice: 0.045, avgQuality: 4.9 },
  { category: 'Gaming', count: 1, avgPrice: 0.038, avgQuality: 4.4 },
];

export const MOCK_PRICING_TRENDS: PricingTrend[] = [
  { date: '2026-05-01', avgPrice: 0.038 },
  { date: '2026-05-08', avgPrice: 0.040 },
  { date: '2026-05-15', avgPrice: 0.042 },
  { date: '2026-05-22', avgPrice: 0.041 },
  { date: '2026-05-29', avgPrice: 0.043 },
  { date: '2026-06-04', avgPrice: 0.044 },
];

export const MOCK_TPM_DISTRIBUTION: TpmDistribution[] = [
  { range: '0-1M', count: 2 },
  { range: '1M-2M', count: 3 },
  { range: '2M-3M', count: 3 },
  { range: '3M-4M', count: 2 },
  { range: '4M-5M', count: 2 },
];

export const MOCK_QUALITY_DISTRIBUTION: QualityDistribution[] = [
  { range: '4.0-4.2', count: 2 },
  { range: '4.2-4.4', count: 3 },
  { range: '4.4-4.6', count: 3 },
  { range: '4.6-4.8', count: 2 },
  { range: '4.8-5.0', count: 2 },
];

export const MOCK_PROVIDER_NODES: ProviderNode[] = [
  {
    id: 'node-1',
    name: 'Primary Node US-East',
    status: 'online',
    maxConcurrentSessions: 50,
    minTpmFloor: 1000000,
    maxLatencyThreshold: 200,
    skillWhitelist: ['text-generation', 'image-analysis', 'code-execution'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'node-2',
    name: 'Secondary Node EU-West',
    status: 'degraded',
    maxConcurrentSessions: 30,
    minTpmFloor: 800000,
    maxLatencyThreshold: 250,
    skillWhitelist: ['text-generation', 'code-execution'],
    createdAt: '2024-02-20T14:30:00Z',
  },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 'sess-001',
    agentName: 'Alpha Agent',
    client: 'Acme Corp',
    tpmUsed: 2450000,
    earnings: 127.50,
    slaHealth: 98,
    status: 'active',
    startedAt: '2026-06-04T08:00:00Z',
  },
  {
    id: 'sess-002',
    agentName: 'Beta Bot',
    client: 'Beta Industries',
    tpmUsed: 1820000,
    earnings: 94.25,
    slaHealth: 95,
    status: 'active',
    startedAt: '2026-06-04T06:30:00Z',
  },
  {
    id: 'sess-003',
    agentName: 'Gamma Assistant',
    client: 'Gamma LLC',
    tpmUsed: 3200000,
    earnings: 165.00,
    slaHealth: 100,
    status: 'active',
    startedAt: '2026-06-04T09:15:00Z',
  },
  {
    id: 'sess-004',
    agentName: 'Delta Agent',
    client: 'Delta Co',
    tpmUsed: 980000,
    earnings: 51.75,
    slaHealth: 92,
    status: 'completed',
    startedAt: '2026-06-03T14:00:00Z',
    endedAt: '2026-06-03T18:30:00Z',
    outcome: 'completed',
    slaCompliant: true,
    slashEvents: 2,
  },
  {
    id: 'sess-005',
    agentName: 'Epsilon Bot',
    client: 'Epsilon Inc',
    tpmUsed: 1200000,
    earnings: 0,
    slaHealth: 0,
    status: 'cancelled',
    startedAt: '2026-06-03T10:00:00Z',
    endedAt: '2026-06-03T10:45:00Z',
    cancellationReason: 'Client requested termination',
    partialCharges: 15.00,
  },
  {
    id: 'sess-006',
    agentName: 'Zeta Assistant',
    client: 'Zeta Corp',
    tpmUsed: 2100000,
    earnings: 108.50,
    slaHealth: 97,
    status: 'completed',
    startedAt: '2026-06-02T11:00:00Z',
    endedAt: '2026-06-02T16:00:00Z',
    outcome: 'completed',
    slaCompliant: true,
    slashEvents: 1,
  },
  {
    id: 'sess-007',
    agentName: 'Eta Bot',
    client: 'Eta LLC',
    tpmUsed: 500000,
    earnings: 0,
    slaHealth: 0,
    status: 'cancelled',
    startedAt: '2026-06-02T08:00:00Z',
    endedAt: '2026-06-02T08:15:00Z',
    cancellationReason: 'SLA violation detected',
    partialCharges: 8.50,
  },
  {
    id: 'sess-008',
    agentName: 'Theta Agent',
    client: 'Theta Industries',
    tpmUsed: 2800000,
    earnings: 145.00,
    slaHealth: 99,
    status: 'completed',
    startedAt: '2026-06-01T09:00:00Z',
    endedAt: '2026-06-01T17:00:00Z',
    outcome: 'completed',
    slaCompliant: true,
    slashEvents: 0,
  },
];

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Key',
    permissions: ['read', 'write', 'execute'],
    created: '2024-01-15T10:00:00Z',
    lastUsed: '2026-06-04T09:30:00Z',
    rateLimit: 10000,
  },
  {
    id: 'key-2',
    name: 'Development Key',
    permissions: ['read', 'write'],
    created: '2024-03-20T14:30:00Z',
    lastUsed: '2026-06-03T16:45:00Z',
    rateLimit: 1000,
  },
  {
    id: 'key-3',
    name: 'Analytics Key',
    permissions: ['read'],
    created: '2024-05-10T09:00:00Z',
    lastUsed: '2026-06-04T07:15:00Z',
    rateLimit: 5000,
  },
];

export const MOCK_LOGIN_HISTORY: LoginEntry[] = [
  {
    id: 'login-1',
    timestamp: '2026-06-04T09:30:00Z',
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    status: 'success',
  },
  {
    id: 'login-2',
    timestamp: '2026-06-03T14:20:00Z',
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    status: 'success',
  },
  {
    id: 'login-3',
    timestamp: '2026-06-02T08:00:00Z',
    ip: '10.0.0.50',
    device: 'Safari on macOS',
    status: 'failed',
  },
  {
    id: 'login-4',
    timestamp: '2026-06-01T18:45:00Z',
    ip: '192.168.1.100',
    device: 'Chrome on Windows',
    status: 'success',
  },
];

export const MOCK_CONNECTED_TOOLS: ConnectedTool[] = [
  {
    id: 'tool-1',
    name: 'Slack Integration',
    status: 'connected',
    lastSync: '2026-06-04T09:45:00Z',
    type: 'messaging',
  },
  {
    id: 'tool-2',
    name: 'GitHub Webhooks',
    status: 'connected',
    lastSync: '2026-06-04T09:30:00Z',
    type: 'development',
  },
  {
    id: 'tool-3',
    name: 'Datadog Monitor',
    status: 'disconnected',
    lastSync: '2026-06-03T12:00:00Z',
    type: 'monitoring',
  },
];

export const MOCK_NODE_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: '2026-06-04T09:45:00Z', level: 'info', message: 'Node heartbeat successful' },
  { id: 'log-2', timestamp: '2026-06-04T09:40:00Z', level: 'info', message: 'New session established: sess-003' },
  { id: 'log-3', timestamp: '2026-06-04T09:35:00Z', level: 'warn', message: 'High latency detected: 180ms' },
  { id: 'log-4', timestamp: '2026-06-04T09:30:00Z', level: 'info', message: 'API key validated: key-1' },
  { id: 'log-5', timestamp: '2026-06-04T09:25:00Z', level: 'error', message: 'Connection timeout to secondary node' },
  { id: 'log-6', timestamp: '2026-06-04T09:20:00Z', level: 'info', message: 'Skill invocation completed: text-generation' },
  { id: 'log-7', timestamp: '2026-06-04T09:15:00Z', level: 'warn', message: 'Rate limit approaching for key-2' },
  { id: 'log-8', timestamp: '2026-06-04T09:10:00Z', level: 'info', message: 'Session metrics reported successfully' },
  { id: 'log-9', timestamp: '2026-06-04T09:05:00Z', level: 'info', message: 'Node configuration updated' },
  { id: 'log-10', timestamp: '2026-06-04T09:00:00Z', level: 'warn', message: 'Memory usage above 80% threshold' },
];

export const MOCK_EARNINGS_BREAKDOWN: EarningsBreakdown = {
  baseEarnings: 4521.50,
  slaComplianceBonus: 452.15,
  genesisProgramBonus: 226.08,
  skillInvocationEarnings: 678.25,
};

export const MOCK_CLIENT_SESSIONS: ClientSession[] = [
  {
    id: 'client-sess-001',
    agentId: 'agent-1',
    agentName: 'Alpha Miner',
    clientId: 'client-1',
    status: 'active',
    startTime: '2026-06-04T08:00:00Z',
    tpmUsed: 2450000,
    tpmCap: 5000000,
    latency: 145,
    cost: 12.75,
    events: [
      { timestamp: '2026-06-04T08:00:00Z', type: 'heartbeat', message: 'Session started' },
      { timestamp: '2026-06-04T08:15:00Z', type: 'heartbeat', message: 'Heartbeat OK' },
      { timestamp: '2026-06-04T08:30:00Z', type: 'warning', message: 'High TPM usage detected' },
    ],
  },
  {
    id: 'client-sess-002',
    agentId: 'agent-2',
    agentName: 'Data Weaver',
    clientId: 'client-1',
    status: 'completed',
    startTime: '2026-06-03T14:00:00Z',
    endTime: '2026-06-03T18:30:00Z',
    duration: 16200,
    tpmUsed: 1800000,
    tpmCap: 3000000,
    latency: 195,
    cost: 54.00,
    rating: 5,
    feedback: 'Excellent data transformation results',
    events: [
      { timestamp: '2026-06-03T14:00:00Z', type: 'heartbeat', message: 'Session started' },
      { timestamp: '2026-06-03T16:00:00Z', type: 'session_end', message: 'Session completed successfully' },
    ],
  },
  {
    id: 'client-sess-003',
    agentId: 'agent-5',
    agentName: 'DeFi Strategist',
    clientId: 'client-1',
    status: 'failed',
    startTime: '2026-06-02T10:00:00Z',
    endTime: '2026-06-02T10:45:00Z',
    duration: 2700,
    tpmUsed: 2200000,
    tpmCap: 4500000,
    latency: 380,
    cost: 8.25,
    failureReason: 'SLA breach - latency exceeded threshold',
    refundApplied: 2.75,
    slaPenaltyApplied: 1.50,
    events: [
      { timestamp: '2026-06-02T10:00:00Z', type: 'heartbeat', message: 'Session started' },
      { timestamp: '2026-06-02T10:30:00Z', type: 'sla_breach', message: 'Latency exceeded SLA threshold' },
      { timestamp: '2026-06-02T10:45:00Z', type: 'session_end', message: 'Session terminated due to SLA breach' },
    ],
  },
  {
    id: 'client-sess-004',
    agentId: 'agent-3',
    agentName: 'Analytics Pro',
    clientId: 'client-1',
    status: 'completed',
    startTime: '2026-06-01T09:00:00Z',
    endTime: '2026-06-01T17:00:00Z',
    duration: 28800,
    tpmUsed: 2800000,
    tpmCap: 4000000,
    latency: 175,
    cost: 96.00,
    rating: 4,
    feedback: 'Good analytics but latency could be improved',
    events: [
      { timestamp: '2026-06-01T09:00:00Z', type: 'heartbeat', message: 'Session started' },
      { timestamp: '2026-06-01T12:00:00Z', type: 'session_extended', message: 'Session extended by client' },
      { timestamp: '2026-06-01T17:00:00Z', type: 'session_end', message: 'Session completed successfully' },
    ],
  },
];

export const MOCK_FAVORITES: FavoriteAgent[] = [
  { agentId: 'agent-1', addedAt: '2026-05-15T10:00:00Z', alertEnabled: true },
  { agentId: 'agent-5', addedAt: '2026-05-20T14:30:00Z', alertEnabled: false },
  { agentId: 'agent-7', addedAt: '2026-05-25T09:00:00Z', alertEnabled: true },
];

export function getAgentById(id: string): Agent | undefined {
  return MOCK_AGENTS.find(agent => agent.id === id);
}

export function getSessionById(id: string): ClientSession | undefined {
  return MOCK_CLIENT_SESSIONS.find(session => session.id === id);
}