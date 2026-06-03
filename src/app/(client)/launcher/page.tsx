"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { MOCK_AGENTS } from "@/lib/mock-data";
import type { Agent, AgentCategory } from "@/types";

const CATEGORIES: AgentCategory[] = ["Web3", "Data", "Analytics", "Infrastructure", "DeFi", "NFT", "AI/ML", "Gaming"];

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function LauncherPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tpmRange, setTpmRange] = useState<[number, number]>([10000, 300000]);
  const [latencyRange, setLatencyRange] = useState<[number, number]>([500, 5000]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0.1]);
  const [qualityMin, setQualityMin] = useState(0);

  const filteredAgents = useMemo(() => {
    return MOCK_AGENTS.filter((agent) => {
      if (category && agent.category !== category) return false;
      if (agent.tpmCap < tpmRange[0] || agent.tpmCap > tpmRange[1]) return false;
      if (agent.latencySla < latencyRange[0] || agent.latencySla > latencyRange[1]) return false;
      if (agent.pricePerMinute < priceRange[0] || agent.pricePerMinute > priceRange[1]) return false;
      if (agent.qualityScore < qualityMin) return false;
      return true;
    }).sort((a, b) => {
      const aScore = (a.qualityScore * 0.3) + ((100 - a.latencySla / 50) * 0.3) + ((5 - a.pricePerMinute * 100) * 0.2) + (a.tpmCap / 5000000 * 0.2);
      const bScore = (b.qualityScore * 0.3) + ((100 - b.latencySla / 50) * 0.3) + ((5 - b.pricePerMinute * 100) * 0.2) + (b.tpmCap / 5000000 * 0.2);
      return bScore - aScore;
    });
  }, [category, tpmRange, latencyRange, priceRange, qualityMin]);

  const bestMatch = filteredAgents[0];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2">What do you need?</h1>
        <p className="text-muted-foreground">Describe the task you need...</p>
      </div>

      <Card className="p-6">
        <Input
          placeholder="Describe the task you need..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg h-12"
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Capability Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Category</label>
            <Select
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
              placeholder="All Categories"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">TPM Requirement: {tpmRange[0].toLocaleString()} - {tpmRange[1].toLocaleString()}</label>
            <Slider
              min={10000}
              max={300000}
              step={10000}
              value={tpmRange}
              onValueChange={(v) => setTpmRange(v as [number, number])}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Latency SLA: {latencyRange[0]}ms - {latencyRange[1]}ms</label>
            <Slider
              min={500}
              max={5000}
              step={100}
              value={latencyRange}
              onValueChange={(v) => setLatencyRange(v as [number, number])}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range: ${priceRange[0].toFixed(3)} - ${priceRange[1].toFixed(3)}/min</label>
            <Slider
              min={0}
              max={0.1}
              step={0.001}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quality Score Minimum: {qualityMin.toFixed(1)}</label>
            <Slider
              min={0}
              max={5}
              step={0.1}
              value={[qualityMin]}
              onValueChange={(v) => setQualityMin(v[0])}
            />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Matched Agents ({filteredAgents.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent, index) => (
            <Card key={agent.id} className="relative">
              {index === 0 && (
                <Badge className="absolute -top-2 -right-2" variant="default">Best Match</Badge>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{agent.category}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
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
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>SLA Compatibility</span>
                    <span>{agent.latencySla <= latencyRange[1] ? "Compatible" : "Exceeds"}</span>
                  </div>
                  <Progress value={agent.latencySla <= latencyRange[1] ? 100 : 50} />
                </div>
                <Button className="w-full" size="sm">Select Agent</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No agents match your criteria. Try adjusting your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}