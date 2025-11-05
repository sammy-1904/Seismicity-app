import React from 'react';
import { VLabLayout } from '../VLabWrapper';

function Procedure() {
  return (
    <VLabLayout activeSection="procedure" breadcrumbText="Procedure">
      <section className="content-header">
        <h1 align="center">
          Procedure: How to Use the Seismicity Analysis Platform
        </h1>
      </section>
      
      <section className="content">
        <div className="callout callout-info">
          <h4><i className="icon fa fa-book"></i> Overview</h4>
          <p style={{fontSize: '115%'}}>
            Follow these steps to analyze global earthquake data using the ISC-GEM catalogue and 
            calculate the Gutenberg-Richter relationship.
          </p>
        </div>

        <style>
          {`
            .timeline > div > .timeline-item {
              margin-left: 40px;
              background: #fff;
            }
            .timeline:before {
              left: 18px;
            }
            .timeline > div > .fa-circle {
              left: 18px;
            }
          `}
        </style>

        <div className="timeline">
          {[
            {
              num: 1,
              title: "Navigate to Simulation",
              content: "Click on 'Simulation' in the left sidebar to access the interactive platform."
            },
            {
              num: 2,
              title: "Set Geographic Parameters",
              content: "Enter Latitude, Longitude, and Search Radius (km). You can also click on the map to update coordinates."
            },
            {
              num: 3,
              title: "Set Magnitude Filter",
              content: "Specify the minimum magnitude threshold (e.g., 5.0 for moderate earthquakes, 7.0 for major events)."
            },
            {
              num: 4,
              title: "Select Time Range",
              content: "Use the date pickers to select Start Date and End Date (available range: 1904-2021)."
            },
            {
              num: 5,
              title: "Execute Search",
              content: "Click 'Search Earthquakes' button. The system will filter and display the number of events found."
            },
            {
              num: 6,
              title: "Explore Visualizations",
              content: "Navigate through tabs: Map View, G-R Analysis, Depth Analysis, Time Analysis, and Magnitude Distribution."
            },
            {
              num: 7,
              title: "Interpret Results",
              content: "Analyze the G-R plot trend, depth distribution, temporal patterns, and spatial relationships."
            }
          ].map((step) => (
            <div key={step.num}>
              <i className="fa fa-circle bg-blue"></i>
              <div className="timeline-item">
                <span className="time"><i className="fa fa-clock-o"></i> Step {step.num}</span>
                <h3 className="timeline-header">{step.title}</h3>
                <div className="timeline-body">
                  <p style={{fontSize: '110%'}}>{step.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="box box-warning" style={{marginTop: '30px'}}>
          <div className="box-header with-border">
            <h3 className="box-title"><i className="fa fa-map-marker"></i> Sample Regions to Try</h3>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Japan (Subduction Zone)</strong></p>
                <p>Lat: 35.68, Lon: 139.65, Radius: 500km</p>
              </div>
              <div className="col-md-6">
                <p><strong>California (Transform Fault)</strong></p>
                <p>Lat: 34.05, Lon: -118.24, Radius: 500km</p>
              </div>
            </div>
            <div className="row" style={{marginTop: '10px'}}>
              <div className="col-md-6">
                <p><strong>Chile (Subduction Zone)</strong></p>
                <p>Lat: -33.45, Lon: -70.66, Radius: 500km</p>
              </div>
              <div className="col-md-6">
                <p><strong>Mid-Atlantic Ridge</strong></p>
                <p>Lat: 0.00, Lon: -25.00, Radius: 1000km</p>
              </div>
            </div>
          </div>
        </div>

        <div className="callout callout-danger">
          <h4><i className="icon fa fa-warning"></i> Troubleshooting</h4>
          <ul>
            <li><strong>No earthquakes found?</strong> Increase the search radius or adjust the date range.</li>
            <li><strong>Too many events?</strong> Increase minimum magnitude or reduce search radius.</li>
            <li><strong>Data loading slowly?</strong> The CSV contains 40,000+ earthquakes; initial load may take a few seconds.</li>
          </ul>
        </div>
      </section>
    </VLabLayout>
  );
}

export default Procedure;
