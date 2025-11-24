// utils.js - CSV parsing, filtering, distance and GR calculations (plain JS)

function toRad(deg){ return deg * (Math.PI/180); }

function haversineDistance(lat1, lon1, lat2, lon2){
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function parseISCGEMCSV(csvText){
  const lines = csvText.split(/\r?\n/);
  const earthquakes = [];
  for (let line of lines){
    if (!line) continue;
    if (line.trim().startsWith('#')) continue;
    // simple header detection
    if (line.toLowerCase().includes('date') && line.toLowerCase().includes('lat') && line.toLowerCase().includes('lon')) continue;
    const parts = line.split(',').map(p => p.trim());
    if (parts.length < 11) continue;
    try{
      const dateTime = parts[0];
      const lat = parseFloat(parts[1]);
      const lon = parseFloat(parts[2]);
      const depth = parseFloat(parts[7]) || 0;
      const mw = parseFloat(parts[10]);
      if (isNaN(lat) || isNaN(lon) || isNaN(mw)) continue;
      earthquakes.push({
        geometry: { coordinates: [lon, lat, depth] },
        properties: { mag: mw, time: new Date(dateTime).getTime(), place: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` }
      });
    }catch(e){ continue; }
  }
  return earthquakes;
}

function filterEarthquakes(earthquakes, filters){
  const { latitude, longitude, maxradiuskm, minmagnitude, starttime, endtime } = filters;
  const centerLat = parseFloat(latitude);
  const centerLon = parseFloat(longitude);
  const radiusKm = parseFloat(maxradiuskm);
  const minMag = parseFloat(minmagnitude);
  const startDate = new Date(starttime).getTime();
  const endDate = new Date(endtime).getTime();

  return earthquakes.filter(eq => {
    const [lon, lat] = eq.geometry.coordinates;
    const mag = eq.properties.mag;
    const time = eq.properties.time;
    if (mag < minMag) return false;
    if (time < startDate || time > endDate) return false;
    const dist = haversineDistance(centerLat, centerLon, lat, lon);
    if (dist > radiusKm) return false;
    return true;
  });
}

function calculateGRValues(magnitudes){
  if (!magnitudes || magnitudes.length === 0) return [];
  const gr = [];
  const minMag = Math.floor(Math.min(...magnitudes) * 10) / 10;
  const maxMag = Math.ceil(Math.max(...magnitudes) * 10) / 10;
  const step = 0.1;
  for (let m = minMag; m <= maxMag + 1e-9; m += step){
    const cum = magnitudes.filter(x => x >= m).length;
    if (cum > 0) gr.push({ magnitude: parseFloat(m.toFixed(1)), frequency: Math.log10(cum) });
  }
  return gr;
}

// Export to window for easy inclusion
window.VLabUtils = {
  parseISCGEMCSV,
  filterEarthquakes,
  calculateGRValues,
  haversineDistance
};
