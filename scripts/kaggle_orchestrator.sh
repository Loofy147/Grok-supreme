#!/bin/bash
# Kaggle Orchestrator for SSO-TS
# Handles push, run, and output retrieval using Kaggle CLI.

set -e

# Default values
NOTEBOOK_PATH="src/kaggle/kaggle_notebook.py"
OUTPUT_DIR="data/kaggle_runs/latest"
SLUG="username/sso-ts-training"

case "$1" in
    push)
        echo "Pushing notebook to Kaggle..."
        kaggle kernels push -p $(dirname $NOTEBOOK_PATH)
        ;;
    run)
        echo "Starting Kaggle kernel run..."
        kaggle kernels run $SLUG --wait
        ;;
    output)
        echo "Downloading outputs to $OUTPUT_DIR..."
        mkdir -p $OUTPUT_DIR
        kaggle kernels output $SLUG -p $OUTPUT_DIR
        ;;
    all)
        bash $0 push
        bash $0 run
        bash $0 output
        ;;
    *)
        echo "Usage: $0 [push|run|output|all]"
        ;;
esac
