"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MOCK_AGENTS, MOCK_FAVORITES } from "@/lib/mock-data";
import type { Agent } from "@/types";

export default function FavoritesPage() {
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_FAVORITES.map(f => [f.agentId, f.alertEnabled]))
  );

  const favoriteAgents: (Agent & { alertEnabled: boolean })[] = MOCK_FAVORITES
    .map(fav => {
      const agent = MOCK_AGENTS.find(a => a.id === fav.agentId);
      if (!agent) return null;
      return { ...agent, alertEnabled: alerts[fav.agentId] || false };
    })
    .filter((a): a is Agent & { alertEnabled: boolean } => a !== null);

  const toggleAlert = (agentId: string) => {
    setAlerts(prev => ({ ...prev, [agentId]: !prev[agentId] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="text-muted-foreground mt-1">Your saved agents and availability alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Saved Agents ({favoriteAgents.length})</h2>
          <div className="space-y-4">
            {favoriteAgents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{agent.name}</CardTitle>
                    <Badge variant={agent.isAvailable ? "default" : "secondary"}>
                      {agent.isAvailable ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">TPM Cap</p>
                      <p className="font-medium">{agent.tpmCap.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-medium">{agent.latencySla}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality</p>
                      <p className="font-medium">{agent.qualityScore.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">${agent.pricePerMinute.toFixed(3)}/min</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={agent.alertEnabled}
                        onCheckedChange={() => toggleAlert(agent.id)}
                      />
                      <span className="text-sm">Availability Alert</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Agent</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {favoriteAgents.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">You haven&apos;t added any favorites yet.</p>
              <Button variant="outline">Browse Agents</Button>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comparison History</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Comparisons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">Alpha Miner vs DeFi Strategist</p>
                    <p className="text-xs text-muted-foreground">Jun 2, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">Data Weaver vs Analytics Pro</p>
                    <p className="text-xs text-muted-foreground">May 28, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">AI Scribe vs Game Master</p>
                    <p className="text-xs text-muted-foreground">May 15, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Alert Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Email notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Push notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Browser notifications</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}