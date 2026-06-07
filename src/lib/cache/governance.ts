/**
 * Skill & Proposal caching functions
 */

import { caches } from './core';
import {
  skillListKey,
  skillKey,
  proposalKey,
  governanceStatsKey,
} from './keys';
import {
  SKILL_LIST_TTL,
  PROPOSAL_TTL,
  GOVERNANCE_STATS_TTL,
} from './ttl';

interface Skill {
  id: string;
  name: string;
  category: string;
  status: string;
  author: string;
  [key: string]: unknown;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  author: string;
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
  [key: string]: unknown;
}

interface SkillListResult {
  skills: Skill[];
  total: number;
}

interface GovernanceStats {
  activeProposals: number;
  totalDelegations: number;
  participationRate: number;
  [key: string]: unknown;
}

/**
 * Get skill list from cache
 */
export function getSkillListCached(category?: string): SkillListResult | undefined {
  const key = skillListKey(category);
  return caches.skill.get(key);
}

/**
 * Cache skill list (10min TTL)
 */
export function setSkillListCached(category: string | undefined, data: SkillListResult): void {
  const key = skillListKey(category);
  caches.skill.set(key, data, SKILL_LIST_TTL);
}

/**
 * Invalidate all skill list caches
 */
export function invalidateSkillList(): void {
  const keys = caches.skill.keys('vassal:skills:list');
  for (const key of keys) {
    caches.skill.delete(key);
  }
}

/**
 * Get single skill from cache
 */
export function getSkillCached(id: string): Skill | undefined {
  const key = skillKey(id);
  return caches.skill.get(key);
}

/**
 * Cache single skill
 */
export function setSkillCached(id: string, data: Skill): void {
  const key = skillKey(id);
  caches.skill.set(key, data, SKILL_LIST_TTL);
}

/**
 * Invalidate skill cache
 */
export function invalidateSkill(id: string): void {
  const key = skillKey(id);
  caches.skill.delete(key);
  invalidateSkillList();
}

/**
 * Get proposal from cache
 */
export function getProposalCached(id: string): Proposal | undefined {
  const key = proposalKey(id);
  return caches.proposal.get(key);
}

/**
 * Cache proposal (1min TTL)
 */
export function setProposalCached(id: string, data: Proposal): void {
  const key = proposalKey(id);
  caches.proposal.set(key, data, PROPOSAL_TTL);
}

/**
 * Invalidate proposal cache
 */
export function invalidateProposal(id: string): void {
  const key = proposalKey(id);
  caches.proposal.delete(key);
  // Also invalidate governance stats
  const statsKey = governanceStatsKey();
  caches.governance.delete(statsKey);
}

/**
 * Get governance stats from cache
 */
export function getGovernanceStatsCached(): GovernanceStats | undefined {
  const key = governanceStatsKey();
  return caches.governance.get(key);
}

/**
 * Cache governance stats (5min TTL)
 */
export function setGovernanceStatsCached(data: GovernanceStats): void {
  const key = governanceStatsKey();
  caches.governance.set(key, data, GOVERNANCE_STATS_TTL);
}