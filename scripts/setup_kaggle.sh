#!/bin/bash

# Kaggle Credentials Setup Script for macOS and Linux
# ====================================================

echo "=================================="
echo "Kaggle API Credentials Setup"
echo "=================================="
echo ""
echo "Get your credentials from: https://www.kaggle.com/account"
echo "Click 'Create New API Token' to download kaggle.json"
echo ""

read -p "Enter your Kaggle username: " KAGGLE_USERNAME
if [ -z "$KAGGLE_USERNAME" ]; then
    echo "❌ Username is required"
    exit 1
fi

read -sp "Enter your Kaggle API Token: " KAGGLE_API_TOKEN
echo ""
if [ -z "$KAGGLE_API_TOKEN" ]; then
    echo "❌ API Token is required"
    exit 1
fi

echo ""
echo "How would you like to save your credentials?"
echo "1. Environment variables (.env.local)"
echo "2. Kaggle JSON file (~/.kaggle/kaggle.json)"
echo "3. Both (Recommended)"
echo ""
read -p "Select option (1-3) [3]: " CHOICE
CHOICE=${CHOICE:-3}

# Function to update .env.local
update_env_file() {
    if [ ! -f ".env.local" ]; then
        cp .env.local.example .env.local
    fi
    
    # Update or add credentials
    if grep -q "^KAGGLE_USERNAME=" .env.local; then
        sed -i '' "s/^KAGGLE_USERNAME=.*/KAGGLE_USERNAME=$KAGGLE_USERNAME/" .env.local
    else
        echo "KAGGLE_USERNAME=$KAGGLE_USERNAME" >> .env.local
    fi
    
    if grep -q "^KAGGLE_API_TOKEN=" .env.local; then
        sed -i '' "s/^KAGGLE_API_TOKEN=.*/KAGGLE_API_TOKEN=$KAGGLE_API_TOKEN/" .env.local
    else
        echo "KAGGLE_API_TOKEN=$KAGGLE_API_TOKEN" >> .env.local
    fi
}

# Function to create kaggle.json
setup_kaggle_json() {
    mkdir -p ~/.kaggle
    
    cat > ~/.kaggle/kaggle.json << EOF
{
  "username": "$KAGGLE_USERNAME",
  "key": "$KAGGLE_API_TOKEN"
}
EOF
    
    chmod 600 ~/.kaggle/kaggle.json
}

# Execute based on choice
case $CHOICE in
    1)
        update_env_file
        echo "✅ Credentials saved to .env.local"
        ;;
    2)
        setup_kaggle_json
        echo "✅ Credentials saved to ~/.kaggle/kaggle.json"
        ;;
    3)
        update_env_file
        setup_kaggle_json
        echo "✅ Credentials saved to both locations"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "Testing Kaggle API connection..."
python3 << 'PYTHON_SCRIPT'
import os
import sys

try:
    os.environ['KAGGLE_USERNAME'] = '$KAGGLE_USERNAME'
    os.environ['KAGGLE_API_TOKEN'] = '$KAGGLE_API_TOKEN'
    
    from kaggle.api.kaggle_api_extended import KaggleApi
    api = KaggleApi()
    api.authenticate()
    api.dataset_list(page_size=1)
    print("✅ Kaggle API connection successful!")
except ImportError:
    print("⚠️  Kaggle library not installed. Run: pip install kaggle")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    sys.exit(1)
PYTHON_SCRIPT

echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "Your Kaggle credentials are configured."
echo "You can now use Kaggle datasets in the training interface:"
echo "  - Visit http://localhost:3000/training"
echo "  - Click 'Fetch from Kaggle'"
echo "  - Select and download cryptocurrency datasets"
