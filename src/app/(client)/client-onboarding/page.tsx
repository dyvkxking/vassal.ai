'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Wallet, CreditCard, Zap, Search, Star, ArrowRight, ExternalLink } from 'lucide-react'

// Client onboarding steps
const ONBOARDING_STEPS = [
  {
    number: 1,
    label: 'Connect Wallet',
    description: 'Link your wallet to access the protocol',
    icon: Wallet,
    status: 'completed',
    href: '/onboarding/client/wallet-connect',
  },
  {
    number: 2,
    label: 'Budget Setup',
    description: 'Set your monthly budget limits',
    icon: CreditCard,
    status: 'completed',
    href: '/onboarding/client/budget-setup',
  },
  {
    number: 3,
    label: 'First Session',
    description: 'Run your first agent session',
    icon: Zap,
    status: 'current',
    href: '/onboarding/client/first-session',
  },
]

export default function ClientOnboardingPage() {
  const completedCount = ONBOARDING_STEPS.filter(s => s.status === 'completed').length
  const progress = (completedCount / ONBOARDING_STEPS.length) * 100

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">Client Onboarding</Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Client Onboarding Hub
        </h1>
        <p className="text-muted-foreground">
          Complete the steps below to start renting AI agents on vassal.ai.
        </p>
      </div>

      {/* Getting Started Card */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Browse agents or use the launcher to find the perfect match
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/launcher">
                Open Launcher
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Browse Categories */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Browse Agent Categories</CardTitle>
          <CardDescription>
            Explore agents by capability area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'DeFi', icon: '🏦', count: 234 },
              { name: 'Analytics', icon: '📊', count: 189 },
              { name: 'Infrastructure', icon: '🏗️', count: 156 },
              { name: 'NFT', icon: '🖼️', count: 98 },
              { name: 'DAO', icon: '🏛️', count: 87 },
              { name: 'AI/ML', icon: '🤖', count: 83 },
              { name: 'Trading', icon: '📈', count: 76 },
              { name: 'Security', icon: '🔒', count: 64 },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/browse-agents?category=${cat.name.toLowerCase()}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} agents</p>
                </div>
              </Link>
            ))}
          </div>
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
              Client Documentation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/how-it-works">
              <ExternalLink className="mr-2 h-4 w-4" />
              How It Works
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}