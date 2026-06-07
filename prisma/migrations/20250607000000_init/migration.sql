-- Migration: init
-- Created: 2025-06-07
-- Description: Initial schema for vassal.ai platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ CREATE ENUMS ============

CREATE TYPE "AgentStatus" AS ENUM ('active', 'paused', 'draft', 'archived');
CREATE TYPE "AgentCategory" AS ENUM ('web3', 'data', 'analytics', 'infrastructure', 'defi', 'nft', 'dao', 'ai_ml', 'gaming', 'social', 'other');
CREATE TYPE "SessionStatus" AS ENUM ('pending', 'active', 'completed', 'failed', 'cancelled', 'disputed');
CREATE TYPE "NodeStatus" AS ENUM ('online', 'offline', 'warning', 'maintenance');
CREATE TYPE "SkillStatus" AS ENUM ('draft', 'under_review', 'approved', 'rejected', 'deprecated');
CREATE TYPE "ProposalCategory" AS ENUM ('web3', 'data', 'analytics', 'infrastructure', 'defi', 'nft', 'dao', 'ai_ml', 'gaming', 'social', 'other');
CREATE TYPE "ProposalStatus" AS ENUM ('draft', 'active', 'passed', 'failed', 'executed', 'expired');
CREATE TYPE "SlashType" AS ENUM ('latency', 'tpm', 'uptime', 'heartbeat', 'custom', 'slash');
CREATE TYPE "StakePurpose" AS ENUM ('provider', 'agent', 'delegation');
CREATE TYPE "VoteChoice" AS ENUM ('for', 'against', 'abstain');
CREATE TYPE "UnlockRequestStatus" AS ENUM ('pending', 'ready', 'claimed');

-- ============ AGENT ============

CREATE TABLE "Agent" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "creator" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AgentCategory" NOT NULL,
    "pricingType" VARCHAR(255) NOT NULL,
    "pricePerMinute" DECIMAL(10,4),
    "pricePerSecond" DECIMAL(10,4),
    "pricePerCall" DECIMAL(10,4),
    "flatPrice" DECIMAL(10,4),
    "qualityScore" INT NOT NULL DEFAULT 0,
    "totalSessions" BIGINT NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "status" "AgentStatus" NOT NULL DEFAULT 'draft',
    "version" VARCHAR(255) NOT NULL DEFAULT '1.0.0',
    "learningEnabled" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" VARCHAR(255),
    "bannerUrl" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Agent_qualityScore_range" CHECK (qualityScore >= 0 AND qualityScore <= 100),
    CONSTRAINT "Agent_avgRating_range" CHECK (avgRating >= 0 AND avgRating <= 5)
);

CREATE UNIQUE INDEX "Agent_name_key" ON "Agent"("name");
CREATE INDEX "Agent_creator_idx" ON "Agent"("creator");
CREATE INDEX "Agent_category_idx" ON "Agent"("category");
CREATE INDEX "Agent_status_idx" ON "Agent"("status");

-- ============ AGENT CAPABILITY ============

CREATE TABLE "AgentCapability" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "agentId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "tpmRequired" INT NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    CONSTRAINT "AgentCapability_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AgentCapability_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE
);

CREATE INDEX "AgentCapability_agentId_idx" ON "AgentCapability"("agentId");

-- ============ AGENT SKILL DEPENDENCY ============

CREATE TABLE "AgentSkillDependency" (
    "agentId" VARCHAR(36) NOT NULL,
    "skillId" VARCHAR(36) NOT NULL,
    CONSTRAINT "AgentSkillDependency_pkey" PRIMARY KEY ("agentId", "skillId"),
    CONSTRAINT "AgentSkillDependency_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE,
    CONSTRAINT "AgentSkillDependency_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE
);

-- ============ PROVIDER NODE ============

