import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProviderSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your API keys for authentication
            </p>
            <Link href="/provider-settings/api-keys">
              <Button variant="outline" className="w-full">Manage API Keys</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              2FA, active sessions, and login history
            </p>
            <Link href="/provider-settings/security">
              <Button variant="outline" className="w-full">Security Settings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integrations with external services
            </p>
            <Link href="/provider-settings/connected-tools">
              <Button variant="outline" className="w-full">View Tools</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}