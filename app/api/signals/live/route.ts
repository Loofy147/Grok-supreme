import type { NextRequest } from 'next/server'
import type { NextResponse } from 'next/server'

// Define types for signals and trading setup
export interface PriceData {
  prices: number[]
  volumes: number[]
}

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

// Timeframe-specific MA periods and risk parameters
const TIMEFRAME_CONFIG = {
  scalping: { shortPeriod: 3, longPeriod: 10, slPercent: 1.0, rrMultiplier: 1.0 },
  '1h': { shortPeriod: 5, longPeriod: 20, slPercent: 1.5, rrMultiplier: 1.5 },
  '4h': { shortPeriod: 7, longPeriod: 30, slPercent: 2.0, rrMultiplier: 2.0 },
  daily: { shortPeriod: 10, longPeriod: 50, slPercent: 3.0, rrMultiplier: 3.0 },
  weekly: { shortPeriod: 20, longPeriod: 100, slPercent: 5.0, rrMultiplier: 5.0 },
}

// Load trained weights from environment or use defaults
function getWeights() {
  try {
    const weightsJson = process.env.TRAINED_WEIGHTS
    if (weightsJson) {
      return JSON.parse(weightsJson).weights || {}
    }
  } catch {
    console.warn('[v0] Failed to parse trained weights, using defaults')
  }
  // Default weights from training
  return {
    w_V: 0.086, // Volume weight
    w_C: 0.213, // Creativity (adaptation)
    w_S: 0.185, // Synthesis
  }
}

// Calculate Simple Moving Average
function calculateMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
  return sum / period
}

// Calculate RSI (Relative Strength Index)
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50

  const deltas = []
  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1])
  }

  let gains = 0
  let losses = 0

  for (let i = 0; i < period; i++) {
    if (deltas[i] > 0) {
      gains += deltas[i]
    } else {
      losses -= deltas[i]
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period
  let rs = avgLoss !== 0 ? avgGain / avgLoss : 100

  for (let i = period; i < deltas.length; i++) {
    const delta = deltas[i]
    if (delta > 0) {
      avgGain = (avgGain * (period - 1) + delta) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) - delta) / period
    }
    rs = avgLoss !== 0 ? avgGain / avgLoss : 100
  }

  const rsi = 100 - 100 / (1 + rs)
  return rsi
}

// Calculate momentum (percentage change over period)
function calculateMomentum(prices: number[], period: number = 10): number {
  if (prices.length < period) return 0
  const change = ((prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period]) * 100
  return change
}

// Generate signal based on technical indicators
function generateSignal(
  prices: number[],
  volumes: number[],
  timeframe: keyof typeof TIMEFRAME_CONFIG,
  weights: any
): { signal: 'Buy' | 'Sell' | 'Hold'; rsi: number; momentum: number; confidence: number } {
  const config = TIMEFRAME_CONFIG[timeframe]

  // Validate data
  if (prices.length < config.longPeriod || volumes.length < config.longPeriod) {
    return { signal: 'Hold', rsi: 50, momentum: 0, confidence: 0 }
  }

  // Calculate indicators
  const maShort = calculateMA(prices, config.shortPeriod)
  const maLong = calculateMA(prices, config.longPeriod)
  const rsi = calculateRSI(prices)
  const momentum = calculateMomentum(prices, Math.min(10, config.shortPeriod))

  // Volume analysis
  const avgVolume = volumes.slice(-config.longPeriod).reduce((a, b) => a + b, 0) / config.longPeriod
  const currentVolume = volumes[volumes.length - 1]
  const volumeThreshold = avgVolume * (1 - (weights.w_V || 0.086))

  // Signal generation
  let signal: 'Buy' | 'Sell' | 'Hold' = 'Hold'
  let confidence = 0

  if (maShort && maLong) {
    // Buy Signal
    if (maShort > maLong && rsi < 70) {
      if (currentVolume > volumeThreshold) {
        signal = 'Buy'
        confidence = Math.min(100, (((maShort - maLong) / maLong) * 100) * 10)
      } else if (rsi < 50) {
        signal = 'Buy'
        confidence = Math.min(100, ((50 - rsi) / 50) * 60)
      }
    }

    // Sell Signal
    if (maShort < maLong && (rsi > 60 || momentum < -1)) {
      signal = 'Sell'
      confidence = Math.min(100, ((rsi - 60) / 40) * 80 + 20)
    }

    // Overbought/Oversold
    if (rsi > 80) signal = 'Sell'
    if (rsi < 20) signal = 'Buy'
  }

  return { signal, rsi, momentum, confidence }
}

