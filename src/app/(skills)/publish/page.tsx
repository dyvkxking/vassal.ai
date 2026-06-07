"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Plus, Trash2, ArrowLeft, ArrowRight, Send } from "lucide-react"

const STEPS = [
  { id: 1, title: "Skill Info", description: "Basic information about your skill" },
  { id: 2, title: "Technical Spec", description: "Input/output schemas and parameters" },
  { id: 3, title: "Pricing", description: "Set your pricing model" },
  { id: 4, title: "Documentation", description: "Usage guides and examples" },
  { id: 5, title: "Review & Submit", description: "Review and submit for audit" },
]

const CATEGORIES = [
  "AI & Machine Learning",
  "Data Processing",
  "Web & API",
  "Communication",
  "Automation",
  "Analytics",
  "Security",
  "Development Tools",
  "Content & Media",
  "Business & Finance",
]

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
  description: string
}

interface Example {
  id: string
  content: string
}

export default function PublishSkillPage() {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Skill Info
  const [skillName, setSkillName] = useState("")
  const [skillDescription, setSkillDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [logoUrl, setLogoUrl] = useState("")

  // Step 2: Technical Spec
  const [inputSchema, setInputSchema] = useState("")
  const [outputSchema, setOutputSchema] = useState("")
  const [parameters, setParameters] = useState<Parameter[]>([])
  const [examples, setExamples] = useState<Example[]>([])

  // Step 3: Pricing
  const [pricePerInvocation, setPricePerInvocation] = useState("")
  const [isPaid, setIsPaid] = useState(false)

  // Step 4: Documentation
  const [readme, setReadme] = useState("")
  const [usageExamples, setUsageExamples] = useState("")
  const [bestPractices, setBestPractices] = useState("")

  const addParameter = () => {
    setParameters([
      ...parameters,
      { id: crypto.randomUUID(), name: "", type: "string", required: false, description: "" },
    ])
  }

  const removeParameter = (id: string) => {
    setParameters(parameters.filter((p) => p.id !== id))
  }

  const updateParameter = (id: string, field: keyof Parameter, value: string | boolean) => {
    setParameters(parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addExample = () => {
    setExamples([...examples, { id: crypto.randomUUID(), content: "" }])
  }

  const removeExample = (id: string) => {
    setExamples(examples.filter((e) => e.id !== id))
  }

  const updateExample = (id: string, content: string) => {
    setExamples(examples.map((e) => (e.id === id ? { ...e, content } : e)))
  }

  const handleSubmit = () => {
    const skillData = {
      skillName,
      skillDescription,
      category,
      tags,
      logoUrl,
      inputSchema,
      outputSchema,
      parameters,
      examples,
      pricePerInvocation,
      isPaid,
      readme,
      usageExamples,
      bestPractices,
    }
    console.log("Submitting skill:", skillData)
    alert("Skill submitted for audit! (Check console for data)")
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step.id < currentStep
                    ? "bg-primary border-primary cursor-pointer"
                    : step.id === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-muted"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </button>
              <span className={`mt-2 text-xs font-medium ${step.id === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${step.id < currentStep ? "bg-primary" : "bg-muted-foreground/30"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Skill Name
        </label>
        <Input
          className="mt-2"
          placeholder="Enter your skill name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Description
        </label>
        <Textarea
          className="mt-2 min-h-32"
          placeholder="Describe what your skill does and how it works"
          value={skillDescription}
          onChange={(e) => setSkillDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Category
        </label>
        <Select value={category} onValueChange={(v) => setCategory(v ?? category)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Tags
        </label>
        <Input
          className="mt-2"
          placeholder="Enter tags separated by commas (e.g., ai, automation, api)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Separate tags with commas</p>
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Logo URL
        </label>
        <Input
          className="mt-2"
          placeholder="https://example.com/logo.png"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Optional: URL to your skill&apos;s logo image</p>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Input Schema (JSON)
        </label>
        <Textarea
          className="mt-2 font-mono text-xs min-h-28"
          placeholder='{"type": "object", "properties": {...}}'
          value={inputSchema}
          onChange={(e) => setInputSchema(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Define the JSON schema for skill input</p>
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Output Schema (JSON)
        </label>
        <Textarea
          className="mt-2 font-mono text-xs min-h-28"
          placeholder='{"type": "object", "properties": {...}}'
          value={outputSchema}
          onChange={(e) => setOutputSchema(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Define the JSON schema for skill output</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            Parameters
          </label>
          <Button variant="outline" size="sm" onClick={addParameter}>
            <Plus className="size-4 mr-1" /> Add Parameter
          </Button>
        </div>

        {parameters.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No parameters defined. Click &quot;Add Parameter&quot; to define skill parameters.
          </p>
        ) : (
          <div className="space-y-3">
            {parameters.map((param, index) => (
              <Card key={param.id} size="sm">
                <CardContent className="pt-3">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <Input
                        placeholder="Name"
                        value={param.name}
                        onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select value={param.type} onValueChange={(v) => updateParameter(param.id, "type", v ?? param.type)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">string</SelectItem>
                          <SelectItem value="number">number</SelectItem>
                          <SelectItem value="boolean">boolean</SelectItem>
                          <SelectItem value="object">object</SelectItem>
                          <SelectItem value="array">array</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Description"
                        value={param.description}
                        onChange={(e) => updateParameter(param.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <label className="text-xs whitespace-nowrap">Required</label>
                      <Switch
                        checked={param.required}
                        onCheckedChange={(v) => updateParameter(param.id, "required", v)}
                        size="sm"
                      />
                      <Button variant="ghost" size="icon-xs" onClick={() => removeParameter(param.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            Examples
          </label>
          <Button variant="outline" size="sm" onClick={addExample}>
            <Plus className="size-4 mr-1" /> Add Example
          </Button>
        </div>

        {examples.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No examples added. Click &quot;Add Example&quot; to add usage examples.
          </p>
        ) : (
          <div className="space-y-3">
            {examples.map((example) => (
              <div key={example.id} className="flex gap-3">
                <Textarea
                  className="font-mono text-xs flex-1"
                  placeholder='{"input": "example", "output": "result"}'
                  value={example.content}
                  onChange={(e) => updateExample(example.id, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeExample(example.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Price per Invocation
        </label>
        <div className="mt-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            type="number"
            step="0.001"
            min="0"
            className="pl-7"
            placeholder="0.00"
            value={pricePerInvocation}
            onChange={(e) => setPricePerInvocation(e.target.value)}
            disabled={!isPaid}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Price in $MESH per skill invocation</p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">Paid Skill</p>
          <p className="text-sm text-muted-foreground">Charge users for each skill invocation</p>
        </div>
        <Switch checked={isPaid} onCheckedChange={setIsPaid} />
      </div>

      {isPaid && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm">
              <strong>Pricing Preview:</strong> Users will pay <span className="font-medium">${pricePerInvocation || "0.00"}</span> $MESH per
              invocation of your skill.
            </p>
          </CardContent>
        </Card>
      )}

      {!isPaid && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm">
              <strong>Free Skill:</strong> Your skill will be available at no cost to all users.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          README
        </label>
        <Textarea
          className="mt-2 min-h-40"
          placeholder="Write a comprehensive README for your skill. Include installation instructions, dependencies, and overview."
          value={readme}
          onChange={(e) => setReadme(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Usage Examples
        </label>
        <Textarea
          className="mt-2 min-h-32"
          placeholder="Provide code examples and usage scenarios for your skill"
          value={usageExamples}
          onChange={(e) => setUsageExamples(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          Best Practices
        </label>
        <Textarea
          className="mt-2 min-h-32"
          placeholder="Document best practices, common use cases, and tips for getting the most out of your skill"
          value={bestPractices}
          onChange={(e) => setBestPractices(e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Information</CardTitle>
          <CardDescription>Basic details about your skill</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{skillName || <span className="text-muted-foreground">Not set</span>}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">{category || <span className="text-muted-foreground">Not set</span>}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm">{skillDescription || <span className="text-muted-foreground">Not set</span>}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {tags ? (
                tags.split(",").map((tag, i) => (
                  <Badge key={i} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No tags</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Specification</CardTitle>
          <CardDescription>Schemas and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Input Schema</p>
            <pre className="mt-1 text-xs bg-muted p-2 rounded-md overflow-x-auto">
              {inputSchema || "Not defined"}
            </pre>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Output Schema</p>
            <pre className="mt-1 text-xs bg-muted p-2 rounded-md overflow-x-auto">
              {outputSchema || "Not defined"}
            </pre>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Parameters</p>
            {parameters.length > 0 ? (
              <div className="mt-2 space-y-2">
                {parameters.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{p.type}</Badge>
                    <span className="font-medium">{p.name}</span>
                    {p.required && <Badge>required</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-muted-foreground text-sm">No parameters defined</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Examples</p>
            <p className="mt-1 text-sm">{examples.length > 0 ? `${examples.length} example(s) added` : "No examples"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Your pricing model</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-medium">
            {isPaid ? `$${pricePerInvocation || "0.00"} $MESH per invocation` : "Free - No charge"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>README and guides</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">README</p>
            <p className="text-sm">{readme ? "Provided" : "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Usage Examples</p>
            <p className="text-sm">{usageExamples ? "Provided" : "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Practices</p>
            <p className="text-sm">{bestPractices ? "Provided" : "Not provided"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return null
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold">Publish New Skill</h1>
        <p className="text-muted-foreground mt-1">Create and submit your skill to the registry</p>
      </div>

      {renderStepIndicator()}

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderCurrentStep()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="size-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}>
              Next
              <ArrowRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Send className="size-4 mr-2" />
              Submit for Audit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}