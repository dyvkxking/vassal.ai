import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials' },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting', active: true },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const PROBLEM_CATEGORIES = [
  {
    title: 'Wallet Issues',
    emoji: '💳',
    problems: [
      {
        title: 'Wallet not connecting',
        solution: 'Ensure your wallet is unlocked and you are on the correct network (Somnia L1). Try refreshing the page and clicking connect again. If using WalletConnect, check that your mobile wallet app is open.',
      },
      {
        title: 'Signature request not appearing',
        solution: 'Check your wallet browser extension popup. Some extensions block popups by default — allow popups for vassal.ai. Also ensure you dont have another pending signature in your wallet.',
      },
      {
        title: 'Wrong network error',
        solution: 'vassal.ai runs on Somnia L1. ArrowRight to your wallet settings and add Somnia L1 as a custom network with chain ID 4242. RPC URL: https://rpc.somnia.network.',
      },
      {
        title: 'Transaction rejected',
        solution: 'Ensure you have sufficient $MESH balance. Check that you arent setting an extremely low gas price. If still failing, try increasing gas limit by 20% for the first transaction.',
      },
      {
        title: 'Seed phrase compromised warning',
        solution: 'vassal.ai never asks for your seed phrase. If you see this request, close the modal immediately and report the site. Always verify you are on app.vassal.ai.',
      },
    ],
  },
  {
    title: 'Session Failures',
    emoji: '🔌',
    problems: [
      {
        title: 'Session fails to open',
        solution: 'Check that the agent is online (green status indicator). Verify your budget covers the minimum session cost. Ensure the agent has capacity — some agents limit concurrent sessions.',
      },
      {
        title: 'Session closes immediately',
        solution: 'This usually means SLA parameters couldnt be met. The agent may be overloaded or your latency requirements are too strict. Try relaxing SLA requirements or selecting a different agent.',
      },
      {
        title: 'Billing incorrect',
        solution: 'Sessions are billed per second on Somnia L1. If you believe billing is incorrect, wait for session finalization (up to 2 minutes after close) then check your wallet transaction history.',
      },
      {
        title: 'Session timeout errors',
        solution: 'Network latency may be causing heartbeats to be delayed. Check your internet connection. For critical sessions, increase the heartbeat interval tolerance in your session parameters.',
      },
      {
        title: 'Agent not responding',
        solution: 'First verify the agent is online via the registry. If online, try closing and reopening the session. If the problem persists, the agent may be experiencing technical issues — try a different agent.',
      },
    ],
  },
  {
    title: 'Node Problems',
    emoji: '🖥️',
    problems: [
      {
        title: 'Node installation fails',
        solution: 'Ensure you have Node.js 18+ installed. On Monitor, run the installer as Administrator. On Terminal/macOS, check that you have write permissions to the installation directory.',
      },
      {
        title: 'Node not starting',
        solution: 'Check the daemon logs ( ~/.vassal/logs/daemon.log ). Common issues: port 8080 already in use, insufficient permissions, or missing config file. Run with --verbose for detailed logs.',
      },
      {
        title: 'Stake not showing as active',
        solution: 'After staking, wait up to 5 minutes for on-chain confirmation. Check your wallet for the stake transaction. If confirmed, try refreshing the dashboard. Contact support if still not showing after 10 minutes.',
      },
      {
        title: 'Agent not receiving sessions',
        solution: 'Verify your node is online in the provider dashboard. Check that your SLA parameters match client requests. High-quality agents with good scores get priority in the MatchingEngine.',
      },
      {
        title: 'SLA breach false positives',
        solution: 'Network congestion can trigger false breaches. Check your node logs for heartbeat success rates. If consistently above 95% but still receiving breaches, file a dispute via the governance portal.',
      },
    ],
  },
  {
    title: 'Payment Issues',
    emoji: '💰',
    problems: [
      {
        title: 'Cannot withdraw staking rewards',
        solution: 'Ensure the unbonding period (48 hours) has passed. Check that you dont have active sessions using your stake. If still issues, verify your node is healthy in the provider dashboard.',
      },
      {
        title: '$MESH balance not updating',
        solution: 'Wait for block confirmation (usually 5-10 seconds on Somnia). Refresh the page. If still not updated, check your transaction history on the Somnia block explorer.',
      },
      {
        title: 'Payment failed but funds deducted',
        solution: 'This is a known edge case during network congestion. Wait 5 minutes — if payment truly failed, funds will be refunded automatically. Check the settlement panel for status.',
      },
      {
        title: 'Cannot purchase $MESH',
        solution: 'Ensure you are using a supported wallet. The fiat on-ramp requires KYC in some jurisdictions. Try clearing browser cache or using a different payment method.',
      },
    ],
  },
  {
    title: 'ArrowRightvernance',
    emoji: '🏛️',
    problems: [
      {
        title: 'Cannot submit proposal',
        solution: 'Proposals require 1000 $MESH stake. Ensure your wallet is connected and has sufficient balance. Proposals also require a 500-word minimum description. Check the proposal guidelines.',
      },
      {
        title: 'Vote not registering',
        solution: 'Wait for block confirmation (up to 30 seconds). Ensure you have governance tokens (vMESH) in your wallet. Refresh the page and try again. Check that you are voting on an active proposal.',
      },
      {
        title: 'Proposal rejected but should have passed',
        solution: 'Review the voting thresholds in the governance docs. Proposals require a minimum quorum and majority to pass. Contact the governance committee via MessageCircle for procedural questions.',
      },
      {
        title: 'Delegation not working',
        solution: 'You can only delegate voting power if you hold vMESH. Ensure your $MESH is staked in governance, not just in provider/builder stakes. Delegation takes effect in the next epoch.',
      },
    ],
  },
]

export default function TroubleshootingPage() {
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
              <Badge variant="secondary" className="mb-4">Troubleshooting</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Problem Solutions</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Find solutions to common issues. Can't find your problem? Contact support below.
              </p>
            </section>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search problems..."
                    className="flex-1"
                  />
                  <Button variant="outline">Search</Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Problem Categories */}
            <div className="space-y-8">
              {PROBLEM_CATEGORIES.map((category) => (
                <section key={category.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <h2 className="text-xl font-bold">{category.title}</h2>
                  </div>
                  <Accordion className="w-full">
                    {category.problems.map((problem, i) => (
                      <AccordionItem key={i} value={`${category.title}-${i}`}>
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          <div className="flex items-center gap-2">
                            <span className="text-violet-500">→</span>
                            {problem.title}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6 pt-2 pb-4">
                            <p className="text-muted-foreground leading-relaxed">{problem.solution}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ))}
            </div>

            <Separator />

            {/* Contact Support */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Still need help?</h2>
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🎧</div>
                    <div>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>Get personalized help from our team</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Describe your issue and include any error messages or transaction hashes if applicable.
                    Our team typically responds within 24 hours.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild>
                      <Link href="https://discord.gg/vassal">Join MessageCircle Support</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="mailto:support@vassal.ai">Email Support</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="https://github.com/vassal-ai/vassal/issues">Open Globe Issue</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}