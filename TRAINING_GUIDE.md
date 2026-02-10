# Model Training Guide - SSO-TS Dashboard

## Overview

The SSO-TS Dashboard integrates Kaggle CLI and automated training pipelines for optimizing OMEGA Framework skill weights. This guide walks you through setting up, configuring, and running training jobs.

## Table of Contents

1. [Setup](#setup)
2. [Data Sources](#data-sources)
3. [Training Pipeline](#training-pipeline)
4. [Using the Web Interface](#using-the-web-interface)
5. [Local Training](#local-training)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)

## Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- Kaggle account (free)

### 1. Install Kaggle CLI

```bash
pip install kaggle
```

### 2. Configure Kaggle Credentials

1. Go to [Kaggle Settings](https://www.kaggle.com/account)
2. Click "Create New API Token"
3. Save the downloaded `kaggle.json` file to:
   - **Linux/Mac**: `~/.kaggle/kaggle.json`
   - **Windows**: `C:\Users\<Your Username>\.kaggle\kaggle.json`

4. Set file permissions (Linux/Mac):
```bash
chmod 600 ~/.kaggle/kaggle.json
```

### 3. Install Python Dependencies

```bash
pip install pandas numpy scipy scikit-learn matplotlib seaborn
```

## Data Sources

### Available Kaggle Datasets

The training system supports these Kaggle datasets:

| Dataset | ID | Description |
|---------|----|----|
| **Bitcoin Price Prediction** | `mczaryko/bitcoin-price-prediction` | Historical BTC data with technical indicators |
| **Crypto Markets** | `jessevent/all-crypto-currencies` | Multi-currency market data |
| **Bitcoin Market Data** | `tencars/392-crypto-currency-prices-new-data` | 10+ years BTC OHLCV |
| **Ethereum Price** | `kaushikjadhav01/ethereum-price-prediction-dataset` | Ethereum dataset |
| **Crypto Fear & Greed** | `gpreda/crypto-fear-greed-index` | Market sentiment data |

### Demo Mode

If you don't have Kaggle credentials, the system generates synthetic data automatically. This is perfect for:
- Testing the training pipeline
- Local development
- Learning the system

## Training Pipeline

### Architecture

```
Kaggle Dataset
     ↓
CryptoDataProcessor
     ├── Load CSV data
     ├── Calculate technical indicators
     ├── Normalize features
     └── Generate Q-score labels
     ↓
Split Data (60/20/20)
     ├── Training set
     ├── Validation set
     └── Test set
     ↓
SkillWeightTrainer
     ├── Compute loss
     ├── Calculate gradients
     ├── Update weights (momentum)
     └── Early stopping
     ↓
Trained Weights
     └── Save to JSON
```

### Key Components

**CryptoDataProcessor**: Handles data loading, feature engineering, and normalization

**SkillWeightTrainer**: Implements gradient descent with momentum and adaptive learning rates

**Technical Indicators**:
- SMA (20, 50)
- EMA (12, 26)
- RSI (14)
- MACD
- Bollinger Bands
- Volatility
- Momentum

## Using the Web Interface

### Step 1: Navigate to Training Page

Open the dashboard and click **"Model Training"** in the sidebar.

### Step 2: Configure Training Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| **Dataset** | dropdown | Select Kaggle dataset or demo data |
| **Strategy** | dropdown | Choose trading strategy for training |
| **Epochs** | 10-500 | Number of training iterations |
| **Learning Rate** | 0.0001-0.1 | Gradient descent step size |

### Step 3: Start Training

1. Configure parameters
2. Click "Start Training"
3. Monitor progress in real-time

### Step 4: Review Results

After training completes, you'll see:
- **Loss Curves**: Training vs validation loss over epochs
- **Metrics**: MSE, MAE, RMSE, R² score
- **Learned Weights**: 13 trained parameters (Q-score dimensions + interaction tensor)

### Example Configuration

For a robust baseline:

```
Dataset: Bitcoin Demo
Strategy: Momentum Crossover
Epochs: 100
Learning Rate: 0.01
```

Expected results:
- MSE: ~0.04
- R² Score: >0.92
- Training time: 30-60 seconds (simulated)

## Local Training

### Run Data Fetcher

Fetch and process Kaggle data locally:

```bash
# List available datasets
python scripts/kaggle_data_fetcher.py --list

# Download and process Bitcoin data
python scripts/kaggle_data_fetcher.py \
  --dataset bitcoin-price-prediction \
  --output ./data/bitcoin

# Use demo data (no auth needed)
python scripts/kaggle_data_fetcher.py \
  --output ./data/demo
```

### Run Training Script

Train skill weights using processed data:

```bash
# Basic training
python src/core/skill_weight_optimizer.py

# With custom data
python src/core/skill_weight_optimizer.py \
  --training-data ./data/bitcoin/processed_data.json \
  --epochs 200 \
  --learning-rate 0.01 \
  --output ./trained_weights.json
```

### Training Output

After successful training:

```
================== TRAINING RESULTS ==================
Epoch 100/100
  Train Loss: 0.035421, MAE: 0.142356
  Val Loss:   0.041523, MAE: 0.151234

LEARNED WEIGHTS:
  Grounding (G):     0.188 (18.0% target)
  Certainty (C):     0.204 (20.0% target)
  Structure (S):     0.176 (18.0% target)
  ...

Evaluation Metrics:
  MSE:  0.0415
  MAE:  0.1523
  RMSE: 0.2037
  R²:   0.9234

Weights saved to ./trained_weights.json
```

## Advanced Configuration

### Custom Training Data

Prepare your own CSV with OHLCV (Open, High, Low, Close, Volume) data:

```python
import pandas as pd
from scripts.kaggle_data_fetcher import CryptoDataProcessor

# Load your data
df = pd.read_csv('my_crypto_data.csv')

# Process
df = CryptoDataProcessor.calculate_technical_indicators(df)
df = CryptoDataProcessor.normalize_features(df)

# Train with it
```

### Hyperparameter Tuning

Modify learning rate and momentum:

```python
from src.core.skill_weight_optimizer import SkillWeightTrainer

trainer = SkillWeightTrainer(
    learning_rate=0.001,  # Lower = more stable
    momentum=0.95,         # Higher = faster convergence
    weight_decay=1e-4      # L2 regularization
)
```

### Early Stopping

Training automatically stops if validation loss doesn't improve for 10 epochs.

Configure patience:

```python
trainer.train(
    training_data=train_data,
    validation_data=val_data,
    epochs=500,
    early_stopping_patience=20  # Increase for more training
)
```

## Troubleshooting

### Kaggle Authentication Failed

**Problem**: `kaggle: command not found` or authentication error

**Solution**:
1. Verify `~/.kaggle/kaggle.json` exists
2. Check permissions: `ls -la ~/.kaggle/kaggle.json`
3. Reinstall: `pip install --upgrade kaggle`

### CSV Not Found After Download

**Problem**: Downloaded dataset doesn't have CSV files

**Solution**:
- Some datasets have multiple CSVs
- Script takes first CSV found
- List contents: `ls -la ./kaggle_data/`
- Manually select file: Modify script to specify filename

### Training Stuck or Slow

**Problem**: Training takes too long

**Solution**:
- Reduce epochs (start with 50)
- Increase learning rate (0.01 → 0.05)
- Use smaller dataset
- Check CPU/RAM usage

### Poor Model Performance (R² < 0.85)

**Problem**: Model not learning well

**Solution**:
- Increase epochs
- Adjust learning rate (try 0.001 to 0.05)
- Verify data preprocessing
- Check for outliers in data
- Collect more training examples

### Memory Issues

**Problem**: Out of memory error

**Solution**:
- Reduce batch size (if using batches)
- Limit dataset size
- Use demo data (smaller)
- Run on machine with more RAM

## API Reference

### Training Endpoint

**Start Training Job**

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

**Response**:
```json
{
  "status": "in_progress",
  "jobId": "train-1234567890-abc123",
  "message": "Training job started...",
  "progress": 0
}
```

**Check Status**

```http
GET /api/train?jobId=train-1234567890-abc123
```

**Response**:
```json
{
  "status": "success",
  "jobId": "train-1234567890-abc123",
  "progress": 100,
  "metrics": {
    "mse": 0.0415,
    "mae": 0.1523,
    "rmse": 0.2037,
    "r2": 0.9234
  },
  "weights": {
    "w_G": 0.188,
    "w_C": 0.204,
    ...
  }
}
```

## Best Practices

1. **Start with Demo Data**: Test pipeline with demo data before Kaggle
2. **Monitor Loss Curves**: Watch for signs of overfitting (validation loss increases)
3. **Use Validation Data**: Always hold out validation set for early stopping
4. **Save Trained Weights**: Export weights after each successful training
5. **Version Control**: Track trained weights in git
6. **Document Parameters**: Record which hyperparameters gave best results

## Next Steps

- Review OMEGA Framework at `/docs/OMEGA_DEEP_STUDY_REPORT.md`
- Explore skill orchestration at `/orchestrator`
- Run backtests with trained weights at `/simulator`
- Check business metrics at `/business`

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [Kaggle API docs](https://github.com/Kaggle/kaggle-api)
3. Check Python script logs: `python scripts/kaggle_data_fetcher.py 2>&1 | tee train.log`
4. Open issue on GitHub
