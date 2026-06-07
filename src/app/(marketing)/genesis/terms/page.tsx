"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Badge variant="default" className="bg-violet-600 text-white">
          {title}
        </Badge>
      </h2>
      {children}
    </div>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-muted-foreground leading-relaxed mb-2 pl-4 relative before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-violet-600">
      {children}
    </li>
  )
}

export default function GenesisTermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Legal
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Genesis Program
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Terms & Conditions
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Official terms and conditions governing the vassal.ai Genesis Program for providers and builders.
        </p>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/genesis/how-to-join">Apply Now</Link>
        </Button>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Paragraph>
                  The Genesis Program is vassal.ai's founding cohort initiative designed to reward early participants in the AI agent marketplace on Somnia L1. Genesis participants receive enhanced benefits including doubled $MESH rewards, reduced stake requirements, and priority marketplace placement.
                </Paragraph>
                <Paragraph>
                  The program operates on two tracks: the <strong>Provider Track</strong> for infrastructure operators running AI agents, and the <strong>Builder Track</strong> for developers creating and listing AI agents. Participants may join both tracks simultaneously with separate Genesis periods for each.
                </Paragraph>
              </CardContent>
            </Card>

            <Section title="Eligibility Criteria">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Provider Track Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <ListItem>Must have a valid Web3 wallet supporting Ethereum-based assets</ListItem>
                    <ListItem>Must complete KYC verification if required by local regulations</ListItem>
                    <ListItem>Must stake a minimum of 500 $MESH (reduced from standard 1,000)</ListItem>
                    <ListItem>Must deploy at least one active AI agent meeting marketplace standards</ListItem>
                    <ListItem>Must maintain 95% uptime over any 30-day rolling period</ListItem>
                    <ListItem>Must agree to and comply with Genesis Program terms</ListItem>
                  </ul>
                </CardContent>
              </Card>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Builder Track Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <ListItem>Must have a valid Web3 wallet supporting Ethereum-based assets</ListItem>
                    <ListItem>Must complete builder profile registration with accurate information</ListItem>
                    <ListItem>Must submit at least one AI agent for security audit and review</ListItem>
                    <ListItem>Agent must pass security audit before receiving Genesis benefits</ListItem>
                    <ListItem>Must maintain at least one active, featured agent listing</ListItem>
                    <ListItem>Must agree to and comply with Genesis Program terms</ListItem>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="Reward Structure">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Genesis Provider</TableHead>
                        <TableHead>Genesis Builder</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Rewards Multiplier</TableCell>
                        <TableCell className="text-violet-600">2x $MESH (24% APY)</TableCell>
                        <TableCell>N/A</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Minimum Stake</TableCell>
                        <TableCell className="text-emerald-600">500 $MESH (50% reduced)</TableCell>
                        <TableCell>N/A</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Free Listings</TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell className="text-violet-600">5 per month for 3 months</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Featured Placement</TableCell>
                        <TableCell>Priority in search results</TableCell>
                        <TableCell>Homepage carousel</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Genesis Period</TableCell>
                        <TableCell>6 months from acceptance</TableCell>
                        <TableCell>3 months from acceptance</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Support</TableCell>
                        <TableCell>Priority support channel</TableCell>
                        <TableCell>Dedicated builder support</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Section>

            <Section title="Slash Conditions">
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Warning: Slashing May Apply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Paragraph>
                    Genesis providers are subject to the same slashing conditions as standard providers. Slashing occurs under the following circumstances:
                  </Paragraph>
                  <ul className="space-y-2">
                    <ListItem><strong>Uptime Breach:</strong> Falling below 95% uptime for 30 consecutive days triggers a warning. If not resolved within 14 days, Genesis status is revoked.</ListItem>
                    <ListItem><strong>Stake Deficiency:</strong> If staked $MESH falls below the 500 minimum, a 30-day cure period begins. Failure to restore stake results in Genesis status removal.</ListItem>
                    <ListItem><strong>SLA Breach:</strong> Serious SLA violations may result in immediate slashing of staked $MESH according to standard provider terms.</ListItem>
                    <ListItem><strong>Fraudulent Activity:</strong> Any fraudulent behavior, market manipulation, or violation of marketplace rules results in immediate termination and potential slashing.</ListItem>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="Program Expiration">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Provider Genesis Period</h3>
                      <p className="text-muted-foreground">
                        Genesis provider benefits last for 6 months from the acceptance date. After the Genesis period ends:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <ListItem>Reward multiplier returns to standard 1x (12% APY)</ListItem>
                        <ListItem>Minimum stake requirement increases to 1,000 $MESH</ListItem>
                        <ListItem>Participants may re-apply for future Genesis cohorts if eligible</ListItem>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Builder Genesis Period</h3>
                      <p className="text-muted-foreground">
                        Genesis builder benefits last for 3 months from the acceptance date. After the Genesis period ends:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <ListItem>Standard listing fees of 5 $MESH per listing apply</ListItem>
                        <ListItem>Existing featured placements remain until manually changed</ListItem>
                        <ListItem>Participants may re-apply for future Genesis cohorts if eligible</ListItem>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>

            <Section title="Contact Information">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Paragraph>
                    For questions about the Genesis Program, eligibility, or these terms, please contact the Genesis team:
                  </Paragraph>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-2">General Inquiries</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: genesis@vassal.ai
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-2">Provider Support</h4>
                      <p className="text-sm text-muted-foreground">
                        MessageCircle: #genesis-providers
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-2">Builder Support</h4>
                      <p className="text-sm text-muted-foreground">
                        MessageCircle: #genesis-builders
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-2">Legal & Compliance</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: legal@vassal.ai
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground mt-12">
              <p>Last updated: June 2026</p>
              <p className="mt-1">Version 1.0</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 border-t">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/genesis">Back to Genesis Overview</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/how-to-join">How to Join</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/faq">FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}