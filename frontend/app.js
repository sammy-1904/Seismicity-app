// app.js - Main application logic

// Global variables
let allEarthquakes = [];
let filteredEarthquakes = [];
let map = null;
let earthquakeLayer = null;
let searchCircle = null;
let centerMarker = null;
let charts = {
  gr: null,
  depth: null,
  temporal: null,
  magnitude: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Seismicity Analysis App...');
  
  // Render app UI
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.innerHTML = createAppUI();
    initializeApp();
  }
  
  // Initialize quizzes
  const pretestDiv = document.getElementById('pretest-quiz');
  if (pretestDiv) {
    pretestDiv.innerHTML = createQuizUI('pretest');
    handleQuizSubmit('pretest', 'pretest-form');
  }
  
  const posttestDiv = document.getElementById('posttest-quiz');
  if (posttestDiv) {
    posttestDiv.innerHTML = createQuizUI('posttest');
    handleQuizSubmit('posttest', 'posttest-form');
  }
});

/**
 * Initialize the application
 */
async function initializeApp() {
  // Load CSV data
  await loadCSVData();
  
  // Initialize map
  initializeMap();
  
  // Setup event listeners
  setupEventListeners();
}

/**
 * Load CSV earthquake data
 */
async function loadCSVData() {
  const csvLoading = document.getElementById('csv-loading');
  const mainContent = document.getElementById('main-content');
  
  try {
    const response = await fetch('isc-gem-cat.csv');
    const csvText = await response.text();
    const parsedData = parseISCGEMCSV(csvText);
    allEarthquakes = parsedData.features;
    
    console.log(`Loaded ${allEarthquakes.length} earthquakes from CSV`);
    
    // Show main content
    csvLoading.style.display = 'none';
    mainContent.style.display = 'block';
    
  } catch (error) {
    console.error('Failed to load CSV data:', error);
    csvLoading.innerHTML = `
      <div class="text-red-500">
        <i class="fa fa-exclamation-triangle fa-3x"></i>
        <p class="mt-4 text-lg">Failed to load earthquake data</p>
        <p class="text-sm">Please check the console for more details</p>
      </div>
    `;
  }
}

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  
  // Create map
  map = L.map('map').setView([latitude, longitude], 5);
  
  // Expose map globally for navigation.js
  window.map = map;
  
  // Add tile layer
  updateMapTiles('terrain');
  
  // Create layer for earthquakes
  earthquakeLayer = L.layerGroup().addTo(map);
  
  // Add center marker
  const centerIcon = L.divIcon({
    className: 'custom-center-marker',
    html: '<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  centerMarker = L.marker([latitude, longitude], {
    icon: centerIcon,
    draggable: true
  }).addTo(map);
  
  centerMarker.bindPopup(`
    <div style="color: #333;">
      <strong>Search Center</strong><br/>
      Lat: ${latitude.toFixed(4)}<br/>
      Lon: ${longitude.toFixed(4)}<br/>
      <span style="font-size: 0.85em; color: #666;">Drag to move or click map</span>
    </div>
  `);
  
  // Update inputs when marker is dragged
  centerMarker.on('dragend', (e) => {
    const position = e.target.getLatLng();
    document.getElementById('latitude').value = position.lat.toFixed(2);
    document.getElementById('longitude').value = position.lng.toFixed(2);
    updateSearchCircle();
  });
  
  // Update center when map is clicked
  map.on('click', (e) => {
    document.getElementById('latitude').value = e.latlng.lat.toFixed(2);
    document.getElementById('longitude').value = e.latlng.lng.toFixed(2);
    centerMarker.setLatLng(e.latlng);
    updateSearchCircle();
  });
  
  // Add search circle
  updateSearchCircle();
}

/**
 * Update map tile layer
 */
function updateMapTiles(type) {
  // Remove existing tile layers
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });
  
  let tileUrl, attribution;
  
  switch(type) {
    case 'satellite':
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
      break;
    case 'street':
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      break;
    case 'terrain':
    default:
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>';
  }
  
  L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 17
  }).addTo(map);
}

/**
 * Update search circle on map
 */
