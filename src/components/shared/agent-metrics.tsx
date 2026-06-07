'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Agent } from '@/types'
import { StarIcon, ZapIcon, ClockIcon, ActivityIcon, TrendingUpIcon, CoinsIcon } from 'lucide-react'

interface AgentMetricsProps {
  agent: Agent
  showCompact?: boolean
  className?: string
}

function QualityScoreBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 95) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (s >= 85) return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    if (s >= 70) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  return (
    <Badge variant="outline" className={cn('border font-medium', getColor(score))}>
      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {score}
    </Badge>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('w-3 h-3', star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function AgentMetrics({ agent, showCompact = false, className }: AgentMetricsProps) {
  if (showCompact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <QualityScoreBadge score={agent.qualityScore} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ZapIcon className="h-3 w-3" />
          <span>{(agent.slaParams.tpmCap / 1000).toFixed(0)}K TPM</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ClockIcon className="h-3 w-3" />
          <span>{agent.slaParams.latencyThresholdMs}ms</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ActivityIcon className="h-3 w-3" />
          <span>{agent.slaParams.uptimeGuaranteePercent}% uptime</span>
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Quality Score */}
          <div className="text-center">
            <QualityScoreBadge score={agent.qualityScore} />
            <div className="text-xs text-muted-foreground mt-1">Quality</div>
          </div>

          {/* TPM */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ZapIcon className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{agent.slaParams.tpmCap.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">TPM Cap</div>
          </div>

          {/* Latency */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ClockIcon className="h-4 w-4 text-amber-500" />
              <span className="font-semibold">{agent.slaParams.latencyThresholdMs}</span>
              <span className="text-xs text-muted-foreground">ms</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Latency</div>
          </div>

          {/* Uptime */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ActivityIcon className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold">{agent.slaParams.uptimeGuaranteePercent}%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Uptime</div>
          </div>

          {/* Sessions */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUpIcon className="h-4 w-4 text-purple-500" />
              <span className="font-semibold">{agent.totalSessions.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Sessions</div>
          </div>

          {/* Price */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CoinsIcon className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">
                {agent.pricing.type === 'per_minute' && `$${agent.pricing.pricePerMinute}`}
                {agent.pricing.type === 'per_second' && `$${agent.pricing.pricePerSecond}`}
                {agent.pricing.type === 'flat_rate' && `$${agent.pricing.flatPrice}`}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {agent.pricing.type === 'per_minute' && '$/min'}
              {agent.pricing.type === 'per_second' && '$/sec'}
              {agent.pricing.type === 'flat_rate' && 'flat'}
            </div>
          </div>
        </div>

        {/* Secondary metrics row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(agent.avgRating)} />
            <span className="text-sm font-medium">{agent.avgRating}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {agent.category}
          </div>
          {agent.learningEnabled && (
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-500">
              🧠 Learning
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}