"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_SKILLS } from "@/lib/mock-data";
import type { Skill } from "@/types";

function getSkillById(id: string): Skill | undefined {
  return MOCK_SKILLS.find((s) => s.id === id);
}

export default function SkillDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const skill = getSkillById(id);

  if (!skill) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Skill not found</h1>
      </div>
    );
  }

  const earningsDisplay = skill.earnings?.total ? `$${skill.earnings.total.toLocaleString()}` : "$0.00";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{skill.category}</Badge>
          <Badge variant={skill.status === "active" ? "default" : "secondary"}>{skill.status}</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-2">{skill.name}</h1>
        <p className="text-muted-foreground text-lg">{skill.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-9 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="stats">Usage Stats</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{skill.longDescription}</p>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Use Cases</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {skill.useCases.map((uc: string, i: number) => <li key={i}>{uc}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Input / Output Spec</CardTitle></CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Input Parameters</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Required</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.specifications.input.map((inp: { name: string; type: string; description: string; required: boolean }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{inp.name}</TableCell>
                      <TableCell><Badge variant="outline">{inp.type}</Badge></TableCell>
                      <TableCell>{inp.required ? "Yes" : "No"}</TableCell>
                      <TableCell>{inp.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <h4 className="font-semibold mb-2 mt-4">Output</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.specifications.output.map((out: { name: string; type: string; description: string }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{out.name}</TableCell>
                      <TableCell><Badge variant="outline">{out.type}</Badge></TableCell>
                      <TableCell>{out.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Parameters</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Default</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.specifications.parameters.map((p: { name: string; type: string; default?: string; description: string }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{p.name}</TableCell>
                      <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{p.default || "-"}</TableCell>
                      <TableCell>{p.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Return Values</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.specifications.returnValues.map((rv: { code: string; description: string }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{rv.code}</TableCell>
                      <TableCell>{rv.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Error Codes</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Description</TableHead><TableHead>Suggestion</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.specifications.errorCodes.map((ec: { code: string; description: string; suggestion?: string }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{ec.code}</TableCell>
                      <TableCell>{ec.description}</TableCell>
                      <TableCell className="text-muted-foreground">{ec.suggestion || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Version History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Release Date</TableHead><TableHead>Status</TableHead><TableHead>Changelog</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.versions.map((v: { version: string; releaseDate: string; changelog: string; status: string }, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono font-semibold">v{v.version}</TableCell>
                      <TableCell>{v.releaseDate}</TableCell>
                      <TableCell><Badge variant={v.status === "active" ? "default" : "secondary"}>{v.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{v.changelog}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle>Total Invocations</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{skill.usageCount.toLocaleString()}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Unique Agents</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">1,247</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Earnings</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{earningsDisplay}</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="author" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <img src={skill.author.avatar} alt={skill.author.name} className="w-16 h-16 rounded-full" />
                <div>
                  <CardTitle>{skill.author.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{skill.author.bio}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div><p className="text-muted-foreground text-sm">Reputation</p><p className="text-2xl font-bold">{skill.author.reputation}</p></div>
                <div><p className="text-muted-foreground text-sm">Total Skills</p><p className="text-2xl font-bold">{skill.author.totalSkills}</p></div>
                <div><p className="text-muted-foreground text-sm">Joined</p><p className="text-2xl font-bold">{skill.author.joinedDate}</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Earnings by Version</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Invocations</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.earnings?.byVersion && skill.earnings.byVersion.length > 0 ? (
                    skill.earnings.byVersion.map((ev: { version: string; amount: number; invocations: number }, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono">v{ev.version}</TableCell>
                        <TableCell>{ev.invocations.toLocaleString()}</TableCell>
                        <TableCell>${ev.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3}>No earnings data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {skill.earnings?.payoutHistory && skill.earnings.payoutHistory.length > 0 ? (
                    skill.earnings.payoutHistory.map((ph: { date: string; amount: number; status: string }, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{ph.date}</TableCell>
                        <TableCell>${ph.amount.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="default">{ph.status}</Badge></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3}>No payout history</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Reviews ({skill.reviewCount})</CardTitle></CardHeader>
            <CardContent>
              {skill.reviews.length > 0 ? (
                <div className="space-y-4">
                  {skill.reviews.map((review: { id: string; authorId: string; authorName: string; authorAvatar: string; rating: number; comment: string; date: string }) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={review.authorAvatar} alt={review.authorName} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold">{review.authorName}</span>
                        <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                        <span className="text-muted-foreground text-sm">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Skills That Depend On This</CardTitle></CardHeader>
              <CardContent>
                {skill.dependencies.incoming.length > 0 ? (
                  <ul className="space-y-2">
                    {skill.dependencies.incoming.map((dep: { skillId: string; skillName: string }) => (
                      <li key={dep.skillId} className="flex items-center gap-2">
                        <Badge variant="outline">{dep.skillName}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground">No incoming dependencies</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>This Skill Depends On</CardTitle></CardHeader>
              <CardContent>
                {skill.dependencies.outgoing.length > 0 ? (
                  <ul className="space-y-2">
                    {skill.dependencies.outgoing.map((dep: { skillId: string; skillName: string }) => (
                      <li key={dep.skillId} className="flex items-center gap-2">
                        <Badge variant="outline">{dep.skillName}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground">No outgoing dependencies</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Integration Guide</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{(skill as { integrationGuide?: string }).integrationGuide || "No integration guide available."}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}