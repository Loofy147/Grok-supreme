# Live Trading Signals - Troubleshooting Guide

## Common Issues & Solutions

### 1. "Insufficient Data" Error

**Problem:** API returns "Requires at least 100 price bars"

**Causes:**
- Market data endpoint returned fewer than 100 bars
- Prices array is empty or too small

**Solutions:**
```typescript
// Check data length before sending
const market = await fetch('/api/signals/market-data').then(r => r.json())
console.log(`[v0] Prices received: ${market.prices.length}`)

if (market.prices.length < 100) {
  console.log('[v0] Insufficient data, waiting...')
  // Retry in 5 seconds
  setTimeout(fetchSignals, 5000)
}
```

### 2. API Returns Empty Signals Array

**Problem:** Success is true but signals array is empty

**Possible Causes:**
- Market data has insufficient history
- CoinGecko API returned partial data
- Volumes array missing

**Check:**
```typescript
const market = await fetch('/api/signals/market-data').then(r => r.json())
console.log('[v0] Prices length:', market.prices.length)
console.log('[v0] Volumes length:', market.volumes.length)
console.log('[v0] Current price:', market.currentPrice)
```

**Fix:** Ensure volumes are included:
```typescript
if (!market.volumes || market.volumes.length === 0) {
  console.log('[v0] Missing volumes, using synthetic volumes')
  market.volumes = market.prices.map(() => 25000000000 + Math.random() * 10000000000)
}
```

### 3. "Cannot read property of undefined"

**Problem:** Accessing signals that don't exist

**Solution:**
```typescript
// Always check data exists first
const signals = await fetch('/api/signals/live', { /* ... */ }).then(r => r.json())

if (signals.success && signals.signals?.length > 0) {
  // Safe to access
  const dailySignal = signals.signals.find(s => s.timeframe === 'daily')
} else {
  console.log('[v0] Signals not available')
}
```

### 4. Hook Not Updating

**Problem:** `useSignals` hook not fetching new data

**Causes:**
- `enabled` parameter is false
- Refresh interval is 0
- Component not re-rendering

**Solutions:**
```typescript
// 1. Make sure enabled is true
const { data } = useSignals(true, 300000)  // enabled=true

// 2. Check refresh interval
const { data } = useSignals(true, 60000)  // refresh every 60 seconds

// 3. Manual refetch
const { refetch } = useSignals()
const handleManualRefresh = () => {
  refetch()
}

// 4. Check component dependency
useEffect(() => {
  const interval = setInterval(() => {
    refetch()
  }, 300000)
  return () => clearInterval(interval)
}, [refetch])
```

### 5. Dashboard Shows "Loading..." Forever

**Problem:** Dashboard stuck on loading state

**Debugging:**
```typescript
// Add debug logs to signals-dashboard.tsx
console.log('[v0] Setup loading:', setupLoading)
console.log('[v0] Signal loading:', signalLoading)
console.log('[v0] Setup error:', setupError)
console.log('[v0] Signal error:', signalError)
console.log('[v0] Setup data:', setupData)
console.log('[v0] Signal data:', signalData)
```

**Common Fix:**
```typescript
// Ensure both API calls complete
const { data: setupData, loading: setupLoading, error: setupError } = useSetups(true, 300000)
const { data: signalData, loading: signalLoading, error: signalError } = useSignals(true, 300000)

// Wait for both
const loading = setupLoading && signalLoading
```

### 6. CoinGecko API Errors

**Problem:** "Failed to fetch market data"

**Causes:**
- CoinGecko API rate limited
- Network connectivity issue
- CORS error

**Solutions:**
```typescript
// Add retry logic
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (res.ok) return res
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    } catch (e) {
      console.log(`[v0] Retry ${i + 1}/${maxRetries}`)
    }
  }
  throw new Error('API unreachable')
}

// Use in market data fetching
const res = await fetchWithRetry('/api/signals/market-data')
```

### 7. Signals All "Hold"

**Problem:** Every timeframe shows "Hold"

**Possible Causes:**
- RSI near 50 (neutral)
- No clear MA crossover
- Low volume
- Trending sideways market

**Check RSI & Momentum:**
```typescript
const dailySignal = signals.signals.find(s => s.timeframe === 'daily')
console.log('[v0] Daily RSI:', dailySignal.rsi)
console.log('[v0] Daily Momentum:', dailySignal.momentum)
console.log('[v0] Daily Confidence:', dailySignal.confidence)

// RSI 45-55 = neutral
// Confidence <40 = weak signal
```

**This is normal!** Not every market setup produces strong signals.

### 8. Take Profit Shows "Open" for All

**Problem:** All TP values are null

**Expected Behavior:**
- Daily & Weekly: TP is intentionally OPEN (long-term trend)
- Scalping, 1h, 4h: Should have fixed TPs

**If all are open:**
```typescript
const scalping = signals.signals.find(s => s.timeframe === 'scalping')
if (scalping.takeProfit === null) {
  console.log('[v0] WARNING: Scalping TP should not be null')
  // Check API code for issue
}
```

### 9. Very High Risk-Reward Ratio

**Problem:** RR shows 5.0:1 or higher

