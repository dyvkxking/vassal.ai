import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_NAV = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'SDK Docs', href: '/docs/sdk' },
  { title: 'Tutorials', href: '/docs/tutorials', active: true },
  { title: 'FAQ', href: '/docs/faq' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting' },
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const PROPOSAL_TEMPLATE = `# Title: [Short descriptive title]

## Summary
One paragraph summary of the proposal and why it matters.

## Motivation
Why is this change needed? What problem does it solve?

## Specification
Technical specification of the proposed change. Include:
- Data structures
- State transitions
- New features
- Edge cases

## Implementation Plan
How will this be implemented? Timeline and milestones.

## Vote Metadata
- **Type**: Protocol upgrade | Parameter change | Treasury | Other
- **Quorum required**: X% of circulating vMESH
- **Vote duration**: 7 days
- **Minimum stake**: 1,000 $MESH

## Risks and Mitigations
What could go wrong and how do we mitigate it?

## Success Metrics
How do we measure if this proposal succeeded?`

const SUBMISSION_CHECKLIST = [
  'Proposal title is clear and concise (under 80 characters)',
  'Summary explains the "what" and "why" in one paragraph',
  'Motivation section explains the problem being solved',
  'Specification is detailed enough for implementers',
  'Implementation plan has clear milestones and timeline',
  'Risks are identified with mitigation strategies',
  'Legal text reviewed if proposal involves treasury funds',
  'Grammar and formatting checked',
  'Community discussion occurred before submission',
]

const DISCUSSION_TIPS = [
  { tip: 'Post in #governance-discussion first', desc: 'Gauge interest and get feedback before formal submission' },
  { tip: 'Use the proposal template', desc: 'Makes your proposal easier to review and compare' },
  { tip: 'Respond to all questions within 48 hours', desc: 'Active engagement builds trust and improves approval odds' },
  { tip: 'Link to relevant research or data', desc: 'Proposals with evidence supporting claims get more support' },
  { tip: 'Acknowledge counterarguments', desc: 'Shows you understand tradeoffs and builds credibility' },
]

const LIFECYCLE_STEPS = [
  { phase: 'Discussion', duration: '5-7 days', desc: 'Community reviews and debates the proposal' },
  { phase: 'Submission', duration: 'On-chain', desc: 'Submit with 1,000 $MESH stake' },
  { phase: 'Voting', duration: '7 days', desc: 'Token holders vote with vMESH' },
  { phase: 'Execution', duration: '1-3 days', desc: 'Approved proposals are implemented' },
  { phase: 'Review', duration: 'Ongoing', desc: 'Community monitors results' },
]

export default function ArrowRightvernanceProposalPage() {
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
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Tutorial</Badge>
                <Badge variant="outline" className="text-violet-600">40 min</Badge>
                <Badge variant="outline">Intermediate</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Write a governance proposal</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Participate in protocol governance by creating and submitting proposals that shape the future of vassal.ai.
              </p>
            </section>

            <Separator />

            {/* What makes a good proposal */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">What makes a good proposal?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">✅</div>
                    <h3 className="font-semibold mb-2">Clear problem statement</h3>
                    <p className="text-sm text-muted-foreground">
                      Explain the problem you're solving and why it matters to the protocol and its users.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">📐</div>
                    <h3 className="font-semibold mb-2">Specific scope</h3>
                    <p className="text-sm text-muted-foreground">
                      Proposals that do one thing well are more likely to pass than vague, sweeping changes.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">🔬</div>
                    <h3 className="font-semibold mb-2">Evidence-based</h3>
                    <p className="text-sm text-muted-foreground">
                      Support claims with data, research, or successful examples from other protocols.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">⚖️</div>
                    <h3 className="font-semibold mb-2">Balanced tradeoffs</h3>
                    <p className="text-sm text-muted-foreground">
                      Acknowledge costs and risks. Show you've considered alternatives.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Template Structure */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Template structure</h2>
              <p className="text-muted-foreground leading-relaxed">
                Use this template to structure your proposal. The governance portal provides this template when you start a new proposal.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{PROPOSAL_TEMPLATE}</code>
              </pre>
            </section>

            <Separator />

            {/* Community Discussion */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Community discussion tips</h2>
              <p className="text-muted-foreground leading-relaxed">
                Before submitting, discuss your proposal in the MessageCircle governance channel.
                Early feedback improves proposals and builds support.
              </p>
              <div className="space-y-3">
                {DISCUSSION_TIPS.map((item) => (
                  <Card key={item.tip}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">💡</div>
                        <div>
                          <h3 className="font-semibold text-sm">{item.tip}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            {/* Proposal Lifecycle */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Proposal lifecycle</h2>
              <div className="space-y-4">
                {LIFECYCLE_STEPS.map((step, i) => (
                  <div key={step.phase} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{step.phase}</span>
                        <span className="text-xs text-muted-foreground">• {step.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Submission Checklist */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Submission checklist</h2>
              <p className="text-muted-foreground leading-relaxed">
                Before submitting your proposal on-chain, verify:
              </p>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {SUBMISSION_CHECKLIST.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-5 h-5 rounded border border-violet-200 text-violet-600 text-xs">
                          ✓
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="text-lg">💰</div>
                <div>
                  <p className="text-sm font-medium">Stake required</p>
                  <p className="text-xs text-muted-foreground">
                    Submitting a proposal requires 1,000 $MESH staked.
                    This is refunded if the proposal passes or if it's withdrawn during discussion.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Next Steps */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Next steps</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🤖</div>
                    <h3 className="font-semibold mb-2">Build your first agent</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Put your governance tokens to work by building an agent that serves the community.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/build-first-agent">Build agent →</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🏛️</div>
                    <h3 className="font-semibold mb-2">View governance portal</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore active proposals and learn from existing governance discussions.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/governance">Open ArrowRightvernance →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}