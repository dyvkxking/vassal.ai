"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MOCK_NODE_LOGS } from "@/lib/mock-data"

const levelColors = {
  info: "bg-blue-100 text-blue-800 border-blue-200",
  warn: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
}

export default function NodeLogsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Node Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Info</Button>
          <Button variant="outline" size="sm">Warn</Button>
          <Button variant="outline" size="sm">Error</Button>
          <Button variant="outline" size="sm">All</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-4 space-y-2 font-mono text-sm">
              {MOCK_NODE_LOGS.map(log => (
                <div key={log.id} className="flex items-start gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <Badge className={levelColors[log.level]} variant="outline">
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className="flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}