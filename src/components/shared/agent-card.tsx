import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EyeIcon, GitCompareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import type { Agent } from '@/types'

interface AgentCardProps {
  agent: Agent
  className?: string
  isSelected?: boolean
  onSelect?: (agent: Agent) => void
  showQuickView?: boolean
  onQuickView?: (agent: Agent) => void
}

// Quality score color mapping
function QualityBadge({ score }: { score: number }) {
  const color = score >= 90
    ? { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', text: 'rgba(16, 185, 129, 0.9)' }
    : score >= 70
    ? { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: 'rgba(245, 158, 11, 0.9)' }
    : { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: 'rgba(239, 68, 68, 0.9)' }

  return (
    <Badge
      variant="secondary"
      className="text-xs font-semibold transition-all duration-200"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
      }}
    >
      {score}
    </Badge>
  )
}

// Category badge with color coding
function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    defi: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: 'rgba(16, 185, 129, 0.85)' },
    nft: { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)', text: 'rgba(236, 72, 153, 0.85)' },
    dao: { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)', text: 'rgba(139, 92, 246, 0.85)' },
    infrastructure: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', text: 'rgba(59, 130, 246, 0.85)' },
    analytics: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: 'rgba(245, 158, 11, 0.85)' },
  }

  const style = colors[category] || { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)', text: 'rgba(139, 92, 246, 0.85)' }

  return (
    <Badge
      variant="outline"
      className="text-xs capitalize transition-all duration-200"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {category}
    </Badge>
  )
}

// Capability badge
function CapabilityBadge({ name }: { name: string }) {
  return (
    <Badge
      variant="secondary"
      className="text-xs transition-all duration-200"
      style={{
        background: 'rgba(139, 92, 246, 0.06)',
        border: '1px solid rgba(139, 92, 246, 0.12)',
        color: 'rgba(139, 92, 246, 0.8)',
      }}
    >
      {name}
    </Badge>
  )
}

