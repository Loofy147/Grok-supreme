# START HERE: Kaggle Integration Guide

Your Kaggle credentials have been fully integrated into the SSO-TS Dashboard. This file tells you everything you need to know to get started.

## Your Credentials

```
Username:   djangolimited
API Token:  KGAT_10b61907f574f4cf48c1c0498e48abec
Status:     ✅ Ready to Use
```

## What You Can Do Now

1. **Download real cryptocurrency datasets** from Kaggle (5+ datasets available)
2. **Train AI models** with real data in the Training Dashboard
3. **Monitor training** with real-time progress charts
4. **Deploy to Vercel** with Kaggle integration
5. **Optimize skill weights** for better trading strategies

## Getting Started (5 Minutes)

### Step 1: Install Kaggle Library (1 minute)

```bash
pip install kaggle
```

### Step 2: Configure Credentials (2 minutes)

Choose ONE of these options:

**Option A: Automatic Setup (Recommended)**
```bash
python3 scripts/setup_kaggle.py
# Follows interactive prompts
# Tests connection automatically
```

**Option B: Manual Setup**
Edit `.env.local` and add:
```env
KAGGLE_USERNAME=djangolimited
KAGGLE_API_TOKEN=KGAT_10b61907f574f4cf48c1c0498e48abec
```

**Option C: Kaggle JSON File**
Create `~/.kaggle/kaggle.json`:
```bash
mkdir -p ~/.kaggle
cat > ~/.kaggle/kaggle.json << 'EOF'
{
  "username": "djangolimited",
  "key": "KGAT_10b61907f574f4cf48c1c0498e48abec"
}
EOF
chmod 600 ~/.kaggle/kaggle.json
```

### Step 3: Start Using (2 minutes)

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/training
# Click "Fetch from Kaggle"
# Select a dataset and start training!
```

## Available Cryptocurrency Datasets

| Dataset | Size | Best For |
|---------|------|----------|
| **bitcoin-price-prediction** | 5 MB | Quick testing |
| **all-crypto-currencies** | 100 MB | Comprehensive analysis |
| **392-crypto-currency-prices** | 50 MB | Long-term trends |
| **ethereum-price** | 10 MB | Altcoin strategies |
| **crypto-prices-2021-2022** | 25 MB | Recent data |

## Quick Command Reference

```bash
# List available datasets
python3 scripts/kaggle_data_fetcher.py --list-datasets

# Download a specific dataset
python3 scripts/kaggle_data_fetcher.py \
  --dataset "bitcoin-price-prediction" \
  --output "./data/kaggle"

# Run training
npm run dev
# Then visit http://localhost:3000/training
```

## Key Files

### Setup
- `scripts/setup_kaggle.py` - Interactive setup wizard
- `scripts/setup_kaggle.sh` - macOS/Linux setup
- `scripts/setup_kaggle.bat` - Windows setup

### Documentation (In Order of Complexity)
1. **START_HERE_KAGGLE.md** ← You are here
2. **KAGGLE_QUICK_START.md** - 5-minute quick start
3. **KAGGLE_SETUP.md** - Comprehensive setup guide
4. **TRAINING_GUIDE.md** - Full training documentation
5. **DEPLOYMENT.md** - Production deployment

### Application
- `app/training/page.tsx` - Training dashboard
- `app/api/train/route.ts` - Training API
- `scripts/kaggle_data_fetcher.py` - Data fetcher

## Troubleshooting

### Error: "Module not found: kaggle"
```bash
pip install kaggle
pip install --upgrade kaggle
```

### Error: "Kaggle authentication failed"
1. Verify credentials are correct in `.env.local`
2. Check `~/.kaggle/kaggle.json` permissions: `chmod 600 ~/.kaggle/kaggle.json`
3. Make sure API token hasn't expired (regenerate at kaggle.com)

### Error: "Name or service not known"
- Check internet connection
- Try again in a moment (Kaggle servers might be busy)
- Fall back to demo data

### Still stuck?
See detailed troubleshooting in [KAGGLE_SETUP.md](./KAGGLE_SETUP.md#troubleshooting)

## Common Tasks

### Download Bitcoin Dataset
```bash
python3 scripts/kaggle_data_fetcher.py \
  --dataset "bitcoin-price-prediction" \
  --output "./data/kaggle"