function updateSearchCircle() {
  const lat = parseFloat(document.getElementById('latitude').value);
  const lon = parseFloat(document.getElementById('longitude').value);
  const radius = parseFloat(document.getElementById('maxradiuskm').value) * 1000; // Convert to meters
  
  if (searchCircle) {
    map.removeLayer(searchCircle);
  }
  
  searchCircle = L.circle([lat, lon], {
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.1,
    radius: radius
  }).addTo(map);
  
  // Update marker position if it exists
  if (centerMarker) {
    centerMarker.setLatLng([lat, lon]);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search button
  document.getElementById('search-btn').addEventListener('click', handleSearch);
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });
  
  // Map type radio buttons
  document.querySelectorAll('input[name="mapType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateMapTiles(e.target.value);
    });
  });
  
  // Update search circle when radius changes
  document.getElementById('maxradiuskm').addEventListener('input', updateSearchCircle);
  
  // Update center marker when lat/lon inputs change
  document.getElementById('latitude').addEventListener('change', () => {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    centerMarker.setLatLng([lat, lon]);
    map.setView([lat, lon]);
    updateSearchCircle();
  });
  
  document.getElementById('longitude').addEventListener('change', () => {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    centerMarker.setLatLng([lat, lon]);
    map.setView([lat, lon]);
    updateSearchCircle();
  });
}

/**
 * Handle search button click
 */
