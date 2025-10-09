// seismicity-app/frontend/src/utils/grCalculator.js

/**
 * Calculates the data points for a Gutenberg-Richter plot.
 * @param {number[]} magnitudes An array of earthquake magnitudes.
 * @returns {Array<{magnitude: number, frequency: number}>} Data points for the plot.
 */
export const calculateGRValues = (magnitudes) => {
    if (!magnitudes || magnitudes.length === 0) {
        return [];
    }

    const grData = [];
    const minMag = Math.floor(Math.min(...magnitudes) * 10) / 10;
    const maxMag = Math.ceil(Math.max(...magnitudes) * 10) / 10;
    const step = 0.1;

    for (let m = minMag; m <= maxMag; m += step) {
        const cumulativeFrequency = magnitudes.filter(mag => mag >= m).length;

        if (cumulativeFrequency > 0) {
            grData.push({
                magnitude: m,
                frequency: Math.log10(cumulativeFrequency),
            });
        }
    }
    return grData;
};