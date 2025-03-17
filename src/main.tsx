
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, updateServiceWorker } from './registerSW.ts';

// Register service worker for offline capabilities
registerServiceWorker();

// Check for updates periodically
const checkForUpdates = () => {
  updateServiceWorker();
  // Check for updates every 60 minutes
  setTimeout(checkForUpdates, 60 * 60 * 1000);
};

// Start update checking after initial load
setTimeout(checkForUpdates, 5 * 60 * 1000);

// Logs for debugging
console.log("Initializing application...");
console.log("Entry point loaded: main.tsx");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
