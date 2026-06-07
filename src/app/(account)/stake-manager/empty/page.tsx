'use client'

import Link from 'next/link'
import { Coins } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoStakePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No stake yet"
        description="Stake MESH to become a provider or secure your voting power"
        icon={Coins}
        action={{
          label: 'Stake Now',
          onClick: () => window.location.href = '/account/stake-manager',
        }}
      />
    </div>
  )
}