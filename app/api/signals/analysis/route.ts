import type { NextRequest, NextResponse } from 'next/server'

export interface SignalAnalysis {
  timeframe: string
  signal: 'Buy' | 'Sell' | 'Hold'
  entry: number
  stopLoss: number
  takeProfit: number | null
  tpStatus: 'open' | 'closed'
  confidence: number
  indicators: {
    rsi: number
    momentum: number
    maShort: number | null
    maLong: number | null
    maCrossover: boolean
    volumeConfirm: boolean
  }
  riskMetrics: {
    riskPercent: number
    rewardPercent: number
    rrRatio: number
    positionSize: number
  }
}

export interface AnalysisResponse {
  success: boolean
  timestamp: string
  analysis: SignalAnalysis[]
  summary: {
    strongestTimeframe: string
    weakestTimeframe: string
    consensusSignal: 'Buy' | 'Sell' | 'Hold'
    agreementPercent: number
    overallQuality: number
  }
  error?: string
}

function calculateMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
  return sum / period
}

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

  for (let i = period; i < deltas.length; i++) {
    const delta = deltas[i]
    if (delta > 0) {
      avgGain = (avgGain * (period - 1) + delta) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) - delta) / period
    }
  }

  const rs = avgLoss !== 0 ? avgGain / avgLoss : 100
  return 100 - 100 / (1 + rs)
}

function calculateMomentum(prices: number[], period: number = 10): number {
  if (prices.length < period) return 0
  return ((prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period]) * 100
}

interface TimeframeConfig {
  shortPeriod: number
  longPeriod: number
  slPercent: number
  rrMultiplier: number
}

const TIMEFRAME_CONFIG: Record<string, TimeframeConfig> = {
  scalping: { shortPeriod: 3, longPeriod: 10, slPercent: 1.0, rrMultiplier: 1.0 },
  '1h': { shortPeriod: 5, longPeriod: 20, slPercent: 1.5, rrMultiplier: 1.5 },
  '4h': { shortPeriod: 7, longPeriod: 30, slPercent: 2.0, rrMultiplier: 2.0 },
  daily: { shortPeriod: 10, longPeriod: 50, slPercent: 3.0, rrMultiplier: 3.0 },
  weekly: { shortPeriod: 20, longPeriod: 100, slPercent: 5.0, rrMultiplier: 5.0 },
}

