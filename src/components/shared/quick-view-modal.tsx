'use client'

import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StarIcon, ZapIcon, ClockIcon, ActivityIcon, TrendingUpIcon, EyeIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import type { Agent } from '@/types'

interface QuickViewModalProps {
  agent: Agent | null
  isOpen: boolean
  onClose: () => void
  onRent: () => void
  onCompare: () => void
  onViewDetail: () => void
}

function QualityScore({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 90)
      return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', text: 'rgba(16, 185, 129, 0.9)' }
    if (s >= 70)
      return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: 'rgba(245, 158, 11, 0.9)' }
    return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: 'rgba(239, 68, 68, 0.9)' }
  }
  const color = getColor(score)
  return (
    <Badge
      className="font-semibold text-sm px-2 py-1 transition-all duration-200"
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

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className="h-4 w-4"
          fill={i < fullStars ? 'rgba(245, 158, 11, 0.9)' : i === fullStars && hasHalf ? 'rgba(245, 158, 11, 0.45)' : 'transparent'}
          style={{
            color: i < fullStars ? 'rgba(245, 158, 11, 0.9)' : i === fullStars && hasHalf ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
  subtext,
  accent,
}: {
  icon: React.ComponentType<{className?: string}>
  label: string
  value: string
  subtext?: string
  accent?: string
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-200 hover:scale-110"
        style={{
          background: accent ? `${accent}15` : 'rgba(139, 92, 246, 0.1)',
          color: accent || 'rgba(139, 92, 246, 0.9)',
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
        >
          {value}
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </p>
        {subtext && (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export function QuickViewModal({ agent, isOpen, onClose, onRent, onCompare, onViewDetail }: QuickViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // GSAP open/close animation
  useEffect(() => {
    if (!contentRef.current) return

    if (isOpen) {
      // Animate in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'expo.out',
        }
      )

      // Stagger children animation
      gsap.fromTo(
        '.pw-modal-section',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'expo.out',
          stagger: 0.06,
          delay: 0.1,
        }
      )
    }

    return () => {
      gsap.killTweensOf(contentRef.current)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!agent) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={modalRef}
        className="sm:max-w-[480px] p-0 overflow-hidden"
        style={{
          background: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)',
        }}
      >
        {/* Header with avatar and name */}
        <DialogHeader
          className="p-6 pb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Decorative gradient orb */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          <div className="flex items-start gap-4 relative">
            {/* Avatar with premium styling */}
            <div className="relative">
              <Avatar
                className="h-16 w-16 rounded-xl"
                style={{
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.25)',
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                <AvatarFallback
                  className="text-2xl font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                    color: 'white',
                  }}
                >
                  {agent.name[0]}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              {agent.status === 'active' && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                  style={{
                    background: 'rgba(16, 185, 129, 0.9)',
                    borderColor: 'rgba(15, 15, 15, 0.8)',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                  }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <DialogTitle
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                {agent.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="text-xs capitalize"
                  style={{
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    color: 'rgba(139, 92, 246, 0.85)',
                  }}
                >
                  {agent.category}
                </Badge>
                <QualityScore score={agent.qualityScore} />
              </div>
              <div className="mt-2">
                <RatingStars rating={agent.avgRating} />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body content */}
        <div className="px-6 py-5 space-y-5" ref={contentRef}>
          {/* Description */}
          <div className="pw-modal-section">
            <p
              className="text-sm leading-relaxed"
              style={{
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}
            >
              {agent.description}
            </p>
          </div>

          {/* Key Stats */}
          <div className="pw-modal-section grid grid-cols-2 gap-3">
            <StatItem
              icon={ZapIcon}
              label="TPM Cap"
              value={agent.slaParams.tpmCap >= 1000 ? `${(agent.slaParams.tpmCap / 1000).toFixed(0)}k` : agent.slaParams.tpmCap.toString()}
              accent="rgba(139, 92, 246, 1)"
            />
            <StatItem
              icon={ClockIcon}
              label="Latency"
              value={`${agent.slaParams.latencyThresholdMs}ms`}
              accent="rgba(59, 130, 246, 1)"
            />
            <StatItem
              icon={ActivityIcon}
              label="Uptime"
              value={`${agent.slaParams.uptimeGuaranteePercent}%`}
              accent="rgba(16, 185, 129, 1)"
            />
            <StatItem
              icon={TrendingUpIcon}
              label="Sessions"
              value={agent.totalSessions >= 1000 ? `${(agent.totalSessions / 1000).toFixed(1)}k` : agent.totalSessions.toString()}
              accent="rgba(245, 158, 11, 1)"
            />
          </div>

          <Separator style={{ opacity: 0.1 }} />

          {/* Pricing */}
          <div className="pw-modal-section flex items-center justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-wider mb-1"
                style={{ color: 'var(--muted-foreground)', letterSpacing: '2px' }}
              >
                Price per minute
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: 'var(--font-display-serif, inherit)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ${agent.pricing.pricePerMinute?.toFixed(4) ?? '—'}
              </p>
            </div>
            {agent.learningEnabled && (
              <Badge
                variant="secondary"
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  color: 'rgba(236, 72, 153, 0.85)',
                  padding: '8px 12px',
                }}
              >
                🧠 Self-Learning
              </Badge>
            )}
          </div>

          {/* Capabilities preview */}
          <div className="pw-modal-section">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'var(--muted-foreground)', letterSpacing: '2px' }}
            >
              Key Capabilities
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.slice(0, 3).map((cap) => (
                <Badge
                  key={cap.id}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    color: 'rgba(139, 92, 246, 0.8)',
                  }}
                >
                  {cap.name}
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="p-6 pt-4 flex flex-col gap-2 relative"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Gradient accent line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)',
            }}
          />

          <div className="flex gap-2">
            <Button
              onClick={onRent}
              className="flex-1 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
                border: 'none',
                borderRadius: 'var(--glass-border-radius-card)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              }}
            >
              <span className="relative z-10">Rent Now</span>
              {/* Hover shimmer effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transform: 'translateX(-100%)',
                }}
              />
            </Button>
            <Button
              variant="outline"
              onClick={onCompare}
              className="flex-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--glass-border-radius-card)',
              }}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Compare
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={onViewDetail}
            className="w-full"
            style={{
              color: 'var(--muted-foreground)',
              borderRadius: 'var(--glass-border-radius-card)',
            }}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}