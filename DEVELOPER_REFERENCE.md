# SSO-TS Dashboard - Developer Reference

Quick reference for developers working on the SSO-TS Dashboard codebase.

## Project Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add your XAI_API_KEY to .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## File Structure

```
├── app/
│   ├── api/
│   │   ├── backtest/route.ts      # Backtest simulation API
│   │   ├── btc-price/route.ts     # BTC price API (CoinGecko)
│   │   └── grok/route.ts          # Grok AI API
│   ├── simulator/page.tsx         # Strategy Simulator page
│   ├── orchestrator/page.tsx      # Skill Orchestrator page
│   ├── business/page.tsx          # Business Management page
│   ├── about/page.tsx             # About page
│   ├── app-layout.tsx             # Main app layout wrapper
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   └── page.tsx                   # Dashboard home
├── components/
│   ├── navigation.tsx             # Sidebar navigation
│   ├── btc-price-card.tsx         # BTC price widget
│   ├── q-score-card.tsx           # Q-score metrics
│   ├── portfolio-summary.tsx      # Portfolio charts
│   ├── backtest-results.tsx       # Backtest results
│   └── ui/
│       └── card.tsx               # Card component
├── hooks/
│   └── use-api.ts                 # API fetching hooks
├── lib/
│   └── api-client.ts              # API client utilities
├── data/
│   ├── skill_inventory.json       # Available skills
│   └── trained_skill_weights.json # Q-score weights
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

## Key Components

### Navigation Component
- **File**: `components/navigation.tsx`
- **Purpose**: Main sidebar navigation
- **Props**: None (uses `usePathname()` hook)

```tsx
import { Navigation } from '@/components/navigation'
<Navigation />
```

### BTC Price Card
- **File**: `components/btc-price-card.tsx`
- **Purpose**: Live BTC price display
- **Fetches from**: `/api/btc-price`
- **Refresh**: Every 30 seconds

```tsx
import { BtcPriceCard } from '@/components/btc-price-card'
<BtcPriceCard />
```

### Q-Score Card
- **File**: `components/q-score-card.tsx`
- **Purpose**: AI capability metrics
- **Data**: `trained_skill_weights.json`

```tsx
import { QScoreCard } from '@/components/q-score-card'
<QScoreCard />
```

### Portfolio Summary
- **File**: `components/portfolio-summary.tsx`
- **Purpose**: Performance charts
- **Library**: Recharts
- **Charts**: LineChart, BarChart

```tsx
import { PortfolioSummary } from '@/components/portfolio-summary'
<PortfolioSummary />
```

## API Routes

### GET `/api/btc-price`
Fetches Bitcoin price from CoinGecko API.

**Response**:
```json
{
  "price": 42580.50,
  "change24h": 2.34,
  "marketCap": 835000000000,
  "volume": 28000000000,
  "timestamp": "2026-02-10T12:00:00Z"
}
```

**Error Handling**:
```typescript
try {
  const res = await fetch('/api/btc-price')
  const data = await res.json()
} catch (err) {
  console.error('Price fetch failed:', err)
}
```

### POST `/api/backtest`
Runs a trading strategy backtest.

**Request**:
```json
{
  "strategy": "Momentum Crossover",
  "timeWindow": "6-month",
  "fees": 0.1,
  "slippage": 0.05,
  "initialCapital": 10000
}
```

**Response** (streamed):
```
JSON formatted backtest results with:
- roi, sharpeRatio, maxDrawdown
- winRate, tradeCount
- bestTrade, worstTrade
```

### POST `/api/grok`
Direct Grok AI interface.

**Request**:
```json
{
  "prompt": "Your analysis prompt",
  "systemPrompt": "System context (optional)"
}
```

**Response**: Streamed text from Grok

## Hooks

### useAPI Hook
Fetch data from API endpoints with loading/error states.

```typescript
import { useAPI } from '@/hooks/use-api'

function MyComponent() {
  const { data, loading, error } = useAPI<PriceData>('/api/btc-price')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{data?.price}</div>
}
```

### useMutation Hook
Make POST requests with loading/error states.

```typescript
import { useMutation } from '@/hooks/use-api'

function BacktestForm() {
  const { mutate, loading, error, data } = useMutation('/api/backtest')
  
  const handleSubmit = async (formData) => {
    const result = await mutate(formData)
  }
}
```

## Utilities

### API Client
Located in `lib/api-client.ts`

```typescript
import { apiRequest, streamAPI } from '@/lib/api-client'

