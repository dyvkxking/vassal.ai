'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAgentById } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AGENT_CATEGORIES } from '@/constants'
import type { Agent } from '@/types'

const STEPS = [
  'Basic Info',
  'Capabilities',
  'SLA Parameters',
  'Pricing Model',
  'Skill Dependencies',
  'Self-Learning',
  'Testing',
  'Preview',
  'Publish',
]

export default function EditAgentPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  const existingAgent = getAgentById(agentId)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Info
    name: existingAgent?.name ?? '',
    description: existingAgent?.description ?? '',
    category: existingAgent?.category ?? 'defi',
    tags: '',
    avatarUrl: existingAgent?.avatarUrl ?? '',
    // Capabilities
    capabilities: existingAgent?.capabilities ?? [],
    // SLA
    latencyThresholdMs: existingAgent?.slaParams.latencyThresholdMs ?? 2000,
    tpmCap: existingAgent?.slaParams.tpmCap ?? 100000,
    uptimeGuaranteePercent: existingAgent?.slaParams.uptimeGuaranteePercent ?? 99,
    minStakeRequired: existingAgent?.slaParams.minStakeRequired ?? 500,
    // Pricing
    pricingType: existingAgent?.pricing.type ?? 'per_minute',
    pricePerMinute: existingAgent?.pricing.pricePerMinute ?? 0.002,
    pricePerSecond: existingAgent?.pricing.pricePerSecond ?? 0.00003,
    // Skills
    skillDependencies: existingAgent?.skillDependencies ?? [],
    // Learning
    learningEnabled: existingAgent?.learningEnabled ?? true,
    memoryRetentionDays: 30,
    autoApproveThreshold: 4,
  })

  if (!existingAgent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-24">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold mb-2">Agent not found</h2>
        <p className="text-muted-foreground mb-6">The agent &quot;{agentId}&quot; doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/builder/my-agents')}>← Back to My Agents</Button>
      </div>
    )
  }

  const update = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" onClick={() => router.push('/builder/my-agents')}>← Back</Button>
          </div>
          <h1 className="text-3xl font-bold">Edit Agent</h1>
          <p className="text-muted-foreground mt-1">Update agent &quot;{existingAgent.name}&quot; — changes will go live after review.</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-12">
          {/* Step Sidebar */}
          <aside className="w-[200px] shrink-0">
            <div className="sticky top-8">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Steps</div>
              <div className="space-y-1">
                {STEPS.map((step, i) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(i)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      i === currentStep
                        ? 'bg-violet-100 text-violet-700 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      i === currentStep ? 'bg-violet-600 text-white' : 'bg-muted'
                    }`}>
                      {i + 1}
                    </span>
                    {step}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 0: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Agent Name</Label>
                      <Input value={formData.name} onChange={(e) => update('name', e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={formData.description} onChange={(e) => update('description', e.target.value)} className="mt-1" rows={4} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => update('category', v)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {AGENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Avatar URL</Label>
                      <Input value={formData.avatarUrl} onChange={(e) => update('avatarUrl', e.target.value)} className="mt-1" placeholder="https://..." />
                    </div>
                  </div>
                )}

                {/* Step 1: Capabilities */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Define what tasks this agent can perform.</p>
                    {formData.capabilities.map((cap, i) => (
                      <div key={cap.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Capability {i + 1}</span>
                          <Button variant="ghost" size="sm" onClick={() => update('capabilities', formData.capabilities.filter((_, j) => j !== i))}>Remove</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Name</Label>
                            <Input value={cap.name} onChange={(e) => {
                              const updated = [...formData.capabilities]
                              updated[i] = { ...updated[i], name: e.target.value }
                              update('capabilities', updated)
                            }} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">TPM Required</Label>
                            <Input type="number" value={cap.tpmRequired} onChange={(e) => {
                              const updated = [...formData.capabilities]
                              updated[i] = { ...updated[i], tpmRequired: Number(e.target.value) }
                              update('capabilities', updated)
                            }} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => update('capabilities', [...formData.capabilities, { id: `cap-${Date.now()}`, name: '', description: '', tpmRequired: 10000, category: formData.category }])}
                    >
                      + Add Capability
                    </Button>
                  </div>
                )}

                {/* Step 2: SLA */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Latency Threshold: {formData.latencyThresholdMs}ms</Label>
                      <Slider value={[formData.latencyThresholdMs]} min={100} max={10000} step={100} onValueChange={(v) => update('latencyThresholdMs', Array.isArray(v) ? v[0] : v)} className="mt-2" />
                    </div>
                    <div>
                      <Label>TPM Cap: {formData.tpmCap.toLocaleString()}</Label>
                      <Slider value={[formData.tpmCap]} min={1000} max={500000} step={1000} onValueChange={(v) => update('tpmCap', Array.isArray(v) ? v[0] : v)} className="mt-2" />
                    </div>
                    <div>
                      <Label>Uptime Guarantee: {formData.uptimeGuaranteePercent}%</Label>
                      <Slider value={[formData.uptimeGuaranteePercent]} min={80} max={100} step={1} onValueChange={(v) => update('uptimeGuaranteePercent', Array.isArray(v) ? v[0] : v)} className="mt-2" />
                    </div>
                    <div>
                      <Label>Min Stake Required ($MESH)</Label>
                      <Input type="number" value={formData.minStakeRequired} onChange={(e) => update('minStakeRequired', Number(e.target.value))} className="mt-1" />
                    </div>
                  </div>
                )}

                {/* Step 3: Pricing */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Pricing Type</Label>
                      <Select value={formData.pricingType} onValueChange={(v) => update('pricingType', v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per_minute">Per Minute</SelectItem>
                          <SelectItem value="per_second">Per Second</SelectItem>
                          <SelectItem value="flat_rate">Flat Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.pricingType === 'per_minute' && (
                      <div>
                        <Label>Price per Minute ($)</Label>
                        <Input type="number" step="0.0001" value={formData.pricePerMinute} onChange={(e) => update('pricePerMinute', Number(e.target.value))} className="mt-1" />
                      </div>
                    )}
                    {formData.pricingType === 'per_second' && (
                      <div>
                        <Label>Price per Second ($)</Label>
                        <Input type="number" step="0.000001" value={formData.pricePerSecond} onChange={(e) => update('pricePerSecond', Number(e.target.value))} className="mt-1" />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Skills */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Select skill dependencies from the registry.</p>
                    <div className="space-y-2">
                      {['skill-web3-read', 'skill-price-feed', 'skill-summarizer', 'skill-onchain-reads'].map((skillId) => (
                        <div key={skillId} className="flex items-center gap-3 p-3 rounded-lg border">
                          <input
                            type="checkbox"
                            checked={formData.skillDependencies.includes(skillId)}
                            onChange={(e) => {
                              const deps = e.target.checked
                                ? [...formData.skillDependencies, skillId]
                                : formData.skillDependencies.filter((s) => s !== skillId)
                              update('skillDependencies', deps)
                            }}
                          />
                          <span className="text-sm font-medium">{skillId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Learning */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Self-Learning Enabled</Label>
                        <p className="text-sm text-muted-foreground">Agent improves from session feedback</p>
                      </div>
                      <Switch checked={formData.learningEnabled} onCheckedChange={(v) => update('learningEnabled', v)} />
                    </div>
                    <Separator />
                    <div>
                      <Label>Memory Retention: {formData.memoryRetentionDays} days</Label>
                      <Slider value={[formData.memoryRetentionDays]} min={7} max={365} step={1} onValueChange={(v) => update('memoryRetentionDays', Array.isArray(v) ? v[0] : v)} className="mt-2" />
                    </div>
                    <div>
                      <Label>Auto-Approve Threshold: {formData.autoApproveThreshold} ★</Label>
                      <p className="text-sm text-muted-foreground mb-2">Signals with rating ≥ this are auto-approved</p>
                      <Slider value={[formData.autoApproveThreshold]} min={1} max={5} step={0.5} onValueChange={(v) => update('autoApproveThreshold', Array.isArray(v) ? v[0] : v)} className="mt-2" />
                    </div>
                  </div>
                )}

                {/* Step 6: Testing */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <Textarea placeholder="Enter a test query to try your agent..." rows={4} />
                    <div className="flex gap-3">
                      <Button variant="outline">Run Test</Button>
                      <span className="text-sm text-muted-foreground self-center">Latency: —ms</span>
                    </div>
                    <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                      Test response will appear here. Connect your agent runtime to enable testing.
                    </div>
                  </div>
                )}

                {/* Step 7: Preview */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="h-16 w-16 rounded-lg">
                          <AvatarImage src={formData.avatarUrl} />
                          <AvatarFallback className="bg-violet-100 text-violet-700 text-xl">{formData.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{formData.name}</h3>
                          <p className="text-muted-foreground mt-1">{formData.description}</p>
                          <Badge variant="secondary" className="mt-2">{formData.category}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold">{formData.tpmCap.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">TPM cap</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold">{formData.latencyThresholdMs}ms</div>
                          <div className="text-xs text-muted-foreground">Latency SLA</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold">${formData.pricePerMinute.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">per minute</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 8: Publish */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-6">
                      <h3 className="font-semibold mb-3">Pre-launch Checklist</h3>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Agent name set', done: !!formData.name },
                          { label: 'At least one capability defined', done: formData.capabilities.length > 0 },
                          { label: 'SLA parameters configured', done: formData.tpmCap > 0 },
                          { label: 'Pricing set', done: formData.pricePerMinute > 0 },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2">
                            <span className={item.done ? 'text-green-600' : 'text-red-500'}>{item.done ? '✓' : '✗'}</span>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setCurrentStep(7)}>← Preview</Button>
                      <Button variant="outline">Save as Draft</Button>
                      <Button className="bg-violet-600 hover:bg-violet-700">Publish Changes</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)}>
                ← Previous
              </Button>
              {currentStep < STEPS.length - 1 && (
                <Button onClick={() => setCurrentStep((s) => s + 1)}>
                  Next →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}