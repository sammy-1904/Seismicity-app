# 🌍 Seismicity Analysis App - Standalone Version

## ✨ No Server Required!

This app has been designed to work **completely standalone** - just double-click and run!

## 🚀 Quick Start

### **All Platforms (Windows/Mac/Linux)**

1. **Double-click `index.html`** or **`OPEN_ME.html`** in your file explorer
2. Your default browser will open the app
3. That's it! Start analyzing earthquake data

### Alternative Methods

**Option 1: Drag and Drop**
- Drag `index.html` into your browser window

**Option 2: From Browser**
- Open your browser
- Press `Ctrl+O` (Windows/Linux) or `Cmd+O` (Mac)
- Navigate to the folder and select `index.html`

**Option 3: Right-Click Menu**
- Right-click on `index.html`
- Select "Open With" → Your preferred browser

## 📋 Features

- ✅ **No installation** - works immediately
- ✅ **No server required** - all data is embedded
- ✅ **Works offline** - once libraries are cached
- ✅ **Cross-platform** - Windows, Mac, Linux
- ✅ **Interactive maps** - powered by Leaflet
- ✅ **Data visualization** - with Chart.js
- ✅ **74,000+ earthquakes** - from ISC-GEM catalog (1904-2021)

## 🔧 How It Works

The app uses:
- **Embedded data**: All earthquake data is pre-loaded in `earthquake-data.js`
- **CDN libraries**: External JavaScript libraries loaded from CDNs (requires internet on first load)
- **Pure HTML/CSS/JS**: No server-side processing needed

## 📦 What's Included

```
frontend/
├── OPEN_ME.html          # 👈 START HERE - Friendly launcher
├── index.html            # Main application
├── app.js                # Application logic
├── components.js         # UI components
├── utils.js              # Utility functions
├── earthquake-data.js    # 74,159 earthquakes (embedded)
├── styles.css            # Styling
└── navigation.js         # Navigation handling
```

## 🌐 Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

## 📱 macOS Specific Instructions

### Method 1: Double-Click (Recommended)
1. Navigate to the `frontend` folder in Finder
2. Double-click `index.html` or `OPEN_ME.html`
3. Safari will open automatically

### Method 2: From Safari
1. Open Safari
2. Press `Cmd+O`
3. Navigate to `frontend/index.html`
4. Click "Open"

### Method 3: Drag to Browser
1. Open Safari (or any browser)
2. Drag `index.html` from Finder to the browser window

## 💡 Tips

### Create a Desktop Shortcut (Mac)
1. Open `frontend` folder in Finder
2. Right-click on `index.html`
3. Select "Make Alias"
4. Rename to "Seismicity App"
5. Drag the alias to your Desktop or Dock

### Bookmark It
1. Open the app in your browser
2. Press `Cmd+D` (Mac) or `Ctrl+D` (Windows)
3. Save bookmark for easy access

### Set Default Browser
If clicking `index.html` opens the wrong browser:
1. Right-click on `index.html`
2. Select "Get Info" (Mac) or "Properties" (Windows)
3. Change "Open with:" to your preferred browser
4. Click "Change All..." to apply to all HTML files

## ❓ FAQ

**Q: Do I need Python installed?**  
A: No! The old instructions mentioned Python servers, but this standalone version doesn't need them.

**Q: Do I need an internet connection?**  
A: Only for the first load (to download libraries from CDNs). After that, it works offline if your browser has cached the libraries.

**Q: Why do the old README files mention servers?**  
A: This app was originally designed to load CSV files, which required a server. We've converted it to use embedded JavaScript data instead.

**Q: Can I copy this to a USB drive?**  
A: Yes! Copy the entire `frontend` folder to any device and it will work.

**Q: The app shows a blank page, what's wrong?**  
A: Make sure you're opening `index.html`, not a random file. Also check your browser's JavaScript is enabled.

**Q: Can I use this offline?**  
A: Yes, but you need internet the first time to load external libraries (Leaflet, Chart.js, etc.). After that, if your browser caches them, it works fully offline.

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console (F12) for errors |
| Maps not showing | Ensure internet connection for first load |
| Data not loading | Make sure `earthquake-data.js` is in the same folder |
| Wrong browser opens | Set default browser in file properties |

## 📊 Data Source

- **Catalog**: ISC-GEM Global Instrumental Earthquake Catalogue
- **Time Period**: 1904-2021
- **Events**: 74,159 earthquakes
- **Magnitude**: ≥ 5.0
- **Source**: International Seismological Centre

## 🎯 What You Can Do

1. **View earthquakes on interactive map**
2. **Filter by magnitude, depth, date range**
3. **Analyze temporal patterns**
4. **View depth distributions**
5. **Export filtered data**
6. **Take pre/post tests**
7. **Read educational materials**

## 📝 Notes

- The old files (`start-server.bat`, `start-server.sh`) are **not needed** anymore
- `README_MACOS.md` has outdated server instructions - **ignore it**
- All earthquake data is already embedded in `earthquake-data.js`
- No CSV files are loaded at runtime

## 🎉 Enjoy!

You're all set! Just double-click and start exploring global seismicity patterns.

---

**Version**: Standalone (No Server Required)  
**Last Updated**: November 2025
