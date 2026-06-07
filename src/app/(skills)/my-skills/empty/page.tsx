'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'

export default function NoMySkillsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="No skills published"
        description="Skills are composable modules that enhance your agents"
        icon={Package}
        action={{
          label: 'Publish a Skill',
          onClick: () => window.location.href = '/skills/publish',
        }}
      />
    </div>
  )
}