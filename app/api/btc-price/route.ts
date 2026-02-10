import type { NextResponse } from 'next/server'

// Mock data for testing - realistic BTC price data
const MOCK_BTC_DATA = {
  price: 95419.05,
  marketCap: 1895000000000,
  volume: 45000000000,
  change24h: 2.5,
  timestamp: new Date().toISOString(),
}

// Generate 30-day historical price data
function generateMockHistoricalData(basePrice: number) {
  const prices: number[] = []
  const volumes: number[] = []
  let currentPrice = basePrice - 5000 // Start 5k lower

  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.48) * 2000 // Random walk
    currentPrice += change
    prices.push(Math.round(currentPrice * 100) / 100)
    volumes.push(Math.round((Math.random() * 50 + 30) * 1e9)) // 30-80B volume
  }

  return { prices, volumes }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Try to fetch from CoinGecko with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
      { 
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      const { prices, volumes } = generateMockHistoricalData(data.bitcoin.usd)
      
      return Response.json({
        success: true,
        price: data.bitcoin.usd,
        marketCap: data.bitcoin.usd_market_cap,
        volume: data.bitcoin.usd_24h_vol,
        change24h: data.bitcoin.usd_24h_change,
        prices,
        volumes,
        timestamp: new Date().toISOString(),
      })
    }

    throw new Error('API error')
  } catch (error) {
    console.error('[v0] Error fetching BTC price, using mock data:', error)
    
    // Fallback to mock data
    const { prices, volumes } = generateMockHistoricalData(MOCK_BTC_DATA.price)
    
    return Response.json({
      success: true,
      ...MOCK_BTC_DATA,
      prices,
      volumes,
      isMocked: true,
      message: 'Using simulated data for demonstration',
    })
  }
}
