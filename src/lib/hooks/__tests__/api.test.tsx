import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSessionsHistory } from '../api'
import { onboardingApi } from '@/lib/api/endpoints'
import { SessionSummary, PaginatedSessionsResponse } from '@/lib/types/api'
import { ReactNode } from 'react'

// Mock the API
vi.mock('@/lib/api/endpoints', () => ({
  onboardingApi: {
    getSessions: vi.fn(),
  },
}))

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  return TestWrapper
}

describe('useSessionsHistory', () => {
  it('should fetch sessions history successfully with default datetime and pagination', async () => {
    const mockResponse: PaginatedSessionsResponse = {
      data: [
        {
          id: "456e7890-e89b-12d3-a456-426614174001",
          createdAt: "2025-10-24T10:30:00.000Z",
          score: 78
        },
        {
          id: "456e7890-e89b-12d3-a456-426614174002",
          createdAt: "2025-10-24T10:15:00.000Z",
          score: 82
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }

    vi.mocked(onboardingApi.getSessions).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSessionsHistory(), {
      wrapper: createWrapper(),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check the results
    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
    expect(onboardingApi.getSessions).toHaveBeenCalledWith(undefined, 1, 10)
    expect(onboardingApi.getSessions).toHaveBeenCalledTimes(1)
  })

  it('should fetch sessions history with custom datetime and pagination', async () => {
    const mockResponse: PaginatedSessionsResponse = {
      data: [],
      pagination: {
        page: 2,
        limit: 5,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: true
      }
    }
    const customDateTime = '2025-10-23T10:30:00.000Z'

    vi.mocked(onboardingApi.getSessions).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSessionsHistory(customDateTime, 2, 5), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(onboardingApi.getSessions).toHaveBeenCalledWith(customDateTime, 2, 5)
  })

  it('should handle API errors', async () => {
    const mockError = new Error('API Error')
    vi.mocked(onboardingApi.getSessions).mockRejectedValue(mockError)

    const { result } = renderHook(() => useSessionsHistory(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
  })
})