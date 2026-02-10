'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'

interface BacktestResults {
  roi: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  tradeCount: number
  bestTrade: number
  worstTrade: number
  riskAdjustedReturn: number
}

interface BacktestResultsProps {
  results: BacktestResults | null
  loading: boolean
  error: string | null
}

export function BacktestResults({ results, loading, error }: BacktestResultsProps) {
  if (loading) {
    return (
      <div className="metric-card">
        <p className="text-muted-foreground">Running backtest...</p>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-card/50 rounded animate-pulse" />
          <div className="h-4 bg-card/50 rounded animate-pulse" />
          <div className="h-4 bg-card/50 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="metric-card border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-400 font-semibold">Error</p>
            <p className="text-red-400/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="metric-card">
        <p className="text-muted-foreground text-center py-8">
          Run a backtest to see results
        </p>
      </div>
    )
  }

  const metricGroups = [
    {
      label: 'Returns',
      metrics: [
        { key: 'ROI (%)', value: results.roi, target: 50, good: results.roi > 0 },
        { key: 'Risk-Adj Return', value: results.riskAdjustedReturn, target: 1.0, good: results.riskAdjustedReturn > 0 },
      ],
    },
    {
      label: 'Risk Metrics',
      metrics: [
        { key: 'Sharpe Ratio', value: results.sharpeRatio, target: 1.2, good: results.sharpeRatio > 1.2 },
        { key: 'Max Drawdown (%)', value: results.maxDrawdown, target: -10, good: results.maxDrawdown > -10 },
      ],
    },
    {
      label: 'Trade Statistics',
      metrics: [
        { key: 'Win Rate (%)', value: results.winRate, target: 60, good: results.winRate > 50 },
        { key: 'Trade Count', value: results.tradeCount, target: 100, good: results.tradeCount > 10 },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="metric-card border-green-500/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-400 font-semibold">Backtest Complete</p>
            <p className="text-green-400/80 text-sm">Strategy analysis generated</p>
          </div>
        </div>
      </div>

      {metricGroups.map((group) => (
        <div key={group.label} className="metric-card">
          <h3 className="font-semibold mb-4 text-primary">{group.label}</h3>
          <div className="grid grid-cols-2 gap-4">
            {group.metrics.map((metric) => (
              <div key={metric.key} className="bg-background/50 rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">{metric.key}</p>
                <p className={`text-lg font-bold ${metric.good ? 'text-green-400' : 'text-red-400'}`}>
                  {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {metric.target.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Best/Worst trades */}
      <div className="metric-card">
        <h3 className="font-semibold mb-4 text-primary">Trade Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 rounded p-4">
            <p className="text-xs text-muted-foreground mb-2">Best Trade</p>
            <p className="text-2xl font-bold text-green-400">+{results.bestTrade.toFixed(1)}%</p>
          </div>
          <div className="bg-red-500/10 rounded p-4">
            <p className="text-xs text-muted-foreground mb-2">Worst Trade</p>
            <p className="text-2xl font-bold text-red-400">{results.worstTrade.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
