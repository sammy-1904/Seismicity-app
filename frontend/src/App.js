// seismicity-app/frontend/src/App.js

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MapComponent, { MapEducationalContent } from './components/MapComponent';
import GutenbergRichterGraph from './components/GutenbergRichterGraph';
import DepthDistributionChart from './components/DepthDistributionChart';
import TemporalAnalysis from './components/TemporalAnalysis';
import MagnitudeDistribution from './components/MagnitudeDistribution';
import { calculateGRValues } from './utils/grCalculator';
import { parseISCGEMCSV, filterEarthquakes } from './utils/csvParser';

function App() {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [allEarthquakes, setAllEarthquakes] = useState([]);
  const [grData, setGrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [input, setInput] = useState({
    latitude: 36.1699,
    longitude: -115.1398,
    maxradiuskm: 500,
    minmagnitude: 5.0,
    starttime: '1904-01-01',
    endtime: '2021-12-31',
  });

  // Load CSV data on component mount
  useEffect(() => {
    const loadCSVData = async () => {
      setCsvLoading(true);
      try {
        const response = await fetch('/isc-gem-cat.csv');
        const csvText = await response.text();
        const parsedData = parseISCGEMCSV(csvText);
        setAllEarthquakes(parsedData.features);
        console.log(`Loaded ${parsedData.features.length} earthquakes from CSV`);
      } catch (error) {
        console.error('Failed to load CSV data:', error);
        alert('Failed to load earthquake data from CSV file. Please check the console for more details.');
      }
      setCsvLoading(false);
    };

    loadCSVData();
  }, []);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle date changes from DatePicker
  const handleDateChange = (date, fieldName) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setInput({ ...input, [fieldName]: formattedDate });
    }
  };

  // Handle map center changes from dragging/clicking
  const handleCenterChange = (position) => {
    const [lat, lng] = position;
    setInput({ 
      ...input, 
      latitude: lat.toFixed(2), 
      longitude: lng.toFixed(2) 
    });
  };

  const fetchData = () => {
    // Validate inputs
    if (!input.latitude || !input.longitude || !input.maxradiuskm || !input.minmagnitude || !input.starttime || !input.endtime) {
      alert('Please fill in all search parameters');
      return;
    }

    console.log('=== SEARCH STARTED ===');
    console.log('Input params:', JSON.stringify(input, null, 2));
    console.log('Total earthquakes available:', allEarthquakes.length);
    
    setLoading(true);
    
    // Use setTimeout to ensure loading state is visible and allow React to update
    setTimeout(() => {
      try {
        // Ensure we have earthquake data loaded
        if (!allEarthquakes || allEarthquakes.length === 0) {
          console.error('No earthquake data loaded yet');
          alert('Earthquake data is still loading. Please wait...');
          setLoading(false);
          return;
        }

        // Create a fresh copy of input with proper types
        const searchParams = {
          latitude: parseFloat(input.latitude),
          longitude: parseFloat(input.longitude),
          maxradiuskm: parseFloat(input.maxradiuskm),
          minmagnitude: parseFloat(input.minmagnitude),
          starttime: input.starttime,
          endtime: input.endtime
        };

        console.log('Parsed search params:', searchParams);

        // Filter earthquakes based on user input
        const filteredData = filterEarthquakes(allEarthquakes, searchParams);
        console.log(`Filtered result: ${filteredData.length} earthquakes from ${allEarthquakes.length} total`);
        console.log('Sample filtered data:', filteredData.slice(0, 3));
        
        // Force complete re-render by updating refresh key
        const newRefreshKey = Date.now();
        setRefreshKey(newRefreshKey);
        console.log('Setting new refresh key:', newRefreshKey);
        
        // Force state update by creating new array
        setEarthquakeData([...filteredData]);

        // Process data for the Gutenberg-Richter graph
        if (filteredData.length > 0) {
          const grPlotData = calculateGRValues(filteredData.map(d => d.properties.mag));
          setGrData([...grPlotData]);
          console.log('G-R data updated:', grPlotData.length, 'points');
        } else {
          setGrData([]);
          console.warn('⚠️ No earthquakes found matching the criteria');
          alert('No earthquakes found with the current search parameters. Try increasing the radius or adjusting the date range.');
        }

        console.log('=== SEARCH COMPLETED ===');

      } catch (error) {
        console.error('Failed to filter data:', error);
        console.error('Error stack:', error.stack);
        alert('Failed to filter data: ' + error.message);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="bg-white text-slate-800" style={{padding: '20px', fontSize: '16px'}}>
      <div className="flex flex-col xl:flex-row gap-6">
          {/* Input Form */}
          <div className="xl:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-24">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Search Parameters</h2>
                <p className="text-sm text-slate-500 mt-1" style={{fontSize: '14px'}}>Configure earthquake search criteria</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={input.latitude}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="Enter latitude"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={input.longitude}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="Enter longitude"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      Search Radius (km)
                    </label>
                    <input
                      type="number"
                      name="maxradiuskm"
                      value={input.maxradiuskm}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="Radius"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      Min. Magnitude
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="minmagnitude"
                      value={input.minmagnitude}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="Min magnitude"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      Start Date
                    </label>
                    <DatePicker
                      selected={input.starttime ? new Date(input.starttime) : null}
                      onChange={(date) => handleDateChange(date, 'starttime')}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date('1904-01-01')}
                      maxDate={new Date('2021-12-31')}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      placeholderText="Select start date"
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      wrapperClassName="w-full"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600" style={{fontSize: '15px'}}>
                      End Date
                    </label>
                    <DatePicker
                      selected={input.endtime ? new Date(input.endtime) : null}
                      onChange={(date) => handleDateChange(date, 'endtime')}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date('1904-01-01')}
                      maxDate={new Date('2021-12-31')}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      placeholderText="Select end date"
                      className="w-full px-4 py-3 text-base rounded-md bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      wrapperClassName="w-full"
                      style={{fontSize: '15px'}}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log('Search button clicked');
                  fetchData();
                }}
                className={`w-full mt-5 px-5 py-3.5 rounded-md text-base font-medium transition-all ${
                  loading || csvLoading
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm'
                }`}
                style={{fontSize: '16px'}}
                disabled={loading || csvLoading}
              >
                {csvLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500 mr-2"></div>
                    Loading Data...
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Search Earthquakes'
                )}
              </button>

              {/* Data Summary */}
              {earthquakeData.length > 0 && (
                <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-md">
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-slate-800" style={{fontSize: '28px'}}>{earthquakeData.length}</div>
                    <div className="text-sm text-slate-600 mt-1" style={{fontSize: '15px'}}>Events Found</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visualizations */}
          <div className="xl:w-2/3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { 
                      id: 'map', 
                      label: 'Map View',
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      )
                    },
                    { 
                      id: 'gutenberg', 
                      label: 'G-R Analysis',
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'depth', 
                      label: 'Depth Analysis',
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )
                    },
                    { 
                      id: 'temporal', 
                      label: 'Time Analysis',
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'magnitude', 
                      label: 'Magnitude',
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )
                    }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                      style={{fontSize: '15px'}}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'map' && (
                  <div key={`map-${refreshKey}`}>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Interactive Earthquake Map</h2>
                      <p className="text-slate-500 text-sm mt-2" style={{fontSize: '15px'}}>Geographical visualization of seismic activity</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <MapComponent
                        key={`map-component-${refreshKey}`}
                        data={earthquakeData}
                        center={[input.latitude, input.longitude]}
                        searchRadius={input.maxradiuskm}
                        onCenterChange={handleCenterChange}
                      />
                    </div>
                    <MapEducationalContent />
                  </div>
                )}

                {activeTab === 'gutenberg' && (
                  <div key={`gr-${refreshKey}`}>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Gutenberg-Richter Analysis</h2>
                      <p className="text-slate-500 text-sm mt-2" style={{fontSize: '15px'}}>Frequency-magnitude relationship</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <GutenbergRichterGraph key={`gr-graph-${refreshKey}`} data={grData} />
                    </div>
                  </div>
                )}

                {activeTab === 'depth' && (
                  <div key={`depth-${refreshKey}`}>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Depth Distribution</h2>
                      <p className="text-slate-500 text-sm mt-2" style={{fontSize: '15px'}}>Earthquake depths and geological context</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <DepthDistributionChart key={`depth-chart-${refreshKey}`} data={earthquakeData} />
                    </div>
                  </div>
                )}

                {activeTab === 'temporal' && (
                  <div key={`temporal-${refreshKey}`}>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Temporal Analysis</h2>
                      <p className="text-slate-500 text-sm mt-2" style={{fontSize: '15px'}}>Time-based patterns and seismic trends</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <TemporalAnalysis key={`temporal-chart-${refreshKey}`} data={earthquakeData} />
                    </div>
                  </div>
                )}

                {activeTab === 'magnitude' && (
                  <div key={`magnitude-${refreshKey}`}>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold text-slate-800" style={{fontSize: '22px'}}>Magnitude Distribution</h2>
                      <p className="text-slate-500 text-sm mt-2" style={{fontSize: '15px'}}>Earthquake magnitude frequency analysis</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <MagnitudeDistribution key={`magnitude-chart-${refreshKey}`} data={earthquakeData} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;