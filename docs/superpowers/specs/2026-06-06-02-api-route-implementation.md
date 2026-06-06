# API Route Implementation — Production Readiness Checklist

## Overview

Implement all REST API endpoints for the platform. Routes follow `src/app/(group)/path/page.tsx` convention — each route group has its own API namespace.

---

## Phase 1: Agent API (`/api/agents`)

### Endpoints
- [ ] `GET /api/agents` — List all agents with pagination, filtering by category/status
- [ ] `POST /api/agents` — Create new agent (authenticated, builder role)
- [ ] `GET /api/agents/[id]` — Get agent by ID with full details
- [ ] `PATCH /api/agents/[id]` — Update agent (owner only)
- [ ] `DELETE /api/agents/[id]` — Soft delete agent (owner only)
- [ ] `GET /api/agents/[id]/capabilities` — List agent capabilities
- [ ] `GET /api/agents/[id]/stats` — Get agent usage statistics
- [ ] `GET /api/agents/[id]/sessions` — List sessions for agent (paginated)

### Validation
- [ ] Request body validated with Zod schema
- [ ] Address format validation (Ethereum checksum)
- [ ] Category enum validation
- [ ] Pricing params validated (exactly one of per_minute/per_second/per_call must be set)

### Auth
- [ ] Wallet signature verification for write operations
- [ ] Role check (only 'creator' role can create agents)
- [ ] Owner-only for PATCH/DELETE

### Response
- [ ] Proper HTTP status codes (200, 201, 400, 401, 403, 404)
- [ ] Consistent error response format `{ error: string, code: string }`
- [ ] Pagination headers (`X-Total-Count`, `X-Page`, `X-Per-Page`)

---

## Phase 2: Session API (`/api/sessions`)

### Endpoints
- [ ] `GET /api/sessions` — List sessions (filtered by client/agent/node)
- [ ] `POST /api/sessions` — Create/start new session (client)
- [ ] `GET /api/sessions/[id]` — Get session details
- [ ] `PATCH /api/sessions/[id]` — Update session (end, rate, feedback)
- [ ] `POST /api/sessions/[id]/complete` — Mark session completed
- [ ] `POST /api/sessions/[id]/slash` — Record slash event (provider)
- [ ] `GET /api/sessions/[id]/metrics` — Get latency metrics for session

### Validation
- [ ] `agentId` must exist and be active
- [ ] `providerNodeId` must exist and be online
- [ ] `client` must have sufficient stake for agent's `minStakeRequired`
- [ ] `tpmCap` from agent's SLA params must be validated

### Auth
- [ ] Client can only create sessions for themselves
- [ ] Provider can only record slash events for their nodes
- [ ] Client can rate/complete their own sessions

### Latency Tracking
- [ ] Accept latency metrics in PATCH body
- [ ] Auto-calculate p50, p95, p99 from raw measurements
- [ ] Detect SLA breach if `avgLatencyMs > latencyThresholdMs`

---

## Phase 3: Provider Node API (`/api/provider/nodes`)

### Endpoints
- [ ] `GET /api/provider/nodes` — List all provider nodes
- [ ] `POST /api/provider/nodes` — Register new node (provider role)
- [ ] `GET /api/provider/nodes/[id]` — Get node details
- [ ] `PATCH /api/provider/nodes/[id]` — Update node (operator)
- [ ] `DELETE /api/provider/nodes/[id]` — Deregister node (operator)
- [ ] `POST /api/provider/nodes/[id]/heartbeat` — Record heartbeat
- [ ] `GET /api/provider/nodes/[id]/earnings` — Get earnings breakdown
- [ ] `GET /api/provider/nodes/[id]/sessions` — List sessions on node

### Hardware Validation
- [ ] `cpuCores` > 0
- [ ] `gpuMemoryGb` > 0 (if gpuModel provided)
- [ ] `bandwidthMbps` > 0
- [ ] Minimum hardware requirements enforced (specify in config)

### Auth
- [ ] Only 'provider' role can register nodes
- [ ] Operator can only modify their own nodes

