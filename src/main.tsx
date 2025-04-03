
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker, unregisterServiceWorker } from './registerSW.tsx';

// Performance monitoring
const reportPerformance = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    const metrics: Record<string, number> = {};
    const navigationEntries = performance.getEntriesByType('navigation');
    
    if (navigationEntries && navigationEntries.length) {
      // Cast to PerformanceNavigationTiming to access navigation-specific properties
      const nav = navigationEntries[0] as PerformanceNavigationTiming;
      metrics['loadTime'] = nav.loadEventEnd - nav.startTime;
      metrics['domContentLoaded'] = nav.domContentLoadedEventEnd - nav.startTime;
      
      // Get first contentful paint if available
      const paintEntries = performance.getEntriesByName('first-contentful-paint');
      if (paintEntries.length > 0) {
        metrics['firstContentfulPaint'] = paintEntries[0].startTime;
      }
    }
    
    console.log('Performance metrics:', metrics);
  }
};

// Try to handle service worker errors gracefully
const setupServiceWorker = () => {
  try {
    // Check if we're in dev mode or debugging
    const isDevMode = process.env.NODE_ENV === 'development';
    const isDebugMode = new URLSearchParams(window.location.search).has('debug');
    
    if (isDevMode || isDebugMode) {
      // During development, unregister service workers to avoid caching issues
      console.log('Development mode: Unregistering service workers...');
      unregisterServiceWorker();
    } else {
      // In production, register the service worker
      console.log('Production mode: Registering service worker...');
      registerServiceWorker();
      
      // Set up periodic updates for the service worker
      const checkForUpdates = () => {
        updateServiceWorker();
        
        // Adaptive update interval - less frequent checks when app is stable
        const nextInterval = localStorage.getItem('app-stable') ? 
          120 * 60 * 1000 : // 2 hours if app is stable
          30 * 60 * 1000;   // 30 minutes on new deployments
        
        setTimeout(checkForUpdates, nextInterval);
      };
      
      // Start update checking after initial load
      setTimeout(checkForUpdates, 5 * 60 * 1000);
    }
  } catch (error) {
    console.error('Service worker setup failed:', error);
  }
};

// Initialize the app
window.addEventListener('load', () => {
  // Measure and report performance
  setTimeout(reportPerformance, 3000);
  
  // Set up service worker (with error handling)
  setupServiceWorker();
  
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
});

// Initialize React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
