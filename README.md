# SSO-TS Dashboard - Cryptocurrency Trading Strategy Simulator

A sophisticated web application for simulating and analyzing cryptocurrency trading strategies using AI-powered insights from xAI's Grok model and the OMEGA Framework.

## ⚠️ Important Disclaimer

**This is a SIMULATION-ONLY platform.** It does not execute real trades or handle actual cryptocurrency funds. All results are simulated and for educational and research purposes only. This is not financial advice. Always conduct your own research and consult with a financial advisor before making investment decisions.

## 🎯 Features

### 1. Dashboard Overview
- **Real-time BTC Price**: Live Bitcoin price tracking with 24-hour changes and market metrics
- **Q-Score Metrics**: AI capability quality measurements based on trained OMEGA Framework weights
- **Portfolio Summary**: 6-month performance charts showing ROI, Sharpe Ratio, and drawdown analysis

### 2. Strategy Simulator
- **Backtest Engine**: Run historical simulations on multiple trading strategies
- **Configurable Parameters**: Adjust fees, slippage, time windows, and initial capital
- **AI-Powered Analysis**: Uses Grok to generate realistic backtest results
- **Performance Metrics**: ROI, Sharpe Ratio (target > 1.2), Maximum Drawdown (target < 10%), Win Rate

### 3. Skill Orchestrator
- **Dynamic Skill Selection**: Choose from multiple AI skills to combine
- **Emergent Capabilities**: Automatically discovers emergent abilities from skill combinations
- **Q-Score Integration**: Real-time capability scoring

### 4. Model Training (NEW!)
- **Kaggle Integration**: Fetch datasets from Kaggle directly
- **Automated Preprocessing**: Technical indicator calculation and feature normalization
- **Skill Weight Optimization**: Train OMEGA Framework weights using gradient descent
- **Real-time Progress**: Monitor training with loss curves and metrics
- **Multiple Strategies**: Support for momentum, RSI, MACD, Bollinger Bands

### 5. Business Management
- **Activity Logs**: Track all system actions and API calls
- **Q-Delta Achievements**: Monitor improvements in AI capability metrics
- **User Management**: Manage roles and permissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+ (for training)
- xAI API Key
- Kaggle account (optional, for training)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your XAI_API_KEY

# Set up Python training environment
pip install -r requirements.txt

# Run setup script (optional)
# Linux/Mac: bash scripts/setup_training.sh
# Windows: scripts/setup_training.bat

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **AI**: xAI Grok 4, AI SDK 6
- **Data**: CoinGecko API for real-time BTC prices

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── backtest/route.ts
│   │   ├── btc-price/route.ts
│   │   └── grok/route.ts
│   ├── page.tsx               # Dashboard
│   ├── simulator/page.tsx     # Strategy Simulator
│   ├── orchestrator/page.tsx  # Skill Orchestrator
│   ├── business/page.tsx      # Business Management
│   ├── about/page.tsx         # About
│   └── layout.tsx
├── components/
│   ├── navigation.tsx
│   ├── btc-price-card.tsx
│   ├── q-score-card.tsx
│   ├── portfolio-summary.tsx
│   └── ui/
├── data/
│   ├── skill_inventory.json
│   └── trained_skill_weights.json
└── docs/
    ├── OMEGA_DEEP_STUDY_REPORT.md
    └── ...
```

## 🔧 Environment Variables

Create `.env.local` with:
```
XAI_API_KEY=your_xai_api_key_here
```

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Sharpe Ratio | > 1.2 | 1.48 |
| Max Drawdown | < 10% | -5.1% |
| Win Rate | > 50% | 62.3% |
| ROI (6m) | 50%+ | 54.0% |

## 🤖 OMEGA Framework

This dashboard integrates with the OMEGA Framework's 4-layer AI architecture for sophisticated strategy analysis and skill orchestration.

## 🚀 Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# Add XAI_API_KEY environment variable
```

## Repository Structure (Backend)

- `/docs`: Documentation, reports, and skill definitions.
- `/src`: Core logic, skills engine, and enhancements.
- `/data`: Datasets, model weights, and simulations.
- `/deploy`: Deployment configurations.

## 📚 Documentation

See `/docs/OMEGA_DEEP_STUDY_REPORT.md` for detailed information about the OMEGA Framework and AI architecture.
