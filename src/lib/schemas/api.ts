import { z } from 'zod'
import { AGENT_CATEGORIES, SESSION_STATUS, PROPOSAL_STATUS } from '@/constants'
import { PaginationSchema, SortSchema, SortDirectionSchema } from './common'

// ============ API REQUEST SCHEMAS ============

// Agent Filters
export const AgentFiltersSchema = z.object({
  category: z.enum(AGENT_CATEGORIES).optional(),
  status: z.enum(['active', 'paused', 'draft', 'archived']).optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
})

export const AgentSortSchema = SortSchema.extend({
  field: z.enum(['createdAt', 'qualityScore', 'totalSessions', 'avgRating']),
})

// Session Filters
export const SessionFiltersSchema = z.object({
  status: z.enum([
    SESSION_STATUS.PENDING,
    SESSION_STATUS.ACTIVE,
    SESSION_STATUS.COMPLETED,
    SESSION_STATUS.FAILED,
    SESSION_STATUS.CANCELLED,
    SESSION_STATUS.DISPUTED,
  ]).optional(),
  agentId: z.string().optional(),
  providerNodeId: z.string().optional(),
  dateRange: z.object({
    start: z.number().int().positive().optional(),
    end: z.number().int().positive().optional(),
  }).optional(),
})

export const SessionSortSchema = SortSchema.extend({
  field: z.enum(['startTime', 'endTime', 'totalCost', 'rating']),
})

// Proposal Filters
export const ProposalFiltersSchema = z.object({
  status: z.enum([
    PROPOSAL_STATUS.DRAFT,
    PROPOSAL_STATUS.ACTIVE,
    PROPOSAL_STATUS.PASSED,
    PROPOSAL_STATUS.FAILED,
    PROPOSAL_STATUS.EXECUTED,
    PROPOSAL_STATUS.EXPIRED,
  ]).optional(),
  category: z.enum(['slash_amounts', 'sla_thresholds', 'protocol_upgrade', 'tokenomics', 'treasury', 'other']).optional(),
  author: z.string().optional(),
})

export const ProposalSortSchema = SortSchema.extend({
  field: z.enum(['createdAt', 'endTime', 'votesFor', 'votesAgainst']),
})

// Skill Filters
export const SkillFiltersSchema = z.object({
  category: z.string().optional(),
  status: z.enum(['draft', 'under_review', 'approved', 'rejected', 'deprecated', 'pending']).optional(),
  minUsage: z.number().int().nonnegative().optional(),
  search: z.string().optional(),
})

export const SkillSortSchema = SortSchema.extend({
  field: z.enum(['createdAt', 'usageCount', 'avgRating', 'pricePerInvocation']),
})

// Node Filters
export const NodeFiltersSchema = z.object({
  status: z.enum(['online', 'offline', 'warning', 'maintenance']).optional(),
  location: z.string().optional(),
  minStake: z.number().nonnegative().optional(),
})

export const NodeSortSchema = SortSchema.extend({
  field: z.enum(['registeredAt', 'totalSessions', 'avgUptime', 'earningsTotal']),
})

// Stake Filters
export const StakeFiltersSchema = z.object({
  purpose: z.enum(['provider', 'agent', 'delegation']).optional(),
  minAmount: z.number().nonnegative().optional(),
})

// Pagination with Filters combined
export const AgentListParamsSchema = PaginationSchema.merge(AgentFiltersSchema).merge(
  z.object({ sort: AgentSortSchema.optional() })
)

export const SessionListParamsSchema = PaginationSchema.merge(SessionFiltersSchema).merge(
  z.object({ sort: SessionSortSchema.optional() })
)

export const ProposalListParamsSchema = PaginationSchema.merge(ProposalFiltersSchema).merge(
  z.object({ sort: ProposalSortSchema.optional() })
)

export const SkillListParamsSchema = PaginationSchema.merge(SkillFiltersSchema).merge(
  z.object({ sort: SkillSortSchema.optional() })
)

export const NodeListParamsSchema = PaginationSchema.merge(NodeFiltersSchema).merge(
  z.object({ sort: NodeSortSchema.optional() })
)