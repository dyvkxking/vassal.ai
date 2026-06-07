import { z } from 'zod'
import { PROPOSAL_STATUS, VOTE_OPTIONS } from '@/constants'

// ============ GOVERNANCE ============

export const ProposalCategorySchema = z.enum([
  'slash_amounts',
  'sla_thresholds',
  'protocol_upgrade',
  'tokenomics',
  'treasury',
  'other',
])

export const ProposalStatusSchema = z.enum([
  PROPOSAL_STATUS.DRAFT,
  PROPOSAL_STATUS.ACTIVE,
  PROPOSAL_STATUS.PASSED,
  PROPOSAL_STATUS.FAILED,
  PROPOSAL_STATUS.EXECUTED,
  PROPOSAL_STATUS.EXPIRED,
])

export const ProposalSchema = z.object({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  description: z.string(),
  category: ProposalCategorySchema,
  status: ProposalStatusSchema,
  votesFor: z.number().nonnegative(),
  votesAgainst: z.number().nonnegative(),
  votesAbstain: z.number().nonnegative(),
  totalVoters: z.number().int().nonnegative(),
  quorumRequired: z.number().min(0).max(1),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive(),
  executionPlan: z.string().optional(),
  createdAt: z.number().int().positive(),
})

export const CreateProposalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  category: ProposalCategorySchema,
  executionPlan: z.string().optional(),
})

export const VoteChoiceSchema = z.enum([VOTE_OPTIONS.FOR, VOTE_OPTIONS.AGAINST, VOTE_OPTIONS.ABSTAIN])

export const VoteSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  voter: z.string(),
  choice: VoteChoiceSchema,
  votingPower: z.number().nonnegative(),
  timestamp: z.number().int().positive(),
})

export const CastVoteSchema = z.object({
  proposalId: z.string().min(1),
  choice: VoteChoiceSchema,
  weight: z.number().nonnegative().optional(),
})

export type Proposal = z.infer<typeof ProposalSchema>
export type CreateProposal = z.infer<typeof CreateProposalSchema>
export type Vote = z.infer<typeof VoteSchema>
export type CastVote = z.infer<typeof CastVoteSchema>
export type ProposalCategory = z.infer<typeof ProposalCategorySchema>
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>
export type VoteChoice = z.infer<typeof VoteChoiceSchema>