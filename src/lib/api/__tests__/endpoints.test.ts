import { describe, it, expect, vi, beforeEach } from 'vitest'
import { onboardingApi } from '../endpoints'
import { apiClient } from '../client'
import { SessionSummary } from '@/lib/types/api'

// Mock the API client
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('onboardingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSessions', () => {
    it('should call the correct endpoint with current datetime and pagination by default', async () => {
      // Mock server response (simple array, not paginated)
      const mockServerResponse = [
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
      ]

      // Mock the API client response
      vi.mocked(apiClient.get).mockResolvedValue(mockServerResponse)

      // Call the API method
      const result = await onboardingApi.getSessions()

      // Verify the correct endpoint was called with datetime and pagination parameters
      expect(apiClient.get).toHaveBeenCalledWith('/v1/onboarding/sessions', { 
        datetime: expect.any(String),
        page: 1,
        limit: 10,
        order: 'desc'
      })
      expect(apiClient.get).toHaveBeenCalledTimes(1)

      // Verify the result is paginated client-side
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('pagination')
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toHaveProperty('id')
      expect(result.data[0]).toHaveProperty('createdAt')
      expect(result.data[0]).toHaveProperty('score')
      expect(result.pagination).toHaveProperty('page', 1)
      expect(result.pagination).toHaveProperty('limit', 10)
      expect(result.pagination).toHaveProperty('total', 2)
    })

    it('should accept custom datetime and pagination parameters', async () => {
      // Mock server response with more items to test pagination
      const mockServerResponse = [
        { id: "1", createdAt: "2025-10-23T10:30:00.000Z", score: 78 },
        { id: "2", createdAt: "2025-10-23T10:25:00.000Z", score: 82 },
        { id: "3", createdAt: "2025-10-23T10:20:00.000Z", score: 75 },
        { id: "4", createdAt: "2025-10-23T10:15:00.000Z", score: 80 },
        { id: "5", createdAt: "2025-10-23T10:10:00.000Z", score: 85 },
        { id: "6", createdAt: "2025-10-23T10:05:00.000Z", score: 77 },
        { id: "7", createdAt: "2025-10-23T10:00:00.000Z", score: 79 }
      ]
      const customDateTime = '2025-10-23T10:30:00.000Z'

      vi.mocked(apiClient.get).mockResolvedValue(mockServerResponse)

      const result = await onboardingApi.getSessions(customDateTime, 2, 5)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/onboarding/sessions', { 
        datetime: customDateTime,
        page: 2,
        limit: 5,
        order: 'desc'
      })

      // Verify pagination works correctly (page 2, limit 5)
      expect(result.data).toHaveLength(2) // Items 6-7 (remaining items on page 2)
      expect(result.data[0].id).toBe("6")
      expect(result.data[1].id).toBe("7")
      expect(result.pagination.page).toBe(2)
      expect(result.pagination.limit).toBe(5)
      expect(result.pagination.total).toBe(7)
      expect(result.pagination.totalPages).toBe(2)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrev).toBe(true)
    })

    it('should handle API errors properly', async () => {
      const mockError = new Error('API Error')
      vi.mocked(apiClient.get).mockRejectedValue(mockError)

      await expect(onboardingApi.getSessions()).rejects.toThrow('API Error')
      expect(apiClient.get).toHaveBeenCalledWith('/v1/onboarding/sessions', { 
        datetime: expect.any(String),
        page: 1,
        limit: 10,
        order: 'desc'
      })
    })
  })
})