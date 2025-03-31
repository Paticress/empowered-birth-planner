
// Library fallbacks and polyfills
(function() {
  console.log("[Fallbacks] Initializing library fallbacks");
  
  // Inject basic GPT Engineer API if not available
  if (typeof window.gptengineer === 'undefined') {
    console.log("[Fallbacks] Creating basic gptengineer API");
    window.gptengineer = {
      createSelect: function() {
        console.log("Basic GPT Engineer Select API called - real implementation will load later");
        return null;
      }
    };
  }
  
  // Direct injection of minimal ReactRouterDOM to prevent errors
  if (typeof window.ReactRouterDOM === 'undefined') {
    console.log("[Fallbacks] ReactRouterDOM not found, creating minimal placeholder");
    
    // Create a simple version that will prevent errors until the real one loads
    window.ReactRouterDOM = {
      HashRouter: function(props) { return props.children || null; },
      Routes: function(props) { return props.children || null; },
      Route: function() { return null; },
      Navigate: function() { return null; },
      Link: function(props) { return props.children || null; },
      useNavigate: function() { return function() {}; },
      useParams: function() { return {}; },
      useLocation: function() { return { pathname: '/' }; }
    };
    
    // Try to load the real one
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = '/assets/react-cdn-fallback.js';
      script.onload = () => console.log("[Fallbacks] Loaded React Router fallback");
      script.onerror = () => console.error("[Fallbacks] Failed to load React Router fallback");
      document.head.appendChild(script);
    }, 100);
  }
  
  console.log("[Fallbacks] Library fallbacks initialized");
})();
