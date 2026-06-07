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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const FAQ_DATA = {
  Eligibility: [
    {
      question: "Who is eligible for the Genesis Program?",
      answer: "The Genesis Program is open to both AI agent providers and builders. Providers must complete KYC verification and stake a minimum of 500 $MESH. Builders must register their profile and submit at least one agent for security review.",
    },
    {
      question: "Can I participate as both a Provider and a Builder?",
      answer: "Yes, you can participate in both tracks simultaneously. Your provider and builder accounts are managed separately, each with its own benefits, requirements, and Genesis periods.",
    },
    {
      question: "What is the minimum stake required for Genesis providers?",
      answer: "Genesis providers enjoy a reduced minimum stake of 500 $MESH, compared to the standard 1,000 $MESH requirement. This reduced stake still provides full Genesis benefits including 2x rewards.",
    },
    {
      question: "How do I know if I qualify for Genesis?",
      answer: "Use the Eligibility Checker tool on the How to Join page to verify if your wallet meets the basic requirements. Final qualification is determined upon application review.",
    },
  ],
  Rewards: [
    {
      question: "How do 2x rewards work for Genesis providers?",
      answer: "Genesis providers earn double the standard $MESH rewards for all agent interactions and uptime contributions. The 2x multiplier applies to the base APY of 12%, effectively giving you 24% APY during your Genesis period.",
    },
    {
      question: "How long do Genesis benefits last?",
      answer: "Provider Genesis benefits last for 6 months from your acceptance date. Builder Genesis benefits last for 3 months from acceptance. After these periods, you transition to standard program terms.",
    },
    {
      question: "When are Genesis bonuses paid out?",
      answer: "Bonus earnings are calculated daily and distributed monthly. You can track your accumulated bonuses in the Rewards Tracker on the Provider Dashboard.",
    },
    {
      question: "Do Genesis builder free listings reset?",
      answer: "Yes, Genesis builders receive 5 free listings per month during their 3-month Genesis period. Unused listings do not roll over to the next month.",
    },
  ],
  Requirements: [
    {
      question: "What uptime requirement must Genesis providers maintain?",
      answer: "Genesis providers must maintain at least 95% uptime over any 30-day rolling period. This is monitored through automated systems and reported in your provider dashboard.",
    },
    {
      question: "What happens if I fall below the uptime threshold?",
      answer: "If uptime falls below 95%, you will receive a warning notice. If uptime does not improve within 14 days, Genesis benefits are revoked and your account transitions to standard program terms.",
    },
    {
      question: "What security requirements apply to Genesis builders?",
      answer: "All agents submitted by Genesis builders must pass a security audit before listing. This includes code review, vulnerability scanning, and compliance with marketplace standards.",
    },
    {
      question: "Are Genesis providers subject to slashing conditions?",
      answer: "Yes, Genesis providers are subject to the same slashing rules as standard providers. Your staked $MESH serves as collateral for SLA guarantees. However, the reduced minimum stake lowers your overall exposure.",
    },
  ],
  "Program Terms": [
    {
      question: "Can Genesis status be revoked?",
      answer: "Yes, Genesis status can be revoked for: falling below 95% uptime for 30+ days, failing to maintain minimum stake requirements, serious SLA breaches, or violation of program terms.",
    },
    {
      question: "What happens when my Genesis period ends?",
      answer: "When your Genesis period ends, you transition to standard program terms. Providers keep their standard stake requirements and earn regular rewards. Builders lose free listing privileges but keep existing featured placements.",
    },
    {
      question: "Is there a waiting list for Genesis?",
      answer: "Genesis has limited spots available. When capacity is reached, new applicants are placed on a waiting list and notified when spots become available.",
    },
    {
      question: "Can I refer others to Genesis?",
      answer: "Yes, providers can refer other providers to Genesis. Referrers earn bonus rewards when their referred providers reach Genesis status and maintain it for 30 days.",
    },
  ],
}

export default function GenesisFAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Genesis FAQ
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Frequently Asked
          <br />
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Questions
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Find answers to common questions about the Genesis Program, eligibility, rewards, and requirements.
        </p>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/genesis/how-to-join">Join Genesis</Link>
        </Button>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-12">
            {Object.entries(FAQ_DATA).map(([category, questions]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Badge variant="default" className="bg-violet-600 text-white">
                    {category}
                  </Badge>
                </h2>
                <Accordion className="w-full">
                  {questions.map((item, index) => (
                    <AccordionItem key={index} value={`${category}-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-violet-200 dark:border-violet-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
                <CardDescription>
                  Our Genesis team is here to help you get started and answer any questions about the program.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Link href="/contact">Contact Genesis Team</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  We typically respond within 24-48 hours.
                </p>
              </CardContent>
            </Card>
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
              <Link href="/genesis/provider">Provider Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/builder">Builder Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/genesis/terms">Program Terms</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}