CREATE TABLE "ProviderNode" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "operator" VARCHAR(255) NOT NULL,
    "status" "NodeStatus" NOT NULL DEFAULT 'offline',
    "stakeAmount" DECIMAL(10,4) NOT NULL,
    "lockedStake" DECIMAL(10,4) NOT NULL,
    "availableStake" DECIMAL(10,4) GENERATED ALWAYS AS (stakeAmount - lockedStake) STORED,
    "cpuCores" INT NOT NULL,
    "gpuModel" VARCHAR(255),
    "gpuMemoryGb" INT,
    "ramGb" INT NOT NULL,
    "diskGb" INT NOT NULL,
    "bandwidthMbps" INT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "totalSessions" BIGINT NOT NULL DEFAULT 0,
    "avgUptime" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "earningsTotal" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "earningsPending" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "lastHeartbeat" TIMESTAMP NOT NULL,
    "registeredAt" TIMESTAMP NOT NULL,
    "isGenesis" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ProviderNode_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProviderNode_stakeAmount_positive" CHECK (stakeAmount >= 0),
    CONSTRAINT "ProviderNode_lockedStake_positive" CHECK (lockedStake >= 0)
);

CREATE INDEX "ProviderNode_operator_idx" ON "ProviderNode"("operator");
CREATE INDEX "ProviderNode_status_idx" ON "ProviderNode"("status");

-- ============ SESSION ============

CREATE TABLE "Session" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "client" VARCHAR(255) NOT NULL,
    "agentId" VARCHAR(36) NOT NULL,
    "providerNodeId" VARCHAR(36) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'pending',
    "latencyThresholdMs" INT NOT NULL,
    "tpmCap" INT NOT NULL,
    "uptimeGuaranteePercent" DECIMAL(5,2) NOT NULL,
    "minStakeRequired" DECIMAL(10,4) NOT NULL,
    "startTime" TIMESTAMP NOT NULL,
    "endTime" TIMESTAMP,
    "tpmUsed" INT NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "avgLatencyMs" INT NOT NULL DEFAULT 0,
    "p50LatencyMs" INT NOT NULL DEFAULT 0,
    "p95LatencyMs" INT NOT NULL DEFAULT 0,
    "p99LatencyMs" INT NOT NULL DEFAULT 0,
    "latencyBreaches" INT NOT NULL DEFAULT 0,
    "rating" INT,
    "feedback" TEXT,
    "learningSignal" JSONB,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id"),
    CONSTRAINT "Session_providerNodeId_fkey" FOREIGN KEY ("providerNodeId") REFERENCES "ProviderNode"("id"),
    CONSTRAINT "Session_tpmUsed_nonnegative" CHECK (tpmUsed >= 0),
    CONSTRAINT "Session_tpmUsed_within_cap" CHECK (tpmUsed <= tpmCap),
    CONSTRAINT "Session_endTime_after_startTime" CHECK (endTime IS NULL OR endTime > startTime),
    CONSTRAINT "Session_totalCost_nonnegative" CHECK (totalCost >= 0),
    CONSTRAINT "Session_latencyBreaches_nonnegative" CHECK (latencyBreaches >= 0),
    CONSTRAINT "Session_tpmCap_nonnegative" CHECK (tpmCap >= 0),
    CONSTRAINT "Session_minStakeRequired_nonnegative" CHECK (minStakeRequired >= 0)
);

CREATE INDEX "Session_agentId_idx" ON "Session"("agentId");
CREATE INDEX "Session_providerNodeId_idx" ON "Session"("providerNodeId");
CREATE INDEX "Session_status_idx" ON "Session"("status");
CREATE INDEX "Session_client_startTime_idx" ON "Session"("client", "startTime");

-- ============ SLASH EVENT ============

CREATE TABLE "SlashEvent" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "sessionId" VARCHAR(36) NOT NULL,
    "type" "SlashType" NOT NULL,
    "amount" DECIMAL(10,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SlashEvent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SlashEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

CREATE INDEX "SlashEvent_sessionId_idx" ON "SlashEvent"("sessionId");

-- ============ SKILL ============

CREATE TABLE "Skill" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "author" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "version" VARCHAR(255) NOT NULL DEFAULT '1.0.0',
    "pricePerInvocation" DECIMAL(10,4) NOT NULL,
    "usageCount" BIGINT NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "status" "SkillStatus" NOT NULL DEFAULT 'draft',
    "inputSchema" JSONB NOT NULL,
    "outputSchema" JSONB NOT NULL,
    "parameters" JSONB NOT NULL,
    "examples" JSONB NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Skill_avgRating_range" CHECK (avgRating >= 0 AND avgRating <= 5)
);

CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
CREATE INDEX "Skill_author_idx" ON "Skill"("author");
CREATE INDEX "Skill_status_idx" ON "Skill"("status");

-- ============ PROPOSAL ============

CREATE TABLE "Proposal" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "author" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProposalCategory" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'draft',
    "votesFor" BIGINT NOT NULL DEFAULT 0,
    "votesAgainst" BIGINT NOT NULL DEFAULT 0,
    "votesAbstain" BIGINT NOT NULL DEFAULT 0,
    "totalVoters" INT NOT NULL DEFAULT 0,
    "quorumRequired" BIGINT NOT NULL DEFAULT 100,
    "startTime" TIMESTAMP NOT NULL,
    "endTime" TIMESTAMP NOT NULL,
    "executionPlan" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Proposal_author_idx" ON "Proposal"("author");
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");
CREATE INDEX "Proposal_startTime_idx" ON "Proposal"("startTime");
CREATE INDEX "Proposal_endTime_idx" ON "Proposal"("endTime");

-- ============ VOTE RECORD ============

CREATE TABLE "VoteRecord" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "proposalId" VARCHAR(36) NOT NULL,
    "voter" VARCHAR(255) NOT NULL,
    "vote" "VoteChoice" NOT NULL,
    "weight" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VoteRecord_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "VoteRecord_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "VoteRecord_proposalId_voter_key" ON "VoteRecord"("proposalId", "voter");

-- ============ STAKE POSITION ============

CREATE TABLE "StakePosition" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "owner" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,4) NOT NULL,
    "lockedAmount" DECIMAL(10,4) NOT NULL,
    "purpose" "StakePurpose" NOT NULL,
    "associatedEntity" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unlockingAt" TIMESTAMP,
    "availableStake" DECIMAL(10,4) GENERATED ALWAYS AS (amount - lockedAmount) STORED,
    CONSTRAINT "StakePosition_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "StakePosition_amount_nonnegative" CHECK (amount >= 0),
    CONSTRAINT "StakePosition_lockedAmount_nonnegative" CHECK (lockedAmount >= 0),
    CONSTRAINT "StakePosition_availableStake_nonnegative" CHECK (availableStake >= 0)
);

CREATE INDEX "StakePosition_owner_idx" ON "StakePosition"("owner");

-- ============ UNLOCK REQUEST ============

CREATE TABLE "UnlockRequest" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "owner" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,4) NOT NULL,
    "requestTime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releaseTime" TIMESTAMP NOT NULL,
    "status" "UnlockRequestStatus" NOT NULL DEFAULT 'pending',
    CONSTRAINT "UnlockRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UnlockRequest_amount_nonnegative" CHECK (amount >= 0)
);

CREATE INDEX "UnlockRequest_owner_idx" ON "UnlockRequest"("owner");
CREATE INDEX "UnlockRequest_status_idx" ON "UnlockRequest"("status");

-- ============ USER PROFILE ============

CREATE TABLE "UserProfile" (
    "address" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255),
    "avatarUrl" VARCHAR(255),
    "bio" TEXT,
    "roles" JSONB NOT NULL DEFAULT '[]',
    "isGenesisParticipant" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalSessionsAsProvider" BIGINT NOT NULL DEFAULT 0,
    "totalSessionsAsClient" BIGINT NOT NULL DEFAULT 0,
    "agentsCreated" INT NOT NULL DEFAULT 0,
    "skillsPublished" INT NOT NULL DEFAULT 0,
    "proposalsVoted" INT NOT NULL DEFAULT 0,
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("address")
);

CREATE INDEX "UserProfile_address_idx" ON "UserProfile"("address");

-- ============ NOTIFICATION ============

