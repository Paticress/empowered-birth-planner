
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
    useRef: function(initialValue) { return { current: initialValue }; }
  };
}

// ReactDOM
if (typeof window.ReactDOM === 'undefined') {
  console.log("Loading ReactDOM from local fallback");
  window.ReactDOM = {
    render: function(element, container) {
      console.log("ReactDOM.render fallback called");
      container.innerHTML = '<div>Fallback Rendering Active</div>';
    },
    createRoot: function(container) {
      console.log("ReactDOM.createRoot fallback called");
      return {
        render: function(element) {
          container.innerHTML = '<div>Fallback Root Rendering Active</div>';
        }
      };
    },
    unmountComponentAtNode: function() {},
    findDOMNode: function() { return null; }
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
      return React.createElement('div', null, props.children);
    },
    
    Routes: function(props) {
      return React.createElement('div', null, props.children);
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
    }
  };
  
  // Setup a basic hash change listener to trigger UI updates
  window.addEventListener('hashchange', function() {
    // Find the root element and force a re-render
    const root = document.getElementById('root');
    if (root && root.__reactContainer) {
      const appElement = root.innerHTML;
      root.innerHTML = '';
      setTimeout(() => {
        root.innerHTML = appElement;
      }, 0);
    }
  });
}

// Add a global function to test if all libs are loaded
window.__checkReactLibs = function() {
  return {
    hasReact: typeof window.React !== 'undefined',
    hasReactDOM: typeof window.ReactDOM !== 'undefined',
    hasReactRouterDOM: typeof window.ReactRouterDOM !== 'undefined',
    usingFallbacks: {
      React: typeof window.React !== 'undefined' && !window.React.version,
      ReactDOM: typeof window.ReactDOM !== 'undefined' && !window.ReactDOM.version,
      ReactRouterDOM: typeof window.ReactRouterDOM !== 'undefined' && !window.ReactRouterDOM.version
    }
  };
};

console.log("React, ReactDOM, and ReactRouterDOM local fallbacks loaded");
