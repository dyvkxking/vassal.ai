/**
 * Cache invalidation strategies
 */

import { caches } from './core';
import { invalidateAgent, invalidateAgentList } from './agents';
import { invalidateSession, invalidateUserSessions } from './sessions';
import { invalidateNode, invalidateNodeList } from './nodes';
import { invalidateSkillList, invalidateProposal } from './governance';

type EntityType = 'agent' | 'session' | 'node' | 'skill' | 'proposal' | 'user';

interface InvalidationEvent {
  entity: EntityType;
  id: string;
  action: 'create' | 'update' | 'delete' | 'vote' | 'status_change';
}

/**
 * Event-based cache invalidation
 */
export function invalidateOnWrite(entity: EntityType, id: string, event: InvalidationEvent['action']): void {
  switch (entity) {
    case 'agent':
      invalidateAgent(id);
      invalidateAgentList();
      break;
    case 'session':
      invalidateSession(id);
      break;
    case 'node':
      invalidateNode(id);
      invalidateNodeList();
      break;
    case 'skill':
      invalidateSkillList();
      break;
    case 'proposal':
      invalidateProposal(id);
      break;
    case 'user':
      // User sessions would be invalidated via address lookup
      break;
  }
}

/**
 * Cascade invalidation for related entities
 */
export function invalidateRelated(entity: EntityType, id: string): void {
  switch (entity) {
    case 'agent':
      // Invalidate agent and its list
      invalidateAgent(id);
      invalidateAgentList();
      break;
    case 'session':
      // Invalidate session and user sessions
      invalidateSession(id);
      // Note: Would need user address to invalidate user sessions
      break;
    case 'node':
      // Invalidate node and its list
      invalidateNode(id);
      invalidateNodeList();
      break;
    case 'skill':
      // Invalidate skill list
      invalidateSkillList();
      break;
    case 'proposal':
      // Invalidate proposal and governance stats
      invalidateProposal(id);
      break;
  }
}

/**
 * Full cache clear - use only in emergencies
 */
export function invalidateAll(): void {
  for (const cache of Object.values(caches)) {
    cache.clear();
  }
}

/**
 * Invalidate by entity type prefix
 */
export function invalidateByPrefix(prefix: string): void {
  const [entityType] = prefix.split(':').slice(1);
  const cache = caches[entityType as keyof typeof caches];
  if (cache) {
    const keys = cache.keys(prefix);
    for (const key of keys) {
      cache.delete(key);
    }
  }
}

/**
 * Invalidate user sessions by address
 */
export function invalidateUserSessionsByAddress(address: string): void {
  invalidateUserSessions(address);
}