export function AgentCard({ agent, className, isSelected, onSelect, showQuickView, onQuickView }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Hover animation with GSAP
  useEffect(() => {
    if (!cardRef.current) return

    const ctx = gsap.context(() => {
      if (isHovered) {
        gsap.to(cardRef.current, {
          scale: 1.02,
          y: -4,
          duration: 0.3,
          ease: 'expo.out',
        })
      } else {
        gsap.to(cardRef.current, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'expo.out',
        })
      }
    })

    return () => ctx.revert()
  }, [isHovered])

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect?.(agent)
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(agent)
  }

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick View Button - appears on hover with scale animation */}
      {showQuickView && (
        <button
          onClick={handleQuickViewClick}
          className={cn(
            'absolute top-3 right-3 z-20 p-2 rounded-lg transition-all duration-200',
            'bg-black/40 backdrop-blur-md border border-white/10',
            'hover:bg-black/60 hover:border-white/20 hover:scale-110',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <EyeIcon className="h-4 w-4 text-white" />
        </button>
      )}

      {/* Compare Checkbox - appears on hover */}
      {onSelect && (
        <div
          className={cn(
            'absolute top-3 left-3 z-20 transition-all duration-200',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
          )}
        >
          <div
            onClick={handleCompareClick}
            className={cn(
              'p-1.5 rounded-lg border cursor-pointer transition-all duration-200',
              'backdrop-blur-md',
              isSelected
                ? 'bg-violet-500/90 border-violet-400 text-white shadow-lg shadow-violet-500/20'
                : 'bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20'
            )}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <Checkbox checked={isSelected} className="pointer-events-none" />
          </div>
        </div>
      )}

      <Link href={`/agent/${agent.id}`}>
        <Card
          className={cn(
            'relative overflow-hidden transition-all duration-300 cursor-pointer',
            'border-0 shadow-none',
            className
          )}
          style={{
            background: isSelected
              ? 'rgba(139, 92, 246, 0.08)'
              : 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: isSelected
              ? '1px solid rgba(139, 92, 246, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--glass-border-radius-card)',
            boxShadow: isHovered
              ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Subtle gradient overlay on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 50%, rgba(236, 72, 153, 0.03) 100%)'
                : 'transparent',
              opacity: isHovered ? 1 : 0,
            }}
          />

          <CardHeader className="p-5 pb-3 relative">
            <div className="flex items-start gap-4">
              {/* Avatar with premium styling */}
              <div className="relative">
                <Avatar
                  className="h-14 w-14 rounded-xl transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered
                      ? '0 0 20px rgba(139, 92, 246, 0.3)'
                      : 'none',
                  }}
                >
                  <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                  <AvatarFallback
                    className="text-xl font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {agent.name[0]}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                {agent.status === 'active' && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      background: 'rgba(16, 185, 129, 0.9)',
                      borderColor: 'rgba(20, 20, 20, 0.8)',
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                {/* Name + Quality */}
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="font-semibold truncate transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-display-serif, inherit)',
                      fontSize: 'var(--font-body)',
                      color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'var(--foreground)',
                    }}
                  >
                    {agent.name}
                  </h3>
                  <QualityBadge score={agent.qualityScore} />
                </div>

                {/* Description */}
                <p
                  className="text-sm truncate transition-colors duration-200"
                  style={{
                    color: 'var(--muted-foreground)',
                    lineHeight: '1.4',
                  }}
                >
                  {agent.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-3 relative">
            {/* Category + Capabilities */}
            <div className="flex flex-wrap gap-2 mb-4">
              <CategoryBadge category={agent.category} />
              {agent.capabilities.slice(0, 2).map((cap) => (
                <CapabilityBadge key={cap.id} name={cap.name} />
              ))}
              {agent.capabilities.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  +{agent.capabilities.length - 2}
                </Badge>
              )}
            </div>

            {/* Stats grid */}
            <div
              className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div className="text-center transition-transform duration-200" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                <div
                  className="text-base font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)', color: 'rgba(139, 92, 246, 0.9)' }}
                >
                  {agent.slaParams.tpmCap >= 1000 ? `${(agent.slaParams.tpmCap / 1000).toFixed(0)}k` : agent.slaParams.tpmCap}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>TPM cap</div>
              </div>
              <div className="text-center transition-transform duration-200" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                <div
                  className="text-base font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)', color: 'rgba(59, 130, 246, 0.9)' }}
                >
                  {agent.slaParams.latencyThresholdMs}ms
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Latency</div>
              </div>
              <div className="text-center transition-transform duration-200" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                <div
                  className="text-base font-semibold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)', color: 'rgba(16, 185, 129, 0.9)' }}
                >
                  ${agent.pricing.pricePerMinute?.toFixed(4) ?? '—'}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>$/min</div>
              </div>
            </div>

            {/* Footer: sessions + rating + learning badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Sessions count */}
                <span
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {agent.totalSessions.toLocaleString()} sessions
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
                >
                  ·
                </span>
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 fill-yellow-400/80 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {agent.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Learning badge */}
              {agent.learningEnabled && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    color: 'rgba(236, 72, 153, 0.85)',
                  }}
                >
                  🧠 Learning
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export function AgentCardSkeleton() {
  return (
    <Card
      className="p-5"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--glass-border-radius-card)',
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="h-14 w-14 rounded-xl bg-muted animate-pulse"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        />
        <div className="flex-1">
          <div
            className="h-5 w-28 bg-muted animate-pulse rounded mb-2"
            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
          />
          <div
            className="h-4 w-40 bg-muted animate-pulse rounded"
            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div
          className="h-5 w-16 bg-muted animate-pulse rounded"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        />
        <div
          className="h-5 w-20 bg-muted animate-pulse rounded"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        />
      </div>
      <div
        className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg"
        style={{ background: 'rgba(255, 255, 255, 0.02)' }}
      >
        <div className="h-10 bg-muted animate-pulse rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }} />
        <div className="h-10 bg-muted animate-pulse rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }} />
        <div className="h-10 bg-muted animate-pulse rounded" style={{ background: 'rgba(255, 255, 255, 0.03)' }} />
      </div>
      <div
        className="h-4 w-24 bg-muted animate-pulse rounded"
        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
      />
    </Card>
  )
}