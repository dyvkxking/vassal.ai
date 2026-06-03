'use client'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_CLIENT_SESSIONS, getSessionById } from '@/lib/mock-data'
import type { ClientSession } from '@/types'

export function useSession(id?: string) {
  const [session, setSession] = useState<ClientSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async (sessionId: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      const found = getSessionById(sessionId)
      setSession(found ?? null)
    } catch {
      setError('Failed to fetch session')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetchSession(id)
  }, [id, fetchSession])

  return { session, loading, error, refetch: () => id && fetchSession(id) }
}

export function useSessions(options?: { status?: ClientSession['status'] }) {
  const [sessions, setSessions] = useState<ClientSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      setError(null)
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        let result = MOCK_CLIENT_SESSIONS
        if (options?.status) {
          result = result.filter(s => s.status === options.status)
        }
        setSessions(result)
      } catch {
        setError('Failed to fetch sessions')
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [options?.status])

  return { sessions, loading, error }
}

export function useSessionMetrics(sessionId: string) {
  const [metrics, setMetrics] = useState<{
    tpmCurrent: number
    tpmCap: number
    latencyMs: number
    slaHealth: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true)
      try {
        const response = await fetch(`/api/sessions/${sessionId}/metrics`)
        const data = await response.json()
        if (data.success) {
          setMetrics({
            tpmCurrent: data.data.tpmCurrent,
            tpmCap: data.data.tpmCap,
            latencyMs: data.data.latencyMs,
            slaHealth: data.data.slaHealth,
          })
        }
      } catch {
        setMetrics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [sessionId])

  return { metrics, loading }
}