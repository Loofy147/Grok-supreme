"""
Signal Integration Module
Provides ready-to-use signal generation and analysis functions for backend integration.
Can be called from API routes or scheduled jobs.
"""

import numpy as np
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from .signals import generate_signal, calculate_sl_tp, get_signal_confidence, load_weights

class SignalGenerator:
    """Main class for signal generation with caching and batch processing."""
    
    def __init__(self, weights_path: str = 'data/trained_skill_weights.json'):
        """Initialize with weights."""
        self.weights = load_weights(weights_path)
        self.signal_cache = {}
        self.last_update = None
    
    def generate_multi_timeframe_signals(
        self, 
        prices: List[float], 
        volumes: List[float],
        timeframes: Optional[List[str]] = None
    ) -> Dict[str, Dict]:
        """
        Generate signals across multiple timeframes.
        
        Args:
            prices: List of price data (OHLC close, or just close prices)
            volumes: List of volume data
            timeframes: List of timeframes to analyze. Default: all
        
        Returns:
            Dict with signals and metrics for each timeframe
            {
                'daily': {
                    'signal': 'Buy'|'Sell'|'Hold',
                    'confidence': 0-100,
                    'sl': float,
                    'tp': float|null,
                    'metrics': {...}
                },
                ...
            }
        """
        if timeframes is None:
            timeframes = ['scalping', '1h', '4h', 'daily', 'weekly']
        
        results = {}
        
        for tf in timeframes:
            signal = generate_signal(prices, volumes, tf, self.weights)
            confidence = get_signal_confidence(prices, volumes, tf, self.weights)
            
            # Calculate momentum for trend strength
            momentum = ((prices[-1] - prices[max(0, len(prices)-10)]) / prices[max(0, len(prices)-10)]) * 100 if len(prices) > 1 else 0
            
            sl, tp = calculate_sl_tp(prices[-1], tf, trend_strength=momentum)
            
            results[tf] = {
                'signal': signal,
                'confidence': confidence['overall'],
                'confidence_details': {
                    'ma': confidence['ma_signal'],
                    'rsi': confidence['rsi_signal'],
                    'volume': confidence['volume_signal']
                },
                'entry_price': float(prices[-1]),
                'stop_loss': float(sl),
                'take_profit': float(tp) if tp else None,
                'momentum': float(momentum),
                'timestamp': datetime.now().isoformat()
            }
        
        self.last_update = datetime.now()
        return results
    
    def generate_signal_summary(
        self,
        prices: List[float],
        volumes: List[float]
    ) -> Dict:
        """
        Generate a comprehensive signal summary for all timeframes.
        Useful for dashboard display.
        
        Returns:
            Summary dict with:
            - primary_signal: Most confident signal across frames
            - signal_agreement: % of frames agreeing on same signal
            - risk_metrics: SL/TP for primary signal
            - all_signals: Detailed signals per timeframe
        """
        signals = self.generate_multi_timeframe_signals(prices, volumes)
        
        # Determine primary signal (highest confidence)
        primary = max(signals.items(), key=lambda x: x[1]['confidence'])
        
        # Count signal agreement
        signal_counts = {}
        for tf_data in signals.values():
            sig = tf_data['signal']
            signal_counts[sig] = signal_counts.get(sig, 0) + 1
        
        total_signals = len(signals)
        primary_signal = primary[0]
        agreement = (signal_counts.get(primary[1]['signal'], 0) / total_signals * 100)
        
        return {
            'primary_signal': primary[1]['signal'],
            'primary_timeframe': primary[0],
            'confidence': primary[1]['confidence'],
            'signal_agreement': agreement,
            'signal_distribution': signal_counts,
            'all_signals': signals,
            'generated_at': datetime.now().isoformat()
        }
    
    def analyze_signal_quality(
        self,
        prices: List[float],
        volumes: List[float],
        timeframe: str = 'daily'
    ) -> Dict:
        """
        Analyze quality and reliability of signal.
        
        Returns:
            Dict with quality metrics:
            - is_valid: Signal passes basic checks
            - strength: 0-100 confidence score
            - volatility: Price volatility
            - trend_coherence: How well trend indicators align
            - recommended_action: Based on analysis
        """
        if len(prices) < 50:
            return {'is_valid': False, 'error': 'Insufficient price history'}
        
        # Calculate volatility (20-period standard deviation)
        returns = np.diff(prices[-20:]) / prices[-20:-1]
        volatility = np.std(returns) * 100
        
        # Get signal confidence
        confidence = get_signal_confidence(prices, volumes, timeframe, self.weights)
        
        # Trend coherence: measure agreement between MA and RSI signals
        from .signals import calculate_ma, calculate_rsi
        
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
        
        # Coherence: 100 if all agree, lower otherwise
        ma_bullish = 1 if ma_short and ma_long and ma_short > ma_long else 0
        rsi_bullish = 1 if rsi < 70 else 0
        vol_bullish = 1 if np.mean(volumes[-10:]) > np.mean(volumes[-20:-10]) else 0
        
        coherence = (ma_bullish + rsi_bullish + vol_bullish) / 3 * 100
        
        # Recommendation
        signal = generate_signal(prices, volumes, timeframe, self.weights)
        is_valid = confidence['overall'] > 30
        
        recommendation = 'HOLD'
        if signal == 'Buy' and is_valid and confidence['overall'] > 60:
            recommendation = 'BUY'
        elif signal == 'Sell' and is_valid:
            recommendation = 'SELL'
        
        return {
            'is_valid': is_valid,
            'signal': signal,
            'confidence_score': confidence['overall'],
            'volatility': volatility,
            'trend_coherence': coherence,
            'ma_alignment': ma_bullish * 100,
            'rsi_alignment': rsi_bullish * 100,
            'volume_alignment': vol_bullish * 100,
            'recommended_action': recommendation,
            'risk_level': 'HIGH' if volatility > 5 else 'MEDIUM' if volatility > 2 else 'LOW',
            'analysis_timestamp': datetime.now().isoformat()
        }