### Heartbeat
- [ ] Accept heartbeat with current load metrics
- [ ] Mark node offline if heartbeat > 60s stale
- [ ] Auto-update `available_stake` calculation

---

## Phase 4: Skills API (`/api/skills`)

### Endpoints
- [ ] `GET /api/skills` — List all skills with filtering
- [ ] `POST /api/skills` — Publish skill (authenticated)
- [ ] `GET /api/skills/[id]` — Get skill details with spec
- [ ] `PATCH /api/skills/[id]` — Update skill (author)
- [ ] `DELETE /api/skills/[id]` — Remove skill (author)
- [ ] `GET /api/skills/[id]/usage` — Get usage statistics

### Schema Validation
- [ ] `inputSchema` is valid JSON Schema object
- [ ] `outputSchema` is valid JSON Schema object
- [ ] `parameters` array has required 'name', 'type', 'required' fields

### Auth
- [ ] Skill creation requires 'creator' role
- [ ] Only author can modify/delete their skills

---

## Phase 5: Governance API (`/api/governance/proposals`)

### Endpoints
- [ ] `GET /api/governance/proposals` — List proposals with filtering by status
- [ ] `POST /api/governance/proposals` — Create proposal (minimum stake required)
- [ ] `GET /api/governance/proposals/[id]` — Get proposal details
- [ ] `GET /api/governance/proposals/[id]/votes` — Get vote breakdown
- [ ] `POST /api/governance/proposals/[id]/vote` — Cast vote
- [ ] `GET /api/governance/proposals/[id]/results` — Get final results

### Voting Rules
- [ ] User must have minimum stake to vote
- [ ] One vote per address per proposal
- [ ] Cannot vote after `endTime`
- [ ] Cannot vote before `startTime`
- [ ] Vote weight proportional to stake amount

### Results Calculation
- [ ] Quorum check: `totalVotes >= quorumRequired`
- [ ] Pass threshold: `votesFor > votesAgainst`
- [ ] Auto-transition status based on time and results

---

## Phase 6: Stake API (`/api/stake`)

### Endpoints
- [ ] `GET /api/stake/positions` — Get all stake positions for authenticated user
- [ ] `POST /api/stake/lock` — Lock stake for provider/agent
- [ ] `POST /api/stake/unlock` — Initiate unlock (has cooldown period)
- [ ] `GET /api/stake/positions/[id]` — Get specific position
- [ ] `GET /api/stake/rewards` — Calculate pending rewards
- [ ] `POST /api/stake/claim` — Claim earned rewards

### Lock Flow
- [ ] Validate user has sufficient free balance
- [ ] Create stake position with `purpose` (provider/agent)
- [ ] Associate with `associatedEntity` (nodeId or agentId)
- [ ] Update locked_amount on user balance

### Unlock Flow
- [ ] Set `unlocking_at` = now + unlock delay (configurable)
- [ ] Cannot unlock until `unlocking_at` passed
- [ ] On unlock completion, update balances and delete position

### Auth
- [ ] All endpoints require authenticated user
- [ ] User can only view/modify their own positions

---

## Phase 7: User Profile API (`/api/users`)

### Endpoints
- [ ] `GET /api/users/[address]` — Get public profile
- [ ] `PATCH /api/users/[address]` — Update own profile
- [ ] `GET /api/users/[address]/sessions` — User's session history
- [ ] `GET /api/users/[address]/agents` — User's created agents
- [ ] `GET /api/users/[address]/notifications` — User's notifications

### Auth
- [ ] Public profile viewable by anyone
- [ ] Only address owner can PATCH their profile
- [ ] Only address owner can view their notifications

---

## Phase 8: Error Handling & Response Standards

- [ ] All endpoints return consistent error format
- [ ] All endpoints handle database errors gracefully
- [ ] All endpoints log errors with correlation ID
- [ ] Rate limiting headers on all endpoints
- [ ] CORS headers configured for frontend domains

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Run Playwright tests for each endpoint — must pass
3. Test with `mcp__Neon__run_sql` to verify data persistence
4. Verify HTTP status codes are correct for error cases