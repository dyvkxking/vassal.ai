import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface WalletOption {
  name: string
  icon: string
  description: string
}

const wallets: WalletOption[] = [
  { name: "MetaMask", icon: "🦊", description: "Connect using MetaMask browser extension" },
  { name: "WalletConnect", icon: "🔗", description: "Scan QR code with your mobile wallet" },
  { name: "Coinbase Wallet", icon: "💰", description: "Connect using Coinbase wallet" },
]

export default function WalletConnectPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
        <p className="text-muted-foreground">
          Choose a wallet to get started with Vassal.ai
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {wallets.map((wallet) => (
          <Card key={wallet.name} className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="flex items-center gap-4 p-6">
              <span className="text-4xl">{wallet.icon}</span>
              <div className="flex-1">
                <CardTitle className="text-lg">{wallet.name}</CardTitle>
                <CardDescription>{wallet.description}</CardDescription>
              </div>
              <Button>Connect</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}