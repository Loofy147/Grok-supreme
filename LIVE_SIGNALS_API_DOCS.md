# Live Trading Signals API Documentation

Complete API reference for multi-timeframe trading signals with entry, stop loss, and take profit calculations.

## Overview

The Live Signals system provides real-time trading signals across 5 timeframes:
- **Scalping**: Short-term, tight risk management
- **1h**: Intra-day trading
- **4h**: Medium-term swing trading
- **Daily**: Daily/position trading
- **Weekly**: Long-term trend following

Each signal includes:
- Entry price (current market price)
- Stop Loss (risk-based calculation)
- Take Profit (reward-based, or open for daily/weekly)
- Confidence score (0-100)
- RSI and Momentum indicators

---

## API Endpoints

### 1. Live Signals Calculation

**Endpoint:** `POST /api/signals/live`

Calculates signals across all timeframes and provides entry/SL/TP recommendations.

**Request Body:**
```json
{
  "prices": [60000, 60100, 60200, ...],  // Array of prices (min 100 bars)
  "volumes": [25000000000, 26000000000, ...],  // Trading volumes
  "currentPrice": 68783.35  // Current BTC price
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-02-10T21:35:00.000Z",
  "currentPrice": 68783.35,
  "signals": [
    {
      "timeframe": "scalping",
      "signal": "Buy",
      "entry": 68783.35,
      "stopLoss": 68067.92,
      "takeProfit": 70045.12,
      "tpStatus": "closed",
      "confidence": 55.1,
      "rsi": 45.3,
      "momentum": 2.5
    },
    {
      "timeframe": "1h",
      "signal": "Hold",
      "entry": 68783.35,
      "stopLoss": 67731.55,
      "takeProfit": 70658.18,
      "tpStatus": "closed",
      "confidence": 38.2,
      "rsi": 52.1,
      "momentum": 1.8
    },
    // ... more timeframes
  ],
  "aggregateSignal": "Buy",
  "recommendation": "Strong Buy Signal: 3 timeframes bullish",
  "riskRewardRatio": 1.65
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| timeframe | string | Trading timeframe (scalping, 1h, 4h, daily, weekly) |
| signal | string | Signal type (Buy, Sell, Hold) |
| entry | number | Entry price (current market price) |
| stopLoss | number | Stop loss price (risk-based) |
| takeProfit | number \| null | Take profit price (null = open) |
| tpStatus | string | "closed" (fixed TP) or "open" (no TP) |
| confidence | number | Signal strength 0-100 |
| rsi | number | Relative Strength Index (0-100) |
| momentum | number | Momentum percentage change |

---

### 2. Market Data Fetching

**Endpoint:** `GET /api/signals/market-data`

Fetches current BTC price and 30-day historical data from CoinGecko.

**Response:**
```json
{
  "success": true,
  "currentPrice": 68783.35,
  "prices": [64500, 64600, 64700, ...],  // 30-day daily prices
  "volumes": [25000000000, 26000000000, ...],  // 30-day volumes
  "change24h": 2.15,
  "volume24h": 28500000000,
  "timestamp": "2026-02-10T21:35:00.000Z"
}
```

---

### 3. Detailed Signal Analysis

**Endpoint:** `POST /api/signals/analysis`

Deep-dive analysis with indicator values for each timeframe.

**Request Body:**
```json
{
  "prices": [60000, 60100, 60200, ...],
  "volumes": [25000000000, 26000000000, ...],
  "entry": 68783.35
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-02-10T21:35:00.000Z",
  "analysis": [
    {
      "timeframe": "daily",
      "signal": "Buy",
      "entry": 68783.35,
      "stopLoss": 66659.88,
      "takeProfit": 72500.00,
      "tpStatus": "closed",
      "confidence": 62.5,
      "indicators": {
        "rsi": 55.2,
        "momentum": 3.2,
        "maShort": 68500.12,
        "maLong": 67800.45,
        "maCrossover": true,
        "volumeConfirm": true
      },
      "riskMetrics": {
        "riskPercent": 3.08,
        "rewardPercent": 5.25,
        "rrRatio": 1.70,
        "positionSize": 3.25
      }
    },
    // ... more timeframes
  ],
  "summary": {
    "strongestTimeframe": "daily",
    "weakestTimeframe": "scalping",
    "consensusSignal": "Buy",
    "agreementPercent": 60.0,
    "overallQuality": 50.2
  }
}
```

---

### 4. Complete Trading Setup

**Endpoint:** `POST /api/signals/setup`

Full trading setup recommendations with complete instructions.

**Request Body:**
```json
{
  "prices": [60000, 60100, 60200, ...],
  "volumes": [25000000000, 26000000000, ...],
  "currentPrice": 68783.35
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-02-10T21:35:00.000Z",
  "currentPrice": 68783.35,
  "setups": [
    {
      "timeframe": "daily",
      "signal": "Buy",
      "entry": 68783.35,
      "stopLoss": 66659.88,
      "takeProfit": 72500.00,
      "tpType": "closed",
      "riskAmount": 2123.47,
      "rewardAmount": 3716.65,
      "riskRewardRatio": 1.75,
      "confidence": 62.5,
      "recommendation": "BUY at 68783.35 | SL: 66659.88 | TP: 72500.00 | RR: 1.75:1"
    },
    // ... more timeframes
  ],
  "bestSetup": {
    "timeframe": "daily",
    "reason": "62.5% confidence, 1.75:1 RR",
    "priority": "High"
  },
  "summary": "STRONG BUY SIGNAL: 3/5 timeframes bullish (50.2% avg confidence)"
}
```

---

## Frontend Integration

### Using React Hooks

```typescript
import { useSignals, useSetups, useMarketData } from '@/hooks/use-signals'

