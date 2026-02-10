import { SignalsDashboard } from '@/components/signals-dashboard'

export const metadata = {
  title: 'Live Trading Signals | Grok Supreme',
  description: 'Multi-timeframe trading signals with entry, stop loss, and take profit levels',
}

export default function SignalsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Trading Signals</h1>
          <p className="text-lg text-slate-600">Multi-timeframe analysis with calculated entry, stop loss, and take profit levels</p>
        </div>
        <SignalsDashboard />
      </div>
    </main>
  )
}
