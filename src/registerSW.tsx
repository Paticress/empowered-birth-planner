
/**
 * Simplified Service Worker Registration
 */

// Register the service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log('Attempting to register service worker...');
        
        // Use an absolute path starting with /
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          type: 'classic' // Use classic type instead of module
        });
        
        console.log('Service worker registered successfully:', registration.scope);
      } catch (error) {
        console.error('Service worker registration failed:', error);
        // Don't let service worker errors block the main application
      }
    });
  } else {
    console.log('Service workers are not supported in this browser');
  }
};

// Simple update function
export const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
};

// Unregister function (for troubleshooting)
export const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      return true;
    } catch (error) {
      console.error('Error unregistering service workers:', error);
      return false;
    }
  }
  return false;
};
