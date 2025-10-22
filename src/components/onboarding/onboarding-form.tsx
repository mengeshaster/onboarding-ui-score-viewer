'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, OnboardingFormData } from "@/lib/validations/onboarding"
import { OnboardingCreateRequest } from "@/lib/types/api"
import { useCreateOnboardingSession } from '@/lib/hooks/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BasicInfoStep } from './steps/basic-info-step'
import { PreferencesStep } from './steps/preferences-step'
import { ReviewStep } from './steps/review-step'
import { StepIndicator } from './step-indicator'

interface OnboardingFormProps {
  onComplete: (data: { sessionId: string; score: number; userId: string }) => void
  onReset?: () => void
}

const STEPS = [
  { id: 'basic-info', title: 'Basic Information', description: 'Tell us about yourself' },
  { id: 'preferences', title: 'Preferences', description: 'Set your preferences' },
  { id: 'review', title: 'Review & Submit', description: 'Review your information and submit' },
]

export function OnboardingForm({ onComplete, onReset }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const createUser = useCreateOnboardingSession()

  // Get saved form data from localStorage or use empty defaults
  const getSavedFormData = (): Partial<OnboardingFormData> => {
    if (typeof window === 'undefined') return {}
    
    try {
      const savedData = localStorage.getItem('onboarding-form-data')
      return savedData ? JSON.parse(savedData) : {}
    } catch {
      return {}
    }
  }

  // Get saved step from localStorage
  const getSavedStep = (): number => {
    if (typeof window === 'undefined') return 0
    
    try {
      const savedStep = localStorage.getItem('onboarding-current-step')
      const step = savedStep ? parseInt(savedStep, 10) : 0
      // Ensure step is within valid range (0-2 for 3 steps)
      return Math.max(0, Math.min(step, STEPS.length - 1))
    } catch {
      return 0
    }
  }

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      investmentGoals: [],
      flags: [],
      ...getSavedFormData()
    },
  })

  const { handleSubmit, trigger, formState: { isValid }, reset, watch } = form

  // Initialize step from localStorage on component mount
  useEffect(() => {
    const savedStep = getSavedStep()
    setCurrentStep(savedStep)
  }, [])

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    const subscription = watch((value: any) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding-form-data', JSON.stringify(value))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure step is within valid range
      const validStep = Math.max(0, Math.min(currentStep, STEPS.length - 1))
      localStorage.setItem('onboarding-current-step', validStep.toString())
    }
  }, [currentStep])

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      // Generate userId if not provided
      const userId = data.userId || crypto.randomUUID()

      // Transform form data to match API request format
      const requestData: OnboardingCreateRequest = {
        userId,
        rawInput: {
          personalInfo: {
            age: data.age,
            income: data.income,
            employment: data.employment as 'full-time' | 'part-time' | 'unemployed' | 'self-employed' | 'retired',
            education: data.education as 'high-school' | 'bachelors' | 'masters' | 'phd' | 'other',
          },
          preferences: {
            riskTolerance: data.riskTolerance as 'low' | 'moderate' | 'high',
            investmentGoals: data.investmentGoals,
            timeHorizon: data.timeHorizon as 'short' | 'medium' | 'long',
          },
          flags: [],
        }
      }

      const result = await createUser.mutateAsync(requestData)
      
      // Clear localStorage and reset form after successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding-form-data')
        localStorage.removeItem('onboarding-current-step')
      }
      
      reset({
        investmentGoals: [],
        flags: [],
      })
      setCurrentStep(0)
      onComplete({
        sessionId: result.id,
        userId: userId,
        score: result.score || 0,
      })
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const nextStep = async () => {
    const stepFields = getStepFields(currentStep)
    const isStepValid = await trigger(stepFields)

    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const startOver = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding-form-data')
      localStorage.removeItem('onboarding-current-step')
    }
    reset({
      investmentGoals: [],
      flags: [],
    })
    setCurrentStep(0)
    onReset?.()
  }

  // Clear any invalid localStorage data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('onboarding-current-step')
      if (savedStep) {
        const step = parseInt(savedStep, 10)
        // If saved step is beyond current step range, clear it
        if (step >= STEPS.length) {
          localStorage.removeItem('onboarding-current-step')
          setCurrentStep(0)
        }
      }
    }
  }, [])

  const getStepFields = (step: number): (keyof OnboardingFormData)[] => {
    switch (step) {
      case 0:
        return ["age", "income", "employment", "education"]
      case 1:
        return ["riskTolerance", "investmentGoals", "timeHorizon"]
      case 2:
        return []
      default:
        return []
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />
      case 1:
        return <PreferencesStep form={form} />
      case 2:
        return <ReviewStep form={form} />
      default:
        return null
    }
  }

  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">{STEPS[currentStep].title}</CardTitle>
        <CardDescription className="text-sm">{STEPS[currentStep].description}</CardDescription>
        <StepIndicator currentStep={currentStep} steps={STEPS} />
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderStep()}

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
            <div className="flex gap-2 order-2 sm:order-1">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={startOver}
                className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
              >
                Start Over
              </Button>
            </div>

            <div className="order-1 sm:order-2">
              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={!isValid || createUser.isPending}
                  className="w-full sm:w-auto"
                >
                  {createUser.isPending ? 'Calculating Score...' : 'Complete Assessment'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
