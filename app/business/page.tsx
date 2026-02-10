'use client'

import { AppLayout } from '@/app/app-layout'
import { useState } from 'react'
import { Shield, Users, TrendingUp, MessageSquare } from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  action: string
  status: 'success' | 'error' | 'info'
  details: string
}

interface Achievement {
  id: string
  name: string
  description: string
  before: number
  after: number
  delta: number
  achievedAt: string
}

interface UserRole {
  id: string
  name: string
  permissions: string[]
  users: number
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    action: 'Backtest Completed',
    status: 'success',
    details: 'Momentum Crossover strategy on 6-month window',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    action: 'Skill Orchestration Analyzed',
    status: 'success',
    details: '4 skills combined: Market Analysis, RSI, Transfer Learning, Sentiment',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    action: 'Q-Score Updated',
    status: 'info',
    details: 'Universal Problem Solving capability: Q=0.946',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    action: 'BTC Price Fetched',
    status: 'success',
    details: 'Current price: $42,580 USD',
  },
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Sharpe Ratio Improvement',
    description: 'Improved Sharpe ratio by 15% through skill optimization',
    before: 1.21,
    after: 1.39,
    delta: 0.18,
    achievedAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: '2',
    name: 'Drawdown Reduction',
    description: 'Reduced maximum drawdown through multi-skill orchestration',
    before: -8.3,
    after: -4.2,
    delta: 4.1,
    achievedAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: '3',
    name: 'Win Rate Boost',
    description: 'Trading win rate exceeded 60% threshold',
    before: 52.3,
    after: 63.1,
    delta: 10.8,
    achievedAt: new Date(Date.now() - 14 * 24 * 60 * 60000).toISOString(),
  },
]

const userRoles: UserRole[] = [
  {
    id: '1',
    name: 'Simulator User',
    permissions: ['run_backtest', 'view_results', 'orchestrate_skills'],
    users: 12,
  },
  {
    id: '2',
    name: 'Analyst',
    permissions: ['run_backtest', 'view_results', 'orchestrate_skills', 'view_logs'],
    users: 5,
  },
  {
    id: '3',
    name: 'Admin',
    permissions: ['run_backtest', 'view_results', 'orchestrate_skills', 'view_logs', 'manage_users'],
    users: 2,
  },
]

export default function BusinessManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'achievements' | 'users'>('overview')

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold">Business Management</h1>
          </div>
          <p className="text-muted-foreground">
            System administration, user management, and achievement tracking
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          {[
            { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
            { id: 'logs' as const, label: 'Activity Logs', icon: MessageSquare },
            { id: 'achievements' as const, label: 'Q-Deltas', icon: TrendingUp },
            { id: 'users' as const, label: 'User Management', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Backtests', value: '247', trend: '+12' },
              { label: 'Avg Sharpe Ratio', value: '1.48', trend: '+0.15' },
              { label: 'Active Users', value: '19', trend: '+3' },
              { label: 'Skill Combinations', value: '8,432', trend: '+2.1k' },
            ].map((stat) => (
              <div key={stat.label} className="metric-card">
                <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-green-400 mt-2">{stat.trend} this month</p>
              </div>
            ))}
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === 'logs' && (
          <div className="metric-card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockLogs.map((log) => (
                <div key={log.id} className="border-l-2 border-border pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-foreground">{log.action}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        log.status === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : log.status === 'error'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q-Deltas Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 gap-4">
            {mockAchievements.map((achievement) => (
              <div key={achievement.id} className="metric-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      +{achievement.delta.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Q-delta</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                    <p className="text-lg font-semibold text-foreground">
                      {achievement.before.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground mb-1">After</p>
                    <p className="text-lg font-semibold text-green-400">
                      {achievement.after.toFixed(2)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Achieved {new Date(achievement.achievedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {userRoles.map((role) => (
              <div key={role.id} className="metric-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{role.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.users} user{role.users !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-primary/20 rounded text-sm text-primary font-semibold">
                    {role.users}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="text-xs bg-accent/20 text-accent px-2 py-1 rounded"
                    >
                      {permission.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
