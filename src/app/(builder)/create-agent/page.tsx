"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { AGENT_CATEGORIES } from "@/constants"
import { MOCK_SKILLS } from "@/lib/mock-data"
import type { Capability, PricingModel, SLAParams } from "@/types"

const STEPS = [
  "Basic Info",
  "Capabilities",
  "SLA Parameters",
  "Pricing Model",
  "Skill Dependencies",
  "Self-Learning Config",
  "Testing",
  "Preview",
  "Publish",
] as const

type StepName = (typeof STEPS)[number]

interface FormData {
  name: string
  description: string
  category: string
  tags: string
  avatarUrl: string
  capabilities: Capability[]
  slaParams: SLAParams
  pricing: PricingModel
  skillDependencies: { skillId: string; required: boolean }[]
  learningEnabled: boolean
  memoryRetentionPeriod: string
  autoApproveThreshold: number
  testQuery: string
}

const initialFormData: FormData = {
  name: "",
  description: "",
  category: "",
  tags: "",
  avatarUrl: "",
  capabilities: [],
  slaParams: {
    latencyThresholdMs: 2000,
    tpmCap: 100000,
    uptimeGuaranteePercent: 95,
    minStakeRequired: 500,
  },
  pricing: {
    type: "per_minute",
    pricePerMinute: 0.001,
  },
  skillDependencies: [],
  learningEnabled: true,
  memoryRetentionPeriod: "30",
  autoApproveThreshold: 4,
  testQuery: "",
}

