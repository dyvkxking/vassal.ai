import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_SESSIONS } from "@/lib/mock-data"

export default function CompletedSessionsPage() {
  const completedSessions = MOCK_SESSIONS.filter(s => s.status === 'completed')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Completed Sessions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filter by Date</Button>
          <Button variant="outline" size="sm">Filter by Agent</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>TPM Used</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>SLA Compliance</TableHead>
                <TableHead>Slash Events</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedSessions.map(session => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.agentName}</TableCell>
                  <TableCell>{session.client}</TableCell>
                  <TableCell>{session.tpmUsed.toLocaleString()}</TableCell>
                  <TableCell>${session.earnings.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={session.slaCompliant ? "default" : "destructive"}>
                      {session.slaCompliant ? "Compliant" : "Violation"}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.slashEvents || 0}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {session.endedAt ? new Date(session.endedAt).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {completedSessions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No completed sessions</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}