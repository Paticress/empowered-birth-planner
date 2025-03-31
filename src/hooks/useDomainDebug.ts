
import { useEffect } from 'react';

/**
 * Hook to log domain-related debugging information
 * Helps diagnose routing and domain configuration issues
 */
export const useDomainDebug = () => {
  useEffect(() => {
    // Only run in development or when a debug flag is set
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('debug') === 'true') {
      console.group('Domain Debug Information');
      console.log('Current URL:', window.location.href);
      console.log('Hostname:', window.location.hostname);
      console.log('Origin:', window.location.origin);
      console.log('Pathname:', window.location.pathname);
      console.log('Hash:', window.location.hash);
      console.log('Search:', window.location.search);
      console.log('Browser User Agent:', navigator.userAgent);
      
      // Check for cross-origin issues
      try {
        const domainTest = document.createElement('script');
        domainTest.src = '/domain-test.txt';
        domainTest.onload = () => console.log('Domain test file loaded successfully');
        domainTest.onerror = (e) => console.warn('Domain test file failed to load, possible CORS issue:', e);
        document.body.appendChild(domainTest);
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(domainTest);
        }, 1000);
      } catch (e) {
        console.error('Error during domain test:', e);
      }
      
      console.groupEnd();
    }
  }, []);
};

export default useDomainDebug;
