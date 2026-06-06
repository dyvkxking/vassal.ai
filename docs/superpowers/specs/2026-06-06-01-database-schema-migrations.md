# Database Schema & Migrations — Production Readiness Checklist

## Overview

Design and implement the PostgreSQL schema for all platform entities: Agent, Session, ProviderNode, Skill, Proposal, StakePosition, UserProfile, Notification.

---

## Phase 1: Core Schema Design

### 1.1 Agent Table
- [ ] `id` (UUID, PK)
- [ ] `creator` (VARCHAR, Ethereum address)
- [ ] `name` (VARCHAR, UNIQUE, indexed)
- [ ] `description` (TEXT)
- [ ] `category` (ENUM)
- [ ] `pricing_type` (ENUM: 'per_minute' | 'per_second' | 'per_call')
- [ ] `price_per_minute` (DECIMAL, nullable)
- [ ] `price_per_second` (DECIMAL, nullable)
- [ ] `price_per_call` (DECIMAL, nullable)
- [ ] `quality_score` (INTEGER, 0-100)
- [ ] `total_sessions` (BIGINT, default 0)
- [ ] `avg_rating` (DECIMAL)
- [ ] `status` (ENUM: 'active' | 'inactive' | 'suspended')
- [ ] `version` (VARCHAR)
- [ ] `learning_enabled` (BOOLEAN)
- [ ] `created_at` (TIMESTAMP)
- [ ] `updated_at` (TIMESTAMP)
- [ ] Index on `creator`
- [ ] Index on `category`
- [ ] Index on `status`

### 1.2 Agent Capabilities Table
- [ ] `id` (UUID, PK)
- [ ] `agent_id` (UUID, FK → agents)
- [ ] `name` (VARCHAR)
- [ ] `description` (TEXT)
- [ ] `tpm_required` (INTEGER)
- [ ] `category` (VARCHAR)

### 1.3 Agent Skill Dependencies Table
- [ ] `agent_id` (UUID, FK)
- [ ] `skill_id` (UUID, FK)
- [ ] Primary key on (agent_id, skill_id)

### 1.4 Session Table
- [ ] `id` (UUID, PK)
- [ ] `client` (VARCHAR, Ethereum address, indexed)
- [ ] `agent_id` (UUID, FK)
- [ ] `provider_node_id` (UUID, FK)
- [ ] `status` (ENUM: 'active' | 'completed' | 'slashed' | 'failed')
- [ ] `latency_threshold_ms` (INTEGER)
- [ ] `tpm_cap` (INTEGER)
- [ ] `uptime_guarantee_percent` (DECIMAL)
- [ ] `min_stake_required` (DECIMAL)
- [ ] `start_time` (TIMESTAMP, indexed)
- [ ] `end_time` (TIMESTAMP, nullable)
- [ ] `tpm_used` (INTEGER)
- [ ] `total_cost` (DECIMAL)
- [ ] `avg_latency_ms` (INTEGER)
- [ ] `p50_latency_ms` (INTEGER)
- [ ] `p95_latency_ms` (INTEGER)
- [ ] `p99_latency_ms` (INTEGER)
- [ ] `latency_breaches` (INTEGER)
- [ ] `rating` (INTEGER, nullable)
- [ ] `feedback` (TEXT, nullable)
- [ ] Index on `agent_id`
- [ ] Index on `provider_node_id`
- [ ] Index on `status`
- [ ] Composite index on (client, start_time)

### 1.5 Slash Events Table
- [ ] `id` (UUID, PK)
- [ ] `session_id` (UUID, FK)
- [ ] `type` (ENUM: 'latency' | 'uptime' | 'quality')
- [ ] `amount` (DECIMAL)
- [ ] `reason` (TEXT)
- [ ] `created_at` (TIMESTAMP)

### 1.6 Provider Node Table
- [ ] `id` (UUID, PK)
- [ ] `operator` (VARCHAR, indexed)
- [ ] `status` (ENUM: 'online' | 'offline' | 'draining')
- [ ] `stake_amount` (DECIMAL)
- [ ] `locked_stake` (DECIMAL)
- [ ] `available_stake` (DECIMAL, generated)
- [ ] `cpu_cores` (INTEGER)
- [ ] `gpu_model` (VARCHAR)
- [ ] `gpu_memory_gb` (INTEGER)
- [ ] `ram_gb` (INTEGER)
- [ ] `disk_gb` (INTEGER)
- [ ] `bandwidth_mbps` (INTEGER)
- [ ] `location` (VARCHAR)
- [ ] `total_sessions` (BIGINT)
- [ ] `avg_uptime` (DECIMAL)
- [ ] `earnings_total` (DECIMAL)
- [ ] `earnings_pending` (DECIMAL)
- [ ] `last_heartbeat` (TIMESTAMP)
- [ ] `registered_at` (TIMESTAMP)
- [ ] `is_genesis` (BOOLEAN)

