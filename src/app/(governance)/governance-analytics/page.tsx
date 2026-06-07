"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  PieChart,
  TrendingUp,
  CheckCircle2,
  Download,
  BarChart3,
  Activity,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {change && (
              <p
                className={`text-sm mt-1 ${
                  changeType === "positive"
                    ? "text-green-600"
                    : changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {change}
              </p>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BarChartProps {
  data: { label: string; value: number; maxValue: number }[];
  title?: string;
}

function TextBarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.maxValue));

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * 100;
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface HorizontalBarChartProps {
  data: { label: string; value: number; secondaryValue?: number }[];
  title?: string;
  showSecondary?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}

function HorizontalBarChart({
  data,
  title,
  showSecondary,
  primaryLabel = "For",
  secondaryLabel = "Against",
}: HorizontalBarChartProps) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)));

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => {
          const primaryWidth = (item.value / maxValue) * 100;
          const secondaryWidth = item.secondaryValue ? (item.secondaryValue / maxValue) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="truncate max-w-[200px]" title={item.label}>
                  {item.label}
                </span>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600">{primaryLabel}: {item.value}</span>
                  {showSecondary && (
                    <span className="text-red-600">{secondaryLabel}: {item.secondaryValue}</span>
                  )}
                </div>
              </div>
              <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500/70 rounded-full"
                  style={{ width: `${primaryWidth}%` }}
                />
                {showSecondary && (
                  <div
                    className="absolute right-0 top-0 h-full bg-red-500/70 rounded-full"
                    style={{ width: `${secondaryWidth}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const VOTER_TURNOUT_DATA = [
  { label: "Week 1", value: 12, maxValue: 50 },
  { label: "Week 2", value: 18, maxValue: 50 },
  { label: "Week 3", value: 24, maxValue: 50 },
  { label: "Week 4", value: 31, maxValue: 50 },
  { label: "Week 5", value: 38, maxValue: 50 },
  { label: "Week 6", value: 42, maxValue: 50 },
  { label: "Week 7", value: 45, maxValue: 50 },
  { label: "Week 8", value: 48, maxValue: 50 },
];

const PROPOSAL_CATEGORIES = [
  { label: "Protocol Upgrade", value: 35, maxValue: 100 },
  { label: "Parameter Change", value: 28, maxValue: 100 },
  { label: "Treasury", value: 22, maxValue: 100 },
  { label: "Partnerships", value: 15, maxValue: 100 },
  { label: "Other", value: 10, maxValue: 100 },
];

const TOP_PROPOSALS = [
  {
    id: "GIP-042",
    title: "Increase staking reward ratio to 12%",
    votesFor: 845200,
    votesAgainst: 124300,
    totalVotes: 969500,
    participation: "42.3%",
    status: "Active",
  },
  {
    id: "GIP-039",
    title: "Add ETH as cross-chain settlement asset",
    votesFor: 712400,
    votesAgainst: 89200,
    totalVotes: 801600,
    participation: "38.7%",
    status: "Passed",
  },
  {
    id: "GIP-041",
    title: "Reduce node operator commission to 5%",
    votesFor: 623100,
    votesAgainst: 198700,
    totalVotes: 821800,
    participation: "35.2%",
    status: "Active",
  },
  {
    id: "GIP-037",
    title: "Enable instant unstaking with 1% fee",
    votesFor: 534200,
    votesAgainst: 445600,
    totalVotes: 979800,
    participation: "31.8%",
    status: "Defeated",
  },
  {
    id: "GIP-040",
    title: "Allocate 2M MESH for ecosystem grants",
    votesFor: 498300,
    votesAgainst: 67200,
    totalVotes: 565500,
    participation: "28.4%",
    status: "Passed",
  },
];

const SLASH_EVENTS = [
  {
    id: "SL-2024-089",
    nodeId: "node_0x7a3...",
    reason: "Double signing",
    amount: "2,500 MESH",
    date: "2024-01-15",
    block: "14,892,341",
  },
  {
    id: "SL-2024-076",
    nodeId: "node_0x3f9...",
    reason: "Downtime (48h)",
    amount: "1,200 MESH",
    date: "2024-01-12",
    block: "14,756,892",
  },
  {
    id: "SL-2024-065",
    nodeId: "node_0x9c2...",
    reason: "Invalid attestation",
    amount: "800 MESH",
    date: "2024-01-08",
    block: "14,623,441",
  },
  {
    id: "SL-2024-051",
    nodeId: "node_0x2e4...",
    reason: "Censorship violation",
    amount: "3,100 MESH",
    date: "2024-01-05",
    block: "14,498,772",
  },
];

export default function ArrowRightvernanceAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">ArrowRightvernance Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of governance activity and proposal metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v ?? timeRange)} className="w-auto">
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Participation Rate"
          value="38.4%"
          change="+5.2% from last period"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Proposal Success Rate"
          value="72.1%"
          change="+2.8% from last period"
          changeType="positive"
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Proposals"
          value="247"
          change="+18 this month"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Avg. Voting Time"
          value="14.2 days"
          change="-1.3 days from last period"
          changeType="positive"
          icon={Activity}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Voter Turnout Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Voter Turnout Over Time
            </CardTitle>
            <CardDescription>Percentage of eligible voters participating</CardDescription>
          </CardHeader>
          <CardContent>
            <TextBarChart data={VOTER_TURNOUT_DATA} title="Weekly Turnout %" />
          </CardContent>
        </Card>

        {/* Proposal Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Proposal Categories
            </CardTitle>
            <CardDescription>Distribution by proposal type</CardDescription>
          </CardHeader>
          <CardContent>
            <TextBarChart data={PROPOSAL_CATEGORIES} title="Category Distribution %" />
          </CardContent>
        </Card>
      </div>

      {/* Vote Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Vote Distribution
          </CardTitle>
          <CardDescription>
            For/Against ratio across active and recent proposals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HorizontalBarChart
            data={TOP_PROPOSALS.slice(0, 5).map((p) => ({
              label: `${p.id}: ${p.title}`,
              value: p.votesFor,
              secondaryValue: p.votesAgainst,
            }))}
            showSecondary
            primaryLabel="For"
            secondaryLabel="Against"
          />
        </CardContent>
      </Card>

      {/* Most Contested Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Most Contested Proposals</CardTitle>
          <CardDescription>
            Proposals with the closest vote margins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead className="text-right">For</TableHead>
                <TableHead className="text-right">Against</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Participation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_PROPOSALS.sort((a, b) => {
                const marginA = Math.abs(a.votesFor - a.votesAgainst) / a.totalVotes;
                const marginB = Math.abs(b.votesFor - b.votesAgainst) / b.totalVotes;
                return marginA - marginB;
              })
                .slice(0, 5)
                .map((proposal) => {
                  const margin = Math.abs(proposal.votesFor - proposal.votesAgainst);
                  const marginPercent = ((margin / proposal.totalVotes) * 100).toFixed(1);
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.id}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {proposal.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {proposal.votesFor.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-medium">
                        {proposal.votesAgainst.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{marginPercent}%</Badge>
                      </TableCell>
                      <TableCell className="text-right">{proposal.participation}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            proposal.status === "Passed"
                              ? "default"
                              : proposal.status === "Defeated"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Proposals by Votes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Proposals by Total Votes</CardTitle>
          <CardDescription>Proposals with highest voter engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="text-right">Participation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_PROPOSALS.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proposal.id}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {proposal.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {proposal.totalVotes.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{proposal.participation}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        proposal.status === "Passed"
                          ? "default"
                          : proposal.status === "Defeated"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slash Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Slash Events</CardTitle>
          <CardDescription>Validator slashing incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Node ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Block</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SLASH_EVENTS.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm">{event.id}</TableCell>
                  <TableCell className="font-mono text-sm">{event.nodeId}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{event.reason}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {event.amount}
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell className="font-mono text-sm">{event.block}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
