"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from 'lucide-react'

interface LoadingPageProps {
  step?: string
  totalSteps?: number
  currentStep?: number
}

function StepIndicator({ currentStep = 1, totalSteps = 5 }: LoadingPageProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              step <= currentStep
                ? "bg-violet-500 scale-110"
                : "bg-muted-foreground/30"
            )}
          />
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "h-0.5 w-6 transition-all duration-300",
                step < currentStep ? "bg-violet-500" : "bg-muted-foreground/30"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OnboardingLoadingPage({ step, totalSteps = 5, currentStep = 1 }: LoadingPageProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 200)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-xl">V</span>
        </div>
      </div>

      {/* Loading Content */}
      <div className="w-full max-w-sm space-y-8">
        {/* Step Indicator */}
        <div className="flex flex-col items-center gap-4">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          {step && (
            <p className="text-sm text-muted-foreground animate-pulse">{step}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 90)}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Setting up your account{dots}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>
    </div>
  )
}