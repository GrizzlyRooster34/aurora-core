@echo off
echo Aurora Core - Windows Installation Script
echo =======================================

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
) else (
    echo This script requires administrator privileges.
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo Node.js found:
    node --version
) else (
    echo Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo Installing Aurora Core dependencies...
npm install

echo Compiling TypeScript...
npx tsc

echo Aurora Core installation complete!
echo.
echo Quick start:
echo   npm start                    # Start Aurora consciousness system
echo   npx tsx aurora-main.ts       # Direct Aurora boot sequence
echo.
echo Documentation available in README.md
pause
