Static VLab (No-React, CDN-only)
================================

What this is
------------
This folder contains a self-contained static version of the Virtual Seismology Lab that does not require Node, npm or React. All CSS and JS dependencies are loaded from CDNs. The page expects the ISC-GEM CSV available at `/isc-gem-cat.csv` (same behaviour as the original React app).

Files
-----
- `index.html` — entry page (uses Tailwind CDN, Leaflet CDN, Chart.js CDN)
- `utils.js` — CSV parsing, filtering, Haversine distance, Gutenberg–Richter calculations
- `app.js` — UI wiring, map and charts initialization

How to use
----------
1. Copy the `static_vlab` folder to the server root (or point your server to serve this folder).
2. Ensure `/isc-gem-cat.csv` is reachable by the page (same folder as original app's public files).
3. Open `index.html` in a browser. No build step required.

Notes & limitations
-------------------
- This implementation intentionally avoids React and bundlers. It uses plain JavaScript and lightweight logic replicated from the original app.
- Tailwind is used via the official CDN script — it works with limited features and uses in-browser generation.
- The UI is simplified compared to the React app. All essential functionality (search, map, G-R and magnitude plots) is preserved.

If you want, I can further reduce dependencies (e.g., use a very small charting library) or add CSV path configuration.
