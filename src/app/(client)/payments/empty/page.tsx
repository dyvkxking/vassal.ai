'use client'

import Link from 'next/link'
import { Receipt } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoPaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No payment history"
        description="Your session payments will appear here"
        icon={Receipt}
        action={{
          label: 'Browse Agents',
          onClick: () => window.location.href = '/browse-agents',
        }}
      />
    </div>
  )
}