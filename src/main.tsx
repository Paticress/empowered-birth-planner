
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker, unregisterServiceWorker } from './registerSW.tsx';

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
          
        // Redirect to auth callback with token in hash format
        window.location.href = '/auth/callback#' + tokenPart;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error handling auth tokens:', error);
    return false;
  }
};

// If there's an auth token in the path or URL, handle it before React mounts
if (!handleAuthTokens()) {
  // Only mount React if we're not redirecting for auth handling
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// Register service worker only after app has started
window.addEventListener('load', () => {
  // Performance monitoring
  if (window.performance && 'getEntriesByType' in window.performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries && navigationEntries.length) {
      console.log('Page loaded in:', 
        (navigationEntries[0] as PerformanceNavigationTiming).loadEventEnd, 'ms');
    }
  }
  
  // Check if we're in dev mode
  if (process.env.NODE_ENV === 'development') {
    // During development, unregister service workers to avoid caching issues
    unregisterServiceWorker();
  } else {
    // In production, register the service worker
    registerServiceWorker();
    
    // Set up periodic updates for the service worker
    setInterval(() => {
      updateServiceWorker();
    }, 60 * 60 * 1000); // Check for updates every hour
  }
});
