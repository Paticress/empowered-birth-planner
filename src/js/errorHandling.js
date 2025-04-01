
// Error handling utilities
console.log('Error handling utilities initialized');

/**
 * Show error message in the root element
 * @param {string} message - Error message to display
 */
function showError(message) {
  console.error("Application error:", message);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h1>Erro ao carregar</h1>
        <p>${message}</p>
        <p><a href="/" style="color: #0066ff; text-decoration: none;" onclick="window.location.reload(); return false;">Tentar novamente</a></p>
      </div>
    `;
  }
}

/**
 * Setup global error handler
 */
function setupGlobalErrorHandler() {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    
    // Track errors for debugging
    window.__APP_ERRORS = window.__APP_ERRORS || [];
    window.__APP_ERRORS.push({
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error && error.stack,
      time: new Date().toISOString()
    });
    
    // Check if it's a module error (for fallback handling)
    if (typeof message === 'string' && 
        (message.includes('import.meta') || message.includes('module') || message.includes('MIME'))) {
      console.warn('Module/MIME error detected, falling back to compatibility mode');
      loadCompatibilityMode();
      return true;
    }
    
    return false;
  };
  
  // Add unhandledrejection handler for promises
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Track errors for debugging
    window.__APP_ERRORS = window.__APP_ERRORS || [];
    window.__APP_ERRORS.push({
      type: 'unhandledrejection',
      message: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown promise rejection',
      stack: event.reason && event.reason.stack,
      time: new Date().toISOString()
    });
  });
}

/**
 * Load compatibility mode script
 */
function loadCompatibilityMode() {
  console.log("Loading compatibility mode");
  const script = document.createElement('script');
  script.src = '/src/compat-entry.js';
  script.type = 'text/javascript';
  document.body.appendChild(script);
}

// Expose error handling utilities
window.__errorHandler = {
  showError,
  setupGlobalErrorHandler,
  loadCompatibilityMode
};
