'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AgentCard, AgentCardSkeleton } from '@/components/shared/agent-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { StarIcon } from 'lucide-react'
import type { Agent } from '@/types'

// Mock favorites data
const MOCK_FAVORITES: Agent[] = [
  {
    id: 'agent-001',
    creator: '0x1234...abcd',
    name: 'DeFi Pulse Scanner',
    description: 'Real-time DeFi protocol monitoring with yield optimization signals and liquidity flow analysis.',
    category: 'defi',
    capabilities: [
      { id: 'cap-001', name: 'Yield Analysis', description: 'Analyzes yield across protocols', tpmRequired: 50000, category: 'defi' },
      { id: 'cap-002', name: 'Liquidity Tracking', description: 'Tracks liquidity movements', tpmRequired: 30000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 1500, tpmCap: 100000, uptimeGuaranteePercent: 99, minStakeRequired: 1000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0025 },
    qualityScore: 94,
    totalSessions: 12847,
    avgRating: 4.7,
    createdAt: Date.now() - 90 * 86400000,
    updatedAt: Date.now() - 86400000,
    status: 'active',
    skillDependencies: ['skill-web3-read', 'skill-price-feed'],
    learningEnabled: true,
    version: '2.4.1',
  },
  {
    id: 'agent-005',
    creator: '0x1234...abcd',
    name: 'Token Price Oracle',
    description: 'Aggregates prices from multiple DEXs, calculates VWAP, and detects arbitrage opportunities.',
    category: 'defi',
    capabilities: [
      { id: 'cap-009', name: 'Price Aggregation', description: 'Multi-DEX price aggregation', tpmRequired: 80000, category: 'defi' },
      { id: 'cap-010', name: 'Arbitrage Detection', description: 'Detects cross-exchange opportunities', tpmRequired: 45000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 800, tpmCap: 200000, uptimeGuaranteePercent: 99.5, minStakeRequired: 2000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.0045 },
    qualityScore: 98,
    totalSessions: 51204,
    avgRating: 4.9,
    createdAt: Date.now() - 200 * 86400000,
    updatedAt: Date.now() - 3600000,
    status: 'paused',
    skillDependencies: ['skill-price-feed', 'skill-web3-read'],
    learningEnabled: true,
    version: '5.2.0',
  },
  {
    id: 'agent-006',
    creator: '0x5678...efgh',
    name: 'MEV Detector',
    description: 'Identifies MEV opportunities and sandwich attacks in real-time. Alerts for arbitrage and liquidations.',
    category: 'defi',
    capabilities: [
      { id: 'cap-011', name: 'MEV Detection', description: 'Identifies MEV activity', tpmRequired: 100000, category: 'defi' },
      { id: 'cap-012', name: 'Sandwich Alert', description: 'Alerts on sandwich attacks', tpmRequired: 60000, category: 'defi' },
    ],
    slaParams: { latencyThresholdMs: 500, tpmCap: 300000, uptimeGuaranteePercent: 99.9, minStakeRequired: 5000 },
    pricing: { type: 'per_minute', pricePerMinute: 0.008 },
    qualityScore: 99,
    totalSessions: 87291,
    avgRating: 4.6,
    createdAt: Date.now() - 180 * 86400000,
    updatedAt: Date.now() - 7200000,
    status: 'active',
    skillDependencies: ['skill-onchain-reads', 'skill-price-feed', 'skill-data-processor'],
    learningEnabled: true,
    version: '2.1.0',
  },
]

interface FavoriteAgent extends Agent {
  alertEnabled: boolean
}

function FavoriteAgentCard({ agent, onRemove, alertEnabled, onAlertToggle }: {
  agent: Agent
  onRemove: () => void
  alertEnabled: boolean
  onAlertToggle: (enabled: boolean) => void
}) {
  return (
    <div className="relative">
      <AgentCard agent={agent} className="pr-24" />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
        >
          Remove
        </Button>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Switch
          id={`alert-${agent.id}`}
          checked={alertEnabled}
          onCheckedChange={onAlertToggle}
        />
        <Label htmlFor={`alert-${agent.id}`} className="text-sm cursor-pointer">
          Alert when online
        </Label>
      </div>
    </div>
  )
}

function AvailabilityAlertRow({ agent, alertEnabled, onToggle }: {
  agent: Agent
  alertEnabled: boolean
  onToggle: (enabled: boolean) => void
}) {
  const isOnline = agent.status === 'active'
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-green-500' : 'bg-gray-400')} />
        <div>
          <div className="font-medium">{agent.name}</div>
          <div className="text-sm text-muted-foreground">
            {isOnline ? (
              <span className="text-green-600">Currently online</span>
            ) : (
              <span>Offline</span>
            )}
          </div>
        </div>
      </div>
      <Switch checked={alertEnabled} onCheckedChange={onToggle} />
    </div>
  )
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteAgent[]>(
    MOCK_FAVORITES.map((a) => ({ ...a, alertEnabled: true }))
  )

  const handleRemove = (agentId: string) => {
    setFavorites((prev) => prev.filter((a) => a.id !== agentId))
  }

  const handleAlertToggle = (agentId: string, enabled: boolean) => {
    setFavorites((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, alertEnabled: enabled } : a))
    )
  }

  const agentsWithAlerts = favorites.filter((f) => f.alertEnabled)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Favorites</h1>
            <p className="text-muted-foreground">
              Your saved agents and availability alerts.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Browse agents and add them to your favorites to compare and get notified when they come online."
            icon={StarIcon}
            secondaryAction={{
              label: 'Browse Agents',
              href: '/browse-agents',
            }}
          />
        ) : (
          <>
            {/* Saved Agents Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Saved Agents ({favorites.length})</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((agent) => (
                  <FavoriteAgentCard
                    key={agent.id}
                    agent={agent}
                    alertEnabled={agent.alertEnabled}
                    onRemove={() => handleRemove(agent.id)}
                    onAlertToggle={(enabled) => handleAlertToggle(agent.id, enabled)}
                  />
                ))}
              </div>
            </div>

            {/* Availability Alerts Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Availability Alerts</CardTitle>
                  {agentsWithAlerts.length > 0 && (
                    <Badge variant="secondary">{agentsWithAlerts.length} active</Badge>
                  )}
                </div>
                <CardDescription>
                  Get notified when your favorited agents come online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {favorites.map((agent) => (
                    <AvailabilityAlertRow
                      key={agent.id}
                      agent={agent}
                      alertEnabled={agent.alertEnabled}
                      onToggle={(enabled) => handleAlertToggle(agent.id, enabled)}
                    />
                  ))}
                </div>
                {agentsWithAlerts.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      You will receive notifications when any of your {agentsWithAlerts.length} favorited agent
                      {agentsWithAlerts.length > 1 ? 's come' : ' comes'} online.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}