// Calculate SL and TP based on entry price and timeframe
function calculateSLTP(
  entry: number,
  timeframe: keyof typeof TIMEFRAME_CONFIG,
  momentum: number
): { sl: number; tp: number | null; rrRatio: number } {
  const config = TIMEFRAME_CONFIG[timeframe]

  // Stop Loss calculation
  const slPrice = entry * (1 - (config.slPercent / 100))

  // Take Profit calculation
  let tp: number | null = null
  let rrRatio = 0

  if (timeframe === 'daily' || timeframe === 'weekly') {
    // Open TP for longer timeframes
    tp = null
    rrRatio = -1 // Indicates open TP
  } else {
    // Closed TP for shorter timeframes
    const riskAmount = entry - slPrice
    const tpMultiplier = 1.5 + (Math.abs(momentum) / 100) * 0.5 // 1.5 to 2.0
    tp = entry + riskAmount * tpMultiplier
    rrRatio = (tp - entry) / (entry - slPrice)
  }

  return { sl: slPrice, tp, rrRatio }
}

export async function POST(request: NextRequest): Promise<NextResponse<LiveSignalResponse>> {
  try {
    const body = await request.json()
    const { prices, volumes, currentPrice } = body as {
      prices: number[]
      volumes: number[]
      currentPrice: number
    }

    // Validate input
    if (!prices || !Array.isArray(prices) || prices.length < 100) {
      return Response.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          currentPrice: currentPrice || 0,
          signals: [],
          aggregateSignal: 'Hold',
          recommendation: 'Insufficient data',
          riskRewardRatio: 0,
          error: 'Requires at least 100 price bars',
        },
        { status: 400 }
      )
    }

    if (!volumes || !Array.isArray(volumes) || volumes.length < prices.length) {
      return Response.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          currentPrice: currentPrice || 0,
          signals: [],
          aggregateSignal: 'Hold',
          recommendation: 'Insufficient volume data',
          riskRewardRatio: 0,
          error: 'Volume data mismatch',
        },
        { status: 400 }
      )
    }

    const weights = getWeights()
    const timeframes = ['scalping', '1h', '4h', 'daily', 'weekly'] as const
    const signals: SignalResult[] = []
    const buyCount = 0
    const sellCount = 0
    let totalConfidence = 0

    // Generate signals for each timeframe
    for (const timeframe of timeframes) {
      const { signal, rsi, momentum, confidence } = generateSignal(prices, volumes, timeframe, weights)
      const { sl, tp, rrRatio } = calculateSLTP(currentPrice, timeframe, momentum)

      signals.push({
        timeframe,
        signal,
        entry: currentPrice,
        stopLoss: Math.round(sl * 100) / 100,
        takeProfit: tp ? Math.round(tp * 100) / 100 : null,
        tpStatus: tp ? 'closed' : 'open',
        confidence: Math.round(confidence * 10) / 10,
        rsi: Math.round(rsi * 10) / 10,
        momentum: Math.round(momentum * 10) / 10,
      })

      totalConfidence += confidence
    }

    // Determine aggregate signal
    const buySignals = signals.filter((s) => s.signal === 'Buy').length
    const sellSignals = signals.filter((s) => s.signal === 'Sell').length
    let aggregateSignal: 'Buy' | 'Sell' | 'Hold' = 'Hold'
    let recommendation = 'Neutral'

    if (buySignals > 2) {
      aggregateSignal = 'Buy'
      recommendation = `Strong Buy Signal: ${buySignals} timeframes bullish`
    } else if (sellSignals > 2) {
      aggregateSignal = 'Sell'
      recommendation = `Strong Sell Signal: ${sellSignals} timeframes bearish`
    } else if (buySignals > sellSignals) {
      aggregateSignal = 'Buy'
      recommendation = `Weak Buy: ${buySignals} bullish vs ${sellSignals} bearish`
    } else if (sellSignals > buySignals) {
      aggregateSignal = 'Sell'
      recommendation = `Weak Sell: ${sellSignals} bearish vs ${buySignals} bullish`
    }

    // Calculate average RR ratio (excluding open TPs)
    const closedRRs = signals
      .filter((s) => s.takeProfit !== null)
      .map((s) => {
        if (s.takeProfit === null) return 0
        return (s.takeProfit - s.entry) / (s.entry - s.stopLoss)
      })

    const avgRR = closedRRs.length > 0 ? closedRRs.reduce((a, b) => a + b, 0) / closedRRs.length : -1

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      currentPrice: currentPrice,
      signals,
      aggregateSignal,
      recommendation,
      riskRewardRatio: Math.round(avgRR * 100) / 100,
    })
  } catch (error) {
    console.error('[v0] Error in live signals API:', error)
    return Response.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        currentPrice: 0,
        signals: [],
        aggregateSignal: 'Hold',
        recommendation: 'Error processing request',
        riskRewardRatio: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
