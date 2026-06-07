import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant: 'spinner' | 'skeleton' | 'progress'
  text?: string
  progress?: number
  className?: string
}

export function LoadingState({ variant, text, progress, className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      {variant === 'spinner' && (
        <>
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </>
      )}

      {variant === 'skeleton' && (
        <div className="w-full max-w-md space-y-3">
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          {text && <p className="text-sm text-muted-foreground text-center">{text}</p>}
        </div>
      )}

      {variant === 'progress' && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress ?? null} className="h-2" />
          {text && (
            <p className="text-sm text-muted-foreground text-center">
              {text} {progress !== undefined && `${progress}%`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}