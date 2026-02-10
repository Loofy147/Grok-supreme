@echo off
REM SSO-TS Training Setup Script for Windows
REM This script configures the training environment and Kaggle CLI

setlocal enabledelayedexpansion

echo ================================
echo SSO-TS Training Setup (Windows)
echo ================================
echo.

REM Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python %PYTHON_VERSION% found
echo.

REM Install Python dependencies
echo [2/5] Installing Python dependencies...
pip install --quiet kaggle pandas numpy scipy scikit-learn matplotlib seaborn
if errorlevel 1 (
    echo [WARNING] Some dependencies may have failed to install
)
echo [OK] Python packages installed
echo.

REM Check Kaggle credentials
echo [3/5] Checking Kaggle credentials...
set KAGGLE_DIR=%USERPROFILE%\.kaggle

if exist "%KAGGLE_DIR%\kaggle.json" (
    echo [OK] Kaggle credentials found
) else (
    echo [WARNING] Kaggle credentials not found
    echo To set up Kaggle:
    echo   1. Visit: https://www.kaggle.com/account
    echo   2. Click 'Create New API Token'
    echo   3. Place kaggle.json at: %KAGGLE_DIR%\
    echo   4. Run this script again
)
echo.

REM Create necessary directories
echo [4/5] Creating directories...
if not exist "scripts" mkdir scripts
if not exist "data\kaggle_data" mkdir data\kaggle_data
if not exist "data\trained_weights" mkdir data\trained_weights
echo [OK] Directories created
echo.

REM Verify installation
echo [5/5] Verifying installation...

if exist "scripts\kaggle_data_fetcher.py" (
    echo [OK] Data fetcher script found
) else (
    echo [ERROR] Data fetcher script not found
)

REM Test Python imports
python << 'EOF'
import sys
try:
    import kaggle
    import pandas
    import numpy
    print("[OK] All required Python packages imported successfully")
except ImportError as e:
    print(f"[ERROR] Missing package: {e}")
    sys.exit(1)
EOF

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo   1. Configure Kaggle credentials if not already done
echo   2. Test data fetcher:
echo      python scripts/kaggle_data_fetcher.py --list
echo   3. Run training from the web interface at http://localhost:3000/training
echo.
echo For more information, see TRAINING_GUIDE.md
echo.
pause
