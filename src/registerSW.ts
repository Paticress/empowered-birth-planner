
import { toast } from '@/components/ui/use-toast';

// Track whether we've already shown the update toast to avoid duplicates
let updateToastShown = false;

/**
 * Registers the service worker for offline capabilities
 * Includes error handling and update notification
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller && !updateToastShown) {
                  // New content is available, notify user (only once)
                  updateToastShown = true;
                  toast({
                    title: "Update Available",
                    description: "A new version is available. Refresh the page to update.",
                    duration: 10000,
                  });
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
          toast({
            title: "Offline Mode Unavailable",
            description: "Could not enable offline mode. Some features may be unavailable without internet connection.",
            duration: 5000,
          });
        });
      
      // Handle service worker communication
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('Message from Service Worker:', event.data);
        
        // Handle specific message types
        if (event.data && event.data.type === 'CACHED_RESOURCES') {
          toast({
            title: "Ready for Offline Use",
            description: `${event.data.count} resources cached for offline use.`,
            duration: 3000,
          });
        }
      });
    });
  } else {
    console.log('Service Workers are not supported in this browser.');
    toast({
      title: "Limited Offline Support",
      description: "Your browser doesn't support offline mode. An internet connection will be required.",
      duration: 5000,
    });
  }
};

// Function to update the service worker when available - with debounce
let updateInProgress = false;
export const updateServiceWorker = () => {
  if ('serviceWorker' in navigator && !updateInProgress) {
    updateInProgress = true;
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
      toast({
        title: "Checking for Updates",
        description: "Looking for new content...",
        duration: 2000,
      });
      // Reset flag after delay
      setTimeout(() => {
        updateInProgress = false;
      }, 30000); // Prevent checking more than once every 30 seconds
    });
  }
};

// Function to force refresh and apply updates
export const forceUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Send message to worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Give the worker time to activate
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Just reload if no waiting worker
        window.location.reload();
      }
    });
  }
};
