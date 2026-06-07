# Page Design Priority — 200 Pages

> Ranked by revenue impact, user engagement, and operational criticality.
> Use this as your design sprint order — Tier 1 pages ship first.

---

## 🔴 Tier 1 — Revenue-Critical (25 pages)
*Pages where money changes hands or core transactions occur*

| Priority | Page | Path |
|:---:|------|------|
| 1 | **Marketplace Browse** | `(marketplace)/browse-agents` |
| 2 | **Agent Detail** | `(marketplace)/agent/[id]` |
| 3 | **Active Session** | `(client)/active-session/[id]` |
| 4 | **Session History** | `(client)/session-history` |
| 5 | **Client Launcher** | `(client)/launcher` |
| 6 | **Provider Sessions** | `(provider)/sessions` |
| 7 | **Provider Node** | `(provider)/node` |
| 8 | **Provider Earnings** | `(provider)/provider-earnings` |
| 9 | **Builder Earnings** | `(builder)/builder-earnings` |
| 10 | **My Agents** | `(builder)/my-agents` |
| 11 | **Create Agent** | `(builder)/create-agent` |
| 12 | **Edit Agent** | `(builder)/edit-agent/[id]` |
| 13 | **Client Payments** | `(client)/payments` |
| 14 | **Payment Detail** | `(client)/payments/[id]` |
| 15 | **Provider Stake** | `(provider)/stake` |
| 16 | **Stake Manager** | `(account)/stake-manager` |
| 17 | **Transaction History** | `(account)/transaction-history` |
| 18 | **Earnings Payouts** | `(provider)/earnings/payouts` |
| 19 | **Earnings Forecast** | `(provider)/earnings/forecast` |
| 20 | **Earnings Export** | `(provider)/earnings/export` |
| 21 | **Provider Home** | `(provider)/provider-home` |
| 22 | **Builder Home** | `(builder)/builder-home` |
| 23 | **Client Home** | `(client)/client-landing` |
| 24 | **Trending** | `(marketplace)/trending` |
| 25 | **Compare Agents** | `(marketplace)/compare` |

---

## 🟠 Tier 2 — Core User Flows (22 pages)
*Pages that drive engagement and keep users on the platform*

| Priority | Page | Path |
|:---:|------|------|
| 26 | **Client Budget Setup** | `(onboarding)/client/budget-setup` |
| 27 | **Client Budget Manage** | `(client)/budget/manage` |
| 28 | **Client Budget** | `(client)/budget` |
| 29 | **Session Extend** | `(client)/active-session/[id]/extend` |
| 30 | **Client Favorites** | `(client)/favorites` |
| 31 | **Session History Detail** | `(client)/session-history/[id]` |
| 32 | **Refunds** | `(client)/refunds` |
| 33 | **Disputes** | `(client)/disputes` |
| 34 | **Dispute Detail** | `(client)/disputes/[id]` |
| 35 | **Agent Reviews** | `(marketplace)/agent/[id]/reviews` |
| 36 | **Agent Analytics** | `(marketplace)/agent/[id]/analytics` |
| 37 | **Browse Agent Detail** | `(marketplace)/browse-agents/[id]` |
| 38 | **My Skills** | `(skills)/my-skills` |
| 39 | **Skill Detail** | `(skills)/skill/[id]` |
| 40 | **Skill Versions** | `(skills)/skill/[id]/versions` |
| 41 | **Skill Dependencies** | `(skills)/skill/[id]/dependencies` |
| 42 | **Skill Integration** | `(skills)/skill/[id]/integration` |
| 43 | **Publish Skill** | `(skills)/publish` |
| 44 | **Builder Learning Logs** | `(builder)/learning-logs` |
| 45 | **Learning Log Detail** | `(builder)/learning-logs/[id]` |
| 46 | **Pending Learning** | `(builder)/learning-logs/pending` |
| 47 | **Agent Learning** | `(builder)/my-agents/[id]/learning` |

---

## 🟡 Tier 3 — Retention & Trust (18 pages)
*Pages that build trust, retain users, and support long-term engagement*

