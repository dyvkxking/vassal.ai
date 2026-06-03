"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSessionById } from "@/lib/mock-data";
import type { ClientSessionEvent } from "@/types";

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function getEventIcon(type: ClientSessionEvent["type"]): string {
  switch (type) {
    case "heartbeat": return "💓";
    case "tpm_spike": return "📈";
    case "warning": return "⚠️";
    case "sla_breach": return "🚨";
    case "session_end": return "🏁";
    case "session_extended": return "⏰";
    default: return "•";
  }
}

export default function SessionMonitorPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [elapsed, setElapsed] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const session = getSessionById(sessionId);

  useEffect(() => {
    if (!session || session.status !== "active") return;

    const startTime = new Date(session.startTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const secs = Math.floor((now - startTime) / 1000);
      setElapsed(secs);
      setCurrentCost((secs / 60) * 0.05);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
          <p className="text-muted-foreground">The session &quot;{sessionId}&quot; does not exist.</p>
        </Card>
      </div>
    );
  }

  const tpmPercentage = Math.min(100, (session.tpmUsed / session.tpmCap) * 100);
  const slaHealth = session.latency <= 200 ? 100 : session.latency <= 500 ? 70 : 40;
  const slaColor = slaHealth >= 80 ? "bg-green-500" : slaHealth >= 50 ? "bg-yellow-500" : "bg-red-500";
  const projectedCost = currentCost * 1.2;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{session.agentName}</CardTitle>
            <Badge variant={session.status === "active" ? "default" : "secondary"}>
              {session.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Session ID: {session.id}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Time</p>
              <p className="font-medium">{new Date(session.startTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Elapsed</p>
              <p className="font-medium">{formatDuration(elapsed)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Latency</p>
              <p className="font-medium">{session.latency}ms</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Cost</p>
              <p className="font-medium">${currentCost.toFixed(4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">TPM Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={tpmPercentage} className="h-3" />
            <div className="flex justify-between text-sm">
              <span>{session.tpmUsed.toLocaleString()} used</span>
              <span className="text-muted-foreground">{session.tpmCap.toLocaleString()} cap</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SLA Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={`h-3 w-full rounded-full ${slaColor}`} />
            <div className="flex justify-between text-sm">
              <span className={slaHealth >= 80 ? "text-green-600" : slaHealth >= 50 ? "text-yellow-600" : "text-red-600"}>
                {slaHealth >= 80 ? "Healthy" : slaHealth >= 50 ? "Warning" : "Critical"}
              </span>
              <span className="text-muted-foreground">{slaHealth}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Session Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {session.events.map((event, i) => (
              <div key={i} className="flex items-start gap-3 text-sm py-1">
                <span>{getEventIcon(event.type)}</span>
                <span className="text-muted-foreground w-20">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <span>{event.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cost Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Estimated total at current rate</p>
              <p className="text-2xl font-bold">${projectedCost.toFixed(4)}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Rate: $0.05/min</p>
              <p>Elapsed: {formatDuration(elapsed)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Session Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">Extend Session</Button>
          <Button variant="outline" size="sm">Adjust SLA Params</Button>
          <Button variant="outline" size="sm" className="text-yellow-600">Report Agent</Button>
          {showEndConfirm ? (
            <div className="flex gap-2 w-full">
              <Button variant="destructive" size="sm" onClick={() => alert("Session ended")}>
                Confirm End
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowEndConfirm(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="destructive" size="sm" onClick={() => setShowEndConfirm(true)}>
              End Session
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}