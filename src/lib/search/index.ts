// Search Index - Document interfaces and index builders

import type { Agent, Skill, Proposal } from '@/types'

// ============ AGENT SEARCH DOCUMENT ============
export interface AgentSearchDocument {
  id: string
  name: string
  description: string
  category: string
  capabilities: string // Comma-separated capability names
  avgRating: number
  priceMin: number
  totalSessions: number
  createdAt: number
  status: string
}

// ============ SKILL SEARCH DOCUMENT ============
export interface SkillSearchDocument {
  id: string
  name: string
  description: string
  category: string
  avgRating: number
  usageCount: number
  status: string
  createdAt: number
}

// ============ PROPOSAL SEARCH DOCUMENT ============
export interface ProposalSearchDocument {
  id: string
  title: string
  description: string
  status: string
  votesFor: number
  votesAgainst: number
  endTime: number
  category: string
  author: string
  createdAt: number
  quorumMet: boolean
}

// ============ INDEX BUILDERS ============

/**
 * Build search index from agent data
 */
export function buildAgentIndex(agents: Agent[]): AgentSearchDocument[] {
  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    category: agent.category,
    capabilities: agent.capabilities.map((c) => c.name).join(' '),
    avgRating: agent.avgRating,
    priceMin: agent.pricing.pricePerMinute || agent.pricing.flatPrice || 0,
    totalSessions: agent.totalSessions,
    createdAt: agent.createdAt,
    status: agent.status,
  }))
}

/**
 * Build search index from skill data
 */
export function buildSkillIndex(skills: Skill[]): SkillSearchDocument[] {
  return skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    avgRating: skill.avgRating,
    usageCount: skill.usageCount,
    status: skill.status,
    createdAt: skill.createdAt,
  }))
}

/**
 * Build search index from proposal data
 */
export function buildProposalIndex(proposals: Proposal[]): ProposalSearchDocument[] {
  return proposals.map((proposal) => ({
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    status: proposal.status,
    votesFor: proposal.votesFor,
    votesAgainst: proposal.votesAgainst,
    endTime: proposal.endTime,
    category: proposal.category,
    author: proposal.author,
    createdAt: proposal.createdAt,
    quorumMet: proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain >= proposal.quorumRequired,
  }))
}

// Re-export types for convenience
export type { Agent, Skill, Proposal }
