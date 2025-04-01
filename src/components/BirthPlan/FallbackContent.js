// Fallback content for the BirthPlan module when it fails to load
console.log("FallbackContent for BirthPlan module loaded");

/**
 * Creates a simple fallback UI for the BirthPlan
 * @param {HTMLElement} container - The container to render the fallback content
 */
function createFallbackContent(container) {
  if (!container) {
    console.warn("FallbackContent - No container provided, trying to find a suitable container");
    container = document.querySelector('main') || document.getElementById('root');
    
    if (!container) {
      console.error("FallbackContent - No suitable container found");
      return;
    }
  }
  
  console.log("FallbackContent - Rendering fallback content to", container);
  
  // Try to initialize full app load immediately
  initializeFullAppLoad();
  
  // Function to attempt loading the full app
  function initializeFullAppLoad() {
    if (typeof window.__FULL_APP_LOADED === 'undefined' || !window.__FULL_APP_LOADED) {
      window.__FULL_APP_LOADED = true;
      console.log("FallbackContent - Initializing full application load");
      
      // First attempt - create a simple DOM-based router and render directly
      const simpleRouter = document.createElement('script');
      simpleRouter.src = '/src/utils/fallbackApp.js';
      simpleRouter.type = 'text/javascript'; // Use standard script type
      
      simpleRouter.onload = function() {
        console.log("FallbackContent - fallbackApp.js loaded, trying to initialize");
        if (window.__fallbackApp && window.__fallbackApp.createBasicContent) {
          const rootEl = document.getElementById('root');
          if (rootEl) {
            try {
              window.__fallbackApp.createBasicContent(rootEl);
              console.log("FallbackContent - Simple router app initialized");
            } catch (e) {
              console.error("FallbackContent - Error initializing simple router:", e);
            }
          }
        }
      };
      
      simpleRouter.onerror = function() {
        console.log("FallbackContent - fallbackApp.js load failed, trying main.js");
        loadMainJs();
      };
      
      document.body.appendChild(simpleRouter);
      
      // Second attempt - look for a global bootstrap function
      if (typeof window.bootstrapApplication === 'function') {
        try {
          console.log("FallbackContent - Found global bootstrapApplication, calling it");
          window.bootstrapApplication();
          return;
        } catch (e) {
          console.error("FallbackContent - Error calling bootstrapApplication:", e);
        }
      }
      
      // Continue with main.js if needed after a short delay
      setTimeout(function() {
        if (!window.App) {
          console.log("FallbackContent - App not found after bootstrap attempt, trying main.js");
          loadMainJs();
        }
      }, 500);
    }
  }
  
  // Function to load main.js directly
  function loadMainJs() {
    console.log("FallbackContent - Attempting to load main.js");
    
    const mainScript = document.createElement('script');
    mainScript.src = '/src/main.js';
    mainScript.type = 'text/javascript'; // Use standard script instead of module
    
    mainScript.onload = function() {
      console.log("FallbackContent - main.js loaded successfully");
      
      // Check if we need to load React and ReactDOM
      if (!window.React || !window.ReactDOM) {
        loadReactDependencies(function() {
          console.log("FallbackContent - React dependencies loaded, trying to initialize App");
          loadAppJs();
        });
      } else {
        loadAppJs();
      }
    };
    
    mainScript.onerror = function() {
      console.log("FallbackContent - main.js load failed, trying App.js directly");
      loadAppJs();
    };
    
    document.body.appendChild(mainScript);
  }
  
  // Function to load React dependencies if needed
  function loadReactDependencies(callback) {
    console.log("FallbackContent - Loading React dependencies");
    
    // Check if we already have React
    if (window.React && window.ReactDOM) {
      console.log("FallbackContent - React already available");
      callback();
      return;
    }
    
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.crossOrigin = 'anonymous';
    
    reactScript.onload = function() {
      console.log("FallbackContent - React loaded");
      
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.crossOrigin = 'anonymous';
      
      reactDOMScript.onload = function() {
        console.log("FallbackContent - ReactDOM loaded");
        
        // Load React Router DOM
        const routerScript = document.createElement('script');
        routerScript.src = 'https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js';
        routerScript.crossOrigin = 'anonymous';
        
        routerScript.onload = function() {
          console.log("FallbackContent - ReactRouterDOM loaded");
          callback();
        };
        
        routerScript.onerror = function() {
          console.error("FallbackContent - Failed to load ReactRouterDOM");
          callback(); // Continue anyway
        };
        
        document.body.appendChild(routerScript);
      };
      
      reactDOMScript.onerror = function() {
        console.error("FallbackContent - Failed to load ReactDOM");
        callback(); // Continue anyway
      };
      
      document.body.appendChild(reactDOMScript);
    };
    
    reactScript.onerror = function() {
      console.error("FallbackContent - Failed to load React");
      callback(); // Continue anyway
    };
    
    document.body.appendChild(reactScript);
  }
  
  // Function to load App.js
  function loadAppJs() {
    console.log("FallbackContent - Attempting to load App.js");
    
    // Try to clean any existing app flags
    try {
      Object.keys(window).forEach(key => {
        if (key.includes('LOADED') || key.includes('EXECUTED') || key.includes('APP_')) {
          delete window[key];
        }
      });
    } catch (e) {
      console.error("FallbackContent - Error cleaning window flags:", e);
    }
    
    // Important - use regular script type for better compatibility
    const appScript = document.createElement('script');
    appScript.src = '/src/App.js';
    appScript.type = 'text/javascript'; // Use regular script instead of module
    
    appScript.onload = function() {
      console.log("FallbackContent - App.js loaded successfully");
      
      // Check if the App component is available
      if (window.App) {
        console.log("FallbackContent - App component found, trying to render");
        
        // Try to render the App
        try {
          const rootEl = document.getElementById('root');
          if (rootEl && window.React && window.ReactDOM) {
            // Clear the container first
            rootEl.innerHTML = '';
            
            // Render using available ReactDOM method
            if (window.ReactDOM.createRoot) {
              window.ReactDOM.createRoot(rootEl).render(
                window.React.createElement(window.App)
              );
            } else if (window.ReactDOM.render) {
              window.ReactDOM.render(
                window.React.createElement(window.App),
                rootEl
              );
            }
            
            console.log("FallbackContent - App component rendered successfully");
            return;
          }
        } catch (e) {
          console.error("FallbackContent - Error rendering App component:", e);
        }
      }
      
      // If App component is not available or rendering failed, reload the page
      console.log("FallbackContent - Reloading page to initialize App.js");
      // Force a reload after a short delay to apply changes
      setTimeout(function() {
        console.log("FallbackContent - Reloading page to initialize App.js");
        // Clear any cached states before reloading
        try {
          sessionStorage.removeItem('app_last_route');
          localStorage.removeItem('app_initialized');
          
          // Clear any window flags we've set
          window.__FULL_APP_LOADED = false;
          window.__MAIN_EXECUTED = false;
        } catch (e) {
          console.error("Error clearing cache:", e);
        }
        window.location.reload();
      }, 500);
    };
    
    appScript.onerror = function(error) {
      console.log("FallbackContent - Could not load App.js, trying compiled version", error);
      
      const compiledScript = document.createElement('script');
      compiledScript.src = '/src/compiled/App.js';
      compiledScript.type = 'text/javascript'; // Ensure we use regular script
      
      compiledScript.onload = function() {
        console.log("FallbackContent - Compiled App.js loaded successfully");
        
        // Force a reload to apply changes
        setTimeout(function() {
          window.location.reload();
        }, 500);
      };
      
      compiledScript.onerror = function(error) {
        console.log("FallbackContent - Failed to load alternative app versions", error);
        
        // Try to use compat-entry.js as last resort
        const compatScript = document.createElement('script');
        compatScript.src = '/src/compat-entry.js';
        compatScript.type = 'text/javascript';
        
        compatScript.onload = function() {
          console.log("FallbackContent - compat-entry.js loaded successfully");
          setTimeout(function() {
            window.location.reload();
          }, 500);
        };
        
        compatScript.onerror = function() {
          console.log("FallbackContent - All load attempts failed, staying with fallback content");
          alert('Não foi possível carregar a versão completa. Por favor, tente novamente mais tarde ou contate o suporte.');
        };
        
        document.body.appendChild(compatScript);
      };
      
      document.body.appendChild(compiledScript);
    };
    
    document.body.appendChild(appScript);
  }
  
  // Determine which content to show based on current route
  var currentRoute = window.location.hash.replace('#', '') || '/';
  console.log("FallbackContent - Current route:", currentRoute);
  
  // Check if we're in an iframe
  var isInIframe = (window !== window.parent);
  var iframeWarning = '';
  
  if (isInIframe) {
    iframeWarning = `
      <div class="embedded-warning">
        <p><strong>Atenção:</strong> Este conteúdo está sendo exibido em uma versão simplificada dentro de um iframe.</p>
        <p>Para a experiência completa, <a href="${window.location.href}" target="_blank" style="color: #2563eb; text-decoration: underline;">abra esta página em uma nova aba</a>.</p>
      </div>
    `;
  }
  
  // Add Tailwind-like styles directly to ensure proper styling
  var baseStyles = `
    <style>
      .fem-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem; font-family: system-ui, -apple-system, sans-serif; }
      .fem-header { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 1rem 0; position: fixed; top: 0; left: 0; right: 0; z-index: 10; }
      .fem-header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
      .fem-logo { font-size: 1.5rem; font-weight: bold; color: #3b82f6; }
      .fem-nav { display: flex; gap: 1.5rem; }
      .fem-nav-link { color: #475569; text-decoration: none; font-weight: 500; }
      .fem-nav-link:hover { color: #3b82f6; }
      .fem-button { display: inline-block; background-color: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; text-decoration: none; }
      .fem-button:hover { background-color: #2563eb; }
      .fem-main { padding-top: 4rem; }
      .fem-heading { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #1e293b; }
      .fem-subheading { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem; color: #334155; }
      .fem-section { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; }
      .fem-card { background-color: white; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 1rem; margin-bottom: 1rem; }
      .fem-card-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #334155; }
      .fem-text { color: #475569; line-height: 1.5; }
      .fem-mt-4 { margin-top: 1rem; }
      .fem-mt-8 { margin-top: 2rem; }
      .fem-flex { display: flex; }
      .fem-items-center { align-items: center; }
      .fem-justify-center { justify-content: center; }
      .fem-text-center { text-align: center; }
      .fem-text-sm { font-size: 0.875rem; }
      .fem-text-gray { color: #64748b; }
      .fem-full-version-btn { 
        display: inline-block; 
        background-color: #3b82f6; 
        color: white; 
        font-weight: 600;
        padding: 0.75rem 1.5rem; 
        border-radius: 0.375rem; 
        text-decoration: none;
        margin: 1.5rem auto;
        border: none;
        cursor: pointer;
        font-size: 1rem;
      }
      .fem-full-version-btn:hover {
        background-color: #2563eb;
      }
      .embedded-warning {
        background-color: #fef2f2;
        border: 1px solid #fee2e2;
        border-radius: 0.375rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
        color: #b91c1c;
      }
      .loading-indicator {
        display: none;
        text-align: center;
        padding: 1rem;
        margin-top: 1rem;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  // Different content based on route
  var content = baseStyles;
  
  if (currentRoute.includes('criar-plano')) {
    content += `
      <div class="fem-container">
        <header class="fem-header">
          <div class="fem-header-content">
            <div class="fem-logo">Energia Materna</div>
            <nav class="fem-nav">
              <a href="#/guia-online" class="fem-nav-link">Guia</a>
              <a href="#/criar-plano" class="fem-nav-link">Criar Plano</a>
            </nav>
          </div>
        </header>
        <main class="fem-main">
          ${iframeWarning}
          <h1 class="fem-heading">Construtor de Plano de Parto</h1>
          <p class="fem-text">Seu assistente para criar um plano de parto personalizado</p>
          
          <div class="fem-section">
            <h2 class="fem-subheading">Bem-vinda ao Construtor de Plano de Parto</h2>
            <p class="fem-text">Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.</p>
          </div>
          
          <div class="fem-section">
            <div class="fem-card">
              <h3 class="fem-card-title">Informações Pessoais</h3>
              <form>
                <div style="margin-bottom: 1rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Seu nome:</label>
                  <input type="text" placeholder="Digite seu nome completo" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Data prevista para o parto:</label>
                  <input type="date" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Local do parto:</label>
                  <input type="text" placeholder="Hospital, casa de parto, etc." style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
                </div>
              </form>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Preferências do Parto</h3>
              <p class="fem-text">Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.</p>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Durante o Nascimento</h3>
              <p class="fem-text">Posições para o parto, corte do cordão umbilical, contato pele a pele e outros momentos do nascimento.</p>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Pós-Parto</h3>
              <p class="fem-text">Amamentação, cuidados com o recém-nascido e recuperação materna.</p>
            </div>
            
            <div class="fem-text-center fem-mt-8">
              <button class="fem-full-version-btn" id="loadFullVersionBtn">
                Carregar Versão Completa
              </button>
              <div id="loadingIndicator" class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Carregando versão completa...</p>
              </div>
            </div>
          </div>
          
          <div class="fem-flex fem-justify-center fem-mt-8">
            <button class="fem-button" id="reloadPageBtn">
              Tentar Recarregar Página
            </button>
          </div>
        </main>
      </div>
    `;
  } else if (currentRoute.includes('guia-online') || currentRoute === '/' || currentRoute === '') {
    content += `
      <div class="fem-container">
        <header class="fem-header">
          <div class="fem-header-content">
            <div class="fem-logo">Energia Materna</div>
            <nav class="fem-nav">
              <a href="#/guia-online" class="fem-nav-link">Guia</a>
              <a href="#/criar-plano" class="fem-nav-link">Criar Plano</a>
            </nav>
          </div>
        </header>
        <main class="fem-main">
          ${iframeWarning}
          <h1 class="fem-heading">Guia do Parto Respeitoso</h1>
          <p class="fem-text">Seu guia completo para um plano de parto eficaz</p>
          
          <div class="fem-section">
            <h2 class="fem-subheading">Bem-vinda ao Guia do Parto Respeitoso</h2>
            <p class="fem-text">Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz.</p>
          </div>
          
          <div class="fem-section">
            <div class="fem-card">
              <h3 class="fem-card-title">O que é um plano de parto?</h3>
              <p class="fem-text">Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê.</p>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Por que criar um plano de parto?</h3>
              <p class="fem-text">Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva.</p>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Como criar seu plano de parto</h3>
              <p class="fem-text">Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades.</p>
              <div class="fem-mt-4">
                <a href="#/criar-plano" class="fem-button">
                  Ir para o Construtor de Plano de Parto
                </a>
              </div>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Direitos no parto</h3>
              <p class="fem-text">Conheça seus direitos durante o trabalho de parto e nascimento, garantindo uma experiência mais segura e respeitosa.</p>
            </div>
            
            <div class="fem-card">
              <h3 class="fem-card-title">Comunicação com a equipe médica</h3>
              <p class="fem-text">Dicas para comunicar de forma eficaz suas preferências e necessidades à equipe que irá acompanhar seu parto.</p>
            </div>
            
            <div class="fem-text-center fem-mt-8">
              <button class="fem-full-version-btn" id="loadFullVersionBtn">
                Carregar Versão Completa
              </button>
              <div id="loadingIndicator" class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Carregando versão completa...</p>
              </div>
            </div>
          </div>
          
          <div class="fem-flex fem-justify-center fem-mt-8">
            <button class="fem-button" id="reloadPageBtn">
              Tentar Recarregar Página
            </button>
          </div>
        </main>
      </div>
    `;
  } else {
    content += `
      <div class="fem-container fem-flex fem-items-center fem-justify-center" style="min-height: 100vh;">
        <div class="fem-text-center">
          <h1 class="fem-heading">Página não encontrada</h1>
          <p class="fem-text fem-mt-4">A página que você está procurando não existe ou foi movida.</p>
          <div class="fem-mt-8">
            <a href="#/guia-online" class="fem-button">
              Voltar para o Guia
            </a>
          </div>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = content;
  console.log("FallbackContent - Content rendered successfully");
  
  // Add event listener for load full version button
  const loadFullVersionBtn = container.querySelector('#loadFullVersionBtn');
  const loadingIndicator = container.querySelector('#loadingIndicator');
  
  if (loadFullVersionBtn) {
    loadFullVersionBtn.addEventListener('click', function() {
      console.log("FallbackContent - Load full version button clicked");
      
      // Show loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
      }
      
      // Disable the button to prevent multiple clicks
      loadFullVersionBtn.disabled = true;
      loadFullVersionBtn.style.opacity = '0.7';
      
      // Clear any cached states before trying to load
      try {
        // Clear all local and session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any window flags we've set
        Object.keys(window).forEach(key => {
          if (key.startsWith('__') || key.includes('LOADED') || key.includes('EXECUTED')) {
            window[key] = false;
          }
        });
      } catch (e) {
        console.error("Error clearing cache:", e);
      }
      
      // Try to directly load OnlineGuide component for /guia-online route
      if (currentRoute.includes('guia-online') || currentRoute === '/' || currentRoute === '') {
        console.log("FallbackContent - Current route is guia-online, trying to directly load OnlineGuide component");
        
        // First load React dependencies
        loadReactDependencies(function() {
          console.log("FallbackContent - Dependencies loaded, trying to load OnlineGuide component");
          
          // Now try to load the guide script directly
          const guideScript = document.createElement('script');
          guideScript.src = '/src/components/Guide/OnlineGuide.js';
          guideScript.type = 'text/javascript';
          
          guideScript.onload = function() {
            console.log("FallbackContent - OnlineGuide.js loaded, trying to render component");
            
            // Try to render OnlineGuide component directly if it's available
            if (window.OnlineGuide && window.React && window.ReactDOM) {
              console.log("FallbackContent - OnlineGuide component found, rendering directly");
              
              try {
                const rootEl = document.getElementById('root');
                if (rootEl) {
                  // Clean up the container
                  rootEl.innerHTML = '';
                  
                  // Render the OnlineGuide component
                  if (window.ReactDOM.createRoot) {
                    window.ReactDOM.createRoot(rootEl).render(
                      window.React.createElement(window.OnlineGuide)
                    );
                  } else if (window.ReactDOM.render) {
                    window.ReactDOM.render(
                      window.React.createElement(window.OnlineGuide),
                      rootEl
                    );
                  }
                }
              } catch (e) {
                console.error("FallbackContent - Error rendering OnlineGuide component:", e);
                loadFullAppBundle(); // Fall back to loading the full app
              }
            } else {
              console.log("FallbackContent - OnlineGuide component not found, loading full app");
              loadFullAppBundle();
            }
          };
          
          guideScript.onerror = function() {
            console.log("FallbackContent - Failed to load OnlineGuide.js, falling back to App.js");
            loadFullAppBundle();
          };
          
          document.body.appendChild(guideScript);
        });
      } else {
        loadFullAppBundle();
      }
    });
  }
  
  // Function to load the full app bundle
  function loadFullAppBundle() {
    console.log("FallbackContent - Loading full app bundle");
    
    // Try loading React etc. first if needed
    if (!window.React || !window.ReactDOM) {
      loadReactDependencies(function() {
        loadAppJs();
      });
    } else {
      loadAppJs();
    }
  }
  
  // Add event listener for reload button
  const reloadPageBtn = container.querySelector('#reloadPageBtn');
  if (reloadPageBtn) {
    reloadPageBtn.addEventListener('click', function() {
      console.log("FallbackContent - Reload page button clicked");
      
      // Clear any cached data before reload
      try {
        // Clear all local and session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force reload of page excluding cache
        window.location.reload(true);
      } catch (e) {
        console.error("Error during page reload:", e);
        window.location.reload(); // Simple reload if clearing fails
      }
    });
  }
}

