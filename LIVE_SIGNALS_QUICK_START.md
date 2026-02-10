# Live Trading Signals - Quick Start Guide

## What You Get

5 Trading Signals across timeframes with complete trading setup:
- **Entry Point:** Current market price
- **Stop Loss:** Risk-based (1-5% depending on timeframe)
- **Take Profit:** Reward-based or OPEN for longer timeframes
- **Confidence:** 0-100 quality score
- **Risk/Reward Ratio:** Expected return vs risk

## 3-Minute Integration

### 1. Add Hook to Your Component
```typescript
import { useSignals, useSetups } from '@/hooks/use-signals'

export function MyComponent() {
  // Auto-refresh every 5 minutes
  const { data: signals } = useSignals(true, 300000)
  const { data: setups } = useSetups(true, 300000)
  
  return (
    <div>
      <p>Signal: {signals?.aggregateSignal}</p>
      <p>Price: ${signals?.currentPrice}</p>
      {setups?.bestSetup && (
        <p>Best Setup: {setups.bestSetup.timeframe}</p>
      )}
    </div>
  )
}
```

### 2. Use Pre-Built Dashboard
```typescript
import { SignalsDashboard } from '@/components/signals-dashboard'

export default function Page() {
  return <SignalsDashboard />
}
```

Or visit: **`/signals`** page (already created!)

### 3. Direct API Call
```typescript
// Get market data
const market = await fetch('/api/signals/market-data').then(r => r.json())

// Calculate signals
const signals = await fetch('/api/signals/live', {
  method: 'POST',
  body: JSON.stringify({
    prices: market.prices,
    volumes: market.volumes,
    currentPrice: market.currentPrice,
  }),
}).then(r => r.json())

console.log(signals.signals) // Array of 5 timeframe signals
```

## API Response Example

```json
{
  "success": true,
  "currentPrice": 68783.35,
  "aggregateSignal": "Buy",
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
      "confidence": 38.2
    },
    // ... daily, 4h, weekly
  ],
  "riskRewardRatio": 1.65
}
```

## Timeframes at a Glance

| Frame | Use | Entry | SL | TP |
|-------|-----|-------|----|----|
| Scalping | Quick trades | Market | -1% | 1.5x risk |
| 1h | Intra-day | Market | -1.5% | 2.25x risk |
| 4h | Swing trade | Market | -2% | 3x risk |
| Daily | Position | Market | -3% | 4.5x risk |
| Weekly | Trend | Market | -5% | OPEN |

## API Endpoints

```
POST /api/signals/live          → All signals + aggregate
POST /api/signals/setup         → Trading recommendations
POST /api/signals/analysis      → Detailed indicators
GET  /api/signals/market-data   → Current price + 30-day history
```

## Signal Meanings

**BUY:** MA crossover + Low RSI + Good volume  
**SELL:** MA crossover down + High RSI + Negative momentum  
**HOLD:** No clear signal, wait for better setup

## Key Numbers to Know

- **Confidence:** Aim for 50%+ (sweet spot 60-70%)
- **Risk/Reward:** Want 1.5:1 minimum
- **Aggregate:** Need 3+ same signal for "Strong"

## Real-World Example

```
Current Price: $68,783.35

SIGNALS:
- Scalping:  BUY  (55% conf) - Entry $68,783 SL $68,067 TP $70,045
- 1h:        HOLD (38% conf)
- 4h:        BUY  (62% conf) - Entry $68,783 SL $67,440 TP $71,340
- Daily:     BUY  (65% conf) - Entry $68,783 SL $66,659 TP: OPEN
- Weekly:    HOLD (42% conf)

AGGREGATE: STRONG BUY (3/5 timeframes)
RECOMMENDATION: 3 timeframes bullish, focus on Daily (best RR)
BEST SETUP: Daily timeframe, 65% confidence, 1.75:1 RR
```

## Dashboard View

Visit `/signals` page for complete visual dashboard with:
- Live price & aggregate signal
- Best setup highlighted
- All 5 timeframes in cards
- Detailed trading setups
- Indicator table (RSI, Momentum, etc)

## Integration Checklist

- [x] API endpoints created
- [x] React hooks ready
- [x] Dashboard component built
- [x] Signals page created (`/signals`)
- [x] TypeScript types defined
- [x] Error handling implemented
- [x] Auto-refresh configured

## What's Ready

✅ 4 API endpoints  
✅ 3 React hooks (useSignals, useSetups, useMarketData)  
✅ Dashboard component  
✅ Signals page  
✅ Complete documentation  

## Files Created

```
/app/api/signals/live/route.ts           → Main signal calculation
/app/api/signals/market-data/route.ts    → Price + volume data
/app/api/signals/analysis/route.ts       → Detailed analysis
/app/api/signals/setup/route.ts          → Trading recommendations
/hooks/use-signals.ts                    → React hooks
/components/signals-dashboard.tsx        → Dashboard UI
/app/signals/page.tsx                    → Signals page
```

## Next Steps

1. **Test the API:** Visit `/api/signals/market-data`
2. **View signals:** Go to `/signals` page
3. **Use in your app:** Import hooks or create custom components
4. **Customize:** Edit styles in dashboard component
5. **Monitor:** Refresh interval set to 5 minutes (adjustable)

## Pro Tips

- Daily/Weekly TPs are "OPEN" for trend following
- Confidence >60% = good entry
- RR >1.5 = worth taking
- Combine with other indicators for better results
- Paper trade first!

## Need Help?

- Check `/LIVE_SIGNALS_API_DOCS.md` for full API reference
- Review `signals-dashboard.tsx` for UI examples
- See `use-signals.ts` for integration patterns
- All signals are simulated, not financial advice!

---

**Ready to trade!** Go to `/signals` or import hooks into your components.
