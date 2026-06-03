# Complete Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create all missing route pages from `docs/pages-v1-full.md`, then finish project setup (env, types consolidation, API routes, hooks).

**Architecture:** Next.js 15 App Router with route groups `(marketing)`, `(marketplace)`, `(provider)`, `(builder)`, `(client)`, `(skills)`, `(governance)`, `(account)`, `(admin)`, `(errors)`, `(onboarding)`. Each route group has its own layout wrapping shared Navbar/Footer. Shared UI components live in `src/components/ui/`. Types are centralized in `src/types/index.ts`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui components, Sonner for toasts, React Hook Form + Zod for forms.

---

## PHASE 1: Marketing & Public Routes

### Task 1: Landing Page Alias (`/` → `(marketing)/landing`)
**Files:**
- Modify: `src/app/page.tsx` (import and re-export from landing page, or make `(marketing)/landing/page.tsx` the canonical `/`)

The landing page content is currently in `src/app/page.tsx` but should live at `src/app/(marketing)/landing/page.tsx` with `/` as the alias.

### Task 2: Docs Pages
**Files:**
- Create: `src/app/(marketing)/docs/page.tsx`
- Create: `src/app/(marketing)/docs/getting-started/page.tsx`
- Create: `src/app/(marketing)/docs/quick-start/page.tsx`
- Create: `src/app/(marketing)/docs/api-reference/page.tsx`
- Create: `src/app/(marketing)/docs/sdk/page.tsx`
- Create: `src/app/(marketing)/docs/tutorials/page.tsx`
- Create: `src/app/(marketing)/docs/tutorials/first-agent/page.tsx`
- Create: `src/app/(marketing)/docs/tutorials/provider-node/page.tsx`
- Create: `src/app/(marketing)/docs/troubleshooting/page.tsx`
- Create: `src/app/(marketing)/docs/glossary/page.tsx`
- Create: `src/app/(marketing)/docs/changelog/page.tsx`
- Create: `src/app/(marketing)/docs/contact/page.tsx`
- Create: `src/app/(marketing)/docs/layout.tsx` (doc-specific layout with sidebar nav)

**Pattern:** Docs layout with left sidebar for navigation (Getting Started, API Reference, SDK, Tutorials), main content area, and optional right TOC. Use `navigation-menu` or custom sidebar component. Each doc page has breadcrumb, content, and prev/next navigation.

### Task 3: FAQ Page
**Files:**
- Create: `src/app/(marketing)/faq/page.tsx`

**Content:** Accordion of FAQ items (pricing, how SLA works, how to become a provider, how agents learn, etc.). Import `Accordion` from UI components.

---

## PHASE 2: Marketplace Routes

### Task 4: Marketplace Analytics Dashboard
**Files:**
- Create: `src/app/(marketplace)/analytics/page.tsx`

**Content:**
- Grid of stat cards: Total Agents Listed, Average Pricing, Total Sessions Volume
- ASCII bar charts for TPM Distribution and Quality Score Distribution
- Category breakdown table
- Trending Agents list
- New Listings This Week grid

Use `Card`, `Table`, and ASCII chart components similar to existing pages.

---

## PHASE 3: Provider Routes

### Task 5: Provider Sessions — Active Tab Detail View
**Files:**
- Create: `src/app/(provider)/sessions/active/page.tsx`
- Modify: `src/app/(provider)/sessions/page.tsx` (add tab navigation: Active / Completed / Cancelled)

**Content:** Sessions table with real-time metrics, session cards showing agent name, client, TPM used, earnings, SLA health. Heartbeat status indicator. Session termination controls.

### Task 6: Provider Sessions — Completed Tab
**Files:**
- Create: `src/app/(provider)/sessions/completed/page.tsx`

**Content:** Session history table with filter by date range, agent, outcome. Earnings per session. SLA compliance per session. Slash events attached to sessions.

