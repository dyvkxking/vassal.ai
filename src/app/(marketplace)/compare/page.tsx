'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Agent } from '@/types'

function AgentChip({ agent, onRemove }: { agent: Agent; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
      <Avatar className="h-5 w-5">
        <AvatarImage src={agent.avatarUrl} />
        <AvatarFallback className="text-xs">{agent.name[0]}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{agent.name}</span>
      <Badge variant="secondary" className="text-xs">{agent.qualityScore}</Badge>
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-muted-foreground hover:text-foreground">✕</button>
      )}
    </div>
  )
}

function ComparisonRow({ label, values, highlights }: { label: string; values: string[]; highlights?: number[] }) {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4 font-medium text-sm text-muted-foreground">{label}</td>
      {values.map((val, i) => (
        <td key={i} className="py-3 px-4 text-center">
          <span className={highlights?.[i] === 1 ? 'text-green-600 font-semibold' : highlights?.[i] === -1 ? 'text-red-500' : ''}>
            {val}
          </span>
        </td>
      ))}
    </tr>
  )
}

function MetricCard({ label, value, unit, best }: { label: string; value: string; unit?: string; best?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 text-center ${best ? 'border-green-300 bg-green-50' : 'border-border'}`}>
      <div className={`text-2xl font-bold ${best ? 'text-green-700' : ''}`}>{value}</div>
      {unit && <div className="text-xs text-muted-foreground mt-1">{unit}</div>}
      {best && <Badge variant="default" className="mt-2 text-xs bg-green-600">Best</Badge>}
    </div>
  )
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const initialIds = searchParams.get('agents')?.split(',').filter(Boolean) ?? []

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, 4))

  const selectedAgents = selectedIds.map((id) => MOCK_AGENTS.find((a) => a.id === id)).filter(Boolean) as Agent[]
  const allAgents = MOCK_AGENTS

  const addAgent = (id: string) => {
    if (selectedIds.length >= 4 || selectedIds.includes(id)) return
    setSelectedIds([...selectedIds, id])
  }

  const removeAgent = (id: string) => {
    setSelectedIds(selectedIds.filter((sid) => sid !== id))
  }

  if (selectedAgents.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold">Compare Agents</h1>
            <p className="text-muted-foreground mt-1">Select up to 4 agents to compare side-by-side.</p>
          </div>
        </div>
        <div className="container py-12">
          <h2 className="text-lg font-semibold mb-4">Choose agents to compare</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allAgents.map((agent) => (
              <Card key={agent.id} className="p-4 cursor-pointer hover:border-violet-300" onClick={() => addAgent(agent.id)}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={agent.avatarUrl} />
                    <AvatarFallback className="bg-violet-100 text-violet-700">{agent.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">★ {agent.avgRating} · {agent.totalSessions} sessions</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Find best values for highlighting
  const bestQuality = Math.max(...selectedAgents.map((a) => a.qualityScore))
  const lowestPrice = Math.min(...selectedAgents.map((a) => a.pricing.pricePerMinute ?? 0))
  const highestSessions = Math.max(...selectedAgents.map((a) => a.totalSessions))
  const bestUptime = Math.max(...selectedAgents.map((a) => a.slaParams.uptimeGuaranteePercent))
  const bestLatency = Math.min(...selectedAgents.map((a) => a.slaParams.latencyThresholdMs))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Compare Agents</h1>
              <p className="text-muted-foreground mt-1">Comparing {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''}</p>
            </div>
            <Button variant="outline">
              <Link href="/browse-agents">← Back to Browse</Link>
            </Button>
          </div>
          {/* Selected chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedAgents.map((agent) => (
              <AgentChip key={agent.id} agent={agent} onRemove={() => removeAgent(agent.id)} />
            ))}
            {selectedIds.length < 4 && (
              <select
                className="text-sm border border-dashed border-border rounded-full px-3 py-1.5 bg-transparent"
                onChange={(e) => addAgent(e.target.value)}
                value=""
              >
                <option value="">+ Add agent</option>
                {allAgents.filter((a) => !selectedIds.includes(a.id)).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Quality Score"
            value={`${bestQuality}`}
            unit="/ 100"
            best={true}
          />
          <MetricCard
            label="Lowest Price"
            value={`$${lowestPrice.toFixed(4)}`}
            unit="/min"
            best={true}
          />
          <MetricCard
            label="Most Sessions"
            value={highestSessions.toLocaleString()}
            unit="completed"
            best={true}
          />
          <MetricCard
            label="Best Uptime"
            value={`${bestUptime}%`}
            unit="guaranteed"
            best={true}
          />
        </div>

        {/* Comparison Table */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sla">SLA Params</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader><CardTitle>Agent Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <ComparisonRow
                        label="Quality Score"
                        values={selectedAgents.map((a) => a.qualityScore.toString())}
                        highlights={selectedAgents.map((a) => (a.qualityScore === bestQuality ? 1 : 0))}
                      />
                      <ComparisonRow
                        label="Total Sessions"
                        values={selectedAgents.map((a) => a.totalSessions.toLocaleString())}
                        highlights={selectedAgents.map((a) => (a.totalSessions === highestSessions ? 1 : 0))}
                      />
                      <ComparisonRow
                        label="Avg Rating"
                        values={selectedAgents.map((a) => `★ ${a.avgRating.toFixed(1)}`)}
                        highlights={selectedAgents.map((a) => (a.avgRating === Math.max(...selectedAgents.map((x) => x.avgRating)) ? 1 : 0))}
                      />
                      <ComparisonRow
                        label="Category"
                        values={selectedAgents.map((a) => a.category)}
                      />
                      <ComparisonRow
                        label="Self-Learning"
                        values={selectedAgents.map((a) => a.learningEnabled ? 'Yes 🧠' : 'No')}
                      />
                      <ComparisonRow
                        label="Version"
                        values={selectedAgents.map((a) => `v${a.version}`)}
                      />
                      <ComparisonRow
                        label="Min Stake Required"
                        values={selectedAgents.map((a) => `${a.slaParams.minStakeRequired.toLocaleString()} $MESH`)}
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sla">
            <Card>
              <CardHeader><CardTitle>SLA Parameters</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <ComparisonRow
                        label="Latency Threshold"
                        values={selectedAgents.map((a) => `${a.slaParams.latencyThresholdMs}ms`)}
                        highlights={selectedAgents.map((a) => (a.slaParams.latencyThresholdMs === bestLatency ? 1 : -1))}
                      />
                      <ComparisonRow
                        label="TPM Cap"
                        values={selectedAgents.map((a) => a.slaParams.tpmCap.toLocaleString())}
                      />
                      <ComparisonRow
                        label="Uptime Guarantee"
                        values={selectedAgents.map((a) => `${a.slaParams.uptimeGuaranteePercent}%`)}
                        highlights={selectedAgents.map((a) => (a.slaParams.uptimeGuaranteePercent === bestUptime ? 1 : 0))}
                      />
                      <ComparisonRow
                        label="Min Stake Required"
                        values={selectedAgents.map((a) => `${a.slaParams.minStakeRequired.toLocaleString()} $MESH`)}
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader><CardTitle>Pricing Comparison</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <ComparisonRow
                        label="Price Type"
                        values={selectedAgents.map((a) => a.pricing.type.replace('_', ' '))}
                      />
                      <ComparisonRow
                        label="Price per Minute"
                        values={selectedAgents.map((a) => a.pricing.pricePerMinute != null ? `$${a.pricing.pricePerMinute.toFixed(4)}` : '—')}
                        highlights={selectedAgents.map((a) => (a.pricing.pricePerMinute === lowestPrice ? 1 : 0))}
                      />
                      <ComparisonRow
                        label="Price per Second"
                        values={selectedAgents.map((a) => a.pricing.pricePerSecond != null ? `$${a.pricing.pricePerSecond.toFixed(6)}` : '—')}
                      />
                    </tbody>
                  </table>
                </div>
                <Separator className="my-6" />
                <h4 className="font-medium mb-3">Estimated Cost (1 hour session)</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedAgents.map((agent) => {
                    const costPerHour = (agent.pricing.pricePerMinute ?? 0) * 60
                    const isCheapest = costPerHour === Math.min(...selectedAgents.map((a) => (a.pricing.pricePerMinute ?? 0) * 60))
                    return (
                      <div key={agent.id} className={`rounded-lg border p-4 ${isCheapest ? 'border-green-300 bg-green-50' : 'border-border'}`}>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-2xl font-bold mt-2">${costPerHour.toFixed(4)}</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                        {isCheapest && <Badge className="mt-2 text-xs bg-green-600">Most Affordable</Badge>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capabilities">
            <Card>
              <CardHeader><CardTitle>Capabilities</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAgents.map((agent) => (
                    <div key={agent.id} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{agent.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{agent.name}</span>
                      </div>
                      <div className="space-y-2">
                        {agent.capabilities.map((cap) => (
                          <div key={cap.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{cap.name}</span>
                            <Badge variant="secondary" className="text-xs">{cap.tpmRequired.toLocaleString()} TPM</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}