
// Service Worker Registration

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      try {
        // First, check if we are on the production domain
        const isProduction = window.location.hostname === 'planodeparto.energiamaterna.com.br';
        const swPath = isProduction ? '/sw.js' : './sw.js';
        
        console.log("Registering service worker at path:", swPath);
        
        navigator.serviceWorker.register(swPath)
          .then(registration => {
            console.log('SW registered successfully: ', registration.scope);
          })
          .catch(registrationError => {
            console.error('SW registration failed: ', registrationError);
          });
      } catch (error) {
        // Don't let service worker errors break the application
        console.error('Error during service worker registration:', error);
      }
    });
  }
}

export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update()
          .then(() => console.log('Service Worker updated successfully'))
          .catch(err => console.error('Error updating Service Worker:', err));
      })
      .catch(err => {
        console.error('Service Worker not ready:', err);
      });
  }
}

// A helper function to unregister service workers - useful during development
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log(`Found ${registrations.length} service worker registrations to unregister`);
        for (let registration of registrations) {
          registration.unregister().then(success => {
            console.log('SW unregistered:', success);
          }).catch(err => {
            console.error('Error unregistering SW:', err);
          });
        }
      } else {
        console.log("No service worker registrations found to unregister");
      }
    });
  }
}
