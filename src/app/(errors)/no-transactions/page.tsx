'use client'

import Link from 'next/link'
import { EmptyState } from '@/components/shared/empty-state'
import { Receipt } from 'lucide-react'

export default function NoTransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No transactions"
        description="Your transaction history will appear here once you start using the platform."
        icon={Receipt}
        secondaryAction={{
          label: 'View Activity',
          href: '/activity',
        }}
      />
    </div>
  )
}