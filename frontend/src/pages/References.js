import React from 'react';
import { VLabLayout } from '../VLabWrapper';

function References() {
  return (
    <VLabLayout activeSection="references" breadcrumbText="References">
      <section className="content-header">
        <h1 align="center">
          References and Further Reading
        </h1>
      </section>
      
      <section className="content">
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title"><i className="fa fa-database"></i> Primary Data Source</h3>
          </div>
          <div className="box-body">
            <p><strong>ISC-GEM Global Instrumental Earthquake Catalogue (1904-2021)</strong></p>
            <p>International Seismological Centre (2022)</p>
            <p>
              <i className="fa fa-external-link"></i>{' '}
              <a href="http://www.isc.ac.uk/iscgem/" target="_blank" rel="noopener noreferrer">
                http://www.isc.ac.uk/iscgem/
              </a>
            </p>
            <p>
              <strong>DOI:</strong>{' '}
              <a href="https://doi.org/10.31905/D808B825" target="_blank" rel="noopener noreferrer">
                10.31905/D808B825
              </a>
            </p>
          </div>
        </div>

        <div className="box box-success">
          <div className="box-header with-border">
            <h3 className="box-title"><i className="fa fa-book"></i> Key Publications</h3>
          </div>
          <div className="box-body">
            <h4>1. Storchak et al. (2017)</h4>
            <p>
              "Rebuild of the Bulletin of the International Seismological Centre (ISC), part 1: 1964–1979"
            </p>
            <p><em>Geoscience Letters, 4:32</em></p>
            <p>
              <a href="https://doi.org/10.1186/s40562-017-0098-z" target="_blank" rel="noopener noreferrer">
                https://doi.org/10.1186/s40562-017-0098-z
              </a>
            </p>

            <h4 style={{marginTop: '20px'}}>2. Storchak et al. (2013)</h4>
            <p>
              "Public release of the ISC-GEM global instrumental earthquake catalogue (1900-2009)"
            </p>
            <p><em>Seismological Research Letters, 84(5), pp. 810-815</em></p>
            <p>
              <a href="https://doi.org/10.1785/0220130034" target="_blank" rel="noopener noreferrer">
                https://doi.org/10.1785/0220130034
              </a>
            </p>

            <h4 style={{marginTop: '20px'}}>3. Gutenberg & Richter (1944)</h4>
            <p>
              "Frequency of earthquakes in California"
            </p>
            <p><em>Bulletin of the Seismological Society of America, 34(4), pp. 185-188</em></p>
            <p className="text-muted">The original paper describing the frequency-magnitude relationship</p>
          </div>
        </div>

        <div className="box box-info">
          <div className="box-header with-border">
            <h3 className="box-title"><i className="fa fa-globe"></i> Online Resources</h3>
          </div>
          <div className="box-body">
            <ul className="list-unstyled">
              <li style={{marginBottom: '15px'}}>
                <i className="fa fa-link text-blue"></i>{' '}
                <strong>USGS Earthquake Hazards Program</strong><br/>
                <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer">
                  https://earthquake.usgs.gov/
                </a>
                <p className="text-muted">Real-time earthquake information and educational resources</p>
              </li>
              <li style={{marginBottom: '15px'}}>
                <i className="fa fa-link text-blue"></i>{' '}
                <strong>International Seismological Centre (ISC)</strong><br/>
                <a href="http://www.isc.ac.uk/" target="_blank" rel="noopener noreferrer">
                  http://www.isc.ac.uk/
                </a>
                <p className="text-muted">Comprehensive earthquake bulletin and research tools</p>
              </li>
              <li style={{marginBottom: '15px'}}>
                <i className="fa fa-link text-blue"></i>{' '}
                <strong>IRIS (Incorporated Research Institutions for Seismology)</strong><br/>
                <a href="https://www.iris.edu/" target="_blank" rel="noopener noreferrer">
                  https://www.iris.edu/
                </a>
                <p className="text-muted">Seismic data archives and educational animations</p>
              </li>
              <li style={{marginBottom: '15px'}}>
                <i className="fa fa-link text-blue"></i>{' '}
                <strong>Global Earthquake Model (GEM) Foundation</strong><br/>
                <a href="https://www.globalquakemodel.org/" target="_blank" rel="noopener noreferrer">
                  https://www.globalquakemodel.org/
                </a>
                <p className="text-muted">Resources for seismic hazard and risk assessment</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="callout callout-warning">
          <h4><i className="icon fa fa-quote-left"></i> How to Cite This Virtual Lab</h4>
          <p style={{fontFamily: 'monospace', backgroundColor: '#fff', padding: '10px', borderRadius: '4px'}}>
            Seismicity Analysis Platform (2025). Interactive Earthquake Data Visualization 
            using ISC-GEM Global Catalogue. Virtual Laboratory for Seismology Education.
          </p>
        </div>
      </section>
    </VLabLayout>
  );
}

export default References;
