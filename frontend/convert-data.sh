#!/bin/bash

# macOS/Linux shell script to convert CSV to JavaScript for standalone use

echo "================================"
echo "Seismicity App Data Converter"
echo "================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo ""
    echo "macOS: Install from https://www.python.org/"
    echo "       Or use Homebrew: brew install python3"
    echo ""
    echo "Linux: sudo apt-get install python3"
    echo "       Or: sudo yum install python3"
    echo ""
    exit 1
fi

echo "Converting CSV data to JavaScript..."
echo "This may take 10-30 seconds..."
echo ""

python3 convert-csv-to-js.py

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "SUCCESS!"
    echo "================================"
    echo ""
    echo "The earthquake-data.js file has been created."
    echo "You can now open index.html directly in your browser!"
    echo ""
    echo "Next steps:"
    echo "1. Right-click index.html → Open With → Your browser"
    echo "2. Or open START_HERE.html for instructions"
    echo ""
else
    echo ""
    echo "ERROR: Conversion failed!"
    echo "Please check that isc-gem-cat.csv exists in this folder"
    echo ""
    exit 1
fi
