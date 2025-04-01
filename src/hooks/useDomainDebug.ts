
import { useEffect } from 'react';

/**
 * A hook to help debug domain/hosting issues
 * Logs useful information about the current environment
 */
export const useDomainDebug = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return; // Only run in production
    }
    
    console.log('Domain Debug Information:');
    console.log('URL:', window.location.href);
    console.log('Protocol:', window.location.protocol);
    console.log('Hostname:', window.location.hostname);
    console.log('Pathname:', window.location.pathname);
    console.log('Hash:', window.location.hash);
    console.log('User Agent:', navigator.userAgent);
    
    // Check if we're on the custom domain
    const isCustomDomain = window.location.hostname === 'planodeparto.energiamaterna.com.br';
    console.log('Is Custom Domain:', isCustomDomain);
    
    // Check if service worker is supported
    console.log('Service Worker Supported:', 'serviceWorker' in navigator);
    
    try {
      // Test CORS with a simple fetch to own domain
      fetch('/')
        .then(() => console.log('Self-domain fetch succeeded'))
        .catch(err => console.error('Self-domain fetch failed:', err));
    } catch (error) {
      console.error('Error in domain debug:', error);
    }
  }, []);
};
