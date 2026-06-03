import type { Agent, ProviderNode, Session, ApiKey, LoginEntry, ConnectedTool, LogEntry, EarningsBreakdown, AgentCategory, CategoryBreakdown, PricingTrend, TpmDistribution, QualityDistribution, ClientSession, FavoriteAgent, Skill, SkillAnalytics, Proposal, Vote, Delegator, Delegation, GovernanceStats } from '@/types';

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

export const MOCK_SKILLS: Skill[] = [
  { id: "skill-001", name: "Web3 Wallet Detector", description: "Detect and validate Web3 wallet addresses", longDescription: "A comprehensive skill for detecting and validating Web3 wallet addresses.", version: "2.1.0", author: { id: "author-001", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", bio: "Web3 developer", reputation: 4.8, totalSkills: 12, joinedDate: "2024-03-15" }, category: "Web3", tags: ["wallet", "blockchain"], pricing: { type: "per-invocation", price: 0.002, currency: "ETH" }, usageCount: 15420, rating: 4.7, reviewCount: 89, status: "active", createdAt: "2024-06-10", updatedAt: "2025-01-15", useCases: ["Validate addresses", "Check balance"], specifications: { input: [{ name: "address", type: "string", description: "Wallet address", required: true }], output: [{ name: "isValid", type: "boolean", description: "Valid address" }], parameters: [{ name: "strict", type: "boolean", default: "false", description: "Enable strict validation" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [{ code: "0xE001", description: "Timeout" }] }, versions: [{ version: "2.1.0", releaseDate: "2025-01-15", changelog: "Polygon support", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [{ id: "rev-001", authorId: "user-001", authorName: "Sarah Miller", authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", rating: 5, comment: "Works!", date: "2025-01-10" }], earnings: { total: 4250.80, byVersion: [{ version: "2.1.0", amount: 2100.50, invocations: 1050250 }], payoutHistory: [{ date: "2025-01-01", amount: 850.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-002", name: "ML Text Classifier", description: "Classify text using transformer models", longDescription: "Text classification powered by transformer models.", version: "1.3.2", author: { id: "author-002", name: "Dr. Emily Watson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", bio: "ML researcher", reputation: 4.9, totalSkills: 7, joinedDate: "2024-01-20" }, category: "AI/ML", tags: ["nlp", "classification"], pricing: { type: "subscription", price: 29.99, currency: "USD" }, usageCount: 8930, rating: 4.8, reviewCount: 56, status: "active", createdAt: "2024-04-22", updatedAt: "2025-01-08", useCases: ["Categorize tickets", "Filter content"], specifications: { input: [{ name: "text", type: "string", description: "Text to classify", required: true }], output: [{ name: "predictions", type: "array", description: "Classification results" }], parameters: [{ name: "threshold", type: "number", default: "0.5", description: "Confidence threshold" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "1.3.2", releaseDate: "2025-01-08", changelog: "Optimized", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 8920.50, byVersion: [{ version: "1.3.2", amount: 5200.00, invocations: 173520 }], payoutHistory: [{ date: "2025-01-01", amount: 1200.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-003", name: "Data Analytics Pro", description: "Statistical analysis and visualization", longDescription: "Data analytics with statistical tests.", version: "3.0.1", author: { id: "author-003", name: "James Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", bio: "Data scientist", reputation: 4.6, totalSkills: 9, joinedDate: "2024-02-10" }, category: "Analytics", tags: ["data", "statistics"], pricing: { type: "free" }, usageCount: 23100, rating: 4.5, reviewCount: 124, status: "active", createdAt: "2024-03-18", updatedAt: "2025-01-12", useCases: ["Analyze data", "A/B tests"], specifications: { input: [{ name: "dataset", type: "object", description: "Data", required: true }], output: [{ name: "insights", type: "array", description: "Key findings from analysis" }], parameters: [{ name: "confidence", type: "number", default: "0.95", description: "Confidence level for tests" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "3.0.1", releaseDate: "2025-01-12", changelog: "Regression", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: undefined, integrationGuide: "Free tier" },
  { id: "skill-004", name: "Smart Contract Auditor", description: "Security analysis for Solidity", longDescription: "Security analysis detecting vulnerabilities.", version: "1.8.0", author: { id: "author-004", name: "Nina Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina", bio: "Security researcher", reputation: 4.9, totalSkills: 5, joinedDate: "2024-05-01" }, category: "Web3", tags: ["security", "solidity"], pricing: { type: "per-invocation", price: 0.05, currency: "ETH" }, usageCount: 4210, rating: 4.9, reviewCount: 38, status: "active", createdAt: "2024-07-15", updatedAt: "2025-01-10", useCases: ["Security checks", "Audit protocols"], specifications: { input: [{ name: "sourceCode", type: "string", description: "Solidity code", required: true }], output: [{ name: "riskScore", type: "number", description: "Security score 0-100" }], parameters: [{ name: "depth", type: "string", default: "standard", description: "Analysis depth" }], returnValues: [{ code: "0x0000", description: "No issues" }], errorCodes: [] }, versions: [{ version: "1.8.0", releaseDate: "2025-01-10", changelog: "Reentrancy", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 12500.00, byVersion: [{ version: "1.8.0", amount: 8500.00, invocations: 170000 }], payoutHistory: [{ date: "2025-01-01", amount: 3500.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-005", name: "API Documentation Generator", description: "Auto-generate OpenAPI docs", longDescription: "Generate OpenAPI documentation.", version: "2.4.0", author: { id: "author-005", name: "Chris Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", bio: "Dev advocate", reputation: 4.7, totalSkills: 14, joinedDate: "2023-11-08" }, category: "Infrastructure", tags: ["documentation", "openapi"], pricing: { type: "subscription", price: 19.99, currency: "USD" }, usageCount: 31500, rating: 4.4, reviewCount: 201, status: "active", createdAt: "2024-02-28", updatedAt: "2025-01-05", useCases: ["Generate docs", "API explorers"], specifications: { input: [{ name: "sourceFiles", type: "array", description: "Paths", required: true }], output: [{ name: "openapiSpec", type: "object", description: "OpenAPI 3.0 specification" }], parameters: [{ name: "version", type: "string", default: "3.0.0", description: "OpenAPI version" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "2.4.0", releaseDate: "2025-01-05", changelog: "GraphQL", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 15600.00, byVersion: [{ version: "2.4.0", amount: 9600.00, invocations: 480240 }], payoutHistory: [{ date: "2025-01-01", amount: 1800.00, status: "paid" }] }, integrationGuide: "Build pipeline" },
  { id: "skill-006", name: "Image Background Remover", description: "AI background removal", longDescription: "Remove backgrounds with edge detection.", version: "1.5.0", author: { id: "author-006", name: "Rachel Green", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel", bio: "CV engineer", reputation: 4.5, totalSkills: 6, joinedDate: "2024-04-12" }, category: "AI/ML", tags: ["image", "cv"], pricing: { type: "per-invocation", price: 0.01, currency: "USD" }, usageCount: 45000, rating: 4.6, reviewCount: 178, status: "active", createdAt: "2024-06-05", updatedAt: "2025-01-14", useCases: ["Product images", "Batch process"], specifications: { input: [{ name: "image", type: "string", description: "Image", required: true }], output: [{ name: "result", type: "string", description: "Base64 PNG with transparent background" }], parameters: [{ name: "edgeSmoothing", type: "boolean", default: "true", description: "Apply edge refinement" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "1.5.0", releaseDate: "2025-01-14", changelog: "WebP", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 8900.00, byVersion: [{ version: "1.5.0", amount: 6400.00, invocations: 640000 }], payoutHistory: [{ date: "2025-01-01", amount: 2200.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-007", name: "Cloud Cost Optimizer", description: "Optimize cloud spending", longDescription: "Identify waste and recommend right-sizing.", version: "2.2.0", author: { id: "author-007", name: "Marcus Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", bio: "DevOps architect", reputation: 4.8, totalSkills: 11, joinedDate: "2024-01-15" }, category: "Infrastructure", tags: ["cloud", "aws", "cost-optimization"], pricing: { type: "subscription", price: 49.99, currency: "USD" }, usageCount: 6780, rating: 4.7, reviewCount: 45, status: "active", createdAt: "2024-03-25", updatedAt: "2025-01-11", useCases: ["Idle instances", "Reserved coverage"], specifications: { input: [{ name: "provider", type: "string", description: "Provider", required: true }], output: [{ name: "savingsPotential", type: "number", description: "Estimated monthly savings in USD" }], parameters: [{ name: "includeReserved", type: "boolean", default: "true", description: "Include reserved instance recommendations" }], returnValues: [{ code: "0x0000", description: "Complete" }], errorCodes: [] }, versions: [{ version: "2.2.0", releaseDate: "2025-01-11", changelog: "Azure", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 18400.00, byVersion: [{ version: "2.2.0", amount: 11200.00, invocations: 224112 }], payoutHistory: [{ date: "2025-01-01", amount: 2400.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-008", name: "Sentiment Analyzer", description: "Analyze text sentiment", longDescription: "Multi-dimensional sentiment analysis.", version: "1.2.0", author: { id: "author-002", name: "Dr. Emily Watson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", bio: "ML researcher", reputation: 4.9, totalSkills: 7, joinedDate: "2024-01-20" }, category: "AI/ML", tags: ["nlp", "sentiment"], pricing: { type: "per-invocation", price: 0.001, currency: "USD" }, usageCount: 38900, rating: 4.7, reviewCount: 156, status: "active", createdAt: "2024-05-18", updatedAt: "2025-01-09", useCases: ["Analyze reviews", "Monitor sentiment"], specifications: { input: [{ name: "text", type: "string", description: "Text", required: true }], output: [{ name: "overall", type: "object", description: "Overall sentiment score and label" }], parameters: [{ name: "granularity", type: "string", default: "document", description: "Analysis level" }], returnValues: [{ code: "0x0000", description: "Complete" }], errorCodes: [] }, versions: [{ version: "1.2.0", releaseDate: "2025-01-09", changelog: "Aspect-based", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 6720.00, byVersion: [{ version: "1.2.0", amount: 4800.00, invocations: 4800000 }], payoutHistory: [{ date: "2025-01-01", amount: 1100.00, status: "paid" }] }, integrationGuide: "skill.install()" },
];

export function getSkillById(id: string): Skill | undefined {
  return MOCK_SKILLS.find((s) => s.id === id);
}

export function getSkillsByCategory(category: string): Skill[] {
  return MOCK_SKILLS.filter((s) => s.category === category);
}

export function getTrendingSkills(limit = 5): Skill[] {
  return [...MOCK_SKILLS].sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
}

export function getNewSkills(limit = 5): Skill[] {
  return [...MOCK_SKILLS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

// Governance Mock Data
export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-001",
    title: "Increase TPM Floor to 2M for All Agents",
    summary: "Raise the minimum TPM floor requirement from 1M to 2M to improve network quality.",
    category: "Protocol Upgrade",
    author: "0x1234...abcd",
    status: "active",
    createdAt: "2026-06-01T10:00:00Z",
    votesFor: 4500000,
    votesAgainst: 1200000,
    votesAbstain: 300000,
    discussion: [
      { id: "disc-001", address: "0xabcd...1234", choice: "for", comment: "Great proposal! The network needs higher quality standards.", timestamp: "2026-06-02T14:00:00Z" },
      { id: "disc-002", address: "0xefgh...5678", choice: "against", comment: "This excludes smaller providers from participating.", timestamp: "2026-06-02T15:30:00Z" },
      { id: "disc-003", address: "0xijkl...9012", choice: "for", comment: "Agreed, higher standards benefit everyone.", timestamp: "2026-06-03T09:00:00Z" },
    ],
    content: {
      motivation: "Current network has many low-quality agents that degrade overall performance.",
      specification: "Raise minimum TPM floor from 1M to 2M for all agent categories.",
      implementationPlan: "1. Update contract constants\n2. 30-day grace period for existing agents\n3. Reject new agents below threshold",
      timeline: "Implementation: 2 weeks after approval. Grace period: 30 days.",
    },
  },
  {
    id: "prop-002",
    title: "Add DeFi Category to Agent Classifications",
    summary: "Introduce DeFi as a new agent category for specialized agents.",
    category: "SLA Threshold",
    author: "0x5678...efgh",
    status: "passed",
    createdAt: "2026-05-25T08:00:00Z",
    votesFor: 6200000,
    votesAgainst: 800000,
    votesAbstain: 200000,
    discussion: [],
    content: {
      motivation: "Many agents are providing DeFi services but lack proper classification.",
      specification: "Add 'DeFi' as a new AgentCategory option.",
      implementationPlan: "1. Update enum in contract\n2. Update frontend dropdown\n3. Migrate existing agents",
      timeline: "Implementation: 1 week after approval.",
    },
  },
  {
    id: "prop-003",
    title: "Slash Amounts: Reduce Penalty from 50% to 30%",
    summary: "Lower the slash amount for SLA violations to encourage more participation.",
    category: "Slash Amounts",
    author: "0x9abc...ijkl",
    status: "failed",
    createdAt: "2026-05-20T12:00:00Z",
    votesFor: 1500000,
    votesAgainst: 5500000,
    votesAbstain: 500000,
    discussion: [],
    content: {
      motivation: "High slash amounts discourage providers from joining.",
      specification: "Reduce penalty from 50% to 30% of earnings.",
      implementationPlan: "Update penalty calculation in contract.",
      timeline: "Immediate effect after approval.",
    },
  },
  {
    id: "prop-004",
    title: "Governance: Add Multi-Step Voting Process",
    summary: "Implement a 3-step voting process for critical protocol upgrades.",
    category: "Protocol Upgrade",
    author: "0xdef0...mnop",
    status: "draft",
    createdAt: "2026-06-03T16:00:00Z",
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    discussion: [],
    content: {
      motivation: "Critical upgrades need more careful deliberation.",
      specification: "Introduce proposal discussion period, then voting period, then execution delay.",
      implementationPlan: "1. Add discussion period (7 days)\n2. Voting period (5 days)\n3. Execution delay (3 days)",
      timeline: "Implementation: 4 weeks after approval.",
    },
  },
  {
    id: "prop-005",
    title: "Increase Latency SLA from 200ms to 180ms",
    summary: "Tighten the latency requirement to improve user experience.",
    category: "SLA Threshold",
    author: "0x4321...qrst",
    status: "queued",
    createdAt: "2026-06-05T09:00:00Z",
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    discussion: [],
    content: {
      motivation: "180ms provides better UX for real-time applications.",
      specification: "Change max latency SLA from 200ms to 180ms.",
      implementationPlan: "1. Update contract\n2. Notify providers\n3. 60-day compliance window",
      timeline: "Implementation: 2 weeks after approval. Compliance window: 60 days.",
    },
  },
];

export function getProposalById(id: string): Proposal | undefined {
  return MOCK_PROPOSALS.find((p) => p.id === id);
}

export const MOCK_VOTES: Vote[] = [
  { id: "vote-001", proposalId: "prop-001", address: "0x1234...abcd", choice: "for", reason: "Good for network", timestamp: "2026-06-02T14:00:00Z", votingPower: 500000 },
  { id: "vote-002", proposalId: "prop-001", address: "0x5678...efgh", choice: "against", reason: "Too restrictive", timestamp: "2026-06-02T15:30:00Z", votingPower: 300000 },
  { id: "vote-003", proposalId: "prop-002", address: "0x1234...abcd", choice: "for", timestamp: "2026-05-26T10:00:00Z", votingPower: 500000 },
];

export const MOCK_DELEGATORS: Delegator[] = [
  { address: "0xaaaa...1111", amount: 1500000, lastActivity: "2026-06-03T10:00:00Z" },
  { address: "0xbbbb...2222", amount: 800000, lastActivity: "2026-06-02T15:00:00Z" },
  { address: "0xcccc...3333", amount: 2200000, lastActivity: "2026-06-01T09:00:00Z" },
];

export const MOCK_DELEGATIONS: Delegation[] = [
  { id: "del-001", delegator: "0xaaaa...1111", delegate: "0xCurrentDelegate", amount: 1500000, timestamp: "2026-05-15T10:00:00Z" },
  { id: "del-002", delegator: "0xbbbb...2222", delegate: "0xCurrentDelegate", amount: 800000, timestamp: "2026-05-20T14:00:00Z" },
  { id: "del-003", delegator: "0xcccc...3333", delegate: "0xCurrentDelegate", amount: 2200000, timestamp: "2026-06-01T08:00:00Z" },
];

export const GOVERNANCE_STATS: GovernanceStats = {
  totalProposals: 47,
  participationRate: 68.5,
  avgVoteMargin: 12.3,
  proposalSuccessRate: 72.3,
};

export const SKILL_CATEGORIES = ["Web3", "Data", "Analytics", "Infrastructure", "AI/ML", "Communication", "Security", "Automation"];

export const MOCK_ANALYTICS: SkillAnalytics = {
  totalInvocations: 284560,
  uniqueAgents: 1450,
  totalEarnings: 42890.50,
  revenueBySkill: [
    { skillId: "skill-001", skillName: "Web3 Wallet Detector", revenue: 4250.80, invocations: 15420 },
    { skillId: "skill-004", skillName: "Smart Contract Auditor", revenue: 12500.00, invocations: 4210 },
    { skillId: "skill-005", skillName: "API Documentation Generator", revenue: 15600.00, invocations: 31500 },
    { skillId: "skill-006", skillName: "Image Background Remover", revenue: 8900.00, invocations: 45000 },
    { skillId: "skill-007", skillName: "Cloud Cost Optimizer", revenue: 18400.00, invocations: 6780 },
    { skillId: "skill-008", skillName: "Sentiment Analyzer", revenue: 6720.00, invocations: 38900 },
    { skillId: "skill-002", skillName: "ML Text Classifier", revenue: 8920.50, invocations: 8930 },
    { skillId: "skill-003", skillName: "Data Analytics Pro", revenue: 0, invocations: 23100 },
  ],
  adoptionTrend: [
    { date: "2024-07", count: 12000 },
    { date: "2024-08", count: 18500 },
    { date: "2024-09", count: 24600 },
    { date: "2024-10", count: 31200 },
    { date: "2024-11", count: 38900 },
    { date: "2024-12", count: 45200 },
    { date: "2025-01", count: 52160 },
  ],
  topUsingAgents: [
    { agentId: "agent-001", agentName: "DeFi Portfolio Manager", invocations: 15200 },
    { agentId: "agent-002", agentName: "E-commerce Bot", invocations: 12800 },
    { agentId: "agent-003", agentName: "Customer Support AI", invocations: 9800 },
    { agentId: "agent-004", agentName: "Analytics Dashboard", invocations: 8400 },
    { agentId: "agent-005", agentName: "Security Monitor", invocations: 6200 },
  ],
  errorRate: 2.3,
};
