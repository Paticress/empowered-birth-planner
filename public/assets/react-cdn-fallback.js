
// Enhanced local fallback for React, ReactDOM and React Router
// This provides basic functionality when CDNs are blocked or unavailable

// React
if (typeof window.React === 'undefined') {
  console.log("Loading React from local fallback");
  window.React = {
    createElement: function(type, props, ...children) {
      return { type, props: props || {}, children };
    },
    Fragment: 'fragment',
    useState: function(initialState) {
      const state = typeof initialState === 'function' ? initialState() : initialState;
      return [state, function() {}];
    },
    useEffect: function(effect, deps) {},
    useContext: function(context) { return context._currentValue; },
    createContext: function(defaultValue) {
      return {
        Provider: { $$typeof: Symbol.for('react.provider') },
        Consumer: { $$typeof: Symbol.for('react.context') },
        _currentValue: defaultValue
      };
    },
    memo: function(component) { return component; },
    useMemo: function(factory) { return factory(); },
    useCallback: function(callback) { return callback; },
    useRef: function(initialValue) { return { current: initialValue }; },
    StrictMode: function(props) { return props.children; },
    version: '18.0.0-fallback'
  };
}

// ReactDOM
if (typeof window.ReactDOM === 'undefined') {
  console.log("Loading ReactDOM from local fallback");
  window.ReactDOM = {
    render: function(element, container) {
      console.log("ReactDOM.render fallback called");
      container.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando Guia de Plano de Parto...</h2><p>Por favor, aguarde enquanto carregamos a aplicação.</p></div>';
      
      // Try to load the real app after a short delay
      setTimeout(function() {
        if (typeof window.__appLoader === 'function') {
          window.__appLoader();
        }
      }, 500);
    },
    createRoot: function(container) {
      console.log("ReactDOM.createRoot fallback called");
      return {
        render: function(element) {
          console.log("ReactDOM.createRoot().render fallback called");
          container.innerHTML = '<div style="text-align: center; padding: 20px;"><h2>Carregando Guia de Plano de Parto...</h2><p>Por favor, aguarde enquanto carregamos a aplicação.</p></div>';
          
          // Store the container for potential re-renders
          container.__reactContainer = true;
          
          // Try to load the real app after a short delay
          setTimeout(function() {
            if (typeof window.__appLoader === 'function') {
              window.__appLoader();
            }
          }, 500);
        },
        unmount: function() {
          console.log("ReactDOM.createRoot().unmount fallback called");
          if (container) {
            container.innerHTML = '';
          }
        }
      };
    },
    unmountComponentAtNode: function(container) {
      if (container) {
        container.innerHTML = '';
      }
    },
    findDOMNode: function() { return null; },
    version: '18.0.0-fallback'
  };
}

// React Router DOM - Enhanced with basic functionality
if (typeof window.ReactRouterDOM === 'undefined') {
  console.log("Loading ReactRouterDOM from local fallback with enhanced functionality");
  
  // Create a basic router implementation
  window.ReactRouterDOM = {
    // Basic components with minimal functionality
    HashRouter: function(props) {
      console.log("HashRouter fallback rendered");
      return React.createElement('div', { className: "router-container" }, props.children);
    },
    
    Routes: function(props) {
      return React.createElement('div', { className: "routes-container" }, props.children);
    },
    
    Route: function(props) {
      // Extract the current hash path
      const path = window.location.hash.replace('#', '') || '/';
      const routePath = props.path || '';
      
      // Simple path matching
      if (path === routePath || routePath === '*' || 
          (routePath === '/' && path === '') ||
          (routePath !== '/' && path.startsWith(routePath + '/'))) {
        return props.element;
      }
      return null;
    },
    
    Navigate: function(props) {
      // Actually perform navigation
      const to = props.to || '/';
      if (props.replace) {
        window.location.replace('#' + to);
      } else {
        window.location.hash = to;
      }
      return null;
    },
    
    // Basic hooks implementation
    useNavigate: function() {
      return function(to, options) {
        if (options && options.replace) {
          window.location.replace('#' + to);
        } else {
          window.location.hash = to;
        }
      };
    },
    
    useParams: function() {
      return {};
    },
    
    useLocation: function() {
      return {
        pathname: window.location.hash.replace('#', '') || '/',
        search: '',
        hash: '',
        state: null
      };
    },
    
    // Links
    Link: function(props) {
      return React.createElement('a', {
        href: '#' + props.to,
        onClick: function(e) {
          e.preventDefault();
          window.location.hash = props.to;
        },
        ...props
      }, props.children);
    },
    
    NavLink: function(props) {
      const path = window.location.hash.replace('#', '') || '/';
      const isActive = path === props.to || path.startsWith(props.to + '/');
      
      return React.createElement('a', {
        href: '#' + props.to,
        className: isActive ? (props.className + ' active') : props.className,
        onClick: function(e) {
          e.preventDefault();
          window.location.hash = props.to;
        },
        ...props
      }, props.children);
    },
    
    version: '6.0.0-fallback'
  };
  
  // Setup a basic hash change listener to trigger UI updates
  window.addEventListener('hashchange', function() {
    // Find the root element and force a re-render
    const root = document.getElementById('root');
    if (root && root.__reactContainer) {
      console.log("Hash changed, forcing re-render");
      const appElement = root.innerHTML;
      root.innerHTML = '';
      setTimeout(() => {
        root.innerHTML = appElement;
      }, 0);
    }
  });
}

// Function to load the real app
window.__appLoader = function() {
  console.log("Attempting to load the real application");
  
  // Track loading attempts to prevent loops
  window.__APP_LOAD_ATTEMPTS = window.__APP_LOAD_ATTEMPTS || 0;
  window.__APP_LOAD_ATTEMPTS++;
  
  if (window.__APP_LOAD_ATTEMPTS > 3) {
    console.error("Too many app loading attempts, stopping to prevent infinite loop");
    return;
  }
  
  // Try to load the main app script
  const script = document.createElement('script');
  script.src = '/src/App.js';
  script.type = 'text/javascript';
  script.onerror = function() {
    console.error("Failed to load App.js, trying main.js");
    const mainScript = document.createElement('script');
    mainScript.src = '/src/main.js';
    mainScript.type = 'text/javascript';
    mainScript.onerror = function() {
      console.error("Failed to load main.js, trying compat-entry.js");
      const compatScript = document.createElement('script');
      compatScript.src = '/src/compat-entry.js';
      compatScript.type = 'text/javascript';
      document.body.appendChild(compatScript);
    };
    document.body.appendChild(mainScript);
  };
  document.body.appendChild(script);
};

// Add a global function to test if all libs are loaded
window.__checkReactLibs = function() {
  return {
    hasReact: typeof window.React !== 'undefined',
    hasReactDOM: typeof window.ReactDOM !== 'undefined',
    hasReactRouterDOM: typeof window.ReactRouterDOM !== 'undefined',
    usingFallbacks: {
      React: typeof window.React !== 'undefined' && (window.React.version || '').includes('fallback'),
      ReactDOM: typeof window.ReactDOM !== 'undefined' && (window.ReactDOM.version || '').includes('fallback'),
      ReactRouterDOM: typeof window.ReactDOM !== 'undefined' && (window.ReactRouterDOM.version || '').includes('fallback')
    }
  };
};

console.log("React, ReactDOM, and ReactRouterDOM local fallbacks loaded");

// Trigger app loading after a short delay
setTimeout(window.__appLoader, 1000);
