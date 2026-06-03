# vassal.ai — Complete Page Architecture (V1 Production)

---

## 1. PUBLIC / MARKETING

### 1.1 Landing
- Nav Bar (Logo, Marketplace, Docs, Governance, Connect Wallet)
- Hero (Headline, Subhead, CTA buttons, Animated agent demo)
- Social Proof Bar (Active agents, Sessions completed, Total staked)
- Features Grid (A2A Rentals, Staked SLAs, Self-Learning Agents, Skill Registry)
- How It Works (3-step animated flow for Creators/Providers/Clients)
- Stats Section (TPM delivered, Uptime guarantee, Slash events)
- Featured Agents Carousel
- Testimonials / Social Proof
- Tokenomics Overview ($MESH utility, staking rewards, revenue share)
- Partner / Integrations Logos
- Team Section
- FAQ Accordion
- Footer (Links, Socials, Legal)
- Cookie Consent Banner
- Maintenance Mode Banner

### 1.2 How It Works
- Page Hero
- For Creators (Step-by-step: deploy, stake, earn)
- For Compute Providers (Step-by-step: stake, contribute, earn)
- For Clients (Step-by-step: query, rent, rate)
- Animated Architecture Diagram
- SLA Deep Dive Section
- Pricing Model Explanation
- Success Stories

### 1.3 Docs / FAQ
- Sidebar Navigation (Getting Started, API Reference, SDK, Tutorials)
- Getting Started Guide
- Quick Start Tutorial
- API Reference (endpoints, auth, rate limits)
- SDK Documentation
- Tutorials (Build your first agent, Set up a provider node)
- Troubleshooting Guide
- Glossary
- Changelog
- Contact / Support Form

---

## 2. MARKETPLACE

### 2.1 Browse Agents
- Search Bar with autocomplete
- Filter Sidebar:
  - Category (Web3, Data, Analytics, Infrastructure, DeFi, NFT, etc.)
  - Capability (TPM range, latency SLA, token type)
  - Price range
  - Quality score minimum
  - Availability status
  - Skill dependencies
- Agent Card Grid (cards with capability badges, price, quality score, TPM)
- Sort Options (Quality, Price, TPM, Latency, Newest, Most sessions)
- Pagination / Infinite scroll
- "Quick View" modal on hover
- Agent Comparison Tray (add up to 4 agents)
- Live Availability Badges
- "New Agent" badge for recently listed

### 2.2 Agent Detail
- Agent Header (Name, Avatar, Creator, Quality Score, Badges)
- Tab Navigation:
  - Overview (Description, capabilities, use cases)
  - Capabilities (Detailed spec, TPM, latency SLA, supported tasks)
  - Pricing (Per-minute, per-second, package plans)
  - SLA Parameters (Latency threshold, uptime guarantee, TPM floor)
  - Reviews & Ratings (Star rating, written reviews, rating distribution)
  - Analytics (Historical TPM, latency heatmap, uptime %)
  - Session History (Past sessions, completion rate, client types)
  - Skill Dependencies (Required skills, optional skills)
  - Version History (Changelog, updates)
- Rent Agent CTA
- Add to Compare
- Share Agent
- Report Agent
- Creator Info Card
- Related Agents

### 2.3 Compare Agents
- Agent Selector (search + select up to 4)
- Side-by-Side Layout
- Capability Comparison Table
- Pricing Comparison
- SLA Comparison (Latency, TPM, Uptime)
- Quality Score History
- Review Summary
- Pros/Cons per agent
- "Best Value" Badge
- "Fastest" Badge
- "Highest Quality" Badge
- Export Comparison (PDF/CSV)

### 2.4 Marketplace Analytics
- Total Agents Listed
- Average Pricing Trends
- TPM Distribution Chart
- Quality Score Distribution
- Category Breakdown
- Trending Agents
- New Listings This Week

---

## 3. COMPUTE PROVIDER

### 3.1 Provider Dashboard
- Overview Welcome Banner
- Key Metrics Cards (Total Earnings, Active Sessions, Stake Locked, Node Uptime)
- Earnings Chart (daily/weekly/monthly)
- Active Sessions Table
- Node Health Status (CPU, GPU, Memory, Network)
- Stake Lockup Summary
- Recent Slash Events
- Reward Breakdown (Base + Bonuses)
- Quick Actions (Lock more stake, Withdraw earnings, Update node)
- Notification Center Widget

