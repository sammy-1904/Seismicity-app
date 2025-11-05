// seismicity-app/frontend/src/components/MagnitudeDistribution.js

import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MagnitudeDistribution = ({ data }) => {
  const magnitudeAnalysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Create magnitude bins
    const minMag = Math.floor(Math.min(...data.map(eq => eq.properties.mag)) * 10) / 10;
    const maxMag = Math.ceil(Math.max(...data.map(eq => eq.properties.mag)) * 10) / 10;

    const bins = [];
    for (let mag = minMag; mag <= maxMag; mag += 0.5) {
      bins.push({
        min: mag,
        max: mag + 0.5,
        label: `${mag.toFixed(1)}-${(mag + 0.5).toFixed(1)}`,
        center: mag + 0.25
      });
    }

    const binCounts = bins.map(bin => ({
      ...bin,
      count: data.filter(eq =>
        eq.properties.mag >= bin.min && eq.properties.mag < bin.max
      ).length,
      earthquakes: data.filter(eq =>
        eq.properties.mag >= bin.min && eq.properties.mag < bin.max
      )
    }));

    // Calculate cumulative distribution for Gutenberg-Richter verification
    const cumulativeData = bins.map(bin => ({
      magnitude: bin.center,
      cumulative: data.filter(eq => eq.properties.mag >= bin.min).length
    }));

    // Energy calculations (seismic moment)
    const totalEnergy = data.reduce((sum, eq) => {
      // Energy in Joules: log10(E) = 1.5M + 9.1
      return sum + Math.pow(10, 1.5 * eq.properties.mag + 9.1);
    }, 0);

    const energyByMagnitude = binCounts.map(bin => ({
      ...bin,
      energy: bin.earthquakes.reduce((sum, eq) => {
        return sum + Math.pow(10, 1.5 * eq.properties.mag + 9.1);
      }, 0)
    }));

    // Statistical measures
    const magnitudes = data.map(eq => eq.properties.mag);
    const avgMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length;
    const medianMagnitude = magnitudes.sort((a, b) => a - b)[Math.floor(magnitudes.length / 2)];
    const maxMagnitude = Math.max(...magnitudes);
    const minMagnitude = Math.min(...magnitudes);

    // Standard deviation
    const variance = magnitudes.reduce((sum, mag) => sum + Math.pow(mag - avgMagnitude, 2), 0) / magnitudes.length;
    const stdDeviation = Math.sqrt(variance);

    return {
      binCounts,
      cumulativeData,
      totalEnergy,
      energyByMagnitude,
      avgMagnitude,
      medianMagnitude,
      maxMagnitude,
      minMagnitude,
      stdDeviation,
      totalCount: data.length
    };
  }, [data]);

  // Color mapping for magnitude ranges
  const getColorForMagnitude = (magnitude) => {
    if (magnitude < 3) return '#22c55e'; // Green
    if (magnitude < 4) return '#84cc16'; // Lime
    if (magnitude < 5) return '#eab308'; // Yellow
    if (magnitude < 6) return '#f97316'; // Orange
    if (magnitude < 7) return '#ef4444'; // Red
    return '#991b1b'; // Dark red
  };

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
            const binData = magnitudeAnalysis.binCounts[context.dataIndex];
            const percentage = ((binData.count / magnitudeAnalysis.totalCount) * 100).toFixed(1);
            const energy = magnitudeAnalysis.energyByMagnitude[context.dataIndex].energy;
            return [
              `Count: ${binData.count} earthquakes`,
              `Percentage: ${percentage}%`,
              `Range: M${binData.label}`,
              `Energy: ${energy.toExponential(2)} J`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Magnitude Range',
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

  const chartData = {
    labels: magnitudeAnalysis?.binCounts.map(bin => bin.label) || [],
    datasets: [{
      data: magnitudeAnalysis?.binCounts.map(bin => bin.count) || [],
      backgroundColor: magnitudeAnalysis?.binCounts.map(bin =>
        getColorForMagnitude(bin.center) + '80'
      ) || [],
      borderColor: magnitudeAnalysis?.binCounts.map(bin =>
        getColorForMagnitude(bin.center)
      ) || [],
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false
    }]
  };

  if (!magnitudeAnalysis || magnitudeAnalysis.totalCount === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-2xl font-semibold mb-4">Magnitude Distribution</div>
          <p className="text-lg">No magnitude data available</p>
          <p className="text-sm">Fetch earthquake data to analyze magnitude distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Average Magnitude</div>
          <div className="text-2xl font-bold text-blue-400">
            M{magnitudeAnalysis.avgMagnitude.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Median Magnitude</div>
          <div className="text-2xl font-bold text-green-400">
            M{magnitudeAnalysis.medianMagnitude.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Max Magnitude</div>
          <div className="text-2xl font-bold text-red-400">
            M{magnitudeAnalysis.maxMagnitude.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
          <div className="text-sm text-gray-300">Std. Deviation</div>
          <div className="text-2xl font-bold text-purple-400">
            ±{magnitudeAnalysis.stdDeviation.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
        <Bar options={chartOptions} data={chartData} />
      </div>

      {/* Energy Analysis */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">⚡ Energy Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {magnitudeAnalysis.totalEnergy.toExponential(2)} J
            </div>
            <div className="text-sm text-gray-300">Total Seismic Energy Released</div>
            <div className="text-xs text-gray-400 mt-1">
              Equivalent to {(magnitudeAnalysis.totalEnergy / 4.184e15).toFixed(2)} megatons TNT
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Energy by Magnitude Range:</div>
            {magnitudeAnalysis.energyByMagnitude
              .filter(bin => bin.energy > 0)
              .sort((a, b) => b.energy - a.energy)
              .slice(0, 3)
              .map((bin, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-400">M{bin.label}:</span>
                  <span className="text-yellow-300">
                    {((bin.energy / magnitudeAnalysis.totalEnergy) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Magnitude Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { range: '<3.0', label: 'Micro', color: '#22c55e', description: 'Usually not felt' },
          { range: '3.0-3.9', label: 'Minor', color: '#84cc16', description: 'Often felt, rarely damages' },
          { range: '4.0-4.9', label: 'Light', color: '#eab308', description: 'Noticeable shaking' },
          { range: '5.0-5.9', label: 'Moderate', color: '#f97316', description: 'Can cause damage' },
          { range: '6.0-6.9', label: 'Strong', color: '#ef4444', description: 'Destructive in populated areas' },
          { range: '≥7.0', label: 'Major+', color: '#991b1b', description: 'Serious damage over large areas' }
        ].map((category, index) => {
          const count = magnitudeAnalysis.binCounts
            .filter(bin => {
              if (category.range === '<3.0') return bin.center < 3.0;
              if (category.range === '3.0-3.9') return bin.center >= 3.0 && bin.center < 4.0;
              if (category.range === '4.0-4.9') return bin.center >= 4.0 && bin.center < 5.0;
              if (category.range === '5.0-5.9') return bin.center >= 5.0 && bin.center < 6.0;
              if (category.range === '6.0-6.9') return bin.center >= 6.0 && bin.center < 7.0;
              if (category.range === '≥7.0') return bin.center >= 7.0;
              return false;
            })
            .reduce((sum, bin) => sum + bin.count, 0);

          return (
            <div key={index} className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/30">
              <div className="flex items-center mb-2">
                <div
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="font-semibold text-gray-200">{category.label}</div>
              </div>
              <div className="text-lg font-bold" style={{ color: category.color }}>
                {count}
              </div>
              <div className="text-xs text-gray-400 mb-1">M{category.range}</div>
              <div className="text-xs text-gray-500">{category.description}</div>
            </div>
          );
        })}
      </div>

      {/* Educational Content */}
      <div className="space-y-4">
        {/* What is Being Displayed */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">What This Chart Shows</h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            This histogram displays the frequency distribution of earthquake magnitudes, 
            showing how many earthquakes fall within each magnitude range. The color gradient represents intensity levels.
          </p>
          <div className="bg-white p-4 rounded border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Bars: Number of earthquakes in each 0.5 magnitude bin</p>
            <p className="text-sm text-slate-600 mb-2">Colors: Green (minor) → Yellow → Orange → Red (major)</p>
            <p className="text-sm text-slate-600">Statistics: Mean, median, max magnitude, and standard deviation</p>
          </div>
        </div>

        {/* Energy Calculation Explained */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">How Seismic Energy is Calculated</h4>
          <div className="bg-white p-4 rounded border border-slate-200 mb-3">
            <p className="text-center text-xl font-mono text-slate-700 mb-2">
              log₁₀(E) = 1.5 × M + 9.1
            </p>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• E = Energy released in Joules</p>
              <p>• M = Moment magnitude (Mw)</p>
              <p>• 1.5 = Scaling factor (energy increases exponentially)</p>
            </div>
          </div>
          
          <h5 className="font-semibold text-slate-700 mb-2">Key Insights:</h5>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• Exponential Growth: Each magnitude unit = ~31.6× more energy (10^1.5 ≈ 31.6)</li>
            <li>• Energy Dominance: One M7.0 releases as much energy as ~1,000 M5.0 earthquakes</li>
            <li>• Comparison: M6.0 ≈ Hiroshima atomic bomb; M9.0 ≈ 474 megatons TNT</li>
          </ul>
        </div>

        {/* The Magnitude Scale */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">Understanding Moment Magnitude (Mw)</h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            The moment magnitude scale is the modern standard for measuring earthquake size, 
            directly related to the energy released at the source.
          </p>
          <div className="bg-white p-4 rounded border border-slate-200">
            <h5 className="font-semibold text-slate-700 mb-2">Calculation Steps:</h5>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
              <li>Seismic Moment (M₀): M₀ = μ × A × D</li>
              <li className="ml-6 text-xs text-slate-500">μ = rock rigidity, A = fault area, D = average slip</li>
              <li>Convert to Magnitude: Mw = (2/3) × log₁₀(M₀) - 10.7</li>
              <li>Calculate Energy: Using E = (M₀) / (2 × 10⁴)</li>
            </ol>
          </div>
        </div>

        {/* Statistical Measures */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">Statistical Measures Explained</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Average (Mean)</div>
              <div className="text-xs text-slate-600">Sum of all magnitudes ÷ count. Useful for overall activity level but sensitive to outliers.</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Median</div>
              <div className="text-xs text-slate-600">Middle value when sorted. Better represents "typical" earthquake, not skewed by rare large events.</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Maximum</div>
              <div className="text-xs text-slate-600">Largest observed magnitude. Critical for hazard assessment and structural design.</div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <div className="text-slate-700 font-bold mb-1">Standard Deviation</div>
              <div className="text-xs text-slate-600">Spread of magnitudes. Higher σ means more variability in earthquake sizes.</div>
            </div>
          </div>
        </div>

        {/* Why Energy Distribution Matters */}
        <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
          <h4 className="font-bold text-slate-800 mb-3 text-lg">Real-World Implications</h4>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• Building Codes: Design standards based on expected maximum magnitudes</li>
            <li>• Energy Budget: Total seismic energy helps understand tectonic strain release</li>
            <li>• Early Warning: Magnitude distribution patterns may reveal stress accumulation</li>
            <li>• Insurance & Risk: Actuarial models use magnitude statistics for premium calculation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MagnitudeDistribution;