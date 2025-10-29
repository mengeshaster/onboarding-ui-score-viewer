import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingApi } from '@/lib/api/endpoints'
import { OnboardingCreateRequest, OnboardingSession } from '@/lib/types/api'

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
    onSuccess: (data: OnboardingSession) => {
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
    queryFn: () => onboardingApi.getSessions(),
  })
}

export const useSessionsHistory = (
  fromDateTime?: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['onboarding', 'sessions', fromDateTime, page, limit],
    queryFn: () => onboardingApi.getSessions(fromDateTime, page, limit),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: (failureCount: number, error: unknown) => {
      // Don't retry on 404 errors
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as any
        if (apiError.error?.code === '404' || apiError.response?.status === 404) {
          return false
        }
      }
      return failureCount < 2 // Retry up to 2 times for other errors
    },
  })
}


