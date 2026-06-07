'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowRight, CheckCircle2, Circle, Wallet, Code, Layers, BarChart3, Brain, Star } from 'lucide-react'
import { MOCK_AGENTS } from '@/lib/mock-data'

// Mock onboarding status
const ONBOARDING_STEPS = [
  { number: 1, label: 'Connect Wallet', icon: Wallet, status: 'completed' },
  { number: 2, label: 'Agent Creation', icon: Code, status: 'completed' },
  { number: 3, label: 'Stake Setup', icon: Star, status: 'current' },
  { number: 4, label: 'First Session', icon: Layers, status: 'pending' },
]

const BUILDER_STATS = {
  totalAgents: 6,
  activeAgents: 5,
  totalRevenue: 2847.52,
  avgQualityScore: 93,
  totalSessions: 48293,
}

export default function BuilderLandingPage() {
  const router = useRouter()
  const isNewBuilder = false // This would be determined by checking user's onboarding status

  // If new builder, show onboarding prompt
  if (isNewBuilder) {
    return <BuilderOnboardingPrompt />
  }

  // Otherwise show dashboard
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Redirect Banner */}
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowRight className="h-5 w-5 text-primary" />
          <span className="font-medium">Welcome back, Builder!</span>
        </div>
        <Button onClick={() => router.push('/builder/home')}>
          ArrowRight to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Builder Overview */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Builder Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your AI agents and monitor their performance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${BUILDER_STATS.totalRevenue.toFixed(2)}`}
          subValue="lifetime earnings"
        />
        <StatCard
          title="Active Agents"
          value={BUILDER_STATS.activeAgents.toString()}
          subValue={`of ${BUILDER_STATS.totalAgents} total`}
        />
        <StatCard
          title="Avg Quality Score"
          value={BUILDER_STATS.avgQualityScore.toString()}
          subValue="across all agents"
        />
        <StatCard
          title="Total Sessions"
          value={BUILDER_STATS.totalSessions.toLocaleString()}
          subValue="lifetime"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Top Agents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Top Performing Agents</CardTitle>
                  <CardDescription>Your agents ranked by quality score</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/my-agents">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...MOCK_AGENTS]
                  .sort((a, b) => b.qualityScore - a.qualityScore)
                  .slice(0, 4)
                  .map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarFallback className="bg-violet-100 text-violet-700 text-lg">
                            {agent.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={agent.qualityScore >= 90 ? 'default' : 'secondary'}
                          className={agent.qualityScore >= 90 ? 'bg-green-600' : ''}
                        >
                          Q: {agent.qualityScore}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {agent.totalSessions.toLocaleString()} sessions
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/builder/edit-agent/${agent.id}`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Genesis Status */}
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
                  <span className="text-muted-foreground">Free Listings</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ends</span>
                  <span className="font-medium">Dec 31, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/create-agent">
                  <Layers className="mr-2 h-4 w-4" />
                  Create New Agent
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/builder-analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/learning-logs">
                  <Brain className="mr-2 h-4 w-4" />
                  Review Learning Logs
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Learning Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">learning signals</p>
                </div>
                <Button size="sm" asChild>
                  <Link href="/learning-logs">Review</Link>
                </Button>
              </div>
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

function BuilderOnboardingPrompt() {
  const completedSteps = ONBOARDING_STEPS.filter(s => s.status === 'completed').length
  const progress = (completedSteps / ONBOARDING_STEPS.length) * 100

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-4">Builder Onboarding</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to vassal.ai
        </h1>
        <p className="text-lg text-muted-foreground">
          Build and deploy AI agents that earn revenue on Somnia L1.
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Your Progress</CardTitle>
          <CardDescription>
            Complete these steps to become an active builder
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
                  <Link href={`/onboarding/builder/${step.label.toLowerCase().replace(' ', '-')}`}>
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
          <Link href="/builder-home">
            ArrowRight to Builder Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}