"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_ANALYTICS } from "@/lib/mock-data";

interface RevenueItem {
  skillId: string;
  skillName: string;
  revenue: number;
  invocations: number;
}

interface TrendItem {
  date: string;
  count: number;
}

interface AgentItem {
  agentId: string;
  agentName: string;
  invocations: number;
}

function ASCIIBarChart(data: { label: string; value: number; max: number; width: number }) {
  const bars = Math.round((data.value / data.max) * data.width);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-32">{data.label}</span>
      <span className="text-xs font-mono">{"█".repeat(bars)}{"░".repeat(data.width - bars)}</span>
      <span className="text-xs">{data.value.toLocaleString()}</span>
    </div>
  );
}

export default function SkillAnalyticsPage() {
  const analytics = MOCK_ANALYTICS;
  const maxRevenue = Math.max(...analytics.revenueBySkill.map((s: RevenueItem) => s.revenue));

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Skill Analytics</h1>
        <p className="text-muted-foreground">Monitor your skills performance and earnings</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card><CardHeader><CardTitle>Total Invocations</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{analytics.totalInvocations.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Unique Agents</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{analytics.uniqueAgents.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Earnings</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${analytics.totalEarnings.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Error Rate</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{analytics.errorRate}%</p></CardContent></Card>
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle>Revenue by Skill (ASCII Bar Chart)</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {analytics.revenueBySkill.map((skill: RevenueItem) => (
              <ASCIIBarChart
                key={skill.skillId}
                label={skill.skillName.length > 20 ? skill.skillName.slice(0, 20) + "..." : skill.skillName}
                value={skill.revenue}
                max={maxRevenue}
                width={30}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader><CardTitle>Adoption Trend</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Invocations</TableHead></TableRow></TableHeader>
            <TableBody>
              {analytics.adoptionTrend.map((item: TrendItem) => (
                <TableRow key={item.date}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.count.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader><CardTitle>Top Using Agents</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Agent</TableHead><TableHead>Invocations</TableHead></TableRow></TableHeader>
            <TableBody>
              {analytics.topUsingAgents.map((agent: AgentItem) => (
                <TableRow key={agent.agentId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{agent.agentName}</span>
                      <Badge variant="outline">{agent.agentId}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{agent.invocations.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Revenue Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Skill</TableHead><TableHead>Invocations</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
            <TableBody>
              {analytics.revenueBySkill.map((skill: RevenueItem) => (
                <TableRow key={skill.skillId}>
                  <TableCell>{skill.skillName}</TableCell>
                  <TableCell>{skill.invocations.toLocaleString()}</TableCell>
                  <TableCell>${skill.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}