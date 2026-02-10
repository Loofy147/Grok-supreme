# Training System - Quick Reference Card

## 1-Minute Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run setup script
bash scripts/setup_training.sh  # Mac/Linux
# OR
scripts/setup_training.bat      # Windows
```

## Accessing Training Interface

```
http://localhost:3000/training
```

## Command Reference

### List Available Datasets

```bash
python scripts/kaggle_data_fetcher.py --list
```

### Download Kaggle Data

```bash
python scripts/kaggle_data_fetcher.py \
  --dataset bitcoin-price-prediction \
  --output ./data/bitcoin
```

### Generate Demo Data (No Auth)

```bash
python scripts/kaggle_data_fetcher.py \
  --output ./data/demo
```

### Train Skill Weights

```bash
python src/core/skill_weight_optimizer.py
```

## Web Interface Quick Start

1. **Navigate**: Go to `/training` page
2. **Configure**: 
   - Select dataset (Bitcoin Demo, Ethereum, etc)
   - Choose strategy (Momentum, RSI, MACD, etc)
   - Set epochs (recommend 50-100)
   - Set learning rate (recommend 0.01)
3. **Start**: Click "Start Training"
4. **Monitor**: Watch progress bar and loss curves
5. **Review**: Check metrics and learned weights when done

## Configuration Parameters

| Parameter | Range | Recommendation |
|-----------|-------|-----------------|
| **Epochs** | 10-500 | 50-100 |
| **Learning Rate** | 0.0001-0.1 | 0.01 |
| **Dataset** | dropdown | Bitcoin Demo |
| **Strategy** | dropdown | Momentum Cross |

## Expected Results

```
Training completes in: 30-60 seconds (simulated)
MSE:  ~0.04
MAE:  ~0.15
RMSE: ~0.20
R²:   >0.92
```

## API Endpoints

### Start Training

```http
POST /api/train
Content-Type: application/json

{
  "dataset": "bitcoin-demo",
  "strategy": "momentum-cross",
  "epochs": 50,
  "learningRate": 0.01
}
```

### Check Status

```http
GET /api/train?jobId=<JOB_ID>
```

## Kaggle Setup

### Get API Token

1. Visit: https://www.kaggle.com/account
2. Click: "Create New API Token"
3. Save: `kaggle.json`

### Configure Location

**Linux/Mac**:
```bash
mkdir -p ~/.kaggle
mv kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

**Windows**:
```
C:\Users\<Your Username>\.kaggle\kaggle.json
```

## Available Datasets

| Dataset | ID |
|---------|----| 
| Bitcoin Price | `mczaryko/bitcoin-price-prediction` |
| Crypto Markets | `jessevent/all-crypto-currencies` |
| Bitcoin 10yr | `tencars/392-crypto-currency-prices-new-data` |
| Ethereum Price | `kaushikjadhav01/ethereum-price-prediction-dataset` |
| Fear & Greed | `gpreda/crypto-fear-greed-index` |

## Common Issues

**Kaggle auth failed?**
- Check `~/.kaggle/kaggle.json` exists
- Use demo mode: `--output ./data`

**Training is slow?**
- Reduce epochs (25 instead of 100)
- Increase learning rate (0.05)

**Poor R² score?**
- Increase epochs (100+)
- Try lower learning rate (0.001)

**Memory error?**
- Use demo data (smaller)
- Reduce dataset size manually

## Feature Summary

| Feature | Status | Location |
|---------|--------|----------|
| Kaggle API | ✅ Full | `scripts/kaggle_data_fetcher.py` |
| Data Processing | ✅ 8+ indicators | `CryptoDataProcessor` class |
| Web Training UI | ✅ Real-time | `/training` page |
| API Training | ✅ Job tracking | `/api/train` |
| Setup Automation | ✅ One-command | `setup_training.sh` |
| Demo Mode | ✅ No auth needed | Automatic fallback |
| Progress Monitoring | ✅ Live charts | Loss curves + metrics |
| Weight Visualization | ✅ Bar charts | Learned weights display |

## Technical Indicators

Training uses 8+ indicators:

```
Input Features:
  • SMA (20, 50)
  • EMA (12, 26)
  • RSI (14)
  • MACD
  • Bollinger Bands
  • Volatility
  • Momentum
  • Normalized Close Price

Output:
  → Q-Score (0-1) representing AI capability
```

## File Structure

```
scripts/
  ├── kaggle_data_fetcher.py    # Data fetching & processing
  ├── setup_training.sh         # Linux/Mac setup
  └── setup_training.bat        # Windows setup

app/
  ├── api/train/route.ts        # Training API
  └── training/page.tsx         # Web interface

src/core/
  └── skill_weight_optimizer.py # Training algorithm

data/
  ├── skill_inventory.json      # Available skills
  └── trained_skill_weights.json # Trained model weights

docs/
  └── OMEGA_DEEP_STUDY_REPORT.md # Framework details
```

## Useful Links

- **Full Training Guide**: `TRAINING_GUIDE.md`
- **Integration Details**: `KAGGLE_TRAINING_INTEGRATION.md`
- **Framework Docs**: `docs/OMEGA_DEEP_STUDY_REPORT.md`
- **Dashboard Docs**: `README.md`
- **API Reference**: See `TRAINING_GUIDE.md` → API Reference

## Performance Metrics

Learned weights optimize these 8 dimensions:

- **G** (Grounding): Knowledge grounding (18% weight)
- **C** (Certainty): Confidence level (20% weight)
- **S** (Structure): Logical structure (18% weight)
- **A** (Applicability): Practical use (16% weight)
- **H** (Coherence): Internal consistency (12% weight)
- **V** (Generativity): Generative power (8% weight)
- **P** (Presentation): Communication (5% weight)
- **T** (Temporal): Time awareness (3% weight)

## Training Workflow

```
1. Configure parameters
   ↓
2. Fetch or generate data
   ↓
3. Calculate technical indicators
   ↓
4. Normalize features
   ↓
5. Split into train/val/test
   ↓
6. Train with gradient descent
   ↓
7. Monitor loss curves
   ↓
8. Evaluate metrics
   ↓
9. Save trained weights
```

## Next Steps

1. Complete setup: `bash scripts/setup_training.sh`
2. Test with demo: Visit `/training`
3. Read full guide: `TRAINING_GUIDE.md`
4. Configure Kaggle: Get API token
5. Download real data: `kaggle_data_fetcher.py`
6. Run training: Web UI or CLI

---

**For questions or issues, see [TRAINING_GUIDE.md](TRAINING_GUIDE.md) → Troubleshooting**
