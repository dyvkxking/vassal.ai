/**
 * Agent caching functions
 */

import { caches } from './core';
import {
  agentListKey,
  agentKey,
  agentStatsKey,
} from './keys';
import {
  AGENT_LIST_TTL,
  AGENT_TTL,
  AGENT_STATS_TTL,
} from './ttl';

interface Agent {
  id: string;
  name: string;
  category: string;
  status: string;
  price?: number;
  capabilities?: Record<string, unknown>;
  sla?: Record<string, unknown>;
  [key: string]: unknown;
}

interface AgentFilters {
  category?: string;
  status?: string;
}

interface AgentStats {
  totalSessions: number;
  avgLatency: number;
  uptime: number;
  rating: number;
  [key: string]: unknown;
}

interface PaginatedAgents {
  agents: Agent[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Get cached agent list or fetch
 */
export async function getAgentListCached(
  filters: AgentFilters = {}
): Promise<PaginatedAgents | undefined> {
  const key = agentListKey(filters.category, filters.status);
  return caches.agent.get(key);
}

/**
 * Cache agent list
 */
export function setAgentListCached(
  filters: AgentFilters,
  data: PaginatedAgents
): void {
  const key = agentListKey(filters.category, filters.status);
  caches.agent.set(key, data, AGENT_LIST_TTL);
}

/**
 * Invalidate all agent list caches
 */
export function invalidateAgentList(): void {
  const keys = caches.agent.keys('vassal:agents:list');
  for (const key of keys) {
    caches.agent.delete(key);
  }
}

/**
 * Get single agent from cache
 */
export function getAgentCached(id: string): Agent | undefined {
  const key = agentKey(id);
  return caches.agent.get(key);
}

/**
 * Cache single agent
 */
export function setAgentCached(id: string, data: Agent): void {
  const key = agentKey(id);
  caches.agent.set(key, data, AGENT_TTL);
}

/**
 * Invalidate single agent cache
 */
export function invalidateAgent(id: string): void {
  const key = agentKey(id);
  caches.agent.delete(key);
  // Also invalidate stats
  const statsKey = agentStatsKey(id);
  caches.agent.delete(statsKey);
  // Invalidate list caches
  invalidateAgentList();
}

/**
 * Get agent stats from cache
 */
export function getAgentStatsCached(id: string): AgentStats | undefined {
  const key = agentStatsKey(id);
  return caches.agent.get(key);
}

/**
 * Cache agent stats
 */
export function setAgentStatsCached(id: string, data: AgentStats): void {
  const key = agentStatsKey(id);
  caches.agent.set(key, data, AGENT_STATS_TTL);
}