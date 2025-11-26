@echo off
REM Windows batch file to convert CSV to JavaScript for standalone use

echo ================================
echo Seismicity App Data Converter
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo Converting CSV data to JavaScript...
echo This may take 10-30 seconds...
echo.

python convert-csv-to-js.py

if errorlevel 1 (
    echo.
    echo ERROR: Conversion failed!
    echo Please check that isc-gem-cat.csv exists in this folder
    echo.
    pause
    exit /b 1
)

echo.
echo ================================
echo SUCCESS!
echo ================================
echo.
echo The earthquake-data.js file has been created.
echo You can now open index.html directly in your browser!
echo.
echo Next steps:
echo 1. Double-click index.html
echo 2. Or double-click START_HERE.html for instructions
echo.
pause
