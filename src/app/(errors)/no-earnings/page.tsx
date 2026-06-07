'use client'

import Link from 'next/link'
import { EmptyState } from '@/components/shared/empty-state'
import { DollarSign, TrendingUp } from 'lucide-react'

export default function NoEarningsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No earnings yet"
        description="Start earning by providing compute resources or creating agents that serve users on the network."
        icon={DollarSign}
        secondaryAction={{
          label: 'Explore Opportunities',
          href: '/builder-home',
        }}
      />
    </div>
  )
}