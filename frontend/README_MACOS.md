# Running the Seismicity App on macOS

## ⚠️ Important: CORS Error Prevention

**DO NOT open `index.html` directly by double-clicking it!**

When you open HTML files directly, browsers use the `file://` protocol which blocks loading CSV files due to CORS (Cross-Origin Resource Sharing) security restrictions.

## ✅ Correct Way to Run the App

### Option 1: Using the Shell Script (Recommended)

1. Open **Terminal**
2. Navigate to the frontend folder:
   ```bash
   cd /path/to/seismicity-app/frontend
   ```
3. Make the script executable (first time only):
   ```bash
   chmod +x start-server.sh
   ```
4. Run the server:
   ```bash
   ./start-server.sh
   ```
5. Open your browser and go to: **http://localhost:8000**

### Option 2: Using Python Directly

1. Open **Terminal**
2. Navigate to the frontend folder:
   ```bash
   cd /path/to/seismicity-app/frontend
   ```
3. Start the HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and go to: **http://localhost:8000**

### Option 3: Using PHP (if Python is not available)

1. Open **Terminal**
2. Navigate to the frontend folder
3. Run:
   ```bash
   php -S localhost:8000
   ```
4. Open your browser and go to: **http://localhost:8000**

### Option 4: Using Node.js http-server

1. Install http-server globally (first time only):
   ```bash
   npm install -g http-server
   ```
2. Navigate to the frontend folder
3. Run:
   ```bash
   http-server -p 8000
   ```
4. Open your browser and go to: **http://localhost:8000**

## 🔍 Troubleshooting

### Error: "Command not found: python3"

macOS comes with Python 3 pre-installed (macOS 12.3+). Try:
```bash
python3 --version
```

If not available, install Python from: https://www.python.org/downloads/

### Error: "Permission denied: ./start-server.sh"

Make the script executable:
```bash
chmod +x start-server.sh
```

### Port 8000 is already in use

Try a different port:
```bash
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Still seeing CORS errors?

Make sure you:
1. Started the server in the `frontend` folder (not the parent directory)
2. Are accessing via `http://localhost:8000` (not `file://`)
3. The CSV file `isc-gem-cat.csv` exists in the same folder as `index.html`

## 📝 Why This Happens

Modern browsers enforce security policies that prevent web pages opened via `file://` from loading external resources (like CSV files). This is called the Same-Origin Policy and CORS.

**The solution:** Always serve your web app through an HTTP server, even for local development!

## 🚀 Quick Start Command

```bash
cd /path/to/seismicity-app/frontend && python3 -m http.server 8000
```

Then open: **http://localhost:8000**
