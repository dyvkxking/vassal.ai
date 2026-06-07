/**
 * Session caching functions
 */

import { caches } from './core';
import {
  sessionKey,
  sessionMetricsKey,
  userSessionsKey,
} from './keys';
import {
  SESSION_TTL,
  SESSION_METRICS_TTL,
  USER_SESSIONS_TTL,
} from './ttl';

interface Session {
  id: string;
  agentId: string;
  providerId: string;
  userAddress: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  [key: string]: unknown;
}

interface SessionMetrics {
  latency: number;
  tokensProcessed: number;
  duration: number;
  success: boolean;
  [key: string]: unknown;
}

interface UserSessions {
  sessions: Session[];
  total: number;
}

/**
 * Get active session from cache
 */
export function getSessionCached(id: string): Session | undefined {
  const key = sessionKey(id);
  return caches.session.get(key);
}

/**
 * Cache session (no expiry - manual invalidation)
 */
export function setSessionCached(id: string, data: Session): void {
  const key = sessionKey(id);
  caches.session.set(key, data, SESSION_TTL);
}

/**
 * Invalidate session cache
 */
export function invalidateSession(id: string): void {
  const key = sessionKey(id);
  caches.session.delete(key);
  // Also invalidate metrics
  const metricsKey = sessionMetricsKey(id);
  caches.session.delete(metricsKey);
}

/**
 * Get session metrics from cache
 */
export function getSessionMetricsCached(id: string): SessionMetrics | undefined {
  const key = sessionMetricsKey(id);
  return caches.session.get(key);
}

/**
 * Cache session metrics (30s TTL)
 */
export function setSessionMetricsCached(id: string, data: SessionMetrics): void {
  const key = sessionMetricsKey(id);
  caches.session.set(key, data, SESSION_METRICS_TTL);
}

/**
 * Get user sessions from cache
 */
export function getUserSessionsCached(address: string): UserSessions | undefined {
  const key = userSessionsKey(address);
  return caches.session.get(key);
}

/**
 * Cache user sessions (2min TTL)
 */
export function setUserSessionsCached(address: string, data: UserSessions): void {
  const key = userSessionsKey(address);
  caches.session.set(key, data, USER_SESSIONS_TTL);
}

/**
 * Invalidate user sessions cache
 */
export function invalidateUserSessions(address: string): void {
  const key = userSessionsKey(address);
  caches.session.delete(key);
}