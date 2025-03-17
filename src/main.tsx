
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from './components/ui/toaster.tsx';
import './index.css'
import { registerServiceWorker } from './registerSW.ts';
import { HashRouter } from 'react-router-dom';

// Register service worker for offline capabilities
registerServiceWorker();

// Log para depuração
console.log("Inicializando aplicação...");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
    <Toaster />
  </React.StrictMode>,
)
