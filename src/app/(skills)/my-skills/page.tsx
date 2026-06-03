"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SKILLS } from "@/lib/mock-data";

export default function MySkillsPage() {
  const mySkills = MOCK_SKILLS.slice(0, 4);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Skills</h1>
          <p className="text-muted-foreground">Manage and monitor your published skills</p>
        </div>
        <Button>Create New Skill</Button>
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle>Performance Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-muted-foreground text-sm">Total Skills</p>
              <p className="text-3xl font-bold">{mySkills.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">$12,450</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Invocations</p>
              <p className="text-3xl font-bold">89,450</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Avg Rating</p>
              <p className="text-3xl font-bold">4.7</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">My Skill Performance</h2>
      <div className="space-y-4">
        {mySkills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-xl font-bold">{skill.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{skill.name}</h3>
                      <Badge variant={skill.status === "active" ? "default" : "secondary"}>v{skill.version}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs mb-1">Invocations</p>
                    <p className="font-semibold">{skill.usageCount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs mb-1">Rating</p>
                    <p className="font-semibold">{skill.rating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs mb-1">Earnings</p>
                    <p className="font-semibold">${skill.earnings?.total?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs mb-1">Status</p>
                    <Badge variant={skill.status === "active" ? "default" : "secondary"}>{skill.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}