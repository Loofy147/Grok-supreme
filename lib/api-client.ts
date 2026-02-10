/**
 * API Client Utilities for SSO-TS Dashboard
 */

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
}

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Make an API request with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    throw new APIError(response.status, `API Error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

/**
 * Stream API response for real-time data
 */
export async function streamAPI(
  endpoint: string,
  body: unknown,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new APIError(response.status, `API Error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      onChunk(chunk)
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Format large numbers for display
 */
export function formatNumber(
  value: number,
  decimals: number = 2,
  currency: boolean = false,
): string {
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: decimals,
    }).format(value)
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}
