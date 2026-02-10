@echo off
REM Kaggle Credentials Setup Script for Windows
REM ============================================

setlocal enabledelayedexpansion

echo ==================================
echo Kaggle API Credentials Setup
echo ==================================
echo.
echo Get your credentials from: https://www.kaggle.com/account
echo Click "Create New API Token" to download kaggle.json
echo.

set /p KAGGLE_USERNAME="Enter your Kaggle username: "
if "!KAGGLE_USERNAME!"=="" (
    echo Error: Username is required
    exit /b 1
)

set /p KAGGLE_API_TOKEN="Enter your Kaggle API Token: "
if "!KAGGLE_API_TOKEN!"=="" (
    echo Error: API Token is required
    exit /b 1
)

echo.
echo How would you like to save your credentials?
echo 1. Environment variables (.env.local)
echo 2. Kaggle JSON file (%%USERPROFILE%%\.kaggle\kaggle.json)
echo 3. Both (Recommended)
echo.
set /p CHOICE="Select option (1-3) [3]: "
if "!CHOICE!"=="" set CHOICE=3

if !CHOICE! equ 1 (
    call :update_env_file
    echo Credentials saved to .env.local
) else if !CHOICE! equ 2 (
    call :setup_kaggle_json
    echo Credentials saved to %%USERPROFILE%%\.kaggle\kaggle.json
) else if !CHOICE! equ 3 (
    call :update_env_file
    call :setup_kaggle_json
    echo Credentials saved to both locations
) else (
    echo Error: Invalid option
    exit /b 1
)

echo.
echo Testing Kaggle API connection...
python -c "from kaggle.api.kaggle_api_extended import KaggleApi; api = KaggleApi(); api.authenticate(); api.dataset_list(page_size=1); print('Kaggle API connection successful!')" 2>nul
if !errorlevel! neq 0 (
    echo Warning: Could not test Kaggle connection. Verify credentials and install kaggle: pip install kaggle
)

echo.
echo ==================================
echo Setup Complete!
echo ==================================
echo.
echo Your Kaggle credentials are configured.
echo You can now use Kaggle datasets in the training interface:
echo   - Visit http://localhost:3000/training
echo   - Click "Fetch from Kaggle"
echo   - Select and download cryptocurrency datasets
echo.
pause
exit /b 0

:update_env_file
if not exist ".env.local" (
    copy .env.local.example .env.local >nul
)

(for /f "delims=" %%A in (.env.local) do (
    if "%%A"=="" (
        echo.
    ) else (
        setlocal enabledelayedexpansion
        set "line=%%A"
        if "!line:~0,18!"=="KAGGLE_USERNAME=" (
            echo KAGGLE_USERNAME=!KAGGLE_USERNAME!
        ) else if "!line:~0,18!"=="KAGGLE_API_TOKEN=" (
            echo KAGGLE_API_TOKEN=!KAGGLE_API_TOKEN!
        ) else (
            echo !line!
        )
        endlocal
    )
)) > .env.local.tmp

move /y .env.local.tmp .env.local >nul

if not findstr /m "KAGGLE_USERNAME=" .env.local >nul (
    echo KAGGLE_USERNAME=!KAGGLE_USERNAME!>> .env.local
)
if not findstr /m "KAGGLE_API_TOKEN=" .env.local >nul (
    echo KAGGLE_API_TOKEN=!KAGGLE_API_TOKEN!>> .env.local
)
exit /b 0

:setup_kaggle_json
if not exist "%USERPROFILE%\.kaggle" mkdir "%USERPROFILE%\.kaggle"

(
    echo {
    echo   "username": "!KAGGLE_USERNAME!",
    echo   "key": "!KAGGLE_API_TOKEN!"
    echo }
) > "%USERPROFILE%\.kaggle\kaggle.json"
exit /b 0
