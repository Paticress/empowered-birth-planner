
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
  
  // Determine which content to show based on current route
  var currentRoute = window.location.hash.replace('#', '') || '/';
  console.log("FallbackContent - Current route:", currentRoute);
  
  // Different content based on route
  var content = '';
  
  if (currentRoute.includes('criar-plano')) {
    content = `
      <div class="min-h-screen bg-white p-6">
        <h1 class="text-3xl font-bold mb-4">Construtor de Plano de Parto</h1>
        <p class="mb-6">Seu assistente para criar um plano de parto personalizado</p>
        
        <div class="bg-blue-50 p-4 rounded-md mb-6">
          <h2 class="text-xl font-semibold mb-2">Bem-vinda ao Construtor de Plano de Parto</h2>
          <p>Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.</p>
        </div>
        
        <div class="flex flex-col space-y-4">
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Informações Pessoais</h3>
            <p>Nome, data prevista do parto, local do parto e outras informações essenciais.</p>
          </div>
          
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Preferências do Parto</h3>
            <p>Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.</p>
          </div>
          
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Durante o Nascimento</h3>
            <p>Posições para o parto, corte do cordão umbilical, contato pele a pele e outros momentos do nascimento.</p>
          </div>
          
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Pós-Parto</h3>
            <p>Amamentação, cuidados com o recém-nascido e recuperação materna.</p>
          </div>
          
          <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" onclick="window.location.reload()">
            Tentar Novamente
          </button>
        </div>
      </div>
    `;
  } else if (currentRoute.includes('guia-online') || currentRoute === '/' || currentRoute === '') {
    content = `
      <div class="min-h-screen bg-white p-6">
        <h1 class="text-3xl font-bold mb-4">Guia do Parto Respeitoso</h1>
        <p class="mb-6">Seu guia completo para um plano de parto eficaz</p>
        
        <div class="bg-blue-50 p-4 rounded-md mb-6">
          <h2 class="text-xl font-semibold mb-2">Bem-vinda ao Guia do Parto Respeitoso</h2>
          <p>Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz.</p>
        </div>
        
        <div class="flex flex-col space-y-4">
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">O que é um plano de parto?</h3>
            <p>Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê.</p>
          </div>
          
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Por que criar um plano de parto?</h3>
            <p>Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva.</p>
          </div>
          
          <div class="bg-white p-4 border rounded-md">
            <h3 class="font-semibold mb-2">Como criar seu plano de parto</h3>
            <p>Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades.</p>
            <div class="mt-4">
              <a href="#/criar-plano" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">
                Ir para o Construtor de Plano de Parto
              </a>
            </div>
          </div>
          
          <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" onclick="window.location.reload()">
            Tentar Novamente
          </button>
        </div>
      </div>
    `;
  } else {
    content = `
      <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="text-center p-8">
          <h1 class="text-4xl font-bold mb-4">Página não encontrada</h1>
          <p class="mb-6">A página que você está procurando não existe ou foi movida.</p>
          <a href="#/guia-online" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">
            Voltar para o Guia
          </a>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = content;
  console.log("FallbackContent - Content rendered successfully");
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
      
      // Only run when we're on a route that should show content
      if (isGuiaRoute || isBirthPlanRoute) {
        console.log("FallbackContent - On a content route, checking if content is present");
        
        var mainContent = document.querySelector('main') || document.getElementById('root');
        
        // If we have a container and it's empty, render fallback content
        if (mainContent) {
          console.log("FallbackContent - Main content element found. Content:", mainContent.innerHTML);
          
          if (!mainContent.hasChildNodes() || mainContent.innerHTML.trim() === '' || mainContent.innerText.trim() === '') {
            console.log("FallbackContent - Content area is empty, rendering fallback");
            createFallbackContent(mainContent);
          } else {
            console.log("FallbackContent - Content area already has content, no fallback needed");
          }
        } else {
          console.log("FallbackContent - Main content element not found");
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
})();

// Export the function for non-module environments
if (typeof window !== 'undefined') {
  window.__birthPlanFallback = {
    createFallbackContent: createFallbackContent
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
