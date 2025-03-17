
import { toast } from '@/components/ui/use-toast';

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
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, notify user
                  toast({
                    title: "Atualização disponível",
                    description: "Uma nova versão está disponível. Recarregue a página para atualizar.",
                    duration: 5000,
                  });
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
      
      // Handle service worker communication
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('Message from Service Worker:', event.data);
      });
    });
  } else {
    console.log('Service Workers are not supported in this browser.');
  }
};

// Function to update the service worker when available
export const updateServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
};
