import React from 'react';
import { VLabLayout } from '../VLabWrapper';

function Aim() {
  return (
    <VLabLayout activeSection="aim" breadcrumbText="Aim">
      <section className="content-header">
        <h1 align="center">
          Seismicity Analysis using ISC-GEM Global Earthquake Catalogue
        </h1>
      </section>
      
      <section className="content">
        <h3 style={{marginTop: '5%'}}>Aim</h3>
        <p style={{fontSize: '130%', marginTop: '2%'}}>
          To understand and analyze global seismicity patterns using the ISC-GEM Global Earthquake Catalogue, 
          and to learn about the Gutenberg-Richter relationship through interactive data visualization.
        </p>

        <h3 style={{marginTop: '4%'}}>Learning Outcomes</h3>
        <ul style={{fontSize: '110%', marginTop: '2%', lineHeight: '1.8'}}>
          <li>Understand the spatial distribution of earthquakes across different tectonic regions</li>
          <li>Learn to interpret the Gutenberg-Richter relationship for frequency-magnitude distribution</li>
          <li>Analyze temporal patterns in seismic activity over the past century (1904-2021)</li>
          <li>Examine the relationship between earthquake depth and magnitude</li>
          <li>Develop skills in querying and filtering large geospatial datasets</li>
          <li>Gain practical experience with seismological data analysis tools</li>
        </ul>

        <h3 style={{marginTop: '4%'}}>Key Concepts Covered</h3>
        <div className="row" style={{marginTop: '2%'}}>
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-body">
                <h4><strong>Seismicity</strong></h4>
                <p>The geographic and historical distribution of earthquakes in a region</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-body">
                <h4><strong>Gutenberg-Richter Law</strong></h4>
                <p>Statistical relationship between earthquake magnitude and frequency</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-body">
                <h4><strong>Magnitude Scales</strong></h4>
                <p>Understanding moment magnitude (Mw) and its significance</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-body">
                <h4><strong>Focal Depth</strong></h4>
                <p>Classification of earthquakes based on hypocenter depth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="callout callout-info" style={{marginTop: '3%'}}>
          <h4><i className="icon fa fa-clock-o"></i> Expected Time Duration</h4>
          <p style={{fontSize: '110%'}}>
            Approximately 45-60 minutes to complete all sections including pre-test, theory, 
            simulation exercises, and post-test.
          </p>
        </div>
      </section>
    </VLabLayout>
  );
}

export default Aim;
