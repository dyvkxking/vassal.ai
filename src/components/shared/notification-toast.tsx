"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  BotIcon,
  PlayIcon,
  SquareIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  SlashIcon,
  BellIcon,
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
} from "lucide-react"

// Notification Types
export type NotificationType =
  | "session_start"
  | "session_end"
  | "sla_warning"
  | "slash"
  | "proposal"
  | "earnings"
  | "system"

interface NotificationToastProps {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
  onClose?: (id: string) => void
}

// Type configurations
const TYPE_CONFIG: Record<NotificationType, {
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  borderColor: string
  iconColor: string
}> = {
  session_start: {
    icon: PlayIcon,
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
  },
  session_end: {
    icon: SquareIcon,
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  sla_warning: {
    icon: AlertTriangleIcon,
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  slash: {
    icon: SlashIcon,
    bgColor: "bg-violet-50 dark:bg-violet-950",
    borderColor: "border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  proposal: {
    icon: BotIcon,
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  earnings: {
    icon: TrendingUpIcon,
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  system: {
    icon: InfoIcon,
    bgColor: "bg-gray-50 dark:bg-gray-950",
    borderColor: "border-gray-200 dark:border-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
}

function Toast({ id, type, title, description, duration = 5000, onClose }: NotificationToastProps) {
  const config = TYPE_CONFIG[type]
  const Icon = config.icon
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Entry animation
    requestAnimationFrame(() => setIsVisible(true))

    // Auto dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose?.(id), 200)
  }

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 w-80 rounded-lg border p-4 shadow-lg transition-all duration-200",
        config.bgColor,
        config.borderColor,
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.bgColor)}>
        <Icon className={cn("h-4 w-4", config.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <XCircleIcon className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

// Toast container for managing multiple toasts
interface ToastItem extends Omit<NotificationToastProps, "onClose"> {
  id: string
}

interface NotificationToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left"
}

const POSITION_CLASSES = {
  "top-right": "top-4 right-4",
  "bottom-right": "bottom-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-left": "bottom-4 left-4",
}

export function NotificationToastContainer({
  toasts,
  onRemove,
  position = "bottom-right",
}: NotificationToastContainerProps) {
  return (
    <div
      className={cn("fixed z-[100] flex flex-col gap-2", POSITION_CLASSES[position])}
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useNotificationToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = (toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    // Convenience methods
    sessionStarted: (agentName: string) =>
      addToast({ type: "session_start", title: "Session Started", description: `Connected to ${agentName}` }),
    sessionEnded: (agentName: string, cost: string) =>
      addToast({ type: "session_end", title: "Session Ended", description: `Charged ${cost} for ${agentName}` }),
    slaWarning: (agentName: string, metric: string) =>
      addToast({ type: "sla_warning", title: "SLA Warning", description: `${agentName}: ${metric}` }),
    slashReceived: (count: number) =>
      addToast({ type: "slash", title: "Slash Command", description: `${count} notification(s) received` }),
    proposalReceived: (agentName: string) =>
      addToast({ type: "proposal", title: "New Proposal", description: `From ${agentName}` }),
    earningsReceived: (amount: string) =>
      addToast({ type: "earnings", title: "Earnings", description: `+${amount} received` }),
    systemAlert: (message: string) =>
      addToast({ type: "system", title: "System Alert", description: message }),
  }
}

export { Toast }
export type { NotificationToastProps }