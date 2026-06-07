"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress, ProgressIndicator } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Circle, Wallet, Coins, Terminal, User, Sparkles, ArrowRight, Settings, LayoutDashboard, FileText, Star } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    number: 1,
    label: 'Connect Wallet',
    description: 'Connect your wallet to authenticate',
    icon: Wallet,
    href: '/onboarding/builder/wallet-connect',
    status: 'completed',
    completedAt: '2024-06-01',
  },
  {
    number: 2,
    label: 'Role Selection',
    description: 'Choose builder role and set up preferences',
    icon: User,
    href: '/onboarding/builder/role-selection',
    status: 'completed',
    completedAt: '2024-06-01',
  },
  {
    number: 3,
    label: 'Stake Setup',
    description: 'Stake $MESH tokens as collateral',
    icon: Coins,
    href: '/onboarding/builder/stake-setup',
    status: 'completed',
    completedAt: '2024-06-02',
  },
  {
    number: 4,
    label: 'Agent Creation',
    description: 'Create your first AI agent',
    icon: Terminal,
    href: '/onboarding/builder/agent-creation',
    status: 'completed',
    completedAt: '2024-06-03',
  },
  {
    number: 5,
    label: 'First Session',
    description: 'Run your first builder session',
    icon: Settings,
    href: '/onboarding/builder/first-session',
    status: 'completed',
    completedAt: '2024-06-04',
  },
]

const SETUP_SUMMARY = [
  { label: 'Wallet', value: '0x8b2...d4e1', icon: Wallet, color: 'text-violet-600' },
  { label: 'Role', value: 'Builder', icon: User, color: 'text-blue-600' },
  { label: 'Stake Amount', value: '250 $MESH', icon: Coins, color: 'text-emerald-600' },
  { label: 'Agents Created', value: '2', icon: Terminal, color: 'text-amber-600' },
  { label: 'Sessions Completed', value: '12', icon: Settings, color: 'text-purple-600' },
]

const QUICK_ACTIONS = [
  { title: 'Builder Dashboard', description: 'Monitor your agents and sessions', icon: LayoutDashboard, href: '/dashboard', badge: null },
  { title: 'Create Agent', description: 'Create a new AI agent', icon: Terminal, href: '/dashboard/new-agent', badge: 'New' },
  { title: 'View Documentation', description: 'API docs and tutorials', icon: FileText, href: '/docs', badge: null },
]

export default function BuilderOnboardingHub() {
  const completedSteps = ONBOARDING_STEPS.filter(step => step.status === 'completed').length
  const progressPercent = (completedSteps / ONBOARDING_STEPS.length) * 100

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
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
              Builder
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Builder Onboarding Hub</h1>
            <p className="text-lg text-muted-foreground">
              Your builder profile is configured and ready to create agents
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Onboarding Progress</CardTitle>
                <span className="text-sm text-muted-foreground">{completedSteps} of {ONBOARDING_STEPS.length} steps completed</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercent} className="mb-6">
                <ProgressIndicator />
              </Progress>
              <div className="flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-muted-foreground">All steps completed</span>
              </div>
            </CardContent>
          </Card>

          {/* Step Progress Tracker */}
          <div className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">Onboarding Steps</h2>
            <div className="grid gap-4">
              {ONBOARDING_STEPS.map((step, index) => (
                <div key={step.number}>
                  <Card className={step.status === 'completed' ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          step.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <step.icon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{step.label}</span>
                            {step.status === 'completed' && (
                              <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">Completed</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.completedAt && (
                            <p className="text-xs text-muted-foreground mt-1">Completed {step.completedAt}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Button size="sm" asChild>
                              <Link href={step.href}>Resume</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div className="ml-5 h-4 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Setup Summary */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Setup Summary</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SETUP_SUMMARY.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {QUICK_ACTIONS.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <action.icon className="h-8 w-8 text-primary mb-3" />
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{action.title}</h3>
                          {action.badge && (
                            <Badge variant="outline" className="text-xs">{action.badge}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="w-full max-w-md" asChild>
              <Link href="/dashboard">
                ArrowRight to Builder Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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