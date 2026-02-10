import type { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch BTC price from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch BTC price')
    }

    const data = await response.json()
    
    return Response.json({
      price: data.bitcoin.usd,
      marketCap: data.bitcoin.usd_market_cap,
      volume: data.bitcoin.usd_24h_vol,
      change24h: data.bitcoin.usd_24h_change,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching BTC price:', error)
    return Response.json(
      { error: 'Failed to fetch BTC price' },
      { status: 500 }
    )
  }
}
