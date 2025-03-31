
import { useEffect } from 'react';

/**
 * Hook para auxiliar no diagnóstico de problemas de domínio e incorporação
 * Adiciona informações úteis para debug de problemas de CORS e iframe
 */
export function useDomainDebug() {
  useEffect(() => {
    // Log environment information
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isDev = process.env.NODE_ENV === 'development';
    const isInIframe = window !== window.parent;
    const protocol = window.location.protocol;

    // Check for common issues
    const hasHashRouter = window.location.hash !== '';
    const hasReactRouter = !!(window as any).ReactRouterDOM;
    const hasReact = !!(window as any).React;
    const hasReactDOM = !!(window as any).ReactDOM;
    
    // Collect error information if available
    const appErrors = (window as any).__APP_ERRORS || [];
    
    // Create debug report
    const debugReport = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
      hash: window.location.hash,
      hostname: window.location.hostname,
      protocol,
      isLocalhost,
      isDev,
      isInIframe,
      userAgent: navigator.userAgent,
      hasHashRouter,
      hasReactRouter,
      hasReact,
      hasReactDOM,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      appErrors
    };
    
    // Log the debug information
    console.log('Domain Debug Information:', debugReport);
    
    // Check specific issues
    if (isInIframe) {
      console.log('Running inside an iframe - checking CORS policies');
      
      // Test postMessage to parent
      try {
        window.parent.postMessage({ 
          type: 'debug', 
          source: 'energia-materna-app',
          message: 'Testing parent communication'
        }, '*');
        console.log('Test message sent to parent window');
      } catch (error) {
        console.error('Error communicating with parent window:', error);
      }
    }
    
    if (protocol !== 'https:' && !isLocalhost) {
      console.warn('Running on non-HTTPS protocol, this may cause issues with secure features and iframe embedding');
    }
    
    // Return cleanup function
    return () => {
      console.log('Domain debug hook unmounted');
    };
  }, []);
  
  return null;
}

export default useDomainDebug;
