#!/usr/bin/env python3
"""
Q-Score Delta Simulation Example
Demonstrates best practices for Q-value calculation and delta tracking.
"""

import numpy as np
import json
from dataclasses import dataclass
from datetime import datetime

@dataclass
class QScoreContext:
    baseline: float
    volatility: float
    synergy_boost: float
    benchmark_score: float

def calculate_refined_q(context: QScoreContext) -> float:
    """
    Applies best practices:
    1. Conservative Baseline
    4. Synergy Accounting
    6. Risk-Weighted Adjustment
    7. Benchmark Integration
    """
    # 1. Start with conservative baseline
    score = context.baseline

    # 6. Risk-weighted adjustment (penalty for high volatility)
    if context.volatility > 0.15:
        score -= 0.05

    # 4. Synergy boost
    score += context.synergy_boost

    # 7. Benchmark comparison (relative improvement)
    if score > context.benchmark_score:
        score += 0.02 # Consistency bonus

    return np.clip(score, 0.0, 1.0)

def main():
    print("--- Q-Score Delta Simulation ---")

    # Initial State (Pre-Kaggle)
    initial_ctx = QScoreContext(
        baseline=0.88,
        volatility=0.18,
        synergy_boost=0.0,
        benchmark_score=0.85
    )

    q_initial = calculate_refined_q(initial_ctx)
    print(f"Initial Q-Score: {q_initial:.4f}")

    # Post-Kaggle Optimization
    # Improved weights reduce volatility and increase synergy
    optimized_ctx = QScoreContext(
        baseline=0.91,
        volatility=0.12, # Risk reduced
        synergy_boost=0.04, # Synergies identified
        benchmark_score=0.85
    )

    q_optimized = calculate_refined_q(optimized_ctx)
    print(f"Optimized Q-Score: {q_optimized:.4f}")

    # 5. Delta Tracking
    delta = q_optimized - q_initial
    print(f"Q-Delta: {delta:+.4f}")

    if delta >= 0.05:
        achievement = "Major"
    elif delta >= 0.03:
        achievement = "Solid"
    else:
        achievement = "Incremental"

    print(f"Achievement Grade: {achievement}")

if __name__ == "__main__":
    main()
