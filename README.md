# Seismicity Analysis Platform - Virtual Lab

A comprehensive educational virtual laboratory for analyzing global earthquake data from the ISC-GEM Global Instrumental Earthquake Catalogue. Built with the IIT Roorkee Virtual Labs template framework.

## Features

### Educational Components
- **Aim**: Learning objectives and outcomes for seismology education
- **Theory**: Comprehensive seismological concepts including Gutenberg-Richter law, magnitude scales, and depth classifications
- **Pre-Test**: Assessment of foundational seismology knowledge
- **Procedure**: Step-by-step guide for using the simulation platform
- **Simulation**: Interactive analysis platform (see below)
- **Post-Test**: Application-based assessment questions
- **References**: Citations and resources for further study

### Interactive Simulation Platform
- **Interactive Map Visualization**: Display earthquakes on an interactive map with magnitude-based markers
- **Gutenberg-Richter Analysis**: Statistical relationship between magnitude and frequency
- **Depth Distribution Charts**: Analyze earthquake depths and geological context
- **Temporal Analysis**: Time-based patterns and seismic event distribution
- **Magnitude Distribution**: Frequency analysis of earthquake magnitudes
- **Advanced Filtering**: Filter by location, radius, magnitude, and date range

## Data Source

This application uses the **ISC-GEM Global Instrumental Earthquake Catalogue** (Version 12.0):
- **Period Covered**: 1904-2021
- **Citation**: International Seismological Centre (2025), ISC-GEM Earthquake Catalogue, https://doi.org/10.31905/D808B825
- **Data Files**: 
  - `isc-gem-cat.csv` - Main earthquake catalogue
  - `isc-gem-suppl.csv` - Supplementary catalogue

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sammy-1904/Seismicity-app.git
cd Seismicity-app
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

The application will open with the VLab interface showing all educational sections.

## Usage

### Educational Flow

1. **Aim**: Start by reviewing the learning objectives
2. **Theory**: Study seismological concepts and the Gutenberg-Richter relationship
3. **Pre-Test**: Assess your foundational knowledge (5 questions)
4. **Procedure**: Follow the step-by-step guide
5. **Simulation**: Perform interactive analysis (see below)
6. **Post-Test**: Test your understanding with application-based questions (5 questions)
7. **References**: Explore citations and additional resources

### Using the Simulation

1. **Navigate to Simulation**: Click "Simulation" in the left sidebar

2. **Set Search Parameters**:
   - Enter the latitude and longitude of your area of interest (or click on map)
   - Set the search radius in kilometers
   - Choose minimum magnitude threshold
   - Select start and end dates (1904-2021)

3. **Execute Search**: Click "Search Earthquakes" button

4. **Explore Visualizations**:
   - **Map View**: Interactive geographical visualization with cluster markers
   - **G-R Analysis**: Gutenberg-Richter statistical analysis with a-value and b-value
   - **Depth Analysis**: Earthquake depth distribution and geological context
   - **Temporal Analysis**: Time-based patterns and seismic trends
   - **Magnitude Distribution**: Magnitude frequency analysis

5. **Sample Regions**: Try these interesting seismic zones:
   - Japan (35.68, 139.65) - Subduction zone
   - California (34.05, -118.24) - Transform fault
   - Chile (-33.45, -70.66) - Subduction zone
   - Mid-Atlantic Ridge (0.00, -25.00) - Divergent boundary

## Architecture

### Frontend-Only Design

This application runs entirely in the browser without requiring a backend server:
- CSV data is loaded directly from the `public` folder
- All data processing happens client-side using JavaScript
- No API calls or external dependencies required
- VLab template assets served from `public` directory

### Key Components

#### Educational Pages
- **Aim.js**: Learning objectives page
- **Theory.js**: Seismology theory and concepts
- **PreTest.js**: Pre-assessment quiz
- **Procedure.js**: Step-by-step guide with timeline
- **Simulation.js**: Simulation wrapper component
- **PostTest.js**: Post-assessment quiz
- **References.js**: Citations and resources

#### Simulation Components
- **App.js**: Main simulation component with state management
- **MapComponent**: Leaflet-based interactive map with clustering
- **GutenbergRichterGraph**: Statistical analysis visualization using Recharts
- **DepthDistributionChart**: Depth analysis chart
- **TemporalAnalysis**: Time-based visualization
- **MagnitudeDistribution**: Magnitude frequency chart

