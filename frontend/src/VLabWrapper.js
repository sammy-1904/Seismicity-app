import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Aim from './pages/Aim';
import Theory from './pages/Theory';
import PreTest from './pages/PreTest';
import Procedure from './pages/Procedure';
import Simulation from './pages/Simulation';
import PostTest from './pages/PostTest';
import References from './pages/References';

// VLab Layout Component - matches the template structure
function VLabLayout({ children, activeSection, breadcrumbText }) {
  const location = useLocation();

  useEffect(() => {
    // Load jQuery and Bootstrap if not already loaded
    if (!window.jQuery) {
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js';
      document.head.appendChild(jqueryScript);
    }
    
    if (!window.bootstrap) {
      const bootstrapScript = document.createElement('script');
      bootstrapScript.src = 'https://netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js';
      document.head.appendChild(bootstrapScript);
    }

    // Add VLab CSS if not already added
    if (!document.getElementById('vlab-bootstrap-css')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.id = 'vlab-bootstrap-css';
      bootstrapLink.rel = 'stylesheet';
      bootstrapLink.href = '/bootstrap/css/bootstrap.css';
      document.head.appendChild(bootstrapLink);

      const adminLTELink = document.createElement('link');
      adminLTELink.rel = 'stylesheet';
      adminLTELink.href = '/dist/css/AdminLTE.css';
      document.head.appendChild(adminLTELink);

      const skinsLink = document.createElement('link');
      skinsLink.rel = 'stylesheet';
      skinsLink.href = '/dist/css/skins/_all-skins.min.css';
      document.head.appendChild(skinsLink);

      const faLink = document.createElement('link');
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css';
      document.head.appendChild(faLink);
    }
  }, []);

  const menuItems = [
    { id: 'aim', path: '/', label: 'Aim', icon: 'fa-files-o' },
    { id: 'theory', path: '/theory', label: 'Theory', icon: 'fa-files-o' },
    { id: 'pretest', path: '/pretest', label: 'Pre Test', icon: 'fa-files-o' },
    { id: 'procedure', path: '/procedure', label: 'Procedure', icon: 'fa-files-o' },
    { id: 'simulation', path: '/simulation', label: 'Simulation', icon: 'fa-laptop' },
    { id: 'posttest', path: '/posttest', label: 'Post Test', icon: 'fa-files-o' },
    { id: 'references', path: '/references', label: 'References', icon: 'fa-files-o' },
  ];

  return (
    <div className="hold-transition skin-blue sidebar-mini">
      {/* Top Navigation Bar */}
      <div className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-ex-collapse" id="toggle_nav">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              <span style={{fontSize: '1.5em', fontWeight: 'bold'}}>Virtual Seismology Lab</span>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="navbar-ex-collapse"></div>
        </div>
      </div>

      {/* Main Wrapper */}
      <div className="wrapper">
        {/* Header */}
        <header className="main-header">
          <Link to="/" className="logo" style={{backgroundColor: '#009dff', borderRight: 'solid', borderRightColor: '#1261A0'}}>
            <p align="center" style={{fontSize: '1em'}}><b>Seismicity Analysis Lab</b></p>
          </Link>
          
          <nav className="navbar navbar-static-top" style={{backgroundColor: '#009dff'}}>
            <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button" id="toggle_nav">
              <span className="sr-only">Toggle navigation</span>
            </a>
            <section className="content-header">
              <ol className="breadcrumb">
                <li>
                  <Link to="/"><i className="fa fa-dashboard"></i> Seismicity Lab</Link>
                </li>
                <li>
                  <a href="#">Earthquake Analysis</a>
                </li>
                <li className="active">{breadcrumbText}</li>
              </ol>
            </section>
          </nav>
        </header>

        {/* Left Sidebar */}
        <aside className="main-sidebar" style={{backgroundColor: '#1261A0'}}>
          <section className="sidebar">
            <form action="#" method="get" className="sidebar-form">
              <div className="input-group"></div>
            </form>
            
            <ul className="sidebar-menu" style={{backgroundColor: '#1261A0'}}>
              {menuItems.map((item) => (
                <li 
                  key={item.id}
                  className="treeview" 
                  id={item.id}
                  style={{
                    backgroundColor: activeSection === item.id ? '#009dff' : 'transparent'
                  }}
                >
                  <Link 
                    to={item.path} 
                    style={{color: 'white'}}
                    onMouseEnter={(e) => e.currentTarget.parentElement.style.backgroundColor = '#009dff'}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.parentElement.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <i className={`fa ${item.icon}`} style={{color: 'white'}}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Content */}
        <div className="content-wrapper">
          {children}
        </div>

        {/* Footer */}
        <footer className="main-footer">
          <h4 align="center">Lab contributed by Virtual Seismology Education Initiative</h4>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        body {
          font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        #toggle_nav:hover {
          background-color: #1261A0;
        }
      `}} />
    </div>
  );
}

function VLabWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Aim />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/pretest" element={<PreTest />} />
        <Route path="/procedure" element={<Procedure />} />
        <Route path="/simulation" element={<VLabLayout activeSection="simulation" breadcrumbText="Simulation"><Simulation /></VLabLayout>} />
        <Route path="/posttest" element={<PostTest />} />
        <Route path="/references" element={<References />} />
      </Routes>
    </Router>
  );
}

export { VLabLayout };
export default VLabWrapper;
