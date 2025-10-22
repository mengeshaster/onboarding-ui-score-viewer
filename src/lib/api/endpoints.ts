import { apiClient } from './client'
import {
  OnboardingCreateRequest,
  OnboardingSession
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

  // Get all onboarding sessions (admin endpoint)
  getAllSessions: async (): Promise<OnboardingSession[]> => {
    return apiClient.get<OnboardingSession[]>('/onboarding')
  },

  // Delete an onboarding session
  deleteSession: async (sessionId: string): Promise<void> => {
    return apiClient.delete<void>(`/onboarding/${sessionId}`)
  }
}
