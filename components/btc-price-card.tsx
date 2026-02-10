'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceData {
  price: number
  change24h: number
  marketCap: number
  volume: number
}

export function BtcPriceCard() {
  const [price, setPrice] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/btc-price')
        if (!res.ok) throw new Error('Failed to fetch price')
        const data = await res.json()
        setPrice(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching price')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Refresh every 30s

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="metric-card">
        <p className="text-muted-foreground">Loading BTC price...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="metric-card border-red-500/20">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!price) return null

  const isPositive = price.change24h >= 0

  return (
    <div className="metric-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm mb-2">Bitcoin Price</p>
          <p className="text-4xl font-bold text-primary">
            ${price.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-8 h-8 text-green-400" />
        ) : (
          <TrendingDown className="w-8 h-8 text-red-400" />
        )}
      </div>

      <div className={`text-sm font-semibold mt-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{price.change24h.toFixed(2)}% (24h)
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
        <div>
          <p className="text-muted-foreground mb-1">Market Cap</p>
          <p className="text-foreground font-mono">
            ${(price.marketCap / 1e12).toFixed(2)}T
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">24h Volume</p>
          <p className="text-foreground font-mono">
            ${(price.volume / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>
    </div>
  )
}
