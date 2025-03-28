
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
    const rootElement = document.getElementById('root');
    if (rootElement) {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } else {
      console.error('Root element not found!');
    }
  }

  // Execute initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}
