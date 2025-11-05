// seismicity-app/frontend/src/components/MapComponent.js

import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create a custom icon for the center marker
const centerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to handle map clicks and update center position
const DraggableCenter = ({ position, setPosition, onPositionChange }) => {
  const [dragging, setDragging] = useState(false);

  const map = useMapEvents({
    click(e) {
      if (!dragging) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        if (onPositionChange) {
          onPositionChange(newPos);
        }
      }
    }
  });

  const markerRef = React.useRef(null);

  const eventHandlers = {
    dragstart: () => {
      setDragging(true);
    },
    dragend: () => {
      setDragging(false);
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        const newPosition = [newPos.lat, newPos.lng];
        setPosition(newPosition);
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
      }
    }
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={centerIcon}
    >
      <Popup>
        <div className="text-gray-800">
          <strong>Search Center</strong><br/>
          Lat: {position[0].toFixed(4)}<br/>
          Lon: {position[1].toFixed(4)}<br/>
          <span className="text-xs text-gray-600">Drag to move or click map</span>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ data = [], center, searchRadius = 500, onCenterChange }) => {
  // Ensure center coordinates are numbers
  const normalizedCenter = center ? [parseFloat(center[0]), parseFloat(center[1])] : [20, 0];
  
  const [mapCenter, setMapCenter] = useState(normalizedCenter);
  const [mapType, setMapType] = useState('terrain'); // 'terrain', 'satellite', or 'street'
  const position = mapCenter;
  const zoom = center ? 5 : 2;
  const radiusInMeters = (searchRadius || 500) * 1000; // Convert km to meters

  const handlePositionChange = useCallback((newPosition) => {
    setMapCenter(newPosition);
    if (onCenterChange) {
      onCenterChange(newPosition);
    }
  }, [onCenterChange]);

  // Update internal state when prop changes
  React.useEffect(() => {
    if (center) {
      const normalized = [parseFloat(center[0]), parseFloat(center[1])];
      setMapCenter(normalized);
    }
  }, [center]);

  // Map tile configurations
  const mapTiles = {
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
      maxZoom: 17
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    },
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  };

  // Function to determine color based on magnitude
  const getColorByMagnitude = (magnitude) => {
    if (magnitude >= 7) return '#ff0000'; // Red for major earthquakes
    if (magnitude >= 6) return '#ff4500'; // Orange-red for strong earthquakes
    if (magnitude >= 5) return '#ff8c00'; // Orange for moderate earthquakes
    if (magnitude >= 4) return '#ffd700'; // Gold for light earthquakes
    if (magnitude >= 3) return '#9acd32'; // Yellow-green for minor earthquakes
    return '#32cd32'; // Green for very minor earthquakes
  };

  // Function to determine radius based on magnitude
  const getRadiusByMagnitude = (magnitude) => {
    return Math.max(3, magnitude * 3); // Minimum radius of 3, scales with magnitude
  };

  // Function to get intensity description
  const getIntensityDescription = (magnitude) => {
    if (magnitude >= 7) return 'Major';
    if (magnitude >= 6) return 'Strong';
    if (magnitude >= 5) return 'Moderate';
    if (magnitude >= 4) return 'Light';
    if (magnitude >= 3) return 'Minor';
    return 'Very Minor';
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-secondary-700" style={{ position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        {/* Dynamic Map Layer based on selection */}
        <TileLayer
          key={mapType}
          attribution={mapTiles[mapType].attribution}
          url={mapTiles[mapType].url}
          maxZoom={mapTiles[mapType].maxZoom}
        />

        {/* Draggable center marker */}
        <DraggableCenter 
          position={position} 
          setPosition={setMapCenter}
          onPositionChange={handlePositionChange}
        />

        {/* Search region circle boundary */}
        <Circle
          center={position}
          radius={radiusInMeters}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5'
          }}
        />
        {data && Array.isArray(data) && data.map((earthquake, index) => {
          const magnitude = earthquake.properties.mag;
          const coordinates = earthquake.geometry.coordinates;

          return (
            <CircleMarker
              key={index}
              center={[coordinates[1], coordinates[0]]}
              radius={getRadiusByMagnitude(magnitude)}
              pathOptions={{
                color: getColorByMagnitude(magnitude),
                fillColor: getColorByMagnitude(magnitude),
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-gray-800">
                  <h3 className="font-bold text-lg mb-2">
                    Magnitude: {magnitude} ({getIntensityDescription(magnitude)})
                  </h3>
                  <p className="mb-1"><strong>Location:</strong> {earthquake.properties.place}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(earthquake.properties.time).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Time:</strong> {new Date(earthquake.properties.time).toLocaleTimeString()}</p>
                  <p className="mb-1"><strong>Depth:</strong> {coordinates[2]} km</p>
                  <p className="mb-1"><strong>Coordinates:</strong> {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}</p>
                  {earthquake.properties.tsunami && (
                    <p className="text-red-600 font-bold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Tsunami Warning
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Instructions Banner - Minimal */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-md shadow-md text-xs z-[1000] border border-slate-700/50">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Click map or drag marker to reposition search center</span>
        </div>
      </div>

      {/* Map Type Selector - Bottom Left - Minimal */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-md shadow-md border border-slate-700/50 z-[1000] overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setMapType('terrain')}
            className={`px-3 py-2 text-xs transition-all border-r border-slate-700/50 ${
              mapType === 'terrain' 
                ? 'bg-slate-600 text-white font-medium' 
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
            title="Terrain View"
          >
            Terrain
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-2 text-xs transition-all border-r border-slate-700/50 ${
              mapType === 'satellite' 
                ? 'bg-slate-600 text-white font-medium' 
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
            title="Satellite View"
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('street')}
            className={`px-3 py-2 text-xs transition-all ${
              mapType === 'street' 
                ? 'bg-slate-600 text-white font-medium' 
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
            title="Street View"
          >
            Street
          </button>
        </div>
      </div>

      {/* Legend - Minimal */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm p-3 rounded-md text-slate-200 text-xs shadow-md border border-slate-700/50 z-[1000]">
        <h4 className="font-semibold mb-2 text-slate-100">Magnitude Scale</h4>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#32cd32'}}></div>
            <span className="text-slate-300">&lt; 3.0</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#9acd32'}}></div>
            <span className="text-slate-300">3.0 - 3.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ffd700'}}></div>
            <span className="text-slate-300">4.0 - 4.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ff8c00'}}></div>
            <span className="text-slate-300">5.0 - 5.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ff4500'}}></div>
            <span className="text-slate-300">6.0 - 6.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ff0000'}}></div>
            <span className="text-slate-300">≥ 7.0</span>
          </div>
        </div>
      </div>

      {/* Current Position Display - Top Right - Minimal */}
      <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm p-3 rounded-md text-slate-200 text-xs shadow-md border border-slate-700/50 z-[1000]">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 mr-2">Lat:</span>
            <span className="font-medium">{position[0].toFixed(4)}°</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 mr-2">Lon:</span>
            <span className="font-medium">{position[1].toFixed(4)}°</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-700/50 pt-1 mt-1">
            <span className="text-slate-400 mr-2">Radius:</span>
            <span className="font-medium">{searchRadius} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Educational content component for map explanation
export const MapEducationalContent = () => (
  <div className="space-y-4 mt-6">
    {/* What the Map Shows */}
    <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
      <h4 className="font-bold text-slate-800 mb-3 text-lg">
        Understanding the Interactive Map
      </h4>
      <div className="space-y-3">
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Circle Markers</h5>
          <p className="text-sm text-slate-600">
            Each colored circle represents one earthquake. 
            The color indicates magnitude intensity (green=minor, red=major), 
            and the size scales with magnitude (larger circles = stronger earthquakes).
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Search Radius</h5>
          <p className="text-sm text-slate-600">
            The dashed blue circle shows your search area. 
            Only earthquakes within this radius from your center point are displayed.
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Click for Details</h5>
          <p className="text-sm text-slate-600">
            Click any marker to see a popup with detailed information: 
            magnitude, location, date/time, depth, and coordinates.
          </p>
        </div>
      </div>
    </div>

    {/* Geographic Patterns */}
    <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
      <h4 className="font-bold text-slate-800 mb-3 text-lg">
        Reading Spatial Patterns
      </h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        The geographic distribution of earthquakes reveals underlying tectonic structures:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Linear Patterns</h5>
          <p className="text-xs text-slate-600">
            Earthquakes aligned in straight lines or curves often mark active faults. 
            Examples: San Andreas Fault (California), North Anatolian Fault (Turkey).
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Clustering</h5>
          <p className="text-xs text-slate-600">
            Tight clusters may indicate aftershock sequences, swarms, or volcanic activity. 
            Can also reveal complex fault networks.
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Ring Patterns</h5>
          <p className="text-xs text-slate-600">
            Circular distributions around a center point may indicate calderas, 
            volcanic systems, or mining-induced seismicity.
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Offshore Events</h5>
          <p className="text-xs text-slate-600">
            Ocean-based earthquakes mark subduction zones, mid-ocean ridges, 
            or transform faults. Higher tsunami risk.
          </p>
        </div>
      </div>
    </div>

    {/* Plate Boundaries */}
    <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
      <h4 className="font-bold text-slate-800 mb-3 text-lg">
        Earthquake Geography &amp; Plate Tectonics
      </h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        Approximately 90% of earthquakes occur at tectonic plate boundaries where 
        plates interact. The type of boundary determines earthquake characteristics:
      </p>
      <div className="space-y-2">
        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="font-semibold text-slate-700">Convergent Boundaries (Subduction)</div>
          <p className="text-xs text-slate-600">
            Plates collide. Most powerful earthquakes (M9.0+). Deep quakes possible. 
            Examples: Pacific Ring of Fire, Himalayas, Andes.
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="font-semibold text-slate-700">Transform Boundaries (Strike-Slip)</div>
          <p className="text-xs text-slate-600">
            Plates slide past each other horizontally. Moderate to large earthquakes, all shallow. 
            Examples: San Andreas (California), Alpine Fault (New Zealand).
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="font-semibold text-slate-700">Divergent Boundaries (Rifts)</div>
          <p className="text-xs text-slate-600">
            Plates move apart. Smaller, shallow earthquakes, frequent volcanic activity. 
            Examples: Mid-Atlantic Ridge, East African Rift.
          </p>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="font-semibold text-slate-700">Intraplate (Interior)</div>
          <p className="text-xs text-slate-600">
            Within plates, away from boundaries. Less frequent but can be powerful. 
            Examples: New Madrid (Missouri), Australian interior.
          </p>
        </div>
      </div>
    </div>

    {/* Distance and Impact */}
    <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
      <h4 className="font-bold text-slate-800 mb-3 text-lg">
        Distance &amp; Ground Shaking
      </h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        The intensity of shaking you feel depends on both 
        earthquake magnitude and your distance from the epicenter:
      </p>
      <div className="bg-white p-4 rounded border border-slate-200 mb-3">
        <p className="text-center text-lg font-mono text-slate-700 mb-2">
          Intensity ∝ Magnitude / Distance²
        </p>
        <p className="text-xs text-slate-600 text-center">
          (Simplified - actual attenuation is more complex)
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Near-Field (&lt;50 km)</h5>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Strong, short-duration high-frequency shaking</li>
            <li>• Potential for surface rupture</li>
            <li>• Most structural damage occurs here</li>
          </ul>
        </div>
        <div className="bg-white p-3 rounded border border-slate-200">
          <h5 className="font-semibold text-slate-700 mb-1">Far-Field (&gt;50 km)</h5>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Longer-period, rolling motions</li>
            <li>• Affects tall buildings more</li>
            <li>• Large earthquakes felt 100s of km away</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Using the Map */}
    <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
      <h4 className="font-bold text-slate-800 mb-3 text-lg">
        Tips for Map Exploration
      </h4>
      <ul className="text-sm text-slate-600 space-y-2">
        <li className="flex items-start">
          <span><strong>Zoom in/out:</strong> Use mouse wheel or +/- buttons to change scale</span>
        </li>
        <li className="flex items-start">
          <span><strong>Pan around:</strong> Click and drag to move the map</span>
        </li>
        <li className="flex items-start">
          <span><strong>Look for patterns:</strong> Can you identify fault lines or plate boundaries?</span>
        </li>
        <li className="flex items-start">
          <span><strong>Compare regions:</strong> Try different areas to see variation in seismicity</span>
        </li>
        <li className="flex items-start">
          <span><strong>Check details:</strong> Click markers to learn about individual events</span>
        </li>
      </ul>
    </div>
  </div>
);

export default MapComponent;