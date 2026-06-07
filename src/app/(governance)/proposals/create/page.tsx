"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, FileText, ListChecks, Calendar, Eye, Send, Beaker, ChevronDown, ChevronUp } from 'lucide-react'

type ProposalType = "protocol_upgrade" | "parameter_change" | "treasury" | "other";

interface ProposalFormData {
  proposalType: ProposalType | "";
  title: string;
  summary: string;
  specification: string;
  implementationPlan: string;
  voteStartDate: string;
  voteEndDate: string;
}

const STEPS = [
  { id: 1, title: "Proposal Type", icon: FileText },
  { id: 2, title: "Title & Summary", icon: ListChecks },
  { id: 3, title: "Full Specification", icon: FileText },
  { id: 4, title: "Implementation Plan", icon: ListChecks },
  { id: 5, title: "Vote Timing", icon: Calendar },
  { id: 6, title: "Review & Submit", icon: Eye },
];

const PROPOSAL_TYPES = [
  { value: "protocol_upgrade", label: "Protocol Upgrade", description: "Changes to the core protocol functionality" },
  { value: "parameter_change", label: "Parameter Change", description: "Adjusting existing protocol parameters" },
  { value: "treasury", label: "Treasury", description: "Treasury spending or fund allocation" },
  { value: "other", label: "Other", description: "Miscellaneous proposals" },
];

