# Webhook Handlers — Production Readiness Checklist

## Overview

Implement webhook handlers for external integrations: payment providers, blockchain events, monitoring alerts, and third-party services.

---

## Phase 1: Webhook Infrastructure

### 1.1 Webhook Receiver
- [ ] `/api/webhooks/[provider]` route for each provider
- [ ] Verify webhook signature (provider-specific)
- [ ] Parse and validate payload structure
- [ ] Return 200 quickly, process async

### 1.2 Signature Verification
- [ ] Stripe: verify using `stripe-webhook-signature` header with secret
- [ ] GitHub: verify using `X-Hub-Signature-256` with HMAC
- [ ] Custom: verify using `X-Webhook-Signature` with shared secret
- [ ] Reject requests with invalid/missing signatures

### 1.3 Idempotency
- [ ] Generate unique event ID from provider payload
- [ ] Store processed event IDs in database
- [ ] Skip reprocessing duplicate events (return 200)
- [ ] TTL on idempotency store (7 days)

---

## Phase 2: Payment Provider Webhooks

### 2.1 Stripe Integration
- [ ] `payment_intent.succeeded` — update session payment status
- [ ] `payment_intent.failed` — mark session as failed, notify user
- [ ] `customer.subscription.updated` — update plan limits
- [ ] `invoice.paid` — record payment for staking

### 2.2 Payment Processing
- [ ] Validate amount matches expected
- [ ] Update user balance on success
- [ ] Create transaction record
- [ ] Send confirmation notification

---

## Phase 3: Blockchain Event Handlers

### 3.1 On-Chain Monitoring
- [ ] Handle `StakeLocked` events (index by transaction hash + log index)
- [ ] Handle `StakeUnlocked` events
- [ ] Handle `AgentCreated` events
- [ ] Handle `NodeRegistered` events

### 3.2 Event Processing
- [ ] Verify event is from canonical chain contract addresses
- [ ] Decode event data per ABI
- [ ] Update database to reflect on-chain state
- [ ] Trigger downstream effects (notifications, state transitions)

### 3.3 Re-org Handling
- [ ] Detect chain reorganizations via block height
- [ ] Mark events from re-orged blocks as reverted
- [ ] Re-process events from new canonical chain
- [ ] Idempotency keys prevent double-processing

---

## Phase 4: Monitoring & Alert Webhooks

### 4.1 Provider Node Health
- [ ] Receive node heartbeat failures
- [ ] Mark node as offline after N consecutive failures
- [ ] Trigger stake unlocking if node remains offline > threshold

### 4.2 SLA Breach Alerts
- [ ] Receive latency breach notifications
- [ ] Record slash event for session
- [ ] Notify provider of breach

### 4.3 System Alerts
- [ ] Handle circuit breaker events
- [ ] Handle rate limit exceeded alerts
- [ ] Handle database connection failures

---

## Phase 5: Third-Party Integrations

### 5.1 AI Provider Callbacks
- [ ] Handle completion callbacks from AI providers
- [ ] Process usage reports for billing
- [ ] Handle errors and retries

### 5.2 Analytics Events
- [ ] Receive session completion events from providers
- [ ] Process aggregated usage statistics
- [ ] Update dashboard metrics

---

## Phase 6: Error Handling & Retries

### 6.1 Failure Handling
- [ ] Log all webhook failures with full payload
- [ ] Store failure reason in webhook_events table
- [ ] Return 200 even on processing failure (don't retry from provider)

### 6.2 Internal Retry Queue
- [ ] Failed webhook processing added to retry queue
- [ ] Exponential backoff: 1s, 5s, 30s, 2min, 10min
- [ ] Max 5 retries before marking as permanently failed
- [ ] Admin UI to view and manually retry failed webhooks

### 6.3 Dead Letter Queue
- [ ] Permanently failed webhooks go to DLQ
- [ ] DLQ entries preserved for 30 days
- [ ] Admin notification on DLQ entries

---

## Phase 7: Security & Validation

- [ ] All webhook endpoints require signature verification
- [ ] IP allowlist for known providers (Stripe, GitHub)
- [ ] Payload size limits (max 1MB)
- [ ] Timeout for external calls (10s)
- [ ] No sensitive data logged

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Use Playwright to simulate webhook payloads
3. Verify idempotency with duplicate event IDs
4. Test signature verification rejection