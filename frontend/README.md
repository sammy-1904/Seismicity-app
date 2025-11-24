# Frontend - Seismicity Analysis App# Frontend - Seismicity Analysis App# Frontend - Seismicity Analysis App# Seismicity Analysis Web Application



Pure HTML/CSS/JavaScript earthquake analysis application.



## Run LocallyPure HTML/CSS/JavaScript earthquake analysis application. No frameworks, no build tools.



**Option 1: Python**

```bash

python -m http.server 8000## Run LocallyPure HTML/CSS/JavaScript earthquake analysis application.## Overview

```



**Option 2: Batch File**

```bash**Option 1: Python**This is a vanilla HTML/CSS/JavaScript web application for analyzing global seismicity patterns using the ISC-GEM Global Earthquake Catalogue (1904-2021).

start-server.bat

``````bash



**Option 3: Node.js**python -m http.server 8000## Run Locally

```bash

npx http-server -p 8000```

```

## Tech Stack

Then open: `http://localhost:8000`

**Option 2: Batch File**

## Files

```bash**Option 1: Python**- **HTML5** - Structure and content

| File | Description |

|------|-------------|start-server.bat

| `index.html` | Single-page app with all sections |

| `app.js` | Core logic, map, charts, data loading |``````bash- **CSS3** - Styling (with Tailwind CSS via CDN)

| `components.js` | UI component generators |

| `navigation.js` | Hash-based routing |

| `utils.js` | CSV parser, Gutenberg-Richter calculations |

| `styles.css` | Custom styling |**Option 3: Node.js**python -m http.server 8000- **Vanilla JavaScript** - Application logic

| `isc-gem-cat.csv` | Earthquake data (1904-2021) |

| `public/` | Bootstrap, plugins, images |```bash



## Dependencies (All via CDN)npx http-server -p 8000```- **Leaflet** (via CDN) - Interactive maps



- Tailwind CSS 3.x```

- Bootstrap 3.3.4

- Leaflet 1.9.4- **Chart.js** (via CDN) - Data visualization

- Chart.js 4.4.0

- jQuery 2.0.3Then open: `http://localhost:8000`

- Font Awesome 4.5.0

**Option 2: Batch File**- **Bootstrap 3** (via CDN) - UI components

**No npm install required!** Everything loads from CDN.

## Files

## Sections

```bash- **jQuery** (via CDN) - DOM manipulation

1. **Aim** - Learning objectives

2. **Theory** - Seismology concepts| File | Description |

3. **Pre-Test** - Quiz (5 questions)

4. **Procedure** - Step-by-step guide|------|-------------|start-server.bat

5. **Simulation** - Interactive analysis

6. **Post-Test** - Quiz (5 questions)| `index.html` | Single-page app with all sections |

7. **References** - Citations

| `app.js` | Core logic, map, charts, data loading |```## Project Structure

## Usage

| `components.js` | UI component generators |

1. Click sections in left sidebar to navigate

2. Go to **Simulation** section| `navigation.js` | Hash-based routing, sidebar navigation |```

3. Set search parameters (lat/lon, radius, magnitude, dates)

4. Click **Search Earthquakes**| `utils.js` | CSV parser, Gutenberg-Richter calculations |

5. View results in map and charts

| `styles.css` | Custom styling |**Option 3: Node.js**frontend/

## Key Functions

| `isc-gem-cat.csv` | Earthquake data (1904-2021) |

**utils.js**

- `parseISCGEMCSV()` - Parse CSV data| `public/` | Static assets (Bootstrap, plugins, images) |```bash├── index.html          # Main HTML file (all pages in one file)

- `filterEarthquakes()` - Filter by criteria

- `calculateGRValues()` - Gutenberg-Richter analysis

- `calculateLinearRegression()` - Trend lines

## Dependencies (All via CDN)npx http-server -p 8000├── app.js             # Main application logic

**app.js**

- `initializeApp()` - Initialize app

- `loadCSVData()` - Load earthquake data

