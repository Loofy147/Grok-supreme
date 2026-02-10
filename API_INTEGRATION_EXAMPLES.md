# API Integration Examples

Quick reference for adding signal generation endpoints to your backend.

## 1. Basic Signal Generation Endpoint

Create `app/api/signals/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

interface SignalRequest {
  prices: number[]
  volumes: number[]
  timeframes?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: SignalRequest = await request.json()
    const { prices, volumes, timeframes } = body

    if (!prices || !volumes) {
      return NextResponse.json(
        { error: 'prices and volumes required' },
        { status: 400 }
      )
    }

    // Call Python signal generator
    const { execSync } = require('child_process')
    
    const pythonCode = `
import sys
import json
sys.path.insert(0, '/vercel/share/v0-project')

from src.core.signal_integration import SignalGenerator

prices = ${JSON.stringify(prices)}
volumes = ${JSON.stringify(volumes)}
timeframes = ${JSON.stringify(timeframes || ['scalping', '1h', '4h', 'daily', 'weekly'])}

generator = SignalGenerator()
signals = generator.generate_signal_summary(prices, volumes)

print(json.dumps(signals, default=str))
`

    const result = execSync(`python3 -c "${pythonCode.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8'
    })

    const signals = JSON.parse(result)
    return NextResponse.json(signals)

  } catch (error) {
    console.error('Signal generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate signals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

## 2. Signal Quality Analysis Endpoint

Create `app/api/signals/quality/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

interface QualityRequest {
  prices: number[]
  volumes: number[]
  timeframe?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: QualityRequest = await request.json()
    const { prices, volumes, timeframe = 'daily' } = body

    if (!prices || !volumes) {
      return NextResponse.json(
        { error: 'prices and volumes required' },
        { status: 400 }
      )
    }

    const { execSync } = require('child_process')
    
    const pythonCode = `
import sys
import json
sys.path.insert(0, '/vercel/share/v0-project')

from src.core.signal_integration import SignalGenerator

prices = ${JSON.stringify(prices)}
volumes = ${JSON.stringify(volumes)}
timeframe = '${timeframe}'

generator = SignalGenerator()
quality = generator.analyze_signal_quality(prices, volumes, timeframe)

print(json.dumps(quality, default=str))
`

    const result = execSync(`python3 -c "${pythonCode.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8'
    })

    const quality = JSON.parse(result)
    return NextResponse.json(quality)

  } catch (error) {
    console.error('Quality analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze signal quality', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

## 3. Multi-Timeframe Signal Endpoint (Simple Version)

Create `app/api/signals/multi-timeframe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prices, volumes } = body

    if (!prices || !volumes) {
      return NextResponse.json(
        { error: 'prices and volumes required' },
        { status: 400 }
      )
    }

    const { execSync } = require('child_process')
    
    const pythonCode = `
import sys
import json
sys.path.insert(0, '/vercel/share/v0-project')

from src.core.signal_integration import SignalGenerator

prices = ${JSON.stringify(prices)}
volumes = ${JSON.stringify(volumes)}

generator = SignalGenerator()
signals = generator.generate_multi_timeframe_signals(prices, volumes)

print(json.dumps(signals, default=str))
`

    const result = execSync(`python3 -c "${pythonCode.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8'
    })

    const signals = JSON.parse(result)
    
    // Format for clean response
    const formatted = {
      signals,
      generated_at: new Date().toISOString(),
      data_points: prices.length
    }

    return NextResponse.json(formatted)

  } catch (error) {
    console.error('Multi-timeframe signal error:', error)
    return NextResponse.json(
      { error: 'Failed to generate signals' },
      { status: 500 }
    )
  }
}
```

## 4. Client-Side Hook for Signals

Create `hooks/use-signals.ts`:

```typescript
import { useState, useCallback } from 'react'
import useSWR from 'swr'

interface SignalData {
  primary_signal: string
  confidence: number
  primary_timeframe: string
  signal_agreement: number
  all_signals: Record<string, any>
  generated_at: string
}

interface UseSignalsOptions {
  prices?: number[]
  volumes?: number[]
  enabled?: boolean
  refreshInterval?: number
}

export function useSignals(options: UseSignalsOptions = {}) {
  const {
    prices,
    volumes,
    enabled = true,
    refreshInterval = 60000
  } = options

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSignals = useCallback(async () => {
    if (!prices || !volumes || !enabled) {
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices, volumes })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: SignalData = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [prices, volumes, enabled])

  // Use SWR for automatic refreshing
  const { data, mutate } = useSWR(
    enabled && prices && volumes ? ['signals', prices.length, volumes.length] : null,
    () => fetchSignals(),
    { 
      revalidateInterval: refreshInterval,
      revalidateOnFocus: false
    }
  )

  return {
    signals: data || null,
    loading,
    error,
    refresh: mutate
  }
}