// Regular request
const data = await apiRequest('/api/btc-price')

// Streaming request
await streamAPI('/api/backtest', payload, (chunk) => {
  console.log('Chunk:', chunk)
})

// Format utilities
import { formatNumber, formatPercent } from '@/lib/api-client'

formatNumber(42580.50)        // "42,580.5"
formatPercent(2.34)           // "+2.34%"
formatNumber(1200000, 0, true) // "$1,200,000.00"
```

## Design System

### Colors
- **Primary**: `#00d9ff` (Cyan)
- **Secondary**: `#ff6b6b` (Red)
- **Accent**: `#4c6ef5` (Blue)
- **Background**: `#0a0e27` (Dark Navy)
- **Card**: `#131829` (Darker Navy)

### Tailwind Classes
- `.metric-card`: Standard metric container
- `.chart-container`: Chart wrapper with glass effect
- `.gradient-text`: Gradient text effect
- `.glass`: Glass-morphism effect
- `.nav-link`: Navigation link styling

### Components Used
- **shadcn/ui**: Card components
- **Recharts**: Charts
- **lucide-react**: Icons

## Common Tasks

### Add a New Page

1. Create file: `app/newpage/page.tsx`
2. Use AppLayout wrapper:

```tsx
'use client'

import { AppLayout } from '@/app/app-layout'

export default function NewPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Your content */}
      </div>
    </AppLayout>
  )
}
```

3. Add navigation link in `components/navigation.tsx`

### Add a New API Route

1. Create file: `app/api/newroute/route.ts`
2. Implement POST/GET handlers:

```typescript
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Process request
    return Response.json({ result: 'success' })
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### Call Grok AI

```typescript
import { streamText } from 'ai'
import { xai } from '@ai-sdk/xai'

const result = streamText({
  model: xai('grok-4', {
    apiKey: process.env.XAI_API_KEY,
  }),
  prompt: 'Your prompt here',
  temperature: 0.7,
})

return result.toTextStreamResponse()
```

### Use Recharts

```typescript
import { LineChart, Line, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { month: 'Jan', roi: 5.2 },
  { month: 'Feb', roi: 8.1 },
]

<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <Line type="monotone" dataKey="roi" stroke="#00d9ff" />
  <Tooltip />
</LineChart>
```

## Debugging

### Console Logging
```typescript
console.log('[v0] Debug message:', variable)
console.error('[v0] Error:', error)
```

### Check API Responses
```typescript
// In browser DevTools Network tab
// Monitor API calls to /api/* endpoints
```

### Test Locally
```bash
# Start dev server with verbose logging
npm run dev

# Test API endpoint
curl http://localhost:3000/api/btc-price
```

### Vercel Logs
```bash
# View production logs
vercel logs

# View specific deployment logs
vercel logs [deployment-url]
```

## Performance Tips

### Image Optimization
- Use Next.js Image component where possible
- Lazy load below-fold content

### Bundle Size
- Check: `npm run build`
- Analyze: `npx next-bundle-analyzer`

### API Optimization
- Cache CoinGecko responses (30-60 seconds)
- Batch API requests when possible
- Use streaming for long operations

## Testing

### Manual Testing Checklist

- [ ] Dashboard loads and BTC price updates
- [ ] Strategy Simulator runs backtests
- [ ] Skill Orchestrator shows results
- [ ] Business Management logs display
- [ ] Navigation works on all pages
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Error handling works

### API Testing
```bash
# Test BTC price endpoint
curl http://localhost:3000/api/btc-price

# Test backtest endpoint
curl -X POST http://localhost:3000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"strategy":"Momentum","timeWindow":"6-month","fees":0.1,"slippage":0.05,"initialCapital":10000}'
```

## Environment Variables

```
# Required
XAI_API_KEY=your_xai_api_key

# Optional
NODE_ENV=development|production
```

## Dependencies

Key packages:
- `next`: React framework
- `react`: UI library
- `ai`: AI SDK for Grok
- `@ai-sdk/xai`: xAI provider
- `recharts`: Charting
- `lucide-react`: Icons
- `tailwindcss`: Styling

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [AI SDK](https://sdk.vercel.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

---

**Last Updated**: February 2026
