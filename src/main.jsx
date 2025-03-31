
// This is intentionally a non-module file for maximum compatibility
// It will be properly processed by Vite during build
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerSW';
import { useDomainDebug } from './hooks/useDomainDebug';

// Flag to track if main.tsx script has already executed
if (typeof window !== 'undefined') {
  window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;
}

// Create an exported variable to indicate module loading was successful
export const MODULE_LOAD_SUCCESS = true;

// Improved error handling function
function handleGlobalError(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  
  // Track errors for debugging
  if (typeof window !== 'undefined') {
    window.__APP_ERRORS = window.__APP_ERRORS || [];
    window.__APP_ERRORS.push({
      message: typeof message === 'string' ? message : 'Unknown error',
      source: source || 'unknown',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check if we're getting module-related errors
  if (typeof message === 'string' && 
      (message.includes('import.meta') || 
       message.includes('module') || 
       message.includes('MIME'))) {
    
    console.warn('Module/MIME error detected, falling back to compatibility mode');
    
    // Create a message in the root element
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>Carregando em modo alternativo...</h2>
          <p>Aguarde um momento enquanto carregamos a aplicação.</p>
        </div>
      `;
    }
    
    // Load the compatibility script
    const script = document.createElement('script');
    script.src = '/src/compat-entry.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    // Prevent further execution of this script
    return true;
  }
  
  return false;
}

// Set up global error handler
if (typeof window !== 'undefined') {
  window.onerror = handleGlobalError;
}

// Main app initialization
if (typeof window !== 'undefined' && !window.__MAIN_EXECUTED) {
  console.log("Main.jsx - Application bootstrapping started");
  
  if (typeof window !== 'undefined') {
    window.__MAIN_EXECUTED = true;
  }

  // Render function
  const renderApp = () => {
    console.log("Main.jsx - Rendering application to DOM");
    
    if (typeof document === 'undefined') {
      console.error("Main.jsx - Document is not defined, cannot render");
      return;
    }
    
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Main.jsx - Root element not found in DOM!");
      return;
    }
    
    try {
      // Wrap the App component with any required providers
      const WrappedApp = () => {
        // Use the domain debug hook to help diagnose issues
        useDomainDebug();
        return <App />;
      };
      
      const root = ReactDOM.createRoot(rootElement);
      
      // Render without StrictMode to avoid potential issues
      root.render(<WrappedApp />);
      console.log("Main.jsx - App rendered successfully");
    } catch (error) {
      console.error("Main.jsx - Critical error rendering application:", error);
      
      // Display error message and try to load fallback
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Aplicação não pôde ser carregada</h2>
          <p>Tentando modo alternativo...</p>
        </div>
      `;
      
      // Load the fallback script
      const fallbackScript = document.createElement('script');
      fallbackScript.src = '/src/compat-entry.js';
      fallbackScript.type = 'text/javascript';
      document.body.appendChild(fallbackScript);
    }
  };

  // Execute rendering based on document readiness
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderApp);
    } else {
      renderApp();
    }
  }
  
  // Register service worker after window load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      try {
        registerServiceWorker();
      } catch (error) {
        console.error("Error registering service worker:", error);
      }
    });
  }
}

// Add global type definition for TypeScript
declare global {
  interface Window {
    __MAIN_EXECUTED?: boolean;
    __APP_ERRORS?: Array<{
      message: string;
      source: string;
      timestamp: string;
    }>;
  }
}
