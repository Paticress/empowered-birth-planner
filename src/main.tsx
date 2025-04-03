
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

// Special handling for auth tokens in the URL path
const handleAuthTokens = () => {
  try {
    const fullUrl = window.location.href;
    const pathname = window.location.pathname;
    
    // Check if auth token is in direct path or unusual format
    if (pathname.includes('access_token=') || 
        (fullUrl.includes('access_token=') && 
         !window.location.hash.includes('access_token=') && 
         !window.location.search.includes('access_token='))) {
      
      console.log("Auth token detected in URL path - needs fixing");
      
      // Extract token part
      const tokenIndex = pathname.includes('access_token=') 
        ? pathname.indexOf('access_token=')
        : fullUrl.indexOf('access_token=');
        
      if (tokenIndex !== -1) {
        const tokenPart = pathname.includes('access_token=')
          ? pathname.substring(tokenIndex)
          : fullUrl.substring(tokenIndex);
          
        // Redirect to correct format
        window.location.href = '/acesso-plano#' + tokenPart;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error handling auth tokens:', error);
    return false;
  }
};

// Initialize the app with better error handling
window.addEventListener('load', () => {
  try {
    // First check for auth tokens that need fixing
    if (handleAuthTokens()) {
      // If we're redirecting for auth, don't continue with normal init
      return;
    }
    
    // Then measure and report performance
    setTimeout(reportPerformance, 3000);
    
    // Set up service worker
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