### 1.7 Skill Table
- [ ] `id` (UUID, PK)
- [ ] `author` (VARCHAR, indexed)
- [ ] `name` (VARCHAR, UNIQUE)
- [ ] `description` (TEXT)
- [ ] `category` (VARCHAR)
- [ ] `version` (VARCHAR)
- [ ] `price_per_invocation` (DECIMAL)
- [ ] `usage_count` (BIGINT)
- [ ] `avg_rating` (DECIMAL)
- [ ] `status` (ENUM: 'pending' | 'approved' | 'rejected')
- [ ] `input_schema` (JSONB)
- [ ] `output_schema` (JSONB)
- [ ] `parameters` (JSONB)
- [ ] `examples` (JSONB)
- [ ] `created_at` (TIMESTAMP)
- [ ] `updated_at` (TIMESTAMP)

### 1.8 Proposal Table
- [ ] `id` (UUID, PK)
- [ ] `author` (VARCHAR, indexed)
- [ ] `title` (VARCHAR)
- [ ] `description` (TEXT)
- [ ] `category` (ENUM)
- [ ] `status` (ENUM: 'draft' | 'active' | 'passed' | 'failed' | 'executed')
- [ ] `votes_for` (BIGINT)
- [ ] `votes_against` (BIGINT)
- [ ] `votes_abstain` (BIGINT)
- [ ] `total_voters` (INTEGER)
- [ ] `quorum_required` (BIGINT)
- [ ] `start_time` (TIMESTAMP, indexed)
- [ ] `end_time` (TIMESTAMP, indexed)
- [ ] `execution_plan` (TEXT, nullable)
- [ ] `created_at` (TIMESTAMP)

### 1.9 Vote Records Table
- [ ] `id` (UUID, PK)
- [ ] `proposal_id` (UUID, FK)
- [ ] `voter` (VARCHAR)
- [ ] `vote` (ENUM: 'for' | 'against' | 'abstain')
- [ ] `weight` (BIGINT)
- [ ] `created_at` (TIMESTAMP)
- [ ] Unique constraint on (proposal_id, voter)

### 1.10 Stake Position Table
- [ ] `id` (UUID, PK)
- [ ] `owner` (VARCHAR, indexed)
- [ ] `amount` (DECIMAL)
- [ ] `locked_amount` (DECIMAL)
- [ ] `purpose` (ENUM: 'provider' | 'agent')
- [ ] `associated_entity` (UUID)
- [ ] `created_at` (TIMESTAMP)
- [ ] `unlocking_at` (TIMESTAMP, nullable)

### 1.11 User Profile Table
- [ ] `address` (VARCHAR, PK)
- [ ] `display_name` (VARCHAR)
- [ ] `avatar_url` (VARCHAR, nullable)
- [ ] `bio` (TEXT, nullable)
- [ ] `roles` (JSONB array)
- [ ] `is_genesis_participant` (BOOLEAN)
- [ ] `joined_at` (TIMESTAMP)
- [ ] `total_sessions_as_provider` (BIGINT)
- [ ] `total_sessions_as_client` (BIGINT)
- [ ] `agents_created` (INTEGER)
- [ ] `skills_published` (INTEGER)
- [ ] `proposals_voted` (INTEGER)

### 1.12 Notification Table
- [ ] `id` (UUID, PK)
- [ ] `user_address` (VARCHAR, indexed)
- [ ] `type` (VARCHAR)
- [ ] `title` (VARCHAR)
- [ ] `message` (TEXT)
- [ ] `read` (BOOLEAN, default false)
- [ ] `link` (VARCHAR, nullable)
- [ ] `timestamp` (TIMESTAMP)

---

## Phase 2: Migrations

- [ ] Write migration for initial schema (v001_initial_schema.sql)
- [ ] Add migration for indexes and constraints (v002_indexes.sql)
- [ ] Write down migration for adding full-text search (v003_fts.sql)
- [ ] Create migration for RLS policies (v004_rls.sql)
- [ ] Add seed data migration (v005_seed.sql) with test addresses

---

## Phase 3: Schema Validation

- [ ] Verify all foreign keys have corresponding indexes
- [ ] Verify all ENUM values match TypeScript types in `/src/types`
- [ ] Verify generated columns (available_stake) compute correctly
- [ ] Run `EXPLAIN ANALYZE` on complex queries using mock data
- [ ] Test migration rollback (down migration)

---

## Phase 4: Production Hardening

- [ ] Add `created_at`/`updated_at` triggers to all tables
- [ ] Add row-level security (RLS) policies for user data isolation
- [ ] Configure connection pooling (PgBouncer compatible)
- [ ] Set up point-in-time recovery (PITR) backup
- [ ] Verify all timestamps are UTC
- [ ] Add check constraints for non-negative values (amounts, counts)
- [ ] Verify `tpm_used` cannot exceed `tpm_cap`
- [ ] Add constraint that `end_time` > `start_time` for sessions

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Run Playwright tests against the migration — must pass
3. Verify with `mcp__Neon__run_sql` that schema is correctly applied