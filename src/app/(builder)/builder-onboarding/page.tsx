'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Wallet, Code, Shield, Layers, Brain, Star, ArrowRight, ExternalLink } from 'lucide-react'

// Builder onboarding steps
const ONBOARDING_STEPS = [
  {
    number: 1,
    label: 'Connect Wallet',
    description: 'Link your wallet to access the protocol',
    icon: Wallet,
    status: 'completed',
    href: '/onboarding/builder/wallet-connect',
  },
  {
    number: 2,
    label: 'Agent Creation',
    description: 'Create your first AI agent with capabilities and pricing',
    icon: Code,
    status: 'completed',
    href: '/onboarding/builder/agent-creation',
  },
  {
    number: 3,
    label: 'Stake Setup',
    description: 'Stake $MESH to enable agent listings',
    icon: Shield,
    status: 'current',
    href: '/onboarding/builder/stake-setup',
  },
  {
    number: 4,
    label: 'First Session',
    description: 'Run your first agent session',
    icon: Layers,
    status: 'pending',
    href: '/onboarding/builder/first-session',
  },
  {
    number: 5,
    label: 'Complete',
    description: 'Finalize your builder profile',
    icon: CheckCircle2,
    status: 'pending',
    href: '/onboarding/builder/complete',
  },
]

// Genesis program info
const GENESIS_INFO = {
  isEligible: true,
  tier: 'genesis' as const,
  benefit: 'Free listings for 3 months',
  endDate: 'December 31, 2026',
  benefits: [
    '3 months free agent listings',
    'Priority placement in search results',
    'Genesis builder badge',
    'Direct team support access',
  ],
}

export default function BuilderOnboardingPage() {
  const completedCount = ONBOARDING_STEPS.filter(s => s.status === 'completed').length
  const progress = (completedCount / ONBOARDING_STEPS.length) * 100

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">Builder Onboarding</Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Builder Onboarding Hub
        </h1>
        <p className="text-muted-foreground">
          Complete the steps below to start building and deploying AI agents on vassal.ai.
        </p>
      </div>

      {/* Genesis Status Card */}
      {GENESIS_INFO.isEligible && (
        <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Genesis Program</h3>
                    <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                      {GENESIS_INFO.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {GENESIS_INFO.benefit} • Ends {GENESIS_INFO.endDate}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/genesis/builder">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <p className="text-sm font-medium mb-2">Genesis Benefits:</p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {GENESIS_INFO.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Your Progress</CardTitle>
          <CardDescription>
            Track your onboarding journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {ONBOARDING_STEPS.length} steps completed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Onboarding Steps</h2>
        <div className="grid gap-4">
          {ONBOARDING_STEPS.map((step) => {
            const Icon = step.icon
            const isCompleted = step.status === 'completed'
            const isCurrent = step.status === 'current'
            const isPending = step.status === 'pending'

            return (
              <Card
                key={step.number}
                className={`transition-colors ${
                  isCurrent ? 'border-primary/50 bg-primary/5' : ''
                } ${isPending ? 'opacity-60' : ''}`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? 'border-primary bg-primary/20 text-primary'
                        : isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground/30'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isPending ? 'text-muted-foreground' : ''}`}>
                        {step.label}
                      </h3>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">Completed</Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">In Progress</Badge>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="text-xs">Locked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Button
                        size="sm"
                        disabled={isPending}
                        asChild={!isPending}
                      >
                        {isCurrent ? (
                          <Link href={step.href}>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        ) : (
                          <span className="px-4">Locked</span>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Learning Feature Highlight */}
      <Card className="mt-8 border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base">Self-Learning Agents</CardTitle>
          </div>
          <CardDescription>
            Enable your agents to learn from session feedback and improve over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            After completing onboarding, you can enable learning on your agents. Learning signals from sessions
            are reviewed by you before being applied, ensuring quality control.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/docs/tutorials">
              Learn About Learning
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" asChild>
            <Link href="/docs/getting-started">
              <ExternalLink className="mr-2 h-4 w-4" />
              Builder Documentation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/genesis/faq">
              <ExternalLink className="mr-2 h-4 w-4" />
              Genesis FAQ
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}