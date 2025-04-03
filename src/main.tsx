
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker, unregisterServiceWorker } from './registerSW.tsx';

// Performance monitoring with better error handling
const reportPerformance = () => {
  try {
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
  } catch (error) {
    console.error('Error collecting performance metrics:', error);
  }
};

// Improved service worker setup with better error handling
const setupServiceWorker = () => {
  try {
    // Check if we're in dev mode or debugging
    const isDevMode = process.env.NODE_ENV === 'development';
    const isDebugMode = new URLSearchParams(window.location.search).has('debug');
    
    if (isDevMode || isDebugMode) {
      // During development, unregister service workers to avoid caching issues
      console.log('Development mode: Unregistering service workers to prevent caching issues...');
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
      
      // Start update checking after initial load (with a longer delay to prioritize app startup)
      setTimeout(checkForUpdates, 10 * 60 * 1000);
    }
  } catch (error) {
    console.error('Service worker setup failed:', error);
  }
};

// Fix for hash-based routing for GitHub Pages
const fixHashRouting = () => {
  try {
    // Check if we have a hash route that needs to be fixed
    const { hash, pathname } = window.location;
    if (hash.startsWith('#/') && pathname === '/') {
      // Remove the hash and navigate to the clean path
      const path = hash.substring(1); // Remove the # character
      console.log(`Fixing hash route: ${hash} -> ${path}`);
      
      // Use history API to replace the URL without reloading
      window.history.replaceState(null, '', path);
    }
  } catch (error) {
    console.error('Error fixing hash routes:', error);
  }
};

// Initialize the app with better error handling
window.addEventListener('load', () => {
  try {
    // Fix any hash-based routes first
    fixHashRouting();
    
    // Then measure and report performance
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
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
});

// Initialize React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
