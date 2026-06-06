# Data Validation (Zod Schemas) — Production Readiness Checklist

## Overview

Create comprehensive Zod schemas for all data types. Schemas serve as single source of truth for validation across API routes, forms, and internal logic. All types in `/src/types` must have corresponding Zod schemas.

---

## Phase 1: Core Type Schemas

### 1.1 Agent Schemas
- [ ] `AgentSchema` — matches Agent type exactly
- [ ] `CreateAgentSchema` — required fields for creation, optional fields excluded
- [ ] `UpdateAgentSchema` — all fields optional (PATCH semantics)
- [ ] `AgentCapabilitySchema` — individual capability
- [ ] `PricingSchema` — discriminated union (per_minute | per_second | per_call)
- [ ] `SLAParamsSchema` — latency, tpmCap, uptime, minStake
- [ ] `AgentCategorySchema` — enum validation

### 1.2 Session Schemas
- [ ] `SessionSchema` — matches Session type
- [ ] `CreateSessionSchema` — client, agentId, providerNodeId
- [ ] `UpdateSessionSchema` — status, rating, feedback
- [ ] `LatencyMetricsSchema` — avg, p50, p95, p99, breaches
- [ ] `SlashEventSchema` — type, amount, reason
- [ ] `SessionStatusSchema` — enum: active | completed | slashed | failed

### 1.3 Provider Node Schemas
- [ ] `ProviderNodeSchema` — matches ProviderNode type
- [ ] `CreateNodeSchema` — operator, hardware specs, location
- [ ] `UpdateNodeSchema` — status, hardware optional
- [ ] `HardwareSchema` — cpu, gpu, ram, disk, bandwidth
- [ ] `NodeStatusSchema` — enum: online | offline | draining
- [ ] `HeartbeatSchema` — timestamp, load metrics

### 1.4 Skill Schemas
- [ ] `SkillSchema` — matches Skill type
- [ ] `CreateSkillSchema` — name, description, category, input/output schemas
- [ ] `UpdateSkillSchema` — all fields optional
- [ ] `SkillSpecSchema` — inputSchema, outputSchema, parameters, examples (all JSON)
- [ ] `ParameterSchema` — name, type, required, description
- [ ] `SkillStatusSchema` — enum: pending | approved | rejected

### 1.5 Proposal Schemas
- [ ] `ProposalSchema` — matches Proposal type
- [ ] `CreateProposalSchema` — title, description, category
- [ ] `VoteSchema` — proposalId, vote (for|against|abstain), weight
- [ ] `ProposalCategorySchema` — enum validation
- [ ] `ProposalStatusSchema` — enum: draft | active | passed | failed | executed

### 1.6 Stake Schemas
- [ ] `StakePositionSchema` — matches StakePosition type
- [ ] `LockStakeSchema` — amount, purpose (provider|agent), associatedEntity
- [ ] `UnlockStakeSchema` — positionId
- [ ] `PurposeSchema` — enum: provider | agent
- [ ] `ClaimRewardsSchema` — positionId

### 1.7 User Profile Schemas
- [ ] `UserProfileSchema` — matches UserProfile type
- [ ] `UpdateProfileSchema` — displayName, avatarUrl, bio (all optional)
- [ ] `RolesSchema` — array of role strings

### 1.8 Notification Schemas
- [ ] `NotificationSchema` — matches Notification type
- [ ] `MarkReadSchema` — notificationId
- [ ] `NotificationTypeSchema` — enum of notification types

---

## Phase 2: Address & Crypto Schemas

- [ ] `EthAddressSchema` — validates 0x + 40 hex chars, optional checksum validation
- [ ] `TxHashSchema` — validates transaction hash format
- [ ] `SignatureSchema` — validates 0x + 130 hex chars (65 bytes)

---

## Phase 3: API Request Schemas

### 3.1 Pagination
- [ ] `PaginationSchema` — page, perPage with sensible defaults (1, 20)
- [ ] `PaginationParamsSchema` — cursor-based alternative

### 3.2 Filters
- [ ] `AgentFiltersSchema` — category, status, minRating, maxPrice
- [ ] `SessionFiltersSchema` — status, agentId, providerNodeId, dateRange
- [ ] `ProposalFiltersSchema` — status, category, author
- [ ] `SkillFiltersSchema` — category, status, minUsage

### 3.3 Sort
- [ ] `SortSchema` — field, direction (asc|desc)
- [ ] `AgentSortSchema` — allowed fields: createdAt, qualityScore, totalSessions, avgRating

---

## Phase 4: Error Response Schemas

- [ ] `ApiErrorSchema` — error message, error code
- [ ] `ValidationErrorSchema` — field-level errors with messages
- [ ] `AuthErrorSchema` — unauthorized, forbidden responses

---

## Phase 5: Schema Reuse & Composition

- [ ] All API route schemas import from central `/src/lib/schemas/`
- [ ] Shared schemas (EthAddress, Pagination) in `/src/lib/schemas/common.ts`
- [ ] Type-level equivalence: `z.infer<typeof AgentSchema>` === Agent type
- [ ] Discriminated unions for variant types (Pricing, SessionStatus)

---

## Phase 6: Custom Validators

- [ ] `isValidUrl` — for avatarUrl, link fields
- [ ] `isFutureTimestamp` — for proposal end times
- [ ] `isPastTimestamp` — for createdAt fields
- [ ] `isWithinRange(value, min, max)` — for percentages, prices
- [ ] `isPositiveInt` — for counts, amounts

---

## Phase 7: Integration Points

- [ ] All `POST /api/*` routes use Create schemas
- [ ] All `PATCH /api/*` routes use Update schemas
- [ ] All `GET /api/*` routes use Filter schemas for query params
- [ ] Client-side forms use same schemas via shared import

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Write Zod test cases: valid input passes, invalid input throws with correct message
3. Use Playwright to test form validation errors display correctly