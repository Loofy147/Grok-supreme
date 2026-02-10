import numpy as np
import json
import os

def load_weights(path='data/trained_skill_weights.json'):
    """Load trained skill weights from JSON."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f).get('weights', {})
    return {}

def calculate_ma(prices, period):
    """Compute moving average."""
    if len(prices) < period:
        return None
    return np.mean(prices[-period:])

def calculate_rsi(prices, period=14):
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

def generate_signal(prices, volumes, timeframe, weights=None):
    """
    Calculate signal using weights and momentum crossover.
    timeframe: 'scalping', '1h', '4h', 'daily', 'weekly'
    """
    if weights is None:
        weights = load_weights()

    # Timeframe-specific periods
    periods = {
        'scalping': (3, 10),
        '1h': (5, 20),
        '4h': (7, 30),
        'daily': (10, 50),
        'weekly': (20, 100)
    }
    short_period, long_period = periods.get(timeframe, (7, 30))

    ma_short = calculate_ma(prices, short_period)
    ma_long = calculate_ma(prices, long_period)
    rsi = calculate_rsi(prices)

    avg_volume = np.mean(volumes) if len(volumes) > 0 else 0
    current_volume = volumes[-1] if len(volumes) > 0 else 0

    # Use w_V (Generativity/Volume) for threshold adaptation
    w_V = weights.get('w_V', 0.086)
    volume_threshold = avg_volume * (1 - w_V)

    # Momentum crossover + RSI filter
    if ma_short and ma_long:
        if ma_short > ma_long and rsi < 70 and current_volume > volume_threshold:
            return 'Buy'
        elif ma_short < ma_long or rsi > 80:
            return 'Sell'

    return 'Hold'

def calculate_sl_tp(entry, timeframe, risk_percent=0.02):
    """Risk-based SL/TP; open TP if long trend."""
    factors = {
        'scalping': 1.0,
        '1h': 1.5,
        '4h': 2.0,
        'daily': 3.0,
        'weekly': 5.0
    }
    factor = factors.get(timeframe, 1.0)

    sl = entry * (1 - risk_percent * factor)

    # Wider TP for higher timeframes
    if timeframe in ['daily', 'weekly']:
        tp = None  # Open TP for long trends
    else:
        tp = entry * (1 + 1.5 * risk_percent * factor)

    return sl, tp

if __name__ == '__main__':
    # Test with dummy data
    p = [60000 + i*100 for i in range(100)]
    v = [1000 + (i%5)*100 for i in range(100)]
    print(f"Daily Signal: {generate_signal(p, v, 'daily')}")
