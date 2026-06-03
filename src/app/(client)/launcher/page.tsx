'use client'

import { useState, useMemo } from 'react'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { AGENT_CATEGORIES } from '@/constants'
import type { Agent } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface FilterState {
  category: string
  tpmMin: number
  latencyMax: number
  priceMax: number
  minQualityScore: number
}

interface SessionConfig {
  maxBudget: number
  strictSLA: boolean
  estimatedMinutes: number
}

function formatPrice(pricePerMinute: number | undefined): string {
  if (!pricePerMinute) return '$0.00'
  return `$${pricePerMinute.toFixed(4)}`
}

function formatTPM(tpm: number): string {
  if (tpm >= 1000) return `${(tpm / 1000).toFixed(0)}K`
  return tpm.toString()
}

function calculateCompatibility(agent: Agent, filters: FilterState): { score: number; meetsAll: boolean; issues: string[] } {
  const issues: string[] = []
  if (agent.slaParams.tpmCap < filters.tpmMin) issues.push(`TPM cap ${formatTPM(agent.slaParams.tpmCap)} below required ${formatTPM(filters.tpmMin)}`)
  if (agent.slaParams.latencyThresholdMs > filters.latencyMax) issues.push(`Latency ${agent.slaParams.latencyThresholdMs}ms exceeds max ${filters.latencyMax}ms`)
  const price = agent.pricing.pricePerMinute ?? 0
  if (price > filters.priceMax) issues.push(`Price ${formatPrice(price)} exceeds max ${formatPrice(filters.priceMax)}`)
  if (agent.qualityScore < filters.minQualityScore) issues.push(`Quality score ${agent.qualityScore} below min ${filters.minQualityScore}`)
  return {
    score: issues.length === 0 ? 100 : issues.length === 1 ? 75 : issues.length === 2 ? 50 : 25,
    meetsAll: issues.length === 0,
    issues,
  }
}

