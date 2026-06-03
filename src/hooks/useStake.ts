'use client'
import { useState, useEffect, useCallback } from 'react'

interface StakePosition {
  id: string
  amount: number
  token: string
  lockedUntil: string
  tier: 'none' | 'genesis' | 'upgraded'
}

interface StakeState {
  positions: StakePosition[]
  totalStaked: number
  availableRewards: number
}

export function useStake() {
  const [stake, setStake] = useState<StakeState>({
    positions: [],
    totalStaked: 0,
    availableRewards: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStake = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/account/stake')
      const data = await response.json()
      if (data.success) {
        setStake(data.data)
      }
    } catch {
      setError('Failed to fetch stake positions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStake()
  }, [fetchStake])

  const lockStake = useCallback(async (amount: number, duration: number) => {
    try {
      const response = await fetch('/api/account/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock', amount, duration }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchStake()
        return true
      }
      return false
    } catch {
      return false
    }
  }, [fetchStake])

  return { ...stake, loading, error, refetch: fetchStake, lockStake }
}