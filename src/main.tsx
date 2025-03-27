
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerSW.tsx';

console.log("Main.tsx - Application bootstrapping started");

// Make sure the DOM is fully loaded before rendering
const renderApp = () => {
  console.log("Main.tsx - Rendering application to DOM");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Main.tsx - Root element not found in DOM!");
    return;
  }
  
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Main.tsx - React root created and App rendered");
  } catch (error) {
    console.error("Main.tsx - Error rendering application:", error);
  }
};

// Register the service worker when the window is loaded
window.addEventListener('load', () => {
  console.log("Main.tsx - Window loaded, registering service worker");
  registerServiceWorker();
  console.log("Main.tsx - Service worker registration initiated");
});

// Execute rendering
console.log("Main.tsx - Initializing application...");
renderApp();
