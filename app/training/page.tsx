'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/app/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ArrowLeft, Brain } from 'lucide-react'

interface TrainingResult {
  status: 'success' | 'in_progress' | 'error'
  timestamp: string
  jobId: string
  epochs?: number
  trainLoss?: number
  valLoss?: number
  progress?: number
  metrics?: {
    mse: number
    mae: number
    rmse: number
    r2: number
  }
  weights?: Record<string, number>
  message: string
}

interface TrainingConfig {
  dataset: string
  strategy: string
  epochs: number
  learningRate: number
}

export default function TrainingPage() {
  const [config, setConfig] = useState<TrainingConfig>({
    dataset: 'bitcoin-demo',
    strategy: 'momentum-cross',
    epochs: 50,
    learningRate: 0.01,
  })

  const [isTraining, setIsTraining] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [result, setResult] = useState<TrainingResult | null>(null)
  const [trainingHistory, setTrainingHistory] = useState<TrainingResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // Poll training status
  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/train?jobId=${jobId}`)
        const data: TrainingResult = await res.json()

        setResult(data)
        setTrainingHistory((prev) => [...prev, data])

        if (data.status === 'success' || data.status === 'error') {
          setIsTraining(false)
        }
      } catch (err) {
        console.error('Failed to fetch training status:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId])

  const validateConfig = (): string | null => {
    if (!config.dataset || config.dataset.trim() === '') {
      return 'Please select a dataset'
    }
    if (!config.strategy || config.strategy.trim() === '') {
      return 'Please select a strategy'
    }
    if (config.epochs < 10 || config.epochs > 500) {
      return 'Epochs must be between 10 and 500'
    }
    if (config.learningRate < 0.0001 || config.learningRate > 0.1) {
      return 'Learning rate must be between 0.0001 and 0.1'
    }
    return null
  }

  const handleStartTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate configuration
    const validationError = validateConfig()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsTraining(true)
    setError(null)

    try {
      const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!res.ok) throw new Error('Failed to start training')

      const data: TrainingResult = await res.json()
      setJobId(data.jobId)
      setTrainingHistory([data])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setIsTraining(false)
    }
  }

  const progress = result?.progress ?? 0
  const chartData = trainingHistory
    .filter((item) => item.trainLoss && item.valLoss)
    .map((item, idx) => ({
      epoch: idx + 1,
      trainLoss: parseFloat(item.trainLoss?.toFixed(4) || '0'),
      valLoss: parseFloat(item.valLoss?.toFixed(4) || '0'),
    }))

  const weightsData = result?.weights
    ? Object.entries(result.weights).map(([key, value]) => ({
        name: key,
        value: parseFloat((value as number).toFixed(4)),
      }))
    : []

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-4xl font-bold">Model Training</h1>
            </div>
            <p className="text-muted-foreground">Train skill weights using Kaggle datasets and advanced optimization</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Configuration */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="text-cyan-400">Configuration</CardTitle>
                <CardDescription>Set training parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStartTraining} className="space-y-4">
                  {/* Dataset Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Dataset</label>
                    <select
                      value={config.dataset}
                      onChange={(e) => setConfig({ ...config, dataset: e.target.value })}
                      disabled={isTraining}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
                    >
                      <option value="bitcoin-demo">Bitcoin Demo</option>
                      <option value="ethereum-price">Ethereum Price</option>
                      <option value="crypto-markets">Crypto Markets</option>
                    </select>
                  </div>

                  {/* Strategy Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Strategy</label>
                    <select
                      value={config.strategy}
                      onChange={(e) => setConfig({ ...config, strategy: e.target.value })}
                      disabled={isTraining}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
                    >
                      <option value="momentum-cross">Momentum Crossover</option>
                      <option value="rsi-enhanced">RSI Enhanced</option>
                      <option value="bollinger-bands">Bollinger Bands</option>
                      <option value="macd-strategy">MACD Strategy</option>
                    </select>
                  </div>

                  {/* Epochs */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Epochs</label>
                    <input
                      type="number"
                      value={config.epochs}
                      onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                      min={10}
                      max={500}
                      step={10}
                      disabled={isTraining}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
                    />
                    <p className="text-xs text-slate-400 mt-1">Training iterations</p>
                  </div>

                  {/* Learning Rate */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Learning Rate</label>
                    <input
                      type="number"
                      value={config.learningRate}
                      onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
                      min={0.0001}
                      max={0.1}
                      step={0.001}
                      disabled={isTraining}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
                    />
                    <p className="text-xs text-slate-400 mt-1">Gradient descent step size</p>
                  </div>

                  {/* Start Button */}
                  <button
                    type="submit"
                    disabled={isTraining}
                    className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isTraining ? 'Training in progress...' : 'Start Training'}
                  </button>
                </form>

                {/* Status Display */}
                {result && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="text-sm text-slate-300">
                      <p className="mb-2">
                        <span className="text-cyan-400 font-semibold">Job ID:</span> {result.jobId}
                      </p>
                      <p className="mb-2">
                        <span className="text-cyan-400 font-semibold">Status:</span>
                        <span
                          className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold ${
                            result.status === 'success'
                              ? 'bg-green-500/20 text-green-300'
                              : result.status === 'in_progress'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {result.status}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
              </CardContent>
            </Card>
          </div>

          {/* Training Progress & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            {result && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Training Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {result.metrics && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-xs text-slate-400">MSE</p>
                        <p className="text-lg font-semibold text-cyan-400">{result.metrics.mse.toFixed(4)}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-xs text-slate-400">MAE</p>
                        <p className="text-lg font-semibold text-cyan-400">{result.metrics.mae.toFixed(4)}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-xs text-slate-400">RMSE</p>
                        <p className="text-lg font-semibold text-cyan-400">{result.metrics.rmse.toFixed(4)}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-xs text-slate-400">R² Score</p>
                        <p className="text-lg font-semibold text-cyan-400">{result.metrics.r2.toFixed(4)}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-400 mt-4">{result.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Loss Curve */}
            {chartData.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Loss Curves</CardTitle>
                  <CardDescription>Training and validation loss over epochs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="epoch" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="trainLoss" stroke="#00d9ff" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="valLoss" stroke="#ff6b6b" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Learned Weights */}
            {weightsData.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Learned Weights</CardTitle>
                  <CardDescription>Trained skill weight parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weightsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                        }}
                      />
                      <Bar dataKey="value" fill="#00d9ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">About Training</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-3">
              <p>
                This training system optimizes skill weights for the OMEGA Framework using gradient descent with momentum.
              </p>
              <p>The system learns to predict Q-scores (AI capability metrics) based on 8-dimensional skill vectors.</p>
              <p>Training data comes from Kaggle cryptocurrency datasets, processed with technical indicators.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-3">
              <p>
                1. Install Kaggle CLI: <code className="bg-slate-700 px-2 py-1 rounded text-cyan-300">pip install kaggle</code>
              </p>
              <p>2. Configure credentials at ~/.kaggle/kaggle.json</p>
              <p>3. Run data fetcher: python scripts/kaggle_data_fetcher.py</p>
              <p>4. Start training from this interface</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
