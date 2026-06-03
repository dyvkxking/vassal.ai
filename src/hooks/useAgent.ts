'use client'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_AGENTS, getAgentById } from '@/lib/mock-data'
import type { Agent } from '@/types'

export function useAgent(id?: string) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgent = useCallback(async (agentId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      const found = getAgentById(agentId)
      setAgent(found ?? null)
    } catch {
      setError('Failed to fetch agent')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetchAgent(id)
  }, [id, fetchAgent])

  const refetch = useCallback(() => {
    if (id) fetchAgent(id)
  }, [id, fetchAgent])

  return { agent, loading, error, refetch }
}

export function useAgents(options?: { category?: string }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true)
      setError(null)
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        let result = MOCK_AGENTS
        if (options?.category) {
          result = result.filter(a => a.category === options.category)
        }
        setAgents(result)
      } catch {
        setError('Failed to fetch agents')
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [options?.category])

  return { agents, loading, error }
}