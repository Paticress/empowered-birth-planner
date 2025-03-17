
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker } from './registerSW.ts';

// Performance monitoring
const reportPerformance = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    const metrics = {};
    const navigationEntries = performance.getEntriesByType('navigation');
    
    if (navigationEntries && navigationEntries.length) {
      const nav = navigationEntries[0];
      metrics['loadTime'] = nav.loadEventEnd - nav.startTime;
      metrics['domContentLoaded'] = nav.domContentLoadedEventEnd - nav.startTime;
      metrics['firstContentfulPaint'] = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
    }
    
    console.log('Performance metrics:', metrics);
  }
};

// Register service worker for offline capabilities
registerServiceWorker();

// Check for updates on schedule
const checkForUpdates = () => {
  updateServiceWorker();
  
  // Adaptive update interval - less frequent checks when app is stable
  const nextInterval = localStorage.getItem('app-stable') ? 
    120 * 60 * 1000 : // 2 hours if app is stable
    30 * 60 * 1000;   // 30 minutes on new deployments
  
  setTimeout(checkForUpdates, nextInterval);
};

// Start update checking after initial load - wait for initial load to complete
window.addEventListener('load', () => {
  // Measure and report performance
  setTimeout(reportPerformance, 3000);
  
  // Mark app as stable after first week of use
  const firstUse = localStorage.getItem('first-use-date');
  if (!firstUse) {
    localStorage.setItem('first-use-date', Date.now().toString());
  } else if (!localStorage.getItem('app-stable')) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(firstUse) > oneWeek) {
      localStorage.setItem('app-stable', 'true');
    }
  }
  
  // Start update checking
  setTimeout(checkForUpdates, 5 * 60 * 1000);
});

// Initialize React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
