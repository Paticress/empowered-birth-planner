
// Error handling utilities
console.log('Error handler initialized');

// Show error message in the root element
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

// Setup global error handler
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
      
      // Try to load compatibility mode if available
      try {
        const script = document.createElement('script');
        script.src = '/src/compat-entry.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);
      } catch (e) {
        console.error('Failed to load compatibility mode:', e);
      }
      
      return true; // Prevents the error from being reported to the console
    }
    
    // Check if it's a GPT Engineer script error
    if (typeof message === 'string' && message.includes('gpteng')) {
      console.warn('GPT Engineer script error detected, providing fallback');
      
      // Create a minimal implementation if it doesn't exist
      window.gptengineer = window.gptengineer || {
        createSelect: function() {
          console.log("GPT Engineer Select functionality unavailable due to script error");
          return null;
        },
        isAvailable: function() {
          return false;
        },
        onError: function(e) {
          console.error("GPT Engineer error handler (fallback):", e);
        }
      };
      
      return true; // Suppress console error
    }
    
    return false; // Let other error handlers run
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

// Export error debugging information
function getErrorReport() {
  return {
    errors: window.__APP_ERRORS || [],
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
}

export { showError, setupGlobalErrorHandler, getErrorReport };
