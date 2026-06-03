import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_PROVIDER_NODES, MOCK_SESSIONS } from "@/lib/mock-data";

export default function ProviderHomePage() {
  const activeSessions = MOCK_SESSIONS.filter(s => s.status === 'active');
  const onlineNodes = MOCK_PROVIDER_NODES.filter(n => n.status === 'online');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          {onlineNodes.length} Nodes Online
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings (MTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$5,877.98</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TPM Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.4M</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">98.2%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/sessions">
                <Button variant="outline" className="w-full justify-start">
                  Sessions
                </Button>
              </Link>
              <Link href="/provider-earnings">
                <Button variant="outline" className="w-full justify-start">
                  Earnings
                </Button>
              </Link>
              <Link href="/node/configuration">
                <Button variant="outline" className="w-full justify-start">
                  Node Config
                </Button>
              </Link>
              <Link href="/provider-settings">
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeSessions.slice(0, 3).map(session => (
                <div key={session.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{session.agentName}</p>
                    <p className="text-sm text-muted-foreground">{session.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${session.earnings.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{session.tpmUsed.toLocaleString()} TPM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}