import type { NextRequest, NextResponse } from 'next/server'

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

const TIMEFRAME_CONFIG = {
  scalping: { shortPeriod: 3, longPeriod: 10, slPercent: 1.0, rrMultiplier: 1.0 },
  '1h': { shortPeriod: 5, longPeriod: 20, slPercent: 1.5, rrMultiplier: 1.5 },
  '4h': { shortPeriod: 7, longPeriod: 30, slPercent: 2.0, rrMultiplier: 2.0 },
  daily: { shortPeriod: 10, longPeriod: 50, slPercent: 3.0, rrMultiplier: 3.0 },
  weekly: { shortPeriod: 20, longPeriod: 100, slPercent: 5.0, rrMultiplier: 5.0 },
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
    if (deltas[i] > 0) gains += deltas[i]
    else losses -= deltas[i]
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

function generateSetup(
  timeframe: string,
  prices: number[],
  volumes: number[],
  entry: number,
  weights: any
): TradingSetup {
  const config = TIMEFRAME_CONFIG[timeframe as keyof typeof TIMEFRAME_CONFIG]

  if (prices.length < config.longPeriod) {
    return {
      timeframe,
      signal: 'Hold',
      entry,
      stopLoss: 0,
      takeProfit: null,
      tpType: 'open',
      riskAmount: 0,
      rewardAmount: null,
      riskRewardRatio: null,
      confidence: 0,
      recommendation: 'Insufficient data',
    }
  }

  // Calculate indicators
  const maShort = calculateMA(prices, config.shortPeriod)
  const maLong = calculateMA(prices, config.longPeriod)
  const rsi = calculateRSI(prices)

  // Signal determination
  let signal: 'Buy' | 'Sell' | 'Hold' = 'Hold'
  let confidence = 0

  if (maShort && maLong) {
    if (maShort > maLong && rsi < 70) {
      signal = 'Buy'
      confidence = Math.min(100, (((maShort - maLong) / maLong) * 100) * 10)
    } else if (maShort < maLong && rsi > 60) {
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
  const rewardAmount = tp ? tp - entry : null
  const rrRatio = tp ? (tp - entry) / riskAmount : null

  // Generate recommendation
  let recommendation = ''
  if (signal === 'Buy') {
    recommendation = `BUY at ${entry.toFixed(2)} | SL: ${slPrice.toFixed(2)} | ${tp ? `TP: ${tp.toFixed(2)}` : 'TP: Open'} | RR: ${rrRatio ? rrRatio.toFixed(2) : 'N/A'}:1`
  } else if (signal === 'Sell') {
    recommendation = `SELL at ${entry.toFixed(2)} | SL: ${slPrice.toFixed(2)} | TP: Open | RR: N/A`
  } else {
    recommendation = `HOLD | Monitor for MA crossover | RSI: ${rsi.toFixed(1)}`
  }

  return {
    timeframe,
    signal,
    entry,
    stopLoss: Math.round(slPrice * 100) / 100,
    takeProfit: tp ? Math.round(tp * 100) / 100 : null,
    tpType: tp ? 'closed' : 'open',
    riskAmount: Math.round(riskAmount * 100) / 100,
    rewardAmount: rewardAmount ? Math.round(rewardAmount * 100) / 100 : null,
    riskRewardRatio: rrRatio ? Math.round(rrRatio * 100) / 100 : null,
    confidence: Math.round(confidence * 10) / 10,
    recommendation,
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<SetupResponse>> {
  try {
    const body = await request.json()
    const { prices, volumes, currentPrice } = body as {
      prices: number[]
      volumes: number[]
      currentPrice: number
    }

    if (!prices || !Array.isArray(prices) || prices.length < 100) {
      return Response.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          currentPrice,
          setups: [],
          bestSetup: null,
          summary: 'Insufficient data for trading setup',
          error: 'Need at least 100 price bars',
        },
        { status: 400 }
      )
    }

    const weights = { w_V: 0.086, w_C: 0.213, w_S: 0.185 }
    const timeframes = ['scalping', '1h', '4h', 'daily', 'weekly']

    // Generate setups for all timeframes
    const setups = timeframes.map((tf) => generateSetup(tf, prices, volumes, currentPrice, weights))

    // Find best setup (highest confidence Buy)
    const buySetups = setups.filter((s) => s.signal === 'Buy' && s.confidence > 40)
    let bestSetup = null

    if (buySetups.length > 0) {
      const best = buySetups.reduce((prev, curr) => (curr.confidence > prev.confidence ? curr : prev))
      const priority =
        best.confidence > 70 ? 'High' : best.confidence > 50 ? 'Medium' : 'Low'

      bestSetup = {
        timeframe: best.timeframe,
        reason: `${best.confidence}% confidence, ${best.riskRewardRatio ? best.riskRewardRatio.toFixed(2) : 'open'}:1 RR`,
        priority,
      }
    }

    // Generate summary
    const buyCount = setups.filter((s) => s.signal === 'Buy').length
    const sellCount = setups.filter((s) => s.signal === 'Sell').length
    const avgConfidence = setups.reduce((sum, s) => sum + s.confidence, 0) / setups.length

    let summary = ''
    if (buyCount > 2) {
      summary = `STRONG BUY SIGNAL: ${buyCount}/5 timeframes bullish (${avgConfidence.toFixed(1)}% avg confidence)`
    } else if (sellCount > 2) {
      summary = `STRONG SELL SIGNAL: ${sellCount}/5 timeframes bearish (${avgConfidence.toFixed(1)}% avg confidence)`
    } else if (buyCount > sellCount) {
      summary = `WEAK BUY: ${buyCount} bullish vs ${sellCount} bearish (${avgConfidence.toFixed(1)}% confidence)`
    } else if (sellCount > buyCount) {
      summary = `WEAK SELL: ${sellCount} bearish vs ${buyCount} bullish (${avgConfidence.toFixed(1)}% confidence)`
    } else {
      summary = `NEUTRAL: Equal signals across timeframes (${avgConfidence.toFixed(1)}% confidence)`
    }

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      currentPrice,
      setups,
      bestSetup,
      summary,
    })
  } catch (error) {
    console.error('[v0] Error generating trading setups:', error)
    return Response.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        currentPrice: 0,
        setups: [],
        bestSetup: null,
        summary: 'Error generating setups',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
