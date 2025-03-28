
// This file serves as a module entry point for modern browsers
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Using module main.jsx entry point');

// Check if we're in a modern browser environment
const isModernBrowser = typeof window !== 'undefined' && 'noModule' in HTMLScriptElement.prototype;

if (isModernBrowser) {
  console.log('Modern browser detected, using ES modules');
  
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
} else {
  console.warn('Legacy browser detected - will use fallback script');
}