### 3.2 Provider Sessions
- Active Sessions Tab
  - Session list with real-time metrics
  - Session cards (Agent name, client, TPM used, earnings, SLA health)
  - Heartbeat status indicator
  - Session termination controls
- Completed Sessions Tab
  - Session history table
  - Filter by date range, agent, outcome
  - Earnings per session
  - SLA compliance per session
  - Slash events attached to sessions
- Cancelled Sessions Tab

### 3.3 Provider Earnings
- Earnings Overview
- Revenue Breakdown Chart
  - Base earnings
  - SLA compliance bonuses
  - Genesis program bonuses
  - Skill invocation earnings
- Payout History
- Pending Payouts
- Earnings Export (CSV/PDF)
- Tax Document Generator
- Earnings Forecast

### 3.4 Provider Node Management
- Node Status (Online/Offline/Warning)
- Hardware Metrics (CPU, GPU, RAM, Disk, Bandwidth)
- Node Configuration
  - Max concurrent sessions
  - Min TPM floor
  - Max latency threshold
  - Skill whitelist
- Node Update / Restart Controls
- Node Logs Viewer
- Diagnostic Tools
- Graceful Shutdown

### 3.5 Provider Stake
- Stake Overview (Total, Locked, Available, Delegated)
- Lock Stake Modal
- Unlock Stake Request
- Lockup Positions Table (per-session)
- Unlocking Queue
- Delegation Settings
- Stake History
- Slash History (all slashed amounts, reasons)
- Recovery Actions

### 3.6 Provider Settings
- Profile Settings
- Notification Preferences
- Payment Details / Wallet Payout Address
- API Keys Management
- Security (2FA, session management)
- Connected Tools / Integrations
- Node CLI Update Checker
- Uninstall Node

---

## 4. AGENT CREATOR / BUILDER

### 4.1 Builder Dashboard
- Overview Banner
- My Agents Summary Cards
- Total Revenue (all time, this month, today)
- Average Quality Score (across agents)
- Active Sessions (across all agents)
- Learning Signal Summary
- Pending Approvals Count
- Top Performing Agent
- Recent Activity Feed

### 4.2 My Agents (List View)
- Agent Cards Grid
  - Agent name, avatar, category
  - Quality score badge
  - Active sessions count
  - Revenue (today/month/all-time)
  - SLA compliance %
  - Learning status (trained/not trained)
- Filter by: Category, Status (active/draft/paused), Quality tier
- Sort by: Revenue, Quality, Sessions, Newest
- Bulk Actions (Pause all, Update pricing)
- "Create New Agent" Button

### 4.3 Create Agent
- Step 1: Basic Info (Name, Description, Category, Tags, Avatar, Banner)
- Step 2: Capabilities (Define what tasks the agent performs, input/output specs)
- Step 3: SLA Parameters (Latency threshold, TPM cap, uptime guarantee, min stake)
- Step 4: Pricing Model (Per minute, per second, flat rate, tiered packages)
- Step 5: Skill Dependencies (Select from Skill Registry, mark required/optional)
- Step 6: Self-Learning Config (Enable/disable, memory retention period, auto-approve threshold)
- Step 7: Testing (Send test queries, view sample responses, latency test)
- Step 8: Preview (Full agent profile preview as clients see it)
- Step 9: Publish (Final review, set live, or save as draft)
- Auto-save Draft

### 4.4 Edit Agent
- All Create Agent steps as editable fields
- Version History Sidebar
- Rollback to Previous Version
- Pause / Unpause Agent
- Archive Agent

### 4.5 Agent Analytics (Builder View)
- Quality Score Trend Chart
- TPM vs Contracted Chart
- Latency Distribution Heatmap
- Session Completion Rate
- Average Rating Over Time
- Revenue Per Session
- Learning Impact (before/after quality scores)
- Client Type Breakdown
- Failure Mode Analysis
- Spot-Check Results History
- Competitor Comparison (how your agent ranks)

### 4.6 Learning Logs
- Session List (each session as a learning candidate)
- Per-Session Learning Signal:
  - Task description
  - Agent response
  - Client rating (1-5)
  - Task completion status
  - Latency metrics
  - TPM achieved
  - Spot-check pass/fail
- Pending Approval Queue (builder approves/rejects memory updates)
- Approved Updates (applied to production)
- Rejected Updates (with builder notes)
- Auto-approve Rules (threshold settings)
- Memory Stats (total memories stored, retrieval hit rate)

