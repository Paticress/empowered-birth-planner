
import React from 'react';
import { toast } from '@/components/ui/use-toast';

// Track whether we've already shown the update toast to avoid duplicates
let updateToastShown = false;

// Use a debounced version of the update checker to prevent multiple checks
let updateTimeout: number | null = null;

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
          
          // Check for updates more efficiently
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
                    action: (
                      <button
                        onClick={() => forceUpdate()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-xs font-medium"
                      >
                        Update Now
                      </button>
                    )
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
      
      // Handle service worker communication with improved error handling
      navigator.serviceWorker.addEventListener('message', event => {
        if (!event.data) return;
        
        console.log('Message from Service Worker:', event.data);
        
        // Handle specific message types
        if (event.data.type === 'CACHED_RESOURCES') {
          toast({
            title: "Ready for Offline Use",
            description: `${event.data.count} resources cached for offline use.`,
            duration: 3000,
          });
        } else if (event.data.type === 'ERROR') {
          toast({
            title: "Service Worker Error",
            description: event.data.message || "An error occurred in the service worker",
            duration: 5000,
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

// Function to update the service worker with improved debouncing
let updateInProgress = false;
export const updateServiceWorker = () => {
  if ('serviceWorker' in navigator && !updateInProgress) {
    // Cancel any pending update checks
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    updateInProgress = true;
    
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
      
      // Don't show a toast for routine checks - only show when user explicitly requests
      // toast({
      //   title: "Checking for Updates",
      //   description: "Looking for new content...",
      //   duration: 2000,
      // });
      
      // Reset flag after delay
      updateTimeout = window.setTimeout(() => {
        updateInProgress = false;
      }, 60000); // Prevent checking more than once every minute
    }).catch(error => {
      console.error('Update check failed:', error);
      updateInProgress = false;
    });
  }
};

// Function to force refresh and apply updates - improved reliability
export const forceUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Send message to worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Give the worker time to activate and take control
        window.setTimeout(() => {
          // Force a hard reload to ensure new service worker takes over
          window.location.reload();
        }, 500);
      } else {
        // Just reload if no waiting worker
        window.location.reload();
      }
    }).catch(error => {
      console.error('Force update failed:', error);
      // Try a normal reload as fallback
      window.location.reload();
    });
  } else {
    // Fallback for browsers without service worker support
    window.location.reload();
  }
};
