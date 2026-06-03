"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "What is the Genesis Program?",
    answer: "The Genesis Program is Vassal.ai's launch initiative to reward early participants. During the Genesis period, providers earn 2x rewards on all compute, and builders get up to 3 free agent listings with 0% platform fees.",
  },
  {
    question: "How do I qualify?",
    answer: "Providers must maintain 99%+ uptime, process at least 1000 TPM monthly, keep latency under 200ms, and complete 50+ sessions. Builders need at least 1 functional agent with accurate specs and competitive pricing.",
  },
  {
    question: "What happens when the program ends?",
    answer: "When Genesis ends on September 1, 2026, multipliers and fee waivers will transition to standard rates. However, Genesis participants will receive priority access to future programs and permanent Genesis badges on their profiles.",
  },
  {
    question: "Can I join late?",
    answer: "Yes! You can join the Genesis Program at any time before September 1, 2026. However, the earlier you join, the more benefits you'll accumulate. Benefits are retroactive to your join date.",
  },
  {
    question: "How are 2x rewards calculated?",
    answer: "The 2x multiplier applies to your base earnings. For example, if you earn $100 in base compute, you'll receive an additional $100 Genesis bonus, totaling $200. Bonuses are calculated daily and paid out weekly.",
  },
  {
    question: "What's the timeline?",
    answer: "Genesis runs from June 1, 2026 to September 1, 2026 (90 days). After that, all benefits transition to standard rates. Participants who maintain eligibility will receive lifetime Genesis badges and priority access to future programs.",
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Genesis FAQ</h1>
        <p className="text-muted-foreground">
          Frequently asked questions about the Genesis Program
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleItem(index)}>
                <CardTitle className="text-lg cursor-pointer">{item.question}</CardTitle>
                <Button variant="ghost" size="icon">
                  {openItems.includes(index) ? "−" : "+"}
                </Button>
              </div>
            </CardHeader>
            {openItems.includes(index) && (
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  )
}