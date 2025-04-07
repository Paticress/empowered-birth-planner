
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker, unregisterServiceWorker } from './registerSW.tsx';
import { supabase } from '@/integrations/supabase/client';

// Special handling for auth tokens in the URL path
const handleAuthTokens = async () => {
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
    
    // Check for hash-based tokens to ensure they're properly processed
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      console.log("Hash-based auth token detected, ensuring processing");
      
      try {
        // Try to process the hash directly
        const hashParams = window.location.hash.substring(1);
        console.log("Processing hash auth parameters");
        
        // Extract tokens
        const access_token = extractParam(hashParams, 'access_token');
        const refresh_token = extractParam(hashParams, 'refresh_token');
        
        if (access_token && refresh_token) {
          // Set the session explicitly
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });
          
          if (error) {
            console.error("Error setting session from hash:", error);
          } else if (data.session) {
            console.log("Session set successfully from hash parameters:", data.session.user?.email);
            
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error("Error processing hash auth parameters:", error);
      }
      
      // Always clean up URL regardless of success/failure
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Additionally, always verify session on page load
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Verified session on page load:", data.session.user?.email);
      }
    } catch (error) {
      console.error("Error verifying session on page load:", error);
    }
    
    return false;
  } catch (error) {
    console.error('Error handling auth tokens:', error);
    return false;
  }
};

// Helper function to extract parameters from query string
function extractParam(query: string, paramName: string): string {
  const startIndex = query.indexOf(`${paramName}=`);
  if (startIndex === -1) return '';
  
  let endIndex = query.indexOf('&', startIndex);
  if (endIndex === -1) endIndex = query.length;
  
  return query.substring(startIndex + paramName.length + 1, endIndex);
}

// Initialize app only after handling potential auth tokens
const initializeApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

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
};

// Run the token handling logic first, then initialize the app
(async () => {
  const shouldRedirect = await handleAuthTokens();
  if (!shouldRedirect) {
    // Only mount React if we're not redirecting for auth handling
    initializeApp();
  }
})();
