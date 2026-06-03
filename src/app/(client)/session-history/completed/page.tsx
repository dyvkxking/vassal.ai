"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_CLIENT_SESSIONS } from "@/lib/mock-data";

export default function CompletedSessionPage() {
  const session = MOCK_CLIENT_SESSIONS.find(s => s.status === "completed");

  if (!session) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Completed Sessions</h2>
          <p className="text-muted-foreground">You have no completed sessions to display.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Session Receipt</h1>
        <p className="text-muted-foreground mt-1">Complete session details and SLA compliance</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{session.agentName}</CardTitle>
            <Badge variant="default">Completed</Badge>
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
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="font-medium">${session.cost.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">SLA Compliance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency SLA</span>
                <span className={session.latency <= 200 ? "text-green-600" : "text-red-600"}>
                  {session.latency}ms {session.latency <= 200 ? "(Met)" : "(Breached)"}
                </span>
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

          {session.refundApplied !== undefined && session.refundApplied > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-green-600">Refunds Applied</h3>
              <p>${session.refundApplied.toFixed(2)} refunded due to SLA adjustments</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Rating & Feedback</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-medium">
                  {session.rating ? "★".repeat(session.rating) : "Not rated"}
                </span>
              </div>
              {session.feedback && (
                <div>
                  <p className="text-muted-foreground">Feedback:</p>
                  <p className="italic">"{session.feedback}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline">Download Receipt</Button>
            <Button variant="outline">Rerun Session</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}