export function TradingComponent() {
  // Auto-refresh every 5 minutes
  const { data: signals, loading, error, refetch } = useSignals(true, 300000)
  
  // Use setups for trading recommendations
  const { data: setups } = useSetups(true, 300000)
  
  // Use market data only
  const { data: market } = useMarketData(true, 60000)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Current Price: ${signals?.currentPrice}</h2>
      <p>Signal: {signals?.aggregateSignal}</p>
      {setups?.bestSetup && (
        <div>
          <p>Best Setup: {setups.bestSetup.timeframe}</p>
          <p>Entry: {signals?.currentPrice}</p>
          {/* Display trading details */}
        </div>
      )}
    </div>
  )
}
```

### Direct API Calls

```typescript
// Fetch market data
const marketRes = await fetch('/api/signals/market-data')
const market = await marketRes.json()

// Calculate signals
const signalRes = await fetch('/api/signals/live', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prices: market.prices,
    volumes: market.volumes,
    currentPrice: market.currentPrice,
  }),
})
const signals = await signalRes.json()

// Get detailed analysis
const analysisRes = await fetch('/api/signals/analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prices: market.prices,
    volumes: market.volumes,
    entry: market.currentPrice,
  }),
})
const analysis = await analysisRes.json()
```

---

## Signal Interpretation Guide

### Signal Types

**BUY Signal Conditions:**
- Short MA > Long MA (bullish crossover)
- RSI < 70 (not overbought)
- Volume > Average (volume confirmation)
- OR RSI < 20 (oversold reversal)

**SELL Signal Conditions:**
- Short MA < Long MA (bearish crossover)
- RSI > 60 (overbought)
- Momentum < -1% (negative momentum)
- OR RSI > 80 (extreme overbought)

**HOLD:**
- No clear signal from indicators
- Mixed signals across timeframes

### Risk Management

**Stop Loss Calculation:**
```
SL = Entry × (1 - RiskPercent)
```

Timeframe-based risk percentages:
- Scalping: 1.0%
- 1h: 1.5%
- 4h: 2.0%
- Daily: 3.0%
- Weekly: 5.0%

**Take Profit Calculation:**
```
RiskAmount = Entry - SL
TP = Entry + (RiskAmount × RRMultiplier × 1.5)
```

For Daily/Weekly timeframes: **TP is OPEN** (no fixed target)

**Risk-Reward Ratio:**
```
RR = (TP - Entry) / (Entry - SL)
```

Target RR >= 1.5:1

---

## Timeframe Parameters

| Timeframe | Short MA | Long MA | SL % | RR Multiplier | Use Case |
|-----------|----------|---------|------|---------------|----------|
| Scalping | 3 | 10 | 1.0 | 1.0 | High-frequency, tight stops |
| 1h | 5 | 20 | 1.5 | 1.5 | Intra-day trading |
| 4h | 7 | 30 | 2.0 | 2.0 | Swing trading |
| Daily | 10 | 50 | 3.0 | 3.0 | Position trading |
| Weekly | 20 | 100 | 5.0 | 5.0 | Long-term trends |

---

## Confidence Scoring

Confidence represents signal quality (0-100):

- **75-100:** Very strong signal, high probability
- **50-74:** Good signal, reasonable confidence
- **25-49:** Weak signal, use with caution
- **0-24:** No clear signal, wait for better setup

Confidence is calculated from:
- MA crossover distance
- RSI divergence from center
- Volume confirmation
- Trained model weights (w_C, w_S, w_V)

---

## Performance Metrics

### Aggregate Signal
Multi-timeframe consensus:
- **3+ Buy signals:** STRONG BUY
- **2 Buy signals:** WEAK BUY
- **3+ Sell signals:** STRONG SELL
- **2 Sell signals:** WEAK SELL
- **Equal:** NEUTRAL

### Risk-Reward Ratio
Average across closed-TP setups:
- Shown as X:1 format
- -1 indicates open TP setups
- Target minimum 1.5:1

---

## Example Workflows

### Workflow 1: Quick Signal Check
```javascript
// Get current price and signals
const market = await fetch('/api/signals/market-data').then(r => r.json())
const signals = await fetch('/api/signals/live', {
  method: 'POST',
  body: JSON.stringify({
    prices: market.prices,
    volumes: market.volumes,
    currentPrice: market.currentPrice,
  }),
}).then(r => r.json())

