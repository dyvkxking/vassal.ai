# Background Jobs — Production Readiness Checklist

## Overview

Implement background job processing for tasks that shouldn't block HTTP requests: slashing calculations, reward distribution, node heartbeats, cleanup jobs, and scheduled reports.

---

## Phase 1: Job Queue Infrastructure

### 1.1 Queue Implementation
- [ ] Use Vercel Queues (or BullMQ for self-hosted) for job processing
- [ ] Define job types with TypeScript interfaces
- [ ] Serialization/deserialization of job data
- [ ] Job retry configuration per type

### 1.2 Job Types
- [ ] `SlashCalculationJob` — calculate and apply slash events
- [ ] `RewardDistributionJob` — distribute earned rewards
- [ ] `NodeHeartbeatCheckJob` — check node health
- [ ] `SessionCleanupJob` — archive completed sessions
- [ ] `ProposalStatusJob` — update proposal status based on time
- [ ] `NotificationDispatchJob` — send push/email notifications
- [ ] `MetricAggregationJob` — aggregate hourly/daily stats

### 1.3 Worker Configuration
- [ ] Concurrency limits per job type
- [ ] Timeout per job type
- [ ] Memory limits per job type
- [ ] Graceful shutdown handling

---

## Phase 2: Slashing Calculations

### 2.1 Latency Breach Detection
- [ ] Query sessions with `avgLatencyMs > latencyThresholdMs`
- [ ] Calculate slash amount = `lockedStake * breachRate`
- [ ] Create SlashEvent record
- [ ] Update provider node locked_stake

### 2.2 Uptime Breach Detection
- [ ] Query nodes with heartbeat > 60s stale
- [ ] Calculate uptime percentage over rolling window
- [ ] Apply uptime penalty if below SLA guarantee
- [ ] Trigger notification to provider

### 2.3 Slash Execution
- [ ] Slashing is atomic transaction
- [ ] Debit provider locked_stake
- [ ] Credit protocol treasury (or burn)
- [ ] Emit on-chain event for verification

---

## Phase 3: Reward Distribution

### 3.1 Reward Calculation
- [ ] Per-session reward = `tpmUsed * agent.pricePerMinute / 60`
- [ ] Provider share = 80% (configurable)
- [ ] Protocol share = 20% (configurable)
- [ ] Store calculation in reward_events table

### 3.2 Distribution Schedule
- [ ] Daily batch job at UTC midnight
- [ ] Process all pending rewards from previous day
- [ ] Update provider earnings_total
- [ ] Update user pending balance

### 3.3 Claim Processing
- [ ] Handle reward claims atomically
- [ ] Transfer from protocol to user wallet
- [ ] Record transaction hash
- [ ] Mark reward as claimed

---

## Phase 4: Node Heartbeat Monitoring

### 4.1 Heartbeat Check
- [ ] Run every 30 seconds
- [ ] Mark nodes offline if `lastHeartbeat < now - 60s`
- [ ] Mark nodes draining if graceful shutdown requested

### 4.2 Recovery
- [ ] Mark nodes online on successful heartbeat
- [ ] Don't auto-re-enable after manual offline
- [ ] Notify provider of status changes

### 4.3 Stake Adjustment
- [ ] When node goes offline, lock additional stake as penalty
- [ ] When node returns online, release penalty stake
- [ ] Calculate penalty proportionally to downtime

---

## Phase 5: Cleanup Jobs

### 5.1 Session Archival
- [ ] Archive sessions completed > 30 days ago
- [ ] Move to cold storage (or delete if not required)
- [ ] Keep aggregate statistics only

### 5.2 Temp Data Cleanup
- [ ] Delete expired nonce records (every hour)
- [ ] Delete used webhook idempotency records > 7 days
- [ ] Delete old failed job records > 30 days

### 5.3 Notification Cleanup
- [ ] Mark read notifications > 90 days as archivable
- [ ] Delete read notifications > 1 year

---

## Phase 6: Proposal Status Jobs

### 6.1 Status Transitions
- [ ] `active` → `passed` when endTime passed AND votesFor > votesAgainst AND quorum met
- [ ] `active` → `failed` when endTime passed AND (votesFor <= votesAgainst OR quorum not met)
- [ ] `passed` → `executed` when execution plan completed

### 6.2 Execution
- [ ] Run every 5 minutes
- [ ] Query proposals in `passed` status
- [ ] Execute upgrade scripts in order
- [ ] Mark as executed on success

---

## Phase 7: Scheduled Reports

### 7.1 Daily Metrics
- [ ] Aggregate 24h session count, total cost, provider earnings
- [ ] Store in daily_metrics table
- [ ] Keep 90 days of daily metrics

### 7.2 Weekly Digest
- [ ] Generate top agents by sessions
- [ ] Generate top providers by earnings
- [ ] Generate proposal participation stats
- [ ] Queue email notifications

---

## Phase 8: Job Monitoring

### 8.1 Metrics
- [ ] Track jobs processed per hour
- [ ] Track job failure rate
- [ ] Track average job duration
- [ ] Track queue depth

### 8.2 Alerts
- [ ] Alert if job failure rate > 5%
- [ ] Alert if queue depth > 1000
- [ ] Alert if job duration > expected (p95)
- [ ] Alert if dead letter queue grows

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Write unit tests for each job type
3. Use Playwright to verify job completion via API
4. Simulate failure scenarios and verify retry behavior