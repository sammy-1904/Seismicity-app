// CSV Parser for ISC-GEM Earthquake Catalogue
// Parses the CSV format and converts to GeoJSON-like structure for compatibility

export const parseISCGEMCSV = (csvText) => {
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

      // Convert to GeoJSON-like format (compatible with existing components)
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
};

// Filter earthquakes based on user criteria
export const filterEarthquakes = (earthquakes, filters) => {
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

    // Check distance from center point
    const distance = calculateDistance(centerLat, centerLon, eqLat, eqLon);
    if (distance > radiusKm) return false;

    return true;
  });
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};
