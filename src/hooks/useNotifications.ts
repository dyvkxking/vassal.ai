'use client'
import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  timestamp: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      if (data.success) {
        setNotifications(data.data)
      }
    } catch {
      setError('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(async (ids: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action: 'mark_read' }),
      })
      const data = await response.json()
      if (data.success) {
        setNotifications(prev =>
          prev.map(n => (ids.includes(n.id) ? { ...n, read: true } : n))
        )
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, loading, error, unreadCount, refetch: fetchNotifications, markAsRead }
}