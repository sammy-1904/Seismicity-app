// seismicity-app/frontend/src/components/TemporalAnalysis.js

import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

const TemporalAnalysis = ({ data }) => {
  const temporalAnalysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Sort earthquakes by time
    const sortedData = [...data].sort((a, b) => a.properties.time - b.properties.time);

    // Timeline data - group by day
    const dailyGroups = {};
    sortedData.forEach(eq => {
      const date = new Date(eq.properties.time);
      const dayKey = date.toISOString().split('T')[0];
      if (!dailyGroups[dayKey]) {
        dailyGroups[dayKey] = [];
      }
      dailyGroups[dayKey].push(eq);
    });

    const timelineData = Object.entries(dailyGroups).map(([date, earthquakes]) => ({
      x: date,
      y: earthquakes.length,
      maxMagnitude: Math.max(...earthquakes.map(eq => eq.properties.mag)),
      totalEnergy: earthquakes.reduce((sum, eq) => sum + Math.pow(10, 1.5 * eq.properties.mag + 9.1), 0)
    }));

    // Hourly pattern analysis
    const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
      const count = sortedData.filter(eq => {
        const date = new Date(eq.properties.time);
        return date.getUTCHours() === hour;
      }).length;
      return { hour, count };
    });

    // Major events (magnitude > 5.0)
    const majorEvents = sortedData.filter(eq => eq.properties.mag >= 5.0)
      .map(eq => ({
        time: eq.properties.time,
        magnitude: eq.properties.mag,
        location: eq.properties.place,
        depth: eq.geometry.coordinates[2]
      }));

    // Calculate some statistics
    const totalDays = Math.ceil((Math.max(...sortedData.map(eq => eq.properties.time)) -
                                Math.min(...sortedData.map(eq => eq.properties.time))) / (1000 * 60 * 60 * 24));
    const avgPerDay = sortedData.length / totalDays;
    const busiestDay = Object.entries(dailyGroups).reduce((max, [date, earthquakes]) =>
      earthquakes.length > max.count ? { date, count: earthquakes.length } : max, { date: null, count: 0 });

    return {
      timelineData,
      hourlyPattern,
      majorEvents,
      totalDays,
      avgPerDay,
      busiestDay,
      sortedData
    };
  }, [data]);

  const timelineOptions = {
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
            const point = temporalAnalysis.timelineData[context.dataIndex];
            return [
              `Date: ${point.x}`,
              `Earthquakes: ${point.y}`,
              `Max Magnitude: ${point.maxMagnitude.toFixed(1)}`,
              `Total Energy: ${point.totalEnergy.toExponential(2)} J`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM dd'
          }
        },
        title: {
          display: true,
          text: 'Date',
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
      },
      y: {
        title: {
          display: true,
          text: 'Daily Earthquake Count',
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

  const hourlyOptions = {
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
            const percentage = ((context.parsed.y / temporalAnalysis.sortedData.length) * 100).toFixed(1);
            return [
              `Hour: ${context.label}:00 UTC`,
              `Count: ${context.parsed.y} earthquakes`,
              `Percentage: ${percentage}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day (UTC)',
          color: '#e5e7eb',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          color: '#d1d5db',
          font: { size: 10 }
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

  const timelineChartData = {
    datasets: [{
      data: temporalAnalysis?.timelineData || [],
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
      pointBorderColor: 'rgba(59, 130, 246, 1)',
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
      fill: true,
      tension: 0.1
    }]
  };

  const hourlyChartData = {
    labels: temporalAnalysis?.hourlyPattern.map(h => h.hour.toString().padStart(2, '0')) || [],
    datasets: [{
      data: temporalAnalysis?.hourlyPattern.map(h => h.count) || [],
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      borderRadius: 4
    }]
  };

  if (!temporalAnalysis) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-lg">No temporal data available</p>
          <p className="text-sm">Fetch earthquake data to analyze temporal patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Time Span</div>
          <div className="text-2xl font-bold text-blue-400">
            {temporalAnalysis.totalDays} days
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Avg. per Day</div>
          <div className="text-2xl font-bold text-green-400">
            {temporalAnalysis.avgPerDay.toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Busiest Day</div>
          <div className="text-lg font-bold text-yellow-400">
            {temporalAnalysis.busiestDay.count} events
          </div>
          <div className="text-xs text-gray-400">
            {new Date(temporalAnalysis.busiestDay.date).toLocaleDateString()}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Major Events</div>
          <div className="text-2xl font-bold text-red-400">
            {temporalAnalysis.majorEvents.length}
          </div>
          <div className="text-xs text-gray-400">M ≥ 5.0</div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">📈 Daily Earthquake Activity</h3>
        <div className="h-64">
          <Line options={timelineOptions} data={timelineChartData} />
        </div>
      </div>

      {/* Hourly Pattern Chart */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">🕐 Hourly Distribution Pattern</h3>
        <div className="h-64">
          <Bar options={hourlyOptions} data={hourlyChartData} />
        </div>
      </div>

      {/* Major Events List */}
      {temporalAnalysis.majorEvents.length > 0 && (
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-red-400 mb-4">🚨 Major Events (M ≥ 5.0)</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {temporalAnalysis.majorEvents.map((event, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-red-300">M {event.magnitude.toFixed(1)}</div>
                    <div className="text-sm text-gray-300">{event.location}</div>
                    <div className="text-xs text-gray-400">
                      Depth: {event.depth.toFixed(1)}km
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {new Date(event.time).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Temporal Analysis Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
        <h4 className="font-bold text-blue-400 mb-2">📅 Temporal Analysis Insights</h4>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong className="text-blue-300">Daily Timeline:</strong> Shows earthquake frequency over time, helping identify swarms or increased activity periods</p>
          <p><strong className="text-purple-300">Hourly Pattern:</strong> Reveals if earthquakes follow any daily patterns (though natural earthquakes are typically random)</p>
          <p><strong className="text-red-300">Major Events:</strong> Highlights significant earthquakes that may have triggered aftershock sequences</p>
        </div>
      </div>
    </div>
  );
};

export default TemporalAnalysis;