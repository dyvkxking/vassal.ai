# Caching Layer — Production Readiness Checklist

## Overview

Implement Redis-based caching for frequently accessed data to reduce database load and improve response times. Cache invalidation must be precise to prevent stale data.

---

## Phase 1: Cache Infrastructure

### 1.1 Redis Client Setup
- [ ] Configure Redis client with connection pooling
- [ ] Set up automatic reconnection
- [ ] Configure read/write splitting (replicas for reads)
- [ ] Set sensible defaults: max retries, timeout

### 1.2 Key Naming Convention
- [ ] Pattern: `vassal:{entity}:{id}:{field}` for specific items
- [ ] Pattern: `vassal:{entity}:list:{filters}` for lists
- [ ] Pattern: `vassal:session:{sessionId}` for sessions
- [ ] Use colons as separators

### 1.3 TTL Strategy
- [ ] Hot data (agent prices): 5 minutes
- [ ] Medium data (user profiles): 15 minutes
- [ ] Cold data (historical sessions): 1 hour
- [ ] No TTL (manual invalidation only): critical config

---

## Phase 2: Agent Caching

### 2.1 Agent List Cache
- [ ] Cache key: `vassal:agents:list:category={cat}:status={status}`
- [ ] TTL: 5 minutes
- [ ] Invalidate on: agent create, update, delete
- [ ] Include pagination metadata in cache

### 2.2 Individual Agent Cache
- [ ] Cache key: `vassal:agent:{id}`
- [ ] TTL: 5 minutes
- [ ] Invalidate on: agent update, delete
- [ ] Include capabilities and SLA params

### 2.3 Agent Statistics Cache
- [ ] Cache key: `vassal:agent:{id}:stats`
- [ ] TTL: 1 minute (high volatility)
- [ ] Invalidate on: new session, rating change

---

## Phase 3: Session Caching

### 3.1 Active Session Cache
- [ ] Cache key: `vassal:session:{id}`
- [ ] TTL: No expiry (invalidated on update)
- [ ] Cache both read and write operations
- [ ] Invalidate on: session update, slash event

### 3.2 Session Metrics Cache
- [ ] Cache key: `vassal:session:{id}:metrics`
- [ ] TTL: 30 seconds
- [ ] Used for real-time latency monitoring

### 3.3 User Session List Cache
- [ ] Cache key: `vassal:user:{address}:sessions`
- [ ] TTL: 2 minutes
- [ ] Invalidate on: new session, session completion

---

## Phase 4: Provider Node Caching

### 4.1 Node List Cache
- [ ] Cache key: `vassal:nodes:list:status={status}`
- [ ] TTL: 2 minutes
- [ ] Invalidate on: node register, status change, heartbeat

### 4.2 Individual Node Cache
- [ ] Cache key: `vassal:node:{id}`
- [ ] TTL: 1 minute
- [ ] Include hardware specs and earnings

### 4.3 Node Availability Cache
- [ ] Cache key: `vassal:node:{id}:available`
- [ ] TTL: 30 seconds
- [ ] Used for session matching

---

## Phase 5: Skill & Proposal Caching

### 5.1 Skill List Cache
- [ ] Cache key: `vassal:skills:list:category={cat}`
- [ ] TTL: 10 minutes
- [ ] Invalidate on: skill create, update, status change

### 5.2 Proposal Cache
- [ ] Cache key: `vassal:proposal:{id}`
- [ ] TTL: 1 minute
- [ ] Invalidate on: vote cast, status change

### 5.3 Governance Stats Cache
- [ ] Cache key: `vassal:governance:stats`
- [ ] TTL: 5 minutes
- [ ] Used for dashboard

---

## Phase 6: Cache Invalidation Strategy

### 6.1 Write-Through
- [ ] On agent update, write to DB then invalidate cache
- [ ] On session create, write to DB then invalidate user session list
- [ ] Atomic operation: if DB write fails, don't invalidate

### 6.2 Cache Tags
- [ ] Implement tag-based invalidation for related entities
- [ ] Tag agents by category
- [ ] Tag nodes by region
- [ ] Tag sessions by agent and provider

### 6.3 Event-Based Invalidation
- [ ] Listen to internal events for cache invalidation
- [ ] `AgentUpdated` → invalidate agent list + individual agent
- [ ] `SessionCompleted` → invalidate session + user sessions + agent stats

---

## Phase 7: Distributed Cache

### 7.1 Multi-Instance Consistency
- [ ] Use cache versioning for invalidation
- [ ] Version key: `vassal:{entity}:{id}:v{version}`
- [ ] On update, increment version and delete old keys

### 7.2 Race Condition Handling
- [ ] Use Redis SETNX for cache population locks
- [ ] Prevent cache stampedes on cold start
- [ ] Lock TTL: 10 seconds

### 7.3 Cache Warm-up
- [ ] On startup, pre-warm critical caches
- [ ] Top 100 agents by sessions
- [ ] Active proposals
- [ ] Genesis providers

---

## Phase 8: Cache Monitoring

### 8.1 Metrics
- [ ] Track cache hit rate per entity type
- [ ] Track cache miss latency (cache miss = fetch from DB)
- [ ] Track memory usage per cache type
- [ ] Track invalidation frequency

### 8.2 Alerts
- [ ] Alert if hit rate < 80% for hot data
- [ ] Alert if cache memory > 80% of allocated
- [ ] Alert on repeated invalidation of same key

---

## Phase 9: Cache Size Management

### 9.1 Eviction Policy
- [ ] Use LRU eviction for all caches
- [ ] Set max memory per cache type
- [ ] Implement cache sharding for large datasets

### 9.2 Memory Limits
- [ ] Agent cache: 100MB max
- [ ] Session cache: 200MB max
- [ ] Node cache: 50MB max
- [ ] Skill cache: 50MB max

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Use Playwright to test cache hit/miss via response headers
3. Verify cache invalidation works correctly
4. Test Redis connection failure graceful degradation