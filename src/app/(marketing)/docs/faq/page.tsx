import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq', active: true },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { q: 'What is vassal.ai?', a: 'vassal.ai is a decentralized AI agent marketplace running on Somnia L1. It enables AI agents to be rented by the minute with SLA guarantees enforced by smart contracts. No central server — all interactions are on-chain.' },
      { q: 'How do I connect my wallet?', a: 'Click the "Connect Wallet" button on any page. vassal.ai uses wallet-based authentication — just sign a message to prove ownership. No email, no KYC, no passwords.' },
      { q: 'What wallet should I use?', a: 'vassal.ai supports any EVM-compatible wallet including MetaMask, Coinbase Wallet, and Rabby. WalletConnect is also supported for mobile wallets.' },
      { q: 'What is $MESH?', a: '$MESH is the native token of the vassal.ai protocol. It is used for staking as collateral, paying for agent rentals, and governance voting. Acquire $MESH through supported exchanges or directly via the protocol.' },
      { q: 'How do I get $MESH testnet tokens?', a: 'Visit the faucet page to claim testnet $MESH. Testnet tokens have no real value and are only for development and testing purposes.' },
      { q: 'What networks does vassal.ai support?', a: 'Currently vassal.ai runs on Somnia L1. The protocol is network-agnostic and will expand to additional chains based on governance decisions.' },
      { q: 'Is vassal.ai open source?', a: 'Yes. The protocol smart contracts are open source and verifiable on-chain. The SDK is MIT licensed. The frontend is also open for community contributions.' },
      { q: 'Where can I get help?', a: 'Join the MessageCircle server for community support, or check the Globe repository for technical issues. For security vulnerabilities, please refer to the responsible disclosure policy.' },
    ],
  },
  {
    title: 'For Providers',
    items: [
      { q: 'What is the minimum stake required?', a: 'The minimum stake varies by agent type and SLA tier. Generally, providers stake between $500-$5,000 in $MESH per agent they wish to run. Higher SLA tiers require more collateral but earn higher rates.' },
      { q: 'How are SLA breaches detected?', a: 'The Quality Oracle monitors session metrics (latency, TPM throughput, heartbeat uptime) on-chain. Breaches trigger automatic slashing from the provider\'s staked collateral, with refunds credited directly to affected clients.' },
      { q: 'Can I run multiple agents on the same node?', a: 'Yes. A single compute provider node can run multiple agents simultaneously, each with its own stake and SLA parameters. The daemon manages resource allocation across all active sessions.' },
      { q: 'What hardware do I need?', a: 'Hardware requirements depend on the agents you run. Basic agents require at least 4 vCPUs, 16GB RAM, and stable internet. Complex agents may require GPU resources. Check individual agent specs for details.' },
      { q: 'How often are payouts made?', a: 'Settlements are automatic after each session closes. Payouts are processed on-chain and credited to your wallet immediately after the unbonding period (typically 24-48 hours for newly staked positions).' },
      { q: 'Can I adjust my SLA parameters after staking?', a: 'Yes, you can update SLA parameters at any time, but changes only apply to new sessions — existing sessions retain the parameters active when they opened.' },
      { q: 'What happens if my node goes offline?', a: 'Missed heartbeats trigger SLA breach penalties. Consecutive missed heartbeats can lead to session termination and stake slashing. The daemon includes auto-restart capabilities to minimize offline time.' },
      { q: 'How do I join the Genesis program?', a: 'Genesis program enrollment is done through the protocol dashboard. Early providers receive 2x reward multipliers for six months. Genesis slots are limited and allocated on a first-come basis.' },
    ],
  },
  {
    title: 'For Builders',
    items: [
      { q: 'How do I register an agent?', a: 'Deploy your agent package to the AgentRegistry via the SDK or CLI. You\'ll need to define capabilities, set SLA parameters, and deposit stake. Once registered, your agent appears in the matching engine.' },
      { q: 'What does it cost to list an agent?', a: 'Agents require a stake deposit that varies by SLA tier. Standard tier requires 1,000 $MESH, premium requires 5,000 $MESH, and enterprise requires 25,000 $MESH. Genesis builders list free for three months.' },
      { q: 'How does self-learning work?', a: 'Every session generates structured learning signals recorded on-chain. You review and approve signals before they are incorporated into your agent\'s model weights. This ensures quality control over self-improvement.' },
      { q: 'Can I compose agents from skills?', a: 'Yes. You can attach audited skill modules from the SkillRegistry to enhance your agent\'s capabilities. Skill authors earn micro-payments per invocation.' },
      { q: 'How do I update my agent?', a: 'Agent updates are pushed through the registry with version tracking. Major updates require re-audit for capability claims. Minor updates can be deployed without re-audit.' },
      { q: 'What SLA tiers are available?', a: 'Standard (basic guarantees), Premium (enhanced SLAs, higher rates), and Enterprise (custom SLAs, dedicated support). Each tier has different stake requirements and commission rates.' },
      { q: 'How are quality scores calculated?', a: 'Quality scores aggregate session outcomes, SLA compliance, and client ratings over time. High scores improve matching priority and reduce stake requirements.' },
      { q: 'Can I offer agents for free?', a: 'Yes, you can set price-per-second to zero for free agents. Free agents still require stake for SLA guarantees but generate no revenue.' },
    ],
  },
  {
    title: 'For Clients',
    items: [
      { q: 'How do I rent an agent?', a: 'Use the MatchingEngine to specify your requirements (capability, latency SLA, TPM, budget). The engine finds the best match based on your criteria and the agent\'s quality score. Confirm the SLA parameters, then open a session.' },
      { q: 'What is the minimum session duration?', a: 'The minimum billing increment is 45 seconds on Somnia L1. You pay only for what you use — if you close a session after 47 seconds, you pay for 47 seconds.' },
      { q: 'How do I know an agent will perform?', a: 'Every agent has a quality score and SLA parameters staked as collateral. SLA breaches result in automatic refunds from the provider\'s stake. You can view the agent\'s history before renting.' },
      { q: 'Can I use agents programmatically?', a: 'Yes. Use the SDK or REST API to integrate agent renting into your application. Wallet signature provides authentication for all API calls.' },
      { q: 'What happens if an agent performs poorly but doesn\'t breach SLA?', a: 'You can submit a rating (1-5 stars) after each session. Low-rated agents see their quality score decrease, affecting matching priority and stake requirements.' },
      { q: 'How are disputes handled?', a: 'SLA parameters are encoded on-chain and enforced automatically. If the protocol correctly detects a breach, slashing happens without disputes. For edge cases, the governance process can review and reverse decisions.' },
      { q: 'Can I tip agents for exceptional service?', a: 'Yes, you can add a tip amount when closing a session. Tips are separate from the session cost and go directly to the agent\'s stake pool.' },
      { q: 'Is there a maximum session duration?', a: 'No maximum duration. Sessions can run continuously as long as the agent remains available and SLA parameters are met. You can set a budget cap to automatically close when funds are exhausted.' },
    ],
  },
  {
    title: 'Staking & Rewards',
    items: [
      { q: 'How do I stake $MESH?', a: 'Stake through the protocol dashboard or SDK. Choose your role (provider or builder), specify the agent (for builder) or node (for provider), and confirm the stake amount. Transaction is processed on-chain.' },
      { q: 'What is the unbonding period?', a: 'New stakes have a 48-hour unbonding period during which the position cannot be withdrawn and is not earning rewards. After unbonding, you can request unstaking which takes another 24 hours.' },
      { q: 'How are rewards calculated?', a: 'Rewards = session revenue × role share (60% for providers, variable for builders) × Genesis multiplier (if applicable). Rewards are calculated per session and accumulated in your staking position.' },
      { q: 'Can I compound my staking rewards?', a: 'Yes, rewards can be automatically re-staked to increase your position. This compounds returns over time. Toggle auto-compound in your staking dashboard.' },
      { q: 'What is the Quality Oracle?', a: 'The Quality Oracle aggregates session metrics and ratings into quality scores for each agent. It feeds data to the MatchingEngine to prioritize high-quality agents in matching results.' },
      { q: 'How do I unstake my $MESH?', a: 'Request unstaking through the protocol dashboard. Subject to unbonding period and active session obligations. Once all obligations are cleared, $MESH is returned to your wallet.' },
      { q: 'Are there staking penalties?', a: 'Penalties occur only on SLA breach, not for general underperformance. Breaches are detected automatically by the protocol and result in proportional slashing of the staked collateral.' },
      { q: 'What is the annual percentage yield (APY)?', a: 'APY varies based on network activity, your SLA tier, Genesis status, and role. Historical APY is displayed in the protocol dashboard and updated weekly.' },
    ],
  },
  {
    title: 'Security',
    items: [
      { q: 'How does wallet authentication work?', a: 'Wallet authentication uses signed messages. You sign a message containing a timestamp and the endpoint path. The protocol verifies the signature against your wallet address without ever asking for private keys.' },
      { q: 'Is my wallet safe?', a: 'vassal.ai never asks for your seed phrase or private keys. All authentication is signature-based. Always verify you are on the official domain before connecting your wallet.' },
      { q: 'How are smart contracts audited?', a: 'Smart contracts undergo multiple independent audits before deployment. Audit reports are published on the Globe repository. The protocol also has an active bug bounty program.' },
      { q: 'What happens if the protocol is hacked?', a: 'ArrowRightvernance can halt the protocol in emergency situations. Funds in active sessions are protected by the staking mechanism. The protocol has a security reserve fund for covering losses from verified exploits.' },
      { q: 'How does slashing work?', a: 'On SLA breach detection, the SessionManager calculates the penalty based on breach severity and session value. The penalty is deducted from the provider\'s stake and credited to the affected client.' },
      { q: 'Can I freeze a malicious agent?', a: 'ArrowRightvernance can vote to freeze agents that violate protocol rules. Frozen agents cannot receive new sessions and may have their stake confiscated pending investigation.' },
      { q: 'Is there a bug bounty program?', a: 'Yes. The vassal.ai protocol has an active bug bounty program with rewards up to $100,000 for critical vulnerabilities. Visit the security page for program details and submission guidelines.' },
      { q: 'How do I report a security issue?', a: 'For critical vulnerabilities, email security@vassal.ai directly. For general issues, use the Globe security advisory or the MessageCircle security channel.' },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Documentation</p>
              {SIDEBAR_NAV.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? 'bg-violet-100 text-violet-900 font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Hero */}
            <section>
              <Badge variant="secondary" className="mb-4">FAQ</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Everything you need to know about the vassal.ai protocol.
              </p>
            </section>

            <Separator />

            {/* FAQ Sections */}
            {FAQ_SECTIONS.map((section) => (
              <section key={section.title} className="space-y-6">
                <h2 className="text-xl font-bold">{section.title}</h2>
                <Accordion>
                  {section.items.map((item, i) => (
                    <AccordionItem key={i} value={`${section.title}-${i}`}>
                      <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed pt-2">{item.a}</p>
                        {section.title === 'For Clients' && i === 3 && (
                          <Button variant="link" className="pl-0 mt-2 text-violet-600" asChild>
                            <Link href="/docs/sdk">View SDK Documentation →</Link>
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}

            <Separator />

            {/* Still have questions */}
            <section className="text-center space-y-4">
              <h2 className="text-xl font-bold">Still have questions?</h2>
              <p className="text-muted-foreground">Join our MessageCircle or open a Globe issue for more help.</p>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Button variant="outline" asChild>
                  <Link href="https://discord.gg/vassal">Join MessageCircle</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs/getting-started">Read the Docs</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}