### Task 7: Provider Sessions — Cancelled Tab
**Files:**
- Create: `src/app/(provider)/sessions/cancelled/page.tsx`

**Content:** Cancelled sessions list with cancellation reason, partial charges.

### Task 8: Provider Earnings — Revenue Breakdown Detail
**Files:**
- Create: `src/app/(provider)/provider-earnings/revenue-breakdown/page.tsx`
- Modify: `src/app/(provider)/provider-earnings/page.tsx` (add tab navigation or link to breakdown)

**Content:** Revenue breakdown chart (Base earnings, SLA compliance bonuses, Genesis program bonuses, Skill invocation earnings). Use ASCII bar chart breakdown by category.

### Task 9: Provider Node — Configuration & Logs
**Files:**
- Create: `src/app/(provider)/node/configuration/page.tsx`
- Create: `src/app/(provider)/node/logs/page.tsx`

**Content for config:** Max concurrent sessions slider, Min TPM floor, Max latency threshold, Skill whitelist. Use `Slider`, `Input`, `Switch` components.

**Content for logs:** Node logs viewer with filtering by log level (info, warn, error). Use `ScrollArea`, `Badge` for log levels.

### Task 10: Provider Settings — API Keys, Security, Connected Tools
**Files:**
- Create: `src/app/(provider)/provider-settings/api-keys/page.tsx`
- Create: `src/app/(provider)/provider-settings/security/page.tsx`
- Create: `src/app/(provider)/provider-settings/connected-tools/page.tsx`

**Content for api-keys:** Table of keys (name, permissions, created, last used). Create/revoke buttons. Rate limit display.

**Content for security:** 2FA toggle, session management table, login history.

**Content for connected-tools:** List of connected integrations (CLI, monitoring tools, etc.).

---

## PHASE 4: Builder Routes

### Task 11: Builder — Agent Version History
**Files:**
- Create: `src/app/(builder)/edit-agent/[id]/versions/page.tsx`
- Modify: `src/app/(builder)/edit-agent/[id]/page.tsx` (add version history sidebar toggle)

**Content:** Version history timeline for each agent. Rollback button per version. Show changelog, date, quality score at that version.

### Task 12: Builder — Learning Logs Detail
**Files:**
- Modify: `src/app/(builder)/learning-logs/page.tsx` (add expandable session cards showing full learning signal details)

**Content:** Per-session learning signal display: task description, agent response preview, client rating, task completion status, latency metrics, TPM achieved, spot-check pass/fail. Pending approval queue at top. Approved/Rejected sections below.

### Task 13: Builder — Agent Analytics Detail (Builder View)
**Files:**
- Modify: `src/app/(builder)/analytics/page.tsx` (add more detailed charts or split into `analytics/overview` and `analytics/[agentId]`)

**Content:** Quality Score Trend chart, TPM vs Contracted chart, Latency Distribution heatmap, Session Completion Rate, Average Rating Over Time, Revenue Per Session, Learning Impact before/after. Failure Mode Analysis table. Spot-Check Results History. Competitor Comparison (ASCII bar chart of ranking).

### Task 14: Builder — My Agents — Bulk Actions & Filters
**Files:**
- Modify: `src/app/(builder)/my-agents/page.tsx` (add bulk actions toolbar and enhanced filtering)

**Content:** Add filter by Category, Status, Quality tier checkboxes. Sort dropdown. Bulk action toolbar with "Pause All", "Update Pricing" buttons.

---

## PHASE 5: Client Routes

### Task 15: Client — Session Launcher — Natural Language Query
**Files:**
- Modify: `src/app/(client)/launcher/page.tsx` (enhance the natural language query bar, add capability filter panel)

**Content:** Large "What do you need?" NL query bar at top. Below: capability filter panel (task category dropdown, TPM slider, max latency slider, price range slider, quality minimum slider). Results: matched agents ranked by SLA compatibility with "Best Match" badge.