- `initializeMap()` - Setup Leaflet map- **Tailwind CSS 3.x** - Utility styling```├── components.js      # UI component generators

- `handleSearch()` - Process search

- `updateMap()` - Update markers- **Bootstrap 3.3.4** - UI framework

- `updateCharts()` - Update visualizations

- **Leaflet 1.9.4** - Interactive maps├── navigation.js      # Navigation and routing logic

**navigation.js**

- Hash-based routing for sections- **Chart.js 4.4.0** - Data visualization

- Sidebar active state management

- **jQuery 2.0.3** - DOM manipulationThen open: `http://localhost:8000`├── utils.js           # Utility functions (CSV parser, GR calculator)

## Browser Requirements

- **Font Awesome 4.5.0** - Icons

Modern browser with ES6+ support (Chrome, Firefox, Edge, Safari).

├── styles.css         # Custom CSS styles

## Data Files

**No npm install required!** Everything loads from CDN.

- `isc-gem-cat.csv` - Main catalogue (40,000+ events)

- `isc-gem-suppl.csv` - Supplementary data (optional)## Files├── isc-gem-cat.csv    # Earthquake data (ISC-GEM catalogue)


## Sections

└── public/            # Static assets (Bootstrap, plugins, images)

1. **Aim** - Learning objectives

2. **Theory** - Seismology concepts- `index.html` - Single page containing all sections```

3. **Pre-Test** - Quiz (5 questions)

4. **Procedure** - Step-by-step guide- `app.js` - Core application logic, map, charts

5. **Simulation** - Interactive analysis with:

   - Interactive map- `components.js` - UI component generators## Features

   - Gutenberg-Richter plot

   - Depth distribution- `navigation.js` - Section navigation/routing1. **Aim** - Learning objectives and overview

   - Temporal analysis

   - Magnitude histogram- `utils.js` - CSV parsing, Gutenberg-Richter calculations2. **Theory** - Theoretical background on seismicity analysis

6. **Post-Test** - Quiz (5 questions)

7. **References** - Citations- `styles.css` - Custom styling3. **Pre-Test** - Knowledge assessment quiz



## Usage- `isc-gem-cat.csv` - Earthquake data (1904-2021)4. **Procedure** - Step-by-step usage guide



1. Click sections in left sidebar to navigate5. **Simulation** - Interactive earthquake analysis tool with:

2. Go to **Simulation** section

3. Set search parameters (lat/lon, radius, magnitude, dates)## Dependencies (CDN)   - Interactive map with customizable center and radius

4. Click **Search Earthquakes**

5. View results in map and charts   - Gutenberg-Richter relationship plotting



## Key FunctionsAll loaded from CDN - no npm install needed:   - Depth distribution analysis



**utils.js**- Tailwind CSS 3.x   - Temporal analysis (time series)

- `parseISCGEMCSV()` - Parse CSV data

- `filterEarthquakes()` - Filter by criteria- Bootstrap 3.3.4   - Magnitude distribution histogram

- `calculateGRValues()` - Gutenberg-Richter analysis

- `calculateLinearRegression()` - Trend line calculation- Leaflet 1.9.46. **Post-Test** - Knowledge assessment quiz



**app.js**- Chart.js 4.4.07. **References** - Citations and additional resources

- `initializeApp()` - Initialize application

- `loadCSVData()` - Load earthquake data- jQuery 2.0.3

- `initializeMap()` - Setup Leaflet map

- `handleSearch()` - Process search- Font Awesome 4.5.0## How to Run

- `updateMap()` - Update markers

- `updateCharts()` - Update visualizations



**navigation.js**## Usage### Option 1: Simple HTTP Server (Python)

- Hash-based routing for sections

- Sidebar active state management```bash



## Browser Requirements1. Click sections in left sidebar to navigatecd frontend



Modern browser with ES6+ support (Chrome, Firefox, Edge, Safari).2. Go to **Simulation** sectionpython -m http.server 8000



## Data Files3. Set search parameters (lat/lon, radius, magnitude, dates)```



- `isc-gem-cat.csv` - Main catalogue (40,000+ events)4. Click **Search Earthquakes**Then open http://localhost:8000 in your browser.

- `isc-gem-suppl.csv` - Supplementary data (optional)

5. View results in map and charts

### Option 2: Simple HTTP Server (Node.js)

