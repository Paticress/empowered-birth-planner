
/**
 * Service Worker Registration for PWA support
 */

// Register the service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log('🔧 Attempting to register service worker...');
        
        // Use the appropriate scope based on the deployment environment
        const registration = await navigator.serviceWorker.register('./sw.js', {
          scope: '/',
          type: 'classic' // Explicitly set to classic to avoid module type issues
        });
        
        console.log('✅ Service worker registered successfully:', registration.scope);
        
        // Check if this is a new service worker
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed and waiting');
        } else if (registration.active) {
          console.log('Service worker active');
        }
        
        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHED_RESOURCES') {
            console.log(`Service worker cached ${event.data.count} resources`);
          }
        });
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
        // Don't let service worker errors block the main application
        console.warn('Continuing without service worker functionality');
      }
    });
  } else {
    console.log('❌ Service workers are not supported in this browser');
  }
};

// Check for service worker updates
export const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('Checking for updates on service worker with scope:', registration.scope);
        await registration.update();
        
        // Force skip waiting if there's a waiting service worker
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
};

// Function to unregister service workers (useful for troubleshooting)
export const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered:', registration.scope);
      }
      return registrations.length > 0;
    } catch (error) {
      console.error('Error unregistering service workers:', error);
      return false;
    }
  }
  return false;
};