### Task 16: Client — Active Session Monitor
**Files:**
- Create: `src/app/(client)/active-session/[id]/monitor/page.tsx`
- Modify: `src/app/(client)/active-session/[id]/page.tsx` (add real-time metrics display)

**Content:** Session header (agent name, session ID, start time, elapsed). Real-time metrics: TPM usage bar vs contracted cap, current latency, cost accumulator updating per second, heartbeat indicator. SLA Health Bar (green/yellow/red). Session timeline/event log. Chat/interaction feed if applicable. Controls: Extend session, Adjust SLA params, Emergency termination, Report agent. Cost projection. End Session button.

### Task 17: Client — Session History — Completed & Failed Tabs
**Files:**
- Create: `src/app/(client)/session-history/completed/page.tsx`
- Create: `src/app/(client)/session-history/failed/page.tsx`
- Modify: `src/app/(client)/session-history/page.tsx` (add tab navigation)

**Content for completed:** Full receipt per session, SLA compliance verdict, refunds applied, rating given, feedback text.

**Content for failed:** Failure reason, partial charges, SLA penalty applied, Dispute button.

### Task 18: Client — Favorites
**Files:**
- Modify: `src/app/(client)/favorites/page.tsx` (add availability alerts toggle, comparison history)

**Content:** Saved agents grid. Per-agent: availability status badge, "Notify when online" toggle. Comparison history section. Empty state if no favorites.

---

## PHASE 6: Skills Routes

### Task 19: Skills — Skill Detail — All Tabs
**Files:**
- Modify: `src/app/(skills)/skill/[id]/page.tsx` (ensure all tabs are implemented)

**Tabs to implement:** Overview (description, use cases, I/O spec), Technical Spec (parameters, return values, error codes), Version History (changelog per version, migration guide), Usage Stats (total invocations, unique agents, earnings — for author view), Author tab (profile, other skills, reputation), Earnings tab (author view: earnings per version), Reviews, Dependencies (what skills depend on this, what agents use it), Integration Guide (how to add to agent).

### Task 20: Skills — My Skills — Performance Dashboard
**Files:**
- Modify: `src/app/(skills)/my-skills/page.tsx` (add performance dashboard section)

**Content:** Per-skill: version, status, usage stats, earnings. Update Skill button, Deprecate Skill button. Skill performance dashboard with invocation chart, revenue chart.

### Task 21: Skills — Browse — Enhanced Filters
**Files:**
- Modify: `src/app/(skills)/browse/page.tsx` (add category filter sidebar, trending/new sections)

**Content:** Sidebar with category filter checkboxes. Skill cards grid showing name, version, author, usage count, rating, price. Sort by Popular, New, Top Earners, Top Rated. Trending Skills section at top. New Skills section. Skill of the Week feature card.

### Task 22: Skills — Skill Analytics (Author)
**Files:**
- Create: `src/app/(skills)/my-skills/analytics/page.tsx`

**Content:** Total Invocations stat, Revenue Per Skill bar chart, Adoption trend line, Top Using Agents list, Error Rate percentage.

---

## PHASE 7: Governance Routes

### Task 23: Governance — Proposals List — All Tabs
**Files:**
- Modify: `src/app/(governance)/proposals/page.tsx` (add tab navigation: Active / Passed / Failed / Draft / Queued)

**Content:** Proposal cards with tally bar (for/against/abstain), filter by category. Create New Proposal button prominent.

### Task 24: Governance — Proposal Detail — Full Implementation
**Files:**
- Modify: `src/app/(governance)/proposal/[id]/page.tsx` (implement full detail page)

**Content:** Proposal header (ID, title, author, status, created). Full proposal text (motivation, specification, implementation plan, timeline). Discussion thread. Vote breakdown pie chart (ASCII). Voter list. Cast Vote panel (For / Against / Abstain with reason textarea). Vote history (your votes). Execution plan section. Voting power display.