class BacktestResult:
    """Helper class for backtest result formatting."""
    
    def __init__(self, metrics: Dict):
        """Initialize with backtest metrics."""
        self.metrics = metrics
    
    def to_json(self) -> str:
        """Serialize to JSON."""
        return json.dumps(self.metrics, default=str)
    
    def to_dict(self) -> Dict:
        """Return as dictionary."""
        return self.metrics
    
    def summary_string(self) -> str:
        """Return human-readable summary."""
        m = self.metrics
        return f"""
Backtest Results Summary
========================
ROI: {m.get('roi', 0):.2f}%
Sharpe Ratio: {m.get('sharpe', 0):.2f}
Max Drawdown: {m.get('drawdown', 0):.2f}%
Win Rate: {m.get('win_rate', 0):.1f}%
Total Trades: {m.get('count', 0)}
Profit Factor: {m.get('profit_factor', 0):.2f}
Recovery Factor: {m.get('recovery', 0):.2f}
Calmar Ratio: {m.get('calmar', 0):.2f}
"""


# Convenience functions for API integration

def get_current_signals(
    prices: List[float],
    volumes: List[float]
) -> Dict:
    """
    Quick function to get current signals for all timeframes.
    Ideal for API route integration.
    
    Usage in route:
        from src.core.signal_integration import get_current_signals
        signals = get_current_signals(price_data, volume_data)
        return Response(json.dumps(signals))
    """
    generator = SignalGenerator()
    return generator.generate_signal_summary(prices, volumes)


def get_signal_quality_report(
    prices: List[float],
    volumes: List[float],
    timeframe: str = 'daily'
) -> Dict:
    """
    Get detailed quality analysis for a specific timeframe.
    """
    generator = SignalGenerator()
    return generator.analyze_signal_quality(prices, volumes, timeframe)


def format_signal_for_display(signal_dict: Dict) -> Dict:
    """
    Format signal output for web display.
    """
    return {
        'primary_signal': signal_dict['primary_signal'],
        'confidence': f"{signal_dict['confidence']:.1f}%",
        'timeframe': signal_dict['primary_timeframe'],
        'status': '✅' if signal_dict['signal_agreement'] > 60 else '⚠️',
        'details': {
            tf: {
                'signal': data['signal'],
                'confidence': f"{data['confidence']:.1f}%",
                'entry': f"${data['entry_price']:.2f}",
                'sl': f"${data['stop_loss']:.2f}",
                'tp': f"${data['take_profit']:.2f}" if data['take_profit'] else 'Open'
            }
            for tf, data in signal_dict['all_signals'].items()
        },
        'generated_at': signal_dict['generated_at']
    }


if __name__ == '__main__':
    # Example usage
    print("[v0] Signal Integration Module - Ready for API integration\n")
    
    # Dummy test data
    prices = [60000 + i*100 + np.sin(i/10)*500 for i in range(100)]
    volumes = [1000 + (i%5)*100 for i in range(100)]
    
    # Generate signals
    signals = get_current_signals(prices, volumes)
    print("Multi-Timeframe Signals:")
    print(json.dumps(signals, indent=2, default=str))
    
    # Get quality report
    quality = get_signal_quality_report(prices, volumes, 'daily')
    print("\nSignal Quality Report:")
    print(json.dumps(quality, indent=2, default=str))
