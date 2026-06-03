import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Agent } from '@/types'

interface AgentCardProps {
  agent: Agent
  className?: string
}

function QualityBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
  return (
    <Badge variant="secondary" className={cn('text-xs', color)}>
      {score}
    </Badge>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline" className="text-xs capitalize">
      {category}
    </Badge>
  )
}

export function AgentCard({ agent, className }: AgentCardProps) {
  return (
    <Link href={`/agent/${agent.id}`}>
      <Card className={cn('hover:border-violet-300 transition-all hover:shadow-md cursor-pointer', className)}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              <AvatarFallback className="bg-violet-100 text-violet-700 text-lg">{agent.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{agent.name}</h3>
                <QualityBadge score={agent.qualityScore} />
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">{agent.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <CategoryBadge category={agent.category} />
            {agent.capabilities.slice(0, 2).map((cap) => (
              <Badge key={cap.id} variant="secondary" className="text-xs bg-violet-50 text-violet-700">
                {cap.name}
              </Badge>
            ))}
            {agent.capabilities.length > 2 && (
              <Badge variant="secondary" className="text-xs">+{agent.capabilities.length - 2}</Badge>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-sm font-semibold">{agent.slaParams.tpmCap.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">TPM cap</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{agent.slaParams.latencyThresholdMs}ms</div>
              <div className="text-xs text-muted-foreground">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{agent.pricing.pricePerMinute?.toFixed(4) ?? '—'}</div>
              <div className="text-xs text-muted-foreground">$/min</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">{agent.totalSessions} sessions</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">★ {agent.avgRating.toFixed(1)}</span>
            </div>
            {agent.learningEnabled && (
              <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">🧠 Learning</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AgentCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-8 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
    </Card>
  )
}