| Priority | Page | Path |
|:---:|------|------|
| 48 | **Governance Proposals** | `(governance)/proposals` |
| 49 | **Proposal Detail** | `(governance)/proposal/[id]` |
| 50 | **Create Proposal** | `(governance)/proposals/create` |
| 51 | **Proposal Debate** | `(governance)/proposals/[id]/debate` |
| 52 | **Proposal Vote** | `(governance)/proposals/[id]/vote` |
| 53 | **Delegation** | `(governance)/delegation` |
| 54 | **Delegate Detail** | `(governance)/delegate/[id]` |
| 55 | **Delegation Analytics** | `(governance)/delegation/analytics` |
| 56 | **Voting History** | `(governance)/voting-history` |
| 57 | **Governance Analytics** | `(governance)/governance-analytics` |
| 58 | **Builder Analytics** | `(builder)/analytics` |
| 59 | **Revenue Analytics** | `(builder)/analytics/revenue` |
| 60 | **Quality Analytics** | `(builder)/analytics/quality` |
| 61 | **Marketplace Analytics** | `(marketplace)/analytics` |
| 62 | **My Skills Analytics** | `(skills)/my-skills/[id]/analytics` |
| 63 | **My Skills Version** | `(skills)/my-skills/[id]/version` |
| 64 | **Node Configuration** | `(provider)/node/configuration` |
| 65 | **Node Diagnostics** | `(provider)/node/diagnostics` |

---

## 🟢 Tier 4 — Settings & Account Management (32 pages)
*Account, settings, and profile management*

| Priority | Page | Path |
|:---:|------|------|
| 66 | **Profile** | `(account)/profile` |
| 67 | **Account Settings** | `(account)/settings` |
| 68 | **Settings Account** | `(account)/settings/account` |
| 69 | **Settings Appearance** | `(account)/settings/appearance` |
| 70 | **Settings Data** | `(account)/settings/data` |
| 71 | **Settings Security** | `(account)/settings/security` |
| 72 | **Settings API Keys** | `(account)/settings/api-keys` |
| 73 | **Settings Notifications** | `(account)/settings/notifications` |
| 74 | **Settings Connected Apps** | `(account)/settings/connected-apps` |
| 75 | **API Keys** | `(account)/api-keys` |
| 76 | **Connected Apps** | `(account)/connected-apps` |
| 77 | **Notifications** | `(account)/notifications` |
| 78 | **Notification Settings** | `(account)/notifications/settings` |
| 79 | **Security** | `(account)/security` |
| 80 | **Preferences** | `(account)/preferences` |
| 81 | **Client Settings** | `(client)/settings` |
| 82 | **Client Settings Alerts** | `(client)/settings/alerts` |
| 83 | **Client Settings Budget** | `(client)/settings/budget` |
| 84 | **Builder Settings** | `(builder)/builder-settings` |
| 85 | **Builder Settings CI/CD** | `(builder)/settings/ci-cd` |
| 86 | **Builder Settings Delegation** | `(builder)/settings/delegation` |
| 87 | **Provider Settings** | `(provider)/provider-settings` |
| 88 | **Provider Settings Integrations** | `(provider)/settings/integrations` |
| 89 | **Provider Settings CLI Update** | `(provider)/settings/cli-update` |
| 90 | **Node Logs** | `(provider)/node/logs` |
| 91 | **Genesis Builder** | `(marketing)/genesis/builder` |
| 92 | **Genesis Provider** | `(marketing)/genesis/provider` |
| 93 | **Genesis FAQ** | `(marketing)/genesis/faq` |
| 94 | **Genesis How to Join** | `(marketing)/genesis/how-to-join` |
| 95 | **Genesis Terms** | `(marketing)/genesis/terms` |
| 96 | **Genesis** | `(marketing)/genesis` |
| 97 | **How It Works** | `(marketing)/how-it-works` |

---

## 🔵 Tier 5 — Onboarding (20 pages)
*New user activation flows*

