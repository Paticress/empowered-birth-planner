
// App.js - Non-module bridge file for maximum compatibility
(function() {
  try {
    console.log("App.js - Attempting to hydrate the full application");
    
    // Only proceed if we haven't already initialized the full app
    if (window.__FULL_APP_LOADED) {
      console.log("App.js - Full application already loaded");
      return;
    }
    
    window.__FULL_APP_LOADED = true;
    
    // All dependencies needed for the app to run
    const requiredDependencies = {
      React: typeof window.React !== 'undefined',
      ReactDOM: typeof window.ReactDOM !== 'undefined',
      ReactRouterDOM: typeof window.ReactRouterDOM !== 'undefined'
    };
    
    // Check if all dependencies are loaded
    const allDependenciesLoaded = Object.values(requiredDependencies).every(Boolean);
    
    if (!allDependenciesLoaded) {
      console.error("App.js - Some dependencies are missing:", requiredDependencies);
      loadReactDependencies(function() {
        renderAppComponent();
      });
      return;
    }
    
    console.log("App.js - All dependencies loaded, rendering app");
    
    // Check if App component is already available
    if (typeof window.App === 'function') {
      console.log("App.js - App component already available in window.App");
      renderAppComponent();
      return;
    }
    
    // Try to load the App component from source
    try {
      // Try main.js first as it's most likely to be available
      var mainScript = document.createElement('script');
      mainScript.src = './src/main.js';
      mainScript.type = 'text/javascript';
      mainScript.onload = function() {
        console.log("App.js - Successfully loaded main.js");
        setTimeout(renderAppComponent, 300);
      };
      mainScript.onerror = function() {
        console.error("App.js - Failed to load main.js, using basic routing");
        renderBasicContent();
      };
      document.body.appendChild(mainScript);
    } catch (err) {
      console.error("App.js - Error loading App:", err);
      renderBasicContent();
    }
    
    // Load React dependencies if needed
    function loadReactDependencies(callback) {
      console.log("App.js - Loading React dependencies");
      
      // Load React
      if (!requiredDependencies.React) {
        var reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
        reactScript.crossOrigin = 'anonymous';
        
        reactScript.onload = function() {
          console.log("App.js - React loaded successfully");
          
          // Load ReactDOM
          if (!requiredDependencies.ReactDOM) {
            var reactDOMScript = document.createElement('script');
            reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
            reactDOMScript.crossOrigin = 'anonymous';
            
            reactDOMScript.onload = function() {
              console.log("App.js - ReactDOM loaded successfully");
              
              // Load React Router
              if (!requiredDependencies.ReactRouterDOM) {
                var routerScript = document.createElement('script');
                routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
                routerScript.crossOrigin = 'anonymous';
                
                routerScript.onload = function() {
                  console.log("App.js - React Router loaded successfully");
                  callback();
                };
                
                routerScript.onerror = function() {
                  console.error("App.js - Failed to load React Router");
                  callback(); // Continue anyway
                };
                
                document.body.appendChild(routerScript);
              } else {
                callback();
              }
            };
            
            reactDOMScript.onerror = function() {
              console.error("App.js - Failed to load ReactDOM");
              callback(); // Continue anyway
            };
            
            document.body.appendChild(reactDOMScript);
          } else {
            callback();
          }
        };
        
        reactScript.onerror = function() {
          console.error("App.js - Failed to load React");
          callback(); // Continue anyway
        };
        
        document.body.appendChild(reactScript);
      } else {
        callback();
      }
    }
    
    // Render the App component
    function renderAppComponent() {
      try {
        console.log("App.js - Rendering full App component");
        var rootElement = document.getElementById('root');
        
        if (rootElement) {
          // Check if App is properly loaded
          if (typeof window.App !== 'function') {
            console.error("App.js - App component not properly loaded, using basic content");
            renderBasicContent();
            return;
          }
          
          // Use React 18's createRoot API if available
          if (window.ReactDOM && window.ReactDOM.createRoot) {
            console.log("App.js - Using React 18 createRoot API");
            try {
              var root = window.ReactDOM.createRoot(rootElement);
              root.render(window.React.createElement(window.App));
              console.log("App.js - App component successfully rendered with createRoot");
            } catch (err) {
              console.error("App.js - Error with createRoot API:", err);
              // Try fallback to older render method
              if (window.ReactDOM.render) {
                console.log("App.js - Falling back to legacy render API");
                window.ReactDOM.render(window.React.createElement(window.App), rootElement);
                console.log("App.js - App component successfully rendered with legacy API");
              } else {
                throw err; // Re-throw if no fallback
              }
            }
          } else {
            // Fallback for older React versions
            console.log("App.js - Using legacy React render API");
            window.ReactDOM.render(window.React.createElement(window.App), rootElement);
            console.log("App.js - App component successfully rendered with legacy API");
          }
        } else {
          console.error("App.js - Root element not found in DOM");
        }
      } catch (err) {
        console.error("App.js - Error rendering App component:", err);
        renderBasicContent();
      }
    }
    
    // Render basic content as fallback
    function renderBasicContent() {
      console.log("App.js - Rendering basic content as fallback");
      var rootElement = document.getElementById('root');
      if (!rootElement) return;
      
      createBasicAppContent(rootElement);
    }
    
    // Create a simple router-based app as fallback
    function createBasicAppContent(rootElement) {
      // Create a simple router-based app
      var SimpleApp = function() {
        return window.React.createElement(window.ReactRouterDOM.HashRouter, null,
          window.React.createElement(window.ReactRouterDOM.Routes, null,
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/', 
              element: window.React.createElement(window.ReactRouterDOM.Navigate, { to: '/guia-online', replace: true })
            }),
            window.React.createElement(window.ReactRouterDOM.Route, { 
              path: '/guia-online', 
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Guia de Plano de Parto'),
                window.React.createElement('p', null, 'Bem-vinda ao Guia de Plano de Parto!'),
                window.React.createElement('p', null, 'Estamos carregando o conteúdo. Por favor, aguarde ou tente recarregar a página.')
              )
            }),
            window.React.createElement(window.ReactRouterDOM.Route, {
              path: '/criar-plano', 
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Construtor de Plano de Parto'),
                window.React.createElement('p', null, 'Estamos preparando seu construtor de plano de parto.'),
                window.React.createElement('p', null, 'Por favor, aguarde um momento...')
              )
            }),
            window.React.createElement(window.ReactRouterDOM.Route, {
              path: '*',
              element: window.React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                window.React.createElement('h1', null, 'Página não encontrada'),
                window.React.createElement('p', null, 'A página que você está procurando não existe.'),
                window.React.createElement('a', { href: '#/guia-online' }, 'Voltar para o Guia')
              )
            })
          )
        );
      };
      
      try {
        if (window.ReactDOM.createRoot) {
          window.ReactDOM.createRoot(rootElement).render(window.React.createElement(SimpleApp));
        } else {
          window.ReactDOM.render(window.React.createElement(SimpleApp), rootElement);
        }
        console.log("App.js - Basic routing app rendered successfully");
      } catch (error) {
        console.error("App.js - Error rendering basic content:", error);
        rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Estamos com dificuldades para carregar o conteúdo. Por favor, tente recarregar a página.</p></div>';
      }
    }
  } catch (outerError) {
    console.error("App.js - Critical error:", outerError);
    
    // Try to render basic UI when everything else fails
    var rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 40px;"><h1>Guia de Plano de Parto</h1><p>Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente mais tarde.</p></div>';
    }
  }
})();
