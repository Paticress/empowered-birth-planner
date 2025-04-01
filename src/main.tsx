
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Declare the global variable for TypeScript
declare global {
  interface Window {
    __MAIN_EXECUTED?: boolean;
    ReactRouterDOM?: any;
    __FULL_APP_LOADED?: boolean;
    App?: React.ComponentType<any>;
    __appLoader?: () => void;
  }
}

// This is intentionally a non-module file for maximum compatibility
// It will be properly processed by Vite during build
(function() {
  console.log("Main.tsx - Application bootstrapping started");
  
  // Flag to track if main.tsx script has already executed
  if (typeof window !== 'undefined') {
    if (window.__MAIN_EXECUTED) {
      console.log("Main.tsx - Already executed, skipping initialization");
      return;
    }
    
    window.__MAIN_EXECUTED = true;
  }

  // Improved error handling function
  function handleGlobalError(message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    
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
    window.onerror = window.onerror || handleGlobalError;
  }

  // Import App dynamically to prevent module errors
  import('./App').then(module => {
    window.App = module.default;
    
    if (typeof window !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      console.log("Main.tsx - Rendering app from module import");
      
      // Use direct reference to imported App component
      const App = module.default;
      
      try {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.error("Main.tsx - Root element not found");
          return;
        }
        
        // Render the app
        ReactDOM.createRoot(rootElement).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        
        console.log("Main.tsx - App successfully rendered");
      } catch (error) {
        console.error("Main.tsx - Error rendering application:", error);
      }
    } else {
      console.log("Main.tsx - React or ReactDOM not available, deferring rendering");
    }
  }).catch(error => {
    console.error("Main.tsx - Error importing App:", error);
    
    // Create a simple app fallback
    const SimpleApp = () => {
      const routerAvailable = typeof window !== 'undefined' && window.ReactRouterDOM;
      
      if (routerAvailable) {
        // Use global react objects for compatibility
        return window.React.createElement(window.ReactRouterDOM.HashRouter, null,
          window.React.createElement(window.ReactRouterDOM.Routes, null,
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/', 
              element: window.React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true }) 
            }),
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/guia-online', 
              element: window.React.createElement('div', { className: "text-center py-8" },
                window.React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
                window.React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
                window.React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
              )
            })
          )
        );
      } else {
        return window.React.createElement('div', { className: "text-center py-8" },
          window.React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
          window.React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
          window.React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        );
      }
    };
    
    // Try to render basic fallback
    if (typeof window !== 'undefined' && typeof window.React !== 'undefined' && typeof window.ReactDOM !== 'undefined') {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        try {
          if (window.ReactDOM.createRoot) {
            window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
          } else {
            window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
          }
        } catch (renderError) {
          console.error("Main.tsx - Error rendering fallback:", renderError);
        }
      }
    }
  });
})();
