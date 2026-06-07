/**
 * Cache key builders for all entity types
 * Pattern: vassal:{entity}:{id}:{field}
 * Pattern: vassal:{entity}:list:{filters}
 */

const PREFIX = 'vassal';

/**
 * Agent keys
 */
export function agentListKey(category?: string, status?: string): string {
  const parts = [PREFIX, 'agents', 'list'];
  if (category) parts.push(`category=${category}`);
  if (status) parts.push(`status=${status}`);
  return parts.join(':');
}

export function agentKey(id: string): string {
  return [PREFIX, 'agent', id].join(':');
}

export function agentStatsKey(id: string): string {
  return [PREFIX, 'agent', id, 'stats'].join(':');
}

/**
 * Session keys
 */
export function sessionKey(id: string): string {
  return [PREFIX, 'session', id].join(':');
}

export function sessionMetricsKey(id: string): string {
  return [PREFIX, 'session', id, 'metrics'].join(':');
}

export function userSessionsKey(address: string): string {
  return [PREFIX, 'user', address, 'sessions'].join(':');
}

/**
 * Node keys
 */
export function nodeListKey(status?: string): string {
  const parts = [PREFIX, 'nodes', 'list'];
  if (status) parts.push(`status=${status}`);
  return parts.join(':');
}

export function nodeKey(id: string): string {
  return [PREFIX, 'node', id].join(':');
}

export function nodeAvailabilityKey(id: string): string {
  return [PREFIX, 'node', id, 'available'].join(':');
}

/**
 * Skill keys
 */
export function skillListKey(category?: string): string {
  const parts = [PREFIX, 'skills', 'list'];
  if (category) parts.push(`category=${category}`);
  return parts.join(':');
}

export function skillKey(id: string): string {
  return [PREFIX, 'skill', id].join(':');
}

/**
 * Proposal keys
 */
export function proposalKey(id: string): string {
  return [PREFIX, 'proposal', id].join(':');
}

export function governanceStatsKey(): string {
  return [PREFIX, 'governance', 'stats'].join(':');
}

/**
 * Parse a cache key back to its components
 */
export function parseAgentKey(key: string): { id: string } | null {
  const match = key.match(/^vassal:agent:(.+)$/);
  return match ? { id: match[1] } : null;
}

export function parseSessionKey(key: string): { id: string } | null {
  const match = key.match(/^vassal:session:(.+)$/);
  return match ? { id: match[1] } : null;
}

export function parseNodeKey(key: string): { id: string } | null {
  const match = key.match(/^vassal:node:(.+)$/);
  return match ? { id: match[1] } : null;
}

export function parseProposalKey(key: string): { id: string } | null {
  const match = key.match(/^vassal:proposal:(.+)$/);
  return match ? { id: match[1] } : null;
}