| Priority | Page | Path |
|:---:|------|------|
| 98 | **Welcome** | `(onboarding)/welcome` |
| 99 | **Client Role Selection** | `(onboarding)/client/role-selection` |
| 100 | **Client Wallet Connect** | `(onboarding)/client/wallet-connect` |
| 101 | **Client First Session** | `(onboarding)/client/first-session` |
| 102 | **Client Onboarding Hub** | `(onboarding)/client/onboarding-hub` |
| 103 | **Client Complete** | `(onboarding)/client/complete` |
| 104 | **Builder Role Selection** | `(onboarding)/builder/role-selection` |
| 105 | **Builder Wallet Connect** | `(onboarding)/builder/wallet-connect` |
| 106 | **Builder Stake Setup** | `(onboarding)/builder/stake-setup` |
| 107 | **Builder Agent Creation** | `(onboarding)/builder/agent-creation` |
| 108 | **Builder Onboarding Hub** | `(onboarding)/builder/onboarding-hub` |
| 109 | **Builder Complete** | `(onboarding)/builder/complete` |
| 110 | **Provider Role Selection** | `(onboarding)/provider/role-selection` |
| 111 | **Provider Wallet Connect** | `(onboarding)/provider/wallet-connect` |
| 112 | **Provider Stake Setup** | `(onboarding)/provider/stake-setup` |
| 113 | **Provider Agent Creation** | `(onboarding)/provider/agent-creation` |
| 114 | **Provider CLI Install** | `(onboarding)/provider/cli-install` |
| 115 | **Provider First Session** | `(onboarding)/provider/first-session` |
| 116 | **Provider Onboarding Hub** | `(onboarding)/provider/onboarding-hub` |
| 117 | **Provider Complete** | `(onboarding)/provider/complete` |

---

## 🔵 Tier 6 — Marketing & Docs (31 pages)
*Marketing content, documentation, and legal*

| Priority | Page | Path |
|:---:|------|------|
| 118 | **Home** | `src/app/page.tsx` |
| 119 | **About** | `(marketing)/about` |
| 120 | **Blog** | `(marketing)/blog` |
| 121 | **Blog Post** | `(marketing)/blog/[slug]` |
| 122 | **Contact** | `(marketing)/contact` |
| 123 | **Status** | `(marketing)/status` |
| 124 | **Privacy** | `(marketing)/privacy` |
| 125 | **Terms** | `(marketing)/terms` |
| 126 | **Cookies** | `(marketing)/cookies` |
| 127 | **Docs Getting Started** | `(marketing)/docs/getting-started` |
| 128 | **Docs SDK** | `(marketing)/docs/sdk` |
| 129 | **Docs API** | `(marketing)/docs/api` |
| 130 | **Docs API Endpoints** | `(marketing)/docs/api/endpoints` |
| 131 | **Docs API SDKs** | `(marketing)/docs/api/sdks` |
| 132 | **Docs FAQ** | `(marketing)/docs/faq` |
| 133 | **Docs Glossary** | `(marketing)/docs/glossary` |
| 134 | **Docs Changelog** | `(marketing)/docs/changelog` |
| 135 | **Docs Troubleshooting** | `(marketing)/docs/troubleshooting` |
| 136 | **Docs Tutorials** | `(marketing)/docs/tutorials` |
| 137 | **Tutorial Build First Agent** | `(marketing)/docs/tutorials/build-first-agent` |
| 138 | **Tutorial Create Skill** | `(marketing)/docs/tutorials/create-skill` |
| 139 | **Tutorial Governance Proposal** | `(marketing)/docs/tutorials/governance-proposal` |
| 140 | **Tutorial Provider Node** | `(marketing)/docs/tutorials/provider-node` |
| 141 | **Skills Browse** | `(skills)/browse` |
| 142 | **Builder Landing** | `(builder)/builder-landing` |
| 143 | **Provider Landing** | `(provider)/provider-landing` |
| 144 | **Onboarding Complete** | `(onboarding)/complete` |
| 145 | **Builder Onboarding** | `(builder)/onboarding` |
| 146 | **Client Onboarding** | `(client)/onboarding` |
| 147 | **Provider Onboarding** | `(provider)/onboarding` |
| 148 | **Agent Versions** | `(builder)/my-agents/[id]/versions` |

---

## ⚪ Tier 7 — Admin (14 pages)
*Internal platform management*

| Priority | Page | Path |
|:---:|------|------|
| 149 | **Admin Dashboard** | `(admin)/dashboard` |
| 150 | **Admin Governance** | `(admin)/governance` |
| 151 | **Admin Moderation** | `(admin)/moderation` |
| 152 | **Admin Audit Queue** | `(admin)/audit-queue` |
| 153 | **Admin Audit Queue Detail** | `(admin)/audit-queue/[id]` |
| 154 | **Admin Audit History** | `(admin)/audit-queue/[id]/history` |
| 155 | **Admin Pending Reviews** | `(admin)/pending-reviews` |
| 156 | **Admin Flagged Agents** | `(admin)/flagged-agents` |
| 157 | **Admin Flagged Users** | `(admin)/flagged-users` |
| 158 | **Admin Skill Audit** | `(admin)/skill-audit` |
| 159 | **Admin Skill Audit Detail** | `(admin)/skill-audit/[id]` |
| 160 | **Admin Proposals** | `(admin)/proposals` |
| 161 | **Admin Slash Events** | `(admin)/slash-events` |
| 162 | **Admin Treasury** | `(admin)/treasury` |