// Check aggregate signal
if (signals.aggregateSignal === 'Buy') {
  // Find best timeframe setup
  const best = signals.signals.reduce((a, b) => 
    b.confidence > a.confidence ? b : a
  )
  console.log(`BUY: Entry ${best.entry}, SL ${best.stopLoss}, TP: ${best.takeProfit || 'Open'}`)
}
```

### Workflow 2: Detailed Trading Setup
```javascript
// Get complete trading setup recommendations
const market = await fetch('/api/signals/market-data').then(r => r.json())
const setup = await fetch('/api/signals/setup', {
  method: 'POST',
  body: JSON.stringify({
    prices: market.prices,
    volumes: market.volumes,
    currentPrice: market.currentPrice,
  }),
}).then(r => r.json())

// Use best setup for trading
if (setup.bestSetup?.priority === 'High') {
  const recommendation = setup.setups.find(s => s.timeframe === setup.bestSetup.timeframe)
  console.log(recommendation.recommendation)
}
```

---

## Error Handling

All endpoints return error messages:

```json
{
  "success": false,
  "timestamp": "2026-02-10T21:35:00.000Z",
  "error": "Insufficient price data",
  "currentPrice": 0,
  "signals": [],
  "aggregateSignal": "Hold"
}
```

Common errors:
- **Insufficient data:** Requires 100+ price bars
- **Volume data mismatch:** Volumes don't match price length
- **API unavailable:** CoinGecko temporarily down
- **Network error:** Connection issues

---

## Rate Limiting

- Market data: 60-second minimum refresh
- Signal calculation: 5-minute recommended refresh
- Analysis: 5-minute recommended refresh
- Setup generation: 5-minute recommended refresh

CoinGecko API: ~10-50 calls/minute recommended

---

## Best Practices

1. **Always validate signals** across multiple timeframes
2. **Use best setup** (highest priority) for trade entries
3. **Check RR ratio** - target minimum 1.5:1
4. **Monitor confidence** - prefer signals >50%
5. **Respect stop losses** - never move them against you
6. **Review timeframe logic** - understand why each timeframe signals
7. **Track performance** - log trades with their setups
8. **Adjust for market conditions** - signals work best in trending markets

---

## Support

For integration help or issues:
- Check the example React component in `/components/signals-dashboard.tsx`
- Review hooks in `/hooks/use-signals.ts`
- See page example in `/app/signals/page.tsx`

All signals are simulated and for educational purposes only. Not financial advice.
