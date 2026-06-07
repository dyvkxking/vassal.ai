"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Sparkles, ArrowRight, Rocket, LayoutDashboard, Users, Bot, Vote, Zap, Coins, Star, User } from 'lucide-react'

type Role = 'provider' | 'builder' | 'client'

const ROLE_CONFIG = {
  provider: {
    title: 'Provider',
    description: 'You can now run AI agents and earn $MESH rewards',
    dashboardHref: '/dashboard',
    primaryAction: 'ArrowRight to Provider Dashboard',
    nextSteps: [
      { icon: Bot, label: 'Create Agent', description: 'Register your first AI agent', href: '/dashboard/new-agent' },
      { icon: Coins, label: 'Earn Rewards', description: 'Start earning from sessions', href: '/dashboard/earnings' },
      { icon: Vote, label: 'ArrowRightvernance', description: 'Participate in protocol decisions', href: '/governance' },
    ],
    badge: 'Genesis Provider',
    badgeClass: 'bg-violet-100 text-violet-700',
    genesis: true,
  },
  builder: {
    title: 'Builder',
    description: 'You can now create AI agents and manage sessions',
    dashboardHref: '/dashboard',
    primaryAction: 'ArrowRight to Builder Dashboard',
    nextSteps: [
      { icon: Bot, label: 'Create Agent', description: 'Build and deploy your first agent', href: '/dashboard/new-agent' },
      { icon: Users, label: 'Browse Agents', description: 'Explore the agent marketplace', href: '/agents' },
      { icon: Rocket, label: 'Launch Session', description: 'Start an interactive session', href: '/sessions/new' },
    ],
    badge: 'Builder',
    badgeClass: 'bg-blue-100 text-blue-700',
    genesis: false,
  },
  client: {
    title: 'Client',
    description: 'You can now browse agents and run sessions',
    dashboardHref: '/dashboard',
    primaryAction: 'ArrowRight to Client Dashboard',
    nextSteps: [
      { icon: Bot, label: 'Browse Agents', description: 'Find AI agents for your tasks', href: '/agents' },
      { icon: Rocket, label: 'Launch Session', description: 'Start your first session', href: '/sessions/new' },
      { icon: LayoutDashboard, label: 'Track Spending', description: 'Monitor your budget and usage', href: '/dashboard/spending' },
    ],
    badge: 'Client',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    genesis: false,
  },
}

const GENESIS_BONUS = {
  provider: {
    title: 'Genesis 2x Rewards',
    description: 'You earn double rewards on all completed tasks for the first 30 days.',
    amount: '2x',
    badge: 'Active',
  },
  builder: {
    title: 'Genesis Bonus',
    description: 'You receive a bonus when creating your first agent.',
    amount: '100 $MESH',
    badge: 'Claimed',
  },
  client: {
    title: 'Welcome Bonus',
    description: 'You receive free credits for your first sessions.',
    amount: '50 $MESH',
    badge: 'Claimed',
  },
}

export default function OnboardingCompletePage() {
  const [selectedRole, setSelectedRole] = useState<Role>('provider')

  const role = ROLE_CONFIG[selectedRole]
  const genesis = GENESIS_BONUS[selectedRole]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Success Animation */}
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <Badge variant="secondary" className={`mb-4 ${role.badgeClass}`}>
              <Sparkles className="mr-1 h-3 w-3" />
              {role.badge}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">You&apos;re all set!</h1>
            <p className="text-lg text-muted-foreground">{role.description}</p>
          </div>

          {/* Role Selector (for demo purposes) */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Select Your Role</CardTitle>
              <CardDescription>Choose a role to see its specific onboarding completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {(['provider', 'builder', 'client'] as Role[]).map((r) => (
                  <Button
                    key={r}
                    variant={selectedRole === r ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRole(r)}
                  >
                    {ROLE_CONFIG[r].title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Role-Specific Next Steps */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-center">What you can do next</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {role.nextSteps.map((step, idx) => (
                <Link key={idx} href={step.href}>
                  <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <step.icon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-medium text-sm mb-1">{step.label}</h3>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Genesis/Welcome Bonus */}
          {genesis && (
            <div className="mb-8">
              <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 dark:border-violet-900 dark:from-violet-950/50 dark:to-purple-950/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                      <Zap className="h-6 w-6 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{genesis.title}</h3>
                        <Badge variant="secondary" className="text-xs">{genesis.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{genesis.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-violet-600">{genesis.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Setup Summary for selected role */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Your Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedRole === 'provider' && (
                  <>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-violet-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <p className="font-medium text-sm">0x7a3...f9c2</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-emerald-600">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stake</p>
                        <p className="font-medium text-sm">500 $MESH</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-amber-600">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tier</p>
                        <p className="font-medium text-sm">Genesis Provider</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-blue-600">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Agents</p>
                        <p className="font-medium text-sm">1 created</p>
                      </div>
                    </div>
                  </>
                )}
                {selectedRole === 'builder' && (
                  <>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-violet-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <p className="font-medium text-sm">0x8b2...d4e1</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-emerald-600">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stake</p>
                        <p className="font-medium text-sm">250 $MESH</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-blue-600">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Agents</p>
                        <p className="font-medium text-sm">2 created</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-purple-600">
                        <Rocket className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                        <p className="font-medium text-sm">12 completed</p>
                      </div>
                    </div>
                  </>
                )}
                {selectedRole === 'client' && (
                  <>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-violet-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <p className="font-medium text-sm">0x9c3...a7f5</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-emerald-600">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium text-sm">$500/month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-purple-600">
                        <Rocket className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                        <p className="font-medium text-sm">8 completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-amber-600">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Credits</p>
                        <p className="font-medium text-sm">50 $MESH</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Primary CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="w-full max-w-md" asChild>
              <Link href={role.dashboardHref}>
                {role.primaryAction}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Your role: <span className="font-medium capitalize">{selectedRole}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Need help?{' '}
              <Link href="/docs/getting-started" className="underline-offset-4 hover:underline">
                Read the documentation
              </Link>
              {' '}or{' '}
              <Link href="/contact" className="underline-offset-4 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}