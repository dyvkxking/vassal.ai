/**
 * TTL (Time To Live) constants in milliseconds
 */

// Hot data - 5 minutes
// Used for frequently accessed, frequently changing data (agent prices, listings)
export const HOT_TTL = 5 * 60 * 1000; // 5 minutes

// Medium data - 15 minutes
// Used for user profiles, settings, other medium-changing data
export const MEDIUM_TTL = 15 * 60 * 1000; // 15 minutes

// Cold data - 1 hour
// Used for historical data, less frequently accessed
export const COLD_TTL = 60 * 60 * 1000; // 1 hour

// Real-time data - 30 seconds
// Used for metrics, availability, real-time stats
export const REALTIME_TTL = 30 * 1000; // 30 seconds

// No TTL - manual invalidation only
// Used for critical config, sessions that shouldn't expire
export const NO_TTL: null = null;

// Specific TTL values for different data types
export const AGENT_LIST_TTL = HOT_TTL;
export const AGENT_TTL = HOT_TTL;
export const AGENT_STATS_TTL = REALTIME_TTL; // 1 minute but using constant for consistency

export const SESSION_TTL = NO_TTL; // No expiry, manual invalidation
export const SESSION_METRICS_TTL = REALTIME_TTL;
export const USER_SESSIONS_TTL = 2 * 60 * 1000; // 2 minutes

export const NODE_LIST_TTL = 2 * 60 * 1000; // 2 minutes
export const NODE_TTL = 60 * 1000; // 1 minute
export const NODE_AVAILABILITY_TTL = REALTIME_TTL;

export const SKILL_LIST_TTL = 10 * 60 * 1000; // 10 minutes
export const PROPOSAL_TTL = 60 * 1000; // 1 minute
export const GOVERNANCE_STATS_TTL = 5 * 60 * 1000; // 5 minutes