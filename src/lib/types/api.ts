// Types matching the actual server OpenAPI schema
export interface OnboardingCreateRequest {
  userId: string // UUID format
  rawInput: {
    personalInfo?: {
      age?: number // 18-100
      income?: number // minimum 0
      employment?: 'full-time' | 'part-time' | 'unemployed' | 'self-employed' | 'retired'
      education?: 'high-school' | 'bachelors' | 'masters' | 'phd' | 'other'
    }
    preferences?: {
      riskTolerance?: 'low' | 'moderate' | 'high'
      investmentGoals?: string[]
      timeHorizon?: 'short' | 'medium' | 'long'
    }
    flags?: string[] // Risk flags or special considerations
  }
}

export interface OnboardingSession {
  id: string // UUID
  userId: string // UUID
  createdAt: string // ISO date-time
  rawInput: Record<string, any>
  parsedData: Record<string, any>
  score: number | null // 0-100
  scoreExplanation: string | null
  sourceIp: string | null
  userAgent: string | null
}

export interface RecentSessionSummary {
  id: string // UUID
  createdAt: string // ISO date-time
  score: number | null // 0-100
}

export interface SessionSummary {
  id: string // UUID
  createdAt: string // ISO date-time
  score: number // 0-100
}

export interface PaginatedSessionsResponse {
  data: SessionSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  meta: {
    datetime: string
    order: string
    source: string
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

// Form data type for the frontend form
export interface OnboardingFormData {
  // User identification
  userId?: string
  
  // Personal Information
  age: number
  income: number
  employment: 'full-time' | 'part-time' | 'unemployed' | 'self-employed' | 'retired'
  education: 'high-school' | 'bachelors' | 'masters' | 'phd' | 'other'
  
  // Preferences
  riskTolerance: 'low' | 'moderate' | 'high'
  investmentGoals: string[]
  timeHorizon: 'short' | 'medium' | 'long'
  
  // Flags
  flags: string[]
}