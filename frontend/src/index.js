// seismicity-app/frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './index.css';
import VLabWrapper from './VLabWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <VLabWrapper />
  </React.StrictMode>
);