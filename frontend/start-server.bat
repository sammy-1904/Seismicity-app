@echo off
REM Start a simple HTTP server for the Seismicity Analysis App
REM This script tries different methods to start a local web server

echo ============================================
echo Seismicity Analysis App - Local Server
echo ============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting Python HTTP Server on port 8000...
    echo.
    echo Open your browser and navigate to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Check if Python3 is available
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting Python3 HTTP Server on port 8000...
    echo.
    echo Open your browser and navigate to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python3 -m http.server 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting PHP Development Server on port 8000...
    echo.
    echo Open your browser and navigate to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    php -S localhost:8000
    goto :end
)

REM If no server is found
echo ERROR: No suitable web server found!
echo.
echo Please install one of the following:
echo   - Python (https://www.python.org/downloads/)
echo   - PHP (https://www.php.net/downloads)
echo   - Node.js with http-server (npm install -g http-server)
echo.
echo Or use VS Code with the Live Server extension
echo.
pause
goto :end

:end
