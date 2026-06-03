const fs = require('fs');
const data = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

// Remove stub exports first
let cleaned = data.replace(/\/\/ Stub exports for skills routes[\s\S]*?function getSkillById\(_id: string\) \{ return undefined; \}/, '');
cleaned = cleaned.trim().replace(/\n+$/, '\n');

const skillsCode = `

export const MOCK_SKILLS: Skill[] = [
  { id: "skill-001", name: "Web3 Wallet Detector", description: "Detect and validate Web3 wallet addresses", longDescription: "A comprehensive skill for detecting and validating Web3 wallet addresses.", version: "2.1.0", author: { id: "author-001", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", bio: "Web3 developer", reputation: 4.8, totalSkills: 12, joinedDate: "2024-03-15" }, category: "Web3", tags: ["wallet", "blockchain"], pricing: { type: "per-invocation", price: 0.002, currency: "ETH" }, usageCount: 15420, rating: 4.7, reviewCount: 89, status: "active", createdAt: "2024-06-10", updatedAt: "2025-01-15", useCases: ["Validate addresses", "Check balance"], specifications: { input: [{ name: "address", type: "string", description: "Wallet address", required: true }], output: [{ name: "isValid", type: "boolean", description: "Valid address" }], parameters: [{ name: "strict", type: "boolean", default: "false" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [{ code: "0xE001", description: "Timeout" }] }, versions: [{ version: "2.1.0", releaseDate: "2025-01-15", changelog: "Polygon support", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [{ id: "rev-001", authorId: "user-001", authorName: "Sarah Miller", authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", rating: 5, comment: "Works!", date: "2025-01-10" }], earnings: { total: 4250.80, byVersion: [{ version: "2.1.0", amount: 2100.50, invocations: 1050250 }], payoutHistory: [{ date: "2025-01-01", amount: 850.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-002", name: "ML Text Classifier", description: "Classify text using transformer models", longDescription: "Text classification powered by transformer models.", version: "1.3.2", author: { id: "author-002", name: "Dr. Emily Watson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", bio: "ML researcher", reputation: 4.9, totalSkills: 7, joinedDate: "2024-01-20" }, category: "AI/ML", tags: ["nlp", "classification"], pricing: { type: "subscription", price: 29.99, currency: "USD" }, usageCount: 8930, rating: 4.8, reviewCount: 56, status: "active", createdAt: "2024-04-22", updatedAt: "2025-01-08", useCases: ["Categorize tickets", "Filter content"], specifications: { input: [{ name: "text", type: "string", description: "Text to classify", required: true }], output: [{ name: "predictions", type: "array" }], parameters: [{ name: "threshold", type: "number", default: "0.5" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "1.3.2", releaseDate: "2025-01-08", changelog: "Optimized", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 8920.50, byVersion: [{ version: "1.3.2", amount: 5200.00, invocations: 173520 }], payoutHistory: [{ date: "2025-01-01", amount: 1200.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-003", name: "Data Analytics Pro", description: "Statistical analysis and visualization", longDescription: "Data analytics with statistical tests.", version: "3.0.1", author: { id: "author-003", name: "James Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", bio: "Data scientist", reputation: 4.6, totalSkills: 9, joinedDate: "2024-02-10" }, category: "Analytics", tags: ["data", "statistics"], pricing: { type: "free" }, usageCount: 23100, rating: 4.5, reviewCount: 124, status: "active", createdAt: "2024-03-18", updatedAt: "2025-01-12", useCases: ["Analyze data", "A/B tests"], specifications: { input: [{ name: "dataset", type: "object", description: "Data", required: true }], output: [{ name: "insights", type: "array" }], parameters: [{ name: "confidence", type: "number", default: "0.95" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "3.0.1", releaseDate: "2025-01-12", changelog: "Regression", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: undefined, integrationGuide: "Free tier" },
  { id: "skill-004", name: "Smart Contract Auditor", description: "Security analysis for Solidity", longDescription: "Security analysis detecting vulnerabilities.", version: "1.8.0", author: { id: "author-004", name: "Nina Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina", bio: "Security researcher", reputation: 4.9, totalSkills: 5, joinedDate: "2024-05-01" }, category: "Web3", tags: ["security", "solidity"], pricing: { type: "per-invocation", price: 0.05, currency: "ETH" }, usageCount: 4210, rating: 4.9, reviewCount: 38, status: "active", createdAt: "2024-07-15", updatedAt: "2025-01-10", useCases: ["Security checks", "Audit protocols"], specifications: { input: [{ name: "sourceCode", type: "string", description: "Solidity code", required: true }], output: [{ name: "riskScore", type: "number" }], parameters: [{ name: "depth", type: "string", default: "standard" }], returnValues: [{ code: "0x0000", description: "No issues" }], errorCodes: [] }, versions: [{ version: "1.8.0", releaseDate: "2025-01-10", changelog: "Reentrancy", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 12500.00, byVersion: [{ version: "1.8.0", amount: 8500.00, invocations: 170000 }], payoutHistory: [{ date: "2025-01-01", amount: 3500.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-005", name: "API Documentation Generator", description: "Auto-generate OpenAPI docs", longDescription: "Generate OpenAPI documentation.", version: "2.4.0", author: { id: "author-005", name: "Chris Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", bio: "Dev advocate", reputation: 4.7, totalSkills: 14, joinedDate: "2023-11-08" }, category: "Infrastructure", tags: ["documentation", "openapi"], pricing: { type: "subscription", price: 19.99, currency: "USD" }, usageCount: 31500, rating: 4.4, reviewCount: 201, status: "active", createdAt: "2024-02-28", updatedAt: "2025-01-05", useCases: ["Generate docs", "API explorers"], specifications: { input: [{ name: "sourceFiles", type: "array", description: "Paths", required: true }], output: [{ name: "openapiSpec", type: "object" }], parameters: [{ name: "version", type: "string", default: "3.0.0" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "2.4.0", releaseDate: "2025-01-05", changelog: "GraphQL", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 15600.00, byVersion: [{ version: "2.4.0", amount: 9600.00, invocations: 480240 }], payoutHistory: [{ date: "2025-01-01", amount: 1800.00, status: "paid" }] }, integrationGuide: "Build pipeline" },
  { id: "skill-006", name: "Image Background Remover", description: "AI background removal", longDescription: "Remove backgrounds with edge detection.", version: "1.5.0", author: { id: "author-006", name: "Rachel Green", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel", bio: "CV engineer", reputation: 4.5, totalSkills: 6, joinedDate: "2024-04-12" }, category: "AI/ML", tags: ["image", "cv"], pricing: { type: "per-invocation", price: 0.01, currency: "USD" }, usageCount: 45000, rating: 4.6, reviewCount: 178, status: "active", createdAt: "2024-06-05", updatedAt: "2025-01-14", useCases: ["Product images", "Batch process"], specifications: { input: [{ name: "image", type: "string", description: "Image", required: true }], output: [{ name: "result", type: "string" }], parameters: [{ name: "edgeSmoothing", type: "boolean", default: "true" }], returnValues: [{ code: "0x0000", description: "Success" }], errorCodes: [] }, versions: [{ version: "1.5.0", releaseDate: "2025-01-14", changelog: "WebP", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 8900.00, byVersion: [{ version: "1.5.0", amount: 6400.00, invocations: 640000 }], payoutHistory: [{ date: "2025-01-01", amount: 2200.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-007", name: "Cloud Cost Optimizer", description: "Optimize cloud spending", longDescription: "Identify waste and recommend right-sizing.", version: "2.2.0", author: { id: "author-007", name: "Marcus Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", bio: "DevOps architect", reputation: 4.8, totalSkills: 11, joinedDate: "2024-01-15" }, category: "Infrastructure", tags: ["cloud", "aws", "cost-optimization"], pricing: { type: "subscription", price: 49.99, currency: "USD" }, usageCount: 6780, rating: 4.7, reviewCount: 45, status: "active", createdAt: "2024-03-25", updatedAt: "2025-01-11", useCases: ["Idle instances", "Reserved coverage"], specifications: { input: [{ name: "provider", type: "string", description: "Provider", required: true }], output: [{ name: "savingsPotential", type: "number" }], parameters: [{ name: "includeReserved", type: "boolean", default: "true" }], returnValues: [{ code: "0x0000", description: "Complete" }], errorCodes: [] }, versions: [{ version: "2.2.0", releaseDate: "2025-01-11", changelog: "Azure", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 18400.00, byVersion: [{ version: "2.2.0", amount: 11200.00, invocations: 224112 }], payoutHistory: [{ date: "2025-01-01", amount: 2400.00, status: "paid" }] }, integrationGuide: "skill.install()" },
  { id: "skill-008", name: "Sentiment Analyzer", description: "Analyze text sentiment", longDescription: "Multi-dimensional sentiment analysis.", version: "1.2.0", author: { id: "author-002", name: "Dr. Emily Watson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", bio: "ML researcher", reputation: 4.9, totalSkills: 7, joinedDate: "2024-01-20" }, category: "AI/ML", tags: ["nlp", "sentiment"], pricing: { type: "per-invocation", price: 0.001, currency: "USD" }, usageCount: 38900, rating: 4.7, reviewCount: 156, status: "active", createdAt: "2024-05-18", updatedAt: "2025-01-09", useCases: ["Analyze reviews", "Monitor sentiment"], specifications: { input: [{ name: "text", type: "string", description: "Text", required: true }], output: [{ name: "overall", type: "object" }], parameters: [{ name: "granularity", type: "string", default: "document" }], returnValues: [{ code: "0x0000", description: "Complete" }], errorCodes: [] }, versions: [{ version: "1.2.0", releaseDate: "2025-01-09", changelog: "Aspect-based", status: "active" }], dependencies: { incoming: [], outgoing: [] }, reviews: [], earnings: { total: 6720.00, byVersion: [{ version: "1.2.0", amount: 4800.00, invocations: 4800000 }], payoutHistory: [{ date: "2025-01-01", amount: 1100.00, status: "paid" }] }, integrationGuide: "skill.install()" },
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
`;

fs.writeFileSync('src/lib/mock-data.ts', cleaned + skillsCode);
console.log('Updated mock-data.ts with full skills data');