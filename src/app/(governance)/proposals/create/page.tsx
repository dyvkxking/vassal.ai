"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
  "Protocol Upgrade",
  "SLA Threshold",
  "Slash Amounts",
  "Fee Adjustment",
  "Governance Process",
  "Other",
]

interface FormData {
  title: string
  summary: string
  category: string
  motivation: string
  specification: string
  implementationPlan: string
  timeline: string
  startDate: string
  endDate: string
}

export default function CreateProposalPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [submitted, setSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    summary: "",
    category: CATEGORIES[0],
    motivation: "",
    specification: "",
    implementationPlan: "",
    timeline: "",
    startDate: "",
    endDate: "",
  })

  const totalSteps = 5

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      router.push("/proposals")
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12">
            <div className="text-green-500 text-4xl mb-4">&#10003;</div>
            <h2 className="text-2xl font-bold mb-2">Proposal Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your proposal has been submitted for community review.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to proposals...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Proposal</h1>
        <p className="text-muted-foreground">Submit a governance proposal for community voting</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between max-w-2xl">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "&#10003;" : s}
              </div>
              <span className={`text-sm hidden sm:block ${s <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Title" : s === 2 ? "Specification" : s === 3 ? "Plan" : s === 4 ? "Timing" : "Review"}
              </span>
            </div>
            {s < totalSteps && (
              <div className={`flex-1 h-1 mx-2 ${s < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {step}:{" "}
            {step === 1 && "Title & Summary"}
            {step === 2 && "Full Specification"}
            {step === 3 && "Implementation Plan"}
            {step === 4 && "Vote Timing"}
            {step === 5 && "Review & Submit"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Proposal Title</label>
                <Input
                  placeholder="Enter a clear, descriptive title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">One-line Summary</label>
                <Input
                  placeholder="Brief summary of your proposal"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={formData.category === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("category", cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Motivation & Background</label>
                <Textarea
                  placeholder="Explain why this proposal is needed. Include relevant context and problems being solved."
                  className="min-h-[120px]"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Specification</label>
                <Textarea
                  placeholder="Describe the exact changes being proposed. Use technical language where appropriate."
                  className="min-h-[200px]"
                  value={formData.specification}
                  onChange={(e) => handleInputChange("specification", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Implementation Plan</label>
                <Textarea
                  placeholder="Outline the steps needed to implement this proposal. Include technical details, dependencies, and order of operations."
                  className="min-h-[200px]"
                  value={formData.implementationPlan}
                  onChange={(e) => handleInputChange("implementationPlan", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Timeline</label>
                <Textarea
                  placeholder="Describe the expected timeline for implementation, including key milestones and deadlines."
                  className="min-h-[100px]"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voting Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When the voting period begins
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Voting End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When the voting period ends
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-lg">Review Your Proposal</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Title:</span>
                    <p className="font-medium">{formData.title || "(not set)"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Summary:</span>
                    <p>{formData.summary || "(not set)"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Category:</span>
                    <Badge variant="outline">{formData.category}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Motivation:</span>
                    <p className="text-sm whitespace-pre-line">{formData.motivation || "(not set)"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Specification:</span>
                    <p className="text-sm whitespace-pre-line">{formData.specification || "(not set)"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Implementation Plan:</span>
                    <p className="text-sm whitespace-pre-line">{formData.implementationPlan || "(not set)"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Timeline:</span>
                    <p className="text-sm">{formData.timeline || "(not set)"}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Start Date:</span>
                      <p className="text-sm">{formData.startDate || "(not set)"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">End Date:</span>
                      <p className="text-sm">{formData.endDate || "(not set)"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        <div className="flex gap-2">
          {step < totalSteps ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Proposal</Button>
          )}
        </div>
      </div>
    </div>
  )
}