CREATE TABLE "Notification" (
    "id" VARCHAR(36) NOT NULL DEFAULT uuid_generate_v4(),
    "userAddress" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" VARCHAR(255),
    "metadata" JSONB,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_userAddress_idx" ON "Notification"("userAddress");
CREATE INDEX "Notification_timestamp_idx" ON "Notification"("timestamp");

-- ============ UPDATED_AT TRIGGER FUNCTION ============

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updatedAt
CREATE TRIGGER update_Agent_updatedAt BEFORE UPDATE ON "Agent"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_Skill_updatedAt BEFORE UPDATE ON "Skill"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ RLS POLICIES ============

-- HOW app.current_user IS SET:
-- This app uses wallet-based (address) authentication, not Supabase auth.
-- The application layer MUST set 'app.current_user' on every database connection:
--   SET LOCAL app.current_user = '<wallet_address>';
-- This is typically done in a middleware or connection pool hook before each request.
--
-- IMPORTANT: current_setting('app.current_user', true) returns NULL if not set.
-- Since NULL comparisons always fail (NULL = anything → NULL, not true), RLS would
-- deny ALL queries if app.current_user is not set. We handle this with COALESCE:
--   COALESCE(current_setting('app.current_user', true), '') → '' when unset
-- This means if app.current_user is not configured, RLS falls back to comparing '' = column,
-- which always fails, so queries are denied. The app MUST set this for RLS to work.
--
-- Alternative options considered:
--   Option B (auth.uid()): Not used - not using Supabase auth
--   Option C (JWT claims): Not used - wallet-based auth, no JWT in this schema
--   Option D (session_user): Not suitable - PostgreSQL session user ≠ wallet address

-- Enable RLS on tables that need it
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StakePosition" ENABLE ROW LEVEL SECURITY;

-- Helper to safely get current_user, treating NULL/unset as empty string
-- This ensures NULL comparisons fail (denying access) rather than being truthy
CREATE OR REPLACE FUNCTION get_current_user() RETURNS VARCHAR(255) AS $$
BEGIN
  RETURN COALESCE(NULLIF(TRIM(current_setting('app.current_user', true)), ''), '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- UserProfile: users can only read their own profile
CREATE POLICY "UserProfile_select_own" ON "UserProfile"
    FOR SELECT USING (address = get_current_user() AND get_current_user() <> '');

-- UserProfile: users can only insert their own profile
CREATE POLICY "UserProfile_insert_own" ON "UserProfile"
    FOR INSERT WITH CHECK (address = get_current_user() AND get_current_user() <> '');

-- UserProfile: users can only update their own profile
CREATE POLICY "UserProfile_update_own" ON "UserProfile"
    FOR UPDATE USING (address = get_current_user() AND get_current_user() <> '');

-- UserProfile: users can only delete their own profile
CREATE POLICY "UserProfile_delete_own" ON "UserProfile"
    FOR DELETE USING (address = get_current_user() AND get_current_user() <> '');

-- Notification: users can only read their own notifications
CREATE POLICY "Notification_select_own" ON "Notification"
    FOR SELECT USING (userAddress = get_current_user() AND get_current_user() <> '');

-- Notification: users can only insert their own notifications
CREATE POLICY "Notification_insert_own" ON "Notification"
    FOR INSERT WITH CHECK (userAddress = get_current_user() AND get_current_user() <> '');

-- Notification: users can only update their own notifications
CREATE POLICY "Notification_update_own" ON "Notification"
    FOR UPDATE USING (userAddress = get_current_user() AND get_current_user() <> '');

-- Notification: users can only delete their own notifications
CREATE POLICY "Notification_delete_own" ON "Notification"
    FOR DELETE USING (userAddress = get_current_user() AND get_current_user() <> '');

-- StakePosition: users can only read their own stake positions
CREATE POLICY "StakePosition_select_own" ON "StakePosition"
    FOR SELECT USING (owner = get_current_user() AND get_current_user() <> '');

-- StakePosition: users can only insert their own stake positions
CREATE POLICY "StakePosition_insert_own" ON "StakePosition"
    FOR INSERT WITH CHECK (owner = get_current_user() AND get_current_user() <> '');

-- StakePosition: users can only update their own stake positions
CREATE POLICY "StakePosition_update_own" ON "StakePosition"
    FOR UPDATE USING (owner = get_current_user() AND get_current_user() <> '');

-- StakePosition: users can only delete their own stake positions
CREATE POLICY "StakePosition_delete_own" ON "StakePosition"
    FOR DELETE USING (owner = get_current_user() AND get_current_user() <> '');