// Usage in component:
/*
function MyComponent() {
  const { signals, loading, error } = useSignals({
    prices: btcPrices,
    volumes: btcVolumes,
    refreshInterval: 60000
  })

  if (loading) return <div>Loading signals...</div>
  if (error) return <div>Error: {error}</div>
  if (!signals) return <div>No signals</div>

  return (
    <div>
      <h2>Primary Signal: {signals.primary_signal}</h2>
      <p>Confidence: {signals.confidence.toFixed(1)}%</p>
    </div>
  )
}
*/
```

## 5. Integration with Simulator

Update `app/simulator/page.tsx` to use real signals:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSignals } from '@/hooks/use-signals'
import { SignalDashboard } from '@/components/signal-dashboard'

export default function StrategySimulator() {
  const [btcData, setBtcData] = useState<{prices: number[], volumes: number[]} | null>(null)
  
  // Fetch BTC data
  useEffect(() => {
    const fetchBTCData = async () => {
      try {
        const response = await fetch('/api/btc-price')
        const data = await response.json()
        setBtcData({
          prices: data.prices,
          volumes: data.volumes
        })
      } catch (error) {
        console.error('Failed to fetch BTC data:', error)
      }
    }

    fetchBTCData()
    const interval = setInterval(fetchBTCData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Get signals using hook
  const { signals, loading, error, refresh } = useSignals({
    prices: btcData?.prices,
    volumes: btcData?.volumes,
    refreshInterval: 60000
  })

  return (
    <div className="space-y-8">
      <h1>Strategy Simulator with Live Signals</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {loading && <p>Loading signals...</p>}

      {signals && <SignalDashboard signals={signals} onRefresh={refresh} />}
    </div>
  )
}
```

## 6. Direct Python Integration (For Scheduled Jobs)

Create a scheduled validation job:

```python
# scripts/scheduled_validation.py
import sys
import os
from datetime import datetime
import json

sys.path.insert(0, os.path.abspath('.'))

from src.core.signal_integration import SignalGenerator, get_current_signals
from tests.validate_signals import run_multi_timeframe_validation
import pandas as pd

def run_daily_validation():
    """Run daily validation and save results."""
    print(f"[{datetime.now()}] Starting daily signal validation...")
    
    # Load latest BTC data
    try:
        df = pd.read_csv('kaggle_data/bitcoin_data.csv')
        prices = df['Close'].tolist()
        volumes = df['Volume'].tolist()
        
        # Generate current signals
        signals = get_current_signals(prices, volumes)
        
        # Run backtest validation
        validation_results = run_multi_timeframe_validation(df)
        
        # Save results
        timestamp = datetime.now().isoformat()
        results = {
            'timestamp': timestamp,
            'signals': signals,
            'validation': validation_results
        }
        
        with open('logs/daily_validation.json', 'a') as f:
            f.write(json.dumps(results) + '\n')
        
        print(f"✅ Validation complete at {timestamp}")
        return results
        
    except Exception as e:
        print(f"❌ Validation failed: {e}")
        return None

if __name__ == '__main__':
    run_daily_validation()
```

Schedule with cron (runs daily at 8 AM):
```bash
0 8 * * * cd /path/to/project && python3 scripts/scheduled_validation.py
```

## 7. Response Format Examples

### Signal Response
```json
{
  "primary_signal": "Buy",
  "primary_timeframe": "daily",
  "confidence": 72.5,
  "signal_agreement": 80.0,
  "signal_distribution": {
    "Buy": 4,
    "Hold": 1,
    "Sell": 0
  },
  "all_signals": {
    "daily": {
      "signal": "Buy",
      "confidence": 75.2,
      "entry_price": 68500.0,
      "stop_loss": 66700.0,
      "take_profit": 70300.0,
      "momentum": 2.5,
      "timestamp": "2026-02-10T21:35:00Z"
    },
    "4h": {
      "signal": "Buy",
      "confidence": 68.3,
      "entry_price": 68500.0,
      "stop_loss": 67200.0,
      "take_profit": 69800.0,
      "momentum": 1.8,
      "timestamp": "2026-02-10T21:35:00Z"
    }
  },
  "generated_at": "2026-02-10T21:35:00Z"
}
```

### Quality Analysis Response
```json
{
  "is_valid": true,
  "signal": "Buy",
  "confidence_score": 72.5,
  "volatility": 2.3,
  "trend_coherence": 83.3,
  "ma_alignment": 100.0,
  "rsi_alignment": 100.0,
  "volume_alignment": 66.7,
  "recommended_action": "BUY",
  "risk_level": "LOW",
  "analysis_timestamp": "2026-02-10T21:35:00Z"
}
```

---

## Error Handling Best Practices

```typescript
// Retry logic for API calls
async function fetchSignalsWithRetry(
  prices: number[],
  volumes: number[],
  maxRetries = 3
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('/api/signals', {
        method: 'POST',
        body: JSON.stringify({ prices, volumes })
      })
      
      if (response.ok) {
        return await response.json()
      }
      
      // Retry on server errors
      if (response.status >= 500 && attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
        continue
      }
      
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
    }
  }
}
```

---

**Ready to integrate! Start with endpoint #1 and add others as needed.**
