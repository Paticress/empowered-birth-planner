
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerSW.tsx';

// Registrar o service worker quando a janela estiver carregada
window.addEventListener('load', () => {
  registerServiceWorker();
  console.log("Service worker registration initiated");
});

console.log("Initializing application...");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
