'use client'

import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoMyAgentsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No agents yet"
        description="Create your first agent to start earning from rentals"
        icon={Wrench}
        action={{
          label: 'Create Agent',
          onClick: () => window.location.href = '/create-agent',
        }}
        secondaryAction={{
          label: 'Browse Agents',
          href: '/browse-agents',
        }}
      />
    </div>
  )
}