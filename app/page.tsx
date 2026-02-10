'use client'

import { AppLayout } from '@/app/app-layout'
import { BtcPriceCard } from '@/components/btc-price-card'
import { QScoreCard } from '@/components/q-score-card'
import { PortfolioSummary } from '@/components/portfolio-summary'
import { TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time cryptocurrency strategy analysis and performance tracking
          </p>
        </div>

        {/* Top metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BtcPriceCard />
          <QScoreCard />
        </div>

        {/* Portfolio Performance */}
        <PortfolioSummary />
      </div>
    </AppLayout>
  )
}
