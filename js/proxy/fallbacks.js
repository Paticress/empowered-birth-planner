
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
      HashRouter: function(props) { 
        console.log("[Fallbacks] Using fallback HashRouter");
        return props.children || null; 
      },
      Routes: function(props) { 
        console.log("[Fallbacks] Using fallback Routes");
        return props.children || null; 
      },
      Route: function() { 
        console.log("[Fallbacks] Using fallback Route"); 
        return null; 
      },
      Navigate: function() { 
        console.log("[Fallbacks] Using fallback Navigate"); 
        return null; 
      },
      Link: function(props) { 
        console.log("[Fallbacks] Using fallback Link");
        // Return an anchor tag as fallback
        if (typeof props.to === 'string') {
          const a = document.createElement('a');
          a.href = props.to.startsWith('/') ? `#${props.to}` : props.to;
          a.textContent = props.children || props.to;
          a.className = props.className || '';
          return a;
        }
        return props.children || null; 
      },
      useNavigate: function() { 
        console.log("[Fallbacks] Using fallback useNavigate");
        return function(path) { 
          console.log("[Fallbacks] Navigate called with path:", path);
          if (typeof path === 'string') {
            window.location.hash = path.startsWith('/') ? path : `/${path}`;
          }
        }; 
      },
      useParams: function() { 
        console.log("[Fallbacks] Using fallback useParams");
        return {}; 
      },
      useLocation: function() { 
        console.log("[Fallbacks] Using fallback useLocation");
        return { 
          pathname: window.location.hash.replace('#', '') || '/',
          hash: window.location.hash,
          search: window.location.search
        }; 
      }
    };
    
    // Try to load the real one
    setTimeout(() => {
      console.log("[Fallbacks] Attempting to load React Router DOM");
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
      script.crossOrigin = "anonymous";
      script.onload = () => console.log("[Fallbacks] Successfully loaded React Router DOM");
      script.onerror = (error) => {
        console.error("[Fallbacks] Failed to load React Router DOM from CDN:", error);
        // Try the local fallback
        const fallbackScript = document.createElement('script');
        fallbackScript.src = '/assets/react-router-dom.min.js';
        fallbackScript.onload = () => console.log("[Fallbacks] Loaded React Router DOM from local fallback");
        fallbackScript.onerror = () => console.error("[Fallbacks] Failed to load React Router DOM from local fallback");
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    }, 200);
  }
  
  console.log("[Fallbacks] Library fallbacks initialized");
})();
