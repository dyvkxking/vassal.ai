// Result Ranking - Composite scoring for search results

import type {
  AgentSearchDocument,
  SkillSearchDocument,
  ProposalSearchDocument,
} from './index'

// ============ AGENT SCORING ============

export interface AgentRankingWeights {
  titleMatchWeight?: number
  descriptionMatchWeight?: number
  qualityWeight?: number
  recencyWeight?: number
  popularityWeight?: number
}

const DEFAULT_AGENT_WEIGHTS: AgentRankingWeights = {
  titleMatchWeight: 3.0,
  descriptionMatchWeight: 1.0,
  qualityWeight: 0.2,
  recencyWeight: 0.1,
  popularityWeight: 0.15,
}

/**
 * Calculate composite score for an agent search document
 * - Text match score (title match = 3x, description = 1x)
 * - Quality score weight (avgRating / 5)
 * - Recency bonus (newer = slight boost)
 * - Popularity factor (totalSessions normalized)
 */
export function calculateAgentScore(
  document: AgentSearchDocument,
  query: string,
  weights: AgentRankingWeights = DEFAULT_AGENT_WEIGHTS
): number {
  const {
    titleMatchWeight = 3.0,
    descriptionMatchWeight = 1.0,
    qualityWeight = 0.2,
    recencyWeight = 0.1,
    popularityWeight = 0.15,
  } = weights

  const queryLower = query.toLowerCase()
  const queryTokens = queryLower.split(/\s+/).filter(Boolean)

  // Text match scores
  let titleScore = 0
  let descriptionScore = 0

  for (const token of queryTokens) {
    if (document.name.toLowerCase().includes(token)) {
      titleScore += titleMatchWeight
    }
    if (document.description.toLowerCase().includes(token)) {
      descriptionScore += descriptionMatchWeight
    }
    if (document.capabilities.toLowerCase().includes(token)) {
      descriptionScore += descriptionMatchWeight * 0.5 // Capabilities weighted less than title
    }
  }

  const textScore = titleScore + descriptionScore

  // Quality score (avgRating / 5 normalized to 0-1)
  const qualityScore = (document.avgRating / 5) * qualityWeight * 100

  // Recency bonus (newer agents get slight boost)
  // Max bonus for agents created in last 30 days, decays linearly
  const daysSinceCreation = (Date.now() - document.createdAt) / (1000 * 60 * 60 * 24)
  const recencyBonus = Math.max(0, 1 - daysSinceCreation / 30) * recencyWeight * 100

  // Popularity factor (normalized log scale)
  const maxSessions = 100000 // Baseline for normalization
  const popularityScore =
    Math.log10(document.totalSessions + 1) / Math.log10(maxSessions + 1) *
    popularityWeight * 100

  return textScore + qualityScore + recencyBonus + popularityScore
}

// ============ SKILL SCORING ============

export interface SkillRankingWeights {
  titleMatchWeight?: number
  descriptionMatchWeight?: number
  qualityWeight?: number
  usageWeight?: number
}

const DEFAULT_SKILL_WEIGHTS: SkillRankingWeights = {
  titleMatchWeight: 3.0,
  descriptionMatchWeight: 1.0,
  qualityWeight: 0.25,
  usageWeight: 0.2,
}

/**
 * Calculate composite score for a skill search document
 */
export function calculateSkillScore(
  document: SkillSearchDocument,
  query: string,
  weights: SkillRankingWeights = DEFAULT_SKILL_WEIGHTS
): number {
  const {
    titleMatchWeight = 3.0,
    descriptionMatchWeight = 1.0,
    qualityWeight = 0.25,
    usageWeight = 0.2,
  } = weights

  const queryLower = query.toLowerCase()
  const queryTokens = queryLower.split(/\s+/).filter(Boolean)

  // Text match scores
  let titleScore = 0
  let descriptionScore = 0

  for (const token of queryTokens) {
    if (document.name.toLowerCase().includes(token)) {
      titleScore += titleMatchWeight
    }
    if (document.description.toLowerCase().includes(token)) {
      descriptionScore += descriptionMatchWeight
    }
  }

  const textScore = titleScore + descriptionScore

  // Quality score
  const qualityScore = (document.avgRating / 5) * qualityWeight * 100

  // Usage score (normalized log scale)
  const maxUsage = 1000000
  const usageScore =
    Math.log10(document.usageCount + 1) / Math.log10(maxUsage + 1) *
    usageWeight * 100

  return textScore + qualityScore + usageScore
}

// ============ PROPOSAL SCORING ============

export interface ProposalRankingWeights {
  titleMatchWeight?: number
  descriptionMatchWeight?: number
  votesWeight?: number
  recencyWeight?: number
}

const DEFAULT_PROPOSAL_WEIGHTS: ProposalRankingWeights = {
  titleMatchWeight: 3.0,
  descriptionMatchWeight: 1.0,
  votesWeight: 0.2,
  recencyWeight: 0.1,
}

/**
 * Calculate composite score for a proposal search document
 */
export function calculateProposalScore(
  document: ProposalSearchDocument,
  query: string,
  weights: ProposalRankingWeights = DEFAULT_PROPOSAL_WEIGHTS
): number {
  const {
    titleMatchWeight = 3.0,
    descriptionMatchWeight = 1.0,
    votesWeight = 0.2,
    recencyWeight = 0.1,
  } = weights

  const queryLower = query.toLowerCase()
  const queryTokens = queryLower.split(/\s+/).filter(Boolean)

  // Text match scores
  let titleScore = 0
  let descriptionScore = 0

  for (const token of queryTokens) {
    if (document.title.toLowerCase().includes(token)) {
      titleScore += titleMatchWeight
    }
    if (document.description.toLowerCase().includes(token)) {
      descriptionScore += descriptionMatchWeight
    }
  }

  const textScore = titleScore + descriptionScore

  // Votes score (total voting power normalized)
  const totalVotes = document.votesFor + document.votesAgainst
  const maxVotes = 10000000
  const votesScore =
    Math.log10(totalVotes + 1) / Math.log10(maxVotes + 1) *
    votesWeight * 100

  // Recency bonus (active proposals get boost)
  const daysUntilEnd = (document.endTime - Date.now()) / (1000 * 60 * 60 * 24)
  const isActive = document.endTime > Date.now()
  const recencyBonus = isActive
    ? Math.max(0, 1 - Math.abs(daysUntilEnd) / 7) * recencyWeight * 100
    : 0

  return textScore + votesScore + recencyBonus
}
