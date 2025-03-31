
// This file serves as a module entry point for modern browsers
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Prevent double initialization
if (window.__MAIN_EXECUTED) {
  console.log("Main.jsx - Application already initialized");
} else {
  window.__MAIN_EXECUTED = true;
  console.log('Main.jsx - Using module entry point');

  // Initialize the application
  function initializeApp() {
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        console.log("Rendering application to DOM");
        ReactDOM.createRoot(rootElement).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("Application rendered successfully");
      } else {
        console.error('Root element not found!');
      }
    } catch (error) {
      console.error("Error initializing application:", error);
      // Display error message to user
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Ocorreu um erro ao inicializar a aplicação</p></div>';
      }
    }
  }

  // Execute initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}
