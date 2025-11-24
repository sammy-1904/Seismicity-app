# Seismicity Analysis Web Application

Pure HTML/CSS/JavaScript earthquake analysis application for analyzing global seismicity patterns using the ISC-GEM Global Earthquake Catalogue (1904-2021).

## ⚠️ IMPORTANT: Avoiding CORS Errors

**DO NOT open `index.html` by double-clicking it!** This will cause CORS errors that prevent loading CSV data.

**ALWAYS run the app through a local HTTP server** as described below.

## 🚀 Quick Start

### Windows Users

1. Double-click `start-server.bat`
2. Open your browser to: **http://localhost:8000**

### macOS/Linux Users

1. Open Terminal in this folder
2. Run: `./start-server.sh` (or `chmod +x start-server.sh` first if needed)
3. Open your browser to: **http://localhost:8000**

## 📖 Detailed Setup Instructions

### Option 1: Using Python (Recommended - Works on all platforms)

**macOS/Linux:**
```bash
cd /path/to/seismicity-app/frontend
python3 -m http.server 8000
```

**Windows:**
```cmd
cd C:\path\to\seismicity-app\frontend
python -m http.server 8000
```

Then open: **http://localhost:8000**

### Option 2: Using the Provided Scripts

**Windows:**
- Double-click `start-server.bat`

**macOS/Linux:**
```bash
chmod +x start-server.sh  # First time only
./start-server.sh
```

### Option 3: Using PHP

```bash
php -S localhost:8000
```

### Option 4: Using Node.js http-server

```bash
npm install -g http-server  # First time only
http-server -p 8000
```

### Option 5: Using VS Code Live Server

1. Install the "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🔧 Troubleshooting

### macOS: "Command not found: python3"

macOS 12.3+ comes with Python 3. Check with:
```bash
python3 --version
```

If not available, install from: https://www.python.org/downloads/

### macOS: "Permission denied: ./start-server.sh"

Make the script executable:
```bash
chmod +x start-server.sh
```

### Port 8000 Already in Use

Use a different port:
```bash
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Still Seeing CORS Errors?

Common causes:
1. ❌ Opening `index.html` directly (file:// protocol)
2. ✅ Solution: Access via http://localhost:8000
3. Make sure the server is running in the `frontend` folder
4. Verify `isc-gem-cat.csv` exists in the same folder

### The App Shows a CORS Error Message

If you see a red error screen, it means you opened the HTML file directly. Follow the instructions on the error screen to start the HTTP server properly.

## 📁 Project Structure

```
frontend/
├── index.html              # Main HTML file (single-page app)
├── app.js                  # Core application logic
├── components.js           # UI component generators
├── navigation.js           # Hash-based routing
├── utils.js                # CSV parser, calculations
├── styles.css              # Custom styling
├── isc-gem-cat.csv         # Earthquake data (1904-2021)
├── start-server.bat        # Windows server launcher
├── start-server.sh         # macOS/Linux server launcher
├── README.md               # This file
├── README_MACOS.md         # macOS-specific instructions
└── public/                 # Static assets (Bootstrap, plugins)
```

## 🛠️ Tech Stack

- **HTML5** - Structure and content
- **CSS3** - Styling (Tailwind CSS + Bootstrap via CDN)
- **Vanilla JavaScript** - Application logic (no frameworks!)
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **Bootstrap 3** - UI components
- **jQuery** - DOM manipulation

**No npm install required!** All dependencies load from CDN.

## 📚 Features & Sections

1. **Aim** - Learning objectives
2. **Theory** - Seismology concepts and background
3. **Pre-Test** - Assessment quiz (5 questions)
4. **Procedure** - Step-by-step guide
5. **Simulation** - Interactive earthquake analysis
   - Interactive map with earthquake markers
   - Gutenberg-Richter plot
   - Depth distribution analysis
   - Temporal analysis
   - Magnitude histogram
6. **Post-Test** - Assessment quiz (5 questions)
7. **References** - Citations and resources

## 🎯 How to Use the App

1. Start the HTTP server (see Quick Start above)
2. Open http://localhost:8000 in your browser
3. Navigate using the left sidebar
4. Go to **Simulation** section
5. Set search parameters:
   - Latitude/Longitude
   - Search radius (km)
   - Magnitude range
   - Date range
6. Click **Search Earthquakes**
7. Explore results in map and charts

## 🔑 Key Functions

### utils.js
- `parseISCGEMCSV()` - Parse CSV earthquake data
- `filterEarthquakes()` - Filter by location, magnitude, date
- `calculateGRValues()` - Gutenberg-Richter analysis
- `calculateLinearRegression()` - Statistical trend lines

### app.js
- `initializeApp()` - Initialize application
- `loadCSVData()` - Load earthquake catalog
- `initializeMap()` - Setup Leaflet map
- `searchEarthquakes()` - Execute search with filters
- `updateCharts()` - Render all visualizations

### components.js
- `createAppUI()` - Generate main interface
- `createQuizUI()` - Generate quiz sections

### navigation.js
- `initializeNavigation()` - Setup hash-based routing
- `activateSection()` - Handle section switching

## 📊 Data Source

**ISC-GEM Global Instrumental Earthquake Catalogue (1904-2021)**
- Source: International Seismological Centre
- Coverage: Global, Magnitude ≥ 5.5
- Format: CSV
- Fields: Date, Time, Location, Magnitude, Depth, etc.

## 🌐 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note:** Requires JavaScript enabled and modern browser support for ES6+.

## 💡 Why Use an HTTP Server?

Modern browsers enforce **Same-Origin Policy** and **CORS** (Cross-Origin Resource Sharing) security:

- ❌ `file://` protocol: Blocks loading external resources (CSV, JSON, etc.)
- ✅ `http://` protocol: Allows loading resources from same origin

**Even for local development, always use an HTTP server!**

## 📝 Development Notes

- No build process required
- No package.json or node_modules
- All dependencies via CDN
- Pure vanilla JavaScript (ES6+)
- Hash-based routing (no server-side routing needed)
- Works entirely client-side

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Use HTTP server, not file:// |
| CSV not loading | Check server is in `frontend` folder |
| Port in use | Try different port (8080, 3000, etc.) |
| Blank page | Check browser console for errors |
| Map not showing | Check internet connection (Leaflet CDN) |

## 📖 Additional Resources

- [README_MACOS.md](README_MACOS.md) - Detailed macOS setup guide
- [ISC-GEM Catalogue](http://www.isc.ac.uk/iscgem/) - Data source documentation

## 📧 Support

For issues or questions, check:
1. Browser console (F12)
2. README_MACOS.md for macOS-specific help
3. Verify all files are in place
4. Ensure HTTP server is running

---

**Happy Analyzing! 🌍📈**
