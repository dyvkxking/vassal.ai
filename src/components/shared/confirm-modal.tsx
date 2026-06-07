"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, XCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConfirmModalVariant = "default" | "danger"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmModalVariant
  isLoading?: boolean
}

const VARIANT_ICONS = {
  default: CheckCircle,
  danger: AlertTriangle,
}

const VARIANT_COLORS = {
  default: {
    icon: "text-blue-500 bg-blue-500/10",
    button: "bg-primary text-primary-foreground hover:bg-primary/80",
  },
  danger: {
    icon: "text-red-500 bg-red-500/10",
    button: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const Icon = VARIANT_ICONS[variant]
  const colors = VARIANT_COLORS[variant]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center">
          <div className={cn("mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full", colors.icon)}>
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn("w-full", colors.button)}
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              confirmLabel
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Convenience components for common use cases
export function DeleteConfirmModal(props: Omit<ConfirmModalProps, "variant" | "confirmLabel" | "icon">) {
  return (
    <ConfirmModal
      {...props}
      variant="danger"
      confirmLabel="Delete"
      title={props.title || "Delete Item"}
      description={props.description || "This action cannot be undone. Are you sure you want to continue?"}
    />
  )
}

export function TerminateSessionModal(props: Omit<ConfirmModalProps, "variant" | "confirmLabel">) {
  return (
    <ConfirmModal
      {...props}
      variant="danger"
      confirmLabel="Terminate"
      title={props.title || "Terminate Session"}
      description={props.description || "This will immediately end the session. You will not be charged for unfinished time."}
    />
  )
}

export function RevokeKeyModal(props: Omit<ConfirmModalProps, "variant" | "confirmLabel">) {
  return (
    <ConfirmModal
      {...props}
      variant="danger"
      confirmLabel="Revoke"
      title={props.title || "Revoke API Key"}
      description={props.description || "This API key will be permanently deleted. Any applications using this key will stop working."}
    />
  )
}