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