### Task 25: Governance — Create Proposal — Full Multi-Step Form
**Files:**
- Modify: `src/app/(governance)/proposals/create/page.tsx` (implement full multi-step form)

**Steps:** Step 1: Title & Summary (text inputs). Step 2: Full Specification (rich text area). Step 3: Implementation Plan. Step 4: Vote Timing (start/end date pickers). Step 5: Review & Submit. Add simulation step if time allows. Use `Stepper` component or custom step indicator.

### Task 26: Governance — Delegation — Full Implementation
**Files:**
- Modify: `src/app/(governance)/delegation/page.tsx` (implement full delegation panel)

**Content:** My Delegators list (who delegated to me, amounts). My Delegate section (who I delegated to, amount). Delegate search/select. Delegate MESH amount input. Undelegate button. Delegation history table. Voting activity section (how my delegate voted). Auto-delegate rules.

### Task 27: Governance — Analytics — Full Dashboard
**Files:**
- Modify: `src/app/(governance)/governance-analytics/page.tsx` (implement full dashboard)

**Content:** Participation rate chart, vote distribution pie, most contested proposals table, proposal success rate over time line chart, voter turnout chart, delegation distribution chart. Use ASCII charts.

---

## PHASE 8: Account Routes

### Task 28: Account — Settings — All Sub-pages
**Files:**
- Create: `src/app/(account)/settings/security/page.tsx`
- Create: `src/app/(account)/settings/api-keys/page.tsx`
- Create: `src/app/(account)/settings/connected-apps/page.tsx`

**Content for security:** Change password form (current, new, confirm). 2FA setup/disable. Active sessions list with revoke. Login history table.

**Content for api-keys:** Create new key button, key list table (name, permissions, created, last used), revoke button.

**Content for connected-apps:** OAuth connections list, authorized contracts list, permissions granted per app.

### Task 29: Account — Profile — Edit Mode
**Files:**
- Modify: `src/app/(account)/profile/page.tsx` (add edit profile form)

**Content:** Editable fields for display name, bio, avatar upload, social links. Role badges display. Activity timeline. Stats overview. Connected accounts section (Twitter, GitHub).

---

## PHASE 9: Genesis Sub-Sections

### Task 30: Genesis — Provider & Builder Sub-pages
**Files:**
- Create: `src/app/(marketing)/genesis/provider/page.tsx`
- Create: `src/app/(marketing)/genesis/builder/page.tsx`
- Create: `src/app/(marketing)/genesis/faq/page.tsx`
- Modify: `src/app/(marketing)/genesis/page.tsx` (add navigation to sub-pages)

**Content for provider:** Provider rewards tracker (2x multiplier status), bonus earnings breakdown, genesis period end date countdown, qualification requirements, how to maintain status.

**Content for builder:** Free listing status tracker, fee waiver period countdown, agent submission counter, requirements to maintain free listing.

**Content for faq:** Program rules, how to qualify, what happens when program ends, can I join late? Use `Accordion`.

---

## PHASE 10: Error Pages & Onboarding

### Task 31: Error Pages — Missing Ones
**Files:**
- Create: `src/app/(errors)/503/page.tsx`
- Create: `src/app/(errors)/session-failed/page.tsx`
- Create: `src/app/(errors)/connection-lost/page.tsx`
- Create: `src/app/(errors)/wallet-connection-failed/page.tsx`

**Content:** Each with clear error message, illustration (ASCII art or emoji), action buttons (retry, go home, contact support). `503` = maintenance mode with countdown. `session-failed` = retry option. `connection-lost` = auto-retry UI with countdown. `wallet-connection-failed` = wallet reconnect options.

