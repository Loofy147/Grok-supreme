'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const performanceData = [
  { month: 'Jan', roi: 5.2, sharpe: 1.3, drawdown: -3.2 },
  { month: 'Feb', roi: 8.1, sharpe: 1.5, drawdown: -2.8 },
  { month: 'Mar', roi: 3.4, sharpe: 0.9, drawdown: -5.1 },
  { month: 'Apr', roi: 12.3, sharpe: 1.8, drawdown: -1.5 },
  { month: 'May', roi: 9.7, sharpe: 1.6, drawdown: -3.8 },
  { month: 'Jun', roi: 15.2, sharpe: 2.1, drawdown: -0.8 },
]

const metricsData = [
  { name: 'Total ROI (%)', value: 54.0, target: 50 },
  { name: 'Sharpe Ratio', value: 1.48, target: 1.2 },
  { name: 'Max Drawdown (%)', value: -5.1, target: -10 },
  { name: 'Win Rate (%)', value: 62.3, target: 60 },
]

export function PortfolioSummary() {
  return (
    <div className="space-y-6">
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricsData.map((metric) => (
            <div key={metric.name} className="bg-background/50 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">{metric.name}</p>
              <p className="text-xl font-bold text-primary">{metric.value.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {metric.target.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">6-Month Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="month" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c',
                border: '1px solid #2d3748',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#00d9ff" 
              strokeWidth={2}
              dot={{ fill: '#00d9ff', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="sharpe" 
              stroke="#4c6ef5" 
              strokeWidth={2}
              dot={{ fill: '#4c6ef5', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">ROI Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="month" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a202c',
                border: '1px solid #2d3748',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="roi" fill="#00d9ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
