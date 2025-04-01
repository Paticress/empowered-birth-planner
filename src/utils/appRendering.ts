
// Application rendering utilities
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { renderSimpleLoadingApp } from './errorHandling';

console.log("Loading application rendering utilities");

/**
 * Renders the App component using modern React techniques with fallbacks
 * @param App - The main App component to render
 */
export function renderApp(App: React.ComponentType): void {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    // Render the app using the correct ReactDOM client API
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        React.createElement(
          React.StrictMode,
          null,
          React.createElement(App)
        )
      );
      console.log("App successfully rendered with modern API");
    } catch (modernError) {
      console.error("Error using modern ReactDOM API:", modernError);
      
      // Fallback to legacy ReactDOM.render if available
      if (typeof (ReactDOM as any).render === 'function') {
        console.log("Falling back to legacy ReactDOM.render");
        (ReactDOM as any).render(
          React.createElement(
            React.StrictMode,
            null,
            React.createElement(App)
          ),
          rootElement
        );
      } else if (window.ReactDOM && typeof window.ReactDOM.render === 'function') {
        // Use global ReactDOM as last resort
        console.log("Falling back to global ReactDOM.render");
        window.ReactDOM.render(
          React.createElement(
            React.StrictMode,
            null,
            React.createElement(App)
          ),
          rootElement
        );
      } else {
        throw new Error("No compatible ReactDOM render method available");
      }
    }
    
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Error rendering application:", error);
    renderFallbackUI();
  }
}

/**
 * Renders a fallback UI when the main app fails to load
 */
export function renderFallbackUI(): void {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  try {
    const SimpleApp = renderSimpleLoadingApp();
    
    if (typeof ReactDOM.createRoot === 'function') {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(SimpleApp));
    } else if (typeof (ReactDOM as any).render === 'function') {
      (ReactDOM as any).render(React.createElement(SimpleApp), rootElement);
    } else if (window.ReactDOM && typeof window.ReactDOM.render === 'function') {
      window.ReactDOM.render(React.createElement(SimpleApp), rootElement);
    } else {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>Erro ao carregar</h2>
          <p>Não foi possível inicializar o React. Por favor, tente novamente mais tarde.</p>
        </div>
      `;
    }
  } catch (renderError) {
    console.error("Error rendering fallback UI:", renderError);
  }
}
