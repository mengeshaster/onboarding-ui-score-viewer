import { z } from 'zod'

export const onboardingSchema = z.object({
  // User ID (will be generated if not provided)
  userId: z.string().uuid().optional(),

  // Personal Information
  age: z
    .number()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be less than 100'),
  income: z
    .number()
    .min(0, 'Income must be positive'),
  employment: z.string().min(1, 'Please select your employment status').refine(
    (val: string) => ['full-time', 'part-time', 'unemployed', 'self-employed', 'retired'].includes(val),
    'Please select a valid employment status'
  ),
  education: z.string().min(1, 'Please select your education level').refine(
    (val: string) => ['high-school', 'bachelors', 'masters', 'phd', 'other'].includes(val),
    'Please select a valid education level'
  ),

  // Preferences
  riskTolerance: z.string().min(1, 'Please select your risk tolerance').refine(
    (val: string) => ['low', 'moderate', 'high'].includes(val),
    'Please select a valid risk tolerance'
  ),
  investmentGoals: z
    .array(z.string())
    .min(1, 'Please select at least one investment goal'),
  timeHorizon: z.string().min(1, 'Please select your time horizon').refine(
    (val: string) => ['short', 'medium', 'long'].includes(val),
    'Please select a valid time horizon'
  ),

  // Flags
  flags: z.array(z.string()).default([]),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>

// Form step validation schemas
export const personalInfoSchema = onboardingSchema.pick({
  age: true,
  income: true,
  employment: true,
  education: true,
})

export const preferencesSchema = onboardingSchema.pick({
  riskTolerance: true,
  investmentGoals: true,
  timeHorizon: true,
})

export const flagsSchema = onboardingSchema.pick({
  flags: true,
})

export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type PreferencesData = z.infer<typeof preferencesSchema>
export type FlagsData = z.infer<typeof flagsSchema>