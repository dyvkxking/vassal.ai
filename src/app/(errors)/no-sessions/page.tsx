'use client'

import { EmptyState } from '@/components/shared/empty-state'
import { MessageSquare } from 'lucide-react'

export default function NoSessionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No sessions yet"
        description="Start your first session to interact with AI agents on Somnia L1."
        icon={MessageSquare}
        action={{
          label: 'Launch Agent',
          onClick: () => window.location.href = '/launcher',
        }}
      />
    </div>
  )
}