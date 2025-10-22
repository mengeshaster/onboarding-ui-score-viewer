import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ApiError } from '@/lib/types/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY
        if (apiKey) {
          config.headers['x-api-key'] = apiKey
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      error => {
        const apiError: ApiError = {
          error: {
            code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
            message: error.response?.data?.error?.message || error.message || 'Unknown error',
          }
        }
        return Promise.reject(apiError)
      }
    )
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  async post<T>(
    url: string,
    data?: Record<string, any>
  ): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(
    url: string,
    data?: Record<string, any>
  ): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}

export const apiClient = new ApiClient()
export default apiClient