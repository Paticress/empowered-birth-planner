
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
    
    // Check for missing dependencies
    const missingDependencies = [];
    if (!hasReact) missingDependencies.push('React');
    if (!hasReactDOM) missingDependencies.push('ReactDOM');
    if (!hasReactRouter) missingDependencies.push('ReactRouterDOM');
    
    // Check for script load errors
    const scriptErrorsExist = document.querySelectorAll('script[onerror]').length > 0;
    
    // Check for CORS issues
    const corsErrors = (window as any).__APP_ERRORS?.filter(
      (err: any) => err.message?.includes('CORS') || err.message?.includes('cross-origin')
    ) || [];
    
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
      missingDependencies,
      scriptErrorsExist,
      corsErrors: corsErrors.length > 0,
      appErrors: appErrors.length,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    // Log the debug information
    console.log('Domain Debug Information:', debugReport);
    
    // Check for CORS issues and try to resolve them
    if (corsErrors.length > 0) {
      console.warn('CORS issues detected. Attempting to resolve...');
      
      // Load the proxy script if not already loaded
      if (!(window as any).__PROXY_LOADED) {
        try {
          const proxyScript = document.createElement('script');
          proxyScript.src = '/proxy.js';
          proxyScript.onload = () => {
            console.log('CORS proxy helper loaded successfully');
            (window as any).__PROXY_LOADED = true;
          };
          document.head.appendChild(proxyScript);
        } catch (err) {
          console.error('Failed to load CORS proxy helper:', err);
        }
      }
    }
    
    // Check specific issues when running in iframe
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
      
      // Add specific iframe friendly classes
      document.body.classList.add('in-iframe');
      
      // Send height updates to parent
      const sendHeight = () => {
        try {
          const height = document.body.scrollHeight;
          window.parent.postMessage({ 
            type: 'resize', 
            height, 
            source: 'energia-materna-app'
          }, '*');
        } catch (e) {
          console.error('Error sending height to parent:', e);
        }
      };
      
      // Send height on load and when window resizes
      sendHeight();
      window.addEventListener('resize', sendHeight);
      
      // Create a MutationObserver to detect DOM changes
      const observer = new MutationObserver(sendHeight);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
      
      return () => {
        window.removeEventListener('resize', sendHeight);
        observer.disconnect();
      };
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
