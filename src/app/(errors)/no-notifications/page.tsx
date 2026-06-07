'use client'

import Link from 'next/link'
import { EmptyState } from '@/components/shared/empty-state'
import { Bell } from 'lucide-react'

export default function NoNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No notifications"
        description="You're all caught up! Notifications about your agents, sessions, and earnings will appear here."
        icon={Bell}
        secondaryAction={{
          label: 'ArrowRight to Dashboard',
          href: '/',
        }}
      />
    </div>
  )
}