**Why it happens:**
- Large SL and TP distance
- Extremely bullish/bearish signal
- Edge case in calculation

**Risk Check:**
```typescript
if (signal.riskRewardRatio > 3) {
  console.log('[v0] WARNING: Very high RR, verify risk management')
  // SL and TP might be too far
}
```

### 10. Confidence Always Low (<30%)

**Problem:** All signals show <30% confidence

**Causes:**
- Market trending sideways
- No clear technical setup
- Data quality issue

**Check Data Quality:**
```typescript
const prices = market.prices
console.log('[v0] Price range:', Math.min(...prices), '-', Math.max(...prices))
console.log('[v0] Price volatility:', (Math.max(...prices) - Math.min(...prices)) / Math.min(...prices) * 100, '%')

// Sideways market has low volatility
// Normal range: 3-10% for 30 days
```

---

## Testing Checklist

### 1. Test Market Data API
```bash
curl http://localhost:3000/api/signals/market-data
```

**Expected:**
- Status 200
- JSON with prices, volumes, currentPrice
- Prices array > 100 items

### 2. Test Live Signals API
```bash
curl -X POST http://localhost:3000/api/signals/live \
  -H "Content-Type: application/json" \
  -d '{
    "prices": [68000, 68100, 68200, ...],
    "volumes": [25000000000, ...],
    "currentPrice": 68783.35
  }'
```

**Expected:**
- Status 200
- 5 signals (one per timeframe)
- aggregateSignal is Buy/Sell/Hold

### 3. Test Dashboard Component
```typescript
// In a test component
import { SignalsDashboard } from '@/components/signals-dashboard'

export default function TestPage() {
  return <SignalsDashboard />
}

// Visit /test-signals
// Should show loading, then data
```

### 4. Test Hooks
```typescript
export function TestHooks() {
  const signals = useSignals(true, 10000) // refresh every 10s for testing
  const setups = useSetups(true, 10000)

  return (
    <div>
      <p>Signals loading: {signals.loading}</p>
      <p>Signals error: {signals.error}</p>
      <p>Signals data: {signals.data?.currentPrice}</p>
      <p>Setups loading: {setups.loading}</p>
      <button onClick={() => signals.refetch()}>Refetch</button>
    </div>
  )
}
```

---

## Performance Optimization

### 1. Reduce API Calls
```typescript
// Bad: Fetching every second
const { data } = useSignals(true, 1000)

// Good: Fetch every 5 minutes
const { data } = useSignals(true, 300000)
```

### 2. Cache Market Data
```typescript
// Reuse market data across hooks
const { data: market } = useMarketData(true, 60000)

// Pass to both signals and setups
// Avoid double-fetching
```

### 3. Memoize Components
```typescript
const MemoizedSignalCard = memo(function SignalCard({ signal }) {
  return (
    <div>
      <p>{signal.signal}</p>
      <p>{signal.confidence}%</p>
    </div>
  )
})
```

---

## Debug Mode

Enable comprehensive logging:

```typescript
// Add to signals-dashboard.tsx
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[v0] Setup Data:', setupData)
    console.log('[v0] Signal Data:', signalData)
    console.log('[v0] Setup Error:', setupError)
    console.log('[v0] Signal Error:', signalError)
  }
}, [setupData, signalData, setupError, signalError])
```

---

## Still Having Issues?

### Check These Files First

1. **`/app/api/signals/live/route.ts`** - Main signal logic
2. **`/app/api/signals/market-data/route.ts`** - Data fetching
3. **`/hooks/use-signals.ts`** - React integration
4. **`/components/signals-dashboard.tsx`** - UI component

### Verify Setup

1. All 4 API routes exist
2. `use-signals.ts` hook in `/hooks`
3. `signals-dashboard.tsx` component in `/components`
4. `/signals` page is accessible

### Last Resort: Manual Test

```typescript
// Test all APIs manually
async function testAll() {
  try {
    console.log('[v0] Testing market data...')
    const m = await fetch('/api/signals/market-data').then(r => r.json())
    console.log('[v0] Market data:', m)

    console.log('[v0] Testing live signals...')
    const s = await fetch('/api/signals/live', {
      method: 'POST',
      body: JSON.stringify({
        prices: m.prices,
        volumes: m.volumes,
        currentPrice: m.currentPrice,
      }),
    }).then(r => r.json())
    console.log('[v0] Live signals:', s)

    console.log('[v0] Testing setup...')
    const u = await fetch('/api/signals/setup', {
      method: 'POST',
      body: JSON.stringify({
        prices: m.prices,
        volumes: m.volumes,
        currentPrice: m.currentPrice,
      }),
    }).then(r => r.json())
    console.log('[v0] Setup:', u)
  } catch (error) {
    console.error('[v0] Test failed:', error)
  }
}

// Run in browser console
testAll()
```

---

## Support Resources

- Full API docs: `/LIVE_SIGNALS_API_DOCS.md`
- Quick start: `/LIVE_SIGNALS_QUICK_START.md`
- Source files: Check `/app/api/signals/*`
- React hooks: Check `/hooks/use-signals.ts`

Good luck with your signals implementation!
