
// Service Worker Registration

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // First, check if we are on the production domain
      const isProduction = window.location.hostname === 'planodeparto.energiamaterna.com.br';
      const swPath = isProduction ? '/sw.js' : './sw.js';
      
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update()
          .then(() => console.log('Service Worker updated'))
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
      for (let registration of registrations) {
        registration.unregister().then(success => {
          console.log('SW unregistered:', success);
        }).catch(err => {
          console.error('Error unregistering SW:', err);
        });
      }
    });
  }
}
