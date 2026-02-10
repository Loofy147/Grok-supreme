# SSO-TS: Modular Repository Structure

## Objective
Optimize repository organization for higher Q-values (>0.90) and integration with Grok API services (code_execution, web_search, etc.).

## Repository Structure
- `/docs`: Documentation, reports, and skill definitions.
- `/src`: Core logic, skills engine, and enhancements.
- `/data`: Datasets, model weights, and simulations.
- `/tests`: Unit and integration tests.
- `/examples`: Case studies and usage examples (e.g., BTC Momentum Backtest).
- `/ci`: Automation and validation scripts.
- `/configs`: Configuration files for API hooks and thresholds.
- `/deploy`: Platform-specific deployment configurations (e.g., vO Dashboard).

## vO Platform Integration
The system is designed to integrate with the vO platform (Vercel's AI-powered app builder) for build, release, and dashboarding.
- **Dashboard**: A React/Next.js app generated via v0 (Chat ID: mKzrY4przIE) provides a visual interface for simulations and metrics.
- **Strategic Online Simulation**: Enables paper-trading views and real-time BTC metrics via Grok API hooks.

## Achievement Calculation Framework
New achievements are calculated using a recursive Q-scoring framework:
1. **Baseline**: Establish current state Q-score (e.g., pre-sim Sharpe ratio).
2. **Measurement**: Run the new feature/simulation and capture metrics (ROI, Drawdown, etc.).
3. **Crystallization**: Compute the new Q-score ({new}$) based on weighted metrics and synergy bonuses.
4. **Validation**: Recursively verify the achievement via self-critique loops.

## Key Components
- **Skill Engine**: United skill orchestrator (`src/skills/united_skill_script.py`).
- **OMEGA Enhancements**: Dimension interaction matrix and quality scoring (`src/enhancements/omega_enhancement_1_interactions.py`).
- **Validation**: API-powered self-validation (`ci/validate_repo.py`).

## Getting Started
To validate the repository integrity:
```bash
python3 ci/validate_repo.py
```

To run a sample backtest:
```bash
python3 examples/btc_momentum_backtest.py
```

## Kaggle Integration
Heavy computational tasks such as weight optimization and large-scale simulations are offloaded to Kaggle.
- **Notebooks**: `src/kaggle/`
- **Orchestration**: `scripts/kaggle_orchestrator.sh`
- **Results**: `data/kaggle_runs/`
See `docs/KAGGLE_INTEGRATION.md` for detailed usage and achievement metrics.
