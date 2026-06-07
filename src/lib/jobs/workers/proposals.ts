// Proposal status worker - handles proposal status transitions and execution

import type { Job, JobResult, ProposalTransition } from '../types'
import { MOCK_PROPOSALS } from '@/lib/mock-data'
import { PROPOSAL_STATUS } from '@/constants'

// Minimum voting period in milliseconds (24 hours)
const MIN_VOTING_PERIOD_MS = 86400000

/**
 * Check if a proposal should transition to passed status
 * Conditions: endTime passed AND votesFor > votesAgainst AND quorum met
 */
export function shouldProposalPass(proposal: typeof MOCK_PROPOSALS[0]): boolean {
  const now = Date.now()

  // Check if voting period has ended
  if (now < proposal.endTime) return false

  // Check if votes for > votes against
  if (proposal.votesFor <= proposal.votesAgainst) return false

  // Check if quorum is met
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  if (totalVotes < proposal.quorumRequired) return false

  return true
}

/**
 * Check if a proposal should transition to failed status
 * Conditions: endTime passed AND (votesFor <= votesAgainst OR quorum not met)
 */
export function shouldProposalFail(proposal: typeof MOCK_PROPOSALS[0]): boolean {
  const now = Date.now()

  // Check if voting period has ended
  if (now < proposal.endTime) return false

  // Check if voting period was at least minimum duration
  if (proposal.endTime - proposal.startTime < MIN_VOTING_PERIOD_MS) return false

  // Check if it failed (for <= against or quorum not met)
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  const quorumNotMet = totalVotes < proposal.quorumRequired

  return proposal.votesFor <= proposal.votesAgainst || quorumNotMet
}

/**
 * Check if a proposal should expire (never reached quorum and time expired)
 */
export function shouldProposalExpire(proposal: typeof MOCK_PROPOSALS[0]): boolean {
  const now = Date.now()

  // Only active proposals can expire
  if (proposal.status !== 'active') return false

  // Check if proposal has been active for extended period without reaching quorum
  const maxActivePeriodMs = 14 * 86400000 // 14 days max
  if (now - proposal.startTime < maxActivePeriodMs) return false

  // Check if quorum was never met
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
  return totalVotes < proposal.quorumRequired
}

/**
 * Update all proposal statuses based on current state
 */
export async function updateProposalStatuses(): Promise<{
  transitions: ProposalTransition[]
  errors: string[]
}> {
  const transitions: ProposalTransition[] = []
  const errors: string[] = []

  for (const proposal of MOCK_PROPOSALS) {
    // Only process active proposals
    if (proposal.status !== 'active') continue

    try {
      if (shouldProposalPass(proposal)) {
        const transition: ProposalTransition = {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PROPOSAL_STATUS.PASSED,
          votesFor: proposal.votesFor,
          votesAgainst: proposal.votesAgainst,
          quorumMet: true,
          timestamp: Date.now(),
        }
        transitions.push(transition)

        // In real implementation:
        // 1. Update proposal status in database
        // 2. Queue execution job if has executionPlan
        // 3. Send notifications

        console.log(`[Proposals] Proposal ${proposal.id} PASSED`)
      } else if (shouldProposalFail(proposal)) {
        const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
        const transition: ProposalTransition = {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PROPOSAL_STATUS.FAILED,
          votesFor: proposal.votesFor,
          votesAgainst: proposal.votesAgainst,
          quorumMet: totalVotes >= proposal.quorumRequired,
          timestamp: Date.now(),
        }
        transitions.push(transition)

        console.log(`[Proposals] Proposal ${proposal.id} FAILED`)
      } else if (shouldProposalExpire(proposal)) {
        const transition: ProposalTransition = {
          proposalId: proposal.id,
          fromStatus: proposal.status,
          toStatus: PROPOSAL_STATUS.EXPIRED,
          votesFor: proposal.votesFor,
          votesAgainst: proposal.votesAgainst,
          quorumMet: false,
          timestamp: Date.now(),
        }
        transitions.push(transition)

        console.log(`[Proposals] Proposal ${proposal.id} EXPIRED`)
      }
    } catch (error) {
      errors.push(`Proposal ${proposal.id}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { transitions, errors }
}

/**
 * Execute a passed proposal
 */
export async function executeProposal(proposalId: string): Promise<{
  success: boolean
  error?: string
  executionDetails?: Record<string, unknown>
}> {
  const proposal = MOCK_PROPOSALS.find((p) => p.id === proposalId)

  if (!proposal) {
    return { success: false, error: `Proposal not found: ${proposalId}` }
  }

  if (proposal.status !== 'passed') {
    return { success: false, error: `Proposal is not in passed status: ${proposal.status}` }
  }

  if (!proposal.executionPlan) {
    return { success: false, error: 'Proposal has no execution plan' }
  }

  // In a real implementation:
  // 1. Parse execution plan
  // 2. Execute upgrade scripts in order
  // 3. Verify execution results
  // 4. Update proposal status to executed
  // 5. Emit on-chain event

  const executionDetails = {
    proposalId,
    executionPlan: proposal.executionPlan,
    executedAt: Date.now(),
    executionSteps: ['validate', 'execute', 'verify'],
  }

  console.log(`[Proposals] Executed proposal ${proposalId}`)

  return { success: true, executionDetails }
}

/**
 * Execute all pending passed proposals
 */
export async function executePendingProposals(): Promise<{
  executed: string[]
  failed: string[]
}> {
  const executed: string[] = []
  const failed: string[] = []

  for (const proposal of MOCK_PROPOSALS) {
    if (proposal.status !== 'passed') continue

    const result = await executeProposal(proposal.id)
    if (result.success) {
      executed.push(proposal.id)
    } else {
      failed.push(proposal.id)
    }
  }

  return { executed, failed }
}

/**
 * Job processor for proposal status jobs
 */
export async function processProposalJob(
  job: Job<{ proposalId?: string }>
): Promise<JobResult> {
  const startTime = Date.now()

  try {
    // If specific proposalId provided, execute it
    if (job.data.proposalId) {
      const result = await executeProposal(job.data.proposalId)

      return {
        success: result.success,
        jobId: job.id,
        type: 'ProposalStatusJob',
        data: job.data,
        result: result.executionDetails,
        error: result.error,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    // Otherwise, update all proposal statuses
    const result = await updateProposalStatuses()

    return {
      success: result.errors.length === 0,
      jobId: job.id,
      type: 'ProposalStatusJob',
      data: job.data,
      result: result,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'ProposalStatusJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}