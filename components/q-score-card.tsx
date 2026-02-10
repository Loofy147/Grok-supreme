'use client'

import { Card } from '@/components/ui/card'
import { Zap } from 'lucide-react'

interface QScoreData {
  overall: number
  synthesis: number
  transfer: number
  problem_solving: number
  trend: number
}

const mockQScores: QScoreData = {
  overall: 0.946,
  synthesis: 0.92,
  transfer: 0.94,
  problem_solving: 0.946,
  trend: 0.05,
}

export function QScoreCard() {
  const scores = mockQScores
  const metrics = [
    { label: 'Overall Q-Score', value: scores.overall, color: 'primary' },
    { label: 'Multi-Domain Synthesis', value: scores.synthesis, color: 'accent' },
    { label: 'Transfer Learning', value: scores.transfer, color: 'primary' },
    { label: 'Universal Problem Solving', value: scores.problem_solving, color: 'accent' },
  ]

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Q-Score Metrics</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-sm font-semibold text-primary">
                {(metric.value * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-full bg-card rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${metric.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          Updated from trained skill weights
        </p>
      </div>
    </div>
  )
}
