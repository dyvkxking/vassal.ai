'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoComparePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="Add agents to compare"
        description="Select 2-4 agents from the marketplace to compare"
        icon={Scale}
        action={{
          label: 'Browse Agents',
          onClick: () => window.location.href = '/browse-agents',
        }}
      />
    </div>
  )
}