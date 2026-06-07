'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, CheckCircle2, Circle, Wallet, Shield, Cpu, Zap, Star } from 'lucide-react'

// Mock onboarding status - in production this would come from an API/context
const ONBOARDING_STEPS = [
  { number: 1, label: 'Connect Wallet', icon: Wallet, status: 'completed' },
  { number: 2, label: 'Stake Setup', icon: Shield, status: 'completed' },
  { number: 3, label: 'CLI Install', icon: Cpu, status: 'current' },
  { number: 4, label: 'First Session', icon: Zap, status: 'pending' },
  { number: 5, label: 'Create Agent', icon: Star, status: 'pending' },
]

const PROVIDER_STATS = {
  totalEarnings: 2847.52,
  activeSessions: 12,
  nodesOnline: 3,
  totalStake: 15000,
  lockedStake: 8500,
  avgUptime: 99.4,
}

export default function ProviderLandingPage() {
  const router = useRouter()
  const isNewProvider = false // This would be determined by checking user's onboarding status

  // If new provider, show onboarding prompt
  if (isNewProvider) {
    return <ProviderOnboardingPrompt />
  }

  // Otherwise redirect to dashboard after a brief moment
  // For now, we'll show the dashboard view with redirect prompt
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Redirect Banner */}
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowRight className="h-5 w-5 text-primary" />
          <span className="font-medium">Welcome back, Provider!</span>
        </div>
        <Button onClick={() => router.push('/provider/dashboard')}>
          ArrowRight to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Provider Overview */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your node performance and manage your compute resources.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`$${PROVIDER_STATS.totalEarnings.toFixed(2)}`}
          subValue="lifetime earnings"
        />
        <StatCard
          title="Active Sessions"
          value={PROVIDER_STATS.activeSessions.toString()}
          subValue="currently running"
        />
        <StatCard
          title="Stake Locked"
          value={`${PROVIDER_STATS.lockedStake.toLocaleString()} $MESH`}
          subValue={`of ${PROVIDER_STATS.totalStake.toLocaleString()} total`}
        />
        <StatCard
          title="Node Uptime"
          value={`${PROVIDER_STATS.avgUptime}%`}
          subValue="30-day average"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Nodes</CardTitle>
              <CardDescription>Manage your compute nodes and monitor health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Node {i}</p>
                        <p className="text-sm text-muted-foreground">
                          {i === 1 ? 'GPU-NV-A100-80GB' : i === 2 ? 'GPU-NV-A100-40GB' : 'GPU-NV-RTX4090'}
                          {' • '}US-East
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium">Online</span>
                        </div>
                        <p className="text-xs text-muted-foreground">99.8% uptime</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/node">Manage</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Genesis Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                Genesis Participant
              </Badge>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bonus Multiplier</span>
                  <span className="font-medium">2x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rewards End Date</span>
                  <span className="font-medium">Dec 31, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/stake">
                  <Shield className="mr-2 h-4 w-4" />
                  Lock More Stake
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/provider-earnings">
                  <Zap className="mr-2 h-4 w-4" />
                  Withdraw Earnings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/sessions">
                  <Zap className="mr-2 h-4 w-4" />
                  View Sessions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subValue,
}: {
  title: string
  value: string
  subValue?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-3xl font-bold">{value}</div>
        {subValue && <div className="mt-1 text-xs text-muted-foreground">{subValue}</div>}
      </CardContent>
    </Card>
  )
}

function ProviderOnboardingPrompt() {
  const completedSteps = ONBOARDING_STEPS.filter(s => s.status === 'completed').length
  const progress = (completedSteps / ONBOARDING_STEPS.length) * 100

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-4">Provider Onboarding</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to vassal.ai
        </h1>
        <p className="text-lg text-muted-foreground">
          Start earning by providing compute resources for AI agents on Somnia L1.
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Your Progress</CardTitle>
          <CardDescription>
            Complete these steps to become an active provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps} of {ONBOARDING_STEPS.length} steps completed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {ONBOARDING_STEPS.map((step, index) => {
          const Icon = step.icon
          const isCompleted = step.status === 'completed'
          const isCurrent = step.status === 'current'

          return (
            <div key={step.number} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? 'border-primary bg-primary/20 text-primary'
                    : isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 text-muted-foreground/30'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
              {isCompleted && (
                <Badge variant="secondary" className="text-xs">Completed</Badge>
              )}
              {isCurrent && (
                <Button size="sm" asChild>
                  <Link href={`/onboarding/provider/${step.label.toLowerCase().replace(' ', '-')}`}>
                    Continue
                  </Link>
                </Button>
              )}
              {!isCompleted && !isCurrent && (
                <Badge variant="outline" className="text-xs">Locked</Badge>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button size="lg" asChild>
          <Link href="/provider-home">
            ArrowRight to Provider Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}