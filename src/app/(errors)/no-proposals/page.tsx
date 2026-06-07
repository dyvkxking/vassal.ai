'use client'

import Link from 'next/link'
import { EmptyState } from '@/components/shared/empty-state'
import { FileText } from 'lucide-react'

export default function NoProposalsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No proposals yet"
        description="Be the first to create a governance proposal and shape the future of the protocol."
        icon={FileText}
        action={{
          label: 'Create Proposal',
          onClick: () => window.location.href = '/proposals/create',
        }}
        secondaryAction={{
          label: 'Learn More',
          href: '/how-it-works',
        }}
      />
    </div>
  )
}