---

## ⚪ Tier 8 — Admin Continued + Empty/Loading States (20 pages)
*Secondary admin tools and loading/empty states*

| Priority | Page | Path |
|:---:|------|------|
| 163 | **Admin Emergency Stop** | `(admin)/emergency-stop` |
| 164 | **Admin Parameters** | `(admin)/parameters` |
| 165 | **Admin User Search** | `(admin)/user-search` |
| 166 | **My Agents Empty** | `(builder)/my-agents/empty` |
| 167 | **Builder Earnings Empty** | `(builder)/builder-earnings/empty` |
| 168 | **Provider Earnings Empty** | `(provider)/provider-earnings/empty` |
| 169 | **Provider Sessions Empty** | `(provider)/sessions/empty` |
| 170 | **Provider Sessions Loading** | `(provider)/sessions/loading` |
| 171 | **Stake Manager Empty** | `(account)/stake-manager/empty` |
| 172 | **Stake Manager Loading** | `(account)/stake-manager/loading` |
| 173 | **Payments Empty** | `(client)/payments/empty` |
| 174 | **Skills Browse Empty** | `(skills)/browse/empty` |
| 175 | **My Skills Empty** | `(skills)/my-skills/empty` |
| 176 | **Delegation Empty** | `(governance)/delegation/empty` |
| 177 | **Compare Empty** | `(marketplace)/compare/empty` |
| 178 | **Launcher Loading** | `(client)/launcher/loading` |

---

## ⚫ Tier 9 — Error Pages (23 pages)
*Error and edge-case handling*

| Priority | Page | Path |
|:---:|------|------|
| 179 | **404** | `(errors)/404` |
| 180 | **500** | `(errors)/500` |
| 181 | **503** | `(errors)/503` |
| 182 | **Not Found** | `(errors)/not-found` |
| 183 | **Forbidden** | `(errors)/forbidden` |
| 184 | **Unauthorized** | `(errors)/unauthorized` |
| 185 | **Rate Limited** | `(errors)/rate-limited` |
| 186 | **Session Failed** | `(errors)/session-failed` |
| 187 | **Session Terminated** | `(errors)/session-terminated` |
| 188 | **Session Timeout** | `(errors)/session-timeout` |
| 189 | **Connection Lost** | `(errors)/connection-lost` |
| 190 | **Agent Unavailable** | `(errors)/agent-unavailable` |
| 191 | **Wallet Connection Failed** | `(errors)/wallet-connection-failed` |
| 192 | **Maintenance** | `(errors)/maintenance` |
| 193 | **No Agents** | `(errors)/no-agents` |
| 194 | **No Sessions** | `(errors)/no-sessions` |
| 195 | **No Notifications** | `(errors)/no-notifications` |
| 196 | **No Transactions** | `(errors)/no-transactions` |
| 197 | **No Proposals** | `(errors)/no-proposals` |
| 198 | **No Earnings** | `(errors)/no-earnings` |
| 199 | **Dispute Lost** | `(errors)/dispute-lost` |
| 200 | **Stake Insufficient** | `(errors)/stake-insufficient` |
| 201 | **Blog Not Found** | `(errors)/blog-not-found` |

---

## Summary by Tier

| Tier | Pages | Focus |
|:---:|:---:|:---|
| 🔴 1 | 25 | Revenue & transactions |
| 🟠 2 | 22 | Core user engagement |
| 🟡 3 | 18 | Retention & governance |
| 🟢 4 | 32 | Settings & account |
| 🔵 5 | 20 | Onboarding flows |
| 🔵 6 | 31 | Marketing & docs |
| ⚪ 7–8 | 38 | Admin + empty states |
| ⚫ 9 | 23 | Error pages |

**Total: 201 entries across 200 unique pages**