#### Core Files
- **VLabWrapper.js**: Main routing wrapper with VLabLayout component
- **index.js**: Application entry point

### Utilities

- **csvParser.js**: Parses ISC-GEM CSV format and filters earthquakes
- **grCalculator.js**: Calculates Gutenberg-Richter relationship values

## Technologies Used

### Frontend Framework & Libraries
- **React 18**: UI framework
- **React Router v6**: Client-side routing for multi-page navigation
- **React DatePicker**: Date selection component

### UI/Styling
- **AdminLTE 2**: Admin dashboard theme (VLab template)
- **Bootstrap 3.3.4**: CSS framework for VLab pages
- **Tailwind CSS**: Modern utility-first CSS for simulation
- **Font Awesome 4.5.0**: Icon library

### Visualization
- **Leaflet**: Interactive maps
- **React Leaflet**: React components for Leaflet
- **Recharts**: Chart visualization library
- **Leaflet.markercluster**: Marker clustering for maps

### Data Processing
- **PapaParse**: CSV parsing library (if used)
- Custom utilities for ISC-GEM format parsing

## Performance Notes

- The CSV file contains ~40,000+ earthquake records from 1904-2021
- Initial CSV load time: 2-5 seconds depending on browser performance
- Filtering is optimized for client-side processing
- Marker clustering improves map performance with large datasets
- Recommended: Use modern browsers (Chrome, Firefox, Edge, Safari)
- Minimum screen resolution: 1280x720 for optimal viewing

## Data Format

The ISC-GEM CSV format includes:
- Date and time of earthquake
- Epicenter location (latitude, longitude)
- Depth and depth uncertainty
- Moment magnitude (Mw)
- Error ellipse parameters
- Quality indicators
- Event identifiers

## License

The ISC-GEM Earthquake Catalogue is distributed under CC-BY-SA 3.0 license.
Please cite the catalogue appropriately when using this data.

## Citations

For general use of the catalogue, please cite:
- Storchak, D.A., et al. (2013). Public Release of the ISC-GEM Global Instrumental Earthquake Catalogue (1900-2009). Seism. Res. Lett., 84, 5, 810-815.
- Storchak, D.A., et al. (2015). The ISC-GEM Global Instrumental Earthquake Catalogue (1900-2009): Introduction, Phys. Earth Planet. Int., 239, 48-63.
- Di Giacomo, D., et al. (2018). The ISC-GEM Earthquake Catalogue (1904–2014): status after the Extension Project, Earth Syst. Sci. Data, 10, 1877-1899.

## Project Structure

```
seismicity-app/
├── frontend/
│   ├── public/
│   │   ├── bootstrap/          # Bootstrap framework
│   │   ├── dist/              # AdminLTE theme
│   │   ├── plugins/           # jQuery plugins
│   │   ├── images/            # VLab branding
│   │   ├── isc-gem-cat.csv    # Main catalogue
│   │   └── isc-gem-suppl.csv  # Supplementary catalogue
│   ├── src/
│   │   ├── components/        # Visualization components
│   │   ├── pages/            # Educational pages
│   │   ├── utils/            # Helper functions
│   │   ├── App.js            # Main simulation
│   │   ├── VLabWrapper.js    # VLab layout
│   │   └── index.js          # Entry point
│   └── package.json
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
└── README.md                 # This file
```

## Screenshots

### VLab Interface
The application features a complete educational framework with:
- Learning objectives (Aim)
- Theoretical concepts (Theory)
- Knowledge assessment (Pre-Test & Post-Test)
- Step-by-step guide (Procedure)
- Interactive simulation
- References and citations

### Simulation Platform
- Interactive map with earthquake markers
- Gutenberg-Richter relationship analysis
- Depth distribution charts
- Temporal pattern visualization
- Magnitude frequency analysis

## Development

### Running in Development Mode
```bash
cd frontend
npm start
```

### Building for Production
```bash
cd frontend
npm run build
```

The build will be created in the `build` directory, ready for deployment to any static hosting service.

### Running Tests
```bash
npm test
```

## Deployment

This is a static React application that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static hosting service

See `DEPLOYMENT.md` for detailed deployment instructions.

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines on:
- Code style and standards
- Development workflow
- Submitting pull requests
- Reporting issues

## Support

- **Data Issues**: Contact ISC at admin@isc.ac.uk
- **Application Issues**: Open an issue on [GitHub](https://github.com/sammy-1904/Seismicity-app/issues)
- **Questions**: Check existing issues or create a new discussion
