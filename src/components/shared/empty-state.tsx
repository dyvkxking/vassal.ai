import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UsersIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    href: string
  }
}

export function EmptyState({
  title,
  description,
  icon: Icon = UsersIcon,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="py-16">
      <CardContent className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" asChild>
              <a href={secondaryAction.href}>{secondaryAction.label}</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}