'use client'

import Link from 'next/link'
import { Server } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoSessionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No sessions yet"
        description="Your node will appear here once clients start renting your agents"
        icon={Server}
        secondaryAction={{
          label: 'Browse Agents',
          href: '/browse-agents',
        }}
        action={{
          label: 'Node Configuration',
          onClick: () => window.location.href = '/provider/node',
        }}
      />
    </div>
  )
}