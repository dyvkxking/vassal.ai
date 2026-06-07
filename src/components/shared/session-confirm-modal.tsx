"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Clock, Zap, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  avatarUrl?: string
  qualityScore: number
  category: string
}

interface SLAParams {
  tpmCap: number
  latencyThresholdMs: number
  uptimeGuaranteePercent: number
}

interface SessionConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  agent: Agent
  slaParams: SLAParams
  pricePerMinute: number
  estimatedDuration?: number
  costPreview?: number
  isLoading?: boolean
}

function QualityBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (s >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }
  return (
    <Badge className={cn("font-semibold text-xs px-2 py-0.5", getColor(score))}>
      {score}
    </Badge>
  )
}

function StatItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-600">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

function formatPrice(price: number): string {
  return price.toFixed(4)
}

export function SessionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  agent,
  slaParams,
  pricePerMinute,
  estimatedDuration = 5,
  costPreview,
  isLoading = false,
}: SessionConfirmModalProps) {
  const estimatedCost = costPreview ?? (pricePerMinute * estimatedDuration)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg">Confirm & Pay</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Agent Info */}
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              <AvatarFallback className="bg-violet-100 text-violet-700 text-lg">
                {agent.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{agent.name}</h3>
                <QualityBadge score={agent.qualityScore} />
              </div>
              <p className="text-sm text-muted-foreground capitalize">{agent.category}</p>
            </div>
          </div>

          <Separator />

          {/* SLA Parameters */}
          <div>
            <p className="mb-2 text-sm font-medium">SLA Parameters</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <Zap className="mx-auto mb-1 h-4 w-4 text-violet-500" />
                <p className="text-xs text-muted-foreground">TPM Cap</p>
                <p className="text-sm font-semibold">{slaParams.tpmCap.toLocaleString()}</p>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <Clock className="mx-auto mb-1 h-4 w-4 text-violet-500" />
                <p className="text-xs text-muted-foreground">Latency</p>
                <p className="text-sm font-semibold">{slaParams.latencyThresholdMs}ms</p>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-green-500" />
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-sm font-semibold">{slaParams.uptimeGuaranteePercent}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cost Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Cost Estimate</p>
            <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per minute</span>
                <span>${formatPrice(pricePerMinute)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. duration</span>
                <span>{estimatedDuration} min</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Estimated Total</span>
                <span className="font-bold text-violet-600">${formatPrice(estimatedCost)}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-800">
              Final cost may vary based on actual usage. You will only be charged for what you use.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-muted/30 flex-col gap-2 sm:flex-col">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <span className="animate-pulse">Opening Session...</span>
            ) : (
              <>Confirm & Pay</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}