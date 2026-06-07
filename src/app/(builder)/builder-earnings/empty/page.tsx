'use client'

import Link from 'next/link'
import { DollarSign } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoBuilderEarningsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No revenue yet"
        description="Deploy more agents and improve quality scores to start earning"
        icon={DollarSign}
        action={{
          label: 'View Agent Analytics',
          onClick: () => window.location.href = '/builder/analytics',
        }}
      />
    </div>
  )
}