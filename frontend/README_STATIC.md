# Seismicity App - Standalone HTML Version

## ✅ No Server Required!

This version of the Seismicity App has been converted to work as a **standalone HTML application** that can be opened directly in your web browser without needing to run a local server.

## 🚀 Quick Start

### First Time Setup

1. **Convert CSV Data to JavaScript** (one-time only):
   ```bash
   python convert-csv-to-js.py
   ```
   
   This will create `earthquake-data.js` from the CSV file (~74,000 earthquakes)

2. **Open the App**:
   - **Option 1**: Double-click `START_HERE.html` and click the launch button
   - **Option 2**: Double-click `index.html` directly
   - **Option 3**: Right-click `index.html` → Open With → Your browser

That's it! The app will load with all earthquake data embedded.

## 📁 Required Files

Make sure these files are in the same folder:

```
frontend/
├── index.html              # Main application (open this!)
├── START_HERE.html         # Welcome page with instructions
├── earthquake-data.js      # Generated data file (created by convert script)
├── app.js                  # Application logic
├── utils.js                # Utility functions
├── components.js           # UI components
├── navigation.js           # Navigation handler
├── styles.css              # Styles
├── convert-csv-to-js.py    # Conversion script
└── isc-gem-cat.csv         # Original data (source)
```

## 🍎 macOS Users

**Opening the file:**
1. Locate `index.html` in Finder
2. Right-click → Open With → Your preferred browser
3. Or drag `index.html` onto your browser icon

**Regenerating data (if needed):**
```bash
cd /path/to/frontend
python3 convert-csv-to-js.py
```

## 🪟 Windows Users

**Opening the file:**
1. Navigate to the frontend folder
2. Double-click `index.html`
3. It will open in your default browser

**Regenerating data (if needed):**
```powershell
cd C:\path\to\frontend
python convert-csv-to-js.py
```

## 🐧 Linux Users

**Opening the file:**
```bash
cd /path/to/frontend
xdg-open index.html
# Or
firefox index.html
# Or
google-chrome index.html
```

**Regenerating data:**
```bash
python3 convert-csv-to-js.py
```

## 🔧 How It Works

### The Conversion Process

The original app used `fetch()` to load CSV data, which doesn't work with the `file://` protocol due to browser security (CORS). 

**Solution:** The `convert-csv-to-js.py` script:
1. Reads the ISC-GEM earthquake CSV file
2. Parses ~74,000 earthquake records
3. Creates a JavaScript file with embedded data
4. Compresses data by using short property names

### Technical Changes

**Before (required server):**
```javascript
const response = await fetch('isc-gem-cat.csv');
const csvText = await response.text();
const parsedData = parseISCGEMCSV(csvText);
```

**After (works standalone):**
```javascript
// earthquake-data.js is loaded in HTML
const earthquakes = EARTHQUAKE_DATA.map(eq => ({
  // Convert compact format to full format
  properties: { mag: eq.m, depth: eq.d, ... },
  geometry: { coordinates: [eq.lo, eq.la, eq.d] }
}));
```

## 📊 Data Format

The embedded data uses a compact format to reduce file size:

```javascript
{
  dt: "1904-04-04 10:02:34.56",  // datetime
  la: 41.802,                     // latitude
  lo: 23.108,                     // longitude
  d: 15.0,                        // depth (km)
  m: 6.84                         // magnitude (Mw)
}
```

## 🔄 Updating Data

If you get a new version of the ISC-GEM catalogue:

1. Replace `isc-gem-cat.csv` with the new file
2. Run the conversion script:
   ```bash
   python convert-csv-to-js.py
   ```
3. Refresh your browser to see updated data

## 📦 File Sizes

- `isc-gem-cat.csv`: ~19 MB (original data)
- `earthquake-data.js`: ~8 MB (compressed JavaScript)
- Total app size: ~9 MB (with all files)

The JavaScript file is larger than the CSV but browsers handle it efficiently with compression.

## 🌐 Browser Compatibility

Works with modern browsers:
- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

## ⚡ Performance

- **Initial Load**: 2-4 seconds (loading embedded data)
- **Map Rendering**: < 1 second (for typical queries)
- **Filtering**: Real-time (uses efficient algorithms)

## 🐛 Troubleshooting

### Error: "Earthquake data not loaded"

**Solution**: Run the conversion script to create `earthquake-data.js`:
```bash
python convert-csv-to-js.py
```

### Blank page or nothing loads

**Check:**
1. All required files are in the same folder
2. `earthquake-data.js` exists and is not empty
3. Browser console for error messages (F12)
4. Try a different browser

### Data seems outdated

**Solution**: Regenerate the JavaScript data file:
```bash
python convert-csv-to-js.py
```

## 🔐 Security Notes

- All data is local - no external data loaded
- CDN resources used: Tailwind CSS, Leaflet, Chart.js (from trusted sources)
- Safe to use offline (after initial CDN resource download)

## 📚 Additional Resources

- **Original CSV Data**: ISC-GEM Global Earthquake Catalogue
- **Leaflet Docs**: https://leafletjs.com/
- **Chart.js Docs**: https://www.chartjs.org/

## 🎯 Features

This standalone version includes all original features:
- ✅ Interactive earthquake map
- ✅ Magnitude-frequency analysis (Gutenberg-Richter)
- ✅ Depth distribution charts
- ✅ Temporal analysis
- ✅ Custom search regions
- ✅ Export capabilities
- ✅ Pre and post-tests
- ✅ Theory and procedures

## 💡 Tips

1. **Bookmark it**: Add `index.html` to browser bookmarks for quick access
2. **Keep backup**: Save a copy of `earthquake-data.js` after generation
3. **Share**: You can zip the entire folder and share with others
4. **Offline**: Works completely offline after first load (CDN resources cached)

## 🆘 Support

If you encounter issues:

1. Check browser console (F12 → Console tab)
2. Verify all files are present
3. Try regenerating `earthquake-data.js`
4. Test in a different browser
5. Check the original README.md for app usage

---

**Enjoy exploring global seismicity without server hassles! 🌍📊**
