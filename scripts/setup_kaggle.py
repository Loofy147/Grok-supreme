#!/usr/bin/env python3
"""
Kaggle Credentials Setup Helper
================================

Interactive script to set up Kaggle API credentials for the SSO-TS Dashboard.

This script helps you:
1. Configure environment variables for Kaggle authentication
2. Create ~/.kaggle/kaggle.json if preferred
3. Test the connection

Usage:
    python scripts/setup_kaggle.py
"""

import os
import json
import sys
from pathlib import Path


def get_kaggle_credentials():
    """Interactively get Kaggle credentials from user"""
    print("\n" + "=" * 60)
    print("Kaggle API Credentials Setup")
    print("=" * 60)
    print("\nYou can get your credentials from: https://www.kaggle.com/account")
    print("Click 'Create New API Token' to download kaggle.json\n")
    
    username = input("Enter your Kaggle username: ").strip()
    if not username:
        print("❌ Username is required")
        return None
    
    api_token = input("Enter your Kaggle API Token: ").strip()
    if not api_token:
        print("❌ API Token is required")
        return None
    
    return {"username": username, "api_key": api_token}


def setup_env_file(credentials):
    """Update .env.local with Kaggle credentials"""
    env_path = Path(".env.local")
    
    # Read existing .env.local or create new one
    env_content = ""
    if env_path.exists():
        with open(env_path, "r") as f:
            env_content = f.read()
    
    # Update or add Kaggle credentials
    lines = env_content.split("\n")
    updated_lines = []
    found_username = False
    found_token = False
    
    for line in lines:
        if line.startswith("KAGGLE_USERNAME="):
            updated_lines.append(f"KAGGLE_USERNAME={credentials['username']}")
            found_username = True
        elif line.startswith("KAGGLE_API_TOKEN="):
            updated_lines.append(f"KAGGLE_API_TOKEN={credentials['api_key']}")
            found_token = True
        else:
            updated_lines.append(line)
    
    if not found_username:
        updated_lines.append(f"KAGGLE_USERNAME={credentials['username']}")
    if not found_token:
        updated_lines.append(f"KAGGLE_API_TOKEN={credentials['api_key']}")
    
    # Write back to file
    with open(env_path, "w") as f:
        f.write("\n".join(updated_lines))
    
    return True


def setup_kaggle_json(credentials):
    """Create ~/.kaggle/kaggle.json file"""
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_dir.mkdir(exist_ok=True)
    
    kaggle_json_path = kaggle_dir / "kaggle.json"
    
    kaggle_config = {
        "username": credentials["username"],
        "key": credentials["api_key"]
    }
    
    with open(kaggle_json_path, "w") as f:
        json.dump(kaggle_config, f, indent=2)
    
    # Secure permissions (chmod 600)
    os.chmod(kaggle_json_path, 0o600)
    
    return True


def test_kaggle_connection():
    """Test if Kaggle API is working"""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        
        api = KaggleApi()
        api.authenticate()
        
        # Try to list a dataset to verify connection
        api.dataset_list(page_size=1)
        print("✅ Kaggle API connection successful!")
        return True
    except ImportError:
        print("⚠️  Kaggle library not installed. Run: pip install kaggle")
        return False
    except Exception as e:
        print(f"❌ Kaggle connection failed: {e}")
        return False


def main():
    """Main setup flow"""
    print("\nSSO-TS Dashboard - Kaggle Setup Helper\n")
    
    # Get credentials from user
    credentials = get_kaggle_credentials()
    if not credentials:
        sys.exit(1)
    
    # Ask where to save credentials
    print("\nHow would you like to save your credentials?")
    print("1. Environment variables (.env.local)")
    print("2. Kaggle JSON file (~/.kaggle/kaggle.json)")
    print("3. Both (Recommended)")
    
    choice = input("\nSelect option (1-3) [3]: ").strip() or "3"
    
    try:
        if choice in ["1", "3"]:
            setup_env_file(credentials)
            print("✅ Credentials saved to .env.local")
        
        if choice in ["2", "3"]:
            setup_kaggle_json(credentials)
            print(f"✅ Credentials saved to ~/.kaggle/kaggle.json")
        
        if choice not in ["1", "2", "3"]:
            print("❌ Invalid option")
            sys.exit(1)
        
        # Test connection
        print("\nTesting Kaggle API connection...")
        if test_kaggle_connection():
            print("\n" + "=" * 60)
            print("Setup Complete!")
            print("=" * 60)
            print("\nYour Kaggle credentials are now configured.")
            print("You can use the Kaggle integration in the Dashboard:")
            print("  - Visit http://localhost:3000/training")
            print("  - Click 'Fetch from Kaggle'")
            print("  - Select a dataset to download and train")
        else:
            print("\n⚠️  Connection test failed. Please verify your credentials.")
    
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