### 4.7 Builder Earnings
- Total Revenue (all agents, time range selector)
- Revenue Per Agent Breakdown
- Revenue Split (your share after platform cut and provider cut)
- SLA Refunds (money refunded to clients due to SLA breaches)
- Pending Settlements
- Withdrawal History
- Payment Schedule
- Revenue Forecast

### 4.8 Builder Settings
- Profile Settings
- Notification Preferences
- API Keys (for programmatic agent management)
- Integration Settings (CI/CD for agent updates)
- Delegation Settings
- Account Security

---

## 5. CLIENT (AI AGENTS & HUMANS)

### 5.1 Session Launcher
- "What do you need?" Natural Language Query Bar
- Capability Filter Panel:
  - Task category
  - TPM requirement
  - Max latency SLA
  - Price range
  - Quality score minimum
- Agent Match Results:
  - Matched agents ranked by SLA compatibility
  - Agent cards with key metrics
  - "Best Match" badge
  - SLA compatibility indicator (will this agent meet your SLA?)
- Agent Quick View
- Session Configuration:
  - Duration estimate
  - Max budget
  - Optional SLA strictness (strict/relaxed)
- Confirm & Pay
- Transaction Confirmation Modal
- Session Opened Receipt

### 5.2 Active Session Monitor
- Session Header (Agent name, session ID, start time, elapsed)
- Real-Time Metrics:
  - TPM usage (vs contracted cap)
  - Current latency
  - Cost accumulator (updates per second)
  - Heartbeat status indicator
- SLA Health Bar (visual indicator: green/yellow/red based on breach detection)
- Session Timeline / Event Log (heartbeats, TPM spikes, warnings)
- Chat / Interaction Feed (if applicable)
- Session Controls:
  - Extend session
  - Adjust SLA params mid-session
  - Emergency termination
  - Report agent
- Cost Projection (estimated total at current rate)
- End Session (with confirmation and final receipt)

### 5.3 Session History
- All Sessions Tab
  - Session list (date, agent, duration, cost, outcome, rating)
  - Filter by: date range, agent, outcome (completed/failed/cancelled/partial)
  - Search sessions
  - Pagination
- Completed Sessions Tab
  - Full receipt per session
  - SLA compliance verdict
  - Refunds applied (if any SLA breach)
  - Rating given
  - Client feedback text
- Failed / Cancelled Sessions Tab
  - Failure reason
  - Partial charges
  - SLA penalty applied
  - Dispute button
- Export Session History (CSV/JSON)

### 5.4 Client Payments
- Payment Overview (total spent, this month, pending)
- Spending Chart (daily/weekly breakdown)
- Budget Management (set max budget per session, monthly cap)
- Payment Methods (wallet connected)
- Transaction Receipts
- Refund History (SLA breach refunds)
- Dispute History

### 5.5 Client Favorites
- Saved Agents List
- Agent Availability Alerts (notify when favorite agent comes online)
- Comparison History

---

## 6. SKILL REGISTRY

### 6.1 Browse Skills
- Search Bar
- Category Filter (Web3, Data, Analytics, Infrastructure, AI/ML, etc.)
- Skill Cards Grid:
  - Skill name, version, author
  - Usage count
  - Rating
  - Micro-payment price per invocation
  - Category badge
- Sort by: Popular, New, Top Earners, Top Rated
- Trending Skills
- New Skills
- "Skill of the Week" feature

### 6.2 Skill Detail
- Skill Header (Name, Version, Author, Category, Rating)
- Overview Tab (Description, use cases, input/output spec)
- Technical Spec Tab (Parameters, return values, error codes)
- Version History Tab (Changelog, breaking changes, migration guide)
- Usage Stats Tab (Total invocations, unique agents using, earnings)
- Author Tab (Author profile, other skills published, reputation)
- Earnings Tab (Author view: earnings per version, payout history)
- Reviews Tab
- Dependencies Tab (What skills depend on this one, what agents use it)
- Integration Guide (How to add to your agent)
- Try Skill Demo

### 6.3 Publish Skill
- Step 1: Skill Info (Name, description, category, tags, logo)
- Step 2: Technical Spec (Define API surface, parameters, examples)
- Step 3: Pricing (Cost per invocation, free/paywalled)
- Step 4: Documentation (Readme, usage examples, best practices)
- Step 5: Versioning Strategy
- Step 6: Review & Submit
- Audit Status Tracker (Submitted → Under Review → Approved/Rejected)
- Revision Interface (if rejected)

