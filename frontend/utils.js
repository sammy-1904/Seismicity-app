// utils.js - Utility functions for CSV parsing and GR calculations

/**
 * Parse ISC-GEM CSV format
 * @param {string} csvText - Raw CSV text
 * @returns {object} Parsed earthquake data in GeoJSON-like format
 */
function parseISCGEMCSV(csvText) {
  const lines = csvText.split('\n');
  const earthquakes = [];

  for (let line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }

    // Skip the header line
    if (line.includes('date') && line.includes('lat') && line.includes('lon')) {
      continue;
    }

    // Parse data line
    const parts = line.split(',').map(p => p.trim());
    
    if (parts.length < 14) {
      continue; // Skip malformed lines
    }

    try {
      const dateTime = parts[0];
      const lat = parseFloat(parts[1]);
      const lon = parseFloat(parts[2]);
      const depth = parseFloat(parts[7]) || 0;
      const mw = parseFloat(parts[10]);

      // Skip if essential data is missing
      if (isNaN(lat) || isNaN(lon) || isNaN(mw)) {
        continue;
      }

      // Convert to GeoJSON-like format
      const earthquake = {
        type: 'Feature',
        properties: {
          mag: mw,
          place: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
          time: new Date(dateTime).getTime(),
          depth: depth,
          title: `M ${mw.toFixed(1)} - ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat, depth]
        },
        id: parts[parts.length - 1] || earthquakes.length
      };

      earthquakes.push(earthquake);
    } catch (error) {
      // Skip lines that can't be parsed
      continue;
    }
  }

  return {
    type: 'FeatureCollection',
    features: earthquakes,
    metadata: {
      count: earthquakes.length,
      title: 'ISC-GEM Earthquake Catalogue'
    }
  };
}

/**
 * Filter earthquakes based on search criteria
 * @param {Array} earthquakes - Array of earthquake features
 * @param {object} filters - Filter parameters
 * @returns {Array} Filtered earthquakes
 */
function filterEarthquakes(earthquakes, filters) {
  const {
    latitude,
    longitude,
    maxradiuskm,
    minmagnitude,
    starttime,
    endtime
  } = filters;

  const centerLat = parseFloat(latitude);
  const centerLon = parseFloat(longitude);
  const radiusKm = parseFloat(maxradiuskm);
  const minMag = parseFloat(minmagnitude);
  const startDate = new Date(starttime).getTime();
  const endDate = new Date(endtime).getTime();

  return earthquakes.filter(eq => {
    const [eqLon, eqLat] = eq.geometry.coordinates;
    const eqMag = eq.properties.mag;
    const eqTime = eq.properties.time;

    // Check magnitude
    if (eqMag < minMag) return false;

    // Check time range
    if (eqTime < startDate || eqTime > endDate) return false;

    // Calculate distance using Haversine formula
    const distance = calculateDistance(centerLat, centerLon, eqLat, eqLon);
    
    return distance <= radiusKm;
  });
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate Gutenberg-Richter values
 * @param {Array} magnitudes - Array of earthquake magnitudes
 * @returns {Array} GR data points
 */
function calculateGRValues(magnitudes) {
  if (!magnitudes || magnitudes.length === 0) {
    return [];
  }

  const grData = [];
  const minMag = Math.floor(Math.min(...magnitudes) * 10) / 10;
  const maxMag = Math.ceil(Math.max(...magnitudes) * 10) / 10;
  const step = 0.1;

  for (let m = minMag; m <= maxMag; m += step) {
    const cumulativeFrequency = magnitudes.filter(mag => mag >= m).length;

    if (cumulativeFrequency > 0) {
      grData.push({
        magnitude: parseFloat(m.toFixed(1)),
        frequency: Math.log10(cumulativeFrequency),
      });
    }
  }
  return grData;
}

/**
 * Calculate linear regression for trend line
 * @param {Array} data - Array of {magnitude, frequency} objects
 * @returns {object} Slope and intercept
 */
function calculateLinearRegression(data) {
  if (data.length < 2) return null;

  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.magnitude, 0);
  const sumY = data.reduce((sum, point) => sum + point.frequency, 0);
  const sumXY = data.reduce((sum, point) => sum + point.magnitude * point.frequency, 0);
  const sumX2 = data.reduce((sum, point) => sum + point.magnitude * point.magnitude, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Calculate correlation coefficient
 * @param {Array} data - Array of {magnitude, frequency} objects
 * @returns {number} Correlation coefficient
 */
function calculateCorrelation(data) {
  if (data.length < 2) return 0;

  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.magnitude, 0);
  const sumY = data.reduce((sum, point) => sum + point.frequency, 0);
  const sumXY = data.reduce((sum, point) => sum + point.magnitude * point.frequency, 0);
  const sumX2 = data.reduce((sum, point) => sum + point.magnitude * point.magnitude, 0);
  const sumY2 = data.reduce((sum, point) => sum + point.frequency * point.frequency, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Get magnitude color based on value
 * @param {number} mag - Magnitude value
 * @returns {string} Color code
 */
function getMagnitudeColor(mag) {
  if (mag >= 8.0) return '#800026';
  if (mag >= 7.0) return '#BD0026';
  if (mag >= 6.0) return '#E31A1C';
  if (mag >= 5.5) return '#FC4E2A';
  if (mag >= 5.0) return '#FD8D3C';
  return '#FEB24C';
}

/**
 * Get radius based on magnitude
 * @param {number} mag - Magnitude value
 * @returns {number} Radius in pixels
 */
function getMagnitudeRadius(mag) {
  return Math.pow(2, mag - 4) * 2;
}
