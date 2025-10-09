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
          <div className="text-4xl mb-4">🏔️</div>
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

      {/* Geological Context */}
      <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl">
        <h4 className="font-bold text-orange-400 mb-2">🏔️ Geological Context</h4>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong className="text-red-300">Shallow (0-10km):</strong> Often the most damaging, typically crustal earthquakes</p>
          <p><strong className="text-orange-300">Crustal (10-35km):</strong> Most common tectonic earthquakes in continental crust</p>
          <p><strong className="text-yellow-300">Intermediate (35-70km):</strong> Lower crust and upper mantle events</p>
          <p><strong className="text-green-300">Deep (70-300km):</strong> Subduction zone earthquakes, less surface damage</p>
          <p><strong className="text-blue-300">Very Deep (300km+):</strong> Deep subduction earthquakes, minimal surface impact</p>
        </div>
      </div>
    </div>
  );
};

export default DepthDistributionChart;