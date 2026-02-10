#!/bin/bash

# SSO-TS Training Setup Script
# This script configures the training environment and Kaggle CLI

set -e

echo "================================"
echo "SSO-TS Training Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python
echo -e "${BLUE}[1/5] Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

python_version=$(python3 --version | awk '{print $2}')
echo -e "${GREEN}✓ Python $python_version found${NC}"
echo ""

# Install Python dependencies
echo -e "${BLUE}[2/5] Installing Python dependencies...${NC}"
pip install --quiet kaggle pandas numpy scipy scikit-learn matplotlib seaborn 2>/dev/null || {
    echo -e "${YELLOW}Warning: Some dependencies may have failed to install${NC}"
}
echo -e "${GREEN}✓ Python packages installed${NC}"
echo ""

# Check Kaggle credentials
echo -e "${BLUE}[3/5] Checking Kaggle credentials...${NC}"

if [ "$OS" == "Windows_NT" ]; then
    KAGGLE_DIR="$USERPROFILE/.kaggle"
else
    KAGGLE_DIR="$HOME/.kaggle"
fi

if [ -f "$KAGGLE_DIR/kaggle.json" ]; then
    echo -e "${GREEN}✓ Kaggle credentials found${NC}"
else
    echo -e "${YELLOW}⚠ Kaggle credentials not found${NC}"
    echo "To set up Kaggle:"
    echo "  1. Visit: https://www.kaggle.com/account"
    echo "  2. Click 'Create New API Token'"
    echo "  3. Place kaggle.json at: $KAGGLE_DIR/"
    echo "  4. Run this script again"
fi
echo ""

# Create necessary directories
echo -e "${BLUE}[4/5] Creating directories...${NC}"
mkdir -p scripts
mkdir -p data/kaggle_data
mkdir -p data/trained_weights
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Verify installation
echo -e "${BLUE}[5/5] Verifying installation...${NC}"

# Check if scripts exist
if [ -f "scripts/kaggle_data_fetcher.py" ]; then
    echo -e "${GREEN}✓ Data fetcher script found${NC}"
else
    echo -e "${RED}✗ Data fetcher script not found${NC}"
fi

# Test Python imports
python3 << 'EOF'
import sys
try:
    import kaggle
    import pandas
    import numpy
    print("✓ All required Python packages imported successfully")
except ImportError as e:
    print(f"✗ Missing package: {e}")
    sys.exit(1)
EOF

echo ""
echo "================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "  1. Configure Kaggle credentials if not already done"
echo "  2. Test data fetcher:"
echo "     python scripts/kaggle_data_fetcher.py --list"
echo "  3. Run training from the web interface at http://localhost:3000/training"
echo ""
echo "For more information, see TRAINING_GUIDE.md"
