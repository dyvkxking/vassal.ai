"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MOCK_CLIENT_SESSIONS } from "@/lib/mock-data";

export default function SessionHistoryPage() {
  const sessions = MOCK_CLIENT_SESSIONS;
  const allCount = sessions.length;
  const completedCount = sessions.filter(s => s.status === "completed").length;
  const failedCount = sessions.filter(s => s.status === "failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Session History</h1>
        <p className="text-muted-foreground mt-1">View your past and current sessions</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({allCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                        {session.status === "completed" ? "✅" : session.status === "failed" ? "❌" : "⏳"}
                      </div>
                      <div>
                        <p className="font-medium">{session.agentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()} • {session.duration ? `${Math.floor(session.duration / 60)}min` : "In progress"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${session.cost.toFixed(2)}</p>
                      <p className={`text-sm ${session.status === "completed" ? "text-green-600" : session.status === "failed" ? "text-red-600" : "text-yellow-600"}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sessions.filter(s => s.status === "completed").map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">✅</div>
                      <div>
                        <p className="font-medium">{session.agentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()} • {session.duration ? `${Math.floor(session.duration / 60)}min` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${session.cost.toFixed(2)}</p>
                      <Link href="/session-history/completed" className="text-sm text-primary hover:underline">
                        View Receipt →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sessions.filter(s => s.status === "failed").map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">❌</div>
                      <div>
                        <p className="font-medium">{session.agentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()} • {session.failureReason || "Session failed"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${session.cost.toFixed(2)}</p>
                      <Link href="/session-history/failed" className="text-sm text-primary hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}