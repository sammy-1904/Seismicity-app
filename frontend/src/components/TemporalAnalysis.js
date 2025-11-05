// seismicity-app/frontend/src/components/TemporalAnalysis.js

import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

const TemporalAnalysis = ({ data }) => {
  const temporalAnalysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Ensure we are working on a copy and sorted by time
    const sortedData = [...data].sort((a, b) => a.properties.time - b.properties.time);

    // Group by day (UTC) and by hour (UTC)
    const dailyGroups = {};
    const hourlyCounts = Array.from({ length: 24 }, () => 0);

    sortedData.forEach(eq => {
      const date = new Date(eq.properties.time);
      const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      dailyGroups[dayKey] = (dailyGroups[dayKey] || 0) + 1;
      const hour = date.getUTCHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });

    const timeline = Object.keys(dailyGroups).sort().map(d => ({ date: new Date(d), count: dailyGroups[d] }));

    const totalDays = timeline.length;
    const totalEvents = sortedData.length;
    const avgPerDay = totalDays > 0 ? totalEvents / totalDays : 0;

    const busiestDay = timeline.reduce((best, cur) => (cur.count > (best.count || 0) ? cur : best), {});

    const majorEvents = sortedData
      .filter(eq => Number(eq.properties.mag) >= 5.0)
      .map(eq => ({
        magnitude: Number(eq.properties.mag),
        depth: Number(eq.properties.depth || 0),
        time: eq.properties.time,
        location: eq.properties.place || eq.properties.location || 'Unknown'
      }));

    const hourlyPattern = hourlyCounts.map((count, hour) => ({ hour, count }));

    return { timeline, hourlyPattern, totalDays, avgPerDay, busiestDay, majorEvents };
  }, [data]);

  if (!temporalAnalysis) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-2xl font-semibold mb-4">Temporal Distribution</div>
          <p className="text-lg">No temporal data available</p>
          <p className="text-sm">Fetch earthquake data to analyze temporal patterns</p>
        </div>
      </div>
    );
  }

  // Chart data
  const timelineChartData = {
    labels: temporalAnalysis.timeline.map(t => t.date),
    datasets: [
      {
        label: 'Events per day',
        data: temporalAnalysis.timeline.map(t => t.count),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        tension: 0.2,
        fill: true,
      }
    ]
  };

  const hourlyChartData = {
    labels: temporalAnalysis.hourlyPattern.map(h => h.hour.toString().padStart(2, '0')),
    datasets: [
      {
        label: 'Events by UTC hour',
        data: temporalAnalysis.hourlyPattern.map(h => h.count),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      }
    ]
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f3f4f6',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'MMM dd, yyyy' },
        ticks: { color: '#d1d5db' },
        grid: { color: 'rgba(209,213,219,0.06)' }
      },
      y: {
        ticks: { color: '#d1d5db' },
        grid: { color: 'rgba(209,213,219,0.06)' }
      }
    }
  };

  const hourlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#d1d5db' } },
      y: { ticks: { color: '#d1d5db' }, beginAtZero: true }
    }
  };

  return (
    <div className="space-y-8">
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Time Span</div>
          <div className="text-2xl font-bold text-blue-400">{temporalAnalysis.totalDays} days</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Avg. per Day</div>
          <div className="text-2xl font-bold text-green-400">{temporalAnalysis.avgPerDay.toFixed(1)}</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Busiest Day</div>
          <div className="text-lg font-bold text-yellow-400">{temporalAnalysis.busiestDay.count || 0} events</div>
          <div className="text-xs text-gray-400">{temporalAnalysis.busiestDay.date ? new Date(temporalAnalysis.busiestDay.date).toLocaleDateString() : ''}</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Major Events</div>
          <div className="text-2xl font-bold text-red-400">{temporalAnalysis.majorEvents.length}</div>
          <div className="text-xs text-gray-400">M ≥ 5.0</div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Daily Seismic Activity Distribution</h3>
        <div className="h-64">
          <Line options={timelineOptions} data={timelineChartData} />
        </div>
      </div>

      {/* Hourly Pattern Chart */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Hourly Distribution Pattern (UTC)</h3>
        <div className="h-64">
          <Bar options={hourlyOptions} data={hourlyChartData} />
        </div>
      </div>

      {/* Major Events List */}
      {temporalAnalysis.majorEvents.length > 0 && (
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Major Events (M ≥ 5.0)</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {temporalAnalysis.majorEvents.map((event, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-red-300">M {event.magnitude.toFixed(1)}</div>
                    <div className="text-sm text-gray-300">{event.location}</div>
                    <div className="text-xs text-gray-400">Depth: {event.depth.toFixed(1)}km</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">{new Date(event.time).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">{new Date(event.time).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Content - simplified slate style */}
      <div className="space-y-4">
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">What These Charts Show</h4>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-1">Daily Timeline</h5>
              <p className="text-sm text-slate-600">Events per day (UTC). Peaks show swarms or aftershock sequences.</p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-1">Hourly Distribution</h5>
              <p className="text-sm text-slate-600">Counts by UTC hour. Useful to detect operational or tidal patterns for induced events.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">Key Concepts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700">Aftershock Decay (Omori)</h5>
              <p className="text-xs text-slate-600">Aftershock rate typically falls roughly as 1/(c+t)^p. Use timelines to inspect decay after a mainshock.</p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h5 className="font-semibold text-slate-700">Foreshocks & Forecasting</h5>
              <p className="text-xs text-slate-600">Foreshocks are only identified post hoc. Statistical models can quantify elevated short-term hazard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporalAnalysis;