// GET /api/search/autocomplete - Autocomplete for agent and skill names
import { NextRequest, NextResponse } from 'next/server'
import { autocompleteAgents, autocompleteSkills } from '@/lib/search/autocomplete'
import { logSearchQuery, recordCacheHit, recordCacheHit as recordCacheHitFn } from '@/lib/search/analytics'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Query parameter (the prefix to match)
  const query = searchParams.get('q') || ''

  // Type: 'agents', 'skills', or 'all'
  const type = searchParams.get('type') || 'all'

  if (!query || query.length < 1) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required and must be at least 1 character' },
      { status: 400 }
    )
  }

  const startTime = performance.now()
  let results: string[] = []

  switch (type) {
    case 'agents':
      results = autocompleteAgents(query)
      break
    case 'skills':
      results = autocompleteSkills(query)
      break
    case 'all':
    default:
      // Get both and combine
      const agentResults = autocompleteAgents(query)
      const skillResults = autocompleteSkills(query)
      results = [...agentResults, ...skillResults]
      break
  }

  const searchTimeMs = Math.round(performance.now() - startTime)

  // Log analytics
  logSearchQuery(
    query,
    { type },
    results.length,
    searchTimeMs,
    'autocomplete'
  )

  return NextResponse.json(
    {
      results,
      query,
      type,
      searchTimeMs,
    },
    {
      status: 200,
      headers: {
        'X-Search-Time-Ms': String(searchTimeMs),
      },
    }
  )
}
