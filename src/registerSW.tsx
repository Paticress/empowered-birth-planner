
/**
 * Service Worker Registration for PWA support
 * Optimized for GitHub Pages with custom domain
 */

// Determine if we're on the custom domain
const isCustomDomain = window.location.hostname === 'planodeparto.energiamaterna.com.br';
const basePath = isCustomDomain ? '/' : '/guia-plano-parto/'; // Adjust this to your repo name if not using custom domain

// Register the service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log('🔧 Attempting to register service worker...');
        
        // Use the appropriate scope based on the deployment environment
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('✅ Service worker registered successfully:', registration.scope);
        
        // Check if this is a new service worker
        if (registration.installing) {
          console.log('Service worker installing');
          
          // Inform about loading modules
          console.log('Service worker will load modules:');
          console.log('- /sw/config.js');
          console.log('- /sw/cacheManager.js');
          console.log('- /sw/strategies.js');
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
