#!/bin/bash
# Start a simple HTTP server for the Seismicity Analysis App
# This script tries different methods to start a local web server

echo "============================================"
echo "Seismicity Analysis App - Local Server"
echo "============================================"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Starting Python 3 HTTP Server on port 8000..."
    echo ""
    echo "Open your browser and navigate to:"
    echo "http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# Check if Python is available
if command -v python &> /dev/null; then
    echo "Starting Python HTTP Server on port 8000..."
    echo ""
    echo "Open your browser and navigate to:"
    echo "http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
    exit 0
fi

# Check if PHP is available
if command -v php &> /dev/null; then
    echo "Starting PHP Development Server on port 8000..."
    echo ""
    echo "Open your browser and navigate to:"
    echo "http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000
    exit 0
fi

# Check if Node.js http-server is available
if command -v http-server &> /dev/null; then
    echo "Starting http-server on port 8000..."
    echo ""
    echo "Open your browser and navigate to:"
    echo "http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    http-server -p 8000
    exit 0
fi

# If no server is found
echo "ERROR: No suitable web server found!"
echo ""
echo "Please install one of the following:"
echo "  - Python 3 (https://www.python.org/downloads/)"
echo "  - PHP (https://www.php.net/downloads)"
echo "  - Node.js with http-server (npm install -g http-server)"
echo ""
echo "Or use VS Code with the Live Server extension"
echo ""
exit 1
