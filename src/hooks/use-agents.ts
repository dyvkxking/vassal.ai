import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Agent } from '@/types'

const API_BASE = '/api'

export interface AgentFilters {
  category?: string
  status?: string
  search?: string
  minRating?: number
  maxPrice?: number
  page?: number
  pageSize?: number
}

export interface AgentListResponse {
  data: Agent[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useAgents(filters?: AgentFilters) {
  const params = new URLSearchParams()
  if (filters?.category) params.set('category', filters.category)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.search) params.set('search', filters.search)
  if (filters?.minRating) params.set('minRating', String(filters.minRating))
  if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))

  return useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/agents?${params}`)
      if (!res.ok) throw new Error('Failed to fetch agents')
      return res.json() as Promise<AgentListResponse>
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useAgentById(id: string | null) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`${API_BASE}/agents/${id}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch agent')
      }
      const json = await res.json()
      return json.data as Agent
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

export interface CreateAgentInput {
  creator: string
  name: string
  description: string
  category: string
  capabilities: Array<{
    id?: string
    name: string
    description: string
    tpmRequired: number
    category: string
  }>
  slaParams: {
    latencyThresholdMs: number
    tpmCap: number
    uptimeGuaranteePercent: number
    minStakeRequired: number
  }
  pricing: {
    type: 'per_minute' | 'per_second' | 'flat_rate' | 'tiered'
    pricePerMinute?: number
    pricePerSecond?: number
    flatPrice?: number
    tiers?: Array<{ name: string; tpmCap: number; pricePerMinute: number }>
  }
  skillDependencies?: string[]
  learningEnabled?: boolean
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateAgentInput) => {
      const res = await fetch(`${API_BASE}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create agent')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

export function useUpdateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateAgentInput> & { id: string }) => {
      const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update agent')
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agent', variables.id] })
    },
  })
}

export function useDeleteAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete agent')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

// Search agents
export interface AgentSearchResponse {
  results: Agent[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: {
    categories: Record<string, number>
    priceRange: { min: number; max: number }
    ratingDistribution: Record<string, number>
  }
  searchTimeMs: number
}

export function useSearchAgents(query: string, filters?: Omit<AgentFilters, 'search'>) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (filters?.category) params.set('category', filters.category)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.minRating) params.set('minRating', String(filters.minRating))
  if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))

  return useQuery({
    queryKey: ['searchAgents', query, filters],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/search/agents?${params}`)
      if (!res.ok) throw new Error('Search failed')
      return res.json() as Promise<AgentSearchResponse>
    },
    staleTime: 30 * 1000, // 30 seconds for search
  })
}
