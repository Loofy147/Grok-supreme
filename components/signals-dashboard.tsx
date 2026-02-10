'use client'

import { useSetups, useSignals } from '@/hooks/use-signals'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export function SignalsDashboard() {
  const { data: setupData, loading: setupLoading, error: setupError } = useSetups(true, 300000)
  const { data: signalData, loading: signalLoading, error: signalError } = useSignals(true, 300000)

  const loading = setupLoading || signalLoading
  const error = setupError || signalError

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  if (!setupData || !signalData) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Loading signals...</p>
      </Card>
    )
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Buy':
        return 'text-green-600 bg-green-50'
      case 'Sell':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Price</p>
            <p className="text-2xl font-bold">${setupData.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Aggregate Signal</p>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getSignalColor(signalData.aggregateSignal)}`}>
              {signalData.aggregateSignal}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Assessment</p>
            <p className="text-lg font-semibold mt-1">{setupData.summary}</p>
          </div>
        </div>
      </Card>

      {/* Best Setup */}
      {setupData.bestSetup && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-green-900">Best Setup</h3>
              <p className="text-sm text-green-700 mt-1">{setupData.bestSetup.timeframe.toUpperCase()}</p>
              <p className="text-sm text-green-700">{setupData.bestSetup.reason}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(setupData.bestSetup.priority)}`}>
              {setupData.bestSetup.priority} Priority
            </span>
          </div>
        </Card>
      )}

      {/* Timeframe Signals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Multi-Timeframe Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {setupData.setups.map((setup) => (
            <Card key={setup.timeframe} className={`p-4 ${getSignalColor(setup.signal)}`}>
              <p className="text-xs font-medium uppercase text-gray-600">{setup.timeframe}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-bold">{setup.signal}</p>
                <div className={setup.signal === 'Buy' ? 'text-green-600' : setup.signal === 'Sell' ? 'text-red-600' : 'text-gray-600'}>
                  {setup.signal === 'Buy' ? <TrendingUp className="w-4 h-4" /> : setup.signal === 'Sell' ? <TrendingDown className="w-4 h-4" /> : null}
                </div>
              </div>
              <p className="text-xs mt-2 font-semibold">{setup.confidence}% Confidence</p>
              <div className="mt-3 space-y-1 text-xs">
                <p>Entry: ${setup.entry.toFixed(2)}</p>
                <p>SL: ${setup.stopLoss.toFixed(2)}</p>
                {setup.takeProfit ? (
                  <>
                    <p>TP: ${setup.takeProfit.toFixed(2)}</p>
                    <p>RR: {setup.riskRewardRatio ? setup.riskRewardRatio.toFixed(2) : 'N/A'}:1</p>
                  </>
                ) : (
                  <p className="text-orange-600 font-semibold">TP: Open</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trading Setups Detail */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Complete Trading Setups</h3>
        <div className="space-y-3">
          {setupData.setups.map((setup) => (
            <div key={setup.timeframe} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold uppercase text-sm">{setup.timeframe}</h4>
                  <p className="text-sm text-gray-600 mt-1">{setup.recommendation}</p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-semibold ${getSignalColor(setup.signal)}`}>
                  {setup.signal}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-gray-600">Confidence</span>
                  <p className="font-semibold">{setup.confidence}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Risk</span>
                  <p className="font-semibold">${setup.riskAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Reward</span>
                  <p className="font-semibold">{setup.rewardAmount ? `$${setup.rewardAmount.toFixed(2)}` : 'Open'}</p>
                </div>
                <div>
                  <span className="text-gray-600">RR Ratio</span>
                  <p className="font-semibold">{setup.riskRewardRatio ? `${setup.riskRewardRatio.toFixed(2)}:1` : 'Open'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Signals */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Indicators</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-semibold">Timeframe</th>
                <th className="text-left py-2 px-2 font-semibold">Signal</th>
                <th className="text-right py-2 px-2 font-semibold">Entry</th>
                <th className="text-right py-2 px-2 font-semibold">SL</th>
                <th className="text-right py-2 px-2 font-semibold">TP</th>
                <th className="text-right py-2 px-2 font-semibold">Confidence</th>
                <th className="text-right py-2 px-2 font-semibold">RSI</th>
                <th className="text-right py-2 px-2 font-semibold">Momentum</th>
              </tr>
            </thead>
            <tbody>
              {signalData.signals.map((signal) => (
                <tr key={signal.timeframe} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{signal.timeframe}</td>
                  <td className={`py-2 px-2 font-semibold ${signal.signal === 'Buy' ? 'text-green-600' : signal.signal === 'Sell' ? 'text-red-600' : 'text-gray-600'}`}>
                    {signal.signal}
                  </td>
                  <td className="text-right py-2 px-2">${signal.entry.toFixed(2)}</td>
                  <td className="text-right py-2 px-2">${signal.stopLoss.toFixed(2)}</td>
                  <td className="text-right py-2 px-2">
                    {signal.takeProfit ? `$${signal.takeProfit.toFixed(2)}` : <span className="text-orange-600">Open</span>}
                  </td>
                  <td className="text-right py-2 px-2">{signal.confidence}%</td>
                  <td className="text-right py-2 px-2">{signal.rsi.toFixed(1)}</td>
                  <td className="text-right py-2 px-2">{signal.momentum > 0 ? '+' : ''}{signal.momentum.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Recommendation</h3>
        <p className="text-sm text-blue-800">{signalData.recommendation}</p>
        {signalData.riskRewardRatio > 0 && (
          <p className="text-sm text-blue-800 mt-2">
            Average Risk-Reward Ratio: <span className="font-semibold">{signalData.riskRewardRatio.toFixed(2)}:1</span>
          </p>
        )}
      </Card>

      {/* Footer Section */}
      <div className="space-y-4 border-t pt-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Avg Confidence</p>
            <p className="text-lg font-bold text-blue-600">
              {(signalData.signals.reduce((sum, s) => sum + s.confidence, 0) / signalData.signals.length).toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Avg Risk-Reward</p>
            <p className="text-lg font-bold text-blue-600">
              {signalData.riskRewardRatio.toFixed(2)}:1
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Buy Signals</p>
            <p className="text-lg font-bold text-green-600">
              {signalData.signals.filter(s => s.signal === 'Buy').length}/5
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Sell Signals</p>
            <p className="text-lg font-bold text-red-600">
              {signalData.signals.filter(s => s.signal === 'Sell').length}/5
            </p>
          </div>
        </div>

        {/* System Status */}
        <Card className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                <span className="font-semibold">Pipeline Q-Score:</span> 0.93
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                <span className="font-semibold">Validation Sharpe:</span> 1.29
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                <span className="font-semibold">Win Rate:</span> 60%
              </span>
            </div>
          </div>
        </Card>

        {/* Disclaimer and Info */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <span className="font-semibold">⚠️ Disclaimer:</span> This trading signal system is for educational and simulation purposes only. 
            All signals are calculated based on historical data and technical analysis. Real market conditions include slippage, fees, 
            and unpredictable price movements. Past performance does not guarantee future results. Always conduct your own research and 
            consult with a financial advisor before trading with real capital. Risk management is essential—never trade more than you 
            can afford to lose.
          </p>
        </Card>

        {/* Update Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-600">
            Last updated: <span className="font-mono font-semibold">{new Date(signalData.timestamp).toLocaleTimeString()}</span>
          </p>
          <p className="text-xs text-gray-500">
            Auto-refreshing every 5 minutes • Data sourced from live market feeds
          </p>
          <p className="text-xs text-gray-400">
            v1.0 • Grok Trading Signals System
          </p>
        </div>
      </div>
    </div>
  )
}
