"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Cpu, Wrench, User, Zap } from 'lucide-react'

const ROLES = [
  {
    id: 'provider',
    icon: Cpu,
    title: 'Compute Provider',
    description: 'Earn from your GPU by hosting agents and processing tasks.',
    color: 'text-violet-600',
    badge: 'Earn GPU rewards',
    default: true,
  },
  {
    id: 'builder',
    icon: Wrench,
    title: 'Builder / Agent Creator',
    description: 'Create and deploy AI agents to serve clients worldwide.',
    color: 'text-amber-600',
    badge: 'Build agents',
    default: false,
  },
  {
    id: 'client',
    icon: User,
    title: 'Client',
    description: 'Rent specialized agents to automate your workflows.',
    color: 'text-emerald-600',
    badge: 'Rent agents',
    default: false,
  },
  {
    id: 'all',
    icon: Zap,
    title: 'All of the above',
    description: 'Full access to rent, build, and host agents on the platform.',
    color: 'text-blue-600',
    badge: 'Complete access',
    default: false,
  },
]

const STEPS = [
  { number: 1, label: 'Connect Wallet', icon: CheckCircle2, done: true },
  { number: 2, label: 'Choose Role', icon: CheckCircle2, active: true },
  { number: 3, label: 'Stake Setup', icon: CheckCircle2, active: false },
  { number: 4, label: 'CLI Install', icon: CheckCircle2, active: false },
]

export default function ProviderRoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('provider')

  const handleContinue = () => {
    router.push('/provider/stake-setup')
  }

  return (
    <div className="flex min-h-screen flex-col">
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

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.done
                          ? 'border-primary bg-primary text-primary-foreground'
                          : step.active
                            ? 'border-primary bg-background text-primary'
                            : 'border-muted-foreground/30 text-muted-foreground/30'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.done || step.active ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && <div className="mx-4 h-px w-12 bg-muted-foreground/20" />}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Choose Your Role</h1>
            <p className="text-lg text-muted-foreground">
              Select how you want to participate in the vassal.ai ecosystem
            </p>
          </div>

          <div className="mb-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {ROLES.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20 ${
                    selectedRole === role.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${role.color}`}>
                          <role.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{role.title}</CardTitle>
                      </div>
                      {selectedRole === role.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{role.description}</CardDescription>
                    <Badge variant={selectedRole === role.id ? 'default' : 'secondary'}>{role.badge}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button size="lg" onClick={handleContinue} className="w-full max-w-xs">
              Continue as {ROLES.find((r) => r.id === selectedRole)?.title}
            </Button>
            <p className="text-xs text-muted-foreground">You can change your role at any time in settings</p>
          </div>
        </div>
      </main>
    </div>
  )
}
