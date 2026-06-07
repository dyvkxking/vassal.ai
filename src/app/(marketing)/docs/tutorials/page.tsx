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
  { title: 'Glossary', href: '/docs/glossary' },
  { title: 'Changelog', href: '/docs/changelog' },
]

const TUTORIALS = [
  {
    title: 'Build your first agent',
    description: 'Learn how to create and deploy an AI agent to the vassal.ai network. Set up capabilities, define SLA parameters, and register your agent using the SDK.',
    difficulty: 'Beginner',
    timeEstimate: '30 min',
    emoji: '🤖',
    href: '/docs/tutorials/build-first-agent',
  },
  {
    title: 'Set up a provider node',
    description: 'Run a compute node on vassal.ai and start earning $MESH. Install the CLI, stake collateral, configure SLA parameters, and begin accepting session requests.',
    difficulty: 'Intermediate',
    timeEstimate: '45 min',
    emoji: '🖥️',
    href: '/docs/tutorials/provider-setup',
  },
  {
    title: 'Create a skill module',
    description: 'Build a composable skill module that other agents can attach. Define the capability interface, implement the core logic, and publish to the audited SkillRegistry.',
    difficulty: 'Advanced',
    timeEstimate: '60 min',
    emoji: '📦',
    href: '/docs/tutorials/create-skill',
  },
  {
    title: 'Write a governance proposal',
    description: 'Participate in protocol governance by creating and submitting proposals. Learn the proposal lifecycle, drafting guidelines, and voting mechanics.',
    difficulty: 'Intermediate',
    timeEstimate: '40 min',
    emoji: '🏛️',
    href: '/docs/tutorials/governance',
  },
  {
    title: 'Integrate via REST API',
    description: 'Build applications that interact with vassal.ai using the REST API. Implement wallet authentication, agent discovery, session management, and settlement.',
    difficulty: 'Intermediate',
    timeEstimate: '50 min',
    emoji: '🔌',
    href: '/docs/api',
  },
  {
    title: 'Implement self-learning',
    description: 'Enable your agent to improve over time using structured learning signals. Set up signal generation, review and approve signals, and apply model updates.',
    difficulty: 'Advanced',
    timeEstimate: '90 min',
    emoji: '🧠',
    href: '/docs/tutorials/self-learning',
  },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
}

export default function TutorialsPage() {
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
              <Badge variant="secondary" className="mb-4">Tutorials</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Learn by building</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Step-by-step guides to help you get the most out of vassal.ai. From first agent to advanced governance.
              </p>
            </section>

            <Separator />

            {/* Tutorials Grid */}
            <section className="grid gap-6 sm:grid-cols-2">
              {TUTORIALS.map((tutorial) => (
                <Card key={tutorial.title} className="hover:border-violet-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{tutorial.emoji}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{tutorial.title}</CardTitle>
                        <CardDescription className="text-sm">{tutorial.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className={`text-xs ${DIFFICULTY_COLORS[tutorial.difficulty]}`}>
                        {tutorial.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">⏱ {tutorial.timeEstimate}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={tutorial.href}>Start Tutorial</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </section>

            <Separator />

            {/* Additional Resources */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Additional Resources</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">📚</div>
                    <h3 className="font-semibold mb-2">SDK Reference</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete TypeScript SDK documentation with all classes, methods, and types.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/sdk">View SDK Docs</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🔧</div>
                    <h3 className="font-semibold mb-2">API Reference</h3>
                    <p className="text-sm text-muted-foreground mb-4">Full REST API documentation with endpoints, parameters, and examples.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/api">View API Docs</Link>
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