
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
        } else if (registration.waiting) {
          console.log('Service worker installed and waiting');
        } else if (registration.active) {
          console.log('Service worker active');
        }
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
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
};
