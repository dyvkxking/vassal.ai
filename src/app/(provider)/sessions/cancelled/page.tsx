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

export default function CancelledSessionsPage() {
  const cancelledSessions = MOCK_SESSIONS.filter(s => s.status === 'cancelled')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cancelled Sessions</h1>
        <Badge variant="destructive">{cancelledSessions.length} cancelled</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>TPM Used</TableHead>
                <TableHead>Partial Charges</TableHead>
                <TableHead>Cancellation Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cancelledSessions.map(session => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.agentName}</TableCell>
                  <TableCell>{session.client}</TableCell>
                  <TableCell>{session.tpmUsed.toLocaleString()}</TableCell>
                  <TableCell>
                    {session.partialCharges ? `$${session.partialCharges.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.cancellationReason || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {session.endedAt ? new Date(session.endedAt).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {cancelledSessions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No cancelled sessions</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}