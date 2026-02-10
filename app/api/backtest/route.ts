import { streamText } from 'ai'
import { xai } from '@ai-sdk/xai'
import type { NextRequest } from 'next/server'

interface BacktestRequest {
  strategy: string
  timeWindow: string
  fees: number
  slippage: number
  initialCapital: number
}

export async function POST(request: NextRequest) {
  try {
    const body: BacktestRequest = await request.json()
    
    const { strategy, timeWindow, fees, slippage, initialCapital } = body

    if (!strategy || !timeWindow) {
      return new Response('Strategy and time window are required', { status: 400 })
    }

    const systemPrompt = 'You are a quantitative finance expert. Provide detailed backtest analysis with realistic metrics.'
    
    const userPrompt = `You are a cryptocurrency trading strategy analyst. Simulate a backtest for the following strategy:

Strategy: ${strategy}
Time Window: ${timeWindow}
Initial Capital: $${initialCapital}
Trading Fees: ${fees}%
Slippage: ${slippage}%

Generate realistic backtest results that should include:
1. Total Return (ROI %)
2. Sharpe Ratio (target > 1.2)
3. Maximum Drawdown (target < 10%)
4. Win Rate (%)
5. Trade Count
6. Best Trade
7. Worst Trade
8. Risk-Adjusted Return

Provide results in JSON format with realistic values based on Bitcoin market behavior.`

    const result = streamText({
      model: xai('grok-4', {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: userPrompt,
      system: systemPrompt,
      temperature: 0.8,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in backtest:', error)
    return new Response('Failed to run backtest', { status: 500 })
  }
}