function analyzeTimeframe(
  timeframe: string,
  prices: number[],
  volumes: number[],
  entry: number,
  weights: any
): SignalAnalysis {
  const config = TIMEFRAME_CONFIG[timeframe]

  if (prices.length < config.longPeriod || volumes.length < config.longPeriod) {
    return {
      timeframe,
      signal: 'Hold',
      entry,
      stopLoss: 0,
      takeProfit: null,
      tpStatus: 'open',
      confidence: 0,
      indicators: {
        rsi: 50,
        momentum: 0,
        maShort: null,
        maLong: null,
        maCrossover: false,
        volumeConfirm: false,
      },
      riskMetrics: {
        riskPercent: 0,
        rewardPercent: 0,
        rrRatio: 0,
        positionSize: 0,
      },
    }
  }

  // Calculate indicators
  const maShort = calculateMA(prices, config.shortPeriod)
  const maLong = calculateMA(prices, config.longPeriod)
  const rsi = calculateRSI(prices)
  const momentum = calculateMomentum(prices, Math.min(10, config.shortPeriod))

  // Volume analysis
  const avgVolume = volumes.slice(-config.longPeriod).reduce((a, b) => a + b, 0) / config.longPeriod
  const currentVolume = volumes[volumes.length - 1]
  const volumeConfirm = currentVolume > avgVolume * 1.2

  // Signal determination
  let signal: 'Buy' | 'Sell' | 'Hold' = 'Hold'
  let confidence = 0

  if (maShort && maLong) {
    const maCrossover = maShort > maLong

    if (maCrossover && rsi < 70) {
      signal = volumeConfirm ? 'Buy' : rsi < 50 ? 'Buy' : 'Hold'
      confidence = Math.min(100, (((maShort - maLong) / maLong) * 100) * 10)
    } else if (!maCrossover && (rsi > 60 || momentum < -1)) {
      signal = 'Sell'
      confidence = Math.min(100, ((rsi - 60) / 40) * 80 + 20)
    }

    if (rsi > 80) signal = 'Sell'
    if (rsi < 20) signal = 'Buy'
  }

  // Calculate SL and TP
  const slPrice = entry * (1 - config.slPercent / 100)
  const riskAmount = entry - slPrice
  const tp = signal !== 'Sell' ? entry + riskAmount * config.rrMultiplier * 1.5 : null
  const rrRatio = tp ? (tp - entry) / riskAmount : -1

  // Risk metrics
  const riskPercent = (riskAmount / entry) * 100
  const rewardPercent = tp ? ((tp - entry) / entry) * 100 : 0
  const positionSize = 100 / Math.abs(config.slPercent) // Simplified position sizing

  return {
    timeframe,
    signal,
    entry,
    stopLoss: Math.round(slPrice * 100) / 100,
    takeProfit: tp ? Math.round(tp * 100) / 100 : null,
    tpStatus: tp ? 'closed' : 'open',
    confidence: Math.round(confidence * 10) / 10,
    indicators: {
      rsi: Math.round(rsi * 10) / 10,
      momentum: Math.round(momentum * 10) / 10,
      maShort: maShort ? Math.round(maShort * 100) / 100 : null,
      maLong: maLong ? Math.round(maLong * 100) / 100 : null,
      maCrossover: maShort && maLong ? maShort > maLong : false,
      volumeConfirm,
    },
    riskMetrics: {
      riskPercent: Math.round(riskPercent * 100) / 100,
      rewardPercent: Math.round(rewardPercent * 100) / 100,
      rrRatio: Math.round(rrRatio * 100) / 100,
      positionSize: Math.round(positionSize * 100) / 100,
    },
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
  try {
    const body = await request.json()
    const { prices, volumes, entry } = body as {
      prices: number[]
      volumes: number[]
      entry: number
    }

    if (!prices || !Array.isArray(prices) || prices.length < 100) {
      return Response.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          analysis: [],
          summary: {
            strongestTimeframe: 'N/A',
            weakestTimeframe: 'N/A',
            consensusSignal: 'Hold',
            agreementPercent: 0,
            overallQuality: 0,
          },
          error: 'Insufficient price data',
        },
        { status: 400 }
      )
    }

    const weights = { w_V: 0.086, w_C: 0.213, w_S: 0.185 }
    const timeframes = ['scalping', '1h', '4h', 'daily', 'weekly']

    // Analyze each timeframe
    const analysis = timeframes.map((tf) => analyzeTimeframe(tf, prices, volumes, entry, weights))

    // Calculate summary
    const buySignals = analysis.filter((a) => a.signal === 'Buy').length
    const sellSignals = analysis.filter((a) => a.signal === 'Sell').length
    const agreement = ((Math.max(buySignals, sellSignals) / 5) * 100)

    const consensusSignal = buySignals > 2 ? 'Buy' : sellSignals > 2 ? 'Sell' : 'Hold'

    const strongestTf = analysis.reduce((prev, curr) => (curr.confidence > prev.confidence ? curr : prev))
    const weakestTf = analysis.reduce((prev, curr) => (curr.confidence < prev.confidence ? curr : prev))

    const overallQuality =
      (analysis.reduce((sum, a) => sum + a.confidence, 0) / analysis.length)

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis,
      summary: {
        strongestTimeframe: strongestTf.timeframe,
        weakestTimeframe: weakestTf.timeframe,
        consensusSignal,
        agreementPercent: Math.round(agreement * 10) / 10,
        overallQuality: Math.round(overallQuality * 10) / 10,
      },
    })
  } catch (error) {
    console.error('[v0] Error in signal analysis:', error)
    return Response.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        analysis: [],
        summary: {
          strongestTimeframe: 'N/A',
          weakestTimeframe: 'N/A',
          consensusSignal: 'Hold',
          agreementPercent: 0,
          overallQuality: 0,
        },
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    )
  }
}
