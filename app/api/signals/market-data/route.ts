import type { NextRequest, NextResponse } from 'next/server'

interface MarketDataResponse {
  success: boolean
  currentPrice: number
  prices: number[]
  volumes: number[]
  change24h: number
  volume24h: number
  timestamp: string
  isMocked?: boolean
  error?: string
}

// Mock data for fallback
const MOCK_PRICES = [
  90419.05, 90512.45, 91234.67, 90876.23, 91456.78,
  92345.12, 93456.89, 94123.45, 93876.54, 94567.23,
  95234.67, 95876.12, 96234.45, 95567.89, 96345.23,
  97123.67, 97456.78, 96789.12, 97234.56, 98345.67,
  97876.23, 98567.89, 99234.45, 99876.12, 99456.78,
  100234.56, 99789.23, 99345.67, 98876.12, 95419.05,
]

const MOCK_VOLUMES = Array.from(
  { length: 30 },
  () => 25000000000 + Math.random() * 20000000000
)

export async function GET(request: NextRequest): Promise<NextResponse<MarketDataResponse>> {
  try {
    // Try to fetch from external API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
      {
        signal: controller.signal,
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      }
    )

    clearTimeout(timeoutId)

    if (priceResponse.ok) {
      const priceData = await priceResponse.json()
      const currentPrice = priceData.bitcoin.usd
      const change24h = priceData.bitcoin.usd_24h_change
      const volume24h = priceData.bitcoin.usd_24h_vol

      // Try to fetch historical data
      try {
        const controller2 = new AbortController()
        const timeoutId2 = setTimeout(() => controller2.abort(), 8000)

        const historyResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily',
          {
            signal: controller2.signal,
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
          }
        )

        clearTimeout(timeoutId2)

        if (historyResponse.ok) {
          const historyData = await historyResponse.json()
          const prices = historyData.prices.map((item: [number, number]) => item[1])
          const volumes = historyData.volumes ? historyData.volumes.map((item: [number, number]) => item[1]) : MOCK_VOLUMES

          return Response.json({
            success: true,
            currentPrice,
            prices,
            volumes: volumes.length > 0 ? volumes : MOCK_VOLUMES,
            change24h,
            volume24h,
            timestamp: new Date().toISOString(),
          })
        }

        throw new Error('Historical data API error')
      } catch (histError) {
        // Use mock historical data with real current price
        console.error('[v0] Using mock historical data:', histError)
        return Response.json({
          success: true,
          currentPrice,
          prices: [...MOCK_PRICES.slice(0, -1), currentPrice],
          volumes: MOCK_VOLUMES,
          change24h,
          volume24h,
          timestamp: new Date().toISOString(),
          isMocked: true,
        })
      }
    }

    throw new Error('Price API error')
  } catch (error) {
    console.error('[v0] Error fetching market data, using mock data:', error)
    
    // Fallback to completely mocked data
    return Response.json({
      success: true,
      currentPrice: MOCK_PRICES[MOCK_PRICES.length - 1],
      prices: MOCK_PRICES,
      volumes: MOCK_VOLUMES,
      change24h: 2.5,
      volume24h: 35000000000,
      timestamp: new Date().toISOString(),
      isMocked: true,
    })
  }
}
