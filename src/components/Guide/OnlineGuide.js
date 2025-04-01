
// Non-module version of OnlineGuide component for direct loading
console.log("OnlineGuide.js - Non-module version loading");

(function() {
  // Check if already loaded
  if (window.OnlineGuide) {
    console.log("OnlineGuide.js - Component already available, skipping");
    return;
  }
  
  // Simple implementation that can be loaded directly without modules
  function OnlineGuide(props) {
    // Extract props
    var embedded = props && props.embedded === true;
    
    // Check if React is available
    if (!window.React) {
      console.error("OnlineGuide.js - React not available");
      return null;
    }
    
    // Reference to React methods
    var React = window.React;
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useRef = React.useRef;
    
    // State for active tab
    var activeTabState = useState('introduction');
    var activeTab = activeTabState[0];
    var setActiveTab = activeTabState[1];
    
    // Check for current location hash
    var currentHash = window.location.hash.replace('#', '');
    
    // Effect to handle navigation from hash
    useEffect(function() {
      console.log("OnlineGuide.js - useEffect running with location hash:", currentHash);
      if (currentHash && currentHash !== '/guia-online') {
        console.log("OnlineGuide.js - Setting active tab from hash:", currentHash);
        setActiveTab(currentHash);
      }
    }, [currentHash]);
    
    // Handle parent window messages for embedded mode
    useEffect(function() {
      var handleParentMessages = function(event) {
        console.log("OnlineGuide.js - Received message:", event.data);
        if (event.data && event.data.type === 'wix-check') {
          console.log("OnlineGuide.js - Received check from parent, sending response");
          try {
            window.parent.postMessage({ 
              type: 'loaded', 
              source: 'energia-materna-guide',
              height: document.body.scrollHeight
            }, '*');
          } catch (error) {
            console.error("OnlineGuide.js - Error sending load confirmation:", error);
          }
        }
      };
      
      window.addEventListener('message', handleParentMessages);
      return function() {
        window.removeEventListener('message', handleParentMessages);
      };
    }, [embedded]);
    
    // Handle tab change
    var handleTabChange = function(tab) {
      console.log('Tab changed to:', tab);
      setActiveTab(tab);
    };
    
    // Simple tabs implementation
    var renderTabContent = function() {
      switch(activeTab) {
        case 'introduction':
          return React.createElement('div', { className: 'p-4 bg-white rounded-lg shadow' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Introdução ao Plano de Parto'),
            React.createElement('p', { className: 'mb-4' }, 'Um plano de parto é um documento que comunica suas preferências para o trabalho de parto e nascimento.'),
            React.createElement('button', { 
              className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded',
              onClick: function() { handleTabChange('rights'); }
            }, 'Próximo: Seus Direitos')
          );
        case 'rights':
          return React.createElement('div', { className: 'p-4 bg-white rounded-lg shadow' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Seus Direitos no Parto'),
            React.createElement('p', { className: 'mb-4' }, 'Conheça seus direitos durante o trabalho de parto e nascimento.'),
            React.createElement('div', { className: 'flex gap-4' },
              React.createElement('button', { 
                className: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded',
                onClick: function() { handleTabChange('introduction'); }
              }, 'Anterior'),
              React.createElement('button', { 
                className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded',
                onClick: function() { handleTabChange('structure'); }
              }, 'Próximo')
            )
          );
        default:
          return React.createElement('div', { className: 'p-4 bg-white rounded-lg shadow' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Carregando conteúdo...'),
            React.createElement('p', { className: 'mb-4' }, 'Por favor, aguarde enquanto carregamos o conteúdo completo.'),
            React.createElement('button', { 
              className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded',
              onClick: function() { 
                // Try to reload the page
                window.location.reload(); 
              }
            }, 'Recarregar página')
          );
      }
    };
    
    // Main component render
    return React.createElement('div', { className: 'min-h-screen bg-white' },
      !embedded && React.createElement('header', { className: 'bg-blue-50 border-b border-blue-100 p-4' },
        React.createElement('div', { className: 'max-w-7xl mx-auto flex justify-between items-center' },
          React.createElement('div', { className: 'text-xl font-bold text-blue-600' }, 'Energia Materna'),
          React.createElement('nav', { className: 'flex space-x-4' },
            React.createElement('a', { 
              href: '#/guia-online', 
              className: 'text-blue-600 hover:text-blue-800'
            }, 'Guia'),
            React.createElement('a', { 
              href: '#/criar-plano', 
              className: 'text-blue-600 hover:text-blue-800'
            }, 'Criar Plano')
          )
        )
      ),
      React.createElement('main', { className: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6' },
        React.createElement('div', { className: 'mb-6' },
          React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Guia do Parto Respeitoso'),
          React.createElement('p', { className: 'text-lg text-gray-700 mt-2' }, 'Seu guia completo para um plano de parto eficaz')
        ),
        React.createElement('div', { className: 'mb-8' },
          React.createElement('div', { className: 'flex space-x-2 overflow-x-auto border-b border-gray-200' },
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'introduction' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('introduction'); }
            }, 'Introdução'),
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'rights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('rights'); }
            }, 'Seus Direitos'),
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'structure' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('structure'); }
            }, 'Estrutura do Plano'),
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'communication' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('communication'); }
            }, 'Comunicação com a Equipe'),
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'checklist' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('checklist'); }
            }, 'Checklist Essencial'),
            React.createElement('button', { 
              className: 'px-4 py-2 font-medium ' + (activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'),
              onClick: function() { handleTabChange('resources'); }
            }, 'Recursos Adicionais')
          )
        ),
        renderTabContent()
      )
    );
  }
  
  // Register the component globally
  window.OnlineGuide = OnlineGuide;
  console.log("OnlineGuide.js - Component registered successfully");
  
  // Try to auto-render if we're on the correct route
  setTimeout(function() {
    var isGuideRoute = window.location.hash.includes('guia-online') || window.location.hash === '#/';
    var rootEl = document.getElementById('root');
    
    if (isGuideRoute && rootEl && window.React && window.ReactDOM) {
      console.log("OnlineGuide.js - Auto-rendering on guide route");
      
      try {
        if (window.ReactDOM.createRoot) {
          window.ReactDOM.createRoot(rootEl).render(
            window.React.createElement(OnlineGuide)
          );
        } else if (window.ReactDOM.render) {
          window.ReactDOM.render(
            window.React.createElement(OnlineGuide),
            rootEl
          );
        }
      } catch (e) {
        console.error("OnlineGuide.js - Error auto-rendering:", e);
      }
    }
  }, 500);
})();

// Try to support module.exports for compatibility
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      OnlineGuide: window.OnlineGuide
    };
  }
} catch (e) {
  console.warn("OnlineGuide.js - Module exports not supported in this context");
}