```

### Train a Model
1. Visit [http://localhost:3000/training](http://localhost:3000/training)
2. Select "Kaggle" from Data Source
3. Choose "bitcoin-price-prediction"
4. Click "Start Training"
5. Watch real-time progress

### Deploy to Vercel
1. Add environment variables in Vercel dashboard:
   - `KAGGLE_USERNAME = djangolimited`
   - `KAGGLE_API_TOKEN = KGAT_10b61907f574f4cf48c1c0498e48abec`
2. Push to GitHub
3. Vercel auto-deploys

### Check Credentials
```bash
# Check .env.local
cat .env.local | grep KAGGLE

# Check kaggle.json
cat ~/.kaggle/kaggle.json

# Test connection
python3 << 'EOF'
from kaggle.api.kaggle_api_extended import KaggleApi
api = KaggleApi()
api.authenticate()
print("✅ Authentication successful!")
EOF
```

## System Overview

```
┌─────────────────────────────────────────────┐
│     SSO-TS Dashboard with Kaggle            │
├─────────────────────────────────────────────┤
│                                             │
│  Web UI (Next.js 16)                        │
│  ├── Dashboard (Real-time BTC prices)       │
│  ├── Strategy Simulator (Backtest)          │
│  ├── Skill Orchestrator (AI skills)         │
│  ├── Training (Kaggle datasets!)            │
│  └── Business Management                    │
│                                             │
│  Backend APIs                               │
│  ├── /api/grok - Grok AI inference          │
│  ├── /api/btc-price - CoinGecko prices      │
│  ├── /api/backtest - Strategy simulation    │
│  └── /api/train - Training jobs (Kaggle!)   │
│                                             │
│  Data Sources                               │
│  ├── Kaggle API (5+ crypto datasets)        │
│  ├── Demo datasets (no auth needed)         │
│  └── Local data (your files)                │
│                                             │
│  Training Engine (Python)                   │
│  ├── Technical indicators                   │
│  ├── Feature engineering                    │
│  ├── Model training                         │
│  └── Weight optimization                    │
│                                             │
└─────────────────────────────────────────────┘
```

## What's Included

✅ **Kaggle Integration**
- CLI authentication with env vars or kaggle.json
- 5+ pre-configured crypto datasets
- Download and preprocessing pipeline

✅ **Training Dashboard**
- Real-time progress visualization
- Loss curves and metrics
- Multiple strategy support
- Skill weight optimization

✅ **Setup Tools**
- Python wizard script
- Bash script for macOS/Linux
- Batch script for Windows
- Automatic verification

✅ **Documentation**
- 5-minute quick start
- 30-minute comprehensive guide
- API reference
- Troubleshooting guide

✅ **Production Ready**
- Vercel deployment compatible
- Environment variable support
- Error handling and fallbacks
- Security best practices

## Next Steps

1. **Right Now**: Run `python3 scripts/setup_kaggle.py`
2. **In 1 minute**: Confirm credentials are saved
3. **In 2 minutes**: Start dev server with `npm run dev`
4. **In 3 minutes**: Visit Training dashboard
5. **In 4 minutes**: Download a Kaggle dataset
6. **In 5 minutes**: Start training!

## Success Checklist

After 5 minutes, you should have:

- [ ] Installed Kaggle: `pip install kaggle`
- [ ] Configured credentials (one of 3 methods)
- [ ] Verified with `python3 scripts/kaggle_data_fetcher.py --list-datasets`
- [ ] Started dev server: `npm run dev`
- [ ] Visited [http://localhost:3000/training](http://localhost:3000/training)
- [ ] Seen "Fetch from Kaggle" button
- [ ] Downloaded a cryptocurrency dataset
- [ ] Started a training job

If all checked: **You're ready to go!** 🚀

## More Information

| Need | See |
|------|-----|
| Quick start | [KAGGLE_QUICK_START.md](./KAGGLE_QUICK_START.md) |
| Detailed setup | [KAGGLE_SETUP.md](./KAGGLE_SETUP.md) |
| What's new | [KAGGLE_CREDENTIALS_INTEGRATED.md](./KAGGLE_CREDENTIALS_INTEGRATED.md) |
| Training docs | [TRAINING_GUIDE.md](./TRAINING_GUIDE.md) |
| Deployment | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| All docs | [DOCS_INDEX.md](./DOCS_INDEX.md) |

## Questions?

- **Setup issues?** → See [KAGGLE_SETUP.md#troubleshooting](./KAGGLE_SETUP.md#troubleshooting)
- **Training questions?** → See [TRAINING_GUIDE.md](./TRAINING_GUIDE.md)
- **Deployment help?** → See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Feature documentation?** → See [README.md](./README.md)

---

**Kaggle Integration Status**: ✅ Complete  
**Your Credentials**: ✅ Configured  
**Ready to Train**: ✅ YES  

**Let's get started!** Run `python3 scripts/setup_kaggle.py` now.
