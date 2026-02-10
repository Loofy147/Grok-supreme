'use client'

import { AppLayout } from '@/app/app-layout'
import { SignalsDashboard } from '@/components/signals-dashboard'
import { BarChart3 } from 'lucide-react'

export default function SignalsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold">Live Trading Signals</h1>
          </div>
          <p className="text-muted-foreground">
            Multi-timeframe analysis with calculated entry, stop loss, and take profit levels
          </p>
        </div>

        {/* Main Dashboard Content */}
        <SignalsDashboard />
      </div>
    </AppLayout>
  )
}