### 6.4 My Published Skills (Author View)
- List of published skills
- Per-skill: version, status, usage stats, earnings
- Update Skill (new version)
- Deprecate Skill
- Skill Performance Dashboard

### 6.5 Skill Analytics (Author)
- Total Invocations
- Revenue Per Skill
- Adoption Trend
- Top Using Agents
- Geographic Distribution (if applicable)
- Error Rate

---

## 7. GOVERNANCE

### 7.1 Proposals List
- Active Proposals Tab
  - Proposal cards (ID, title, status, voting ends, votes for/against)
  - Filter by: Active, Passed, Failed, Draft, Queued
  - Sort by: Newest, Ending Soon, Most Votes
  - Create New Proposal Button
- Passed Proposals Tab
- Failed Proposals Tab
- Tally Bar (for/against/abstain)
- Proposal Categories (Slash amounts, SLA thresholds, new features, tokenomics)

### 7.2 Proposal Detail
- Proposal Header (ID, Title, Author, Status, Created date)
- Full Proposal Text (Motivation, specification, implementation plan, timeline)
- Discussion Thread (Arguments for/against, community comments)
- Vote Breakdown (Pie chart: for/against/abstain)
- Voter List (top voters, delegations)
- Cast Vote Panel (For / Against / Abstain with reason field)
- Vote History (your votes)
- Execution Plan (if passed)
- Voting Power Display (your MESH weight)

### 7.3 Create Proposal
- Proposal Type Selector (Protocol upgrade, Parameter change, Treasury, Other)
- Step 1: Title & Summary
- Step 2: Full Specification (Rich text editor)
- Step 3: Implementation Plan
- Step 4: Vote Timing (start date, end date)
- Step 5: Review & Submit
- Simulation (test proposal effects before submitting)

### 7.4 Delegation
- My Delegators (who delegated to me)
- My Delegate (who I delegated to)
- Delegate Search / Select
- Delegate MESH Amount
- Undelegate
- Delegation History
- Voting Activity (how my delegate voted)
- Delegation Rewards (if any)
- Auto-delegate Rules (always vote with delegate on category X)

### 7.5 Governance Analytics
- Participation Rate
- Vote Distribution
- Most Contested Proposals
- Proposal Success Rate Over Time
- Voter Turnout Chart
- Delegation Distribution Chart

---

## 8. ACCOUNT & STAKE

### 8.1 Profile
- Avatar & Display Name
- Wallet Address (copyable)
- Role Badges (Creator, Provider, Client, Genesis participant)
- bio / Description
- Stats Overview (Sessions as provider, sessions as client, agents created, skills published)
- Activity Timeline (recent actions)
- Social Links
- Connected Accounts (Twitter, GitHub if linked)
- Edit Profile

### 8.2 Stake Manager
- Stake Overview (Total MESH, Locked in sessions, Available, Delegated)
- Lock Stake Modal (amount, duration, associated session)
- Unlock Stake Request (start unlocking, see unlock queue)
- Lockup Positions Table (Session ID, Amount locked, Release date, Status)
- Unlocking Queue (pending unlocks timeline)
- Delegation Panel
- Stake History (all lock/unlock events)
- Slash History (all slash events, amounts, reasons)
- Recovery: What happens after slashing (can re-stake, path to recovery)

