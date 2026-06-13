'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentCard, AgentCardSkeleton } from '@/components/shared/agent-card'
import { FilterPanel, FilterSheet } from '@/components/shared/filter-panel'
import { ComparisonTray } from '@/components/shared/comparison-tray'
import { QuickViewModal } from '@/components/shared/quick-view-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAgents } from '@/hooks/use-agents'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useLenisWithMobileSupport } from '@/hooks/use-lenis'
import { usePageHeaderAnimations } from '@/components/marketplace/browse-agents-animations'
import type { Agent } from '@/types'

interface FilterState {
  search: string
  categories: string[]
  tpmRange: [number, number]
  latencyMax: number
  priceRange: [number, number]
  minQualityScore: number
  learningEnabled: boolean
  availabilityOnly: boolean
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  tpmRange: [1000, 500000],
  latencyMax: 10000,
  priceRange: [0, 1],
  minQualityScore: 0,
  learningEnabled: false,
  availabilityOnly: false,
}

type SortKey = 'quality' | 'price_asc' | 'price_desc' | 'sessions' | 'newest'

function filterAndSort(agents: Agent[], filters: FilterState, sortKey: SortKey): Agent[] {
  let result = agents.filter((agent) => {
    if (filters.search && !agent.name.toLowerCase().includes(filters.search.toLowerCase()) && !agent.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.categories.length > 0 && !filters.categories.includes(agent.category)) return false
    if (agent.slaParams.tpmCap < filters.tpmRange[0] || agent.slaParams.tpmCap > filters.tpmRange[1]) return false
    if (agent.slaParams.latencyThresholdMs > filters.latencyMax) return false
    const price = agent.pricing.pricePerMinute ?? 0
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
    if (agent.qualityScore < filters.minQualityScore) return false
    if (filters.learningEnabled && !agent.learningEnabled) return false
    if (filters.availabilityOnly && agent.status !== 'active') return false
    return true
  })

  switch (sortKey) {
    case 'quality':
      result = [...result].sort((a, b) => b.qualityScore - a.qualityScore)
      break
    case 'price_asc':
      result = [...result].sort((a, b) => (a.pricing.pricePerMinute ?? 0) - (b.pricing.pricePerMinute ?? 0))
      break
    case 'price_desc':
      result = [...result].sort((a, b) => (b.pricing.pricePerMinute ?? 0) - (a.pricing.pricePerMinute ?? 0))
      break
    case 'sessions':
      result = [...result].sort((a, b) => b.totalSessions - a.totalSessions)
      break
    case 'newest':
      result = [...result].sort((a, b) => b.createdAt - a.createdAt)
      break
  }

  return result
}

export default function BrowseAgentsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortKey, setSortKey] = useState<SortKey>('quality')
  const [page, setPage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize Lenis smooth scroll with mobile consideration
  useLenisWithMobileSupport()

  // Initialize page header animations
  usePageHeaderAnimations({ enabled: true })

  // Comparison state
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [quickViewAgent, setQuickViewAgent] = useState<Agent | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Fetch agents from API
  const { data, isLoading, error } = useAgents({
    category: filters.categories[0],
    status: filters.availabilityOnly ? 'active' : undefined,
    search: filters.search || undefined,
    page,
    pageSize: PAGE_SIZE_DEFAULT,
  })

  const agents = data?.data ?? []
  const total = data?.total ?? 0

  // Apply client-side sorting and additional filtering
  const filtered = filterAndSort(agents, filters, sortKey)
  const hasMore = total > agents.length

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgents((prev) => {
      const isSelected = prev.some((a) => a.id === agent.id)
      if (isSelected) {
        return prev.filter((a) => a.id !== agent.id)
      }
      if (prev.length >= 4) return prev
      return [...prev, agent]
    })
  }

  const handleRemoveAgent = (agentId: string) => {
    setSelectedAgents((prev) => prev.filter((a) => a.id !== agentId))
  }

  const handleClearAll = () => {
    setSelectedAgents([])
  }

  const handleCompare = () => {
    const agentIds = selectedAgents.map((a) => a.id).join(',')
    router.push(`/compare?agents=${agentIds}`)
  }

  const handleQuickView = (agent: Agent) => {
    setQuickViewAgent(agent)
    setIsQuickViewOpen(true)
  }

  const handleRent = () => {
    if (quickViewAgent) {
      router.push(`/agent/${quickViewAgent.id}?rent=true`)
    }
  }

  const handleViewDetail = () => {
    if (quickViewAgent) {
      router.push(`/agent/${quickViewAgent.id}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ================================================
          PAGE HEADER — Premium Design DNA
          ================================================ */}
      <div className="pw-page-header relative overflow-hidden">
        {/* Background canvas layer — WebGL blend placeholder */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 blend-color-dodge"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)'
            }}
          />
        </div>

        {/* Decorative hairline divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)', opacity: 0.2 }}
        />

        <div className="container relative py-12 md:py-16">
          {/* Eyebrow label */}
          <div className="pw-page-header-eyebrow inline-flex items-center gap-2 mb-4 opacity-0">
            <span
              className="inline-block w-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6))' }}
            />
            <span
              className="text-xs uppercase tracking-[3px] font-medium"
              style={{ color: 'rgba(139, 92, 246, 0.8)', letterSpacing: '3px' }}
            >
              Decentralized AI Marketplace
            </span>
          </div>

          {/* Main title — Display Serif */}
          <h1
            className="pw-page-header-title font-bold mb-3 opacity-0"
            style={{
              fontFamily: 'var(--font-display-serif, inherit)',
              fontSize: 'clamp(2.5rem, 6dvw, 5em)',
              lineHeight: '1em',
              letterSpacing: '-0.02em',
            }}
          >
            Agent Marketplace
          </h1>

          {/* Subtitle — Body Light */}
          <p
            className="pw-page-header-subtitle text-lg md:text-xl max-w-2xl mb-6 opacity-0"
            style={{
              fontFamily: 'var(--font-body-light, inherit)',
              lineHeight: '1.15em',
              color: 'var(--muted-foreground)',
            }}
          >
            Browse, compare, and rent specialized AI agents with on-chain SLA guarantees.
            Staked performance ensures reliability.
          </p>

          {/* Stats row */}
          <div
            className="pw-page-header-stats inline-flex items-center gap-6 opacity-0"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                {isLoading ? '...' : total}
              </span>
              <span className="text-sm text-muted-foreground">agents available</span>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border)', opacity: 0.3 }} />
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                99.2%
              </span>
              <span className="text-sm text-muted-foreground">avg uptime</span>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border)', opacity: 0.3 }} />
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
              >
                $0.002
              </span>
              <span className="text-sm text-muted-foreground">avg price/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================
          MAIN CONTENT — Toolbar + Grid
          ================================================ */}
      <div className="container flex-1 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-[280px] shrink-0 md:block">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ================================================
                TOOLBAR — Glass morphism enhancement
                ================================================ */}
            <div
              className="pw-toolbar relative flex items-center gap-4 mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Mobile Filter Button */}
              <div className="pw-filter-sheet-trigger opacity-0">
                <FilterSheet filters={filters} onChange={setFilters} />
              </div>

              {/* Search — Glass input */}
              <div
                className="pw-toolbar-search relative flex-1 max-w-xs opacity-0"
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  placeholder="Search agents..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </div>

              <div className="flex-1" />

              {/* Sort — Glass select */}
              <div className="pw-toolbar-sort opacity-0">
                <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                  <SelectTrigger
                    className="w-[180px]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality Score</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="sessions">Most Sessions</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ================================================
                ACTIVE FILTERS TAGS
                ================================================ */}
            {(filters.categories.length > 0 || filters.minQualityScore > 0 || filters.learningEnabled) && (
              <div className="pw-filter-tags-container flex flex-wrap gap-2 mb-6">
                {filters.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="pw-filter-tag cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: 'rgba(139, 92, 246, 0.9)',
                    }}
                    onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== cat) })}
                  >
                    {cat} ✕
                  </Badge>
                ))}
                {filters.minQualityScore > 0 && (
                  <Badge
                    variant="secondary"
                    className="pw-filter-tag cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: 'rgba(139, 92, 246, 0.9)',
                    }}
                    onClick={() => setFilters({ ...filters, minQualityScore: 0 })}
                  >
                    Min score: {filters.minQualityScore} ✕
                  </Badge>
                )}
                {filters.learningEnabled && (
                  <Badge
                    variant="secondary"
                    className="pw-filter-tag cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: 'rgba(139, 92, 246, 0.9)',
                    }}
                    onClick={() => setFilters({ ...filters, learningEnabled: false })}
                  >
                    Self-Learning ✕
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* ================================================
                AGENT GRID — Premium spacing + entrance animation
                ================================================ */}
            {isLoading ? (
              <div
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                style={{ gap: 'var(--grid-gap-desktop)' }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <AgentCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  Failed to load agents
                </h3>
                <p className="text-muted-foreground mb-6">
                  Please try again later.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="btn-ghost-transition"
                >
                  Retry
                </Button>
              </div>
            ) : filtered.length > 0 ? (
              <div
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                style={{ gap: 'var(--grid-gap-desktop)' }}
              >
                {filtered.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="pw-agent-card"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    <AgentCard
                      agent={agent}
                      isSelected={selectedAgents.some((a) => a.id === agent.id)}
                      onSelect={handleSelectAgent}
                      showQuickView={true}
                      onQuickView={handleQuickView}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className="text-5xl mb-4"
                  style={{
                    filter: 'grayscale(1) opacity(0.5)',
                  }}
                >
                  🔍
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-display-serif, inherit)' }}
                >
                  No agents found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="btn-ghost-transition"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* ================================================
                LOAD MORE — Premium button styling
                ================================================ */}
            {hasMore && !isLoading && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 btn-ghost-transition"
                  style={{
                    borderRadius: 'var(--glass-border-radius-card)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span className="mr-2">Load More</span>
                  <span className="text-muted-foreground">
                    ({total - agents.length} remaining)
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================
          COMPARISON TRAY
          ================================================ */}
      <ComparisonTray
        selectedAgents={selectedAgents}
        onRemove={handleRemoveAgent}
        onClearAll={handleClearAll}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        agent={quickViewAgent}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onRent={handleRent}
        onCompare={() => {
          if (quickViewAgent) {
            handleSelectAgent(quickViewAgent)
            setIsQuickViewOpen(false)
          }
        }}
        onViewDetail={handleViewDetail}
      />
    </div>
  )
}