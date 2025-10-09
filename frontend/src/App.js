// seismicity-app/frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from './components/MapComponent';
import GutenbergRichterGraph from './components/GutenbergRichterGraph';
import DepthDistributionChart from './components/DepthDistributionChart';
import TemporalAnalysis from './components/TemporalAnalysis';
import MagnitudeDistribution from './components/MagnitudeDistribution';
import { calculateGRValues } from './utils/grCalculator';

function App() {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [grData, setGrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [input, setInput] = useState({
    latitude: 36.1699,
    longitude: -115.1398,
    maxradiuskm: 500,
    minmagnitude: 2.5,
    starttime: '2020-01-01',
    endtime: '2021-01-01',
  });

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/earthquakes', {
        params: input,
      });
      const fetchedData = response.data.features;
      setEarthquakeData(fetchedData);

      // Process data for the Gutenberg-Richter graph
      const grPlotData = calculateGRValues(fetchedData.map(d => d.properties.mag));
      setGrData(grPlotData);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to fetch data. Please check the console for more details.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            🌍 Seismicity & Gutenberg-Richter Analysis
          </h1>
          <p className="text-center text-gray-300 mt-2">Real-time earthquake data visualization and statistical analysis</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Input Form */}
          <div className="xl:w-1/3">
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 sticky top-32">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-teal-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-semibold text-teal-400">Search Parameters</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">📍 Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={input.latitude}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">📍 Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={input.longitude}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">🎯 Radius (km)</label>
                    <input
                      type="number"
                      name="maxradiuskm"
                      value={input.maxradiuskm}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Search radius"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">📊 Min. Magnitude</label>
                    <input
                      type="number"
                      step="0.1"
                      name="minmagnitude"
                      value={input.minmagnitude}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                      placeholder="Minimum magnitude"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">📅 Start Date</label>
                    <input
                      type="date"
                      name="starttime"
                      value={input.starttime}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">📅 End Date</label>
                    <input
                      type="date"
                      name="endtime"
                      value={input.endtime}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={fetchData}
                className={`w-full mt-8 p-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Fetching Data...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    🔍 Fetch Earthquake Data
                  </div>
                )}
              </button>

              {/* Data Summary */}
              {earthquakeData.length > 0 && (
                <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">{earthquakeData.length}</div>
                    <div className="text-sm text-gray-300">Earthquakes Found</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visualizations */}
          <div className="xl:w-2/3 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 p-4 border-b border-gray-700/50">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'map', label: '🗺️ Map', color: 'blue' },
                    { id: 'gutenberg', label: '📈 G-R Plot', color: 'purple' },
                    { id: 'depth', label: '🏔️ Depth', color: 'orange' },
                    { id: 'temporal', label: '📅 Timeline', color: 'green' },
                    { id: 'magnitude', label: '📊 Magnitude', color: 'red' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-500 text-white shadow-lg`
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'map' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-semibold text-blue-400">Interactive Earthquake Map</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Geographical visualization of seismic activity with intensity markers and search region boundary</p>
                    <MapComponent
                      data={earthquakeData}
                      center={[input.latitude, input.longitude]}
                      searchRadius={input.maxradiuskm}
                    />
                  </div>
                )}

                {activeTab === 'gutenberg' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-semibold text-purple-400">Gutenberg-Richter Analysis</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Statistical relationship between earthquake magnitude and frequency with linear regression analysis</p>
                    <GutenbergRichterGraph data={grData} />
                  </div>
                )}

                {activeTab === 'depth' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-semibold text-orange-400">Depth Distribution Analysis</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Distribution of earthquakes by depth categories and geological context</p>
                    <DepthDistributionChart data={earthquakeData} />
                  </div>
                )}

                {activeTab === 'temporal' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-semibold text-green-400">Temporal Analysis</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Time-based patterns, daily activity timeline, and hourly distribution of seismic events</p>
                    <TemporalAnalysis data={earthquakeData} />
                  </div>
                )}

                {activeTab === 'magnitude' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-semibold text-red-400">Magnitude Distribution</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Frequency distribution of earthquake magnitudes with energy analysis and statistical measures</p>
                    <MagnitudeDistribution data={earthquakeData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;