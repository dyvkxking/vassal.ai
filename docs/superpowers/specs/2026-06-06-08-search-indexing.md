# Search & Indexing — Production Readiness Checklist

## Overview

Implement full-text search and filtering for agents, skills, and proposals. Support semantic search for capabilities and natural language queries.

---

## Phase 1: Full-Text Search Infrastructure

### 1.1 Search Engine
- [ ] Use PostgreSQL `tsvector` for basic full-text (simpler setup)
- [ ] Or use Meilisearch/Typesense for advanced features (facets, typo tolerance)
- [ ] Choose based on complexity needs vs operational burden

### 1.2 Index Strategy
- [ ] Agent name: indexed with `gin_trgm_ops` for partial matching
- [ ] Agent description: full-text indexed with `tsvector`
- [ ] Agent capabilities: indexed separately for capability search
- [ ] Skill name and description: full-text indexed

### 1.3 Search Schema
- [ ] Agent search document: id, name, description, category, capabilities, avgRating, priceMin
- [ ] Skill search document: id, name, description, category, avgRating
- [ ] Proposal search document: id, title, description, status, votesFor, endTime

---

## Phase 2: Agent Search

### 2.1 Search Features
- [ ] Text search across name and description
- [ ] Filter by category (exact match)
- [ ] Filter by status (active only by default)
- [ ] Filter by price range (min/max)
- [ ] Filter by rating (minimum threshold)
- [ ] Sort by: relevance, rating, price, createdAt, sessions

### 2.2 Query Building
- [ ] Parse search query into search terms
- [ ] Apply category filter if specified
- [ ] Apply price filters if specified
- [ ] Apply rating filter if specified
- [ ] Combine with AND logic
- [ ] Paginate results

### 2.3 Result Ranking
- [ ] Text match score (ts_rank)
- [ ] Quality score weight
- [ ] Recency bonus (newer agents slightly boosted)
- [ ] Popularity (session count) factor

---

## Phase 3: Skill Discovery

### 3.1 Skill Search
- [ ] Full-text search on name and description
- [ ] Filter by category
- [ ] Filter by status (approved only)
- [ ] Sort by usage count, rating

### 3.2 Capability Matching
- [ ] Search agents by capability name
- [ ] Search agents by capability description
- [ ] Match skill dependencies

### 3.3 Related Skills
- [ ] Find skills commonly used together
- [ ] Recommend skills based on agent category

---

## Phase 4: Proposal Search

### 4.1 Proposal Search
- [ ] Full-text search on title and description
- [ ] Filter by status (active, passed, failed)
- [ ] Filter by category
- [ ] Filter by author
- [ ] Sort by: endTime, votesFor, createdAt

### 4.2 Voting Analytics
- [ ] Search proposals by vote outcome
- [ ] Filter by quorum status (met/not met)
- [ ] Filter by participation level

---

## Phase 5: Advanced Search Features

### 5.1 Autocomplete
- [ ] Agent name autocomplete (prefix matching)
- [ ] Skill name autocomplete
- [ ] Response time < 100ms
- [ ] Cache autocomplete results

### 5.2 Faceted Search
- [ ] Return category counts with results
- [ ] Return price range buckets
- [ ] Return rating distribution
- [ ] Return status counts

### 5.3 Highlighting
- [ ] Highlight matching terms in results
- [ ] Return highlighted snippets for descriptions

---

## Phase 6: Query Optimization

### 6.1 Index Maintenance
- [ ] Run `ANALYZE` on search tables regularly
- [ ] Rebuild indexes during low traffic
- [ ] Monitor index bloat

### 6.2 Query Performance
- [ ] No full table scans on search
- [ ] Use covering indexes where possible
- [ ] Limit result set before heavy operations
- [ ] Query timeout: 5 seconds max

### 6.3 Caching Search Results
- [ ] Cache popular searches (same query → same results)
- [ ] TTL: 30 seconds for hot searches
- [ ] Invalidate on relevant entity change

---

## Phase 7: Search Analytics

### 7.1 Query Logging
- [ ] Log all search queries with timestamp
- [ ] Log result count per query
- [ ] Log filters used
- [ ] Anonymize user addresses

### 7.2 Popular Searches
- [ ] Aggregate top search queries daily
- [ ] Identify zero-result queries (missing content)
- [ ] Identify trending searches

### 7.3 Performance Monitoring
- [ ] Track p95 search latency
- [ ] Alert if p95 > 500ms
- [ ] Track cache hit rate for searches

---

## Phase 8: Search API

### 8.1 Endpoints
- [ ] `GET /api/search/agents?q=&category=&minPrice=&maxPrice=&minRating=&sort=`
- [ ] `GET /api/search/skills?q=&category=`
- [ ] `GET /api/search/proposals?q=&status=&category=`
- [ ] `GET /api/search/autocomplete?q=&type=`

### 8.2 Response Format
- [ ] Return results array
- [ ] Return total count for pagination
- [ ] Return facets (category counts, etc.)
- [ ] Return search time in ms

---

## Test Requirements

Before marking any checkbox complete, you MUST:
1. Run `npm run build` — must return **no build errors**
2. Use Playwright to test search functionality
3. Verify search results are relevant and ranked correctly
4. Test edge cases: empty query, special characters, very long query