import { useEffect, useState, useCallback } from 'react'

export interface SignalResult {
  timeframe: string
  signal: 'Buy' | 'Sell' | 'Hold'
  entry: number
  stopLoss: number
  takeProfit: number | null
  tpStatus: 'open' | 'closed'
  confidence: number
  rsi: number
  momentum: number
}

export interface LiveSignalResponse {
  success: boolean
  timestamp: string
  currentPrice: number
  signals: SignalResult[]
  aggregateSignal: 'Buy' | 'Sell' | 'Hold'
  recommendation: string
  riskRewardRatio: number
  error?: string
}

export interface MarketData {
  success: boolean
  currentPrice: number
  prices: number[]
  volumes: number[]
  change24h: number
  volume24h: number
  timestamp: string
  error?: string
}

export interface TradingSetup {
  timeframe: string
  signal: 'Buy' | 'Sell' | 'Hold'
  entry: number
  stopLoss: number
  takeProfit: number | null
  tpType: 'open' | 'closed'
  riskAmount: number
  rewardAmount: number | null
  riskRewardRatio: number | null
  confidence: number
  recommendation: string
}

export interface SetupResponse {
  success: boolean
  timestamp: string
  currentPrice: number
  setups: TradingSetup[]
  bestSetup: {
    timeframe: string
    reason: string
    priority: 'High' | 'Medium' | 'Low'
  } | null
  summary: string
  error?: string
}

export interface SignalState {
  loading: boolean
  error: string | null
  data: LiveSignalResponse | null
  timestamp: number | null
}

export interface SetupState {
  loading: boolean
  error: string | null
  data: SetupResponse | null
  timestamp: number | null
}

// Hook for fetching live signals
export function useSignals(
  enabled = true,
  refreshInterval: number = 300000 // 5 minutes default
) {
  const [state, setState] = useState<SignalState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
  })

  const fetchSignals = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      // Fetch market data first
      const marketRes = await fetch('/api/signals/market-data', {
        cache: 'no-store',
      })

      if (!marketRes.ok) {
        throw new Error('Failed to fetch market data')
      }

      const marketData: MarketData = await marketRes.json()

      if (!marketData.success) {
        throw new Error(marketData.error || 'Market data fetch failed')
      }

      // Fetch signals with market data
      const signalRes = await fetch('/api/signals/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices: marketData.prices,
          volumes: marketData.volumes,
          currentPrice: marketData.currentPrice,
        }),
        cache: 'no-store',
      })

      if (!signalRes.ok) {
        throw new Error('Failed to fetch signals')
      }

      const signals: LiveSignalResponse = await signalRes.json()

      setState({
        loading: false,
        error: null,
        data: signals.success ? signals : null,
        timestamp: Date.now(),
      })
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        timestamp: null,
      })
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Fetch immediately
    fetchSignals()

    // Set up interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(fetchSignals, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [enabled, refreshInterval, fetchSignals])

  return { ...state, refetch: fetchSignals }
}

// Hook for fetching trading setups
export function useSetups(
  enabled = true,
  refreshInterval: number = 300000
) {
  const [state, setState] = useState<SetupState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
  })

  const fetchSetups = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      // Fetch market data first
      const marketRes = await fetch('/api/signals/market-data')

      if (!marketRes.ok) {
        throw new Error('Failed to fetch market data')
      }

      const marketData: MarketData = await marketRes.json()

      if (!marketData.success) {
        throw new Error(marketData.error || 'Market data fetch failed')
      }

      // Fetch setups with market data
      const setupRes = await fetch('/api/signals/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices: marketData.prices,
          volumes: marketData.volumes,
          currentPrice: marketData.currentPrice,
        }),
      })

      if (!setupRes.ok) {
        throw new Error('Failed to fetch setups')
      }

      const setups: SetupResponse = await setupRes.json()

      setState({
        loading: false,
        error: null,
        data: setups.success ? setups : null,
        timestamp: Date.now(),
      })
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        timestamp: null,
      })
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    fetchSetups()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchSetups, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [enabled, refreshInterval, fetchSetups])

  return { ...state, refetch: fetchSetups }
}

// Hook for fetching market data only
export function useMarketData(enabled = true, refreshInterval: number = 60000) {
  const [state, setState] = useState<{
    loading: boolean
    error: string | null
    data: MarketData | null
  }>({
    loading: false,
    error: null,
    data: null,
  })

  const fetchMarketData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const res = await fetch('/api/signals/market-data')

      if (!res.ok) throw new Error('Failed to fetch market data')

      const data: MarketData = await res.json()
      setState({
        loading: false,
        error: null,
        data: data.success ? data : null,
      })
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      })
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    fetchMarketData()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchMarketData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [enabled, refreshInterval, fetchMarketData])

  return { ...state, refetch: fetchMarketData }
}