export default function CreateProposalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProposalFormData>({
    proposalType: "",
    title: "",
    summary: "",
    specification: "",
    implementationPlan: "",
    voteStartDate: "",
    voteEndDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    parameterChanges: Array<{ parameter: string; current: string; proposed: string; impact: string }>;
    affectedMetrics: Array<{ metric: string; current: string; projected: string; change: string }>;
    riskFactors: string[];
  } | null>(null);

  const updateFormData = <K extends keyof ProposalFormData>(
    field: K,
    value: ProposalFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.proposalType !== "";
      case 2:
        return formData.title.trim() !== "" && formData.summary.trim() !== "";
      case 3:
        return formData.specification.trim() !== "";
      case 4:
        return formData.implementationPlan.trim() !== "";
      case 5:
        return formData.voteStartDate !== "" && formData.voteEndDate !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock simulation results based on proposal type
    const results = {
      parameterChanges: [
        {
          parameter: "LATENCY_BREACH_SLASH_RATE",
          current: "500 bps (5%)",
          proposed: formData.proposalType === "parameter_change" ? "1000 bps (10%)" : "No change",
          impact: formData.proposalType === "parameter_change" ? "+100% penalty rate" : "N/A"
        },
        {
          parameter: "MIN_STAKE_REQUIRED",
          current: "10,000 MESH",
          proposed: formData.proposalType === "protocol_upgrade" ? "15,000 MESH" : "No change",
          impact: formData.proposalType === "protocol_upgrade" ? "+50% stake requirement" : "N/A"
        },
        {
          parameter: "SLA_TIMEOUT_MS",
          current: "5000 ms",
          proposed: formData.proposalType === "parameter_change" ? "3000 ms" : "No change",
          impact: formData.proposalType === "parameter_change" ? "-40% timeout threshold" : "N/A"
        }
      ].filter(r => r.proposed !== "No change"),
      affectedMetrics: [
        { metric: "Provider Profitability", current: "85%", projected: "78%", change: "-7%" },
        { metric: "Client SLA Compliance", current: "72%", projected: "89%", change: "+17%" },
        { metric: "Network Reliability", current: "94%", projected: "97%", change: "+3%" },
        { metric: "Avg Session Cost", current: "$0.05", projected: "$0.055", change: "+10%" }
      ],
      riskFactors: [
        "Small providers may face increased slashes during network volatility",
        "Clients with strict latency needs may experience more service interruptions",
        "Overall network reliability expected to improve based on historical data"
      ]
    };

    // If no parameter changes, show a message
    if (results.parameterChanges.length === 0) {
      results.parameterChanges.push({
        parameter: "General Proposal",
        current: "Current state",
        proposed: "As specified",
        impact: "Review specification for impact"
      });
    }

    setSimulationResults(results);
    setIsSimulating(false);
    setShowSimulation(true);
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl mx-auto py-10">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Proposal Submitted
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              Your proposal has been submitted for governance review.
              The voting period will begin once it is approved.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                ArrowRight Back
              </Button>
              <Button onClick={() => window.location.href = "/proposals"}>
                View All Proposals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Proposal</h1>
        <p className="text-muted-foreground">
          Submit a new proposal for governance voting
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {STEPS[currentStep - 1] && (
              <>
                {(() => {
                  const Icon = STEPS[currentStep - 1].icon;
                  return <Icon className="w-5 h-5" />;
                })()}
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
              </>
            )}
          </div>
          <CardDescription>
            Step {currentStep} of {STEPS.length}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Proposal Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>Select Proposal Type</Label>
              <div className="grid gap-4">
                {PROPOSAL_TYPES.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      formData.proposalType === type.value
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateFormData("proposalType", type.value as ProposalType)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        {formData.proposalType === type.value && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Title & Summary */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title for your proposal"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  maxLength={100}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {formData.title.length}/100
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Executive Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Provide a brief summary of your proposal (1-3 sentences)"
                  value={formData.summary}
                  onChange={(e) => updateFormData("summary", e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {formData.summary.length}/500
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Full Specification */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specification">Full Proposal Specification</Label>
                <p className="text-sm text-muted-foreground">
                  Provide detailed technical specifications, rationale, and any relevant data or analysis.
                </p>
                <Textarea
                  id="specification"
                  placeholder="## Problem&#10;Describe the problem this proposal addresses...&#10;&#10;## Solution&#10;Explain your proposed solution...&#10;&#10;## Technical Details&#10;Include any technical specifications..."
                  value={formData.specification}
                  onChange={(e) => updateFormData("specification", e.target.value)}
                  rows={16}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 4: Implementation Plan */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="implementation">Implementation Plan</Label>
                <p className="text-sm text-muted-foreground">
                  Outline how this proposal will be implemented if approved. Include timelines, milestones, and responsible parties.
                </p>
                <Textarea
                  id="implementation"
                  placeholder="## Implementation Timeline&#10;- Phase 1 (Week 1-2): ...&#10;- Phase 2 (Week 3-4): ...&#10;&#10;## Milestones&#10;1. ...&#10;2. ...&#10;&#10;## Resources Required&#10;- ..."
                  value={formData.implementationPlan}
                  onChange={(e) => updateFormData("implementationPlan", e.target.value)}
                  rows={16}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 5: Vote Timing */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Voting Period Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Set the start and end dates for the voting period. Minimum voting period is 7 days.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="voteStartDate">Voting Start Date</Label>
                  <Input
                    id="voteStartDate"
                    type="date"
                    value={formData.voteStartDate}
                    onChange={(e) => updateFormData("voteStartDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voteEndDate">Voting End Date</Label>
                  <Input
                    id="voteEndDate"
                    type="date"
                    value={formData.voteEndDate}
                    onChange={(e) => updateFormData("voteEndDate", e.target.value)}
                    min={
                      formData.voteStartDate ||
                      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
              </div>
              {formData.voteStartDate && formData.voteEndDate && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Voting Duration:</span>
                      <Badge variant="outline">
                        {Math.ceil(
                          (new Date(formData.voteEndDate).getTime() -
                            new Date(formData.voteStartDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Review Your Proposal</h4>
                <p className="text-sm text-muted-foreground">
                  Please review all details before submitting. Once submitted, the proposal cannot be edited.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Proposal Type</Label>
                  <p className="font-medium mt-1">
                    {PROPOSAL_TYPES.find((t) => t.value === formData.proposalType)?.label}
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium mt-1">{formData.title}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Summary</Label>
                  <p className="mt-1 text-sm">{formData.summary}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Specification</Label>
                  <Card className="mt-2 bg-muted/30">
                    <CardContent className="pt-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono overflow-auto max-h-48">
                        {formData.specification}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Implementation Plan</Label>
                  <Card className="mt-2 bg-muted/30">
                    <CardContent className="pt-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono overflow-auto max-h-48">
                        {formData.implementationPlan}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Voting Start</Label>
                    <p className="font-medium mt-1">
                      {formData.voteStartDate
                        ? new Date(formData.voteStartDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Voting End</Label>
                    <p className="font-medium mt-1">
                      {formData.voteEndDate
                        ? new Date(formData.voteEndDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulation Section */}
              <div className="border-t pt-6">
                <Button
                  variant="outline"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full"
                >
                  {isSimulating ? (
                    <>Simulating...</>
                  ) : (
                    <>
                      <Beaker className="w-4 h-4 mr-2" />
                      Simulate Proposal
                    </>
                  )}
                </Button>

                {/* Simulation Results */}
                {showSimulation && simulationResults && (
                  <Card className="mt-4 border-blue-500/20 bg-blue-500/5">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-blue-600" />
                          Simulation Results
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSimulation(false)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Parameter Changes */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">Expected Parameter Changes</h5>
                        <div className="space-y-2">
                          {simulationResults.parameterChanges.map((change, i) => (
                            <div key={i} className="bg-background/80 rounded-lg p-3 text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-xs font-mono">{change.parameter}</code>
                                <Badge variant="outline" className="text-xs">{change.impact}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{change.current}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="text-blue-600 font-medium">{change.proposed}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Affected Metrics */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">Affected Metrics</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {simulationResults.affectedMetrics.map((metric, i) => (
                            <div key={i} className="bg-background/80 rounded-lg p-3 text-sm">
                              <div className="text-xs text-muted-foreground">{metric.metric}</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-muted-foreground">{metric.current}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="font-medium">{metric.projected}</span>
                              </div>
                              <div className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {metric.change}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Risk Factors */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">Risk Factors</h5>
                        <ul className="space-y-1">
                          {simulationResults.riskFactors.map((risk, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-amber-600">*</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            {showSimulation && (
              <Button
                variant="ghost"
                onClick={() => setShowSimulation(false)}
              >
                Hide Simulation
              </Button>
            )}
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