function handleSearch() {
  const loadingIndicator = document.getElementById('loading-indicator');
  const resultsSummary = document.getElementById('results-summary');
  
  // Get search parameters
  const filters = {
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    maxradiuskm: document.getElementById('maxradiuskm').value,
    minmagnitude: document.getElementById('minmagnitude').value,
    starttime: document.getElementById('starttime').value,
    endtime: document.getElementById('endtime').value
  };
  
  // Validate inputs
  if (!filters.latitude || !filters.longitude || !filters.maxradiuskm || 
      !filters.minmagnitude || !filters.starttime || !filters.endtime) {
    alert('Please fill in all search parameters');
    return;
  }
  
  // Show loading
  loadingIndicator.style.display = 'inline';
  
  setTimeout(() => {
    try {
      // Filter earthquakes
      filteredEarthquakes = filterEarthquakes(allEarthquakes, filters);
      
      console.log(`Found ${filteredEarthquakes.length} earthquakes matching criteria`);
      
      // Update UI
      document.getElementById('results-count').textContent = filteredEarthquakes.length;
      resultsSummary.style.display = 'block';
      
      // Update visualizations
      updateMap();
      updateCharts();
      
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please check your parameters and try again.');
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }, 100);
}

/**
 * Update map with filtered earthquakes
 */
function updateMap() {
  // Clear existing earthquakes
  earthquakeLayer.clearLayers();
  
  // Add earthquake markers
  filteredEarthquakes.forEach(eq => {
    const [lon, lat] = eq.geometry.coordinates;
    const mag = eq.properties.mag;
    const depth = eq.properties.depth;
    const time = new Date(eq.properties.time).toLocaleDateString();
    
    const circle = L.circleMarker([lat, lon], {
      radius: getMagnitudeRadius(mag),
      fillColor: getMagnitudeColor(mag),
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    });
    
    circle.bindPopup(`
      <div style="color: #333;">
        <strong>M ${mag.toFixed(1)}</strong><br/>
        <strong>Date:</strong> ${time}<br/>
        <strong>Depth:</strong> ${depth.toFixed(1)} km<br/>
        <strong>Location:</strong> ${lat.toFixed(2)}°, ${lon.toFixed(2)}°
      </div>
    `);
    
    earthquakeLayer.addLayer(circle);
  });
}

/**
 * Update all charts
 */
function updateCharts() {
  updateGRChart();
  updateDepthChart();
  updateTemporalChart();
  updateMagnitudeChart();
}

/**
 * Update Gutenberg-Richter chart
 */
function updateGRChart() {
  const magnitudes = filteredEarthquakes.map(eq => eq.properties.mag);
  const grData = calculateGRValues(magnitudes);
  
  if (grData.length === 0) {
    return;
  }
  
  // Calculate regression
  const regression = calculateLinearRegression(grData);
  const correlation = calculateCorrelation(grData);
  
  // Update stats
  const statsDiv = document.getElementById('gr-stats');
  if (regression) {
    const bValue = Math.abs(regression.slope);
    const aValue = regression.intercept;
    
    statsDiv.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-gray-400">b-value</p>
          <p class="text-2xl font-bold text-blue-400">${bValue.toFixed(3)}</p>
        </div>
        <div>
          <p class="text-sm text-gray-400">a-value</p>
          <p class="text-2xl font-bold text-blue-400">${aValue.toFixed(2)}</p>
        </div>
        <div>
          <p class="text-sm text-gray-400">Correlation (R)</p>
          <p class="text-2xl font-bold text-blue-400">${correlation.toFixed(3)}</p>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-400">
        Equation: log₁₀(N) = ${aValue.toFixed(2)} - ${bValue.toFixed(3)}M
      </div>
    `;
  }
  
  // Generate trend line data
  let trendLineData = [];
  if (regression) {
    const minX = Math.min(...grData.map(p => p.magnitude));
    const maxX = Math.max(...grData.map(p => p.magnitude));
    trendLineData = [
      { x: minX, y: regression.slope * minX + regression.intercept },
      { x: maxX, y: regression.slope * maxX + regression.intercept }
    ];
  }
  
  // Destroy existing chart
  if (charts.gr) {
    charts.gr.destroy();
  }
  
  // Create chart
  const ctx = document.getElementById('gr-chart').getContext('2d');
  charts.gr = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Observed Data',
          data: grData,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          pointRadius: 5
        },
        {
          label: 'Trend Line',
          data: trendLineData,
          type: 'line',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e5e7eb' }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f3f4f6',
          bodyColor: '#e5e7eb'
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Magnitude (M)',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        },
        y: {
          title: {
            display: true,
            text: 'Log₁₀(N)',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        }
      }
    }
  });
}

/**
 * Update depth distribution chart
 */
function updateDepthChart() {
  const depths = filteredEarthquakes.map(eq => eq.properties.depth);
  
  // Create bins
  const bins = [0, 70, 150, 300, 500, 700];
  const binLabels = ['0-70', '70-150', '150-300', '300-500', '500-700'];
  const binCounts = new Array(binLabels.length).fill(0);
  
  depths.forEach(depth => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (depth >= bins[i] && depth < bins[i + 1]) {
        binCounts[i]++;
        break;
      }
    }
  });
  
  // Destroy existing chart
  if (charts.depth) {
    charts.depth.destroy();
  }
  
  // Create chart
  const ctx = document.getElementById('depth-chart').getContext('2d');
  charts.depth = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: binLabels,
      datasets: [{
        label: 'Number of Earthquakes',
        data: binCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e5e7eb' }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f3f4f6',
          bodyColor: '#e5e7eb'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Depth Range (km)',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        },
        y: {
          title: {
            display: true,
            text: 'Frequency',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        }
      }
    }
  });
}

/**
 * Update temporal analysis chart
 */
function updateTemporalChart() {
  // Group by year
  const yearCounts = {};
  
  filteredEarthquakes.forEach(eq => {
    const year = new Date(eq.properties.time).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  
  const years = Object.keys(yearCounts).sort();
  const counts = years.map(year => yearCounts[year]);
  
  // Destroy existing chart
  if (charts.temporal) {
    charts.temporal.destroy();
  }
  
  // Create chart
  const ctx = document.getElementById('temporal-chart').getContext('2d');
  charts.temporal = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Earthquakes per Year',
        data: counts,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e5e7eb' }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f3f4f6',
          bodyColor: '#e5e7eb'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
            color: '#e5e7eb'
          },
          ticks: { 
            color: '#9ca3af',
            maxRotation: 45,
            minRotation: 45
          },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Earthquakes',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        }
      }
    }
  });
}

/**
 * Update magnitude distribution chart
 */
function updateMagnitudeChart() {
  const magnitudes = filteredEarthquakes.map(eq => eq.properties.mag);
  
  // Create bins
  const minMag = Math.floor(Math.min(...magnitudes) * 2) / 2;
  const maxMag = Math.ceil(Math.max(...magnitudes) * 2) / 2;
  const binSize = 0.5;
  const bins = [];
  const binLabels = [];
  
  for (let m = minMag; m < maxMag; m += binSize) {
    bins.push(m);
    binLabels.push(`${m.toFixed(1)}-${(m + binSize).toFixed(1)}`);
  }
  
  const binCounts = new Array(bins.length).fill(0);
  
  magnitudes.forEach(mag => {
    const binIndex = Math.floor((mag - minMag) / binSize);
    if (binIndex >= 0 && binIndex < binCounts.length) {
      binCounts[binIndex]++;
    }
  });
  
  // Destroy existing chart
  if (charts.magnitude) {
    charts.magnitude.destroy();
  }
  
  // Create chart
  const ctx = document.getElementById('magnitude-chart').getContext('2d');
  charts.magnitude = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: binLabels,
      datasets: [{
        label: 'Number of Earthquakes',
        data: binCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e5e7eb' }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f3f4f6',
          bodyColor: '#e5e7eb'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Magnitude Range',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        },
        y: {
          title: {
            display: true,
            text: 'Frequency',
            color: '#e5e7eb'
          },
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.3)' }
        }
      }
    }
  });
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
  // Update button states
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });
  
  // Update tab content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });
  
  document.getElementById(`${tabName}-tab`).style.display = 'block';
  
  // Resize map if map tab is selected
  if (tabName === 'map' && map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }
}
