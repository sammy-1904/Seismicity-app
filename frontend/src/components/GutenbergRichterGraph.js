// seismicity-app/frontend/src/components/GutenbergRichterGraph.js

import React, { useRef, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GutenbergRichterGraph = ({ data }) => {
  const chartRef = useRef(null);

  // Data for the scatter plot
  const scatterData = data.map(point => ({ x: point.magnitude, y: point.frequency }));

  // Calculate linear regression for trend line
  const linearRegression = useMemo(() => {
    if (data.length < 2) return null;

    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.magnitude, 0);
    const sumY = data.reduce((sum, point) => sum + point.frequency, 0);
    const sumXY = data.reduce((sum, point) => sum + point.magnitude * point.frequency, 0);
    const sumX2 = data.reduce((sum, point) => sum + point.magnitude * point.magnitude, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }, [data]);

  // Generate trend line data
  const trendLineData = useMemo(() => {
    if (!linearRegression || data.length < 2) return [];

    const minX = Math.min(...data.map(p => p.magnitude));
    const maxX = Math.max(...data.map(p => p.magnitude));

    return [
      { x: minX, y: linearRegression.slope * minX + linearRegression.intercept },
      { x: maxX, y: linearRegression.slope * maxX + linearRegression.intercept }
    ];
  }, [linearRegression, data]);

  // Calculate correlation coefficient
  const correlationCoefficient = useMemo(() => {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.magnitude, 0);
    const sumY = data.reduce((sum, point) => sum + point.frequency, 0);
    const sumXY = data.reduce((sum, point) => sum + point.magnitude * point.frequency, 0);
    const sumX2 = data.reduce((sum, point) => sum + point.magnitude * point.magnitude, 0);
    const sumY2 = data.reduce((sum, point) => sum + point.frequency * point.frequency, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator !== 0 ? numerator / denominator : 0;
  }, [data]);

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: { size: 12 },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f3f4f6',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const magnitude = context.parsed.x;
            const frequency = context.parsed.y;
            if (label === 'Observed Data') {
              return `${label}: M=${magnitude.toFixed(1)}, Log₁₀(N)=${frequency.toFixed(2)} (N=${Math.pow(10, frequency).toFixed(0)})`;
            }
            return `${label}: M=${magnitude.toFixed(1)}, Log₁₀(N)=${frequency.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Magnitude (M)',
          color: '#e5e7eb',
          font: { size: 14, weight: 'bold' }
        },
        type: 'linear',
        ticks: {
          color: '#d1d5db',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)',
          drawBorder: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Log₁₀(Cumulative Frequency)',
          color: '#e5e7eb',
          font: { size: 14, weight: 'bold' }
        },
        type: 'linear',
        ticks: {
          color: '#d1d5db',
          font: { size: 11 },
          callback: function(value) {
            return value.toFixed(1);
          }
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)',
          drawBorder: false
        }
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: 'Observed Data',
        data: scatterData,
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderColor: 'rgba(56, 189, 248, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointBorderColor: 'rgba(56, 189, 248, 1)',
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 0.8)',
      },
      ...(trendLineData.length > 0 ? [{
        label: 'Linear Trend',
        data: trendLineData,
        type: 'line',
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      }] : [])
    ],
  };

  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg">No data available</p>
          <p className="text-sm">Fetch earthquake data to see the Gutenberg-Richter relationship</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      {linearRegression && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
            <div className="text-sm text-gray-300">b-value (slope)</div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.abs(linearRegression.slope).toFixed(3)}
            </div>
            <div className="text-xs text-gray-400">
              {linearRegression.slope < 0 ? 'Normal' : 'Anomalous'} distribution
            </div>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
            <div className="text-sm text-gray-300">Correlation (R)</div>
            <div className="text-2xl font-bold text-purple-400">
              {correlationCoefficient.toFixed(3)}
            </div>
            <div className="text-xs text-gray-400">
              {Math.abs(correlationCoefficient) > 0.8 ? 'Strong' :
               Math.abs(correlationCoefficient) > 0.5 ? 'Moderate' : 'Weak'} fit
            </div>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
            <div className="text-sm text-gray-300">Data Points</div>
            <div className="text-2xl font-bold text-teal-400">{data.length}</div>
            <div className="text-xs text-gray-400">Magnitude bins</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-96 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
        <Scatter ref={chartRef} options={options} data={chartData} />
      </div>

      {/* Explanation */}
      <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
        <h4 className="font-bold text-purple-400 mb-2">📚 About the Gutenberg-Richter Law</h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          The Gutenberg-Richter law describes the relationship between earthquake magnitude and frequency:
          <strong className="text-purple-300"> log₁₀(N) = a - b×M</strong>, where N is the cumulative number
          of earthquakes with magnitude ≥ M. The b-value typically ranges from 0.8-1.2, with lower values
          indicating more large earthquakes relative to small ones.
        </p>
      </div>
    </div>
  );
};

export default GutenbergRichterGraph;