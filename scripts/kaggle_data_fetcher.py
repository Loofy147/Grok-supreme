#!/usr/bin/env python3
"""
Kaggle Data Fetcher and Preprocessor
====================================

Fetches cryptocurrency datasets from Kaggle and prepares them for training
in the OMEGA Framework skill weight optimizer.

Features:
- Authenticates with Kaggle API
- Downloads crypto price/volume datasets
- Preprocesses time-series data
- Splits into train/validation/test sets
- Generates synthetic Q-score targets based on technical indicators

Usage:
    python kaggle_data_fetcher.py --dataset "bitcoin-price-prediction" --output "./data"
"""

import os
import json
import argparse
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
from pathlib import Path

try:
    from kaggle.api.kaggle_api_extended import KaggleApi
    KAGGLE_AVAILABLE = True
except ImportError:
    KAGGLE_AVAILABLE = False
    print("Warning: kaggle library not installed. Install with: pip install kaggle")


class KaggleDataFetcher:
    """Handles Kaggle dataset authentication and downloading"""
    
    def __init__(self):
        self.api = None
        self.authenticated = False
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Kaggle API"""
        if not KAGGLE_AVAILABLE:
            print("⚠️  Kaggle library not available. Using demo mode.")
            return
        
        try:
            self.api = KaggleApi()
            self.api.authenticate()
            self.authenticated = True
            print("✅ Kaggle authentication successful")
        except Exception as e:
            print(f"⚠️  Kaggle authentication failed: {e}")
            print("   Set up credentials at ~/.kaggle/kaggle.json")
    
    def list_crypto_datasets(self) -> List[Dict[str, str]]:
        """List popular crypto datasets on Kaggle"""
        datasets = [
            {
                "name": "bitcoin-price-prediction",
                "id": "mczaryko/bitcoin-price-prediction",
                "description": "Historical Bitcoin price data with technical indicators"
            },
            {
                "name": "crypto-markets",
                "id": "jessevent/all-crypto-currencies",
                "description": "Comprehensive cryptocurrency market data"
            },
            {
                "name": "bitcoin-market-data",
                "id": "tencars/392-crypto-currency-prices-new-data",
                "description": "Multi-year Bitcoin OHLCV data"
            },
            {
                "name": "ethereum-price",
                "id": "kaushikjadhav01/ethereum-price-prediction-dataset",
                "description": "Ethereum price and feature dataset"
            },
            {
                "name": "crypto-fear-greed",
                "id": "gpreda/crypto-fear-greed-index",
                "description": "Crypto Fear & Greed Index data"
            }
        ]
        return datasets
    
    def download_dataset(
        self,
        dataset_id: str,
        output_path: str = "./kaggle_data"
    ) -> Optional[str]:
        """Download dataset from Kaggle"""
        if not self.authenticated:
            print("⚠️  Not authenticated. Using demo data generator.")
            return self._generate_demo_data(output_path)
        
        try:
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            print(f"📥 Downloading {dataset_id}...")
            self.api.dataset_download_files(dataset_id, path=output_dir, unzip=True)
            print(f"✅ Downloaded to {output_path}")
            
            return str(output_dir)
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return None
    
    @staticmethod
    def _generate_demo_data(output_path: str = "./kaggle_data") -> str:
        """Generate synthetic cryptocurrency data for demo"""
        output_dir = Path(output_path)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        print("🎲 Generating demo crypto data...")
        
        # Generate 6 months of daily BTC data
        dates = pd.date_range(
            start=datetime.now() - timedelta(days=180),
            periods=180,
            freq='D'
        )
        
        prices = []
        current_price = 65000.0
        
        for date in dates:
            change = np.random.normal(0.002, 0.025)  # Random walk
            current_price *= (1 + change)
            current_price = max(current_price, 30000)  # Floor
            
            volume = np.random.uniform(20000000000, 35000000000)
            
            prices.append({
                'Date': date,
                'Open': current_price * np.random.uniform(0.99, 1.01),
                'High': current_price * np.random.uniform(1.00, 1.03),
                'Low': current_price * np.random.uniform(0.97, 1.00),
                'Close': current_price,
                'Volume': volume
            })
        
        df = pd.DataFrame(prices)
        csv_path = output_dir / "bitcoin_demo.csv"
        df.to_csv(csv_path, index=False)
        
        print(f"✅ Demo data saved to {csv_path}")
        return str(output_dir)


class CryptoDataProcessor:
    """Processes crypto data for training"""
    
    @staticmethod
    def load_data(filepath: str) -> pd.DataFrame:
        """Load cryptocurrency data from CSV"""
        df = pd.read_csv(filepath)
        
        # Standardize column names
        df.columns = df.columns.str.strip().str.lower()
        
        # Ensure date column
        date_cols = [col for col in df.columns if 'date' in col]
        if date_cols:
            df[date_cols[0]] = pd.to_datetime(df[date_cols[0]])
            df = df.sort_values(date_cols[0])
        
        print(f"✅ Loaded {len(df)} records from {filepath}")
        return df
    
    @staticmethod
    def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """Calculate technical indicators for feature engineering"""
        df = df.copy()
        
        close_col = next((col for col in df.columns if 'close' in col), None)
        if not close_col:
            return df
        
        # Moving averages
        df['SMA_20'] = df[close_col].rolling(window=20).mean()
        df['SMA_50'] = df[close_col].rolling(window=50).mean()
        df['EMA_12'] = df[close_col].ewm(span=12).mean()
        df['EMA_26'] = df[close_col].ewm(span=26).mean()
        
        # RSI
        delta = df[close_col].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Diff'] = df['MACD'] - df['MACD_Signal']
        
        # Bollinger Bands
        sma = df[close_col].rolling(window=20).mean()
        std = df[close_col].rolling(window=20).std()
        df['BB_Upper'] = sma + (std * 2)
        df['BB_Lower'] = sma - (std * 2)
        df['BB_Position'] = (df[close_col] - df['BB_Lower']) / (df['BB_Upper'] - df['BB_Lower'])
        
        # Volatility
        df['Volatility'] = df[close_col].pct_change().rolling(window=20).std()
        
        # Price momentum
        df['Momentum'] = df[close_col].pct_change(periods=5)
        
        # Drop NaN values
        df = df.dropna()
        
        print(f"✅ Calculated {len(df.columns)} features")
        return df
    
    @staticmethod
    def normalize_features(df: pd.DataFrame) -> pd.DataFrame:
        """Normalize features to [0, 1] range"""
        df = df.copy()
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            min_val = df[col].min()
            max_val = df[col].max()
            
            if max_val > min_val:
                df[col] = (df[col] - min_val) / (max_val - min_val)
            else:
                df[col] = 0.5
        
        return df
    
    @staticmethod
    def generate_q_score_labels(df: pd.DataFrame) -> np.ndarray:
        """Generate synthetic Q-score labels based on strategy performance"""
        close_col = next((col for col in df.columns if 'close' in col), None)
        if not close_col:
            return np.ones(len(df)) * 0.75
        
        q_scores = []
        
        for i in range(len(df)):
            score = 0.5
            
            # Factor in technical indicators
            if pd.notna(df.loc[i, 'RSI']):
                rsi = df.loc[i, 'RSI']
                if 40 < rsi < 60:  # Neutral zone
                    score += 0.1
                else:
                    score += 0.05
            
            if pd.notna(df.loc[i, 'MACD_Diff']):
                if df.loc[i, 'MACD_Diff'] > 0:  # Bullish
                    score += 0.15
                else:
                    score += 0.05
            
            if pd.notna(df.loc[i, 'BB_Position']):
                bb = df.loc[i, 'BB_Position']
                if 0.3 < bb < 0.7:  # In range
                    score += 0.05
            
            if pd.notna(df.loc[i, 'Momentum']):
                momentum = df.loc[i, 'Momentum']
                if momentum > 0:  # Positive momentum
                    score += 0.10
            
            # Add some randomness
            score += np.random.normal(0, 0.02)
            score = np.clip(score, 0.0, 1.0)
            
            q_scores.append(score)
        
        return np.array(q_scores)
    
    @staticmethod
    def split_data(
        df: pd.DataFrame,
        q_scores: np.ndarray,
        train_ratio: float = 0.6,
        val_ratio: float = 0.2
    ) -> Tuple[pd.DataFrame, np.ndarray, pd.DataFrame, np.ndarray, pd.DataFrame, np.ndarray]:
        """Split data into train/validation/test sets"""
        n = len(df)
        train_idx = int(n * train_ratio)
        val_idx = train_idx + int(n * val_ratio)
        
        train_df = df.iloc[:train_idx]
        train_q = q_scores[:train_idx]
        
        val_df = df.iloc[train_idx:val_idx]
        val_q = q_scores[train_idx:val_idx]
        
        test_df = df.iloc[val_idx:]
        test_q = q_scores[val_idx:]
        
        print(f"✅ Split: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")
        
        return train_df, train_q, val_df, val_q, test_df, test_q


def main():
    parser = argparse.ArgumentParser(
        description="Fetch and process Kaggle crypto data for training"
    )
    parser.add_argument(
        "--dataset",
        type=str,
        default="bitcoin-price-prediction",
        help="Dataset ID or name"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="./kaggle_data",
        help="Output directory"
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List available datasets"
    )
    
    args = parser.parse_args()
    
    fetcher = KaggleDataFetcher()
    
    if args.list:
        print("\n📊 Available Crypto Datasets:")
        for ds in fetcher.list_crypto_datasets():
            print(f"  • {ds['name']}: {ds['description']}")
        return
    
    # Download dataset
    data_dir = fetcher.download_dataset(args.dataset, args.output)
    
    if data_dir:
        # Find CSV file
        csv_files = list(Path(data_dir).glob("*.csv"))
        
        if csv_files:
            csv_path = csv_files[0]
            print(f"\n📈 Processing {csv_path.name}...")
            
            # Load and process
            df = CryptoDataProcessor.load_data(str(csv_path))
            df = CryptoDataProcessor.calculate_technical_indicators(df)
            df = CryptoDataProcessor.normalize_features(df)
            q_scores = CryptoDataProcessor.generate_q_score_labels(df)
            
            # Split data
            train_df, train_q, val_df, val_q, test_df, test_q = \
                CryptoDataProcessor.split_data(df, q_scores)
            
            # Save processed data
            output_json = Path(data_dir) / "processed_data.json"
            processed_data = {
                "metadata": {
                    "source": args.dataset,
                    "processed_at": datetime.now().isoformat(),
                    "total_records": len(df),
                    "train_size": len(train_df),
                    "val_size": len(val_df),
                    "test_size": len(test_df),
                    "features": df.select_dtypes(include=[np.number]).columns.tolist()
                },
                "data": {
                    "train": {
                        "features": train_df.select_dtypes(include=[np.number]).values.tolist()[:100],
                        "targets": train_q[:100].tolist()
                    },
                    "validation": {
                        "features": val_df.select_dtypes(include=[np.number]).values.tolist()[:50],
                        "targets": val_q[:50].tolist()
                    },
                    "test": {
                        "features": test_df.select_dtypes(include=[np.number]).values.tolist()[:50],
                        "targets": test_q[:50].tolist()
                    }
                }
            }
            
            with open(output_json, 'w') as f:
                json.dump(processed_data, f, indent=2)
            
            print(f"✅ Saved to {output_json}")
        else:
            print("❌ No CSV files found in downloaded data")
    else:
        print("❌ Failed to download dataset")


if __name__ == "__main__":
    main()
