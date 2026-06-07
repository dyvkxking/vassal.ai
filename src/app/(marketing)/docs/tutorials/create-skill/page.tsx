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

const SKILL_INTERFACE = `import { SkillModule, SkillContext } from '@vassal-ai/sdk'

export interface CodeAnalysisSkill {
  name: 'code-analysis'
  version: '1.0.0'
  capabilities: ['detect-bugs', 'performance-analysis', 'security-scan']
  inputSchema: {
    code: string
    language: 'typescript' | 'python' | 'rust' | 'go'
    options?: {
      deepAnalysis?: boolean
      includePerformance?: boolean
    }
  }
  outputSchema: {
    findings: Array<{
      type: 'bug' | 'performance' | 'security'
      severity: 'low' | 'medium' | 'high' | 'critical'
      line: number
      description: string
      suggestion?: string
    }>
    metrics: {
      complexity: number
      maintainability: number
      estimatedBugs: number
    }
  }
}`

const SKILL_IMPLEMENTATION = `import { SkillModule } from '@vassal-ai/sdk'
import { CodeAnalysisSkill } from './types'

export const codeAnalysisSkill: CodeAnalysisSkill = {
  name: 'code-analysis',
  version: '1.0.0',
  capabilities: ['detect-bugs', 'performance-analysis', 'security-scan'],

  async execute(context: SkillContext, input: CodeAnalysisSkill['inputSchema']) {
    const findings = []

    // Static analysis for bugs
    const bugPatterns = detectBugPatterns(input.code, input.language)
    findings.push(...bugPatterns.map(p => ({
      type: 'bug' as const,
      severity: p.severity,
      line: p.line,
      description: p.description,
      suggestion: p.suggestion,
    })))

    // Performance analysis
    if (input.options?.includePerformance !== false) {
      const perfIssues = analyzePerformance(input.code, input.language)
      findings.push(...perfIssues)
    }

    // Security scan
    const securityIssues = securityScan(input.code)
    findings.push(...securityIssues)

    return {
      findings,
      metrics: calculateMetrics(input.code),
    }
  },
}

export default codeAnalysisSkill`

const DOCUMENTATION = `# Code Analysis Skill

A composable skill module for static code analysis with bug detection, performance profiling, and security scanning.

## Capabilities

- **Bug Detection**: Identify common bugs, logic errors, and potential runtime exceptions
- **Performance Analysis**: Detect inefficient patterns, memory issues, and optimization opportunities
- **Security Scanning**: Find vulnerabilities like injection risks, weak cryptography, insecure patterns

## Usage

\`\`\`typescript
import { VassalSDK } from '@vassal-ai/sdk'

const vassal = new VassalSDK({ wallet })

const session = await vassal.sessions.open({
  agentId: 'agent-123',
  skills: ['code-analysis@1.0.0'],
})

const result = await session.runSkill('code-analysis', {
  code: \`
    function add(a, b) {
      return a + b
    }
    const result = add("1", 2)
  \`,
  language: 'typescript',
  options: {
    deepAnalysis: true,
    includePerformance: true,
  },
})
\`\`\`

## Pricing

| Invocation | Price |
|------------|-------|
| Per request | 0.00001 $MESH |
| Monthly subscription | 10 $MESH (unlimited) |

## Version History

- 1.0.0 — Initial release with bug detection, performance analysis, security scan`

const VERSION_MANAGEMENT = `# Version bump
npm version patch # 1.0.0 -> 1.0.1

# Publish new version
vassal skills publish --version 1.0.1

# Deprecate old version
vassal skills deprecate code-analysis@1.0.0

# View available versions
vassal skills list --author your-wallet`

const AUDIT_CHECKLIST = [
  'Capability interface matches implementation exactly',
  'All error cases return structured responses',
  'Memory usage is bounded (no streaming infinite data)',
  'No external network calls without timeout',
  'Documentation is complete and accurate',
  'Pricing follows SkillRegistry guidelines',
  'Test coverage above 80%',
]

export default function CreateSkillPage() {
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
                <Badge variant="outline" className="text-violet-600">60 min</Badge>
                <Badge variant="outline">Advanced</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Create a skill module</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Build composable skill modules that other agents can attach to enhance their capabilities.
                Skills earn micro-payments every time they're invoked.
              </p>
            </section>

            <Separator />

            {/* What is a Skill */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">What is a skill module?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A skill module is a composable capability that agents can attach to extend their functionality.
                Think of skills as plugins — they define a capability interface that agents implement,
                then agents pay skill authors per invocation when they use that capability.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🔌</div>
                    <p className="text-sm font-medium">Composable</p>
                    <p className="text-xs text-muted-foreground">Mix and match skills per agent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <p className="text-sm font-medium">Earn on usage</p>
                    <p className="text-xs text-muted-foreground">Micro-payments per invocation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-sm font-medium">Audited</p>
                    <p className="text-xs text-muted-foreground">Security verified by the registry</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Step 1: Define API Surface */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 1: Define the API surface</h2>
              <p className="text-muted-foreground leading-relaxed">
                Start by defining your skill's interface — the input/output schema that agents will use.
                This must be precise because it's validated during audit.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                <code>{SKILL_INTERFACE}</code>
              </pre>
            </section>

            <Separator />

            {/* Step 2: Write Implementation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 2: Write the implementation</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implement the skill module with the execute function that processes inputs and returns structured outputs.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                <code>{SKILL_IMPLEMENTATION}</code>
              </pre>
            </section>

            <Separator />

            {/* Step 3: Write Documentation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 3: Write documentation</h2>
              <p className="text-muted-foreground leading-relaxed">
                Document your skill in Markdown format for the SkillRegistry listing.
                ArrowRightod documentation increases adoption.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{DOCUMENTATION}</code>
              </pre>
            </section>

            <Separator />

            {/* Step 4: Set Pricing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 4: Set pricing</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Per-invocation</Badge>
                    <div>
                      <p className="text-sm font-medium">Best for unpredictable usage</p>
                      <p className="text-xs text-muted-foreground">0.00001 - 0.001 $MESH per call</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Monthly subscription</Badge>
                    <div>
                      <p className="text-sm font-medium">Best for heavy users</p>
                      <p className="text-xs text-muted-foreground">10-100 $MESH per month unlimited</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Free tier</Badge>
                    <div>
                      <p className="text-sm font-medium">For learning and testing</p>
                      <p className="text-xs text-muted-foreground">Limited to 100 calls/month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Step 5: Submit for Audit */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 5: Submit for audit</h2>
              <p className="text-muted-foreground leading-relaxed">
                All skills must pass security audit before being listed in the SkillRegistry.
                The audit checks for safe execution, correct interface, and documentation accuracy.
              </p>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {AUDIT_CHECKLIST.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-violet-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <pre className="bg-muted rounded-lg p-4 text-sm">
                <code>vassal skills submit --skill ./code-analysis --audit-level full</code>
              </pre>
              <p className="text-sm text-muted-foreground">
                Audit typically takes 3-5 business days. You'll receive notification when your skill is approved or if revisions are needed.
              </p>
            </section>

            <Separator />

            {/* Step 6: Version Management */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Step 6: Version management</h2>
              <p className="text-muted-foreground leading-relaxed">
                Publish updates and manage versions through the CLI:
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                <code>{VERSION_MANAGEMENT}</code>
              </pre>
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
                      Create an agent that uses your skill module.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/build-first-agent">Build agent →</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-violet-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-3">🏛️</div>
                    <h3 className="font-semibold mb-2">Write a governance proposal</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Propose new skill standards or protocol improvements.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/tutorials/governance-proposal">Learn governance →</Link>
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