export default function LauncherPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    tpmMin: 1000,
    latencyMax: 10000,
    priceMax: 1,
    minQualityScore: 0,
  })
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    maxBudget: 10,
    strictSLA: true,
    estimatedMinutes: 60,
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const filteredAgents = useMemo(() => {
    if (!hasSearched) return []
    return MOCK_AGENTS
      .map((agent) => ({
        agent,
        compatibility: calculateCompatibility(agent, filters),
      }))
      .filter(({ compatibility }) => compatibility.score >= 25)
      .sort((a, b) => {
        if (a.compatibility.meetsAll && !b.compatibility.meetsAll) return -1
        if (!a.compatibility.meetsAll && b.compatibility.meetsAll) return 1
        return b.compatibility.score - a.compatibility.score || b.agent.qualityScore - a.agent.qualityScore
      })
  }, [hasSearched, filters])

  const bestMatch = filteredAgents[0]

  const handleFindAgents = () => {
    setHasSearched(true)
  }

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value === 'all' ? '' : value })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Client Session Launcher</h1>
            <p className="text-muted-foreground">
              Specify your capability requirements and get matched with optimal agents for your task.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Natural Language Query */}
          <Card>
            <CardHeader>
              <CardTitle>What do you need?</CardTitle>
              <CardDescription>Describe your task in natural language</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., I need an agent to monitor DeFi yield opportunities across multiple protocols with sub-second latency..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px] text-base"
              />
            </CardContent>
          </Card>

          {/* Capability Filter Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Capability Filters</CardTitle>
              <CardDescription>Configure your minimum requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Task Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Category</label>
                <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {AGENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TPM Requirement */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Min TPM Requirement</label>
                  <span className="text-sm text-muted-foreground">{formatTPM(filters.tpmMin)} TPM</span>
                </div>
                <Slider
                  value={[filters.tpmMin]}
                  onValueChange={([v]) => setFilters({ ...filters, tpmMin: v })}
                  min={1000}
                  max={500000}
                  step={1000}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1K</span>
                  <span>500K</span>
                </div>
              </div>

              {/* Max Latency SLA */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Max Latency SLA</label>
                  <span className="text-sm text-muted-foreground">{filters.latencyMax}ms</span>
                </div>
                <Slider
                  value={[filters.latencyMax]}
                  onValueChange={([v]) => setFilters({ ...filters, latencyMax: v })}
                  min={100}
                  max={10000}
                  step={100}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100ms</span>
                  <span>10000ms</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Max Price per Minute</label>
                  <span className="text-sm text-muted-foreground">${filters.priceMax.toFixed(3)}</span>
                </div>
                <Slider
                  value={[filters.priceMax * 1000]}
                  onValueChange={([v]) => setFilters({ ...filters, priceMax: v / 1000 })}
                  min={0}
                  max={1000}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$1</span>
                </div>
              </div>

              {/* Min Quality Score */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Min Quality Score</label>
                  <span className="text-sm text-muted-foreground">{filters.minQualityScore}</span>
                </div>
                <Slider
                  value={[filters.minQualityScore]}
                  onValueChange={([v]) => setFilters({ ...filters, minQualityScore: v })}
                  min={0}
                  max={100}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              <Button onClick={handleFindAgents} className="w-full" size="lg">
                Find Agents
              </Button>
            </CardContent>
          </Card>

          {/* Match Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Match Results</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {filteredAgents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-lg font-semibold mb-2">No matching agents</h3>
                    <p className="text-muted-foreground text-center">
                      Try relaxing your filters to see more options.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredAgents.map(({ agent, compatibility }, index) => (
                    <Card
                      key={agent.id}
                      className={`relative transition-colors hover:bg-muted/50 ${index === 0 ? 'border-primary' : ''}`}
                    >
                      {index === 0 && (
                        <Badge className="absolute -top-3 left-4" variant="default">
                          Best Match
                        </Badge>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <CardDescription className="mt-1 line-clamp-2">{agent.description}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge
                              variant={compatibility.meetsAll ? 'default' : 'secondary'}
                              className={compatibility.meetsAll ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {compatibility.meetsAll ? '✅' : '⚠️'} {compatibility.meetsAll ? 'SLA Match' : 'Partial'}
                            </Badge>
                            <Badge variant="outline" className="font-mono">
                              Q: {agent.qualityScore}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">TPM Cap</p>
                            <p className="font-semibold">{formatTPM(agent.slaParams.tpmCap)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Latency</p>
                            <p className="font-semibold">{agent.slaParams.latencyThresholdMs}ms</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Price</p>
                            <p className="font-semibold">{formatPrice(agent.pricing.pricePerMinute)}/min</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Sessions</p>
                            <p className="font-semibold">{agent.totalSessions.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Issues Warning */}
                        {!compatibility.meetsAll && (
                          <div className="rounded-md bg-yellow-500/10 p-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              <span className="font-medium">SLA gaps:</span> {compatibility.issues.join('; ')}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(agent)}>
                                Quick View
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                              <SheetHeader>
                                <SheetTitle>{agent.name}</SheetTitle>
                                <SheetDescription>Agent details and capabilities</SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Description</h4>
                                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                                </div>
                                <Separator />
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                                  <div className="space-y-2">
                                    {agent.capabilities.map((cap) => (
                                      <div key={cap.id} className="flex justify-between text-sm">
                                        <span className="font-medium">{cap.name}</span>
                                        <span className="text-muted-foreground">{formatTPM(cap.tpmRequired)} TPM</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Quality Score</p>
                                    <p className="text-2xl font-bold">{agent.qualityScore}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                                    <p className="text-2xl font-bold">{agent.avgRating}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Uptime</p>
                                    <p className="text-2xl font-bold">{agent.slaParams.uptimeGuaranteePercent}%</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Version</p>
                                    <p className="text-2xl font-bold">{agent.version}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <h4 className="text-sm font-medium mb-2">SLA Parameters</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Latency Threshold</span>
                                      <span>{agent.slaParams.latencyThresholdMs}ms</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">TPM Cap</span>
                                      <span>{formatTPM(agent.slaParams.tpmCap)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Min Stake Required</span>
                                      <span>{agent.slaParams.minStakeRequired} MESH</span>
                                    </div>
                                  </div>
                                </div>
                                {agent.skillDependencies.length > 0 && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Skill Dependencies</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {agent.skillDependencies.map((skill) => (
                                          <Badge key={skill} variant="secondary">{skill}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </SheetContent>
                          </Sheet>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedAgent(agent)
                            }}
                          >
                            Select & Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Session Configuration Panel */}
      {selectedAgent && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Selected Agent</p>
                <p className="font-semibold">{selectedAgent.name}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Max Budget ($)</label>
                  <Input
                    type="number"
                    value={sessionConfig.maxBudget}
                    onChange={(e) => setSessionConfig({ ...sessionConfig, maxBudget: parseFloat(e.target.value) || 0 })}
                    className="w-24"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Duration Est.</label>
                  <p className="font-semibold">{sessionConfig.estimatedMinutes} min</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">SLA Strictness:</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={sessionConfig.strictSLA}
                      onCheckedChange={(checked) => setSessionConfig({ ...sessionConfig, strictSLA: checked })}
                      id="sla-strictness"
                    />
                    <label htmlFor="sla-strictness" className="text-sm font-medium">
                      {sessionConfig.strictSLA ? 'Strict' : 'Relaxed'}
                    </label>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowConfirmDialog(true)}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rental</DialogTitle>
            <DialogDescription>Review your session configuration before confirming</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent</span>
                  <span className="font-medium">{selectedAgent.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Budget</span>
                  <span className="font-medium">${sessionConfig.maxBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Duration</span>
                  <span className="font-medium">{sessionConfig.estimatedMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Rate</span>
                  <span className="font-medium">{formatPrice(selectedAgent.pricing.pricePerMinute)}/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SLA Mode</span>
                  <Badge variant={sessionConfig.strictSLA ? 'default' : 'secondary'}>
                    {sessionConfig.strictSLA ? 'Strict' : 'Relaxed'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Total Cost</span>
                  <span className="font-semibold">
                    ${Math.min(selectedAgent.pricing.pricePerMinute! * sessionConfig.estimatedMinutes, sessionConfig.maxBudget).toFixed(4)}
                  </span>
                </div>
              </div>
              {query && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground mb-1">Your Query</p>
                  <p className="text-sm">{query}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              // Handle rental confirmation
              setShowConfirmDialog(false)
            }}>
              Confirm Rental
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}