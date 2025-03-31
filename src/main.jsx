
// This file serves as a module entry point for modern browsers
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';  // Import from App.tsx instead of App.js
import './index.css';

// Make App available on the window for non-module loading
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
        
        // Check if React and ReactDOM are available
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
          console.error("Main.jsx - React or ReactDOM is not available, trying to load from CDN");
          
          // Load React from CDN if not already available
          const reactScript = document.createElement('script');
          reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
          reactScript.crossOrigin = 'anonymous';
          
          // Load ReactDOM after React loads
          reactScript.onload = () => {
            const reactDOMScript = document.createElement('script');
            reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
            reactDOMScript.crossOrigin = 'anonymous';
            
            // Retry rendering after ReactDOM loads
            reactDOMScript.onload = () => {
              console.log("Main.jsx - React and ReactDOM loaded from CDN, retrying render");
              renderApp(rootElement);
            };
            
            document.body.appendChild(reactDOMScript);
          };
          
          document.body.appendChild(reactScript);
          return;
        }
        
        renderApp(rootElement);
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

  // Separate rendering function for better error handling
  function renderApp(rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("Main.jsx - Application rendered successfully");
    } catch (error) {
      console.error("Main.jsx - Error during rendering:", error);
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h1>Erro ao renderizar</h1>
          <p>Ocorreu um erro ao renderizar a aplicação</p>
          <p>Detalhes: ${error.message}</p>
          <p><a href="/" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
        </div>
      `;
    }
  }

  // Execute initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}
