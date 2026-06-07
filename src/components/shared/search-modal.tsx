'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MOCK_AGENTS, MOCK_SKILLS, MOCK_PROPOSALS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Agent, Skill, Proposal } from '@/types'
import { SearchIcon, ClockIcon, XIcon, ArrowUpIcon, ArrowDownIcon, HashIcon, BriefcaseIcon, FileTextIcon, LayersIcon } from 'lucide-react'

type SearchResultType = 'agent' | 'skill' | 'proposal' | 'provider'

interface SearchResult {
  id: string
  type: SearchResultType
  name: string
  description: string
  icon: React.ReactNode
  badge?: string
  href: string
}

const RECENT_SEARCHES_KEY = 'vassal_recent_searches'
const MAX_RECENT_SEARCHES = 5

function getTypeIcon(type: SearchResultType) {
  switch (type) {
    case 'agent':
      return <BriefcaseIcon className="h-4 w-4" />
    case 'skill':
      return <LayersIcon className="h-4 w-4" />
    case 'proposal':
      return <FileTextIcon className="h-4 w-4" />
    case 'provider':
      return <HashIcon className="h-4 w-4" />
  }
}

function getTypeBadgeVariant(type: SearchResultType): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (type) {
    case 'agent':
      return 'default'
    case 'skill':
      return 'secondary'
    case 'proposal':
      return 'outline'
    case 'provider':
      return 'destructive'
  }
}

export function SearchModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search results
  const searchResults = useCallback((): SearchResult[] => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    // Search agents
    MOCK_AGENTS.forEach((agent) => {
      if (
        agent.name.toLowerCase().includes(lowerQuery) ||
        agent.description.toLowerCase().includes(lowerQuery) ||
        agent.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: agent.id,
          type: 'agent',
          name: agent.name,
          description: agent.description.slice(0, 80) + (agent.description.length > 80 ? '...' : ''),
          icon: <BriefcaseIcon className="h-4 w-4" />,
          badge: `v${agent.version}`,
          href: `/agent/${agent.id}`,
        })
      }
    })

    // Search skills
    MOCK_SKILLS.forEach((skill) => {
      if (
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: skill.id,
          type: 'skill',
          name: skill.name,
          description: skill.description.slice(0, 80) + (skill.description.length > 80 ? '...' : ''),
          icon: <LayersIcon className="h-4 w-4" />,
          badge: skill.version,
          href: `/skills/${skill.id}`,
        })
      }
    })

    // Search proposals
    MOCK_PROPOSALS.forEach((proposal) => {
      if (
        proposal.title.toLowerCase().includes(lowerQuery) ||
        proposal.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: proposal.id,
          type: 'proposal',
          name: proposal.title,
          description: proposal.description.slice(0, 80) + (proposal.description.length > 80 ? '...' : ''),
          icon: <FileTextIcon className="h-4 w-4" />,
          badge: proposal.status,
          href: `/governance/proposal/${proposal.id}`,
        })
      }
    })

    // Search providers (mock)
    if (lowerQuery.includes('provider') || lowerQuery.includes('node')) {
      results.push({
        id: 'provider-search',
        type: 'provider',
        name: 'Provider Directory',
        description: 'Browse provider nodes and their status',
        icon: <HashIcon className="h-4 w-4" />,
        href: '/providers',
      })
    }

    return results.slice(0, 10) // Limit results
  }, [query])

  // Group results by type
  const groupedResults = useCallback(() => {
    const results = searchResults()
    const groups: Record<SearchResultType, SearchResult[]> = {
      agent: [],
      skill: [],
      proposal: [],
      provider: [],
    }
    results.forEach((r) => groups[r.type].push(r))
    return groups
  }, [searchResults])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = searchResults()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Save recent search and navigate
  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(newRecent)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent))

    setIsOpen(false)
    router.push(result.href)
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const results = searchResults()
  const groups = groupedResults()

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b">
            <SearchIcon className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              placeholder="Search agents, skills, proposals..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 text-base h-12"
            />
            <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">esc</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {/* Recent Searches (when no query) */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={clearRecentSearches}>
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(search)
                      inputRef.current?.focus()
                    }}
                    className="flex items-center gap-3 w-full px-2 py-2 rounded-md hover:bg-muted text-left"
                  >
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {query.trim() && results.length > 0 && (
              <div className="space-y-4">
                {Object.entries(groups).map(([type, items]) => {
                  if (items.length === 0) return null
                  return (
                    <div key={type}>
                      <div className="px-2 py-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {type}s
                        </span>
                      </div>
                      {items.map((result) => {
                        const globalIndex = results.findIndex((r) => r.id === result.id)
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'flex items-start gap-3 w-full px-2 py-3 rounded-md text-left transition-colors',
                              globalIndex === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                            )}
                          >
                            <div className="mt-0.5 p-1.5 rounded-md bg-muted shrink-0">
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{result.name}</span>
                                <Badge variant={getTypeBadgeVariant(result.type as SearchResultType)} className="text-xs">
                                  {result.badge}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {result.description}
                              </p>
                            </div>
                            {globalIndex === selectedIndex && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                <span>Enter</span>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {query.trim() && results.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
                <p className="text-xs text-muted-foreground mt-1">Try different keywords or check spelling</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowUpIcon className="h-3 w-3" />
              <ArrowDownIcon className="h-3 w-3" />
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-muted px-1 rounded">Enter</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-muted px-1 rounded">esc</kbd>
              to close
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}