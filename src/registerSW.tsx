
/**
 * Simplified Service Worker Registration with improved error handling
 */

// Register the service worker
export const registerServiceWorker = () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }

  // Use a try-catch to prevent any service worker errors from affecting the main app
  try {
    window.addEventListener('load', async () => {
      try {
        console.log('Attempting to register service worker...');
        
        // Use an absolute path starting with / and set type as 'classic'
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          type: 'classic'
        });
        
        console.log('Service worker registered successfully:', registration.scope);
        
        // Add update checking
        setInterval(() => {
          registration.update().catch(err => {
            console.log('SW update check error (non-critical):', err);
          });
        }, 60 * 60 * 1000); // Check for updates every hour
      } catch (error) {
        console.error('Service worker registration failed:', error);
        // Don't let service worker errors block the main application
      }
    });
  } catch (outerError) {
    console.error('Error in service worker setup:', outerError);
  }
};

// Simple update function
export const updateServiceWorker = async () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.update();
    }
  } catch (error) {
    console.error('Error updating service worker:', error);
  }
};

// Unregister function (for troubleshooting)
export const unregisterServiceWorkers = async () => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

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
};
