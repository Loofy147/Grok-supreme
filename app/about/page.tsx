'use client'

import { AppLayout } from '@/app/app-layout'
import { AlertCircle, BookOpen, Zap } from 'lucide-react'

export default function About() {
  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">About SSO-TS Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            A sophisticated cryptocurrency trading strategy simulator powered by AI
          </p>
        </div>

        {/* Disclaimer */}
        <div className="metric-card border-yellow-500/20">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                Important Disclaimer
              </h2>
              <p className="text-yellow-400/90">
                This dashboard is a <strong>simulation-only</strong> platform. It does not 
                execute real trades or handle actual cryptocurrency funds. All results are 
                simulated and for educational and research purposes only. This is not 
                financial advice. Always conduct your own research and consult with a 
                financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="metric-card">
          <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The SSO-TS (Skill-Selective Orchestration Trading Strategy) Dashboard combines 
              advanced AI capabilities with quantitative finance methodologies to simulate 
              and analyze cryptocurrency trading strategies.
            </p>
            <p>
              Built on the OMEGA Framework—a recursive AI prompt engineering system—this 
              platform leverages multiple cognitive dimensions and emergent capabilities to 
              generate sophisticated trading insights.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="metric-card">
          <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
          <div className="space-y-4">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Real-Time BTC Monitoring',
                description: 'Live Bitcoin price tracking with 24h change and market metrics',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Strategy Backtesting',
                description: 'Comprehensive backtesting engine with fee/slippage adjustments',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Skill Orchestration',
                description: 'Combine AI skills to create emergent trading capabilities',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Q-Score Metrics',
                description: 'AI capability quality metrics based on trained skill weights',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Business Analytics',
                description: 'Activity logs, user management, and achievement tracking',
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-primary flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="metric-card">
          <h2 className="text-2xl font-semibold mb-4">Technical Stack</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { category: 'Frontend', tech: 'Next.js 16, React 19, TypeScript' },
              { category: 'Backend', tech: 'Next.js API Routes, Node.js' },
              { category: 'AI', tech: 'xAI Grok 4, AI SDK 6' },
              { category: 'Data', tech: 'CoinGecko API, Real-time Streams' },
              { category: 'Styling', tech: 'Tailwind CSS, Recharts' },
              { category: 'Deployment', tech: 'Vercel Platform' },
            ].map((stack) => (
              <div key={stack.category} className="bg-background/50 rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">{stack.category}</p>
                <p className="text-sm font-semibold text-primary">{stack.tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metric-card">
          <h2 className="text-2xl font-semibold mb-4">Performance Benchmarks</h2>
          <div className="space-y-3">
            {[
              { metric: 'Sharpe Ratio Target', value: '> 1.2', status: 'optimal' },
              { metric: 'Maximum Drawdown Target', value: '< 10%', status: 'optimal' },
              { metric: 'Win Rate Target', value: '> 50%', status: 'optimal' },
              { metric: 'Average ROI (6-month)', value: '54.0%', status: 'current' },
              { metric: 'Q-Score (Overall)', value: '0.946', status: 'current' },
            ].map((bench) => (
              <div
                key={bench.metric}
                className="flex justify-between items-center p-3 bg-background/50 rounded"
              >
                <p className="text-sm font-semibold">{bench.metric}</p>
                <span className={`text-sm font-mono ${
                  bench.status === 'optimal' ? 'text-green-400' : 'text-primary'
                }`}>
                  {bench.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OMEGA Framework */}
        <div className="metric-card">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold">OMEGA Framework</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Multi-dimensional AI prompt engineering system
              </p>
            </div>
          </div>
          <div className="space-y-3 text-muted-foreground text-sm">
            <p>
              The OMEGA Framework provides a 4-layer architecture for AI reasoning:
            </p>
            <div className="space-y-2 ml-4">
              <p>
                <strong>Layer 1 - Dimensions (26):</strong> 6 human-designed + 20 AI-discovered 
                cognitive dimensions that influence AI responses
              </p>
              <p>
                <strong>Layer 2 - Capabilities (8):</strong> Emergent abilities like 
                Multi-Domain Synthesis, Uncertainty Navigation, and Creative Reframing
              </p>
              <p>
                <strong>Layer 3 - Personalities (8):</strong> Archetypal behavioral patterns 
                optimized for different task types
              </p>
              <p>
                <strong>Layer 4 - Meta-Dimensions (6):</strong> Higher-order patterns 
                governing dimension interactions
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="metric-card border-border/30 bg-background/30">
          <p className="text-xs text-muted-foreground text-center">
            SSO-TS Dashboard • Powered by xAI Grok & OMEGA Framework • 
            <span className="ml-1">Built with Next.js 16 • Deployed on Vercel</span>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
