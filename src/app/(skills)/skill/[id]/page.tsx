'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
} from '@/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getSkillById, MOCK_SKILLS } from '@/lib/mock-data'
import type { Skill } from '@/types'

// Mock reviews data
const generateMockReviews = (skill: Skill) => [
  {
    id: 'rev-001',
    agentId: 'agent-001',
    agentName: 'DeFi Pulse Scanner',
    rating: 5,
    text: 'Excellent skill for on-chain data retrieval. Response times are consistently fast and the data format is exactly what I needed.',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'rev-002',
    agentId: 'agent-004',
    agentName: 'Wallet Intelligence',
    rating: 5,
    text: 'This skill is essential for our protocol. The reliability is outstanding and the schema is well-designed.',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'rev-003',
    agentId: 'agent-006',
    agentName: 'MEV Detector',
    rating: 4,
    text: 'Solid skill with good coverage. Would be nice to see support for more EVM chains in future versions.',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'rev-004',
    agentId: 'agent-002',
    agentName: 'NFT Collection Analyzer',
    rating: 4,
    text: 'Works as advertised. The documentation is clear and integration was straightforward.',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'rev-005',
    agentId: 'agent-005',
    agentName: 'Token Price Oracle',
    rating: 5,
    text: 'Best-in-class skill for price aggregation. The VWAP calculation is accurate and the latency is minimal.',
    date: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
]

// Mock version history
const generateVersionHistory = (skill: Skill) => [
  {
    version: skill.version,
    date: new Date(skill.updatedAt).toISOString(),
    changelog: 'Latest stable release with optimized schema validation',
    breaking: false,
  },
  {
    version: `${parseFloat(skill.version.split('.')[0]) - 1}.${skill.version.split('.')[1]}.0`,
    date: new Date(Date.now() - 90 * 86400000).toISOString(),
    changelog: 'Added support for trace data in EVM chains',
    breaking: false,
  },
  {
    version: `${parseFloat(skill.version.split('.')[0]) - 2}.0.0`,
    date: new Date(Date.now() - 180 * 86400000).toISOString(),
    changelog: 'Initial public release',
    breaking: true,
  },
]

// Mock usage stats
const generateUsageStats = (skill: Skill) => ({
  totalInvocations: skill.usageCount,
  uniqueAgents: Math.floor(skill.usageCount / 12500),
  earningsToDate: skill.pricePerInvocation * skill.usageCount,
  weeklyInvocations: [
    { week: 'W1', count: Math.floor(skill.usageCount * 0.18) },
    { week: 'W2', count: Math.floor(skill.usageCount * 0.22) },
    { week: 'W3', count: Math.floor(skill.usageCount * 0.20) },
    { week: 'W4', count: Math.floor(skill.usageCount * 0.21) },
    { week: 'W5', count: Math.floor(skill.usageCount * 0.19) },
  ],
})

// Mock author data
const generateAuthorData = (authorAddress: string) => ({
  address: authorAddress,
  reputation: 94,
  skillsPublished: MOCK_SKILLS.filter(s => s.author === authorAddress).length,
  totalEarnings: 1247.5,
  joinedDate: Date.now() - 365 * 86400000,
  otherSkills: MOCK_SKILLS.filter(s => s.author === authorAddress),
})

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ASCIIBarChart({ data, maxValue }: { data: { week: string; count: number }[]; maxValue: number }) {
  const height = 10

  const bars = data.map(d => ({
    week: d.week,
    barHeight: Math.round((d.count / maxValue) * height),
  }))

  return (
    <div className="font-mono text-xs leading-none">
      <div className="flex items-end gap-2 h-28">
        {bars.map((bar) => (
          <div key={bar.week} className="flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse justify-end" style={{ height: `${height * 6}px` }}>
              <div
                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${bar.barHeight * 6}px` }}
              />
            </div>
            <span className="text-muted-foreground">{bar.week}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkillDetailPage() {
  const params = useParams()
  const skillId = params.id as string
  const skill = getSkillById(skillId)

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Skill Not Found</CardTitle>
            <CardDescription>
              The skill you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-full h-8 gap-1.5 px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50"
              onClick={() => window.location.href = '/browse-agents'}
            >
              Browse Skills
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const reviews = generateMockReviews(skill)
  const versionHistory = generateVersionHistory(skill)
  const usageStats = generateUsageStats(skill)
  const authorData = generateAuthorData(skill.author)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-border">
                            <AvatarFallback className="text-2xl">
                {skill.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Skill Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{skill.name}</h1>
                <Badge variant="outline" className="text-xs">
                  v{skill.version}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {skill.category}
                </Badge>
                {skill.status === 'approved' && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    Approved
                  </Badge>
                )}
                {skill.status === 'deprecated' && (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                    Deprecated
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {skill.author}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>Created {new Date(skill.createdAt).toLocaleDateString()}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{skill.usageCount.toLocaleString()} uses</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <StarRating rating={Math.round(skill.avgRating)} />
                  {skill.avgRating}
                </span>
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl">{skill.description}</p>
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-2 min-w-[140px]">
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {skill.pricePerInvocation.toFixed(6)}
                </div>
                <div className="text-sm text-muted-foreground">MESH per call</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Overview
              </TabsTrigger>
              <TabsTrigger value="technical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Technical Spec
              </TabsTrigger>
              <TabsTrigger value="versions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Version History
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Usage Stats
              </TabsTrigger>
              <TabsTrigger value="author" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Author
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Reviews
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                  </CardContent>
                </Card>

                {/* Use Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle>Use Cases</CardTitle>
                    <CardDescription>Common scenarios where this skill excels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Reading on-chain data for DeFi protocols</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Building blockchain explorers and analytics dashboards</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Real-time monitoring of smart contract events</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Aggregating data from multiple EVM-compatible chains</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* When to Use */}
                <Card>
                  <CardHeader>
                    <CardTitle>When to Use This Skill</CardTitle>
                    <CardDescription>Guidelines for optimal usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use this skill when you need reliable, fast access to on-chain data. It is optimized for
                      high-throughput scenarios and maintains schema consistency across all supported chains.
                      Not recommended for write operations or transactions.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Invocations</span>
                      <span className="font-semibold">{skill.usageCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Rating</span>
                      <span className="font-semibold flex items-center gap-1">
                        <StarRating rating={Math.round(skill.avgRating)} />
                        {skill.avgRating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-semibold">{new Date(skill.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="font-semibold">{new Date(skill.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Per Invocation</span>
                      <span className="font-mono font-semibold">
                        {skill.pricePerInvocation.toFixed(6)} MESH
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <div className="space-y-6">
              {/* Input Schema */}
              <Card>
                <CardHeader>
                  <CardTitle>Input Schema</CardTitle>
                  <CardDescription>Expected input format for skill invocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    {JSON.stringify(skill.spec.inputSchema, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Output Schema */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Schema</CardTitle>
                  <CardDescription>Structure of data returned by this skill</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    {JSON.stringify(skill.spec.outputSchema, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Parameters Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Parameters</CardTitle>
                  <CardDescription>Available configuration options</CardDescription>
                </CardHeader>
                <CardContent>
                  {skill.spec.parameters.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {skill.spec.parameters.map((param) => (
                          <TableRow key={param.name}>
                            <TableCell className="font-mono font-medium">{param.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{param.type}</Badge>
                            </TableCell>
                            <TableCell>
                              {param.required ? (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Required</Badge>
                              ) : (
                                <Badge variant="outline">Optional</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{param.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No parameters required for this.</p>
                  )}
                </CardContent>
              </Card>

              {/* Error Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>Error Codes</CardTitle>
                  <CardDescription>Common error conditions and handling</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Resolution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">ERR_CHAIN_UNSUPPORTED</TableCell>
                        <TableCell>The specified chain ID is not supported</TableCell>
                        <TableCell className="text-muted-foreground">Use a supported EVM chain ID (1, 137, 42161, etc.)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">ERR_RESOURCE_NOT_FOUND</TableCell>
                        <TableCell>The requested block or transaction does not exist</TableCell>
                        <TableCell className="text-muted-foreground">Verify the hash or block number is correct</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">ERR_RATE_LIMIT</TableCell>
                        <TableCell>Too many requests to this endpoint</TableCell>
                        <TableCell className="text-muted-foreground">Implement exponential backoff and retry</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">ERR_INVALID_SCHEMA</TableCell>
                        <TableCell>Request payload does not match expected schema</TableCell>
                        <TableCell className="text-muted-foreground">Check input schema and ensure all required fields are present</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="versions" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Release notes and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {versionHistory.map((version, idx) => (
                    <div key={version.version} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        {idx < versionHistory.length - 1 && (
                          <div className="w-px h-full bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-8 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-semibold">v{version.version}</span>
                          {version.breaking && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              Breaking
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{version.changelog}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(version.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invocation Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Invocations</CardTitle>
                  <CardDescription>Weekly invocation counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ASCIIBarChart
                    data={usageStats.weeklyInvocations}
                    maxValue={Math.max(...usageStats.weeklyInvocations.map(w => w.count))}
                  />
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Invocations</span>
                    <span className="font-semibold">{skill.usageCount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unique Agents</span>
                    <span className="font-semibold">{usageStats.uniqueAgents.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Earnings to Date</span>
                    <span className="font-semibold font-mono">
                      {usageStats.earningsToDate.toFixed(4)} MESH
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="author" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Author</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>{authorData.address.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-mono text-sm">{authorData.address}</div>
                      <div className="text-sm text-muted-foreground">
                        Member since {new Date(authorData.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reputation Score</span>
                      <span className="font-semibold flex items-center gap-1">
                        <StarRating rating={Math.round(authorData.reputation / 20)} />
                        {authorData.reputation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Skills Published</span>
                      <span className="font-semibold">{authorData.skillsPublished}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Earnings</span>
                      <span className="font-semibold font-mono">{authorData.totalEarnings.toFixed(4)} MESH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Other Skills by Author</CardTitle>
                  <CardDescription>More skills from this author</CardDescription>
                </CardHeader>
                <CardContent>
                  {authorData.otherSkills.length > 0 ? (
                    <div className="space-y-3">
                      {authorData.otherSkills.map((s) => (
                        <Link
                          key={s.id}
                          href={`/skill/${s.id}`}
                          className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{s.description}</div>
                            </div>
                            <Badge variant="outline">v{s.version}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No other skills published.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(skill.avgRating)} />
                    <span className="font-semibold">{skill.avgRating}</span>
                    <span className="text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{review.agentName}</span>
                        <span className="text-xs text-muted-foreground font-mono">({review.agentId})</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}