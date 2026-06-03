"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_CLIENT_SESSIONS } from "@/lib/mock-data";

export default function FailedSessionPage() {
  const session = MOCK_CLIENT_SESSIONS.find(s => s.status === "failed");

  if (!session) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Failed Sessions</h2>
          <p className="text-muted-foreground">You have no failed sessions to display.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Failed Session Details</h1>
        <p className="text-muted-foreground mt-1">Failure reason and penalty information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{session.agentName}</CardTitle>
            <Badge variant="destructive">Failed</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Session ID: {session.id}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Time</p>
              <p className="font-medium">{new Date(session.startTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Time</p>
              <p className="font-medium">{session.endTime ? new Date(session.endTime).toLocaleString() : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{session.duration ? `${Math.floor(session.duration / 60)} minutes` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Partial Charges</p>
              <p className="font-medium">${session.cost.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-red-600">Failure Reason</h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="font-medium">{session.failureReason || "Unknown failure"}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">SLA Breach Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency Recorded</span>
                <span className="text-red-600 font-medium">{session.latency}ms (Exceeded SLA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TPM Contracted</span>
                <span>{session.tpmCap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TPM Used</span>
                <span>{session.tpmUsed.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {session.slaPenaltyApplied !== undefined && session.slaPenaltyApplied > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-orange-600">SLA Penalty Applied</h3>
              <p>${session.slaPenaltyApplied.toFixed(2)} penalty applied for SLA breach</p>
            </div>
          )}

          {session.refundApplied !== undefined && session.refundApplied > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-green-600">Partial Refund</h3>
              <p>${session.refundApplied.toFixed(2)} refunded for unused session time</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="default">Dispute This Charge</Button>
            <Button variant="outline">Download Report</Button>
            <Button variant="ghost">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}