import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@/types'

const API_BASE = '/api'

export interface SessionFilters {
  status?: string
  agentId?: string
  client?: string
  providerNodeId?: string
  page?: number
  pageSize?: number
}

export interface SessionListResponse {
  data: Session[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useSessions(filters?: SessionFilters) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.agentId) params.set('agentId', filters.agentId)
  if (filters?.client) params.set('client', filters.client)
  if (filters?.providerNodeId) params.set('providerNodeId', filters.providerNodeId)
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))

  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/sessions?${params}`)
      if (!res.ok) throw new Error('Failed to fetch sessions')
      return res.json() as Promise<SessionListResponse>
    },
    staleTime: 30 * 1000, // 30 seconds - sessions change more frequently
  })
}

export function useSessionById(id: string | null) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`${API_BASE}/sessions/${id}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch session')
      }
      const json = await res.json()
      return json.data as Session
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

export interface CreateSessionInput {
  client: string
  agentId: string
  providerNode: string
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSessionInput) => {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create session')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export interface UpdateSessionInput {
  id: string
  status?: string
  rating?: number
  feedback?: string
}

export function useUpdateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateSessionInput) => {
      const res = await fetch(`${API_BASE}/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update session')
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['session', variables.id] })
    },
  })
}

export function useCompleteSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/sessions/${id}/complete`, {
        method: 'POST',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to complete session')
      }
      return res.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['session', id] })
    },
  })
}
