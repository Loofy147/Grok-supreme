import numpy as np
import json
import os
from typing import Dict, List, Tuple, Optional

def load_weights(path='data/trained_skill_weights.json'):
    """Load trained skill weights from JSON."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f).get('weights', {})
    return {}

def calculate_ma(prices: List[float], period: int) -> Optional[float]:
    """Compute moving average."""
    if len(prices) < period:
        return None
    return np.mean(prices[-period:])

def calculate_ema(prices: List[float], period: int) -> Optional[float]:
    """Compute exponential moving average."""
    if len(prices) < period:
        return None
    multiplier = 2 / (period + 1)
    ema = np.mean(prices[:period])
    for price in prices[period:]:
        ema = price * multiplier + ema * (1 - multiplier)
    return ema

def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """Compute Relative Strength Index."""
    if len(prices) < period + 1:
        return 50.0  # Neutral
    deltas = np.diff(prices)
    seed = deltas[:period+1]
    up = seed[seed >= 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 100
    rsi = np.zeros_like(prices)
    rsi[:period] = 100. - 100. / (1. + rs)

    for i in range(period, len(prices)):
        delta = deltas[i - 1]
        if delta > 0:
            upval = delta
            downval = 0.
        else:
            upval = 0.
            downval = -delta

        up = (up * (period - 1) + upval) / period
        down = (down * (period - 1) + downval) / period
        rs = up / down if down != 0 else 100
        rsi[i] = 100. - 100. / (1. + rs)
    return rsi[-1]

def calculate_momentum(prices: List[float], period: int = 10) -> float:
    """Calculate momentum (price change over period)."""
    if len(prices) < period:
        return 0.0
    return ((prices[-1] - prices[-period]) / prices[-period]) * 100

def generate_signal(prices: List[float], volumes: List[float], timeframe: str, weights: Optional[Dict] = None) -> str:
    """
    Enhanced signal calculation using momentum crossover with weighted filters.
    timeframe: 'scalping', '1h', '4h', 'daily', 'weekly'
    
    Returns: 'Buy', 'Sell', or 'Hold'
    """
    if weights is None:
        weights = load_weights()

    # Timeframe-specific periods for MA crossover
    periods = {
        'scalping': (3, 10),
        '1h': (5, 20),
        '4h': (7, 30),
        'daily': (10, 50),
        'weekly': (20, 100)
    }
    short_period, long_period = periods.get(timeframe, (7, 30))

    # Validate data length
    if len(prices) < long_period or len(volumes) < long_period:
        return 'Hold'

    # Calculate technical indicators
    ma_short = calculate_ma(prices, short_period)
    ma_long = calculate_ma(prices, long_period)
    rsi = calculate_rsi(prices)
    momentum = calculate_momentum(prices, min(10, short_period))

    # Volume analysis
    avg_volume = np.mean(volumes[-long_period:])
    current_volume = volumes[-1]
    
    # Extract weights with fallbacks
    w_V = weights.get('w_V', 0.086)  # Volume weight
    w_C = weights.get('w_C', 0.213)  # Creativity (adaptation)
    w_S = weights.get('w_S', 0.185)  # Synthesis
    
    volume_threshold = avg_volume * (1 - w_V)
    
    # Signal generation logic
    if ma_short is None or ma_long is None:
        return 'Hold'
    
    # Buy Signal: MA crossover + RSI filter + volume confirmation
    if ma_short > ma_long:
        if rsi < 70 and current_volume > volume_threshold:
            # Additional momentum filter for higher confidence
            if momentum > 0 or (rsi < 50 and momentum > -2):
                return 'Buy'
        elif rsi < 50:  # Moderate signal if volume low but RSI oversold
            return 'Buy'
    
    # Sell Signal: MA bearish crossover or RSI overbought
    if ma_short < ma_long:
        if rsi > 60 or momentum < -1:
            return 'Sell'
        return 'Hold'
    
    # Overbought/Oversold signals
    if rsi > 80:
        return 'Sell'
    elif rsi < 20:
        return 'Buy'
    
    return 'Hold'

def calculate_sl_tp(entry: float, timeframe: str, risk_percent: float = 0.02, trend_strength: float = 0.0) -> Tuple[float, Optional[float]]:
    """
    Calculate risk-based stop loss and take profit with adaptive sizing.
    
    Args:
        entry: Entry price
        timeframe: Trading timeframe
        risk_percent: Risk per trade (default 2%)
        trend_strength: Momentum strength (-100 to 100) for TP adjustment
    
    Returns:
        (stop_loss, take_profit)
    """
    factors = {
        'scalping': 1.0,
        '1h': 1.5,
        '4h': 2.0,
        'daily': 3.0,
        'weekly': 5.0
    }
    factor = factors.get(timeframe, 1.0)
    
    # Base SL from risk percentage
    sl = entry * (1 - risk_percent * factor)
    
    # Adaptive TP based on trend strength
    if timeframe in ['daily', 'weekly']:
        tp = None  # Open-ended for longer trends
    else:
        # Adjust TP multiplier based on trend strength
        tp_multiplier = 1.5 + (trend_strength / 100) * 0.5  # 1.0 to 2.0
        tp = entry * (1 + tp_multiplier * risk_percent * factor)
    
    return sl, tp

def get_signal_confidence(prices: List[float], volumes: List[float], timeframe: str, weights: Optional[Dict] = None) -> Dict[str, float]:
    """
    Calculate confidence scores for signals across indicators.
    
    Returns:
        dict with 'ma_signal', 'rsi_signal', 'volume_signal', 'overall' (0-100)
    """
    if len(prices) < 50:
        return {'ma_signal': 0, 'rsi_signal': 0, 'volume_signal': 0, 'overall': 0}
    
    if weights is None:
        weights = load_weights()
    
    periods = {
        'scalping': (3, 10),
        '1h': (5, 20),
        '4h': (7, 30),
        'daily': (10, 50),
        'weekly': (20, 100)
    }
    short_period, long_period = periods.get(timeframe, (7, 30))
    
    # MA signal confidence
    ma_short = calculate_ma(prices, short_period)
    ma_long = calculate_ma(prices, long_period)
    if ma_short and ma_long:
        ma_diff_pct = abs(ma_short - ma_long) / ma_long * 100
        ma_signal = min(100, ma_diff_pct * 10)  # Cap at 100
    else:
        ma_signal = 0
    
    # RSI signal confidence
    rsi = calculate_rsi(prices)
    if rsi > 70 or rsi < 30:
        rsi_signal = min(100, (100 - abs(rsi - 50)) / 50 * 100)
    else:
        rsi_signal = 0
    
    # Volume confidence
    avg_volume = np.mean(volumes[-long_period:])
    current_volume = volumes[-1]
    volume_ratio = current_volume / avg_volume if avg_volume > 0 else 0
    volume_signal = min(100, (volume_ratio - 1) * 100) if volume_ratio > 1 else 0
    
    # Overall confidence
    w_ma = weights.get('w_C', 0.213)  # Use creativity weight for MA
    w_rsi = weights.get('w_S', 0.185)  # Use synthesis weight for RSI
    w_vol = weights.get('w_V', 0.086)
    
    total_weight = w_ma + w_rsi + w_vol
    overall = (ma_signal * w_ma + rsi_signal * w_rsi + volume_signal * w_vol) / total_weight if total_weight > 0 else 0
    
    return {
        'ma_signal': float(ma_signal),
        'rsi_signal': float(rsi_signal),
        'volume_signal': float(volume_signal),
        'overall': float(overall)
    }

if __name__ == '__main__':
    # Test with dummy data
    p = [60000 + i*100 for i in range(100)]
    v = [1000 + (i%5)*100 for i in range(100)]
    print(f"Daily Signal: {generate_signal(p, v, 'daily')}")
    print(f"Signal Confidence: {get_signal_confidence(p, v, 'daily')}")
