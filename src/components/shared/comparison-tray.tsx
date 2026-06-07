'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { XIcon, GitCompareIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import type { Agent } from '@/types'

interface ComparisonTrayProps {
  selectedAgents: Agent[]
  onRemove: (agentId: string) => void
  onClearAll: () => void
}

export function ComparisonTray({ selectedAgents, onRemove, onClearAll }: ComparisonTrayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const router = useRouter()
  const trayRef = useRef<HTMLDivElement>(null)

  // Show tray when 2+ agents selected with slide-up animation
  useEffect(() => {
    const shouldShow = selectedAgents.length >= 2

    if (shouldShow && !isVisible) {
      setIsAnimatingIn(true)
      setIsVisible(true)

      // GSAP slide-up animation
      if (trayRef.current) {
        gsap.fromTo(
          trayRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'expo.out',
            onComplete: () => setIsAnimatingIn(false),
          }
        )
      }
    } else if (!shouldShow && isVisible) {
      // GSAP slide-down animation
      if (trayRef.current) {
        gsap.to(trayRef.current, {
          y: 100,
          opacity: 0,
          duration: 0.3,
          ease: 'expo.in',
          onComplete: () => {
            setIsVisible(false)
            setIsAnimatingIn(false)
          },
        })
      }
    }
  }, [selectedAgents.length, isVisible])

  const handleCompare = () => {
    const agentIds = selectedAgents.map((a) => a.id).join(',')
    router.push(`/compare?agents=${agentIds}`)
  }

  // Don't render if not visible
  if (!isVisible) return null

  return (
    <>
      {/* Bottom Fixed Tray - Desktop */}
      <div
        ref={trayRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 transition-all duration-300',
          'hidden md:block'
        )}
        style={{
          transform: 'translateY(100px)',
          opacity: 0,
        }}
      >
        {/* Glass backdrop with gradient border top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(15, 15, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 -20px 60px rgba(139, 92, 246, 0.1), 0 -4px 20px rgba(0, 0, 0, 0.3)',
          }}
        />

        {/* Content */}
        <div className="container relative py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Agent Thumbnails */}
            <div className="flex items-center gap-4">
              {/* Count badge */}
              <div
                className="flex items-center justify-center h-10 w-10 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  {selectedAgents.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedAgents.slice(0, 4).map((agent, index) => (
                  <div
                    key={agent.id}
                    className="relative group"
                    style={{
                      zIndex: 4 - index,
                      marginLeft: index > 0 ? '-8px' : 0,
                    }}
                  >
                    <div
                      className="relative flex items-center gap-2 rounded-xl px-3 py-2 pr-8 transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={agent.avatarUrl} />
                        <AvatarFallback
                          className="text-xs"
                          style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                            color: 'white',
                          }}
                        >
                          {agent.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {agent.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs ml-1"
                        style={{
                          background: 'rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.25)',
                          color: 'rgba(139, 92, 246, 0.9)',
                        }}
                      >
                        {agent.qualityScore}
                      </Badge>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemove(agent.id)
                        }}
                        className={cn(
                          'absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full',
                          'bg-black/60 backdrop-blur-sm',
                          'hover:bg-violet-500/80 text-white/70 hover:text-white',
                          'transition-all duration-200 opacity-0 group-hover:opacity-100',
                          'hover:scale-110'
                        )}
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedAgents.length > 4 && (
                  <Badge
                    variant="secondary"
                    className="text-xs ml-2"
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      color: 'rgba(245, 158, 11, 0.85)',
                    }}
                  >
                    +{selectedAgents.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--glass-border-radius-card)',
                }}
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleCompare}
                disabled={selectedAgents.length < 2}
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
                  border: 'none',
                  borderRadius: 'var(--glass-border-radius-card)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                <span className="relative z-10 flex items-center">
                  <GitCompareIcon className="h-4 w-4 mr-2" />
                  Compare Now
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Sheet-based approach with glass styling */}
      <div className={cn('fixed bottom-0 left-0 right-0 z-50 md:hidden')}>
        <div
          style={{
            background: 'rgba(15, 15, 15, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 -10px 40px rgba(139, 92, 246, 0.15)',
          }}
        >
          <div className="container py-3 flex items-center justify-between gap-4">
            {/* Count + agents */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center h-9 w-9 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <span className="text-sm font-bold">{selectedAgents.length}</span>
              </div>
              <div className="flex items-center -space-x-2">
                {selectedAgents.slice(0, 3).map((agent) => (
                  <Avatar
                    key={agent.id}
                    className="h-7 w-7 border-2 border-background"
                    style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                  >
                    <AvatarImage src={agent.avatarUrl} />
                    <AvatarFallback className="text-xs">{agent.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  }
                >
                  View
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-auto max-h-[60vh]"
                  style={{
                    background: 'rgba(15, 15, 15, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '20px 20px 0 0',
                  }}
                >
                  <SheetHeader>
                    <SheetTitle
                      className="text-lg font-semibold"
                      style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                    >
                      Compare Agents ({selectedAgents.length})
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-3 overflow-y-auto max-h-[40vh]">
                    {selectedAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 rounded-xl">
                            <AvatarImage src={agent.avatarUrl} />
                            <AvatarFallback
                              style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                                color: 'white',
                              }}
                            >
                              {agent.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p
                              className="text-sm"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              {agent.category} · Score {agent.qualityScore}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(agent.id)}
                          className="p-2 rounded-full transition-colors"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'rgba(239, 68, 68, 0.8)',
                          }}
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    className="p-4 border-t flex gap-3"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <Button
                      variant="outline"
                      onClick={onClearAll}
                      className="flex-1"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={handleCompare}
                      disabled={selectedAgents.length < 2}
                      className="flex-1"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
                        border: 'none',
                      }}
                    >
                      Compare Now
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                size="sm"
                onClick={handleCompare}
                disabled={selectedAgents.length < 2}
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
                  border: 'none',
                  borderRadius: 'var(--glass-border-radius-card)',
                }}
              >
                <GitCompareIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}