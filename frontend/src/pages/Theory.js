import React from 'react';
import { VLabLayout } from '../VLabWrapper';

function Theory() {
  return (
    <VLabLayout activeSection="theory" breadcrumbText="Theory">
      <section className="content-header">
        <h1 align="center">
          Theory: Understanding Seismicity and Earthquake Analysis
        </h1>
      </section>
      
      <section className="content">
        <h3 style={{marginTop: '3%'}}>1. Introduction to Seismicity</h3>
        <p style={{fontSize: '115%', marginTop: '2%', lineHeight: '1.7'}}>
          Seismicity refers to the geographic and temporal distribution of earthquakes in a given region. 
          The study of seismicity helps us understand tectonic plate boundaries, earthquake hazard assessment,
          fault system mechanics, and patterns in earthquake occurrence over time.
        </p>

        <div className="callout callout-warning" style={{marginTop: '3%'}}>
          <h4><i className="icon fa fa-info-circle"></i> The Gutenberg-Richter Relationship</h4>
          <p style={{fontSize: '115%'}}>
            The Gutenberg-Richter law is a fundamental relationship in seismology that describes the 
            distribution of earthquake magnitudes:
          </p>
          <div style={{textAlign: 'center', margin: '20px 0', fontSize: '140%', fontFamily: 'monospace'}}>
            log₁₀(N) = a - b × M
          </div>
          <p><strong>Where:</strong></p>
          <ul>
            <li><strong>N</strong> = Number of earthquakes with magnitude ≥ M</li>
            <li><strong>M</strong> = Magnitude of the earthquake</li>
            <li><strong>a</strong> = Activity rate (productivity of seismic zone)</li>
            <li><strong>b</strong> = Slope value (typically ~1.0, ratio of small to large earthquakes)</li>
          </ul>
        </div>

        <h3 style={{marginTop: '4%'}}>2. Earthquake Magnitude Scales</h3>
        <p style={{fontSize: '115%', lineHeight: '1.7'}}>
          The ISC-GEM catalogue uses <strong>moment magnitude (Mw)</strong>, which is based on the 
          seismic moment and is the most accurate scale for large earthquakes.
        </p>
        
        <div className="row" style={{marginTop: '2%'}}>
          <div className="col-md-6">
            <div className="box box-success">
              <div className="box-header with-border">
                <h3 className="box-title">Magnitude Classifications</h3>
              </div>
              <div className="box-body">
                <p><strong>M &lt; 5.0:</strong> Minor to Light</p>
                <p><strong>5.0 ≤ M &lt; 6.0:</strong> Moderate</p>
                <p><strong>6.0 ≤ M &lt; 7.0:</strong> Strong</p>
                <p><strong>7.0 ≤ M &lt; 8.0:</strong> Major</p>
                <p><strong>M ≥ 8.0:</strong> Great</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box box-success">
              <div className="box-header with-border">
                <h3 className="box-title">Energy Release</h3>
              </div>
              <div className="box-body">
                <p>
                  Each whole number increase in magnitude represents approximately 32 times more 
                  energy release. An M8.0 earthquake releases about 1,000 times more energy than an M6.0 event.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{marginTop: '4%'}}>3. Earthquake Focal Depth</h3>
        <p style={{fontSize: '115%', lineHeight: '1.7'}}>
          The focal depth (hypocenter depth) is where earthquake rupture originates:
        </p>
        
        <div className="row" style={{marginTop: '2%'}}>
          <div className="col-md-4">
            <div className="small-box bg-green">
              <div className="inner">
                <h3>Shallow</h3>
                <p>0-70 km depth</p>
              </div>
              <div className="icon">
                <i className="fa fa-arrow-down"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="small-box bg-yellow">
              <div className="inner">
                <h3>Intermediate</h3>
                <p>70-300 km depth</p>
              </div>
              <div className="icon">
                <i className="fa fa-arrow-down"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="small-box bg-red">
              <div className="inner">
                <h3>Deep</h3>
                <p>&gt;300 km depth</p>
              </div>
              <div className="icon">
                <i className="fa fa-arrow-down"></i>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{marginTop: '4%'}}>4. The ISC-GEM Global Earthquake Catalogue</h3>
        <div className="box box-info">
          <div className="box-body">
            <p style={{fontSize: '115%'}}>
              The ISC-GEM catalogue is a comprehensive, authoritative dataset of global earthquakes from 1904 to 2021.
            </p>
            <h4>Key Features:</h4>
            <ul>
              <li>Contains earthquakes with magnitude Mw ≥ 5.5 (approximately)</li>
              <li>Homogenized magnitude scale (moment magnitude, Mw)</li>
              <li>Relocalized epicenters for improved accuracy</li>
              <li>Covers over 117 years of global seismic activity</li>
              <li>Essential for seismic hazard assessment and research</li>
            </ul>
          </div>
        </div>

        <div className="callout callout-success" style={{marginTop: '4%'}}>
          <h4><i className="icon fa fa-check"></i> Summary</h4>
          <p style={{fontSize: '115%'}}>
            Understanding seismicity requires knowledge of earthquake statistics (Gutenberg-Richter law), 
            magnitude scales, focal depths, and tectonic settings. The ISC-GEM catalogue provides a 
            century-long record for analyzing these patterns globally.
          </p>
        </div>
      </section>
    </VLabLayout>
  );
}

export default Theory;
