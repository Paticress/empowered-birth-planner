
(function() {
  console.log("[Error Handler] Initializing enhanced error handling");
  
  // Store original error handlers
  const originalOnError = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;
  
  // Track errors for debugging
  window.__APP_ERRORS = window.__APP_ERRORS || [];
  
  // Enhanced error handler
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('[Error Handler] Global error caught:', { message, source, lineno, colno, error });
    
    // Log error details for debugging
    window.__APP_ERRORS.push({
      type: 'error',
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error && error.stack,
      time: new Date().toISOString()
    });
    
    // Handle specific errors
    if (typeof message === 'string') {
      // 404 Not Found errors
      if (message.includes('404') || message.includes('not found')) {
        console.warn('[Error Handler] Resource not found error detected');
      }
      
      // CSP errors
      if (message.includes('Content Security Policy')) {
        console.warn('[Error Handler] CSP violation detected:', message);
      }
      
      // Module errors
      if (message.includes('import.meta') || message.includes('module') || message.includes('MIME')) {
        console.warn('[Error Handler] Module/MIME error detected, may require compatibility mode');
      }
    }
    
    // Call original handler if it exists
    if (typeof originalOnError === 'function') {
      return originalOnError(message, source, lineno, colno, error);
    }
    
    // Let error propagate by default
    return false;
  };
  
  // Enhanced unhandled promise rejection handler
  window.onunhandledrejection = function(event) {
    console.error('[Error Handler] Unhandled promise rejection:', event.reason);
    
    // Log promise error details
    window.__APP_ERRORS.push({
      type: 'unhandledrejection',
      message: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown promise rejection',
      stack: event.reason && event.reason.stack,
      time: new Date().toISOString()
    });
    
    // Call original handler if it exists
    if (typeof originalUnhandledRejection === 'function') {
      originalUnhandledRejection(event);
    }
  };
  
  // Add global error reporting function
  window.__getErrorReport = function() {
    return {
      errors: window.__APP_ERRORS || [],
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  };
  
  console.log("[Error Handler] Enhanced error handling initialized");
})();
