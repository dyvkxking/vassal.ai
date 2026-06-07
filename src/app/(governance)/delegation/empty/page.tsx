'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoDelegationPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="Not delegating your votes"
        description="Delegate your voting power to a trusted address"
        icon={Users}
        action={{
          label: 'Find a Delegate',
          onClick: () => window.location.href = '/governance/proposals',
        }}
      />
    </div>
  )
}