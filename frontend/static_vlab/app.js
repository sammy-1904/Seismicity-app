// app.js - Main logic for the static VLab
(function(){
  const CSV_PATH = '/isc-gem-cat.csv'; // same as original app

  let allEarthquakes = [];
  let map, markersLayer, searchCircle;
  let grChart, magChart;

  function $(id){ return document.getElementById(id); }

  async function loadCSV(){
    try{
      const res = await fetch(CSV_PATH);
      if (!res.ok) throw new Error('Failed to fetch CSV: ' + res.status);
      const text = await res.text();
      allEarthquakes = window.VLabUtils.parseISCGEMCSV(text);
      $('summary').textContent = `Loaded ${allEarthquakes.length} events from CSV`;
    }catch(err){
      console.error(err);
      $('summary').textContent = 'Failed to load CSV. Check server logs and path /isc-gem-cat.csv';
    }
  }

  function initMap(){
    map = L.map('map').setView([36.17, -115.14], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  function clearMarkers(){ markersLayer.clearLayers(); if (searchCircle) { map.removeLayer(searchCircle); searchCircle=null; } }

  function plotEarthquakes(eqList, center, radiusKm){
    clearMarkers();
    if (!eqList || eqList.length===0) return;
    eqList.forEach(eq => {
      const [lon, lat, depth] = eq.geometry.coordinates;
      const mag = eq.properties.mag;
      const marker = L.circleMarker([lat, lon], {
        radius: Math.max(3, mag*1.5),
        color: mag>=6 ? '#b91c1c' : mag>=5 ? '#f97316' : '#2563eb',
        fillOpacity: 0.6
      }).bindPopup(`<strong>${eq.properties.place}</strong><br/>M ${mag.toFixed(1)}<br/>Depth: ${depth} km`);
      markersLayer.addLayer(marker);
    });
    // draw search circle
    if (center && radiusKm){
      const [lat, lon] = center;
      searchCircle = L.circle([lat, lon], { radius: radiusKm*1000, color: '#2563eb', weight: 1, fill:false });
      searchCircle.addTo(map);
      // fit bounds
      const bounds = searchCircle.getBounds();
      map.fitBounds(bounds, { maxZoom: 8 });
    }
  }

  function initCharts(){
    const grCtx = $('grChart').getContext('2d');
    grChart = new Chart(grCtx, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'log10(cumulative)', data: [], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension:0.1 }] },
      options: { scales: { x: { title: { display:true, text: 'Magnitude' } }, y: { title: { display:true, text: 'log10(cumulative)' } } } }
    });

    const magCtx = $('magChart').getContext('2d');
    magChart = new Chart(magCtx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Count', data: [], backgroundColor: '#2563eb' }] },
      options: { scales: { x: { title: { display:true, text: 'Magnitude bin' } }, y: { title: { display:true, text: 'Count' } } } }
    });
  }

  function updateGRChart(grData){
    if (!grData || grData.length===0){ grChart.data.labels=[]; grChart.data.datasets[0].data=[]; grChart.update(); return; }
    grChart.data.labels = grData.map(d => d.magnitude.toFixed(1));
    grChart.data.datasets[0].data = grData.map(d => d.frequency.toFixed(3));
    grChart.update();
  }

  function updateMagChart(eqList){
    if (!eqList) eqList = [];
    const bins = {}; // 0.1 bins keyed by toFixed(1)
    eqList.forEach(eq => {
      const mag = Math.floor(eq.properties.mag*10)/10;
      const key = mag.toFixed(1);
      bins[key] = (bins[key]||0)+1;
    });
    const labels = Object.keys(bins).sort((a,b)=>parseFloat(a)-parseFloat(b));
    const data = labels.map(l=>bins[l]);
    magChart.data.labels = labels;
    magChart.data.datasets[0].data = data;
    magChart.update();
  }

  function onSearch(){
    const latitude = $('latitude').value;
    const longitude = $('longitude').value;
    const maxradiuskm = $('radius').value;
    const minmagnitude = $('minmag').value;
    const starttime = $('startdate').value;
    const endtime = $('enddate').value;

    if (!latitude||!longitude||!maxradiuskm||!minmagnitude||!starttime||!endtime){ alert('Fill all parameters'); return; }

    const filters = { latitude, longitude, maxradiuskm, minmagnitude, starttime, endtime };
    const results = window.VLabUtils.filterEarthquakes(allEarthquakes, filters);
    $('summary').textContent = `Found ${results.length} events (out of ${allEarthquakes.length})`;
    plotEarthquakes(results, [parseFloat(latitude), parseFloat(longitude)], parseFloat(maxradiuskm));

    // GR and magnitude plots
    if (results.length>0){
      const mags = results.map(r=>r.properties.mag);
      const gr = window.VLabUtils.calculateGRValues(mags);
      updateGRChart(gr);
      updateMagChart(results);
    } else {
      updateGRChart([]);
      updateMagChart([]);
      alert('No earthquakes found with the current search parameters. Try increasing the radius or date range.');
    }
  }

  function attachHandlers(){
    $('searchBtn').addEventListener('click', onSearch);
  }

  // Initialize everything
  function init(){
    initMap();
    initCharts();
    attachHandlers();
    loadCSV();
  }

  window.addEventListener('DOMContentLoaded', init);

})();
