import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingApi } from '@/lib/api/endpoints'
import { OnboardingCreateRequest } from '@/lib/types/api'

// Query keys
export const queryKeys = {
  onboarding: ['onboarding'] as const,
  onboardingSession: (id: string) => ['onboarding', id] as const,
  allSessions: ['onboarding', 'all'] as const,
  recentSessions: (userId: string) => ['onboarding', 'recent', userId] as const,
}

// Onboarding hooks
export const useCreateOnboardingSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OnboardingCreateRequest) => onboardingApi.createSession(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.onboardingSession(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.allSessions })
      // Also invalidate recent sessions for this user
      queryClient.invalidateQueries({ queryKey: queryKeys.recentSessions(data.userId) })
    },
  })
}

export const useOnboardingSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: queryKeys.onboardingSession(sessionId || ''),
    queryFn: () => onboardingApi.getSession(sessionId!),
    enabled: !!sessionId,
  })
}

export const useRecentOnboardingSessions = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.recentSessions(userId || ''),
    queryFn: () => onboardingApi.getRecentSessions(userId!),
    enabled: !!userId,
  })
}

export const useAllOnboardingSessions = () => {
  return useQuery({
    queryKey: queryKeys.allSessions,
    queryFn: () => onboardingApi.getAllSessions(),
  })
}

export const useDeleteOnboardingSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => onboardingApi.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({ queryKey: queryKeys.onboardingSession(sessionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.allSessions })
      // Note: We don't have userId here, so we'll invalidate all recent sessions
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'recent'] })
    },
  })
}
