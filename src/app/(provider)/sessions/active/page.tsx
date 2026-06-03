import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MOCK_SESSIONS } from "@/lib/mock-data"

export default function ActiveSessionsPage() {
  const activeSessions = MOCK_SESSIONS.filter(s => s.status === 'active')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Active Sessions</h1>
        <Badge variant="secondary">{activeSessions.length} active</Badge>
      </div>

      <div className="grid gap-4">
        {activeSessions.map(session => (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-green-500 opacity-50 animate-ping" />
                  </div>
                  <CardTitle className="text-lg">{session.agentName}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Healthy
                  </Badge>
                  <Button variant="destructive" size="sm">
                    Terminate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{session.client}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">TPM Used</p>
                  <p className="font-medium">{session.tpmUsed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Earnings</p>
                  <p className="font-medium">${session.earnings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="font-medium">{new Date(session.startedAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SLA Health</span>
                  <span className="font-medium">{session.slaHealth}%</span>
                </div>
                <Progress value={session.slaHealth} className="h-2" />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>ID: {session.id}</span>
                <span>|</span>
                <span>Heartbeat: 30s ago</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeSessions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No active sessions</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}