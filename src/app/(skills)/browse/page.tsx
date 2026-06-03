"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SKILLS, getTrendingSkills, getNewSkills, SKILL_CATEGORIES } from "@/lib/mock-data";

type SortOption = "popular" | "new" | "top-earners" | "top-rated";

export default function BrowsePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const trendingSkills = getTrendingSkills(3);
  const newSkills = getNewSkills(3);

  const filteredSkills = MOCK_SKILLS.filter(
    (s) => selectedCategories.length === 0 || selectedCategories.includes(s.category)
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.usageCount - a.usageCount;
      case "new":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "top-earners":
        return (b.earnings?.total || 0) - (a.earnings?.total || 0);
      case "top-rated":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Browse Skills</h1>
      <p className="text-muted-foreground mb-8">Discover and integrate powerful skills into your agents</p>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SKILL_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded"
                    />
                    <span>{cat}</span>
                    <Badge variant="outline" className="ml-auto">{MOCK_SKILLS.filter(s => s.category === cat).length}</Badge>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button variant={sortBy === "popular" ? "default" : "outline"} size="sm" onClick={() => setSortBy("popular")}>Popular</Button>
              <Button variant={sortBy === "new" ? "default" : "outline"} size="sm" onClick={() => setSortBy("new")}>New</Button>
              <Button variant={sortBy === "top-earners" ? "default" : "outline"} size="sm" onClick={() => setSortBy("top-earners")}>Top Earners</Button>
              <Button variant={sortBy === "top-rated" ? "default" : "outline"} size="sm" onClick={() => setSortBy("top-rated")}>Top Rated</Button>
            </div>
          </div>

          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <Badge>Skill of the Week</Badge>
              <CardTitle className="text-2xl mt-2">{trendingSkills[0]?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{trendingSkills[0]?.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm">{trendingSkills[0]?.usageCount.toLocaleString()} invocations</span>
                <span className="text-sm">★ {trendingSkills[0]?.rating}</span>
                <Badge variant="outline">{trendingSkills[0]?.category}</Badge>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold mb-4">Trending Skills</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {trendingSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{skill.category}</Badge>
                    <span className="text-xs text-muted-foreground">v{skill.version}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{skill.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{skill.usageCount.toLocaleString()} uses</span>
                    <span className="text-xs">★ {skill.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4">New Skills</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {newSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{skill.category}</Badge>
                    <span className="text-xs text-green-500">NEW</span>
                  </div>
                  <h4 className="font-semibold mb-1">{skill.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{skill.usageCount.toLocaleString()} uses</span>
                    <span className="text-xs">★ {skill.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4">All Skills</h3>
          <div className="space-y-4">
            {sortedSkills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold">{skill.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{skill.name}</h4>
                          <Badge variant="outline">v{skill.version}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{skill.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs">{skill.usageCount.toLocaleString()} invocations</span>
                          <span className="text-xs">★ {skill.rating} ({skill.reviewCount})</span>
                          <Badge variant="outline">{skill.category}</Badge>
                          {skill.pricing.type === "free" ? (
                            <Badge variant="default">Free</Badge>
                          ) : (
                            <span className="text-xs">${skill.pricing.price}/{skill.pricing.type === "subscription" ? "mo" : "use"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}