export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [testResponse, setTestResponse] = useState<string>("")
  const [testLatency, setTestLatency] = useState<number | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
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

  const handleRunTest = () => {
    setIsTesting(true)
    setTimeout(() => {
      setTestResponse(
        `Based on your query "${formData.testQuery}", this agent would respond with a comprehensive analysis including real-time data synthesis, risk assessment, and actionable recommendations. The response includes formatted markdown, data visualizations, and confidence scores.`
      )
      setTestLatency(Math.floor(Math.random() * 500) + 200)
      setIsTesting(false)
    }, 1500)
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "border-primary bg-background text-primary"
                    : "border-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span
              className={`mt-1 hidden text-xs sm:block ${
                index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 h-2 bg-muted rounded-full">
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
        <Select value={formData.category} onValueChange={(v) => updateFormData("category", v ?? formData.category)}>
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
      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <Input
          placeholder="Comma-separated tags (e.g., defi, yield, monitoring)"
          value={formData.tags}
          onChange={(e) => updateFormData("tags", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Avatar URL</label>
        <Input
          placeholder="https://..."
          value={formData.avatarUrl}
          onChange={(e) => updateFormData("avatarUrl", e.target.value)}
        />
      </div>
    </div>
  )

  const renderCapabilities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Agent Capabilities</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFormData("capabilities", [
              ...formData.capabilities,
              {
                id: `cap-${Date.now()}`,
                name: "",
                description: "",
                tpmRequired: 10000,
                category: formData.category || "other",
              },
            ])
          }
        >
          + Add Capability
        </Button>
      </div>
      {formData.capabilities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No capabilities added yet. Click &quot;Add Capability&quot; to create one.</p>
      ) : (
        <div className="space-y-4">
          {formData.capabilities.map((cap, index) => (
            <Card key={cap.id}>
              <CardContent className="pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input
                      placeholder="Capability name"
                      value={cap.name}
                      onChange={(e) => {
                        const updated = [...formData.capabilities]
                        updated[index] = { ...updated[index], name: e.target.value }
                        updateFormData("capabilities", updated)
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">TPM Required</label>
                    <Input
                      type="number"
                      value={cap.tpmRequired}
                      onChange={(e) => {
                        const updated = [...formData.capabilities]
                        updated[index] = { ...updated[index], tpmRequired: parseInt(e.target.value) || 0 }
                        updateFormData("capabilities", updated)
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Input
                      placeholder="Brief description of this capability"
                      value={cap.description}
                      onChange={(e) => {
                        const updated = [...formData.capabilities]
                        updated[index] = { ...updated[index], description: e.target.value }
                        updateFormData("capabilities", updated)
                      }}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive"
                  onClick={() => {
                    const updated = formData.capabilities.filter((_, i) => i !== index)
                    updateFormData("capabilities", updated)
                  }}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderSLAParams = () => (
    <div className="space-y-8">
      <div>
        <label className="text-sm font-medium mb-4 block">
          Latency Threshold: {formData.slaParams.latencyThresholdMs}ms
        </label>
        <Slider
          min={100}
          max={10000}
          step={100}
          value={formData.slaParams.latencyThresholdMs}
          onValueChange={(v) =>
            updateFormData("slaParams", { ...formData.slaParams, latencyThresholdMs: Array.isArray(v) ? v[0] : v })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">Maximum acceptable response latency</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">TPM Cap</label>
        <Input
          type="number"
          value={formData.slaParams.tpmCap}
          onChange={(e) =>
            updateFormData("slaParams", {
              ...formData.slaParams,
              tpmCap: parseInt(e.target.value) || 0,
            })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">Maximum tokens per minute this agent can process</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-4 block">
          Uptime Guarantee: {formData.slaParams.uptimeGuaranteePercent}%
        </label>
        <Slider
          min={80}
          max={100}
          step={0.5}
          value={formData.slaParams.uptimeGuaranteePercent}
          onValueChange={(v) =>
            updateFormData("slaParams", { ...formData.slaParams, uptimeGuaranteePercent: Array.isArray(v) ? v[0] : v })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">Minimum uptime SLA guarantee</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Minimum Stake Required</label>
        <Input
          type="number"
          value={formData.slaParams.minStakeRequired}
          onChange={(e) =>
            updateFormData("slaParams", {
              ...formData.slaParams,
              minStakeRequired: parseInt(e.target.value) || 0,
            })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">Minimum stake required from providers to run this agent</p>
      </div>
    </div>
  )

  const renderPricingModel = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Pricing Type</label>
        <Select
          value={formData.pricing.type}
          onValueChange={(v) =>
            updateFormData("pricing", { ...formData.pricing, type: (v ?? formData.pricing.type) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_minute">Per Minute</SelectItem>
            <SelectItem value="per_second">Per Second</SelectItem>
            <SelectItem value="flat_rate">Flat Rate</SelectItem>
            <SelectItem value="tiered">Tiered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.pricing.type === "per_minute" && (
        <div>
          <label className="text-sm font-medium mb-2 block">Price per Minute (MESH)</label>
          <Input
            type="number"
            step="0.0001"
            value={formData.pricing.pricePerMinute || ""}
            onChange={(e) =>
              updateFormData("pricing", {
                ...formData.pricing,
                pricePerMinute: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      )}
      {formData.pricing.type === "per_second" && (
        <div>
          <label className="text-sm font-medium mb-2 block">Price per Second (MESH)</label>
          <Input
            type="number"
            step="0.00001"
            value={formData.pricing.pricePerSecond || ""}
            onChange={(e) =>
              updateFormData("pricing", {
                ...formData.pricing,
                pricePerSecond: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      )}
      {formData.pricing.type === "flat_rate" && (
        <div>
          <label className="text-sm font-medium mb-2 block">Flat Price (MESH)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.pricing.flatPrice || ""}
            onChange={(e) =>
              updateFormData("pricing", {
                ...formData.pricing,
                flatPrice: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      )}
      {formData.pricing.type === "tiered" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Tiered pricing allows different rates at different usage levels.</p>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Basic Tier</p>
            <p className="text-xs text-muted-foreground">Up to 50,000 TPM: {formData.pricing.pricePerMinute || 0.001} MESH/min</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Standard Tier</p>
            <p className="text-xs text-muted-foreground">50,001 - 150,000 TPM: 0.0015 MESH/min</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Premium Tier</p>
            <p className="text-xs text-muted-foreground">150,001+ TPM: 0.002 MESH/min</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderSkillDependencies = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Skill Dependencies</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select which skills this agent requires or can optionally use.
        </p>
      </div>
      <div className="space-y-3">
        {MOCK_SKILLS.map((skill) => {
          const existing = formData.skillDependencies.find((d) => d.skillId === skill.id)
          return (
            <Card key={skill.id}>
              <CardContent className="flex items-start justify-between pt-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={!!existing}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("skillDependencies", [
                          ...formData.skillDependencies,
                          { skillId: skill.id, required: false },
                        ])
                      } else {
                        updateFormData(
                          "skillDependencies",
                          formData.skillDependencies.filter((d) => d.skillId !== skill.id)
                        )
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        v{skill.version}
                      </Badge>
                    </div>
                  </div>
                </div>
                {existing && (
                  <div className="flex items-center space-x-2">
                    <label className="text-xs">Required</label>
                    <Switch
                      checked={existing.required}
                      onCheckedChange={(checked) => {
                        const updated = formData.skillDependencies.map((d) =>
                          d.skillId === skill.id ? { ...d, required: checked } : d
                        )
                        updateFormData("skillDependencies", updated)
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderSelfLearningConfig = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Self-Learning</h3>
          <p className="text-sm text-muted-foreground">Enable the agent to learn from session data</p>
        </div>
        <Switch
          checked={formData.learningEnabled}
          onCheckedChange={(checked) => updateFormData("learningEnabled", checked)}
        />
      </div>
      {formData.learningEnabled && (
        <>
          <Separator />
          <div>
            <label className="text-sm font-medium mb-2 block">Memory Retention Period</label>
            <Select
              value={formData.memoryRetentionPeriod}
              onValueChange={(v) => updateFormData("memoryRetentionPeriod", v ?? formData.memoryRetentionPeriod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">How long to retain learned patterns</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-4 block">
              Auto-Approve Threshold: {formData.autoApproveThreshold}/5
            </label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={formData.autoApproveThreshold}
              onValueChange={(v) => updateFormData("autoApproveThreshold", Array.isArray(v) ? v[0] : v)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum rating to auto-approve learning without builder review
            </p>
          </div>
        </>
      )}
    </div>
  )

  const renderTesting = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Test Your Agent</h3>
        <p className="text-sm text-muted-foreground">Enter a test query to simulate agent responses.</p>
      </div>
      <Textarea
        placeholder="Enter a test query (e.g., 'What are the current yield rates for Aave lending pools?')"
        value={formData.testQuery}
        onChange={(e) => updateFormData("testQuery", e.target.value)}
        rows={4}
      />
      <Button onClick={handleRunTest} disabled={!formData.testQuery || isTesting}>
        {isTesting ? "Running..." : "Run Test"}
      </Button>
      {testResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Response</CardTitle>
            {testLatency && (
              <CardDescription>Latency: {testLatency}ms</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{testResponse}</p>
          </CardContent>
        </Card>
      )}
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
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div>
              <CardTitle>{formData.name || "Untitled Agent"}</CardTitle>
              <CardDescription>{formData.category || "No category"}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{formData.description || "No description provided."}</p>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2">Capabilities</h4>
            {formData.capabilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.capabilities.map((cap) => (
                  <Badge key={cap.id} variant="secondary">
                    {cap.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No capabilities defined.</p>
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Pricing</p>
              <p className="font-medium">
                {formData.pricing.type === "per_minute" && `${formData.pricing.pricePerMinute} MESH/min`}
                {formData.pricing.type === "per_second" && `${formData.pricing.pricePerSecond} MESH/sec`}
                {formData.pricing.type === "flat_rate" && `${formData.pricing.flatPrice} MESH flat`}
                {formData.pricing.type === "tiered" && "Tiered pricing"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">SLA Latency</p>
              <p className="font-medium">{formData.slaParams.latencyThresholdMs}ms</p>
            </div>
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">{formData.slaParams.uptimeGuaranteePercent}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Min Stake</p>
              <p className="font-medium">{formData.slaParams.minStakeRequired} MESH</p>
            </div>
          </div>
          {formData.skillDependencies.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skillDependencies.map((dep) => {
                    const skill = MOCK_SKILLS.find((s) => s.id === dep.skillId)
                    return (
                      <Badge key={dep.skillId} variant={dep.required ? "default" : "outline"}>
                        {skill?.name || dep.skillId}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPublish = () => {
    const checklist = [
      { label: "Agent name is set", done: !!formData.name },
      { label: "Description is complete", done: !!formData.description },
      { label: "Category is selected", done: !!formData.category },
      { label: "At least one capability defined", done: formData.capabilities.length > 0 },
      { label: "SLA parameters configured", done: formData.slaParams.tpmCap > 0 },
      { label: "Pricing model set", done: !!formData.pricing.type },
    ]
    const allComplete = checklist.every((item) => item.done)

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Final Review</h3>
          <p className="text-sm text-muted-foreground">Verify all settings before publishing.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                      item.done ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {item.done ? "✓" : i + 1}
                  </div>
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button className="flex-1" disabled={!allComplete}>
            Publish Now
          </Button>
        </div>
        {!allComplete && (
          <p className="text-xs text-muted-foreground text-center">
            Complete all checklist items to publish your agent.
          </p>
        )}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo()
      case 1:
        return renderCapabilities()
      case 2:
        return renderSLAParams()
      case 3:
        return renderPricingModel()
      case 4:
        return renderSkillDependencies()
      case 5:
        return renderSelfLearningConfig()
      case 6:
        return renderTesting()
      case 7:
        return renderPreview()
      case 8:
        return renderPublish()
      default:
        return null
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
        <p className="text-muted-foreground">Build and configure your AI agent for the network.</p>
      </div>
      {renderStepIndicator()}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep]}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {STEPS.length}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          Back
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : null}
      </div>
    </div>
  )
}