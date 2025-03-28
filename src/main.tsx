
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerSW';

// Flag to track if main.tsx script has already executed
// This prevents double-rendering if both main.tsx and main.js load
if (typeof window !== 'undefined') {
  window.__MAIN_EXECUTED = window.__MAIN_EXECUTED || false;
}

// Enhanced error reporting
if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    
    // Safely check if message contains certain strings
    if (typeof message === 'string') {
      if (message.includes('import.meta') || message.includes('module')) {
        console.warn('Module error detected, falling back to non-module version');
        
        // Load the fallback script if not already loaded
        if (!window.__FALLBACK_LOADED) {
          window.__FALLBACK_LOADED = true;
          
          const fallbackScript = document.createElement('script');
          fallbackScript.src = '/src/main.js';
          fallbackScript.type = 'text/javascript';
          document.body.appendChild(fallbackScript);
        }
        
        // Prevent further execution
        return true;
      }
    }
    
    return false;
  };
}

// Skip execution if already handled by main.js
if (typeof window !== 'undefined' && window.__MAIN_EXECUTED) {
  console.log("Main.tsx - Application already initialized by another entry point");
} else {
  if (typeof window !== 'undefined') {
    window.__MAIN_EXECUTED = true;
  }
  console.log("Main.tsx - Application bootstrapping started");

  // Make sure the DOM is fully loaded before rendering
  const renderApp = () => {
    console.log("Main.tsx - Rendering application to DOM");
    
    // Safety check for browser environment
    if (typeof document === 'undefined') {
      console.error("Main.tsx - Document is not defined, cannot render");
      return;
    }
    
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error("Main.tsx - Root element not found in DOM!");
      // Try to create one as a fallback
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      console.log("Main.tsx - Created root element as fallback");
      
      ReactDOM.createRoot(newRoot).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      return;
    }
    
    try {
      const root = ReactDOM.createRoot(rootElement);
      
      console.log("Main.tsx - React root created, ready to render App");
      
      // Render immediately
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("Main.tsx - App rendered successfully");
    } catch (error) {
      console.error("Main.tsx - Critical error rendering application:", error);
      
      // Fallback rendering without StrictMode as a last resort
      try {
        console.log("Main.tsx - Attempting fallback render without StrictMode");
        ReactDOM.createRoot(rootElement).render(<App />);
      } catch (fallbackError) {
        console.error("Main.tsx - Fallback rendering also failed:", fallbackError);
        
        // Display error to user
        rootElement.innerHTML = `
          <div style="padding: 20px; color: red; text-align: center;">
            <h2>Application Error</h2>
            <p>The application failed to load. Please try refreshing the page.</p>
            <pre style="text-align: left; background: #f5f5f5; padding: 10px; overflow: auto;">${error}</pre>
          </div>
        `;
      }
    }
  };

  // Register the service worker when the window is loaded
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      console.log("Main.tsx - Window loaded, registering service worker");
      try {
        registerServiceWorker();
        console.log("Main.tsx - Service worker registration initiated");
      } catch (error) {
        console.error("Main.tsx - Error registering service worker:", error);
      }
    });
  }

  // Execute rendering immediately to avoid delay
  console.log("Main.tsx - Initializing application...");
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderApp);
      console.log("Main.tsx - Waiting for DOMContentLoaded event");
    } else {
      renderApp();
    }
  } else {
    console.warn("Main.tsx - Document is not defined, skipping render");
  }
}

// Add a global type definition to avoid TypeScript errors
declare global {
  interface Window {
    __MAIN_EXECUTED?: boolean;
    __FALLBACK_LOADED?: boolean;
  }
}
