
// Simple birth plan builder for compatibility mode
console.log("SimpleBirthPlanBuilder loaded");

/**
 * Simple birth plan builder that provides a basic UI when the full component fails to load
 */
function SimpleBirthPlanBuilder() {
  // Check if we have React available
  var React = window.React;
  if (!React) {
    console.error("SimpleBirthPlanBuilder - React not available");
    return null;
  }
  
  return React.createElement('div', { className: "min-h-screen bg-white p-6" },
    React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Construtor de Plano de Parto"),
    React.createElement('p', { className: "mb-6" }, "Seu assistente para criar um plano de parto personalizado"),
    
    React.createElement('div', { className: "bg-blue-50 p-4 rounded-md mb-6" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Bem-vinda ao Construtor de Plano de Parto"),
      React.createElement('p', null, "Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.")
    ),
    
    React.createElement('div', { className: "flex flex-col space-y-4" },
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Informações Pessoais"),
        React.createElement('p', null, "Nome, data prevista do parto, local do parto e outras informações essenciais.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Preferências do Parto"),
        React.createElement('p', null, "Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Durante o Nascimento"),
        React.createElement('p', null, "Posições para o parto, corte do cordão umbilical, contato pele a pele e outros momentos do nascimento.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Pós-Parto"),
        React.createElement('p', null, "Amamentação, cuidados com o recém-nascido e recuperação materna.")
      ),
      
      React.createElement('div', { className: "mt-6" }, 
        React.createElement('p', { className: "text-sm text-gray-600" }, 
          "Se o conteúdo não estiver carregando completamente, tente recarregar a página.",
          React.createElement('button', {
            className: "ml-2 text-blue-600 underline",
            onClick: function() { window.location.reload(); }
          }, "Recarregar")
        )
      )
    )
  );
}

/**
 * Simple guide component as a fallback
 */
function SimpleGuide() {
  // Check if we have React available
  var React = window.React;
  if (!React) {
    console.error("SimpleBirthPlanBuilder - React not available for SimpleGuide");
    return null;
  }
  
  return React.createElement('div', { className: "min-h-screen bg-white p-6" },
    React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Guia do Parto Respeitoso"),
    React.createElement('p', { className: "mb-6" }, "Seu guia completo para um plano de parto eficaz"),
    
    React.createElement('div', { className: "bg-blue-50 p-4 rounded-md mb-6" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Bem-vinda ao Guia do Parto Respeitoso"),
      React.createElement('p', null, "Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz.")
    ),
    
    React.createElement('div', { className: "flex flex-col space-y-4" },
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "O que é um plano de parto?"),
        React.createElement('p', null, "Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Por que criar um plano de parto?"),
        React.createElement('p', null, "Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Como criar seu plano de parto"),
        React.createElement('p', null, "Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades."),
        React.createElement('div', { className: "mt-4" },
          React.createElement('a', {
            href: "#/criar-plano",
            className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          }, "Ir para o Construtor de Plano de Parto")
        )
      ),
      
      React.createElement('div', { className: "mt-6" }, 
        React.createElement('p', { className: "text-sm text-gray-600 text-center" }, 
          "Se o conteúdo não estiver carregando completamente, tente recarregar a página. ",
          React.createElement('button', {
            className: "text-blue-600 underline",
            onClick: function() { window.location.reload(); }
          }, "Recarregar")
        )
      )
    )
  );
}

// Auto-render the component if we detect we're on the criar-plano route and the page is empty
(function() {
  // Wait for DOM to be ready
  function checkAndRender() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Get the current hash route
      var currentHash = window.location.hash || '#/';
      console.log("SimpleBirthPlanBuilder - detected route:", currentHash);
      
      // Check if we're on the criar-plano or guide route
      var isCreatorRoute = currentHash.includes('criar-plano');
      var isGuideRoute = currentHash.includes('guia-online') || currentHash === '#/';
      
      if (isCreatorRoute || isGuideRoute) {
        console.log("SimpleBirthPlanBuilder - on a content route, checking if render is needed");
        
        // Check if the main content area is empty
        var mainContent = document.querySelector('main') || document.getElementById('root');
        
        if (mainContent && (!mainContent.hasChildNodes() || mainContent.innerHTML.trim() === '' || mainContent.innerText.trim() === '')) {
          console.log("SimpleBirthPlanBuilder - main content is empty, attempting to render");
          
          if (window.React && window.ReactDOM) {
            var container = document.createElement('div');
            container.className = 'fallback-birth-plan-container';
            mainContent.appendChild(container);
            
            // Render the appropriate component
            var componentToRender = isCreatorRoute ? SimpleBirthPlanBuilder : SimpleGuide;
            
            try {
              if (window.ReactDOM.createRoot) {
                window.ReactDOM.createRoot(container).render(window.React.createElement(componentToRender));
              } else {
                window.ReactDOM.render(window.React.createElement(componentToRender), container);
              }
              
              console.log("SimpleBirthPlanBuilder - component rendered successfully");
            } catch (error) {
              console.error("SimpleBirthPlanBuilder - Error rendering with React:", error);
              
              // Fall back to FallbackContent
              if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
                window.__birthPlanFallback.createFallbackContent(mainContent);
              }
            }
          } else {
            console.log("SimpleBirthPlanBuilder - React or ReactDOM not available, using FallbackContent");
            if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
              window.__birthPlanFallback.createFallbackContent(mainContent);
            }
          }
        } else {
          console.log("SimpleBirthPlanBuilder - content already exists, no need to render fallback");
        }
      }
    } else {
      setTimeout(checkAndRender, 100);
    }
  }
  
  // First check after a short delay
  setTimeout(checkAndRender, 500);
  
  // Also check when hash changes
  window.addEventListener('hashchange', function() {
    console.log("SimpleBirthPlanBuilder - hash changed, checking if render is needed");
    setTimeout(checkAndRender, 300);
  });
})();

// Export for non-module contexts
if (typeof window !== 'undefined') {
  window.__simpleBirthPlanBuilder = {
    SimpleBirthPlanBuilder: SimpleBirthPlanBuilder,
    SimpleGuide: SimpleGuide
  };
}

// Try to support module.exports for compatibility
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      SimpleBirthPlanBuilder: SimpleBirthPlanBuilder,
      SimpleGuide: SimpleGuide
    };
  }
} catch (e) {
  console.warn("Module exports not supported in this context");
}