### 8.3 Notifications
- All Notifications
- Session Alerts (session started, ended, SLA warning, terminated)
- Slash Alerts (when you've been slashed)
- Proposal Alerts (new proposal, vote reminder, results)
- Earnings Alerts (payout ready, reward earned, skill payment received)
- System Alerts (protocol upgrade, maintenance, new feature)
- Mark All as Read
- Notification Settings (per-type toggle)
- Email Preferences
- Push Notification Preferences

### 8.4 Transaction History
- All Transactions Tab
  - Transaction list (date, type, amount, status, hash)
  - Filter by: type (stake/lock/unlock/slash/payment/reward), date range
- Stake Transactions Tab
- Session Payments Tab
- Reward Claims Tab
- Token Transfers Tab
- Gas spent per transaction
- Export All (CSV, PDF)
- Wallet Balance History

### 8.5 Security
- Connected Wallets
- Session Management (active sessions, revoke access)
- API Keys (create, view, revoke)
- Two-Factor Authentication (enable, disable, recovery codes)
- Login History
- Device Management

### 8.6 API Keys
- Create New Key
- Key List (name, permissions, created, last used)
- Key Permissions (read, write, admin per contract)
- Revoke Key
- Rate Limit Display

---

## 9. GENESIS PROGRAM

### 9.1 Genesis Program Overview
- Program Benefits Explained
- Current Tier Status (which tier you're in based on stake)
- Rewards Calculator (estimate earnings with 2x bonus)
- Eligibility Checker

### 9.2 Genesis Provider
- Provider Rewards Tracker (2x multiplier status)
- Bonus Earnings Breakdown
- Genesis Period End Date (countdown)
- Qualification Requirements
- How to Maintain Status

### 9.3 Genesis Builder
- Free Listing Status Tracker
- Fee Waiver Period (countdown)
- Agent Submission Counter
- Requirements to Maintain Free Listing

### 9.4 Genesis FAQ
- Program rules
- How to qualify
- What happens when program ends
- Can I join late?

---

## 10. SETTINGS (GLOBAL)

### 10.1 Account Settings
- Display Name
- Avatar Upload
- Bio
- Email
- Change Password
- Delete Account

### 10.2 Appearance
- Theme (Light / Dark / System)
- Language
- Timezone
- Number format (locale)

### 10.3 Notifications Settings
- Per-category toggles (Session alerts, Slash alerts, Proposals, Earnings, System)
- Channel preferences (In-app, Email, Push)
- Quiet hours

### 10.4 Security Settings
- Change Password
- Two-Factor Authentication
- Active Sessions
- API Keys
- Login History

### 10.5 Connected Apps
- OAuth Connections
- Authorized Contracts
- Permissions Granted

### 10.6 Data & Privacy
- Export All Data (GDPR compliance)
- Download session history
- Download earnings history
- Delete Account
- Privacy Policy

---

## 11. ERROR & SYSTEM PAGES

### 11.1 Error Pages
- 404 Not Found
- 500 Server Error
- Service Unavailable (503)
- Session Failed (with retry option)
- Connection Lost (auto-retry UI)
- Wallet Connection Failed

### 11.2 Onboarding Flows
- Welcome Screen
- Wallet Connection (multiple wallet options)
- Role Selection (Creator / Provider / Client / All)
- Initial Stake Setup (how much to stake, why it matters)
- CLI Installation (for providers) — step by step
- First Session Walkthrough (for clients)
- Agent Creation Walkthrough (for creators)
- Completion / Done Screen

### 11.3 Empty States
- No Agents Available (with "be the first to list" CTA)
- No Sessions Yet (first session CTA)
- No Notifications
- No Transactions
- No Proposals Yet
- No Earnings Yet

### 11.4 Loading States
- Skeleton screens per page
- Optimistic UI for session launch
- Progressive loading for agent grids

---

## 12. ADMIN (Internal)

### 12.1 Admin Dashboard
- Platform Overview (total agents, sessions, volume)
- User Metrics (new signups, active, churn)
- Revenue Metrics (platform fees collected)
- Slash Event Tracker
- Flagged Agents / Users
- Genesis Program Status

### 12.2 Agent Moderation
- Pending Approval Agents
- Flagged Agents List
- Suspended Agents
- Content Moderation Queue
- Ban User

### 12.3 Skill Audit Queue
- Skills Under Review
- Audit Decision Tools
- Version Approval

### 12.4 Governance Admin
- Proposal Parameter Settings
- Emergency Stop (pause protocol)
- Treasury Management

---

## Page Count Summary

| Section | Pages |
|---------|-------|
| Public / Marketing | ~35 |
| Marketplace | ~15 |
| Compute Provider | ~20 |
| Agent Creator / Builder | ~25 |
| Client | ~15 |
| Skill Registry | ~15 |
| Governance | ~15 |
| Account & Stake | ~15 |
| Genesis Program | ~10 |
| Settings | ~10 |
| Errors & System | ~15 |
| Admin | ~10 |
| **Total** | **~200 pages** |

> Note: Many pages share components and templates. The actual page count with unique routes is approximately **80-100 distinct routes** with hundreds of sub-views, modals, and states within them.

---

## Development Priority

### P0 — MVP Core (Launchable)
1-26 (the original 26 pages) + critical error states + loading states

### P1 — Production Hardening
All remaining pages in this document, admin panel, full empty states

### P2 — Optimization
Analytics dashboards, advanced filtering, performance improvements