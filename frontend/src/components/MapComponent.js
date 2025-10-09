// seismicity-app/frontend/src/components/MapComponent.js

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ data, center, searchRadius }) => {
  const position = center || [20, 0];
  const zoom = center ? 5 : 2;
  const radiusInMeters = (searchRadius || 500) * 1000; // Convert km to meters

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
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Search region circle boundary */}
        {center && (
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
        )}
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
                    <p className="text-red-600 font-bold">⚠️ Tsunami Warning</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg text-gray-800 text-sm shadow-lg border border-gray-300">
        <h4 className="font-bold mb-2">Magnitude Scale</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#32cd32'}}></div>
            <span>&lt; 3.0 Very Minor</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#9acd32'}}></div>
            <span>3.0 - 3.9 Minor</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#ffd700'}}></div>
            <span>4.0 - 4.9 Light</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#ff8c00'}}></div>
            <span>5.0 - 5.9 Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#ff4500'}}></div>
            <span>6.0 - 6.9 Strong</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#ff0000'}}></div>
            <span>7.0+ Major</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;