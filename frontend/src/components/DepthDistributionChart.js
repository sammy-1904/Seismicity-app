// seismicity-app/frontend/src/components/DepthDistributionChart.js

import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DepthDistributionChart = ({ data }) => {
  const depthAnalysis = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // Define depth bins
    const bins = [
      { label: '0-10km (Shallow)', min: 0, max: 10, color: '#ef4444' },
      { label: '10-35km (Crustal)', min: 10, max: 35, color: '#f97316' },
      { label: '35-70km (Intermediate)', min: 35, max: 70, color: '#eab308' },
      { label: '70-300km (Deep)', min: 70, max: 300, color: '#22c55e' },
      { label: '300km+ (Very Deep)', min: 300, max: Infinity, color: '#3b82f6' }
    ];

    const binCounts = bins.map(bin => ({
      ...bin,
      count: data.filter(eq => {
        const depth = eq.geometry.coordinates[2];
        return depth >= bin.min && depth < bin.max;
      }).length,
      earthquakes: data.filter(eq => {
        const depth = eq.geometry.coordinates[2];
        return depth >= bin.min && depth < bin.max;
      })
    }));

    const totalCount = data.length;
    const avgDepth = data.reduce((sum, eq) => sum + eq.geometry.coordinates[2], 0) / totalCount;
    const maxDepth = Math.max(...data.map(eq => eq.geometry.coordinates[2]));
    const minDepth = Math.min(...data.map(eq => eq.geometry.coordinates[2]));

    return {
      binCounts,
      totalCount,
      avgDepth,
      maxDepth,
      minDepth
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f3f4f6',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const binData = depthAnalysis.binCounts[context.dataIndex];
            const percentage = ((binData.count / depthAnalysis.totalCount) * 100).toFixed(1);
            return [
              `Count: ${binData.count} earthquakes`,
              `Percentage: ${percentage}%`,
              `Depth Range: ${binData.label}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Depth Categories',
          color: '#e5e7eb',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          color: '#d1d5db',
          font: { size: 10 },
          maxRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Earthquakes',
          color: '#e5e7eb',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          color: '#d1d5db',
          font: { size: 10 }
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)'
        }
      }
    }
  };

  const chartData = {
    labels: depthAnalysis?.binCounts.map(bin => bin.label.split(' ')[0]) || [],
    datasets: [{
      data: depthAnalysis?.binCounts.map(bin => bin.count) || [],
      backgroundColor: depthAnalysis?.binCounts.map(bin => bin.color + '80') || [],
      borderColor: depthAnalysis?.binCounts.map(bin => bin.color) || [],
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false
    }]
  };

  if (!depthAnalysis || depthAnalysis.totalCount === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-2xl font-semibold mb-4">Depth Analysis</div>
          <p className="text-lg">No depth data available</p>
          <p className="text-sm">Fetch earthquake data to analyze depth distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Average Depth</div>
          <div className="text-2xl font-bold text-blue-400">
            {depthAnalysis.avgDepth.toFixed(1)}km
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Deepest Event</div>
          <div className="text-2xl font-bold text-green-400">
            {depthAnalysis.maxDepth.toFixed(1)}km
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Shallowest Event</div>
          <div className="text-2xl font-bold text-red-400">
            {depthAnalysis.minDepth.toFixed(1)}km
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Total Events</div>
          <div className="text-2xl font-bold text-teal-400">
            {depthAnalysis.totalCount}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
        <Bar options={chartOptions} data={chartData} />
      </div>

      {/* Depth Categories Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depthAnalysis.binCounts.map((bin, index) => (
          <div key={index} className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30">
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded mr-3"
                style={{ backgroundColor: bin.color }}
              ></div>
              <div className="font-semibold text-gray-200">{bin.label}</div>
            </div>
            <div className="text-2xl font-bold" style={{ color: bin.color }}>
              {bin.count}
            </div>
            <div className="text-sm text-gray-400">
              {((bin.count / depthAnalysis.totalCount) * 100).toFixed(1)}% of total
            </div>
          </div>
        ))}
      </div>

      {/* Educational Content */}
      <div className="space-y-4">
        {/* What is Being Displayed */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">
            What This Chart Shows
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            This histogram displays the depth distribution of earthquake hypocenters 
            (focal points where rupture begins). Depth is measured from Earth's surface downward in kilometers.
          </p>
          <div className="bg-white p-4 rounded border border-slate-200">
            <h5 className="font-semibold text-slate-700 mb-2">How Depth is Determined:</h5>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
              <li><strong>Seismic Waves:</strong> P-waves and S-waves arrive at different times at seismograph stations</li>
              <li><strong>Travel Time:</strong> Wave arrival time differences reveal distance from each station</li>
              <li><strong>Triangulation:</strong> Multiple stations allow 3D location (latitude, longitude, depth)</li>
              <li><strong>Uncertainty:</strong> Shallow events typically have ±5-10km depth uncertainty</li>
            </ol>
          </div>
        </div>

        {/* Earth's Internal Structure */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">
            Earth's Layered Structure
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Earthquake depth reveals which part of Earth's interior is rupturing:
          </p>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-700">Crust (0-35km)</span>
                <span className="text-xs text-slate-500">Continental: 30-70km, Oceanic: 5-10km</span>
              </div>
              <p className="text-xs text-slate-600">Brittle fracture zone. Most damaging earthquakes occur here due to proximity to surface.</p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-700">Upper Mantle (35-70km)</span>
                <span className="text-xs text-slate-500">Lithosphere base</span>
              </div>
              <p className="text-xs text-slate-600">Transition zone where rocks become more plastic. Less common earthquake location.</p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-700">Deep Upper Mantle (70-300km)</span>
                <span className="text-xs text-slate-500">Wadati-Benioff Zone</span>
              </div>
              <p className="text-xs text-slate-600">Subducting oceanic plates. Cold, dense slab allows brittle fracture at great depth.</p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-700">Lower Mantle (300-660km)</span>
                <span className="text-xs text-slate-500">Deepest earthquakes</span>
              </div>
              <p className="text-xs text-slate-600">Rare events in deeply subducted slabs. Phase transformations may trigger rupture.</p>
            </div>
          </div>
        </div>

        {/* Why Depth Matters */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">
            Impact of Earthquake Depth
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-2">Shallow (0-10km)</h5>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• <strong>Most Destructive:</strong> Energy concentrated near surface</li>
                <li>• <strong>Strong Shaking:</strong> High-frequency waves cause severe damage</li>
                <li>• <strong>Surface Rupture:</strong> Visible fault scarps and ground deformation</li>
                <li>• <strong>Tsunami Risk:</strong> Submarine shallow quakes can displace water</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-2">Deep (70-300km+)</h5>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• <strong>Less Damaging:</strong> Energy dissipates over long distance</li>
                <li>• <strong>Broader Impact:</strong> Felt over wider area but weaker</li>
                <li>• <strong>Low Frequency:</strong> Longer-period waves, less structural damage</li>
                <li>• <strong>No Tsunami:</strong> Too deep to displace ocean water</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tectonic Context */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">
            Depth and Tectonic Setting
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Depth distribution reveals the type of tectonic environment:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Mid-Ocean Ridges</div>
              <div className="text-xs text-slate-600">Shallow (0-15km). Divergent boundaries where plates separate. Oceanic crust formation.</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Continental Faults</div>
              <div className="text-xs text-slate-600">Shallow-Moderate (0-35km). Strike-slip or normal faults. Crustal earthquakes only.</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Subduction Zones</div>
              <div className="text-xs text-slate-600">All depths (0-700km). Descending oceanic plate. Creates dipping plane of earthquakes.</div>
            </div>
          </div>
        </div>

        {/* The Wadati-Benioff Zone */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">
            Deep Earthquakes: The Wadati-Benioff Zone
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Deep earthquakes (greater than 70km) only occur in subduction zones where 
            cold oceanic lithosphere descends into the hot mantle:
          </p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Temperature Paradox:</strong> Normal mantle is too hot for brittle fracture, but cold slab remains brittle</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Phase Changes:</strong> Mineral transformations at depth may trigger instabilities</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span><strong className="text-indigo-300">Dehydration:</strong> Water release from metamorphic reactions weakens rocks</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span><strong className="text-indigo-300">Deepest Limit:</strong> ~700km maximum depth where rocks become too ductile</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepthDistributionChart;