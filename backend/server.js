const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to fetch earthquake data
app.get('/api/earthquakes', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      maxradiuskm,
      minmagnitude,
      starttime,
      endtime,
    } = req.query;

    // Build USGS API URL
    const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query`;

    const params = {
      format: 'geojson',
      latitude: latitude,
      longitude: longitude,
      maxradiuskm: maxradiuskm,
      minmagnitude: minmagnitude,
      starttime: starttime,
      endtime: endtime,
    };

    // Fetch data from USGS API
    const response = await axios.get(usgsUrl, { params });

    // Return the earthquake data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching earthquake data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch earthquake data',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
