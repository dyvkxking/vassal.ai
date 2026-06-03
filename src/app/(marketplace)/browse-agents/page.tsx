'use client'

import { useState } from 'react'
import { AgentCard, AgentCardSkeleton } from '@/components/shared/agent-card'
import { FilterPanel, FilterSheet } from '@/components/shared/filter-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT } from '@/constants'
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
    // Search
    if (filters.search && !agent.name.toLowerCase().includes(filters.search.toLowerCase()) && !agent.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    // Category
    if (filters.categories.length > 0 && !filters.categories.includes(agent.category)) return false
    // TPM
    if (agent.slaParams.tpmCap < filters.tpmRange[0] || agent.slaParams.tpmCap > filters.tpmRange[1]) return false
    // Latency
    if (agent.slaParams.latencyThresholdMs > filters.latencyMax) return false
    // Price
    const price = agent.pricing.pricePerMinute ?? 0
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
    // Quality
    if (agent.qualityScore < filters.minQualityScore) return false
    // Learning
    if (filters.learningEnabled && !agent.learningEnabled) return false
    // Availability
    if (filters.availabilityOnly && agent.status !== 'active') return false
    return true
  })

  // Sort
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
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortKey, setSortKey] = useState<SortKey>('quality')
  const [page, setPage] = useState(1)

  const filtered = filterAndSort(MOCK_AGENTS, filters, sortKey)
  const paginated = filtered.slice(0, page * PAGE_SIZE_DEFAULT)
  const hasMore = filtered.length > paginated.length

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Agent Marketplace</h1>
            <p className="text-muted-foreground">
              {filtered.length} agents available — browse, compare, and rent specialized AI agents with on-chain SLA guarantees.
            </p>
          </div>
        </div>
      </div>

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
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-6">
              {/* Mobile Filter Button */}
              <FilterSheet filters={filters} onChange={setFilters} />

              {/* Search */}
              <Input
                placeholder="Search agents..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="max-w-xs"
              />

              <div className="flex-1" />

              {/* Sort */}
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="w-[180px]">
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

            {/* Active Filters Tags */}
            {(filters.categories.length > 0 || filters.minQualityScore > 0 || filters.learningEnabled) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== cat) })}>
                    {cat} ✕
                  </Badge>
                ))}
                {filters.minQualityScore > 0 && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilters({ ...filters, minQualityScore: 0 })}>
                    Min score: {filters.minQualityScore} ✕
                  </Badge>
                )}
                {filters.learningEnabled && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilters({ ...filters, learningEnabled: false })}>
                    Self-Learning ✕
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs">
                  Clear all
                </Button>
              </div>
            )}

            {/* Grid */}
            {paginated.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear Filters</Button>
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                  Load More ({filtered.length - paginated.length} remaining)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}