// Auto-detect if we need to render fallback content
(function() {
  function checkAndRender() {
    console.log("FallbackContent - Checking if fallback content is needed");
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Get current route
      var currentHash = window.location.hash || '#/';
      var isGuiaRoute = currentHash.includes('guia-online') || currentHash === '#/';
      var isBirthPlanRoute = currentHash.includes('criar-plano');
      
      console.log("FallbackContent - Current hash:", currentHash, "Is guide route:", isGuiaRoute, "Is birth plan route:", isBirthPlanRoute);
      
      // Check if App component exists
      var hasAppComponent = typeof window.App !== 'undefined';
      
      // Check if OnlineGuide component exists for guia-online route
      var hasOnlineGuideComponent = typeof window.OnlineGuide !== 'undefined';
      
      console.log("FallbackContent - App component exists:", hasAppComponent, "OnlineGuide component exists:", hasOnlineGuideComponent);
      
      // Only run when we're on a route that should show content
      if (isGuiaRoute || isBirthPlanRoute) {
        console.log("FallbackContent - On a content route, checking if content is present");
        
        var mainContent = document.querySelector('main') || document.getElementById('root');
        
        // If we have a container and it looks like the content isn't fully rendered
        if (mainContent) {
          console.log("FallbackContent - Main content element found. Content:", mainContent.innerHTML);
          
          // Check if content is empty or only has the fallback container itself
          var isEmpty = !mainContent.hasChildNodes() || 
                      mainContent.innerHTML.trim() === '' || 
                      (mainContent.children.length === 1 && mainContent.children[0].className.includes('fallback'));
                      
          var hasOnlySimpleElements = false;
          if (!isEmpty) {
            // Check if the content has actual complex components or only basic HTML
            var contentText = mainContent.innerText;
            hasOnlySimpleElements = !mainContent.querySelector('.min-h-screen.bg-white') &&
                                   !mainContent.querySelector('.max-w-7xl') &&
                                   !mainContent.querySelector('.maternal-900');
          }
          
          // For guia-online routes, check if we have the specific components rendered
          var hasProperGuideContent = mainContent.querySelector('.min-h-screen.bg-white') !== null;
          
          // Check if App component exists but hasn't rendered correctly
          var needsFallback = isEmpty || hasOnlySimpleElements || 
                             (isGuiaRoute && !hasProperGuideContent && !hasOnlineGuideComponent) || 
                             (isBirthPlanRoute && !hasAppComponent);
          
          if (needsFallback) {
            console.log("FallbackContent - Content area needs proper rendering, showing enhanced fallback");
            // Clear any partial content first
            mainContent.innerHTML = '';
            createFallbackContent(mainContent);
          } else {
            console.log("FallbackContent - Content area already has content, no fallback needed");
          }
        } else {
          console.log("FallbackContent - Main content element not found, creating it");
          
          // Create a main element if it doesn't exist
          mainContent = document.createElement('main');
          mainContent.id = 'root';
          document.body.appendChild(mainContent);
          
          createFallbackContent(mainContent);
        }
      } else {
        console.log("FallbackContent - Not on a content route, skipping content check");
      }
    } else {
      console.log("FallbackContent - Document not ready, waiting...");
      setTimeout(checkAndRender, 100);
    }
  }
  
  // Check after a short delay to give the normal content a chance to load
  setTimeout(checkAndRender, 1000);
  
  // Also add a listener for hash changes to potentially render fallback if needed
  window.addEventListener('hashchange', function() {
    console.log("FallbackContent - Hash changed, checking if fallback is needed");
    setTimeout(checkAndRender, 300);
  });
  
  // Check periodically for 10 seconds after load to ensure content appears
  var checkInterval = setInterval(function() {
    checkAndRender();
  }, 2000);
  
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 10000);
})();

// Create a directly accessible method to force triggering the fallback content
window.forceFallbackContent = function() {
  console.log("FallbackContent - Forcing fallback content display");
  const container = document.querySelector('main') || document.getElementById('root');
  if (container) {
    createFallbackContent(container);
  } else {
    console.error("FallbackContent - No suitable container found for forced fallback");
  }
};

// Export the function for non-module environments
if (typeof window !== 'undefined') {
  window.__birthPlanFallback = {
    createFallbackContent: createFallbackContent,
    forceFallback: window.forceFallbackContent
  };
}

// Conditional export for module environments
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      createFallbackContent: createFallbackContent
    };
  }
} catch (e) {
  console.warn("FallbackContent - Module exports not supported in this context");
}
