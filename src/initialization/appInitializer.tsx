
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { handleAuthTokens } from '../utils/auth/handleAuthTokens';
import { logNavigationInfo, logPerformanceMetrics } from '../utils/navigation/detectionUtils';
import { setupServiceWorker } from '../utils/serviceWorker/serviceWorkerManager';
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize React application
 */
const initializeApp = (): void => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Register service worker only after app has started
  window.addEventListener('load', () => {
    // Performance monitoring
    logPerformanceMetrics();
    
    // Setup service worker based on environment
    setupServiceWorker();
  });
};

/**
 * Bootstraps the application, handling auth and initialization
 */
export const bootstrapApplication = async (): Promise<void> => {
  // Log navigation information on startup
  logNavigationInfo();
  
  // First, try to verify and restore any existing session
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      console.log("Existing session found on initial load:", data.session.user?.email);
      localStorage.setItem('birthPlanLoggedIn', 'true');
      if (data.session.user?.email) {
        localStorage.setItem('birthPlanEmail', data.session.user.email);
      }
    }
  } catch (error) {
    console.error("Error checking initial session:", error);
  }
  
  // Then, handle any auth tokens in the URL
  const shouldRedirect = await handleAuthTokens();
  if (!shouldRedirect) {
    // Only mount React if we're not redirecting for auth handling
    initializeApp();
  }
};
