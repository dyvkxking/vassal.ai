'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Command, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MOCK_AGENTS } from '@/lib/mock-data'

interface SearchResult {
  id: string
  type: 'agent' | 'skill' | 'proposal'
  title: string
  description: string
  link: string
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  // Cmd+K keyboard shortcut
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Mock search - filter agents by query
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const agentResults: SearchResult[] = MOCK_AGENTS
      .filter(agent =>
        agent.name.toLowerCase().includes(lowerQuery) ||
        agent.description.toLowerCase().includes(lowerQuery) ||
        agent.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map(agent => ({
        id: agent.id,
        type: 'agent' as const,
        title: agent.name,
        description: agent.description,
        link: `/agent/${agent.id}`,
      }))

    setResults(agentResults)
  }, [query])

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline">Search agents, skills, proposals...</span>
        <span className="inline lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      {/* Search Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-[600px]">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search agents, skills, proposals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>Type at least 2 characters to search</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setQuery('DeFi')}>
                    DeFi
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setQuery('NFT')}>
                    NFT
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setQuery('Analytics')}>
                    Analytics
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setQuery('Oracle')}>
                    Oracle
                  </Badge>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                    onClick={() => {
                      // Navigate to result
                      window.location.href = result.link
                      setOpen(false)
                    }}
                  >
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {result.type}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{result.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd>
                  <span>to select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
                  <span>to close</span>
                </span>
              </div>
              <span>Vassal.ai Search</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}