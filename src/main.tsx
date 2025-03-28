
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerSW.tsx';

// Enhanced error reporting
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Prevent the browser from showing the default error dialog
  event.preventDefault();
});

console.log("Main.tsx - Application bootstrapping started");

// Make sure the DOM is fully loaded before rendering
const renderApp = () => {
  console.log("Main.tsx - Rendering application to DOM");
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
window.addEventListener('load', () => {
  console.log("Main.tsx - Window loaded, registering service worker");
  try {
    registerServiceWorker();
    console.log("Main.tsx - Service worker registration initiated");
  } catch (error) {
    console.error("Main.tsx - Error registering service worker:", error);
  }
});

// Execute rendering immediately to avoid delay
console.log("Main.tsx - Initializing application...");
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
  console.log("Main.tsx - Waiting for DOMContentLoaded event");
} else {
  renderApp();
}
