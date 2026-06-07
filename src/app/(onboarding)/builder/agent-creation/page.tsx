"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Rocket } from 'lucide-react'
import Link from "next/link"
import { AGENT_CATEGORIES } from "@/constants"

const STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Pricing" },
  { number: 3, label: "Preview" },
]

interface FormData {
  name: string
  description: string
  category: string
  pricePerMinute: string
}

export default function AgentCreationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    pricePerMinute: "0.001",
  })

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/builder/complete")
  }

  const handlePublish = () => {
    router.push("/builder/complete")
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "border-primary bg-background text-primary"
                    : "border-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step.number}
            </div>
            <span
              className={`mt-1 text-xs ${
                index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 bg-muted rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Agent Name</label>
        <Input
          placeholder="e.g., DeFi Pulse Scanner"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          placeholder="Describe what your agent does and how it helps clients..."
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={formData.category} onValueChange={(v) => updateFormData("category", v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {AGENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Price per Minute (MESH)</label>
        <Input
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.001"
          value={formData.pricePerMinute}
          onChange={(e) => updateFormData("pricePerMinute", e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Set your rate. Clients pay this per minute of agent usage.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-medium mb-2">Pricing Preview</h3>
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Per Minute</span>
              <span className="font-medium">{formData.pricePerMinute || "0"} MESH</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Per Hour (est.)</span>
              <span className="font-medium">{((parseFloat(formData.pricePerMinute) || 0) * 60).toFixed(4)} MESH</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Agent Preview</h3>
        <p className="text-sm text-muted-foreground">This is how clients will see your agent.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {formData.name.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <CardTitle>{formData.name || "Untitled Agent"}</CardTitle>
              <CardDescription>
                {formData.category ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1).replace("-", " ") : "No category"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{formData.description || "No description provided."}</p>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Pricing</p>
              <p className="font-medium">{formData.pricePerMinute || "0"} MESH/min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo()
      case 1:
        return renderPricing()
      case 2:
        return renderPreview()
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Create Your First Agent</h1>
            <p className="text-muted-foreground">
              Get started in minutes with our quick setup wizard
            </p>
          </div>

          {renderStepIndicator()}

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep].label}</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {STEPS.length}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handlePublish}>
                <Rocket className="h-4 w-4 mr-2" />
                Publish Agent
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={handleSkip}>
              Skip and complete setup later
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}