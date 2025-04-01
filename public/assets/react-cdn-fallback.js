
// React CDN fallback handler
// This provides local fallbacks for React, ReactDOM, and ReactRouterDOM
// when CDN loading fails or browser features are incompatible

(function() {
  // Local React implementation
  if (!window.React) {
    console.log("Loading React from local fallback");
    
    window.React = {
      createElement: function(type, props, ...children) {
        return { type, props: props || {}, children };
      },
      
      Fragment: Symbol("React.Fragment"),
      
      useState: function(initialState) {
        const currentState = typeof window.__REACT_STATE === 'undefined' ? initialState : window.__REACT_STATE;
        const setState = function(newState) {
          window.__REACT_STATE = typeof newState === 'function' ? newState(currentState) : newState;
          window.__RENDER_APP && window.__RENDER_APP();
        };
        return [currentState, setState];
      },
      
      useEffect: function(callback, deps) {
        // Simple implementation that just runs the effect
        callback();
      }
    };
  }
  
  // Local ReactDOM implementation
  if (!window.ReactDOM) {
    console.log("Loading ReactDOM from local fallback");
    
    window.ReactDOM = {
      render: function(element, container) {
        console.log("ReactDOM.render fallback called");
        if (!container) return;
        
        // Simple rendering that shows at least some content
        if (element && element.type) {
          const simpleHtml = convertToHTML(element);
          container.innerHTML = simpleHtml;
        }
      },
      
      createRoot: function(container) {
        console.log("ReactDOM.createRoot fallback called");
        return {
          render: function(element) {
            console.log("ReactDOM.createRoot().render fallback called");
            window.ReactDOM.render(element, container);
          }
        };
      }
    };
    
    // Helper to convert React elements to HTML strings
    function convertToHTML(element) {
      if (!element) return '';
      
      if (typeof element === 'string' || typeof element === 'number') {
        return String(element);
      }
      
      if (Array.isArray(element)) {
        return element.map(convertToHTML).join('');
      }
      
      if (!element.type) {
        return '';
      }
      
      if (typeof element.type === 'function') {
        try {
          // Try to call the function component
          const result = element.type(element.props);
          return convertToHTML(result);
        } catch (e) {
          return `<div>Error rendering component: ${e.message}</div>`;
        }
      }
      
      if (element.type === window.React.Fragment) {
        return (element.children || []).map(convertToHTML).join('');
      }
      
      // Handle regular HTML elements
      const tag = element.type;
      const attributes = Object.entries(element.props || {})
        .filter(([key]) => key !== 'children')
        .map(([key, value]) => {
          if (key === 'className') key = 'class';
          if (key === 'onClick') {
            // Simple event handling
            return `onclick="window.__HANDLE_CLICK('${Math.random()}')"`;
          }
          return `${key}="${value}"`;
        })
        .join(' ');
      
      const children = (element.props && element.props.children) 
        ? (Array.isArray(element.props.children)
            ? element.props.children
            : [element.props.children])
        : element.children || [];
      
      const childrenHtml = (Array.isArray(children) ? children : [children])
        .map(convertToHTML)
        .join('');
      
      return `<${tag} ${attributes}>${childrenHtml}</${tag}>`;
    }
  }
  
  // Local ReactRouterDOM implementation
  if (!window.ReactRouterDOM) {
    console.log("Loading ReactRouterDOM from local fallback with enhanced functionality");
    
    window.ReactRouterDOM = {
      HashRouter: function(props) {
        return {
          type: 'div',
          props: { ...props, className: 'router-container' }
        };
      },
      
      Routes: function(props) {
        return {
          type: 'div',
          props: { ...props, className: 'routes-container' }
        };
      },
      
      Route: function(props) {
        // Check if this route matches the current hash
        const currentPath = window.location.hash.slice(1) || '/';
        
        if (props.path === '*' || currentPath === props.path || 
            (props.path === '/' && currentPath === '')) {
          return props.element;
        }
        
        return null;
      },
      
      Navigate: function(props) {
        // Set the hash to the specified "to" location
        if (props.to) {
          setTimeout(function() {
            window.location.hash = props.to;
          }, 0);
        }
        
        return null;
      },
      
      Link: function(props) {
        return {
          type: 'a',
          props: {
            ...props,
            href: '#' + props.to,
            onClick: function(e) {
              if (props.onClick) props.onClick(e);
            }
          }
        };
      },
      
      useNavigate: function() {
        return function(path) {
          window.location.hash = path;
        };
      },
      
      useParams: function() {
        return {};
      },
      
      useLocation: function() {
        return {
          pathname: window.location.hash.slice(1) || '/',
          hash: '',
          search: '',
          state: null
        };
      }
    };
    
    // Listen for hash changes to update the view
    window.addEventListener('hashchange', function() {
      if (window.__RENDER_APP) {
        window.__RENDER_APP();
      }
    });
  }
  
  // Create rendering helper
  if (!window.__RENDER_APP) {
    window.__RENDER_APP = function() {
      const rootElement = document.getElementById('root');
      if (rootElement && window.App) {
        try {
          if (window.ReactDOM.createRoot) {
            const root = window.ReactDOM.createRoot(rootElement);
            root.render(window.React.createElement(window.App));
          } else {
            window.ReactDOM.render(window.React.createElement(window.App), rootElement);
          }
        } catch (e) {
          console.error("Error rendering app:", e);
          rootElement.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Erro ao carregar</h1><p>Ocorreu um erro ao renderizar a aplicação.</p></div>';
        }
      }
    };
  }
  
  // Handle click events globally
  window.__HANDLE_CLICK = function(id) {
    // Do something with the click
    console.log("Click handled for:", id);
  };
  
  console.log("React, ReactDOM, and ReactRouterDOM local fallbacks loaded");
  
  // Try to load the real application after a delay
  setTimeout(function() {
    console.log("Attempting to load the real application");
    const appScript = document.createElement('script');
    appScript.src = '/src/App.js';
    document.body.appendChild(appScript);
  }, 500);
})();
