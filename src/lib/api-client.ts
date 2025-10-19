/**
 * API Client with Retry Logic and Error Handling
 * Provides automatic retries for network failures and structured error handling
 */

import { parseApiError, NetworkError } from './errors'
import { logger, logApiCall } from './logger'

interface RetryConfig {
  maxRetries: number
  retryDelay: number // milliseconds
  retryableStatuses: number[] // HTTP status codes that should trigger retry
}

interface FetchOptions extends RequestInit {
  retry?: Partial<RetryConfig>
  timeout?: number // milliseconds
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if error should trigger retry
 */
function shouldRetry(error: any, retryCount: number, config: RetryConfig): boolean {
  if (retryCount >= config.maxRetries) {
    return false
  }

  // Retry on network errors
  if (error instanceof NetworkError || error.name === 'NetworkError') {
    return true
  }

  // Retry on specific HTTP status codes
  const status = error.status || error.response?.status
  if (status && config.retryableStatuses.includes(status)) {
    return true
  }

  return false
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new NetworkError('Request timeout', { url, timeout })
    }
    throw error
  }
}

/**
 * Enhanced fetch with retry logic and error handling
 */
export async function apiClient<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retry = {},
    timeout = DEFAULT_TIMEOUT,
    ...fetchOptions
  } = options

  const retryConfig: RetryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...retry
  }

  let lastError: any
  let retryCount = 0

  while (retryCount <= retryConfig.maxRetries) {
    try {
      // Log API call
      logApiCall(
        fetchOptions.method || 'GET',
        url,
        fetchOptions.body
      )

      // Make request with timeout
      const response = await fetchWithTimeout(url, fetchOptions, timeout)

      // Parse response
      const data = await response.json()

      // Check for errors
      if (!response.ok) {
        const error = parseApiError({
          status: response.status,
          response: { data }
        })

        // Log error
        logApiCall(
          fetchOptions.method || 'GET',
          url,
          fetchOptions.body,
          undefined,
          error
        )

        // Check if should retry
        if (shouldRetry(error, retryCount, retryConfig)) {
          retryCount++
          logger.warn(`Retrying request (${retryCount}/${retryConfig.maxRetries}): ${url}`, {
            error: error.message,
            retryDelay: retryConfig.retryDelay
          })
          await sleep(retryConfig.retryDelay * retryCount) // Exponential backoff
          continue
        }

        throw error
      }

      // Success
      logApiCall(
        fetchOptions.method || 'GET',
        url,
        fetchOptions.body,
        data
      )

      return data as T
    } catch (error: any) {
      lastError = error

      // Network error or timeout
      if (error instanceof NetworkError || error.name === 'NetworkError' || error.name === 'TypeError') {
        const networkError = new NetworkError(error.message, { url })

        if (shouldRetry(networkError, retryCount, retryConfig)) {
          retryCount++
          logger.warn(`Retrying after network error (${retryCount}/${retryConfig.maxRetries}): ${url}`, {
            error: error.message,
            retryDelay: retryConfig.retryDelay
          })
          await sleep(retryConfig.retryDelay * retryCount)
          continue
        }

        logger.error(`Network error after ${retryCount} retries: ${url}`, networkError)
        throw networkError
      }

      // Check if should retry other errors
      if (shouldRetry(error, retryCount, retryConfig)) {
        retryCount++
        logger.warn(`Retrying after error (${retryCount}/${retryConfig.maxRetries}): ${url}`, {
          error: error.message,
          retryDelay: retryConfig.retryDelay
        })
        await sleep(retryConfig.retryDelay * retryCount)
        continue
      }

      // Parse and throw error
      const parsedError = parseApiError(error)
      logger.error(`API error: ${url}`, parsedError)
      throw parsedError
    }
  }

  // Max retries exceeded
  logger.error(`Max retries exceeded for: ${url}`, lastError)
  throw lastError
}

/**
 * Convenience methods
 */
export const api = {
  get: <T = any>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    }),

  put: <T = any>(url: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    }),

  patch: <T = any>(url: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    }),

  delete: <T = any>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'DELETE' })
}
