
import { registerServiceWorker, updateServiceWorker, unregisterServiceWorker } from '../../registerSW';

/**
 * Set up service worker based on environment
 */
export const setupServiceWorker = (): void => {
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
};