## Browser Support```bash

cd frontend

Requires modern browser with ES6+ support (Chrome, Firefox, Edge, Safari).npx http-server -p 8000

```
Then open http://localhost:8000 in your browser.

### Option 3: Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Opening
Simply open `index.html` in your web browser. Note: Some features may not work due to CORS restrictions when loading CSV files.

## Data Files
Make sure the following CSV files are in the `frontend` directory:
- `isc-gem-cat.csv` - Main earthquake catalogue
- `isc-gem-suppl.csv` - Supplemental data (optional)

These files should be in the same directory as `index.html`.

## Dependencies (All via CDN)
All dependencies are loaded via CDN links in the HTML file:
- Tailwind CSS 3.x (via CDN)
- Bootstrap 3.3.4
- Font Awesome 4.5.0
- Leaflet 1.9.4
- Chart.js 4.4.0
- jQuery 2.0.3

**No npm install required!** The application runs entirely in the browser.

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Modern browsers with ES6+ support required.

## Usage Guide

### 1. Navigate Sections
Use the left sidebar to navigate between different sections:
- Click on any section name to view its content
- The active section is highlighted in blue

### 2. Run Simulations
1. Go to the "Simulation" section
2. Set search parameters:
   - Latitude and Longitude (or click on map)
   - Search radius in kilometers
   - Minimum magnitude
   - Date range
3. Click "Search Earthquakes"
4. View results in different tabs:
   - Map: Visual distribution
   - G-R Plot: Frequency-magnitude relationship
   - Depth Distribution: Earthquake depth analysis
   - Temporal Analysis: Time series
   - Magnitude Distribution: Histogram

### 3. Take Quizzes
- Pre-Test: Before learning
- Post-Test: After completing the simulation

## Key Functions

### utils.js
- `parseISCGEMCSV(csvText)` - Parse earthquake CSV data
- `filterEarthquakes(earthquakes, filters)` - Filter by criteria
- `calculateGRValues(magnitudes)` - Calculate G-R relationship
- `calculateLinearRegression(data)` - Linear regression for trend line
- `calculateDistance(lat1, lon1, lat2, lon2)` - Haversine distance

### components.js
- `createAppUI()` - Generate main application interface
- `createQuizUI(quizId)` - Generate quiz interface
- `handleQuizSubmit(quizId, formId)` - Handle quiz submissions

### app.js
- `initializeApp()` - Initialize application
- `loadCSVData()` - Load earthquake catalogue
- `initializeMap()` - Setup Leaflet map
- `handleSearch()` - Process search queries
- `updateMap()` - Update map markers
- `updateCharts()` - Update all visualizations
- `switchTab(tabName)` - Switch between visualization tabs

### navigation.js
- Hash-based routing for single-page navigation
- Sidebar active state management
- Breadcrumb updates

## Customization

### Change Default Search Location
Edit the default values in `components.js`:
```javascript
value="36.17"  // latitude
value="-115.14" // longitude
value="500"     // radius in km
```

### Modify Map Styles
Change tile layers in `app.js` function `updateMapTiles()`:
- terrain: OpenTopoMap
- satellite: Esri World Imagery
- street: OpenStreetMap

### Adjust Color Schemes
Modify `getMagnitudeColor()` in `utils.js` to change earthquake marker colors.

## Troubleshooting

### CSV File Not Loading
- Ensure `isc-gem-cat.csv` is in the same directory as `index.html`
- Use a local web server (not direct file:// protocol)
- Check browser console for CORS errors

### Map Not Displaying
- Check that Leaflet CSS and JS are loading from CDN
- Ensure div with id="map" exists
- Check browser console for errors

### Charts Not Rendering
- Verify Chart.js is loading from CDN
- Ensure canvas elements exist in HTML
- Check that data is being passed correctly

## License
MIT License - See LICENSE file for details

## Data Source
ISC-GEM Global Earthquake Catalogue
- Storchak, D.A., Di Giacomo, D., Bondár, I. et al. (2013)
- http://www.isc.ac.uk/iscgem/

## Author
Sameer Rawat

## Version
2.0.0 - Vanilla JavaScript version (no build tools)
