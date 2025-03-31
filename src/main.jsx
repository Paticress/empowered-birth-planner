
// This file serves as a module entry point for modern browsers
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.jsx - Module entry point loaded');

// Make App available on window for non-module loading
if (typeof window !== 'undefined') {
  window.App = App;
}

// Prevent double initialization
if (window.__MAIN_JSX_EXECUTED) {
  console.log("Main.jsx - Application already initialized by module entry point");
} else {
  window.__MAIN_JSX_EXECUTED = true;
  console.log('Main.jsx - Using module entry point');

  // Initialize the application
  function initializeApp() {
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        console.log("Main.jsx - Rendering application to DOM");
        
        // Create root and render
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("Main.jsx - Application rendered successfully");
      } else {
        console.error('Main.jsx - Root element not found!');
      }
    } catch (error) {
      console.error("Main.jsx - Error initializing application:", error);
      // Display error message to user
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <h1>Erro ao carregar</h1>
            <p>Ocorreu um erro ao inicializar a aplicação</p>
            <p>Detalhes: ${error.message}</p>
            <p><a href="/" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
          </div>
        `;
      }
    }
  }

  // Execute initialization based on document readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}
