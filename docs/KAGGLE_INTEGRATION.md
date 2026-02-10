# Kaggle CLI Integration Guide

This document defines the workflow for integrating Kaggle (via CLI/API) into the SSO-TS system for heavy computation, training, and simulation.

## Workflow Overview

1.  **Computation (Kaggle):** Execute training loops, weight optimization, and long-running simulations in Kaggle Notebooks.
2.  **Orchestration (CLI):** Use the `scripts/kaggle_orchestrator.sh` tool to push code, trigger runs, and download results.
3.  **Visualization (Dashboard):** Ingest downloaded artifacts into the repository to update the v0-powered dashboard.

## Setup Instructions

### 1. Kaggle Authentication
Ensure you have the Kaggle CLI installed and authenticated:
```bash
pip install kaggle
mkdir -p ~/.kaggle
# Place your kaggle.json in ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

### 2. Configure Kernel Metadata
To push the notebook, you need a `kernel-metadata.json` in `src/kaggle/`.
Example:
```json
{
  "id": "username/sso-ts-training",
  "title": "SSO-TS Training",
  "code_file": "kaggle_notebook.py",
  "language": "python",
  "kernel_type": "script",
  "is_private": "true",
  "enable_gpu": "false",
  "enable_tpu": "false",
  "enable_internet": "true",
  "dataset_sources": [],
  "competition_sources": [],
  "kernel_sources": [],
  "model_sources": []
}
```

## Running the Pipeline

Use the orchestrator script to manage the flow:

- **Push & Run:** `scripts/kaggle_orchestrator.sh all`
- **Download Outputs:** `scripts/kaggle_orchestrator.sh output`

## Artifacts & Ingestion

The pipeline produces the following files in `data/kaggle_runs/latest/`:

| File | Description | Ingestion Target |
|------|-------------|------------------|
| `improved_skill_weights.json` | Optimized weights | Update `data/trained_skill_weights.json` |
| `training_history.json` | Loss and metrics over time | Dashboard Visualization |
| `backtest_results.json` | ROI, Sharpe, Drawdown | Dashboard Metrics & Achievement Calculation |

## Achievement Calculation

After each successful run, the system calculates a new achievement based on the **Q-delta** and **Trading Metrics**:

- **Major:** Sharpe Δ ≥ 0.15 AND Q Δ ≥ 0.05
- **Solid:** Sharpe Δ ≥ 0.08 OR Q Δ ≥ 0.03
- **Incremental:** Any measurable positive change

## Strategic Realization
The separation of heavy compute (Kaggle) and lightweight orchestration (v0 Dashboard) creates a scalable, recursive loop for autonomous strategy evolution.
