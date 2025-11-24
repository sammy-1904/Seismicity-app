// navigation.js - Handle navigation between sections

document.addEventListener('DOMContentLoaded', () => {
  // Handle hash changes for navigation
  function handleNavigation() {
    const hash = window.location.hash.substring(1) || 'aim';
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show selected section
    const activeSection = document.getElementById(hash);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
      li.style.backgroundColor = 'transparent';
    });
    
    const activeMenuItem = document.getElementById(`menu-${hash}`);
    if (activeMenuItem) {
      activeMenuItem.style.backgroundColor = '#009dff';
    }
    
    // Update breadcrumb
    const breadcrumbText = document.getElementById('breadcrumb-text');
    if (breadcrumbText) {
      breadcrumbText.textContent = hash.charAt(0).toUpperCase() + hash.slice(1);
    }
    
    // Special handling for simulation section
    if (hash === 'simulation' && window.map) {
      setTimeout(() => {
        window.map.invalidateSize();
      }, 100);
    }
  }
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleNavigation);
  
  // Initial navigation
  handleNavigation();
  
  // Handle sidebar menu hover effects
  document.querySelectorAll('.sidebar-menu li a').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const hash = window.location.hash.substring(1) || 'aim';
      const menuId = e.currentTarget.closest('li').id.replace('menu-', '');
      
      if (menuId !== hash) {
        e.currentTarget.closest('li').style.backgroundColor = '#009dff';
      }
    });
    
    link.addEventListener('mouseleave', (e) => {
      const hash = window.location.hash.substring(1) || 'aim';
      const menuId = e.currentTarget.closest('li').id.replace('menu-', '');
      
      if (menuId !== hash) {
        e.currentTarget.closest('li').style.backgroundColor = 'transparent';
      }
    });
  });
  
  // Handle sidebar toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('sidebar-collapse');
    });
  }

  // Initialize Bootstrap collapse for procedure accordion
  // Disable Bootstrap's built-in collapse to prevent conflicts
  if (typeof jQuery !== 'undefined' && jQuery.fn.collapse) {
    jQuery('[data-toggle="collapse"]').off('click.bs.collapse.data-api');
  }
  
  // Custom collapse functionality
  document.querySelectorAll('[data-toggle="collapse"]').forEach(trigger => {
    // Remove any existing event listeners
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);
    
    newTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        console.log('Toggling panel:', targetId);
        const isExpanded = target.classList.contains('in');
        
        // Close all other panels in the same accordion
        const parent = this.getAttribute('data-parent');
        if (parent) {
          document.querySelectorAll(`${parent} .panel-collapse.in`).forEach(panel => {
            if (panel !== target) {
              panel.classList.remove('in');
              console.log('Closing panel:', panel.id);
            }
          });
        }
        
        // Toggle current panel
        if (isExpanded) {
          target.classList.remove('in');
          console.log('Collapsed:', targetId);
        } else {
          target.classList.add('in');
          console.log('Expanded:', targetId);
        }
      }
      
      return false;
    }, true); // Use capture phase
  });
});
