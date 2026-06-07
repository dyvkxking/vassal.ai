'use client'

import Link from 'next/link'
import { ChartLine } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoProviderEarningsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No earnings yet"
        description="Complete sessions and maintain SLA compliance to start earning"
        icon={ChartLine}
        secondaryAction={{
          label: 'Documentation',
          href: '/docs/getting-started',
        }}
        action={{
          label: 'Node Configuration',
          onClick: () => window.location.href = '/provider/node',
        }}
      />
    </div>
  )
}