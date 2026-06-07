'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoSkillsFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No skills match your search"
        description="Be the first to publish in this category"
        icon={Search}
        action={{
          label: 'Clear Filters',
          onClick: () => window.location.href = '/skills/browse',
        }}
        secondaryAction={{
          label: 'Publish a Skill',
          href: '/skills/publish',
        }}
      />
    </div>
  )
}