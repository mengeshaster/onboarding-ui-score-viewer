import { apiClient } from './client'
import {
  OnboardingCreateRequest,
  OnboardingSession,
  SessionSummary,
  PaginatedSessionsResponse
} from '@/lib/types/api'

export const onboardingApi = {
  // Create a new onboarding session
  createSession: async (data: OnboardingCreateRequest): Promise<OnboardingSession> => {
    return apiClient.post<OnboardingSession>('/onboarding', data)
  },

  // Get an existing onboarding session by ID
  getSession: async (sessionId: string): Promise<OnboardingSession> => {
    return apiClient.get<OnboardingSession>(`/onboarding/${sessionId}`)
  },

  // Get recent onboarding sessions for a user (for history)
  getRecentSessions: async (userId: string): Promise<OnboardingSession[]> => {
    return apiClient.get<OnboardingSession[]>(`/onboarding/recent/${userId}`)
  },

  // Get all onboarding sessions (assessment history) with pagination
  // Gets assessments from the last 24 hours by default, ordered latest first
  // Server handles pagination and returns the structured response
  getSessions: async (
    fromDateTime?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedSessionsResponse> => {
    try {
      // If no date provided, use current date-time (will get last 24 hours)
      const datetime = fromDateTime || new Date().toISOString()
      
      console.log('Making API request to:', '/onboarding/sessions')
      console.log('With params:', { datetime, page, limit, order: 'desc' })
      
      const response = await apiClient.get<PaginatedSessionsResponse>('/onboarding/sessions', { 
        datetime,
        page,
        limit,
        order: 'desc' // Latest first
      })
      
      console.log('API response received:', response)
      
      // Server returns the complete paginated response structure
      return response
    } catch (error) {
      const datetime = fromDateTime || new Date().toISOString()
      console.error('Error fetching sessions:', error)
      console.error('Request details:', {
        url: '/onboarding/sessions',
        params: { datetime, page, limit, order: 'desc' }
      })
      
      // Log more detailed error information
      if (error && typeof error === 'object') {
        if ('error' in error) {
          console.error('API Error details:', (error as any).error)
        }
        if ('response' in error) {
          console.error('HTTP Response details:', (error as any).response)
        }
      }
      
      // Re-throw the error so React Query can handle it properly
      throw error
    }
  }
}
