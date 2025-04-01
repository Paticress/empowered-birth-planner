
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Declare the global variable for TypeScript
declare global {
  interface Window {
    __MAIN_EXECUTED?: boolean;
    ReactRouterDOM?: any;
    __FULL_APP_LOADED?: boolean;
    App?: React.ComponentType<any>;
    __appLoader?: () => void;
    React?: typeof React;
    ReactDOM?: any; // Use 'any' for the global ReactDOM for maximum flexibility
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
    
    if (typeof window !== 'undefined') {
      console.log("Main.tsx - Rendering app from module import");
      
      // Use direct reference to imported App component
      const App = module.default;
      
      try {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.error("Main.tsx - Root element not found");
          return;
        }
        
        // Render the app using the correct ReactDOM client API
        try {
          const root = ReactDOM.createRoot(rootElement);
          root.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>
          );
          console.log("Main.tsx - App successfully rendered with modern API");
        } catch (modernError) {
          console.error("Main.tsx - Error using modern ReactDOM API:", modernError);
          
          // Fallback to legacy ReactDOM.render if available
          if (typeof (ReactDOM as any).render === 'function') {
            console.log("Main.tsx - Falling back to legacy ReactDOM.render");
            (ReactDOM as any).render(
              <React.StrictMode>
                <App />
              </React.StrictMode>,
              rootElement
            );
          } else if (window.ReactDOM && typeof window.ReactDOM.render === 'function') {
            // Use global ReactDOM as last resort
            console.log("Main.tsx - Falling back to global ReactDOM.render");
            window.ReactDOM.render(
              <React.StrictMode>
                <App />
              </React.StrictMode>,
              rootElement
            );
          } else {
            throw new Error("No compatible ReactDOM render method available");
          }
        }
        
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
        return React.createElement(window.ReactRouterDOM.HashRouter, null,
          React.createElement(window.ReactRouterDOM.Routes, null,
            React.createElement(window.ReactRouterDOM.Route, { 
              path: '/', 
              element: React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true }) 
            }),
            React.createElement(window.ReactRouterDOM.Route, { 
              path: '/guia-online', 
              element: React.createElement('div', { className: "text-center py-8" },
                React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
                React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
                React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
              )
            })
          )
        );
      } else {
        return React.createElement('div', { className: "text-center py-8" },
          React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
          React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
          React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
        );
      }
    };
    
    // Try to render basic fallback
    if (typeof window !== 'undefined') {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        try {
          // Check if we can use modern ReactDOM API
          if (typeof ReactDOM.createRoot === 'function') {
            const root = ReactDOM.createRoot(rootElement);
            root.render(React.createElement(SimpleApp));
          } else if (typeof (ReactDOM as any).render === 'function') {
            // Fallback for older versions or when using the legacy ReactDOM import
            console.warn("Main.tsx - ReactDOM.createRoot not available, using direct render fallback");
            (ReactDOM as any).render(React.createElement(SimpleApp), rootElement);
          } else if (window.ReactDOM && typeof window.ReactDOM.render === 'function') {
            // Fallback to global ReactDOM
            console.warn("Main.tsx - Using global ReactDOM.render fallback");
            window.ReactDOM.render(React.createElement(SimpleApp), rootElement);
          } else {
            console.error("Main.tsx - No React rendering method available");
            rootElement.innerHTML = `
              <div style="text-align: center; padding: 20px;">
                <h2>Erro ao carregar</h2>
                <p>Não foi possível inicializar o React. Por favor, tente novamente mais tarde.</p>
              </div>
            `;
          }
        } catch (renderError) {
          console.error("Main.tsx - Error rendering fallback:", renderError);
        }
      }
    }
  });
})();
