'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiRequest, APIError } from '@/lib/api-client'

interface UseAPIState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook for fetching data from API endpoints
 */
export function useAPI<T>(
  endpoint: string,
  dependencies: unknown[] = [],
): UseAPIState<T> {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null })
        const data = await apiRequest<T>(endpoint, {
          signal: abortController.signal,
        })
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (err) {
        if (isMounted && !(err instanceof Error && err.message === 'AbortError')) {
          const message = err instanceof APIError ? err.message : 'An error occurred'
          setState({ data: null, loading: false, error: message })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, dependencies)

  return state
}

/**
 * Hook for making API requests
 */
export function useMutation<T>(endpoint: string) {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (body: unknown) => {
      try {
        setState({ data: null, loading: true, error: null })
        const data = await apiRequest<T>(endpoint, {
          method: 'POST',
          body,
        })
        setState({ data, loading: false, error: null })
        return data
      } catch (err) {
        const message = err instanceof APIError ? err.message : 'An error occurred'
        setState({ data: null, loading: false, error: message })
        throw err
      }
    },
    [endpoint],
  )

  return { ...state, mutate }
}
