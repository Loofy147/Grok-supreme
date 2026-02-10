'use client'

import { AppLayout } from '@/app/app-layout'
import { useState } from 'react'
import { Zap, Plus, X, Sparkles } from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  qScore: number
  category: string
}

interface SelectedSkill extends Skill {
  index: number
}

const availableSkills: Skill[] = [
  {
    id: '1',
    name: 'Market Analysis',
    description: 'Comprehensive cryptocurrency market trend analysis',
    qScore: 0.92,
    category: 'Analysis',
  },
  {
    id: '2',
    name: 'RSI-Enhanced Evolution',
    description: 'Relative Strength Index optimization with evolutionary algorithms',
    qScore: 0.88,
    category: 'Technical',
  },
  {
    id: '3',
    name: 'Transfer Learning',
    description: 'Apply knowledge from other domains to trading problems',
    qScore: 0.94,
    category: 'Meta',
  },
  {
    id: '4',
    name: 'Sentiment Analysis',
    description: 'Real-time social media sentiment tracking',
    qScore: 0.85,
    category: 'Sentiment',
  },
  {
    id: '5',
    name: 'Risk Management',
    description: 'Portfolio risk assessment and mitigation strategies',
    qScore: 0.91,
    category: 'Risk',
  },
  {
    id: '6',
    name: 'Momentum Detection',
    description: 'Identify and exploit market momentum patterns',
    qScore: 0.87,
    category: 'Technical',
  },
]

export default function SkillOrchestrator() {
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([
    { ...availableSkills[0], index: 0 },
    { ...availableSkills[1], index: 1 },
  ])
  const [showResults, setShowResults] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const toggleSkill = (skill: Skill) => {
    const exists = selectedSkills.find((s) => s.id === skill.id)
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))
    } else {
      setSelectedSkills([
        ...selectedSkills,
        { ...skill, index: selectedSkills.length },
      ])
    }
  }

  const removeSkill = (id: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== id))
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setShowResults(true)
    // Simulate analysis delay
    setTimeout(() => setAnalyzing(false), 1500)
  }

  const emergentCapabilities = selectedSkills.length > 0 ? [
    {
      name: 'Synergistic Analysis',
      description: 'Combined insights from multiple skills create new analytical perspectives',
      strength: 0.92,
    },
    {
      name: 'Cross-Domain Transfer',
      description: 'Knowledge transfer between domains for novel problem-solving approaches',
      strength: 0.85,
    },
    {
      name: 'Adaptive Strategy',
      description: 'Dynamic strategy adjustment based on market conditions and skill outputs',
      strength: 0.88,
    },
    {
      name: 'Risk-Adjusted Returns',
      description: 'Optimized risk management across multiple analytical perspectives',
      strength: 0.91,
    },
  ] : []

  const overallQScore =
    selectedSkills.length > 0
      ? (selectedSkills.reduce((sum, s) => sum + s.qScore, 0) / selectedSkills.length)
      : 0

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold">Skill Orchestrator</h1>
          </div>
          <p className="text-muted-foreground">
            Combine AI skills to create emergent trading capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Skills */}
            <div className="metric-card">
              <h2 className="text-lg font-semibold mb-4">Available Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.some((s) => s.id === skill.id)
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill)}
                      className={`text-left p-3 rounded border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{skill.name}</p>
                        {isSelected && (
                          <Plus className="w-4 h-4 text-primary rotate-45" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {skill.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {skill.category}
                        </span>
                        <span className="text-xs text-primary font-mono">
                          Q: {(skill.qScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Skills */}
            <div className="metric-card">
              <h2 className="text-lg font-semibold mb-4">
                Orchestration ({selectedSkills.length} skills)
              </h2>
              {selectedSkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Select skills above to create an orchestration
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex justify-between items-center p-3 bg-background/50 rounded border border-border/30"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{skill.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {skill.category}
                          </span>
                          <span className="text-xs text-primary">
                            Q: {(skill.qScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={selectedSkills.length === 0 || analyzing}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2 px-4 rounded hover:opacity-90 disabled:opacity-50 transition-opacity mt-4"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Orchestration'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {selectedSkills.length > 0 && (
              <div className="metric-card sticky top-8 space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Overall Q-Score</p>
                  <p className="text-4xl font-bold text-primary">
                    {(overallQScore * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="h-px bg-border" />

                {showResults && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Emergent Capabilities</p>
                    {emergentCapabilities.map((cap, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <p className="font-semibold text-primary">{cap.name}</p>
                          <p className="text-primary">
                            {(cap.strength * 100).toFixed(0)}%
                          </p>
                        </div>
                        <p className="text-muted-foreground mb-2">{cap.description}</p>
                        <div className="w-full bg-card rounded-full h-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                            style={{ width: `${cap.strength * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="h-px bg-border" />

                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">Skill Components:</p>
                  <p className="text-foreground">
                    {selectedSkills.map((s) => s.name).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
