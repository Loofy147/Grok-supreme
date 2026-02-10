# Kaggle Integration Setup Guide

Complete guide to configure Kaggle API credentials for the SSO-TS Dashboard and start downloading cryptocurrency datasets for training.

## Quick Start (5 minutes)

### 1. Get Your Kaggle Credentials

1. Go to [Kaggle Account Settings](https://www.kaggle.com/account)
2. Scroll to "API" section
3. Click "Create New API Token"
4. This downloads `kaggle.json` with your credentials

Your credentials will look like:
```json
{
  "username": "your_username",
  "key": "KGAT_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 2. Configure with Interactive Setup Script

Choose your operating system:

#### macOS / Linux
```bash
python3 scripts/setup_kaggle.py
# or
bash scripts/setup_kaggle.sh
```

#### Windows
```cmd
python scripts/setup_kaggle.py
# or
scripts\setup_kaggle.bat
```

The script will:
- Ask for your username and API token
- Save credentials to `.env.local` and/or `~/.kaggle/kaggle.json`
- Test the Kaggle connection

### 3. Verify Setup

Check that credentials are properly configured:
```bash
# On macOS/Linux
echo $KAGGLE_USERNAME
echo $KAGGLE_API_TOKEN

# Or check .env.local
cat .env.local | grep KAGGLE
```

## Manual Setup

### Option 1: Environment Variables

1. Edit `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Add your credentials:
```env
KAGGLE_USERNAME=your_username
KAGGLE_API_TOKEN=KGAT_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Restart your dev server:
```bash
npm run dev
```

### Option 2: Kaggle Config File

1. Create `~/.kaggle/kaggle.json`:
```bash
mkdir -p ~/.kaggle
cat > ~/.kaggle/kaggle.json << EOF
{
  "username": "your_username",
  "key": "KGAT_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
EOF
chmod 600 ~/.kaggle/kaggle.json
```

2. Restart your dev server

### Option 3: Both (Recommended)

Use both methods for maximum compatibility:
- Environment variables for Node.js app
- `kaggle.json` for Python scripts

## Verify Installation

### Test Python Scripts

```bash
# Install Kaggle library
pip install kaggle

# Test connection
python3 scripts/kaggle_data_fetcher.py --list-datasets
```

### Test Dashboard Integration

1. Start dev server:
```bash
npm run dev
```

2. Visit [http://localhost:3000/training](http://localhost:3000/training)

3. Click "Fetch from Kaggle" button

4. If credentials are configured, you'll see:
   - Available datasets list
   - Option to download Bitcoin price data
   - Real-time download progress

## Available Datasets

The dashboard supports these pre-configured Kaggle datasets:

| Dataset | Description | Size |
|---------|-------------|------|
| `bitcoin-price-prediction` | Historical Bitcoin data with indicators | 5 MB |
| `all-crypto-currencies` | Multi-cryptocurrency market data | 100 MB |
| `392-crypto-currency-prices-new-data` | Multi-year OHLCV data | 50 MB |
| `ethereum-price-prediction-dataset` | Ethereum historical data | 10 MB |
| `cryptocurrency-prices-2021-2022` | Recent crypto price data | 25 MB |

## Using Kaggle Datasets in Training

### From Dashboard UI

1. Visit [http://localhost:3000/training](http://localhost:3000/training)
2. In "Data Source" dropdown, select "Kaggle"
3. Choose a dataset from the list
4. Click "Start Training"

### From Command Line

```bash
# Download and preprocess Bitcoin data
python3 scripts/kaggle_data_fetcher.py \
  --dataset "bitcoin-price-prediction" \
  --output "./data/kaggle"

# Run training with downloaded data
python3 src/core/skill_weight_optimizer.py \
  --data "./data/kaggle/bitcoin_train.csv" \
  --epochs 100 \
  --output "./models/trained_weights.json"
```

## Troubleshooting

### "Kaggle authentication failed"

**Error:**
```
⚠️ Kaggle authentication failed: KGAT_xxxx (HTTP error 401 Unauthorized)
```

**Solutions:**
1. Check if credentials are correct in `.env.local` or `~/.kaggle/kaggle.json`
2. Verify API token hasn't expired (regenerate if needed)
3. Ensure Kaggle CLI is installed: `pip install --upgrade kaggle`
4. Check file permissions: `chmod 600 ~/.kaggle/kaggle.json`

### "Kaggle library not installed"

**Error:**
```
Warning: kaggle library not installed. Install with: pip install kaggle
```

**Solution:**
```bash
pip install kaggle
```

### API Rate Limits

Kaggle API has rate limits (20 calls/minute). If you hit limits:
- Wait 1 minute before making new requests
- Use `--quiet` flag to reduce output
- Batch operations together

### Network/Connection Issues

**Error:**
```
kaggle.api_client.HttpError: b'[Errno -2] Name or service not known'
```

**Solutions:**
1. Check internet connection
2. Verify firewall isn't blocking Kaggle API
3. Try again later (Kaggle servers might be down)
4. Fall back to demo data by selecting "Demo" in Data Source

## Security Best Practices

1. **Never commit credentials to git:**
   ```bash
   # .gitignore already includes:
   .env.local
   .kaggle/
   ```

2. **Keep API tokens secret:**
   - Don't share your `kaggle.json` file
   - Regenerate tokens if you suspect compromise
   - Use environment variables in production

3. **Use limited permissions:**
   - Kaggle API tokens have full account access
   - Consider using Kaggle's newer restricted tokens if available

4. **For Vercel Deployment:**
   - Add environment variables in Vercel dashboard:
     - Settings → Environment Variables
     - Add `KAGGLE_USERNAME` and `KAGGLE_API_TOKEN`
   - Don't commit `.env.local` to git

## Production Deployment

### Deploy to Vercel

1. Add environment variables in Vercel dashboard:
   ```
   KAGGLE_USERNAME = your_username
   KAGGLE_API_TOKEN = KGAT_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   XAI_API_KEY = your_xai_key
   ```

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Configure Kaggle integration"
   git push origin main
   ```

3. Vercel automatically redeploys with new env vars

### Using with Background Jobs

For larger training jobs, use a background task queue:

```bash
# Install Bull (recommended for Node.js)
npm install bull redis

# Or use Celery (for Python)
pip install celery redis
```

Then update `/app/api/train/route.ts` to queue jobs instead of simulating them.

## Advanced Usage

### Fetch Specific Dataset

```bash
python3 scripts/kaggle_data_fetcher.py \
  --dataset "bitcoin-price-prediction" \
  --output "./data" \
  --train-split 0.7 \
  --val-split 0.15
```

### Custom Preprocessing

```python
from scripts.kaggle_data_fetcher import KaggleDataFetcher

fetcher = KaggleDataFetcher()
df = fetcher.download_dataset('bitcoin-price-prediction')
processed_df = fetcher.preprocess(df)

# Your custom processing here
```

### Combine Multiple Datasets

```python
from scripts.kaggle_data_fetcher import KaggleDataFetcher

fetcher = KaggleDataFetcher()
btc_data = fetcher.download_dataset('bitcoin-price-prediction')
eth_data = fetcher.download_dataset('ethereum-price-prediction-dataset')

# Combine and process
```

## Getting Help

- **Kaggle Community:** [kaggle.com/discussion](https://www.kaggle.com/discussion)
- **Kaggle API Docs:** [kaggle-api GitHub](https://github.com/Kaggle/kaggle-api)
- **SSO-TS Issues:** Create an issue in the GitHub repository

## Next Steps

1. ✅ Configure Kaggle credentials (this guide)
2. Visit [Training Dashboard](http://localhost:3000/training)
3. Select Kaggle as data source
4. Download a cryptocurrency dataset
5. Run training and improve your skill weights!
6. Check [TRAINING_GUIDE.md](./TRAINING_GUIDE.md) for detailed training docs

---

**Last Updated:** February 2026
**Version:** 1.0
