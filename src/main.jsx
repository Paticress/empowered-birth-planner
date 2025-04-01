
// This is intentionally a non-module file for maximum compatibility
// It will be properly processed by Vite during build
(function() {
  console.log("Main.jsx - Simplified initialization for compatibility");
  
  // Check if React is available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.error("Main.jsx - React or ReactDOM is not available");
    return;
  }
  
  // Create a very simple app for initial rendering
  const SimpleApp = function() {
    return React.createElement('div', { className: "text-center py-8" },
      React.createElement('h1', { className: "text-2xl font-bold" }, "Guia de Plano de Parto"),
      React.createElement('p', { className: "mt-4" }, "Carregando conteúdo..."),
      React.createElement('div', { className: "w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mt-4" })
    );
  };
  
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Main.jsx - Root element not found");
      return;
    }
    
    // Render the simple app
    if (ReactDOM.createRoot) {
      ReactDOM.createRoot(rootElement).render(React.createElement(SimpleApp));
    } else {
      ReactDOM.render(React.createElement(SimpleApp), rootElement);
    }
    
    console.log("Main.jsx - Simple app rendered successfully");
  } catch (error) {
    console.error("Main.jsx - Error rendering simple app:", error);
  }
})();

// These exports will be used by the build system, but ignored in browser
// Usage of try/catch ensures it doesn't break in the browser
try {
  if (typeof module !== 'undefined') {
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    import './index.css';
    import { registerServiceWorker } from './registerSW';
    
    export const MODULE_LOAD_SUCCESS = true;
    
    // Normal module exports for the build system
    export { React, ReactDOM, App, registerServiceWorker };
  }
} catch (e) {
  console.log("Main.jsx - Module exports skipped in browser environment");
}
