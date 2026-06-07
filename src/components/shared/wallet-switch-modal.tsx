"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, CheckCircle2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NetworkInfo {
  chainId: number
  name: string
  icon?: string
}

interface WalletSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitch: () => void
  currentNetwork: NetworkInfo
  requiredNetwork: NetworkInfo
  isLoading?: boolean
}

export function WalletSwitchModal({
  isOpen,
  onClose,
  onSwitch,
  currentNetwork,
  requiredNetwork,
  isLoading = false,
}: WalletSwitchModalProps) {
  const networksMatch = currentNetwork.chainId === requiredNetwork.chainId

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
            <ArrowLeftRight className="h-6 w-6 text-violet-500" />
          </div>
          <DialogTitle className="text-xl">Switch Network</DialogTitle>
          <DialogDescription>
            This action requires a different network to be active in your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Network Comparison */}
          <div className="flex items-center justify-between gap-4">
            {/* Current Network */}
            <Card className="flex-1" size="sm">
              <CardContent className="p-3">
                <p className="mb-1 text-xs text-muted-foreground">Current</p>
                <div className="flex items-center gap-2">
                  {currentNetwork.icon && (
                    <img src={currentNetwork.icon} alt="" className="h-5 w-5 rounded-full" />
                  )}
                  <span className="font-medium">{currentNetwork.name}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Chain {currentNetwork.chainId}</p>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Required Network */}
            <Card className="flex-1" size="sm">
              <CardContent className="p-3">
                <p className="mb-1 text-xs text-muted-foreground">Required</p>
                <div className="flex items-center gap-2">
                  {requiredNetwork.icon && (
                    <img src={requiredNetwork.icon} alt="" className="h-5 w-5 rounded-full" />
                  )}
                  <span className="font-medium">{requiredNetwork.name}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Chain {requiredNetwork.chainId}</p>
              </CardContent>
            </Card>
          </div>

          {/* Why this network */}
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Why this network?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vassal.ai operates on the Somnia L1 network for secure, fast transactions.
                  Please switch to continue.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={onSwitch}
            disabled={isLoading || networksMatch}
            className="w-full"
          >
            {isLoading ? (
              <span className="animate-pulse">Switching...</span>
            ) : (
              <>Switch to {requiredNetwork.name}</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}