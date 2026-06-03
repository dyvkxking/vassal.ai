import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface WalletInfo {
  name: string
  icon: string
  description: string
}

const supportedWallets: WalletInfo[] = [
  { name: "MetaMask", icon: "🦊", description: "Most popular Ethereum wallet" },
  { name: "WalletConnect", icon: "🔗", description: "Connect via mobile wallet" },
  { name: "Coinbase Wallet", icon: "💰", description: "By Coinbase exchange" },
]

export default function WalletConnectionFailedPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="text-6xl mb-6">👛</div>

      <h1 className="text-4xl font-bold mb-4">Wallet Connection Failed</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Unable to Connect Wallet</CardTitle>
          <CardDescription>
            There was an error connecting to your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Please ensure your wallet is unlocked and you have granted permission.
          </p>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium">Supported Wallets</p>
            {supportedWallets.map((wallet) => (
              <div key={wallet.name} className="flex items-center gap-3 p-3 border rounded-lg">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">{wallet.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm">
              Having trouble? Check our{" "}
              <a href="/docs/troubleshooting" className="text-primary hover:underline">
                troubleshooting guide
              </a>{" "}
              for help.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="default">
          <Link href="/onboarding/wallet-connect">Try Again</Link>
        </Button>
        <Button variant="outline">
          <Link href="/docs/troubleshooting">View Troubleshooting</Link>
        </Button>
      </div>
    </div>
  )
}