### Task 32: Onboarding — Step-by-Step Flows
**Files:**
- Create: `src/app/(onboarding)/wallet-connect/page.tsx`
- Create: `src/app/(onboarding)/role-selection/page.tsx`
- Create: `src/app/(onboarding)/stake-setup/page.tsx`
- Create: `src/app/(onboarding)/cli-installation/page.tsx` (for providers)
- Create: `src/app/(onboarding)/first-session/page.tsx` (for clients)
- Create: `src/app/(onboarding)/agent-creation/page.tsx` (for creators)
- Create: `src/app/(onboarding)/complete/page.tsx`

**Content:** Each a single focused page/step. Wallet connect: multiple wallet options (MetaMask, WalletConnect, etc.). Role selection: cards for Creator/Provider/Client/All. Stake setup: explanation + amount selector. CLI installation: step-by-step with code blocks. First session: mini walkthrough. Agent creation: quick create flow. Completion: success message with CTA to start.

### Task 33: Empty States
**Files:**
- Create: `src/components/empty-state.tsx` (shared component)
- Update pages that need empty states to use it

**Empty states to cover:** No Agents, No Sessions, No Notifications, No Transactions, No Proposals, No Earnings. Each with relevant CTA.

---

## PHASE 11: Project Infrastructure Setup

### Task 34: Environment Configuration
**Files:**
- Create: `src/config/index.ts` (export all environment variables with validation)
- Create: `.env.local.example` (template with all required env vars documented)
- Add to `.gitignore`: `.env.local`

**Content:** NEXT_PUBLIC_* variables for client-side (API URL, chain ID, contract addresses), server-side secrets (DATABASE_URL, etc.). Use Zod for runtime validation.

### Task 35: API Routes — Core Endpoints
**Files:**
- Create: `src/app/api/agents/route.ts` (GET all agents, POST create agent)
- Create: `src/app/api/agents/[id]/route.ts` (GET agent by ID, PUT update, DELETE)
- Create: `src/app/api/sessions/route.ts` (GET sessions, POST create session)
- Create: `src/app/api/sessions/[id]/route.ts` (GET session, POST end session)
- Create: `src/app/api/providers/route.ts` (GET providers)
- Create: `src/app/api/providers/[id]/route.ts` (GET/PUT provider)
- Create: `src/app/api/skills/route.ts` (GET skills, POST publish)
- Create: `src/app/api/governance/proposals/route.ts` (GET proposals, POST create)
- Create: `src/app/api/governance/proposals/[id]/vote/route.ts` (POST vote)

**Pattern:** Next.js App Router Route Handlers returning Response JSON. Use `NextRequest`, `NextResponse`. Each should handle errors gracefully with appropriate status codes.

### Task 36: React Hooks
**Files:**
- Create: `src/hooks/useWallet.ts` (wallet connection state, connect/disconnect)
- Create: `src/hooks/useAgent.ts` (fetch agent by ID, loading, error states)
- Create: `src/hooks/useSession.ts` (session management, real-time metrics)
- Create: `src/hooks/useStake.ts` (stake positions, lock/unlock operations)
- Create: `src/hooks/useNotifications.ts` (fetch notifications, mark as read)

### Task 37: Providers & Context
**Files:**
- Modify: `src/components/providers.tsx` (ensure all context providers are included: WalletProvider, ToastProvider, etc.)

### Task 38: Constants
**Files:**
- Create: `src/constants/index.ts` (export all constants: AGENT_CATEGORIES, SESSION_STATUS, SLA_BREACH_TYPES, PROPOSAL_STATUS, VOTE_OPTIONS, NOTIFICATION_TYPES, Genesis tier thresholds, etc.)

---

## Task Sequencing

1. First create empty route directories in batches by section group
2. Implement each page as a stub first (just the shell), verify no build errors
3. Then fill in with full content
4. After all routes exist, set up infrastructure files (env, api routes, hooks, constants)
5. Final verification: `npm run build` passes

## Verification
- [ ] `npm run build` succeeds with zero errors
- [ ] All routes in `docs/pages-v1-full.md` have corresponding files
- [ ] TypeScript types compile without errors
- [ ] All environment variables are documented in `.env.local.example`